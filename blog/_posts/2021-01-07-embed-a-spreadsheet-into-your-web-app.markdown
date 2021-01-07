---
layout: post
title:  "Embed a Spreadsheet Into Your Web App"
date:   2021-01-07
categories: "Application"
excerpt: “Embed a Spreadsheet into Your Web Application - whether it is HTML, Python, Wiki page, or anything else!”

index-intro: "Embed a Spreadsheet into Your Web Application - whether it is HTML, Python, Wiki page, or anything else!"

image: "2021-01-embedded/embedded_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2021-01-embedded"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# Having an Embedded Spreadsheet Is Handy

Spreadsheets are used everywhere. There's no doubt that a spreadsheet application like Excel is one of the most popular business applications in the world. It is so easy that anyone can use it, yet it is so powerful that it enables experts in different fields to “code” their business logic in the simplest way possible.

A standalone spreadsheet is great for personal use, but it's hard to share. That is why Google Sheets was born. With Google Sheets, it becomes much easier to share and collaborate. But people want more - they want to have the sheet directly on their web pages; whether it is a web application, a wiki page, or a company website.

An easy way, like what Google Sheets offers, is to use an iframe to embed a spreadsheet into your web page. With a single iframe tag, you can easily display a spreadsheet on your web page. This is convenient if you wish to just “display” a sheet -- but if your web page needs to interact with the spreadsheet, then iframe becomes a barrier you need to cross. 

Here I’d like to introduce an example embedding a Keikai spreadsheet into any web page and interact with your page, no matter which platform your web application is based on e.g. Node.js, Python, or PHP.

# The Story
Assume you have an existing web application managing the inventory of your products, and now you are adding a new feature called "Stock Search". Users can input some criteria to search for in-stock goods from a database, and the application will show the result in a spreadsheet. Then users can edit the list and process it as needed. For example, a user can search for low-stock goods and edit and export the search result as an XLXS or PDF file, and send it to the vendor to place an order. Also when the user clicks on a specific good, it will show the vendor's contact information on the same row.

![]({{ site.baseurl }}/{{page.imgDir}}/usage.gif)

# Prerequisite
In this article, I will focus on "embedding" Keikai spreadsheet in an external app, and "the interaction" between the spreadsheet and the external page. Hence, I will assume the Keikai application is already built for "embedding" and "interaction". The external web page can be served by any non-Java server, e.g. a Node.js server.

For those who are interested in learning to build a Keikai application, please read the following articles:

