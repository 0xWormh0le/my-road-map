# Generated by Django 2.0.5 on 2019-11-10 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0077_auto_20191109_2306'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionanswer',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='WK4IwdKhqxslAFkiGbPSJPjwBXsAQIuAtFi3Tu6mfSCUjFKNfAULpx3sxALHgxyXnD5QXSvvx2l'),
        ),
        migrations.AlterField(
            model_name='questionglobal',
            name='description',
            field=models.TextField(blank=True, max_length=1024),
        ),
    ]
