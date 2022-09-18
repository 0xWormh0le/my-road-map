from django.urls import path

from notifications import views

app_name = 'notifications'
urlpatterns = [
    path('', views.all, name='notifications_all'),
    path('ajax/', views.get_notifications_ajax, name='get_notifications_ajax'),
    path('<int:id>/', views.read, name='notifications_read'),
]