* [Build a Web Application Based on Your Excel Files](https://dzone.com/articles/build-a-web-application-based-on-excel-files)
* [Turn Your Excel File Into a Web Application](https://dzone.com/articles/turn-you-excel-file-into-a-web-application)


# Architecture
The image below shows the relationship between the two applications and how the process of embedding Keikai works. Under this architecture, you still need to implement spreadsheet-related application logic in Java instead of other programming languages.

![]({{ site.baseurl }}/{{page.imgDir}}/architecture.jpg)

The process is:

1. A browser requests an HTML page of the stock search app
2. The HTML page requests a zul file of the Keikai-based app
3. Download Keikai-related JavaScript and render Keikai on the page


# Page Layout

I designed the page with the Bootstrap grid system and divided the page into rows. 

```html
<div class="container">
    <div class="row py-3">
    <!-- title -->
    </div>
    <div class="row justify-content-center py-1">
    <!-- search criteria input -->
    </div>
    <div id="embed">
   
    </div>
    <div class="row justify-content-end py-3 px-3">
    <!-- export button -->
    </div>
    <div class="row py-1 px-3">
    <!-- vender contact -->
    </div>
</div>
```

Only the spreadsheet is embedded with Keikai at `<div id="embed">`, so it's empty. Other HTML elements are already created on this page.


# How to Embed
Keikai is based on the [ZK UI framework](https://www.zkoss.org), which supports a feature to embed any zul page into HTML via a JavaScript API. Here, I briefly describe the major steps. For details, please refer to 
[ZK Developer's Reference Guide](https://www.zkoss.org/wiki/ZK_Developer%27s_Reference/Integration/Miscellenous/Embedded_ZK_Application).

## ZK embedded.js
First, you need to load a JavaScript API for embedding the Keikai-based application from an URL:

```html
<script id="embeddedScript" src="http://keikai-app/zkau/web/js/zkmax/embedded/embedded.js" />
```

`keikai-app` is just an example, you need to replace it with your Keikai application context root.

This JavaScript defines the zEmbedded API so that I can use it to embeda zul file.


## CORS
Because the stock search application is normally in a different domain from the Keikai-based application, you need to set the HTTP-header to allow Keikai resources to be loaded by a cross-origin request.

You need to set at least the following CORS headers:

```
Access-Control-Allow-Origin: [allowed embedding origins]
Access-Control-Allow-Headers: zk-sid
Access-Control-Expose-Headers: zk-sid, zk-error
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST
```

You can reference `CorsHeaderFilter` to set these headers.

Ref: [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)


## The API to Embed
Then, call the ZK embedding API, `zEmbedded.load()`, to embed zul into the HTML page like:

```javascript
zEmbedded.load('embed', 'http://keikai-app/useCase/stock-search.zul')
  .then(function(result) {
    zk.log('keikai is embeded!' + result.widget.uuid); //result contains the first widget
  }).catch(reason => {
    alert('ZK mounting error: ' + reason);
});
```

The URL, `http://keikai-app/useCase/stock-search.zul`, is the same URL as the one you visit with a browser.

### Anchor Element
The first parameter, `embed`, is the anchor element ID that Keikai will render itself in. It's just a `<div id="embed">` in my example.



# Communication between a Web Page and Keikai
After embedding Keikai, you can see the file rendered in the HTML page, and you can edit and scroll. But it still lacks communication between the HTML page and Keikai itself. I will explain how to do this by implementing "search product" and "show vendor contact information".

## Java Controller
There is a Java controller applied on Keikai at the server-side. If you check `search-stock.zul`, you will see a class name at `apply`:

```xml
 <spreadsheet ... apply="io.keikai.devref.usecase.embed.StockSearchComposer"/>
```

The controller can receive the events from the client-side, query products from a database, and contain event listeners with application logic like exporting, accessing cell values.

## Fire Events to the Server
ZK framework supports the event-driven programming model. So the main way to communicate with the Keikai controller is to fire an event in JavaScript. The Keikai spreadsheet will create a JavaScript widget in the browser, and it provides the function `fire()` to fire events to the Keikai Java controller.

## Export XLSX and PDF
I have defined the event name, `onExportExcel`, in the Java controller. So what I now have to do is to fire the event at the client-side to invoke the event listener of the Java controller:


```js
$('#exprtExcel').on('click', () => {
    Controller.fireEvent('onExportExcel', null);
});
```

The ZK framework contains [jQuery](https://jquery.com/) by default, so you can use `$('#exprtExcel').on()` to register an `onclick` listener on the button `<button id="exprtExcel" class="btn btn-primary">Export to Excel</button>`.


### XLSX Exporter
In the server-side controller, I implement exporting with Keikai's `Exporter` in a few lines.

```java
    private Exporter exporter = Exporters.getExporter();

    @Listen("onExportExcel = spreadsheet")
    public void exportExcel() throws IOException {
        File file = File.createTempFile(Long.toString(System.currentTimeMillis()), "temp");
        try (FileOutputStream fos = new FileOutputStream(file);) {
            exporter.export(spreadsheet.getBook(), fos);
        }
        Filedownload.save(new AMedia(spreadsheet.getBook().getBookName(), "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", file, true));
    }
```

Exporting a PDF is quite similar, please check the source code on Github.

## JavaScript Controller on the HTML Page

To avoid potential function name conflict, I put the event firing functions into a JavaScript class called `Controller`:

```java
class Controller{
    /** fire an event to invoke an event listener at the server-side */
    static fireEvent(eventName, parameter){
         Controller.getSpreadsheet().fire(eventName, parameter, {toServer:true});
    }

    /** get keikai spreadsheet js widget by ID selector "$id" */
    static getSpreadsheet(){
        return zk.Widget.$('$spreadsheet');
    };
```

### ZK Widget Selector
[`zk.Widget.$(mySelector)`](https://www.zkoss.org/javadoc/latest/jsdoc/zk/Widget.html#Z:Z:D-zk.Object-_global_.Map-) is a function that can get a ZK widget reference by a selector syntax. The ID `spreadsheet` is the value specified in the "id" attribute of `<spreadsheet>` in `stock-search.zul`.



## Search Products With Criteria
When a user clicks the "Search" button, this application can show products in the sheet based on the criteria.


### Firing an Event at Client-side
You can follow a similar pattern to invoke the `onSearch` event listener, but this time I need to pass search criteria as the second parameter. 

```js
$('#search').on('click', () => {
    Controller.fireEvent('onSearch', Controller.getFilterCriteria());
});
```

Extract user input as a JSON object:

```js
class Controller{
    ...

    static getFilterCriteria(){
        return {"category": $('#category').val(),
                "min": $('#min').val(),
                "max": $('#max').val()};
    }
```

### Receive the Parameter

Through `event.getData()`, I can get a JSON object sent from the client side and convert it to `FilterCriteria`:

```java
    @Listen("onSearch = spreadsheet")
    public void search(Event event) {
        FilterCriteria criteria = convertCriteria((JSONObject) event.getData());
        List<Product> result = productService.query(criteria);
        populateResult(result);
    }
```
* Line 1: The annotation to register an `onSearch` event listener on the component `spreadsheet`.
* Line 4: The `productService` just represents a business layer classes, it can return a list of products upon given criteria. You can imagine that class as any of your business class, just to perform a business operation.

### Populate the Result

To populate the product list into the sheet on the browser, you need to call an important API `Range`. There are two basic steps:

1. Create a `Range` object that represents one or multiple cells, e.g. `Ranges.rangeByName(resultSheet, "ReportTable")`
2. Call `Range` methods to get or set data on that range, e.g. `setCellValues()`

```java
    /**
     * populate search result into a sheet
     */
    private void populateResult(List<Product> result) {
        ...
        //fill searched products
        Range currentRow = Ranges.rangeByName(resultSheet, "ReportTable").toCellRange(0, 0).toRowRange(); //start from the first row
        for (Product p : result) {
            currentRow.setCellValues(p.getId(), p.getCategory(), p.getName(), p.getVendor(), p.getQuantity(), p.getPrice());
            currentRow = currentRow.toShiftedRange(1, 0);
        }
        ...
```

After invoking the event listener, Keikai will communicate with the client-side widgets to render cell values on the sheet. I don't need to take care of communication and rendering details.

For more APIs, please refer to the [Keikai Developer Reference Guide](https://doc.keikai.io/dev-ref/book_model/Cell_Data).


## Show a Vendor Contact
When a user clicks on a cell, it will show the vendor contact information at the bottom of the page from the server-side. This demonstrates how a sheet interacts with a page (triggered inside a sheet).

### Invoke JavaScript Functions 

The Java method, `Clients.evalJavaScript()`, allows you to call a JavaScript function in a browser. That's how Java controllers call the client-side JavaScript controller's function, `Controller.showVendor()`.

In this example, I assume the server has the vendor data. Therefore, I register an `Events.ON_CELL_CLICK` listener that queries a vendor by its name. Then, every click on a cell invokes this method:

```java
    @Listen(Events.ON_CELL_CLICK + " = spreadsheet")
    public void showVendor(CellMouseEvent event){
        //get vendor name
        Range vendorCell = RangeHelper.getTargetRange(event).toRowRange().toCellRange(0, 3);
        String name = vendorCell.getCellData().getStringValue();
        VendorService.Vendor vendor = VendorService.query(name);
        if (vendor != null){
            Clients.evalJavaScript("Controller.showVendor(" + gson.toJson(vendor) + ")");
        }
    }
```

* Line 4: I locate the cell of the vendor name based on the row the user-clicked row and find its fourth column cell.
* Line 5: Get the cell value as a String.
* Line 8: Invoke a JavaScript function with a vendor JSON object as a parameter.



### Render the Vendor Contact
At the client-side, I simply just render the vendor contact on the page with jQuery:

```js
class Controller{

    /** render vendor info on the page
    */
    static showVendor(vendor){
        $('#name').text(vendor.name);
        $('#tel').text(vendor.tel);
        $('#email').text(vendor.email);
    }
```

# Summary
To wrap up I have demonstrated how you can embed a spreadsheet into any web page, and how the spreadsheet can interact with the web page in both directions. I hope this helps you to bring spreadsheet power into your web applications easier.


# Get the Source
The [GitHub repository](https://github.com/keikai/dev-ref/blob/master/src/main/webapp/useCase/stock-search.html) contains the runnable code so that you can try it by yourself.



[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
