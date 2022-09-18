import csv, datetime, time, os, io, shutil, boto3

from django.utils import timezone
from django.conf import settings
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse

from dashboard.models import User, Assessment, Company, Group, AssignedCompany


def basic_csv_export(pk=1):
    # company = Company.objects.filter(id=pk).first()
    emails_to_exclude = [
        'kollyn.lund+coach@gmail.com',
        'kollyn.lund+mentor-rollins@gmail.com',
        'kollyn.lund+pg@gmail.com',
        'kollyn@myroadmap.io',
        'sales-rep@gmail.com',
        'bruce.hassler+123@revroad.com',
        'bruce.hassler+jacob@revroad.com',
        'bruce.hassler+jacob2@revroad.com',
        'bruce.hassler+new@revroad.com',
        'brucehassler+uvu@gmail.com',
        'jacob.hutchings+delme@revroad.com',
        'lund.hayley+lds@gmail.com',
        'rogers.spencer+student@gmail.com',
        'sam.gunby+----@revroad.com',
        'sam.gunby+1@revroad.com',
        'sam.gunby+test2@revroad.com',
        'spencer+pg@myroadmap.io',
        'tyler.stephens+123@revroad.com',
        'tyler.stephens+faker35193@revroad.com',
        'tyler.stephens+hi@revroad.com',
        'tyler.stephens+uns@revroad.com',
        'test@modernmasters.org',
        'test2@modernmasters.org',
        'test3@modernmasters.org',
        'bill.woahn@elkmgt.com',
        'bill.woahn@gmail.com',
        'bill@elkmgt.com',
        'gcook@doterra.com',
        'gregandjulie@gmail.com',
        'hwoahn@gmail.com',
        'mkic-user@gmail.com',
        'parent@gmail.com',
        'parent@myroadmap.io',
        'patrick@myroadmap.io',
        'regnalquin@gmail.com',
        'rogers.spencer@gmail.com',
        'spencer@getppchelp.com',
        'spencer@gmail.com',
        'spencer+pg@myroadmap.io',
        'srogers@byu.net',
        'steven.lund@comcast.net',
        'sworthington101@gmail.com'
    ]
    email_patterns_to_exclude = [
        '@myroadmap.io',
        '@parentguidance.org',
        '@modernmasters.org',
        '@revroad.com',
    ]
    combinedAccounts = User.objects.exclude(groups__name='Admin').distinct()
    for email in email_patterns_to_exclude:
        combinedAccounts = combinedAccounts.exclude(email__endswith=email)
    for email in emails_to_exclude:
        combinedAccounts = combinedAccounts.exclude(email=email)
    
    formatedDate = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
    buffer = io.StringIO()  # python 2 needs io.BytesIO() instead
    writer = csv.writer(buffer)

    writer.writerow(["first name","last name","email","account created","last login","company name","account type","coaches","roadmaps","assessments","last assessment date","last coach login"])

    for user in combinedAccounts:
        try:
            assessment_date = Assessment.objects.filter(student=user).order_by('-id').first().date.strftime("%m/%d/%Y")
        except:
            assessment_date = None
        writer.writerow([
            user.first_name[0].upper() if user.first_name else "",
            user.last_name[0].upper() if user.last_name else "",
            user.email[0] if user.email else "",
            user.date_joined.strftime("%m/%d/%Y %H:%M") if user.date_joined else "",
            user.last_seen.strftime("%m/%d/%Y %H:%M") if user.last_seen else "",
            "id-" + str(user.company.id) if user.company else "",
            ", ".join(list(user.groups.all().values_list('name', flat=True))) if user.groups else "",
            user.coach.filter(company=user.company).count() if user.coach.filter(company=user.company).count() > 0 else "",
            user.roadmaps.filter(company=user.company).count() if user.roadmaps.filter(company=user.company).count() > 0 else "",
            "yes" if Assessment.objects.filter(student=user).first() else "no",
            assessment_date if assessment_date else "",
            user.last_seen.strftime("%m/%d/%Y") if user.groups.filter(name="Coach").first() and user.last_seen else ""
        ])
    
    if settings.IS_AWS:
        # Write the file to S3
        s3_resource = boto3.resource('s3')
        s3_resource.Object(settings.AWS_S3_BUCKET_NAME, "data-dump/%s.csv" % formatedDate).put(ACL='public-read', Body=buffer.getvalue())
    else:
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(formatedDate)
        return response


def computed_csv_export(pk=0):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    # Give a format to the date
    # Displays something like: Aug. 27, 2017, 2:57 p.m.
    formatedDate = timezone.localtime(timezone.now()).strftime("%m%d%Y-%H%M")
    response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(formatedDate)

    writer = csv.writer(response)
    writer.writerow(['User Accounts', 'Coach Accounts', 'Total Accounts', 'Users with Roadmap', 'Users with Coach', 'Users with Assessments', 'Active Accounts', 'Retention Accounts'])

    company = Company.objects.filter(id=pk).first()

    if company:
        userAccounts = User.objects.filter(groups__name='User', company=company).distinct()
        coachAccounts = User.objects.filter(groups__name='Coach', company=company).distinct()
        combinedAccounts = User.objects.filter(company=company).exclude(groups__name='Admin').distinct()
    else:
        userAccounts = User.objects.filter(groups__name='User').distinct()
        coachAccounts = User.objects.filter(groups__name='Coach').distinct()
        combinedAccounts = User.objects.exclude(groups__name='Admin').distinct()

    userWithRoadmap = round(userAccounts.exclude(roadmaps=None).count() / userAccounts.count() * 100, 0)
    userWithCoach = round(userAccounts.exclude(coach=None).count() / userAccounts.count() * 100, 0)
    
    userWithAssessments = []
    for user in userAccounts:
        if Assessment.objects.filter(student=user).first():
            userWithAssessments.append(user)
    userWithAssessments = round((len(userWithAssessments) / userAccounts.count()) * 100, 0)

    activeAccounts = []
    enddate = timezone.localtime(timezone.now())
    startdate = enddate - datetime.timedelta(days=7)
    for user in userAccounts:
        if Assessment.objects.filter(student=user, date__range=[startdate, enddate]).first():
            activeAccounts.append(user)
    for coach in User.objects.filter(groups__name='Coach', last_login__gt=startdate):
        activeAccounts.append(coach)
    activeAccounts = round((len(activeAccounts) / combinedAccounts.count()) * 100, 0)

    retentionAccounts = []
    enddate = timezone.localtime(timezone.now())
    startdate = enddate - datetime.timedelta(days=14)
    for user in userAccounts:
        if Assessment.objects.filter(student=user, date__range=[startdate, enddate]).first():
            retentionAccounts.append(user)
    for coach in User.objects.filter(groups__name='Coach', last_login__gt=startdate):
        retentionAccounts.append(coach)
    retentionAccounts = round((len(retentionAccounts) / combinedAccounts.count()) * 100, 0)

    writer.writerow([userAccounts.count(), coachAccounts.count(), combinedAccounts.count(), userWithRoadmap, userWithCoach, userWithAssessments, activeAccounts, retentionAccounts])

    return response


def company_export(pk=0):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    # Give a format to the date
    # Displays something like: Aug. 27, 2017, 2:57 p.m.
    formatedDate = timezone.localtime(timezone.now()).strftime("Company List - %Y-%m-%d")
    response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(formatedDate)

    writer = csv.writer(response)
    writer.writerow(['Company Name', 'Company ID'])

    for company in Company.objects.all():
        writer.writerow([company.name, "id-" + str(company.id)])

    return response
