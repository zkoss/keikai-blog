---
layout: post
title:  "Bringing intuitive input controls to the web spreadsheet user experience with Java"
date:   2021-05-20
categories: "Application"
excerpt: “Introducing specialized input methods in clickable cells to improve user experience while entering complex data.”

index-intro: "Introducing specialized input methods in clickable cells to improve user experience while entering complex data."

image: "2021-05-insheetcontrol/insheet_control_cover.png"
tags: developer
author: "Matthieu Duchemin"
authorImg: "/images/author/matt.jpg"
authorDesc: "Developer, Keikai."


imgDir: "/2021-05-insheetcontrol"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->



# Introduction

A spreadsheet is a particularly useful way to display and exploit tabular data, or just formatted content. Generally, the user will fill in data simply by typing it and modify the properties of cells using the sheet controls.

However, some data types can be challenging for free typing. A date can be easily misinterpreted if the format is incorrect for example. Or you may need the user to freehand a signature before printing.

In this article we will demonstrate an example of integrating intuitive input controls to a spreadsheet to bring better usability. 

# Mapping data types to appropriate controls

Assume we have an Excel scoresheet with different data types that the user is required to fill. We assign points to three different teams, which are calculated from a base value, and multiplied by a coefficient.

Each team is also assigned a color.

Once the form has been filled, it is dated and signed for approval. 

![]({{ site.baseurl }}/images/{{page.imgDir}}/full-form.png "Full Form") 

Now the goal is to replace these free-tying input spreadsheet fields with the matching web components to upgrade the usability and lower the risks of getting incorrect data. In this example I am using ZK Framework to do the work.

Coefficient: Since this is a percentage value bounded between 0 and 100%, we can represent it with a simple slider.

![]({{ site.baseurl }}/images/{{page.imgDir}}/comp1-slider.png "slider") 

Score: A simple integer value, it is easily filled in with a spinner to support increments and decrements.

![]({{ site.baseurl }}/images/{{page.imgDir}}/comp2-spinner.png "spinner") 

Team color: the colorpicker component is a natural fit to let the user choose either a preset or a custom-picked color.

![]({{ site.baseurl }}/images/{{page.imgDir}}/comp3-colorpicker.png "colorpicker") 

Date field: The calendar component is a great fit to select a date without running into formatting or date calculation difficulties.

![]({{ site.baseurl }}/images/{{page.imgDir}}/front.png) 

Signature: The signing action require a dedicated freehand signature input such as the signature component. The resulting image can be added simply by adding an image to the spreadsheet.

*Drawing in the signature box:*

![]({{ site.baseurl }}/images/{{page.imgDir}}/group-2.png) 

*Embedded result as image in the sheet:*

![]({{ site.baseurl }}/images/{{page.imgDir}}/group-1.png) 

## Implementation

The following implementation is available as a runnable sample in <a href="https://github.com/keikai/dev-ref/blob/master/src/main/webapp/useCase/scoresheet.zul" target="_blank">this github repository</a>.

## General design
In this page, we rely on the spreadsheet as the main user-interactable item. The spreadsheet will act as the entry point for each of the workflows we will implement.

When the user clicks on a marked area of the spreadsheet, we will open a ZK popup containing a ZK input method appropriate for the data type used in the cell. A percentage will be matched to a slider, etc.

Once the input component has registered a change, we will close the popup and write the result of the component input back to the main spreadsheet, at the relevant location based on the cell that was clicked.

This returns the focus back to the main spreadsheet, and let the user make additional operations, such as opening a different popup on a different cell.

## Spreadsheet design
By their nature, spreadsheets are highly mutable. They can be modified by any user, and the ability to quickly update a sheet to match the latest requirements is a valuable feature.

As such, we want to avoid using hardcoded cell positions in our page logic. Let us say we were to choose an arbitrary cell for one of our fields, for example A10. If another line is added to a table, or deleted entirely, the location of that field may have moved to cell A9, or A11.

A better way to map our fields to our logic is to use named ranges. Named ranges are an easy way to “tag” a cell or a collection of cells with a user-defined name.

For example, in our current sheet, Cell D13 is the current team A total. 

Here's a sample of the spreadsheet available in the <a href="https://github.com/keikai/dev-ref/blob/master/src/main/webapp/WEB-INF/books/scoresheet.xlsx" target="_blank">git repository</a>.

![]({{ site.baseurl }}/images/{{page.imgDir}}/1.png) 

We can define these names simply using the name field, or by using a more in-depth feature like the name manager.

![]({{ site.baseurl }}/images/{{page.imgDir}}/2.png) 

## Keikai events

We are using a <a href="https://keikai.io/" target="_blank">Keikai spreadsheet</a> as the main component of our page. As a component of a <a href="https://www.zkoss.org/" target="_blank">ZK page</a>, the spreadsheet can listen to certain events triggered by the end-user. Our main control source is the page composer. A page composer is the java class controlling the page.

In this case, we will listen to the mouse click event when triggered on the spreadsheet, using the Listen annotation from our <a href="https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/ScoresheetComposer.java" target="_blank">SelectorComposer</a>.

```java
@Listen(Events.ON_CELL_CLICK + "=spreadsheet")
public void onCellClick(CellMouseEvent e) {
    if (RangeHelper.isRangeClicked(e, teamRange))
        contextPopupTeamColor(e);
```

The event will provide information regarding the cell that was clicked.

If the cell is in one of the named ranges defined in our spreadsheet, we can decide to do something relevant for each specific ranges.

# Component wiring in depth
The wiring of each of these components is done under the same principles.


## Creating a popup
The popup is a component. Its function is to act as a container for other components and be displayed at a given anchor in the page. The anchor can be the mouse position, or a different component already existing in the page.

We simply <a href="https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/ScoresheetComposer.java#L114" target="_blank">instantiate a popup component</a> and add it to the page:

```java
Popup pop = new Popup();
pop.setPage(spreadsheet.getPage());
```

## Listening to component events
The thing we need to put in place is the event listeners to be invoked when the end-user interact with the input components. In this example, we want to <a href="https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/ScoresheetComposer.java#L116" target="_blank">listen to the ON_CHANGE event</a>, which is triggered when the calendar’s date is changed.

```java
calendar.addEventListener(org.zkoss.zk.ui.event.Events.ON_CHANGE, (Event evt) -> {
    targetCell.setCellValue(calendar.getValue());
    pop.close()
    spreadsheet.focus();
});
```

The event listener code will be invoked when the user perform the related action in the UI. Once the event is capture, we can use the <a href="https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/ScoresheetComposer.java#L117" target="_blank">setCellValue</a> method (in this case) to change the properties of the target cell accordingly.

# In conclusion
In addition to using the already powerful features of a spreadsheet, we can add more options for user interactions and workflows.

The spreadsheet itself is very user friendly due to familiarity, and the addition of java-based programming and the whole range of additional controls from the web multiply its capabilities.








[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
