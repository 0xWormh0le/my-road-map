How to set up project locally on your computer

If you need to create a database locally on your computer...

To enter SQL commands type psql OR psql postgres into terminal.
Create database. In terminal: creatdb [database name]
Create user
Enter username and database name in backend/src/app/settings/local.py


If database is already set up...

open terminal
navigate to project directory
cd backend 
virtualenv .
source bin/activate
cd src
python manage.py collectstatic
./manage.py makemigrations OR ./manage.py makemigrations dashboard
./manage.py migrate OR ./manage.py migrate dashboard
./manage.py runserver

!!! Temporary solution - bad practice !!!
To make postman work, locate packages, postman and its views.
Should be at Lib/site-packages/postman/views.py. Now replace the code
inside by code at modified_postman_views.py.
(Differs in lines 173-175, as we rely on requesting user in a form...)


Definitions: 

You will see the word competency within the code and database. This is the same thing as an objective. 

Global Action Items = These are action items that every user who is using the Roadmap that the global aciton item is assocated with has access to. Global action items can only be defined by the Account type = Admin. 

Action items = These are individually defined action items that are only accessible to the user who defined it. Coaches can also define specific action items for an individual. 

Company = This is its own seperate instance of MyRoadmap with its own accounts, Roadmaps, groups, etc. 

Account = This is an individal login that is assocaited with a specific company. 
    
Within the database there are certain words used to define the data that are actually called something else throughout  the code base.
    Cohort = Group 
    Competency = Objective 
    Groups = Roles 
    Users = Accounts 
    
A Users/Accounts can be associated with 3 different Groups/Roles and each have their own rights and privileges. 
    User = Ability to go through a Roadmap and assess themselves, communicate with their specified coach, etc. This is the person going through the Roadmap for themselves. 
    Coach = Ability to communicate and work with the users they are assigned to. Ability to view a dashboard of the progress for their assigned users. This is the person who is tasked to help and support their users. Synonyms for coach include accountability partner, mentor, support partner. 
    Admin = Ability to add/edit Roadmaps, add/edit Cohorts/Groups, add/edit Users/Accounts, view a dashboard of the progress for their Company. This is not defined anywhere but there is essentially a full acess admin and partial access admin. A partial access admin is created when a full access admin creates the admin and assigns them to a specific Cohort/Group. The partial access Admin only has the ability to add/edit Users/Account and view data for those within their group. 
 
Valid Email = This field was added to make sure emails weren't getting sent off to fake emails we created for demo accounts. Our email sender (Amazon SES) blocked us for a time because of a high bounce rate becaise of our server trying to send emails to invalid email addresses. 
