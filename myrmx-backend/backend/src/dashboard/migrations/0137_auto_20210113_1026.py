# Generated by Django 2.2.15 on 2021-01-13 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0136_auto_20201230_0952'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='slider_for_competency_assessment',
            field=models.BooleanField(default=False),
        ),
    ]
