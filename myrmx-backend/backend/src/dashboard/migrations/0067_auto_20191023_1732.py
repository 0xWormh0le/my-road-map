# Generated by Django 2.0.5 on 2019-10-23 23:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0066_auto_20191023_1731'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoadmapAssignments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_assigned', models.DateTimeField()),
                ('roadmap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='roadmap_assignment', to='dashboard.Roadmap')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_assignment', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='feC8nvnL5AMeL6YkA01kS0Ac2M2yU4UZ53F6pez7FMuts0Kx2cErOlfkj2sIpjmIxPaa1OnqeVE'),
        ),
    ]