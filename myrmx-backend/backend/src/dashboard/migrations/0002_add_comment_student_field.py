from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def fix_stuff(apps, schema_editor):
    Comment = apps.get_model('dashboard', 'Comment')
    Competency = apps.get_model('dashboard', 'Competency')
    db_alias = schema_editor.connection.alias
    for comment in Comment.objects.using(db_alias).filter(student_id=1):
        # populate student_id
        comment.student_id = comment.competency.student_id
        if comment.competency.parent:
            comment.competency = comment.competency.parent
        comment.save()

    for competency in Competency.objects.using(db_alias).filter(student_id__isnull=False):
        # change action items to point to parent competency and delete copies
        if competency.parent:
            for action_item in competency.actionitemassessment_set.all():
                action_item.competency = competency.parent
                action_item.save()
            competency.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='student',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.RunPython(fix_stuff),
    ]
