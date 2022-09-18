# Generated by Django 2.0.5 on 2020-04-06 23:18

from django.db import migrations, models


def make_many_companies(apps, schema_editor):
    # Add old company field data to new companies field
    User = apps.get_model('dashboard', 'User')
    db_alias = schema_editor.connection.alias
    for user in User.objects.using(db_alias).all():
        if user.company:
            user.companies.add(user.company)


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0105_auto_20200406_1716'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='7HUHvQiPBgjXRahlRB4W8s586zPeSezqCiwKOSEU45ncN847ucnB7oP9cwxf9FIX6JOqBWhiAAT'),
        ),
        migrations.RunPython(make_many_companies),
    ]
