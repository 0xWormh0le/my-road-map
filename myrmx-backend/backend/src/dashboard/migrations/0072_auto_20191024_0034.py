# Generated by Django 2.0.5 on 2019-10-24 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0071_auto_20191024_0004'),
    ]

    operations = [
        migrations.AddField(
            model_name='actionitemassessment',
            name='send_follow_up_email_on_due_date',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='5Jb0fDZLj5Y0XjIqc6bVhAZqCYrWjwpoXjF1QMDH4TTDsvwg3FBeD2V09vHW3J0BlUTlnO4nb9v'),
        ),
    ]
