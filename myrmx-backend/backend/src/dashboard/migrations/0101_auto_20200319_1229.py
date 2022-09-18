# Generated by Django 2.0.5 on 2020-03-19 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0100_auto_20200310_2058'),
    ]

    operations = [
        migrations.AddField(
            model_name='competency',
            name='daily_assessment_green',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AddField(
            model_name='competency',
            name='daily_assessment_question',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AddField(
            model_name='competency',
            name='daily_assessment_red',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AddField(
            model_name='competency',
            name='daily_assessment_yellow',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='RZlJYz2gIGCcxT4o040zCiJxGih8hVl20fLRha3lzqIFyEngDqzGVVd2hlU41tsQiMbLFSoJEoJ'),
        ),
    ]
