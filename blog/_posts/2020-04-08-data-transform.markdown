---
layout: post
title:  "Upgrading Your Data Processing Spreadsheet to the Web" 
date:   2020-04-08
categories: "Application"

index-intro: "
Transform your Excel calculation sheets into a simple and powerful web workflow without exposing the internal calculations to the end-user.
"
image: "2020-04-data-transform/intro.png"
tags: developer
author: "Matthieu Duchemin"
authorImg: "/images/author/matt.jpg"
authorDesc: "Developer, Keikai."


imgDir: "2020-04-data-transform"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

# Introduction

Hello there!
Today we are breaking down how you can transform your Excel calculation sheets into a simple and powerful web workflow without exposing the internal calculations to the end-user.

# The Situation
In basically any business interaction, we have to estimate the results based on data. It might be to evaluate financial risks, depreciation rate, tax, pension, etc.

All of those fields have a few things in common: They have simple “enter the values here” and “read the results here” fields and some rather large calculation sheets transforming the former into the latter.

![]({{ site.baseurl }}/images/{{page.imgDir}}/intro.png "Example input and output in a spreadsheet")

Now, the formulas in those sheets are usually not something we want to let loose, or even make visible outside of our agent’s computer, so whenever a request comes from the outside, we have to conduct our own calculations and send the results.

Moreover, those spreadsheets tend to float around in a shared folder, causing all sorts of minor day-to-day issues. From using the wrong version for this quarter to getting a file locked message and accidentally making a duplicate, those file-based apps have trouble adapting to the current standard of networking.

The thing is, our business experts (financial, sales, HR, …) need to have the ability to update the calculation sheets often. When a tax regulation is updated, or a new policy is instantiated, the calculations must follow immediately, and not wait for a dev to translate it into code.

# Making Life Easier
So, what can we do to improve the current state of things?

Well first, we need our business people to be able to update the document easily and effectively. They already know the business logic, and they have experience working with Excel, so we want to keep that within the tool to update the workflows.

We also want everyone to have access to the same document versions at the same time when they are updated.

And lastly, we want the documents to only show the start and the finish screens, so we can share them with third-party actors without risks of exposing our internal calculations, and we want to hide all formulas from the end-user.

# Technical Workflow
Let's have a look under the hood to see how this workflow is really implemented. Basically, we will use two specific tools.

**Client spreadsheet editor**: In my (and my business coworkers) case, we will be using Excel, but any editor will do, as long as it supports the xlsx file format.

**Keikai**: This package will be used as the bridge and automation tool to bring the spreadsheet into the Web. It's a Java library used in Java-based web applications. With this, I can import, update, and control the spreadsheet as a web page.

Building the page is straightforward. I'll first build the spreadsheet on my local computer. This includes setting all of the cell calculation and references, as well as preparing the look and feel of the sheets.

Once my spreadsheet is ready, I'll switch to the Java web component. From a standard Java web app, I'll create a Keikai controlled web client and load the spreadsheet directly into the page.

# Starting Simple
In this use case, most of the heavy-lifting is delegated to the spreadsheet. Since I want our business users to be able to update the workflow at will, and I’m ready to teach them how to package a war file or run a build. No, they need to use the tools they know, and they already know Excel.

So, for a simple two-step workflow, we will create a workbook with three pages:

**Source:** the entry point
The end-user will use this sheet to input values used by the workflow

**Transform:** the engine
This page will grab values entered in the source sheet and process them to generate exploitable results. The end-user will never see it.

**Display:** the result page
The end-user will be shown on this page containing the results of the calculation, retrieved from the transform sheet.
This page contains the results of the calculation retrieved from the transform sheet.

![]({{ site.baseurl }}/images/{{page.imgDir}}/simple.png "Simple workflow illustration")

# Putting it Together
The source page is trivial; I only need to mark the cells that will be used in the next step and add a legend to let the end-user know where to input data. I’ll also protect the other cells in order to avoid confusion.

The transform page is the heart of this operation. I could use the values directly from the source sheet in formulas, but for presentation clarity, when this document is updated by our business team, I’ll be adding a relay for the input values in this sheet from C4 to C8.

