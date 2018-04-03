#!/bin/bash
./build-styles.sh
rm -rf ./release/*

bundle exec jekyll build -s ./blog -d ./release
zip -r keikai-blog.zip release/*
mv keikai-blog.zip release


