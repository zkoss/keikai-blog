#!/bin/bash
./build-styles.sh
rm -rf ./preview/*
bundle exec jekyll serve -H 0.0.0.0 -s ./blog -d ./preview --config blog/_config.yml,blog/_config_dev.yml

