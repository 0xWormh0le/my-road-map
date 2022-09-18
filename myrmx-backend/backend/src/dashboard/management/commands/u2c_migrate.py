import uuid

from django.core.management.base import BaseCommand
from django.db import connection, transaction

from dashboard.models import AssignedCompany, User, AssignedRoadmap


class Command(BaseCommand):
    help = 'Create user records to replace AssignedCompany records'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("""
                select dac.id, du1.id from dashboard_assignedcompany dac
                inner join dashboard_user_assigned_companies duac on dac.id = duac.assignedcompany_id
                inner join dashboard_user du1 on duac.user_id = du1.id
                inner join dashboard_company dc on dac.company_id = dc.id
                left outer join dashboard_user du2 on du1.email = du2.email and dac.company_id = du2.company_id
                where du2.id is null and du1.email is not null;""")
            results = cursor.fetchall()
        self.stdout.write(f'Found {len(results)} AssignedCompany records to create user accounts for')
        with transaction.atomic():
            for ac_id, usr_id in results:
                ac = AssignedCompany.objects.get(pk=ac_id)
                usr = User.objects.get(pk=usr_id)
                company_roadmaps = list(usr.roadmaps.filter(company_id=ac.company_id))
                company_coaches = list(usr.coach.filter(company_id=ac.company_id))
                company_assigned_roadmaps = list(usr.assigned_roadmaps.filter(roadmap__company_id=ac.company_id))
                company_archived_roadmaps = list(usr.archived_roadmaps.filter(company_id=ac.company_id))
                usr.pk = None
                usr.username = str(uuid.uuid4())
                usr.company_id = ac.company_id
                usr.is_approved = ac.is_approved
                usr.save()
                usr.groups.add(*ac.groups.all())
                usr.cohort.add(*ac.cohort.all())
                usr.roadmaps.add(*company_roadmaps)
                usr.coach.add(*company_coaches)
                usr.assigned_roadmaps.add(*company_assigned_roadmaps)
                usr.archived_roadmaps.add(*company_archived_roadmaps)
                for assigned_roadmap in company_assigned_roadmaps:
                    assigned_roadmap.student = usr
                    assigned_roadmap.save()
                AssignedRoadmap.objects.filter(coach_id=usr_id).update(coach=usr)
                usr = User.objects.get(pk=usr_id)
                usr.roadmaps.remove(*company_roadmaps)
                usr.coach.remove(*company_coaches)
                usr.assigned_roadmaps.remove(*company_assigned_roadmaps)
                usr.archived_roadmaps.remove(*company_archived_roadmaps)
        if len(results) > 0:
            self.stdout.write(f'Successfully created {len(results)} user records as replacement for AssignedCompany')
