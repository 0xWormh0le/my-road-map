from django.db.models.expressions import RawSQL
from django_filters import rest_framework as rest_framework_filters
from rest_framework.filters import OrderingFilter

from dashboard.models import Assessment


class UsersViewsetOrderingFilter(OrderingFilter):
    red_assessments_count_ordering_key = 'red_assessments_count'
    max_progress_ordering_key = 'max_progress'

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        if ordering:
            rac_order_expr_idx = self._get_ordering_expr_index(self.red_assessments_count_ordering_key, ordering)
            if rac_order_expr_idx >= 0:
                rac_order_expr = ordering.pop(rac_order_expr_idx)
                queryset = queryset.annotate(
                    red_assessments_count=RawSQL(
                        """WITH assessment_summary AS (
                            SELECT p.id, p.competency_id, p.status, p.student_id,
                                ROW_NUMBER() OVER(PARTITION BY p.competency_id, p.student_id ORDER BY p.id DESC) AS rn
                            FROM dashboard_assessment p
                            WHERE status = '1'
                        ) SELECT count(*) FROM assessment_summary where rn = 1 and student_id = dashboard_user.id""",
                        tuple(),
                    )
                ).order_by(rac_order_expr)
            mp_order_expr_idx = self._get_ordering_expr_index(self.max_progress_ordering_key, ordering)
            if mp_order_expr_idx >= 0:
                mp_order_expr = ordering.pop(mp_order_expr_idx)
                queryset = queryset.annotate(
                    max_progress=RawSQL(
                        """WITH roadmap_progress AS (
                            WITH assessment_summary AS (
                                SELECT p.id, p.competency_id, p.status, p.student_id, ds.roadmap_id,
                                    ROW_NUMBER() OVER (PARTITION BY p.competency_id, p.student_id ORDER BY p.id DESC) AS rn
                                FROM dashboard_assessment p
                                    INNER JOIN dashboard_competency dc on p.competency_id = dc.id
                                    INNER JOIN dashboard_stage ds on dc.stage_id = ds.id
                            )
                            SELECT roadmap_id, student_id, sum(status) as progress
                            FROM assessment_summary
                            WHERE rn = 1
                            GROUP BY roadmap_id, student_id
                        ), roadmap_max_progress AS (
                            SELECT roadmap_id, count(*) * 3 as max_progress
                            FROM dashboard_competency dc
                            INNER JOIN dashboard_stage ds on dc.stage_id = ds.id
                            GROUP BY ds.roadmap_id
                        ) SELECT max(rp.progress / rmp.max_progress)
                        FROM roadmap_progress rp
                        INNER JOIN roadmap_max_progress rmp ON rmp.roadmap_id = rp.roadmap_id
                        WHERE student_id = dashboard_user.id""",
                        tuple(),
                    )
                ).order_by(mp_order_expr)
            if ordering:
                return queryset.order_by(*ordering)

        return queryset

    @staticmethod
    def _get_ordering_expr_index(expr, ordering):
        order_expr_idx = -1
        if expr in ordering:
            order_expr_idx = ordering.index(expr)
        elif f'-{expr}' in ordering:
            order_expr_idx = ordering.index(f'-{expr}')
        return order_expr_idx


class AssessmentFilter(rest_framework_filters.FilterSet):
    min_date = rest_framework_filters.DateFilter(field_name="date", lookup_expr='gte')
    max_date = rest_framework_filters.DateFilter(field_name="date", lookup_expr='lte')

    class Meta:
        model = Assessment
        fields = ['student', 'status', 'user', 'min_date', 'max_date']
