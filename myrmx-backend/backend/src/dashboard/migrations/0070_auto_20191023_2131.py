# Generated by Django 2.0.5 on 2019-10-24 03:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0069_auto_20191023_2117'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='RoadmapAssignments',
            new_name='RoadmapAssignment',
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='9DURzXqStRph9vRTt4qfI5BeXkNxgVDrpD1oL77XWSFVBxbmtU9115RoT1xADXKscDz5KK2KLEZ'),
        ),
    ]
