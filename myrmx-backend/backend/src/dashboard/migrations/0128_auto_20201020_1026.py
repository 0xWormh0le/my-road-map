# Generated by Django 2.2.15 on 2020-10-20 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0127_auto_20200907_1203'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='name',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]
