#!/usr/bin/env bash

db='alias db="cd /opt/python/current/app/ && source ../env && ./manage.py dbshell"'
shell='alias shell="cd /opt/python/current/app/ && source ../env && ./manage.py shell"'
dbreadonly='alias dbreadonly="cd /opt/python/current/app/ && source ../env && ./manage.py dbshell --database readonly"'

grep -q "sudo -s" /home/ec2-user/.bashrc || echo -e "sudo -sn" >> /home/ec2-user/.bashrc
grep -q "alias db=" /root/.bashrc || echo -e $db >> /root/.bashrc
grep -q "alias shell=" /root/.bashrc || echo -e $shell >> /root/.bashrc
grep -q "alias dbreadonly=" /root/.bashrc || echo -e $dbreadonly >> /root/.bashrc