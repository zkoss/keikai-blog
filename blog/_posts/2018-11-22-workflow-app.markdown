---
layout: post
title:  "Zero-Code UI Building with Keikai"
date:   2018-11-22
categories: "Application"

index-intro: "Zero-Code UI Building with Keikai<br/>
<br/>
This article tells you how easy to build web application UI with Keikai.
"

image: "2018-11-zerocode/featuredImage.png"
tags: developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "2019-01-zero-code"
javadoc: "http://keikai.io/javadoc/1.0.0-beta.7/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->


# Problems at UI Building
Hello, mighty software developers! Have you ever feel frustrated with UI building? Especially the end user of the UI is not you. You probably never understand what those end users want. That's because there are gaps between developers and users.

## Communication Gap
When you show the UI you build to your users, you might hear "this layout is such a tragedy", "that red is not the red I want", or "the font size is just too small"...etc. What! You think you already build according to what they describe (you suppose). After endless modifications, it seems they are never satisfied. 

Because people from different backgrounds tend to use different terms and have different assumptions when communicating with others. When 2 persons are not fimilar with each other, they need to spend time to synchronize ideas in their heads each other. To know what "red" is your red.

## The Gap between Design View and Runtime View
Before actually building a UI, you usually ask end users's feedback by showing them a design draft. Maybe using a wireframe or a hand painting, such a design-time view still has a big difference from a runtime view - the real web page. Therefore, users' feedback can't reflect their real requirements precisely. Since users can't correctly image what the UI will look like and can't interact with the UI.


## These Gaps Increase Cost
These gaps cause UI building failure, then you need to re-build, confirm, re-build, confirm... After sevaral iterations, the UI might match the expectation of end users. But it already costs a lot. 


# [Keikai](https://keikai.io) Eliminates Those Gaps
End users can design their pages first with Excel features like styles, colors, filters, validations, and formulas. Because lots of users know Excel and no technical details involves, users can easily create, modify pages by themselves.

Users event can implement some simple application logic with formulas. For example, they can calculate work days by `NETWORKDAYS()` and fill the date of today by `TODAY()`.

Then you just need to import that file into Keikai with one line of code below, and Keikai can render it on a web page:

```java
spreadsheet.importAndReplace("myForm.xlsx", myForm);
```

Since users design their pages without you, no communication gap.

After imporing, when you compare the 2 screenshots below, you nearly can't find any difference between Excel and Keikai. (Only buttons' visibility is controlled programmatically)

**Excel File**
![]({{ site.baseurl }}/images/{{page.imgDir}}/formExcel.png)

**File in Keikai**
![]({{ site.baseurl }}/images/{{page.imgDir}}/formKeikai.png)

Hence, end users can build a page without worrying about the resulting web page looks differently. No design time and runtime gap exists anymore.


# Fill Data in Cells
Showing a static page designed by Excel is just the first step. A web application usually displays data loaded dynamically, e.g. from a database or a configuration file. Keikai provide `Range` setter API to set data into cells, the basic usage is:

```java
// get a Range object that represents one or more cells
Range range = spreadsheet.getRange(rowIndex, columnIndex);
// call this setter, then Keikai shows it in the cell of your browser
range.setValue(yourData);
```

Keikai doesn't limit your way to get `yourData`, you could query it from a database with Hibernate, a web service, or a file. You just implement what you need.


# Get User Input


# Sheet(Page) Navigation
* control visibility
* import different files

Hiding sheet tabs can avoid users performing any sheet operation such as switching sheets. With this, the application can fully control a user's stage transition without running into undesired surprises.

This can be done by a data attribute below:

```xml
<div id="spreadsheet" data-show-sheet-tabs="false" >
```


# Data Validations
For editable cells, you can even apply a data validation to limit what user input.
...


# Limit Editable Area
By sheet protection and setting unlocked cells, you can assign an area that is editable and make the rest cells read-only....


# Avoid Users Making Mistakes
By default users can edit every thing but we need to restrict users...
## Hide toolbar, Sheet Tabs

If I don't want users to edit cells arbitarily, I can hide the toolbar to avoid confusing users. This can be done with the data attribute below:

```xml
<div id="spreadsheet" data-show-toolbar="false" .../>
```



## Business department can participate in the application building effortlessly
Since the end users are normally those who know the best about their business needs and process, it's better to let them create forms and pages by themselves instead of letting developers do the work. This can reduce the communication cost/loss between end users and the technical team.




# Source Code
The complete source code in this article is available at [Github](https://github.com/keikai/keikai-tutorial).


# I Welcome Your Feedback
I have demonstrated how you can build UI of an application with Keikai. Feel free to tell us what other applications we can show you.

# Related Articles
* [Getting Started With Keikai](https://dzone.com/articles/keikai-spreadsheet-for-big-data)
* [Create a Spreadsheet Web App With Keikai: Workflow Example](https://dzone.com/articles/create-a-spreadsheet-web-app-with-keikai-workflow)


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help