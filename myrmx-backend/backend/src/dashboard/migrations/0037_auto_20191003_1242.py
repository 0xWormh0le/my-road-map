# Generated by Django 2.0.5 on 2019-10-03 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0036_roadmap_icon'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='only_coach_asssigns_roadmaps',
            new_name='coach_can_asssign_roadmaps',
        ),
        migrations.AddField(
            model_name='company',
            name='user_can_asssign_roadmaps',
            field=models.BooleanField(default=False),
        ),
    ]
