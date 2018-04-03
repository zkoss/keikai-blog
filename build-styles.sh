#!/bin/bash
rm -rf blog/css/*

lessc less/blog.less blog/css/blog.min.css -x
lessc less/blog.less blog/css/blog.css

mkdir --parents blog/css/bootstrap
cp less/bootstrap/bootstrap.css blog/css/bootstrap/
cp less/bootstrap/bootstrap.min.css blog/css/bootstrap/

mkdir --parents blog/css/lato
cp -r less/lato/* blog/css/lato
lessc less/lato/latofonts.css blog/css/lato/latofonts.min.css -x

