---
layout: post
title:  "Protect Formulas in a Web Spreadsheet Application"
date:   2020-08-20
categories: "UseCase"

index-intro: "Protect your secret formulas while sharing your analysis spreadsheet online."

image: "2020-08-protectformulas/protect_formula_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2020-08-protectformulas"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# The User Story

One of our customers is a financial professional who manages financial risks for his clients. He develops a tool based on Excel to analyze the risk of investments and forecast the market trend. He creates many valuable formulas in his Excel file that help him do the job.

Now he plans to turn this tool into a web application that allows users to input financial data and produces a risk analysis result. But he wants to hide his valuable formulas since that's his business secret.

![]({{ site.baseurl }}/{{page.imgDir}}/flow.png)


# Overall Process

We can implement his plan with Keikai. The overall idea of this system is like:

![]({{ site.baseurl }}/{{page.imgDir}}/overall_flow.jpg)

Therefore, I create an xlsx file with 3 sheets:

- **source sheet**: accept user input
- **transform sheet**: calculate results with formulas by referencing cells in the source sheet. To protect the valuable formulas, this sheet is **hidden** from users.
- **display sheet**: display the calculation result to users.


# Import xlsx File

By specifying the path of an xlsx file, I can import it into Keikai.

`dataTransform.zul`

```java
    <spreadsheet height="100%" width="100%" src="/WEB-INF/books/transform.xlsx"
                 maxVisibleColumns="15" maxVisibleRows="20"
                 apply="io.keikai.devref.usecase.DataTransformComposer"/>
```

Because Keikai supports MVC pattern, I can also apply a Controller `DataTransformComposer` to manipulate Keikai and listen to events in Java API.

This is the imported result in a browser:

![]({{ site.baseurl }}/{{page.imgDir}}/data_transform_screenshot.png)

As you can see in the screenshot, there is no sheet tab. Keikai allows you to hide the sheet tab. Hence, users can't switch to the sheet that contains the formulas.


# Formulas Supported

Keikai supports [most of the Excel functions (over 250)](https://doc.keikai.io/dev-ref/Supported_Formula_Functions) and syntax. Keikai can import the formulas you write in Excel without any modification and they will work as they were.

# Protect Sheets

I don't want users to arbitrarily change my sheet, so I want to enable sheet protection. Before that, I need to create a `SheetProtection` with proper permissions. There are 14 permissions to choose. Keikai provides a Builder pattern API, so I can just setup those permissions I care:

```java
private static final SheetProtection VIEW_ONLY = SheetProtection.Builder.create()
.withSelectLockedCellsAllowed(true)
.withSelectUnlockedCellsAllowed(true)
.withAutoFilterAllowed(true)
.build();
```

Then, I enable sheet protect in a loop with `SheetProtection`:

```java
    private void protectAllSheets() {
        for (int i = 0; i < spreadsheet.getBook().getNumberOfSheets(); i++) {
            Ranges.range(spreadsheet.getBook().getSheetAt(i)).protectSheet(VIEW_ONLY);
        }
    }
```

# Unlocked Cells

Under the sheet protection, every cell is read-only. But I still need to accept user input in the source sheet, so I need to set several cells as unlocked in Excel to make them editable. Just open cell format / Protection, uncheck "Locked":

![]({{ site.baseurl }}/{{page.imgDir}}/lock.png)

# Listen to Cell Click

There are 2 cells working as buttons. When users click them, Keikai will calculate and show the result. I have to implement this logic in my controller class by the code below:

```java
    @Listen(Events.ON_CELL_CLICK + "=spreadsheet")
    public void onCellClick(CellMouseEvent e) {
        String sheetName = e.getSheet().getSheetName();
        switch (sheetName) {
            case SOURCE_SHEET :
                if(e.getRow() == 14 && e.getColumn() == 2)
                    simpleWorkflow();
                if(e.getRow() == 16 && e.getColumn() == 2)
                    complexWorkflow();
                break;
        }
    }
```

- `@Listen(Events.ON_CELL_CLICK + "=spreadsheet")` is to register an `ON_CELL_CLICK` event listener, method `onCellClick()`, for component `spreadsheet`. Therefore, when a user clicks a cell, it will invoke `onCellClick()`.
- In this listner method, I need to check clicked cell's sheet, row, and column to determine which workflow to perform.

# Show Display Sheet
Finally, I call `setSelectedSheet(SIMPLE_DISPLAY_SHEET)` to show the display sheet to users.

```java
    private void simpleWorkflow() {
        spreadsheet.setSelectedSheet(SIMPLE_DISPLAY_SHEET);
    }
```

# Benefits

After turning the xlsx file into a web application the formulas are fully protected. In addition, the financial professional can still modify his formulas from time to time without changing my Java code since the analysis is implemented in his formulas instead of Java.

# Complete Source Code

You can check the full source code at [Github](https://github.com/keikai/dev-ref).



[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