Then, I can generate results based on these values. In this example, we are making simple calculations, such as:

* Sum of all data fields: `=SUM(C4:C8)`
* The average value of data fields: `=AVERAGE(C4:C8)`
* Etc.

Now to the display. It’s not much more complicated: I’ll just need to reference cells from the transformed sheet into a user-friendly layout.

For example, I can use `=transform!G4` to retrieve the value of this cell and display it.

# Going Further: Multi-Sheet Workflows
In some cases, we even have some multi-sheet workflows, which results from a first worksheet are being fed to another calculation sheet in order to obtain the results.

It looks like this:

![]({{ site.baseurl }}/images/{{page.imgDir}}/complex.png "Multi-sheet workflows") 

Sometimes, not every calculation can be put into a single sheet. It’s not a problem though since Keikai supports the worksheet standards from Excel, as well as cascading cell references.
For example, we may need to lookup a result from a table after calculating a value or have a different display page, depending on the workflow chosen by the end-user.

For this example, we will assign a grade and level to our results based on a lookup table. I’ll start by creating a new transform sheet “tranform2,” which will pull values from the first transform page:
Value from transform1: `=tranform1!G8`

From there, I’ll use the Excel function VLookup to do a vertical lookup into my data table:
Searching in the A4:C13 table: `=VLOOKUP(C15,A4:C13,2)`

From there, we can create a new display sheet pulling data from both the first transform and the second transform sheets.

For example, we will target the same sum field with:
Value of the display field for sum (From transform1): `=transform1!G4`

And retrieve the rating with:
Value of the display field for rating (From transform2): `=transform2!C16`

# All of This and More in a Spreadsheet
The original spreadsheet document is located in the project's resources, but it can easily be replaced in the project files, or a replacement can be imported through the webpage controls.

You will find it here in the example project.

[Code sample on GitHub](https://github.com/keikai/dev-ref/)

# Adding Keikai Controls
Then, the only task left is to add buttons to our source sheet in order to automate user navigation through the sheet.

In this example, I only want the user to go from the source page to either the display of the display2 page. To do so, we can take advantage of the button API in [Keikai](https://keikai.io/) to add behavior to a button control by name. Below is an example that can also be found on [GitHub](https://github.com/keikai/dev-ref/blob/cd2b93d7d8356cc37caccb2f40f27fe6ea4c79da/src/main/java/io/keikai/devref/usecase/DataTransformComposer.java#L42-L43).

```java
if(e.getRow() == 14 && e.getColumn() == 2)
	simpleWorkflow();
...
private void simpleWorkflow() {
spreadsheet.setSelectedSheet(SIMPLE_DISPLAY_SHEET);
}
```

With this, the user can directly go to the relevant page, without having control over the sheets. Since the user doesn’t use the sheet navigation or any of the menu and menubars, we can use configure Keikai not to display them. Here's an example, also available on [GitHub](https://github.com/keikai/dev-ref/blob/cd2b93d7d8356cc37caccb2f40f27fe6ea4c79da/src/main/java/io/keikai/devref/usecase/DataTransformComposer.java#L28-L34):

```java
	spreadsheet.setShowSheetbar(false);
	spreadsheet.setShowSheetTabContextMenu(false);
	spreadsheet.setShowToolbar(false);
	spreadsheet.setShowContextMenu(false);
	spreadsheet.setShowAddColumn(false);
	spreadsheet.setShowAddRow(false);
	spreadsheet.setShowFormulabar(false);
```

# Here's How it Looks

![]({{ site.baseurl }}/images/{{page.imgDir}}/sample.gif "Sample ") 

Vendor and admin can now access the form via a single link without having to email files around; edited data are saved immediately to the vendor DB eliminating manual input; updates are reflected in real-time; and the summary form makes it very easy to filter desired result — super easy to find out available vendors in a specific category.

# Conclusion
By making all of the calculations in the spreadsheet itself, and using Keikai to handle presentation and navigation, I’ve been able to set up a system where our business people can leverage their existing skills with spreadsheets to create shared data processor apps, with high flexibility and easy updates.


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
