from django.urls import path
from rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework.schemas import get_schema_view

from api.routers import HybridRouter
from api.views import (
    LoginWithoutAuthView, LogoutWithAuthView, RoadmapsViewSet, RoadmapStagesViewSet, RoadmapStageCompetenciesViewSet,
    RoadmapStageCompetencyCommentsViewSet, RoadmapStageCompetencyGlobalActionItemsViewSet,
    CurrentUserNotificationsViewSet, UsersViewSet, RoadmapStageCompetencyAssessmentsViewSet,
    RoadmapStageCompetencyActionItemAssessmentsViewSet, UserProfileAPIView, UpdatesAPIView, SignUpAPIView,
    RecentCompetenciesViewSet, MessageRecipientsAPIView, PeerLastReadMessageTimestampsViewSet,
    GenerateAgoraRTMTokenAPIView, PeerToPeerConversationsViewSet, PeerToPeerConversationMessagesViewSet,
    UnsubscribeUserView, AssignedRoadmapsViewSet, ArchivedRoadmapsViewSet, AvailableRoadmapsViewSet,
    ChooseActiveCompanyAPIView, CohortViewSet, InviteCoachView, AcceptCoachInvitationView, RemoveCoachAPIView,
    AssignedCoachesViewSet, AvailableCoachesViewSet, RoadmapStageCompetencyNotesViewSet, CohortUsersViewSet,
    CKEditorUploadAPIView, RoadmapStageCompetencyGlobalQuestionsViewSet, RoadmapStageCompetencyQuestionAnswersViewSet,
)


app_name = 'api'

router = HybridRouter()

