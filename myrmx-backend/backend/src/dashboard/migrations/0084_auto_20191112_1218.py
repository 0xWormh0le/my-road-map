# Generated by Django 2.0.5 on 2019-11-12 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0083_auto_20191112_1154'),
    ]

    operations = [
        migrations.AddField(
            model_name='roadmap',
            name='simplified_ai',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='atBdVF99qkHNzCD6RT58NkgwYVGqleSzzFMIKSeWNkJ4I94r3BOWzYsbKWhldRAUMEbuYkPrYqC'),
        ),
    ]
