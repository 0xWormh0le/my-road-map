import datetime
import random

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

from faker import Faker

from dashboard.models import Assessment, Company, Competency, Cohort, Roadmap, Stage, User

class Command(BaseCommand):
    help = 'Seed the datas'

    def create_roadmap(self, title, description, company):
        print('Creating roadmap:', title)
        roadmap = Roadmap.objects.create(title=title, description=description, company=company)
        print('Creating stages for', title)
        for stage_num in range(1, 4):
            stage = Stage.objects.create(title='Stage {}'.format(stage_num), order=stage_num, roadmap=roadmap)
            print('Creating competencies for', stage.title)
            for competency_num in range(1, 5):
                competency = Competency.objects.create(
                    title='Stage {} Objective {}'.format(stage_num, competency_num),
                    red_description='Do some preliminary research.',
                    yellow_description='Expand on the preliminary research and do some intermediary research.',
                    green_description='Expand on the preliminary and intermediary research and do some advanced research and implement the solution.',
                    description='Competency description here',
                    content='Some content',
                    stage=stage,
                )
        return roadmap

    def add_assessments(self, user, roadmap, assessments):
        competencies = set()
        for i in range(0, 10):
            competency = random.choice(random.choice(roadmap.stage_set.all()).competency_set.all())
            if competency not in competencies:
                competencies.add(competency)
                assessments.append(Assessment(
                    student=user,
                    user=user,
                    competency=competency,
                    status=random.randint(1, 3),
                    date=datetime.date.today(),
                    comment='',
                    approved=False,
                ))

    def handle(self, *args, **options):
        fake = Faker()
        print('Creating superuser...')
        super_user = User.objects.create_superuser('super', 'super@myroadmap.io', '123', first_name='Super', last_name='User', is_approved=True, unsubscribed=True)

        print('Creating groups...')
        user_group = Group.objects.create(name='User')
        coach_group = Group.objects.create(name='Coach')
        admin_group = Group.objects.create(name='Admin')

        print('Creating MyRoadmap root Company...')
        root_company = Company.objects.create(name='MyRoadmap')

        self.create_roadmap(title='Entrepreneurship Template', description='Roadmap for entrepreneurship progression', company=root_company)
        self.create_roadmap(title='Personal Finance Template', description='Roadmap for personal finance progression', company=root_company)

        print('Creating MyRoadmap root users...')
        admin = User.objects.create_user('admin@myroadmap.io', email='admin@myroadmap.io', password='123', first_name='Admin', last_name='User', company=root_company, is_approved=True, unsubscribed=True)
        admin.groups.add(admin_group)
        admin.groups.add(coach_group)
        admin.groups.add(user_group)

        user = User.objects.create_user('user@myroadmap.io', email='user@myroadmap.io', password='123', first_name='User', last_name='User', company=root_company, is_approved=True, unsubscribed=True)
        user.groups.add(user_group)

        coach = User.objects.create_user('coach@myroadmap.io', email='coach@myroadmap.io', password='123', first_name='Coach', last_name='User', company=root_company, is_approved=True, unsubscribed=True)
        coach.groups.add(coach_group)
        coach.groups.add(user_group)


        #---------------------------------

        print('Creating RevRoad company...')
        company = Company.objects.create(name='RevRoad')

        print('Creating cohorts...')
        cohort = Cohort.objects.create(name='Marketing Department', company=company, signup_url='revroad_marketing', description='RevRoad Marketing Department')

        print('Creating roadmap...')
        roadmap = self.create_roadmap(title='Product Launch', description='Roadmap to help launch new products', company=company)
        roadmap2 = self.create_roadmap(title='Product Launch 2', description='Roadmap to help launch new products', company=company)
        roadmap3 = self.create_roadmap(title='Product Launch 3', description='Roadmap to help launch new products', company=company)

        print('Creating users...')
        user = User.objects.create_user('user@revroad.com', email='user@revroad.com', password='123', first_name='RevRoad', last_name='User', company=company, is_approved=True, unsubscribed=True)
        user0 = User.objects.create_user('user0@revroad.com', email='user0@revroad.com', password='123', first_name='RevRoad', last_name='User0', company=company, is_approved=True, unsubscribed=True)
        coach = User.objects.create_user('coach@revroad.com', email='coach@revroad.com', password='123', first_name='RevRoad', last_name='Coach', company=company, is_approved=True, unsubscribed=True)
        admin = User.objects.create_user('admin@revroad.com', email='admin@revroad.com', password='123', first_name='RevRoad', last_name='Admin', company=company, is_approved=True, unsubscribed=True)

        user.roadmaps.add(roadmap)
        user.roadmaps.add(roadmap2)

        print('Assigning groups and cohorts...')
        user.groups.add(user_group)
        user0.groups.add(user_group)
        coach.groups.add(coach_group)
        admin.groups.add(admin_group)
        admin.groups.add(coach_group)
        admin.groups.add(user_group)

        user.coach.add(coach)

        user.cohort.add(cohort)
        user0.cohort.add(cohort)
        coach.cohort.add(cohort)

        assessments = []
        # give the coach multiple users
        for x in range(2, 15):
            user = User.objects.create_user('user{}@revroad.com'.format(x), email='user{}@revroad.com'.format(x), password='123', first_name=fake.first_name(), last_name=fake.last_name(), company=company, is_approved=True, unsubscribed=True)
            user.roadmaps.add(roadmap)
            if random.randint(0, 1):
                user.roadmaps.add(roadmap2)
                self.add_assessments(user, roadmap2, assessments)
            if random.randint(0, 1):
                user.roadmaps.add(roadmap3)
                self.add_assessments(user, roadmap3, assessments)
            user.coach.add(coach)
            user.groups.add(user_group)
            self.add_assessments(user, roadmap, assessments)
            Assessment.objects.bulk_create(assessments)

        print('✅ Created seed data!')

