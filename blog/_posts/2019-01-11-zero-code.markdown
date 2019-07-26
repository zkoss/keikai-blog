---
layout: post
title:  "Zero-Code UI Building with Keikai"
date:   2019-01-11
categories: "Application"

index-intro: "Zero-Code UI Building with Keikai<br/>
<br/>
This article tells you how easy to build web application UI with Keikai.
"

image: "2019-01-zero-code/leaveForm.png"
tags: developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "2019-01-zero-code"
javadoc: "http://keikai.io/javadoc/1.0.0-beta.7/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io

寫作目標： Keikai 能幫助你輕鬆打造 UI
# 開發者會遇到那些重大問題
# keikai 如何解決這些問題
# 如何滿足UI 其他的需求
-->



# Problems in UI Building
Hello, mighty software developers! Have you ever feel frustrated in building the UI of your application? Especially when the end user of the UI is not you. You probably never understand what those end users want. That's because there are gaps between developers and users.

## Communication Gap
When you show the UI you build to your users, you might get responses like "this sucks", "the red should be ... darker", or "the font size is just too small"...etc. What?! You thought you have already built it according to what they described (you honestly thought so...). However, after endless modifications, it seems that the end users are never satisfied. 

Because people from different backgrounds tend to use different terms and have different assumptions when communicating with others. When 2 persons are not familiar with each other, they need to spend extra time to synchronize ideas in their heads with each other. To know what "red" is your red.

## The Gap between Design View and Runtime View
Before actually building a UI, you usually ask end users' feedback by showing them a design draft, often you use a wireframe or a hand drawing. However, such a design-time view is still very different from a runtime view - the real web page. Therefore, users' feedback on this draft can't really reflect their real requirements precisely; users weren't able to correctly image what the UI will look like and couldn't interact with the UI.

## UI Changes Frequently
Another common problem is that people tend to change UI from time to time. Reasons vary, could be due to requirement change, preference change, or new feature. Sometimes these changes are minor like increasing font size, change a color, or move the position of some elements. However, if every change needs to be implemented by developers, it will cost a lot.


## These Problems Fail UI Building
These problems fail UI building and consume extra time because you need to re-build, confirm, re-build, confirm... over and over again. After several iterations, the UI might finally match the expectation of end users. But it took way too long.


# How [Keikai Can Save Developers](https://keikai.io/saveIT/)
Next, we are going to look at how Keikai can change the way business users collaborate with developers -- helping developers to create spreadsheet-driven Web applications with a 100% user-proven UI. To put it in a more straightforward way - build Web Applications from Excel sheets.


## UI Designed by Users
Since the business end users are normally those who know the best about their business needs and process, it's better to let them create forms and pages by themselves instead of letting developers do the work. Therefore, end users can design their pages first in Excel, using features like styles, colors, filters, validations, and formulas. Because Excel is universal and non-technical, users can easily create, modify sheets by themselves.

Users even can implement some simple application logic with formulas. For example, if a member of Human Resource department creates a leave application form, he can calculate work days by `NETWORKDAYS()` and fill the date of today by `TODAY()` as a default value like:

**Excel File**
![]({{ site.baseurl }}/images/{{page.imgDir}}/formExcel.png)


## Users Can See Real Pages (WYSIWYG)
Next, you just need to import that Excel file into Keikai with one line of code, and Keikai can render it on a web page:

```java
spreadsheet.importAndReplace("Leave Application.xlsx", form);
```

After importing the leave application form (`Leave Application.xlsx`), when you compare the 2 screenshots, you nearly can't find any difference between Excel and Keikai.


**File in Keikai**
![]({{ site.baseurl }}/images/{{page.imgDir}}/formKeikai.png)


In short, what users created in Excel becomes a web application page. Since users design their pages by themselves, there's **no more communication gap** between users and developers. Besides, end users can build a page without worrying about the resulting web page looks different -- **No design view and runtime view gap** exists anymore.

## Users Can Change Pages
Users can also change the UI in Excel without the developers involved. This also saves lots of time between users and you. To sum up, Keikai can solve those problems and minimize the gaps by turning an Excel sheet into a web application page.


# Fulfill Other UI Requirements
Turning an Excel sheet into a static Web page is just the first step. A good UI needs to fulfill more requirements like showing data from a data source dynamically, handling events and page navigation. Let me tell you how to achieve them with Keikai as well.

