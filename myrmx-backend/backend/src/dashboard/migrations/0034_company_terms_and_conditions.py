# Generated by Django 2.0.5 on 2019-09-24 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0033_company_coach_synonym'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='terms_and_conditions',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
