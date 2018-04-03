#!/bin/bash
./build-styles.sh
rm -rf ./release/*

bundle exec jekyll build -s ./blog -d ./release
cd release
zip -r keikai-blog.zip *
cd ..
scp release/keikai-blog.zip zktest@10.1.3.241:keikai-blog-upload

