# Generated by Django 2.2.15 on 2020-11-27 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0129_attachment_file_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='default_theme',
            field=models.CharField(blank=True, choices=[('light', 'Light'), ('dark', 'Dark'), ('blue-ocean', 'Blue Ocean')], max_length=32),
        ),
    ]
