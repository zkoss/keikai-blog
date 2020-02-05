#!/bin/bash
rm -rf blog/css/*

npx lessc less/blog.less blog/css/blog.min.css --clean-css
npx lessc less/blog.less blog/css/blog.css

mkdir -p blog/css/bootstrap
cp less/bootstrap/bootstrap.css blog/css/bootstrap/
cp less/bootstrap/bootstrap.min.css blog/css/bootstrap/

mkdir -p blog/css/fonts
cp -r less/fonts/* blog/css/fonts
npx lessc less/keikaifonts.css blog/css/keikaifonts.min.css --clean-css

mkdir -p blog/css/lato
cp -r less/lato/* blog/css/lato
npx lessc less/lato/latofonts.css blog/css/lato/latofonts.min.css --clean-css
