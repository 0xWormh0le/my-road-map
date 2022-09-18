#!/usr/bin/env bash

git archive --format=zip HEAD:backend/src/ > deploy.zip; eb deploy;
