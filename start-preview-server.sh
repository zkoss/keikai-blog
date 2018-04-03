#!/bin/bash
./build-styles.sh
rm -rf ./preview/*
bundle exec jekyll serve -s ./blog -d ./preview --config blog/_config.yml,blog/_config_dev.yml

