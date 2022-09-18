# Generated by Django 2.0.5 on 2019-11-10 06:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0076_auto_20191109_1025'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.TextField(blank=True, max_length=1024, null=True)),
                ('competency', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.Competency')),
            ],
        ),
        migrations.CreateModel(
            name='QuestionGlobal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=1024)),
                ('question', models.TextField(max_length=1024)),
                ('order', models.IntegerField(default=0)),
                ('competency', models.ForeignKey(limit_choices_to={'student': None}, on_delete=django.db.models.deletion.CASCADE, to='dashboard.Competency')),
            ],
            options={
                'verbose_name': 'Question',
                'verbose_name_plural': 'Questions',
            },
        ),
        migrations.AlterField(
            model_name='attachment',
            name='attachment',
            field=models.FileField(blank=True, upload_to='9nUVxXtM7WmAvxQbiQOyKGWkyVNC3gZ805eCADbmbCcw9pfjeZ97aqw5M7FNikmD7x4X6iFW4mJ'),
        ),
        migrations.AddField(
            model_name='questionanswer',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.QuestionGlobal'),
        ),
        migrations.AddField(
            model_name='questionanswer',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='questionanswer',
            unique_together={('student', 'parent')},
        ),
    ]
