---
layout: post
title:  "Build a Web Application Based on Your Excel Files"
date:   2020-02-11
categories: "Application"

index-intro: "A Web Application Based on Your Excel Files<br/>
<br/>
This article demonstrates how to build a spreadsheet application based on an Excel file.
 "

image: "2020-02-build/displaytable.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2020-02-build"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# Database Table Access Application
Lots of companies operate their business with Excel for decades. They have the biggest issue is: it's hard to integrate an Excel file in a web application, especially with a database. If you just upload an Excel file as a attachment and download it to edit for each time. Then you just use Excel in another way. That's not an integration. In this article, I present you a solution to make an Excel file work seamlessly in a web appliation with a database.

Assume you have a table of trade records in a database, you need to show those trade records in an spreasheet-like UI, so users can edit and calculate numbers with formulas. Besides, the color, format, and style might need to change upon user preference from time to time, so it should be easy to update in the future. 


# Template-based Approach
To fulfill the requirements above, I introduce you a template-based approach: use an Excel file as a template and populate the data from a database into the template. In architectural view, I divide the application into 3 parts: **Model, View, Controller**.

* **Model**: the data from the database
* **View**: the template file
* **Controller**: listener to events from the View and populate data from the database

Mapping them to my implementation, it is:

Keikai (View)  ---- `DatabaseComposer` (Controller) ---- `MyDataService` (Model)

# How to Implement
Assume there is a trade record table:

![]({{ site.baseurl }}/{{page.imgDir}}/table.png)

Prepare an Excel file as a template:

![]({{ site.baseurl }}/{{page.imgDir}}/template.png)

Combine the template and the data, my web application finally looks like:

![]({{ site.baseurl }}/{{page.imgDir}}/displayTable.png)

An end user can:

* edit cells and save back to the database
* reload the data from the database


