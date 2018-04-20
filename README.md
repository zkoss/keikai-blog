# Keikai Blog

## setup

### install node 9.x
install `npx` command used in build-styles.sh
    npm install -g npx

install `lessc` dependency locally
    npm install

### install ruby 2.5.1 (project also builds using 2.1.10 - after changing the Gemfile)

recommended ruby version manager rbenv 
(including the optional step ruby-build)
follow instuctions https://github.com/rbenv/rbenv#installation

install the desired ruby version (this takes a while `-v` shows more details during install)

    rbenv install 2.5.1 -v

rbenv will read the file .ruby-version to identify which version to use when inside the project folder

### install bundler (dependency manager similar to maven/npm)

    gem install bundler

### install project dependencies

    bundle install
  
this will read the `Gemfile` and download dependencies automatically, also complain if the wrong ruby version is active

### run/build the project

    bundle exec jekyll build -s blog/

    bundle exec jekyll serve -s blog/ --config blog/_config.yml,blog/_config_dev.yml
