# restore roadmap from backup database

from dashboard.models import Roadmap

roadmap_id = 264
r = Roadmap.objects.using('backup').get(pk=roadmap_id)
r.save(using='default')

stages = [stage for stage in r.stage_set.all()]

for stage in stages:
    comps = [c for c in stage.competency_set.all()]
    stage.save(using='default')
    print('saving stage', stage.id)
    for comp in comps:
        action_items = [a for a in comp.actionitemglobal_set.all()]
        attachments = [a for a in comp.attachments.all()]
        comp.save(using='default')
        print('saving comp', comp.id)
        for actionitem in action_items:
            actionitem.save(using='default')
            print('saving actionitem', actionitem.id)
        for attachment in attachments:
            attachment.save(using='default')
            print('saving attachment', attachment.id)
