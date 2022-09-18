#!/bin/bash

if [ "$1" == "makemigrations" ]; then
  rm dashboard/migrations/00*.py
  python manage.py makemigrations
fi
mysql -uroot -e "DROP DATABASE myroadmap"
mysql -uroot -e "CREATE DATABASE myroadmap"
python manage.py migrate
python manage.py dbseed