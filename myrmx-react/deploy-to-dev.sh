#!/usr/bin/env bash

rm deploy.zip; REACT_APP_ENV=development npm run build; cd build; zip -r ../deploy.zip .; cd ../; eb use myroadmap-react-dev; eb deploy;
