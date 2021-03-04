---
layout: post
title:  "Give your classic spreadsheet a modern touch"
date:   2021-03-04
categories: "Application"
excerpt: “Keikai Spreadsheet - filling data automatically to your Excel templates.”

index-intro: "Leverage rich UI components to upgrade user’s spreadsheet experience."

image: "2021-03-moderntouch/modern_touch_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2021-03-moderntouch"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

Spreadsheets are no doubt the most popular business application – they are heavily used in all fields, favored by users from finance experts in Wall Street to top scientists in NASA. Spreadsheets allow users to calculate, organize and store data, and most important of all, analyze data without having to program.

Nowadays spreadsheets extend their reach more – they no longer sit inside a user’s Excel desktop application, they are now widely used online, either being embedded inside applications or run on an online platform like google sheets.

But when a spreadsheet goes online, can we do more than just duplicating Excel’s functionality into the browser?

# More Than a Spreadsheet

While spreadsheets are great for displaying tabular data, presenting forms or charts, it is not always great to display a large block of text or display images and other elements that have varied dimensions. 
This is where we can leverage today’s fancy and easy-to-use web UI components to work with an online spreadsheet and upgrade spreadsheet users’ experience.

![]({{ site.baseurl }}/{{page.imgDir}}/lXDAcAD.gif)


Here I am taking <a href="https://keikai.io/" target="_blank">Keikai</a> spreadsheet and a <a href="https://www.zkoss.org" target="_blank">ZK</a> <a href="https://www.zkoss.org/wiki/ZK_Component_Reference/Containers/Drawer" target="_blank">drawer component</a> as an example demonstrating how this can be done. In this example, we will add a slide-in/out Help panel to our spreadsheet where we can display large blocks of Help text in a much more easy-to-read format. 

 Let me show you how to build this page.

## Load the Form
I can load my `helpTemplate.xlsx` in a zul by specifying `src` at `<spreadsheet/>`.
`formHelp.zul`

```java
<spreadsheet id="ss" 
height="100%" width="60%" 
style="margin: 0 auto;" 
src="/WEB-INF/books/helpTemplate.xlsx"
maxVisibleRows="40" maxVisibleColumns="5"/>
```

Other attributes of the tag determine spreadsheet looking; please refer to <a href="https://doc.keikai.io/dev-ref/Control_Components" target="_blank">Keikai Developer Reference</a>.


## Put a help page along with Keikai
There are 5 blocks of numbers in the form above. Hence, I create an HTML page and put help descriptions into 5 different color boxes. Each box has a corresponding help box with the same background and title. So people who read the help page can easily identify which help text matches their needs for the current block.

![]({{ site.baseurl }}/{{page.imgDir}}/nQLlHnX.jpeg)


Then I use `<include>` component to include that help HTML into <a href="https://www.zkoss.org/wiki/ZK_Component_Reference/Containers/Drawer " target="_blank">`drawer`</a>.

```java
<spreadsheet .../>
<drawer id="helpDrawer" visible="false" 
position="right" width="40%">
	<include src="help.html"/>
</drawer>
```

* `visible="false"` means it's hidden by default, so you won't see the drawer at first. But users can click the "Help" cell to show the help.

Note, this is just a simple example; you can definitely put any other HTML content (images, videos...) to the help page based on your own context.

## Allow Users to Show Help Page
To show the help panel when a user clicks the Help button (cell), I need to add an event listener for the cell click event in a controller.
Keikai supports the MVC pattern, so it's better to implement my application logic in a controller better OO design. The controller looks like this:


```java
public class HelpTextComposer extends SelectorComposer {

    @Wire
    private Drawer helpDrawer;

    @Listen(Events.ON_CELL_CLICK + " = spreadsheet")
    public void showHelpText(CellMouseEvent e){
        Range cell = RangeHelper.getTargetRange(e);
        if (cell.getCellValue() != null 
          && cell.getCellValue().toString().equals("Help")) {
            helpDrawer.open();
        }
    }
}
```

* <a href="https://www.zkoss.org/javadoc/latest/zk/org/zkoss/zk/ui/select/SelectorComposer.html" target="_blank">`SelectorComposer`</a> helps me to get a reference of `helpDrawer` which is instantiated by <a href="https://www.zkoss.org" target="_blank">ZK Framework</a>. That's why I declare a variable of `Drawer` without instantiating its object.
* `@Listen` can register the method as an event listener for `Events.ON_CELL_CLICK` of the spreadsheet. So when a user clicks a cell, ZK will invoke this method.
* `RangeHelper.getTargetRange(e)` returns a `Range` that represents the clicked cell. Then I can check the cell's value by `cell.getCellValue().toString()` to know whether a user clicks the "Help" cell or not.
* `helpDrawer.open()` makes the drawer slide in.


# Summary
Spreadsheets are brought online for easier sharing and collaboration. But we can do more! This example uses Keikai Spreadsheet and ZK components to demonstrate how you can leverage rich UI components to upgrade user’s spreadsheet experience while preserving its benefits. 

# Source Code
You can see the complete source code in [Keikai developer reference repository](https://github.com/keikai/dev-ref/blob/master/src/main/webapp/useCase/formHelp.zul).




[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
