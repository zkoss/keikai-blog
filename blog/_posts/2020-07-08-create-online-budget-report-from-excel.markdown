---
layout: post
title:  "How I Created an Online Budget Report from Excel Files"
date:   2020-07-08
categories: "UseCase"

index-intro: "Turn Excel into online budget app!"

image: "2020-07-createonlinebudgetreport/onlineapp_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2020-07-createonlinebudgetreport"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# Issues when publishing an Excel file

My colleague Michelle in the finance team has a routine job; she has to publish a budget report on a weekly basis. Previously, she had to query budget data from a database. Then, fill the budget data manually into a template sheet like this:

![]({{ site.baseurl }}/{{page.imgDir}}/excel_screenshot.png)

Since this is a routine task, I feel I can help her by automating the data-filing process so that she does not have to do it manually & repeatedly.

Another issue is that she has been publishing the budget report as an attachment. Readers have to download the file to see the content on an Excel-ready device. Also, it is hard to control where the attachment ends up to, she has to remove all sensitive and raw data before sending it out.

To solve the above issues, I created a web page with a web spreadsheet component, Keikai. Keikai allows me to reuse the existing Excel budget template so that I don’t need to create everything from scratch. It is also important that I can control it with Java.

# Load the template file first
To start simple, I loaded the Excel template sheet into Keikai to show it in a browser:

![]({{ site.baseurl }}/{{page.imgDir}}/keikai_screenshot.png)

Such page was created by [ZUL](https://www.zkoss.org/wiki/ZUML_Reference), an XML format language from [ZK framework](https://www.zkoss.org/):

```java
<spreadsheet id="ss" height="100%" width="100%" src="/WEB-INF/books/budget.xlsx"
    maxVisibleRows="150" maxVisibleColumns="40"
    showContextMenu="true" showToolbar="true" showSheetbar="true" 
    showSheetTabContextMenu="true" showFormulabar="true"/>
```

But you can also use Keikai with [JSP](https://github.com/keikai/dev-ref/blob/master/src/main/webapp/jsp/index.jsp).

The tag, `<spreadsheet>`, represents the Keikai spreadsheet, and I can configure Keikai via tag attributes.

When a user visits http://localhost:8080/database.zul, keikai will respond with a set of javascript and CSS and render the content file in the browser.

# Data Access Object

In order to load data from the database, I created `Expense.java` to store each record and `ExpenseDao.java` to query and update the database.

#Create a controller to populate data

Next, I implemented a Java controller class to populate data from the database. The controller has to extend `SelectorComposer` so that it can inject `Spreadsheet` objects for me.

```java
public class BudgetComposer extends SelectorComposer<Component> {
    @Wire
    private Spreadsheet spreadsheet;
    ...
}
```

`@Wire` can inject a `Spreadsheet` object on the page, that's why I didn't call any constructor like `new Spreadsheet()`.

# Range API

Then, I needed to set data into cells by `Range`. One `Range` object can represent one or more cells/rows/columns, or even one sheet. I can get a `Range` object with a factory method `Ranges.range(Sheet targetSheet, int rowIndex, int columnIndex)`. For example, `Ranges.range(currentSheet, 0, 0)` represents `A1`.

To show data in a cell, just call `range.setCellValue()`. So the code is quite straightforward. After querying a list of `Expense`, I can populate data into cells in a loop like:

```java
private void fillExpenses(List<Expense> list) {
    for (int i = 0; i < list.size(); i++) {
        Expense expense = list.get(i);
        Ranges.range(spreadsheet.getSelectedSheet(), START_ROW + i, 1)
            .setCellValue(expense.getQuantity());
        Ranges.range(spreadsheet.getSelectedSheet(), START_ROW + i, 2)
            .setCellValue(expense.getSubtotal());
    }
}
```

# Result
I was able to quickly turn my colleague’s manual Excel routine into an automated Web app. Now whenever we access the budget report page, Keikai queries the data and displays it within the report template like:

![]({{ site.baseurl }}/{{page.imgDir}}/result_app.png)

# Try it yourself
If you find this article interesting, there are more examples and [demos](https://keikai.io/demo/database) on Keikai’s website. Or you can run the example project on [github](https://github.com/keikai/dev-ref).


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
