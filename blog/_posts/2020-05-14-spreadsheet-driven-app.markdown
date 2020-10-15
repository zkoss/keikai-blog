---
layout: post
title:  "Build Spreadsheet-driven Web Apps "
date:   2020-05-14
categories: "UseCase"
excerpt: “Benefits building web applications from Excel files. ”

index-intro: "
This article introduces the benefits of building Web apps from Excel files using Keikai.
"
image: "2020-05-spreadsheetdrivenapp/benefit_cover.png"
tags: marketing
author: "Jean Yen"
authorImg: "/images/author/jean.jpg"
authorDesc: "Marketing, Keikai."


imgDir: "2020-05-spreadsheetdrivenapp"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

# Typical App Design Flow

Being an IT developer supporting various departments within the company is never easy. You receive requests from all different teams where you need to create tools for them. The finance team may come to you with complicated accounting and taxation formulas. The HR team has its KPI logic and performance measuring tactics. The procurement team has its planning and forecast secrets -- it takes weeks if not months for developers to understand the workflow and requirements, code the formulas and logic, and communicate with these requesting departments again and again. 

Worst of all, even after all the efforts you put into creating the app, users are often unsatisfied with the created application, simply because it’s different from what they expected.

To solve this issue we brought up a brand-new idea: the spreadsheet-driven Web App.

# Spreadsheet-driven App

So, what exactly is a spreadsheet-driven app?
To put it simple, it means creating a web application based on a spreadsheet. There are different levels here - some take the spreadsheet as the data source, and display these data in a web browser. Keikai, on the other hand, takes one step further -- it propagates not just the data, but also the styles, formats, and formulas into the web. 

This means, instead of communicating back and forth with the requesting department, you can simply ask them to create the UI in Excel by themselves. They can design the form, add all the finance/KPI formulas and logics by themselves in an Excel book. Then, as an IT developer, you take it from here to wire these views with the database for data processing and page navigation. 

The UI will look exactly as what they have designed in Excel -- no “surprises”, no communication loss and cost. Developers can focus on data processing and navigation without having to get deeply involved with the domain know-how.

# Example

Here’s an example of a smart HR system.
The HR department first prepares all the views they wish to see in Excel. The first sheet is the main entry page to select the role; the 2nd sheet is the form list to display all available forms; the 3rd sheet is the actual form; and the 4th sheet is a list containing all submitted forms.

![]({{ site.baseurl }}/images/{{page.imgDir}}/smartHRsystem.png) 

Then, they can share with you, the developer, their expected navigation & data flow. You can then add corresponding actions to the buttons to perform page(sheet) navigation and data population. For example, after the “Employee” role is selected on the main page, they expect to display the form list to the user. This is where you wire the logic up using Java.

The resulting app looks like this:

![]({{ site.baseurl }}/images/{{page.imgDir}}/tabSwitching.gif) 

# Why spreadsheet-driven

Compared to the traditional flow of building an app, the spreadsheet-driven way delegates the UI design job to the requesting department. 
With the new approach it allows the requesting department -- those who know the best about their expertise -- to get participated in the design process and create their desired UI. Simply using Excel. And you, as the IT developer, just help them to wire the backend logic and perform page navigation. This greatly reduces the communication loss and cost and eases the job for both the user and the developer. 

Furthermore, the resulting application comes with Excel editing features and data tools like filtering, sorting and editing. These are propagated at the time you import the Excel file, no coding required.

![]({{ site.baseurl }}/images/{{page.imgDir}}/benefits.png) 

I hope you find this approach interesting and useful. To try out a spreadsheet-driven app, check out https://keikai.io/demo/database and https://keikai.io/demo/workflow. 




[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
