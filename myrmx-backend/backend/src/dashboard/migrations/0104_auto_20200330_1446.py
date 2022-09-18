# Generated by Django 2.0.5 on 2020-03-30 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0103_auto_20200323_1737'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='users_can_assign_specific_coaches',
            new_name='users_can_assign_specific_coaches_for_specific_roadmaps',
        ),
        migrations.AddField(
            model_name='company',
            name='app_welcome_message',
            field=models.TextField(blank=True, default='Select a Roadmap below to get started.', max_length=2048, null=True),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='1zoM2rElylZpdXFyRKAjOK1qWnR91eaLRlld0BGX3xQw0WiiJmcuQ0Kp7NWvFWrq5MuIG5dYMBi'),
        ),
    ]
