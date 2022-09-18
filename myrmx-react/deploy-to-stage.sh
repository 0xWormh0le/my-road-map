#!/usr/bin/env bash

rm deploy.zip; REACT_APP_ENV=staging npm run build; cd build; zip -r ../deploy.zip .; cd ../; eb use myroadmap-react-stage1; eb deploy;
