---
layout: post
title:  "Excel UI with Java flexibility: merging spreadsheet data in Keikai" 
date:   2020-06-10
categories: "Application" 
excerpt: “Turn excel to web and improve formula efficiency with Java - take budget template as example.”

index-intro: "
Extend available excel functionality with customized workflows.
"
image: "2020-06-merge/merge_cover.png"
tags: developer
author: "Matthieu Duchemin"
authorImg: "/images/author/matt.jpg"
authorDesc: "Developer, Keikai."


imgDir: "2020-06-merge"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

# Introduction

There is a common end-goal to most sheet of formatted data. We want to analyze, compare and use the full dataset that we have gathered.

If the data have been gathered in separate sheet and tables, sometime with duplicated entries, we need to be able to merge all of it into a simple easy-to-use table.

This is where things usually get complicated. In the end, some will usually end-up copying and pasting rows of data from the individual sheets to the summary table.

# Real-world example

Take for example budgeting. Even if your organization only has four departments, you will end up with four different budget sheets. Some of them will have duplicated expenses between departments. For example, wages and salaries will be an item for any organizational units. Some of them will be unique for a specific team, such advertising being exclusive to the marketing department. And then some will be shared by only a few – but not all – of the teams, or even duplicated inside of a team’s sheet.

On top of that, each sheet must be filled by a different team manager, which usually ends up with multiple copies of the same file being passed around through emails.

This all culminates with the last person in the chain receiving five versions of the same file, some containing old data, some incomplete and one of them inexplicably blank. It takes a lot of effort and a significant amount of time to take this wildly divergent dataset and make it exploitable.


## Requirements of the summary sheet

We want to improve it in two ways. First, we need to make sharing and collaborating much easier. The data-entering process should be streamlined, should have single point of access, and should be accessible to any designated users.

We also need to improve on the sheet workflow itself. Excel formulas can be powerful in many situations, but they also have their limits. We already have our formulas set up in this document to calculate sums, ratios, averages, etc. inside each department sheet. These, we will absolutely keep. This is where Excel’s formulas work at their best, and we will rely on Keikai to simply use what we already have.

On the other hand, Excel formulas are not ideal to perform dataset operations. Searching, merging and filtering are possible, but they take significant time to set up and execute. They are also fragile and often rely on static sheet layouts in order to be maintained. Keikai operate in a Java web server, so we will improve our workflow by delegating the data manipulation to this layer. 

In this case, we need to generate two merged summaries of the data. One merged per period, and the other merged per department.

The “per period” table will need to merge every entry using the same label and sum their values depending on each of the yearly periods (Q1 to Q4).

The “per department” table will need to merge every entry using the same label and sum their values depending on the department declaring this expense.
If we were to create these in Excel, we would either need complicated formulas checking and matching results from each of the source tables, or we would need to use custom merging queries.


## Limitations of the pure Excel workflow

A staple of Excel “search and retrieve” formula is VLOOKUP. It is a reasonable formula to use in isolation, but for the purpose of filtering and merging a large set of values, it has a major issue: each cell using this formula will multiply the processing time. A simple way of thinking about it is that if a single VLOOKUP takes X milliseconds to complete, a sheet with N Cells using VLOOKUP will use (X)N milliseconds to complete.

It doesn’t seem much when your sheet only contains 10 rows, but we all know that in the real world, an expense sheet seldom contains “only ten rows”, and that at some point someone is bound to request a report on the last 10 years of activity. That would be the point where this exponential processing time will transition from obvious to crippling.

This is far from the only formula-based processing to suffer from complexity and efficiency ceilings in pure Excel. In the classic case, the formulas themselves are part of the worksheet, and can be affected by changes in the sheet, and must be protected to prevent the end-user from modifying them.

# Keikai java workflow improvements

First, we will make this existing document into a Keikai powered web page. The first benefit is immediate and obvious. No more emails, no more duplicated files. Everyone is working on the same document, and at the same time. Collaboration mode brings even more advantages since you can see other user’s activity in real time and adjust your entry accordingly.

As we are working with Keikai, there is a more powerful way to achieve this. Keikai relies on a Java server, and as such we can run java code on specific sheet events.

We have access to server-side Java programming which means that we can implement efficient algorithms instead of chaining functions.
This will become more visible with each additional line of data.


## Implementation logic

In this example, we are retrieving mixed data from individual sheet. Each of the sheet follows the same format, so we can use the same “get entries from sheet” method for each of the sheets. This said if we had multiple structures, we could make individual “get entries from sheet” methods to match each of the table structures used.

This let us build a full dataset of each individual rows, represented by the BudgetEntry java class. These objects have getters to retrieve the values relevant for this workflow: The expense label, the expense source department, and the values for each of the periods.

We then pass this dataset to our merge functions. Once again, since we work in pure Java code, we can use performant algorithms and obtain a linear processing time. If processing 1 entry takes X milliseconds, then processing N entries takes N*X milliseconds.

The merging itself can be as simple as reading each entry in the full dataset and adding its value to the relevant output. How this merge operation behaves is entirely up to us. Do we want to sum up duplicated entries or do we want to display them as individual items? This is just one of the choices we can make at this stage.

Each of our merging functions will generate a merged dataset that we will use to write data back to the sheet.

As with the “get entries from the sheet” step, the “write data to the sheet” methods can be customized to any target sheet structure.
Since the spreadsheet format is great for tabular data, we will simply take the list of entries and write them one by one in a table for each of our merged datasets.