## Fill Data in Cells
A web application usually displays data loaded dynamically, e.g. from a database or a configuration file. Keikai provides `Range` setter API to set data into cells, the basic usage is:

```java
// get a Range object that represents one or more cells
Range range = spreadsheet.getRange(rowIndex, columnIndex);
// call this setter, then Keikai shows it in the cell of your browser
range.setValue(yourData);
```

Keikai doesn't limit your way to get `yourData`, you can query it from a database with Hibernate, a web service, or a file. Just implement what you need.


## Get User Input
To get what a user input in a cell, just call the getter of `Range`:

```java
// get a Range object that represents one or more cells
Range range = spreadsheet.getRange(rowIndex, columnIndex);
// call this getter
String value = range.getValue().toString();
// get 4 cells in a row at once
List cellValues = spreadsheet.getRange(row, col, 1, 4).getValues();
```

## Page Navigation
In our [Workflow application](https://github.com/keikai/keikai-tutorial#workflow-app), when a user visits the main page, the page transition is determined by a user's role:

* enter as **Employee**  -> form list
* enter as **Supervisor**  -> submission list

![]({{ site.baseurl }}/images/{{page.imgDir}}/pageNavigation.png)

In the Excel file, I make one sheet for each page:

![]({{ site.baseurl }}/images/{{page.imgDir}}/3sheets.png)

In order to fully control a user's stage transition without running into undesired surprises, I hide sheet tabs to avoid users switching/deleting sheets. This can be done by a data attribute below:

```xml
<div id="spreadsheet" data-show-sheet-tabs="false" >
```

 Then navigate a user to the corresponding page(sheet) by selecting a sheet:

```java
spreadsheet.setActiveWorksheet(SHEET_FORM);
```


## Data Validation
For editable cells, if you want to limit what a user can input, you can apply a data validation. For example, there are only 2 roles (Employee, Supervisor) to choose in the main page:

![]({{ site.baseurl }}/images/{{page.imgDir}}/roleDropdown.png)


## Control Accessibility
By default, users can edit every cell in a sheet but a normal web page doesn't behave like this, so we need to restrict users' accessibility.


### Limit Editable Area
By setting sheet protection and specifying unlocked cells, you can assign an area that is editable and make the rest cells read-only.

```java
sheet.protect(new SheetProtection.Builder().setPassword("")
        .setAllowFiltering(true)
        .setAllowSorting(true)
        .setAllowSelectLockedCells(true)
        .build());
```

### Limit Available Features
If I don't want users to edit cells arbitrarily, I can hide the toolbar and context menu to avoid confusing users. This can be done with the data attribute below:

```xml
<div id="spreadsheet" data-show-toolbar="false" data-show-context-menu="false"/>
```

## Support 9 UI Controls
A normal sheet cell usually can't fulfill various input needs. Hence, Keikai supports to import 9 UI controls including button, group box, label, check box, scroll bar, list box, option button, and spinner. 

![]({{ site.baseurl }}/images/{{page.imgDir}}/excelUiControl.png)

Users can drag to add a UI control in Excel, all you have to do is import the file. Keikai will render these UI controls as HTML elements. Then you can even customize them with CSS.

![]({{ site.baseurl }}/images/{{page.imgDir}}/button.png)


## Handling User Events
Respond to user actions is what UI should do as well. Keikai supports listening to events triggered by user actions and implementing your application logic in an event listener.

```java
spreadsheet.addEventListener(Events.ON_CELL_CLICK, rangeEvent -> {
    // your application logic
});
```

You can also listen to a button clicking like:

```java
spreadsheet.getWorksheet(SHEET_FORM).getButton(BUTTON_LEAVE).addAction(shapeMouseEvent -> {
    leave();
});
```

# Check out [Workflow Demo Online](https://keikai.io/demo/workflow)
Try the workflow application by yourself to experience what I talked about in this article.
 

# Source Code
The complete source code of workflow application mentioned in this article is available at [Github](https://github.com/keikai/keikai-tutorial).


# I Welcome Your Feedback
I have demonstrated how you can build UI in Excel and turn it into a Web application with Keikai. Feel free to tell us what other applications we can show you.



# Related Articles
* [Getting Started With Keikai](https://dzone.com/articles/keikai-spreadsheet-for-big-data)
* [Create a Spreadsheet Web App With Keikai: Workflow Example](https://dzone.com/articles/create-a-spreadsheet-web-app-with-keikai-workflow)




[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help