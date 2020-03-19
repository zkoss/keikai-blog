---
layout: post
title:  "Create a Tailored, Web-based Excel Report Generator" 
date:   2020-03-12
categories: "Application"

index-intro: "
This article tells you how to build a report generator.
"
image: "2020-03-report/mainui.png"
tags: developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "2020-03-report"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

# The traditional way to build a custom Excel report

Ever since I [turned an Excel file into the Buy Currency App](https://keikai.io/blog/p/currency-exchange.html) for Michelle in the administration department, we became closer. This time, I ask her to help me get prepared for my business trip. 

Michelle goes through my Business Trip Application form, identifies if a visa is required for the country I am going, and if I need any insurance or accommodation arrangements, etc. etc. 
Then, she logs on to our file server where lots of templates and forms are stored and copies relevant Excel forms. She emails those to me, asking me to fill them out and send them back to her so that she can take care of everything else for me.

I appreciate her help -- but again, search manually and copy forms around? isn't there a more efficient way to do this? What if a system can load these forms and combine the required sheets for us?

![]({{ site.baseurl }}/images/{{page.imgDir}}/concept.png) 

I quickly draw a plan in my head: list down all the form names in an Excel sheet, give them each a checkbox, and at the end add a "build book" button. Import it to Keikai Spreadsheet, wire the logic on the button -- upon receiving the clicking event, check the value of the checkboxes, and pull out all the relevant (checked) sheets from various files, insert them to the same book. The resulting book can either be a Web sheet or can be exported as an Excel book. 

Yes, should be easily possible in 2 hours.

# Design Main UI
First, Michelle gives me the sheet she designs to select template forms. Import it to Keikai in a zul, then our main user interface is done:

```xml
<spreadsheet apply="io.keikai.devref.usecase.ReportGeneratorController" 
    height="100%" width="100%"
    src="/WEB-INF/books/report/Travel Management.xlsx"
    maxVisibleRows="12" maxVisibleColumns="6"
    hidecolumnhead="true" hiderowhead="true"/>
```

![]({{ site.baseurl }}/images/{{page.imgDir}}/mainui.png) 

From the screenshot, you can see I hide toolbar, sheetbar, formula bar, and row/column heading to make Keikai more like a normal web page.

# Get Form Templates Ready
Following my plan, I ask Michelle to give me those 4 `xlsx` template files. Each `xlsx` file name match its form name e.g. `Travel Insurance Form.xlsx`. What I need to do is to import all template Excel files into Keikai for future use.

{% highlight java linenos %}
public class ReportGeneratorController extends SelectorComposer {
    private static Map<String, Book> templateMap = new HashMap();
    ...
    @Override
    public void doAfterCompose(Component comp) throws Exception {
        super.doAfterCompose(comp);
        ...
        importTemplates();
    }    
    ...
    private void importTemplates() throws IOException {
        if (templateMap.size() > 0){
            return; // already imported
        }
        int row = table.getRow();
        int lastRow = table.getLastRow();
        int templateColumn = table.getLastColumn();
        for ( ; row <= lastRow ; row++) {
            String name = Ranges.range(spreadsheet.getSelectedSheet(), row, templateColumn).getCellValue().toString() ;
            Book templateBook = Importers.getImporter().imports(new File(DEFAULT_TEMPLATE_FOLDER, name+ ".xlsx"), name);
            templateMap.put(name, templateBook);
        }
    }
{% endhighlight %}

* Line 2: I can store those imported templates (`Book`) into a Map without assigning them to a `Spreadsheet`. Because I don't need to show templates at the beginning.

# Toggle Check Mark
Since Keikai doesn't support form control, I put a checkmark box symbol in a cell. Each time a user clicks the checkmark box, my code will switch the cell between checked checkmark and not checked.

![]({{ site.baseurl }}/images/{{page.imgDir}}/checkmark.gif) 

## Listen to `ON_CELL_CLICK`
Register an `ON_CELL_CLICK` event listener by `@Listen`, then each time a user click a cell. Keikai will invoke this method in the controller.

```java
    @Listen(Events.ON_CELL_CLICK + "= spreadsheet")
    public void onCellClick(CellMouseEvent e){
        if (inCheckMarks(e)) {
            toggleCheckMark(getRange(e));
        }...
    }
```

## Switch Check Mark Symbol
I can change a cell value by `Range.setCellValue()`.

```java
    private static String NOT_CHECKED = "\uD83D\uDDF8";
    private static String CHECKED = "✓";
...
    private void toggleCheckMark(Range checkMarkCell) {
        if (checkMarkCell.getCellValue().equals(NOT_CHECKED)){
            checkMarkCell.setCellValue(CHECKED);
        }else{
            checkMarkCell.setCellValue(NOT_CHECKED);
        }
    }    
```


# Copy Sheets into the Final Book
Finally, I need to copy those sheets from selected templates to my personalized report when clicking "Build" button. Listen `ON_CELL_CLICK` and check if someone clicks the "Build" button at cell `E11`.

```java
...
    @Listen(Events.ON_CELL_CLICK + "= spreadsheet")
    public void onCellClick(CellMouseEvent e){
        if (inCheckMarks(e)) {
            ...
        }else if (inBuildButton(e)){
            build();
        }
    }
```

Then copy the selected template into a new book.

{% highlight java linenos %}
private void build() {
    Book newReport = Books.createBook("newReport");
    int row = table.getRow();
    int lastRow = table.getLastRow();
    for ( ; row <= lastRow ; row++) {
        if (isChecked(Ranges.range(spreadsheet.getSelectedSheet(), row, table.getColumn()))){
            String fileName = Ranges.range(spreadsheet.getSelectedSheet(), row, table.getLastColumn()).getCellValue().toString();
            Book template = templateMap.get(fileName);
            Ranges.range(newReport).cloneSheetFrom(template.getSheetAt(0).getSheetName(), template.getSheetAt(0));
        }
    }
    if (newReport.getNumberOfSheets() > 0 ){
        spreadsheet.setBook(newReport);
        enableEditMode();
    }
}
{% endhighlight %}
* Line 2: Create a new `Book` without any sheet.
* Line 9: Clone a sheet from another book by `Range.cloneSheetFrom()`.
* Line 13: Assing the new report book to `Spreadsheet`, so that Keikai will show new book in a browser.

After creating a custom report based on templates, I should make sheet bar visible and enlarge the visible rows and columns.

```java
    private void enableEditMode() {
        spreadsheet.setShowSheetbar(true);
        spreadsheet.setMaxVisibleRows(40);
        spreadsheet.setMaxVisibleColumns(15);
    }
```



That's all! Now I can produce a custom Excel report by selecting desired sheets from checkboxes. This simple app works like this:

![]({{ site.baseurl }}/images/{{page.imgDir}}/usage.gif)


# To be Continued
<!-- since the example is simple, describe more use cases to show the potential capability of Keikai -->
The small "custom reporting" program is now done, and I am ready to depart for my trip. I have a few ideas to make the app more complete after I am back:

## Common Fields
There are some common fields that reside in every template, like "Category" or "Form Number". Instead of having to read the value of the field at different cells (e.g. A3 or D4) on each template, I shall define a named range for such cell in each template so that I can easily read all the common fields using the same line of code: 

```java
Ranges.rangeByName("category").getCellValue();
```

## Pre-filled Content
I will integrate our program with our existing SSO service and database, by doing so I can pre-fill some personal information e.g. Name when inserting a template sheet so that the end user does not have to fill out personal information again and again in multiple sheets: 

```java
Ranges.rangeByName("user-name").setCellValue(userName);
```

## Post-Processing
After a user submits a report, I will append the sheet name with a consistent prefix and make it, for example, JohnDoe_InsuranceApplication for ease of reading:

```java
Ranges.range(spreadsheet.getBook().getSheetAt(0)).setSheetName(prefix + sheetName);
```


# Source Code
I hope you enjoy reading my article. The complete source code of this report generator is available at [Github](https://github.com/keikai/dev-ref).

Just run the project and visit http://localhost:8080/dev-ref/usecase/reportGenerator.zul


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help