---
layout: post
title:  "Create a Tailored, Web-based Excel Report Generator" 
date:   2019-06-11
categories: "Application"

index-intro: "
This article tells you how to build a report generator.
"
image: "2019-06-report/mainui.png"
tags: developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "2019-06-report"
javadoc: "http://keikai.io/javadoc/latest/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
goal： Keikai can help you build a spreadsheet-based app
-->

# The traditional way to build a custom Excel report

Ever since I [turned an Excel file into the Buy Currency App](https://dzone.com/articles/turn-you-excel-file-into-a-web-application) for the lady in the administration department, we became closer. This time, I ask her to help me get prepared for my very first business trip. 

She goes through my Business Trip Application form, identifies if a visa is required for the country I am going, and if I need any insurance or accommodation arrangements, etc. etc. 
Then, she logs on to our file server where lots of templates and forms are stored and copies relevant Excel forms. She emails those to me, asking me to fill them out and send them back to her so that she can take care of everything else for me.

I appreciate her help -- but again, search manually and copy forms around? isn't there a more efficient way to do this? What if a system can load these forms and combine the required sheets for us?

![]({{ site.baseurl }}/images/{{page.imgDir}}/concept.png) 


# Design Main UI

I quickly draw a plan in my head: list down all the form names in an Excel sheet, give them each a checkbox, and at the end add a "build book" button. Import it to Keikai Spreadsheet, wire the logic on the button -- upon receiving the clicking event, check the value of the checkboxes, and pull out all the relevant (checked) sheets from various files, insert them to the same book. The resulting book can either be a Web sheet or can be exported as an Excel book. 

Yes, should be easily possible in 2 hours.

![]({{ site.baseurl }}/images/{{page.imgDir}}/mainui.png) 

# Get Form Templates Ready
Following my plan, I first ask my colleague to create an Excel sheet that contains all the form names and checkboxes and prepare a copy of all the templates and forms. What I need to do is to import the main Excel file (above) and all template Excel files into Keikai for future use.

```java
    private Map<String, Workbook> templateMap = new HashMap();
    ...
    private void importTemplates() throws FileNotFoundException, AbortedException, DuplicateNameException {
        for (String name : templateNames) {
            Workbook templateBook = spreadsheet.imports(name, new File(REPORT_FOLDER, name + ".xlsx"));
            templateMap.put(name, templateBook);
        }
    }
```
* Line 1: I store those imported templates (`Workbook`) into a Map.

Then, I select the main book, [setActiveWorkbook()](https://keikai.io/javadoc/latest/io/keikai/client/api/Spreadsheet.html#setActiveWorkbook-java.lang.String-), as the system main UI.

```java
spreadsheet.setActiveWorkbook(mainBook.getName());
```


# Add an Event Listener
After the user selects required templates with checkboxes, she will click the button to generate a customized report. Hence, I have to register an event listener on that button and implement the application logic in the event listener including checking checkboxes and copying sheets:

```java
private void addEventListener() {
    spreadsheet.getWorksheet().getButton("build-book").addAction(buttonShapeMouseEvent -> {
        // implement the application logic
        ...
        collectSelectedTemplates(); 
        ...
    });
}
```
* Line 2: `build-book` is the button's name. `addAction()` can add a onClick event listener on the button.


# Copy Sheets into the Final Workbook
Finally, I need to copy those sheets from selected templates to my personalized report:

```java
...
    //assume each checkbox' name matches template file name
    private String[] templateNames = {"Travel Reservation Form", "Travel Insurance Form", "Travel Health Management", "Currency Exchange Request"};
    // template name : imported Workbook
    private Map<String, Workbook> templateMap = new HashMap();

...
    private void collectSelectedTemplates() {
        atLeast1TemplateSelected = false;
        for (String name : templateNames) {
            if (mainSheet.getCheckbox(name).isChecked()) {
                templateMap.get(name).getWorksheet().copyToEnd(reportBook);
                atLeast1TemplateSelected = true;
            }
        }
    }
```
* Line 11: Get checked status of each checkbox in the main sheet
* Line 12: copy a sheet among books with [copyToEnd(reportBook)](https://keikai.io/javadoc/latest/io/keikai/client/api/Worksheet.html#copyToEnd-io.keikai.client.api.Workbook-).


That's all! Now I can produce a custom Excel report by selecting desired sheets from checkboxes. This simple app works like this:

![]({{ site.baseurl }}/images/{{page.imgDir}}/usage.gif)


# To be Continued
<!-- since the example is simple, describe more use cases to show the potential capability of Keikai -->
The small "custom reporting" program is now done, and I am ready to depart for my trip. I have a few ideas to make the app more complete after I am back:

## Common Fields
There are some common fields that reside in every template, like "Category" or "Form Number". Instead of having to read the value of the field at different cells (e.g. A3 or D4) on each template, I shall define a named range for such cell in each template so that I can easily read all the common fields using the same line of code: 

```java
spreadsheet.getRangeByName("category").getValue();
```

## Pre-filled Content
I will integrate our program with our existing SSO service and database, by doing so I can pre-fill some personal information e.g. Name when inserting a template sheet so that the end user does not have to fill out personal information again and again in multiple sheets: 

```java
spreadsheet.getRangeByName("user-name").setValue(userName);
```

## Post-Processing
After a user submits a report, I will append the sheet name with a consistent prefix and make it, for example, JohnDoe_InsuranceApplication for ease of reading:

```java
spreadsheet.getWorksheet().rename(prefix + sheetName);
```


# Source Code
I hope you enjoy reading my article. The complete source code of this report generator is available at [Github](https://github.com/keikai/dev-ref).

Just run the project and visit http://localhost:8080/dev-ref/case/report


[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help