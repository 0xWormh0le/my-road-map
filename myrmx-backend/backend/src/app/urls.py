from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.urls import path

from dashboard.forms import MessageWriteForm, CustomPasswordResetForm, CustomPasswordResetConfirmForm
from dashboard.views import (
    DashboardPostmanWriteView, DashboardPasswordResetView, DashboardPasswordResetConfirmView,
    DashboardNewAccountPasswordResetConfirmView, revroad_stats, DashboardPasswordResetDoneView,
)
from login.views import auth_login2, email_signup, welcome
from postman.views import ReplyView
from signup.views import CohortSignupView

from ckeditor_uploader import views as ckeditor_views

handler404 = 'dashboard.views.handler404'
handler500 = 'dashboard.views.handler500'

urlpatterns = [
    path('', include('dashboard.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', include('boolean_switch.urls')),
    path('admin/', admin.site.urls),
    path('signup/', include('signup.urls')),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('password-reset/', DashboardPasswordResetView.as_view(form_class=CustomPasswordResetForm), name='password_reset'),
    path('password-reset/done/', DashboardPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', DashboardPasswordResetConfirmView.as_view(form_class=CustomPasswordResetConfirmForm, post_reset_login=True), name='password_reset_confirm'),
    path('reset/new/<uidb64>/<token>/', DashboardNewAccountPasswordResetConfirmView.as_view(form_class=CustomPasswordResetConfirmForm, post_reset_login=True), name='password_reset_confirm_new_account'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('welcome/', welcome, name='welcome'),

    path('ckeditor/upload/', login_required(ckeditor_views.upload), name='ckeditor_upload'),
    path('ckeditor/browse/', login_required(ckeditor_views.browse), name='ckeditor_browse'),

    #Login Routes
    path('login/', auth_login2, name='login'),
    path('email-signup/', email_signup, name='email_signup'),

    url(r'^messages/write/(?:(?P<recipients>[^/#]+)/)?$', DashboardPostmanWriteView.as_view(form_classes=(MessageWriteForm, None)), name='write'),
    path('messages/reply/<int:message_id>/', ReplyView.as_view(success_url='postman:sent'), name='reply'),
    path('messages/', include('postman.urls', namespace='postman')),

    path('notifications/', include('notifications.urls')),

    path('revroad-stats/', revroad_stats),

    path('<str:signup_url>/', CohortSignupView.as_view(), name='cohort-signup'),

    path('api/v1/', include('api.urls')),
]
