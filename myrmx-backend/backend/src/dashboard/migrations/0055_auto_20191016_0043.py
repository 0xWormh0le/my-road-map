# Generated by Django 2.0.5 on 2019-10-16 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0054_auto_20191016_0037'),
    ]

    operations = [
        migrations.AddField(
            model_name='roadmap',
            name='cohorts',
            field=models.ManyToManyField(blank=True, related_name='cohorts', to='dashboard.Cohort'),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='49438q9R1sL59LLfOzNBjljuHyquubo7R26WTXrACXbWjNbVN0kFCUCqUfXcYzFwKBmeKImfO9Y'),
        ),
    ]