## Build the UI
In this application, I rely on a web spreadsheet component, [Keikai](https://keikai.io), which is based on [ZK UI framework](http://www.zkoss.org). Hence, I can build the UI in a zul with various ZK components. ZUL is the XML format language, each tag reprensents a component, so I can create UI like:

{% highlight xml linenos %}
<spreadsheet id="ss" width="100%" height="200px"
                showFormulabar="true" showContextMenu="false" showToolbar="false"
                showSheetbar="false" maxVisibleRows="11" maxVisibleColumns="4"
                src="/WEB-INF/books/tradeTemplate.xlsx"/>
<div style="margin: 10px 5px 10px 0px; text-align: right">
    <button id="save" label="Save to Database" />
    <button id="load" label="Load from Database" disabled="true"/>
</div>
{% endhighlight %}

* Line 4: you can also load a file dynamically via Java API, [Spreadsheet::setSrc](https://keikai.io/javadoc/latest/io/keikai/ui/Spreadsheet.html#setSrc-java.lang.String-) or [Importer](https://keikai.io/javadoc/latest/io/keikai/api/Importer.html).


Keikai can load an Excel file and render its content in a browser. Then end users can view and edit with Keikai's UI.


## Controller
The controller for Keikai is a Java class that extends ZK `SelectorComposer`, and it interacts with the database via `MyDataService`. 

{% highlight java linenos %}
public class DatabaseComposer extends SelectorComposer<Component> {

    private MyDataService dataService = new MyDataService();
    @Wire
    private Spreadsheet ss;
 ...   
}
{% endhighlight %}

* line 4: With [`@Wire`](https://www.zkoss.org/wiki/ZK%20Developer's%20Reference/MVC/Controller/Wire%20Components) on a member field, the underlying ZK framework can inject keiaki `Spreadsheet` object created according to the zul, so that you can control keikai with its method.

### Apply to the page
We need to link `DatabaseComposer` with the zul page (database.zul), so that the controller can listen to events and controll components via API. 

Specify the full-qualified class name at `apply` attribute, then Keikai will instatiate it automaticaly when you visit the page. The controller can contoller the root component, `<hlayout>`, and all its children components (those inner tags).

```xml
<hlayout width="100%" vflex="1" apply="io.keikai.tutorial.database.DatabaseComposer">
...
    <spreadsheet />
<hlayout>
```

## Range API
For each cell/row/column operation, you need to get a `Range` object first. It could represent one or more cells, a row, a column, a sheet, or a book. Just like you need to select a cell with your mouse before you take any edit action. 

The helper class `Ranges` supports various methods to create a `Range` object like:

```java
// a book
Ranges.range(spreadsheet.getBook());
// a sheet
Ranges.range(spreadsheet.getSelectedSheet());
// a row
Ranges.range(spreadsheet.getSelectedSheet(), "A1").toRowRange();
// a cell
Ranges.range(spreadsheet.getSelectedSheet(),  3, 3);
// multiple cells
Ranges.range(spreadsheet.getSelectedSheet(), "A1:B4");
Ranges.range(spreadsheet.getSelectedSheet(), 0, 0, 3, 1);
```
Getting a `Range` for one cell requires a sheet, row index, and column index as the coordinate, and getting multiple cells requires starting and end row/column index.

With a `Range` object, you can perform an action like `setValue()` or `getValue()`.




## Populate Data into Cells
After you query one or more `Trade` from the database, you can populate it into the target cells with `Range` setter:

```java
//column index
public static int ID = 0;
public static int TYPE = 1;
public static int SALESPERSON = 2;
public static int SALES = 3;
...
private void load(Trade trade, int row) {
    Sheet sheet = ss.getSelectedSheet();
    Ranges.range(sheet, row, ID).setCellValue(trade.getId());
    Ranges.range(sheet, row, TYPE).setCellValue(trade.getType());
    Ranges.range(sheet, row, SALESPERSON).setCellValue(trade.getSalesPerson());
    Ranges.range(sheet, row, SALES).setCellValue(trade.getSale());
}
```

### Listen to Events
There are 2 buttons on the page that we need to listen to their click event and implement related application logic. Specify 2 buttons' id, so that you can easily listen to their events.

```xml
<button id="save" label="Save to Database" />
<button id="load" label="Load from Database" disabled="true"/>
```

Annotate a method with [@Listen](https://www.zkoss.org/wiki/ZK_Developer%27s_Reference/Event_Handling/Event_Listening#Composer_and_Event_Listener_Autowiring) to turn it as an event listener method with CSS selector-like syntax below:

```java
@Listen("onClick = #load")
```

 That means you want to listen `onClick` event on `#load` which represents a component whose ID is `load`. For more syntax, please refer to [`SelectorComposer` javadoc](http://www.zkoss.org/javadoc/latest/zk/org/zkoss/zk/ui/select/SelectorComposer.html). Therefore, when a user clicks "Load from Database" button, `DatabaseComposer::load()` will be invoked.


```java
//Load from Database
@Listen("onClick = #load")
public void load(){
    reload();
    ...
}

//Save to Database
@Listen("onClick = #save")
public void save(){
    dataService.save(modifiedTrades);
    ...
}
```
Then, you can implement related application logic in each listener according to the requirements.


### Save Data into a Table
Before you save a `Trade`, you need to extract user input from cells with getter. You still need a `Range` but you will call getter this time like:

{% highlight java linenos %}
private Trade extract(int row ){
    Sheet sheet = ss.getSelectedSheet();
    Trade trade = new Trade(extractInt(Ranges.range(sheet, row, ID)));
    trade.setType(Ranges.range(sheet, row, TYPE).getCellEditText());
    trade.setSalesPerson(Ranges.range(sheet, row, SALESPERSON).getCellEditText());
    trade.setSale(extractInt(Ranges.range(sheet, row, SALES)));
    return trade;
}

private int extractInt(Range cell){
    CellData cellData = cell.getCellData();
    return cellData.getDoubleValue() == null ? 0 : cellData.getDoubleValue().intValue();
}
{% endhighlight %}

* line 12: Beware - if a cell is blank, `CellData::getDoubleValue()` returns null.


## Persistence Layer Class
To make thing easy to understand, I create a class `MyDataService` to handle query and update for the (simulated) database. It can query a collection of `Trade` objects for us to populate into Keikai and save `Trade` objects into the database.

In your real application, you can implement your own persistence layer classes according to your preference. There's no limitation here, you can use Hibernate or JDBC or any Java solutions you like.



# Benefits
You can benefit from the template-based approach including:

## Maintain templates by domain experts.
If you build a finance system, then it's better to let finance experts create their sheets instead of software developers. With this approach, domain experts can create/maintain Excel templates by themselves without communicating to a software developers. After an Excel file is modified, developers just imports the new file again without affecting other Java codes.

## Decouple the Display and Data
Since the data is not stored in the file, it's effortless to change both side: **template** and **data**. You can either apply another a template or import a different set of trade records according to differnt contexts.

## Easy to integrate with other back-end systems
Because Keikai is controlled by a Java controller class only, it's painless to integrate any Java-based backend and there is no limit for connecting a database.


# Source Code
Check [github](https://github.com/keikai/keikai-tutorial) to get the complete source code mentioned in this article.

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help