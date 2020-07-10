---
layout: post
title:  "Enable User Input in My Spreadsheet-based App"
date:   2020-07-09
categories: "UseCase"

index-intro: "Control spreadsheet from Java!"

image: "2020-07-enableuserinput/interaction_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2020-07-enableuserinput"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# New requirements: add new expenses

A while ago I turned my colleague Michelle's Excel file into an online budget report web app, to save her from a bunch of manual routines. Recently, she had a new requirement, adding new expenses. She wanted to add new expenses in the sheet and aggregate the new expenses in the current summary report.

This is how the summary report looks like:

![]({{ site.baseurl }}/{{page.imgDir}}/budget_app.png)

# Turn cells into a button
We both agreed to keep the existing summary report sheet clean and implement the new feature in a new sheet. We decided to put a button "Add my new expense" on the sheet which will open a new form in another sheet.

How can we make a button here? It was very simple. Michelle just merged several cells and set her preferred background-color in the Excel template.

![]({{ site.baseurl }}/{{page.imgDir}}/budget_app_button.png)

# Create a form
To fulfill the new requirement, Michelle needed a form to input new expenses. I asked her to open up the Excel template and add a new sheet with a table and a "Done" button. She also used formulas (e.g. `=C4*D4`) in the subtotal column (column E).

![]({{ site.baseurl }}/{{page.imgDir}}/excel_form.png)

To avoid accidentally deleting the formulas, she protected the whole sheet and set `A4:D7` as "unlocked". Therefore, she can only input new expenses in the unlocked range.

# Change UI without programming
As you may have noticed, everything Michelle added in the sheets so far can be done in Excel, without any programming skills. All I (as a developer) need to do is to take this updated Excel file and import it into Keikai without asking her what she has changed. Then the updated file becomes our new UI.

# Sheet switching
After she finished, it was my turn to add the application logic behind these 2 sheets (summary and new expense form). When Michelle clicked "Add my new expense", Keikai should switch to the new expense form sheet.

Here is the code to add an `onCellClick` listener and select the `NEW` expense form sheet in the controller class:

```java
public class BudgetComposer extends SelectorComposer<Component> {
...
    @Listen(Events.ON_CELL_CLICK + "= #spreadsheet")
    public void onClick(CellMouseEvent event) {
        Range cell = Util.getClickedCell(event);
        if ("Add my new expense".equals(cell.getCellValue())){
            spreadsheet.setSelectedSheet(NEW);
        }...
    }

...
}
```

# Read user input
The final part is to read the new expenses when Michelle clicked the "Done" button.

Let's update the previous event listener for "Done" button clicked:

```java
    @Listen(Events.ON_CELL_CLICK + "= #spreadsheet")
    public void onClick(CellMouseEvent event) {
        Range cell = Util.getClickedCell(event);
        if ("Add my new expense".equals(cell.getCellValue())){
            ...
        }else if ("Done".equals(cell.getCellValue())){
            readExpense();
            spreadsheet.setSelectedSheet(SUMMARY);
            loadExpenseToSheet();
        }
    }
```

Through `Range` API, I can read data cell by cell to construct an `Expense` object:

```java
    private Expense readExpense(int row, int col) {
        Expense expense = new Expense();
        expense.setCategory(Ranges.range(spreadsheet.getSelectedSheet(), row, 1).getCellData().getStringValue());
        Double value = Ranges.range(spreadsheet.getSelectedSheet(), row, 2).getCellData().getDoubleValue();
        expense.setQuantity(value == null? 0 : value.intValue());
        value = Ranges.range(spreadsheet.getSelectedSheet(), row, 4).getCellData().getDoubleValue();
        expense.setSubtotal(value == null? 0 : value.intValue());
        return expense;
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

To avoid boring you to tears, I won't show all the details here. You can take a look at the [online demo](https://keikai.io/demo/database) to check its source code and understand this application better.


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
