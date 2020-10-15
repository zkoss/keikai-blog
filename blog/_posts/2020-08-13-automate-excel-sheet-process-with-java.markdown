---
layout: post
title:  "Automate Excel Sheet Processing with Java"
date:   2020-08-13
categories: "UseCase"
excerpt: “Keikai Spreadsheet - filling data automatically to your Excel templates.”

index-intro: "Avoid manual editing! Fill your data into spreadsheet templates automatically by using Keikai."

image: "2020-08-automateExcelsheet/automate_excelsheet_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2020-08-automateExcelsheet"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

# A Sheet Processing Use Case

My colleague Penny in the HR department has to do a routine task each month: making payroll sheets for everyone in the company. There is a sheet containing a table of all employees with salary information:

This is how the summary report looks like:

![]({{ site.baseurl }}/{{page.imgDir}}/excel_screenshot.png)

And she has to create payroll sheets for each person on the list based on the template sheet:

![]({{ site.baseurl }}/{{page.imgDir}}/payroll.png)

To avoid copying cell by cell manually, I create a web application with Keikai to read salary data row by row and produce payroll sheets. The whole process is:

![]({{ site.baseurl }}/{{page.imgDir}}/payroll_process.png)

# Import a Pre-designed Excel File

I create a Keikai spreadsheet by writing tags and attributes in a zul of [ZK Framework](https://www.zkoss.org/) which is a UI framework based on Java EE. By specifying at `src` attribute with a file path, Keikai can import my `Payroll.xlsx`.

```java
<spreadsheet height="100%" width="100%" src="/WEB-INF/books/Payroll.xlsx"
                 maxVisibleColumns="15" maxVisibleRows="20"
                 hidecolumnhead="false"  hiderowhead="false"
                 showToolbar="true" showSheetbar="true" showFormulabar="true"
                 apply="io.keikai.devref.usecase.PayrollComposer"/>
```

When I visit the zul with a browser, Keikai renders the file:

![]({{ site.baseurl }}/{{page.imgDir}}/keikai_screenshot.png)

The ZK framework will parse the zul page above and instantiate a Keikai Java object(`Spreadsheet`) for us to control.

# Controller
Then I also create a Java controller, `PayrollComposer` to access the Keikai Java object and apply the controller on the page at `apply` attribute: `apply="io.keikai.devref.usecase.PayrollComposer"`

# Named Range
I make a cell like a button on the sheet. When I click the cell, Keikai will start to produce payroll sheets. I give a name, `Generate`, to the cell.

![]({{ site.baseurl }}/{{page.imgDir}}/generate.png)

After that, I can create a `Range` object (`generateButton`) with the name:

`generateButton = Ranges.rangeByName(sheet, "Generate");`

Here is the related code snippet:

```java
public class PayrollComposer extends SelectorComposer<Component>{

    @Wire("spreadsheet")
    private Spreadsheet spreadsheet;
    final private static String EMPLOYEE_SHEET = "Payroll";
    private Range generateButton;
    private Sheet sheet;

    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        sheet = spreadsheet.getBook().getSheet(EMPLOYEE_SHEET);
        generateButton = Ranges.rangeByName(sheet, "Generate");
    }
...
```

# Listen to Button Clicking
Then I register an event listener for the cell (button) clicking by `@Listen` and check whether the button `generateButton` is clicked or not:

```java
    @Listen(Events.ON_CELL_CLICK + "=spreadsheet")
    public void onCellClick(CellMouseEvent e) {
        String sheetName = e.getSheet().getSheetName();
        switch (sheetName) {
            case EMPLOYEE_SHEET:
                if (RangeHelper.isRangeClicked(e, generateButton))
                    fillPayrollSlips();
                break;
        }
    }
```

When the button is clicked, it just starts to fill the payroll slips.

# Fill payroll data into sheets
Before filling a payroll sheet, I have to read all employees' salary data row by row from the table. The table also has a corresponding named range, `PayrollTable`, that I don't need to hard code its cell address.

```java
private void fillPayrollSlips() {
    String tableName = "PayrollTable";
    Range payrollRange = Ranges.rangeByName(sheet, tableName);
    List<Map<String, Object>> employeeSalaries = getEmployeeSalaries(payrollRange);
    generateAllPayrollSlips(employeeSalaries);
}
```

To avoid filling data into a fixed cell address of the payroll sheet, I create a named range for each field that maps the corresponding column name.

## Column Name <==> Named Range

![]({{ site.baseurl }}/{{page.imgDir}}/fetch.png)

Hence, I can fill data in a simple loop. Just clone [(cloneSheet())] (https://keikai.io/javadoc/latest/io/keikai/api/Range.html#cloneSheet-java.lang.String-) the template sheet and fill each field by the named range.

```java
    private void generateAllPayrollSlips(List<Map<String, Object>> employeeSalaries) {
        for (Map<String, Object> employee : employeeSalaries) {
            Sheet payrollSheet = Ranges.range(spreadsheet.getBook().getSheet("Form"))
                    .cloneSheet((String) employee.get("Name"));
            for (String field : employee.keySet()) {
                Ranges.rangeByName(payrollSheet, field).setCellValue(employee.get(field));
            }
        }
    }
```

With the named range, I don't need to hard code a cell address in the code, which makes the code more robust against sheet layout change.

#Source Code
I was able to turn this manual Excel copy-pasting task into an automated task in less than 100 lines. I hope you find this example interesting. You can find out the complete code at [Github] (https://github.com/keikai/dev-ref/blob/master/src/main/java/io/keikai/devref/usecase/PayrollComposer.java).



[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
