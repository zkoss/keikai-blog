---
layout: post
title:  "Top 3 Keikai User Stories"
date:   2021-01-28
categories: "Usecase"
excerpt: "Keikai Spreadsheet is designed for turning excel to web and building spreadsheet applications. Here are the top 3 user stories."

index-intro: "
Top 3 user stories with Keikai.
"
image: "2021-01-Top3UserStories/UserStory_cover.png"
tags: marketing
author: "Susan Yang"
authorImg: "/images/author/susan.jpg"
authorDesc: "Marketing, Keikai."


imgDir: "2021-01-Top3UserStories/"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

Wondering how Keikai can actually help you with your work? We are sharing 3 typical user stories. Check them out now!

![]({{ site.baseurl }}/images/{{page.imgDir}}/UserStory.png)


<br>

# As a financial professional…

My customer Samuel is a financial professional who manages financial risks for his clients. He develops a tool based on Excel to analyze the risk of investments and forecast the market trend. He creates many valuable formulas in his Excel file that help him do the job.
＂I need to have the ability to update the calculation sheets often. When a tax regulation is updated, or a new policy is instantiated, the calculations must follow immediately, and not wait for a dev to translate it into code.＂

### Current Challenges

1. Problem using Excel: To allow clients accessing his financial risk model, he has to email the Excel file to the clients. However the file (and its underlying formulas and domain knowhow) can easily be leaked or copied.

2. Problem using tailor-made software: He has also thought about having the dev team to create a tailor-made software. However, the lead time is long plus it’s hard to explain all the formula and logic to the developers. Most importantly, the financial data need to be updated very often and he can’t wait for the dev to update for him every time.

### How Keikai Helps

Keikai is like a bridge to bring the spreadsheet into the Web. You can reuse your Excel data and formulas while sharing and protecting the sheet like any other Web application.

1. You can easily configure Keikai to show only the input and output fields to the clients, so the internal calculations will not be exposed.
2. Samuel can change his formulas from time to time without changing the Java code since the analysis is implemented in his formulas in Excel instead of Java. He doesn’t need to wait for a dev to update the code for him.

If you are interested in this story, read more here:
[Protect Formulas in a Web Spreadsheet] (https://keikai.io/blog/p/protect-formulas-in-webspreadsheet-application.html) and [Upgrading Your Data Processing Spreadsheet to the Web](https://keikai.io/blog/p/data-transform.html)

<br>

# As a procurement staff…

Sara is an administrative staff in the Purchasing department. Before ordering services or supplies from vendors, she has to collect the company information through the vendor registration form and enter them to the internal vendor database.

### Current Challenges

It takes Sara too much time emailing the Excel forms around, reviewing and entering the results. For any updates, she has to manually do these procedures all over again. Errors may occur during the copying and pasting process.

### How Keikai Helps

Keikai can turn an xlsx document into a web application, so the contractors and suppliers can fill in their information on the web page directly instead of updating and sending back the Excel forms one by one. Sara no longer needs to enter and update the data manually.
Sara also uses Keikai to display the data received from the vendors. It’s very similar to using Excel -  she can do data searching, filtering, ordering, in the same way she’s used to.

If you are interested in this story, read more here:
[Make an Excel data-collecting form live as a Web application](https://keikai.io/blog/p/vendor.html)

<br>

# As a HR...

Owen works in the HR department, collecting sheets like leave application forms or business trip requests from the employees and their supervisors. Then he can calculate the actual working hours before every payday.

### Current Challenges

Owen used to work with Excel files but manually gathering and updating the files is error-prone. Also the files got lost or overlooked easily when emailing around. He has asked the dev team to help but the developer team is always busy and has not enough time to create an application from scratch for him.  Owen simply needs the same Excel sheets to be arranged in a more organized workflow: from the applicant, to the supervisor, and then escalated to the HR. 

### How Keikai Helps

Keikai can turn any existing Excel template into a secured and integrated application with little developing effort. Owen can continue to use the Excel forms he used to work with, all what the dev team needs to do is to navigate users to the target sheets based on their roles - this can be done in just a few lines of codes. Everything is well managed in one system, no more manual updates, no more sending Excel files around. 

If you are interested in this story, read more here:
[Spreadsheet as a Web App - Workflow Example](https://keikai.io/blog/p/workflow-app.html) and [Build Spreadsheet-driven Web Apps](https://keikai.io/blog/p/spreadsheet-driven-app.html)




[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
