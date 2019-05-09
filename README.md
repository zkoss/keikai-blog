# Keikai Blog

> Website: https://keikai.io  
> Demo: https://keikai.io/demo  
> Blog: https://keikai.io/blog

## setup

### install node 10.x
install `npx` command used in build-styles.sh (if not present)

    npm install -g npx

### install ruby 2.5.1 (project also builds using 2.1.10 - after changing the Gemfile)

recommended ruby version manager rbenv 
(including the optional step ruby-build)
follow instuctions https://github.com/rbenv/rbenv#installation

install the desired ruby version (this takes a while `-v` shows more details during install)

    rbenv install 2.5.1 -v

rbenv will read the file .ruby-version to identify which version to use when inside the project folder

### install bundler (dependency manager similar to maven/npm)

    gem install bundler
    
in case bundler causes trouble install a specific bundler version

    gem install bundler -v 1.16.1

### install project dependencies
`jekyll` dependencies

    bundle install
  
this will read the `Gemfile` and download dependencies automatically, also complain if the wrong ruby version is active

`lessc` dependency

    npm install


### run/build the project

    ./build-styles.sh

    bundle exec jekyll build -s blog/ -d release

    bundle exec jekyll serve -s blog/ -d preview --config blog/_config.yml,blog/_config_dev.yml