router.add_url(path('auth/login/', LoginWithoutAuthView.as_view(), name='login'))
router.add_url(path('auth/logout/', LogoutWithAuthView.as_view(), name='logout'))
router.add_url(path('auth/password-reset/', PasswordResetView.as_view(), name='password-reset'))
router.add_url(path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'))
router.add_url(path('auth/sign-up/', SignUpAPIView.as_view(), name='sign-up'))
router.add_url(path('openapi/', get_schema_view(
    title='MyRoadmap API',
    urlconf='api.urls',
    version='1.0',
), name='openapi'))

roadmaps_routes = \
    router.register(r'roadmaps', RoadmapsViewSet, basename=RoadmapsViewSet.serializer_class.DEFAULT_BASE_NAME)

roadmap_nested_items_viewset_parent_query_lookups = ['roadmap']

roadmaps_routes.register(r'assigned-coaches', AssignedCoachesViewSet,
                         basename=AssignedCoachesViewSet.serializer_class.ASSIGNED_COACH_BASE_NAME,
                         parents_query_lookups=roadmap_nested_items_viewset_parent_query_lookups)
roadmaps_routes.register(r'available-coaches', AvailableCoachesViewSet,
                         basename=AvailableCoachesViewSet.serializer_class.AVAILABLE_COACH_BASE_NAME,
                         parents_query_lookups=roadmap_nested_items_viewset_parent_query_lookups)

competency_routes = roadmaps_routes\
    .register(r'stages', RoadmapStagesViewSet, basename=RoadmapStagesViewSet.serializer_class.DEFAULT_BASE_NAME,
              parents_query_lookups=roadmap_nested_items_viewset_parent_query_lookups)\
    .register(r'competencies', RoadmapStageCompetenciesViewSet,
              basename=RoadmapStageCompetenciesViewSet.serializer_class.DEFAULT_BASE_NAME,
              parents_query_lookups=['stage__roadmap', 'stage'])

competency_nested_items_viewset_parent_query_lookups = ['competency__stage__roadmap', 'competency__stage', 'competency']

competency_routes.register(
    r'comments', RoadmapStageCompetencyCommentsViewSet,
    basename=RoadmapStageCompetencyCommentsViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'global-action-items', RoadmapStageCompetencyGlobalActionItemsViewSet,
    basename=RoadmapStageCompetencyGlobalActionItemsViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'assessments', RoadmapStageCompetencyAssessmentsViewSet,
    basename=RoadmapStageCompetencyAssessmentsViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'action-item-assessments', RoadmapStageCompetencyActionItemAssessmentsViewSet,
    basename=RoadmapStageCompetencyActionItemAssessmentsViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'notes', RoadmapStageCompetencyNotesViewSet,
    basename=RoadmapStageCompetencyNotesViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'global-questions', RoadmapStageCompetencyGlobalQuestionsViewSet,
    basename=RoadmapStageCompetencyGlobalQuestionsViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)
competency_routes.register(
    r'question-answers', RoadmapStageCompetencyQuestionAnswersViewSet,
    basename=RoadmapStageCompetencyQuestionAnswersViewSet.serializer_class.DEFAULT_BASE_NAME,
    parents_query_lookups=competency_nested_items_viewset_parent_query_lookups)

router.register(r'notifications', CurrentUserNotificationsViewSet,
                basename=CurrentUserNotificationsViewSet.serializer_class.DEFAULT_BASE_NAME)

users_routes = router.register(r'users', UsersViewSet, basename=UsersViewSet.COMMON_BASE_NAME)

user_nested_items_viewset_parent_query_lookups = ['student']

users_routes.register(r'assigned-roadmaps', AssignedRoadmapsViewSet,
                      basename=AssignedRoadmapsViewSet.serializer_class.ASSIGNED_ROADMAP_BASE_NAME,
                      parents_query_lookups=user_nested_items_viewset_parent_query_lookups)
users_routes.register(r'archived-roadmaps', ArchivedRoadmapsViewSet,
                      basename=ArchivedRoadmapsViewSet.serializer_class.ARCHIVED_ROADMAP_BASE_NAME,
                      parents_query_lookups=user_nested_items_viewset_parent_query_lookups)
users_routes.register(r'available-roadmaps', AvailableRoadmapsViewSet,
                      basename=AvailableRoadmapsViewSet.serializer_class.AVAILABLE_ROADMAP_BASE_NAME,
                      parents_query_lookups=user_nested_items_viewset_parent_query_lookups)

router.register(r'recent-competencies', RecentCompetenciesViewSet,
                basename=RecentCompetenciesViewSet.serializer_class.DEFAULT_BASE_NAME)

router.register(r'messages/peer-last-read-message-timestamps', PeerLastReadMessageTimestampsViewSet,
                basename='peer-last-read-message-timestamp')
router.register(r'messages/conversations', PeerToPeerConversationsViewSet, basename='conversation')\
    .register(r'messages', PeerToPeerConversationMessagesViewSet, basename='conversation-message',
              parents_query_lookups=['peer_id'])

router.register(r'cohorts', CohortViewSet, basename=CohortViewSet.serializer_class.DEFAULT_BASE_NAME)\
    .register(r'users', CohortUsersViewSet, basename=CohortViewSet.serializer_class.COHORT_USERS_BASE_NAME,
              parents_query_lookups=['cohort'])

# TODO: Rework /profile into viewset and add /choose-active-company & /remove-coach as ad-hoc actions
router.add_url(path('profile/', UserProfileAPIView.as_view(), name='profile'))
router.add_url(path('choose-active-company/', ChooseActiveCompanyAPIView.as_view(), name='choose-active-company'))
router.add_url(path('updates/', UpdatesAPIView.as_view(), name='updates'))
router.add_url(path('messages/recipients/', MessageRecipientsAPIView.as_view(), name='messages-recipients'))
router.add_url(path('messages/get-rtm-token/', GenerateAgoraRTMTokenAPIView.as_view(), name='messages-get-rtm-token'))
router.add_url(path('unsubscribe/', UnsubscribeUserView.as_view(), name='unsubscribe'))
router.add_url(path('invite-coach/', InviteCoachView.as_view(), name='invite-coach'))
router.add_url(path('accept-coach-invitation/', AcceptCoachInvitationView.as_view(), name='accept-coach-invitation'))
router.add_url(path('remove-coach/', RemoveCoachAPIView.as_view(), name='remove-coach'))
router.add_url(path('ckeditor/upload/', CKEditorUploadAPIView.as_view(), name='ckeditor-upload'))

urlpatterns = router.urls
