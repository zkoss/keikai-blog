# blogs
Quire Blogs




installation steps for mac:
(if the version is specified, please don't install other version)

install brew

install ruby at least v. 2.0.0

install node

install jekyll 2.5.3

install gem jekyll-paginate 1.1.0

install gem redcarpet 3.3.2

----------------------------

## setup

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

    bundle exec jekyll serve

    bundle exec jekyll build


### TODO
move the jekyll files into a subfolder to avoid the Gemfile ending up in `/_site` when building
