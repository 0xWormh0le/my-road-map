from django.contrib import admin

# Register your models here.
from .models import Notification

class NotificationsAdmin(admin.ModelAdmin):
    ordering = ('recipient', )
    list_display = ('recipient','recipient_id','timestamp','verb')
    search_fields = ('recipient__username','recipient__id',)

admin.site.register(Notification, NotificationsAdmin)