![]({{ site.baseurl }}/images/{{page.imgDir}}/merge_workflow.png "Merge Workflow") 

#Implementation

Now that we know what we are doing, let us look at how exactly we are doing it. In this section, I will mention the key technical steps for this workflow
Registering an event listener

There are multiple ways to register an event listener. We are working in Keikai + ZK, so we can use any of the [event listener structures](https://www.zkoss.org/wiki/ZK_Developer's_Reference/Event_Handling/Event_Listening).

In this case, I chose to use the `@Listen` annotation. With this syntax, I listen to events of type `ON_SHEET_SELECT` sent by components of type “spreadsheet”.

Since I don’t need to re-calculate the summary tables when navigating to the department entry sheets, I have also added an if statement to only do the merge workflow if I’m selecting the summary sheet. 

```java
@Listen(io.keikai.ui.event.Events.ON_SHEET_SELECT + "=spreadsheet")
public void onCellClick(SheetSelectEvent e) {
	String sheetName = e.getSheet().getSheetName();
	if(SUMMARY_SHEET_NAME.equals(sheetName)) {
		doMergeWorkflow();
	}
}
```
[Code sample on GitHub](https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/budget/BudgetComposer.java#L52)

#Retrieving data from a table

The first step of my workflow is to retrieve the data rows from each of the tables. In my case, all the entry tables have the same structure, so I can re-use the same data-extractor method.

I start by creating an empty List `sheetEntries` to hold the result objects. Then, I iterate over the list of available sheets and run the “getBudgetEntries” method for each of these sheets.

Since the tables have received names, I can simply use `Ranges.rangeByName(book, name)` to retrieve the Range containing the data and pass it to the “getBudgetEntry” method.

I collect all the resulting rows into sheetEntries which becomes my full dataset.

```java
private List<BudgetEntry> getBudgetData(){
	List<BudgetEntry> sheetEntries = new ArrayList<BudgetEntry>();
	for (Map.Entry<String, String> sheetNamesEntry : sheetNames.entrySet()) {
		sheetEntries.addAll(getBudgetEntries(Ranges.rangeByName(spreadsheet.getBook().getSheet(sheetNamesEntry.getKey()), sheetNamesEntry.getValue()),sheetNamesEntry.getKey()));
	}
	return sheetEntries;
}
```
[Code sample on GitHub](https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/budget/BudgetComposer.java#L89)

The `getBudgetEntry` method is where we extract data from the sheets. We simply iterate over the range rows with a for loop.

Inside of this loop, we iterate over the columns and retrieve the values of the cells one by one using `cellRange.getCellValue()`.

For each of these rows, we create a new BudgetEntry object and return the list of entry generated as result of this method.

```java
private Collection<? extends BudgetEntry> getBudgetEntries(Range dataRange, String deptName) {
	List<BudgetEntry> entries = new ArrayList<BudgetEntry>();
	for (int i = dataRange.getRow(); i < dataRange.getRow() + dataRange.getRowCount(); i++) {
		List<Number> periodList = new ArrayList<Number>();
		for (int j = 1; j <= 4; j++) {
			periodList.add((Number)Ranges.range(dataRange.getSheet(), i, j).getCellValue());
		}
		entries.add(new BudgetEntry((String)Ranges.range(dataRange.getSheet(), i, 0).getCellValue(),deptName, periodList));
	}
	return entries;
}
```
[Code sample on GitHub](https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/budget/BudgetComposer.java#L97)

## Merging datasets

As mentioned above, this is pure data manipulation in Java code. There is no Keikai or ZK feature used here, and we are free to implement this merging operation as we want.
I have made the choice to only run through the initial result list once for efficiency, but there we can pull from the large pool of existing [algorithms](https://en.wikipedia.org/wiki/Merge_algorithm).

[Code sample on GitHub](https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/budget/BudgetComposer.java#L109-L137)

## Writing back to the sheet

Once we have merged our main dataset into two exploitable summary sets, we only need to write them back to the sheet.

This is almost identical to the reading process, except instead of using `.getCellValue()` to retrieve data, we will use `.setCellValue()` to write data back to the sheet.

```java
private void fillPeriodTable(Range periodTable, Map<String, List<Number>> mergedMap) {
	for (int i = periodTable.getRow(); i < periodTable.getRow() + periodTable.getRowCount(); i++) {
		String rowLabel = (String) Ranges.range(periodTable.getSheet(), i, 0).getCellValue();
		for (int j = 0; j < 4; j++) {
			Ranges.range(periodTable.getSheet(), i, j+1).setCellValue(mergedMap.get(rowLabel).get(j));
		}
	}
}	
```
[Code sample on GitHub](https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/budget/BudgetComposer.java#L70)

# The Resulting App

Here’s a short video of the updated workflow:

![]({{ site.baseurl }}/images/{{page.imgDir}}/merge_result.gif "Resulting Workflow") 

Every team leader can now work on the same document directly, and the Java workflow offer a quick and efficient summary of the data based on our customized merging workflow.

# Conclusion

By balancing the use of default spreadsheet features and leveraging the unique possibilities of extracting data from the sheet to highly customizable Java coding layer, we can create efficient workflows that make full use of both the relations between cells in the sheet, and the power of a full coding language.


The whole runnable project is available on [GitHub](https://github.com/keikai/dev-ref).

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
