# Generated by Django 2.2.15 on 2020-12-18 18:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0134_auto_20201218_1131'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='user',
            unique_together={('email', 'company')},
        ),
    ]
