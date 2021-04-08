---
layout: post
title:  "Upgrade your spreadsheet with modern web"
date:   2021-04-08
categories: "Application"
excerpt: “Keikai Spreadsheet - filling data automatically to your Excel templates.”

index-intro: "Leverage rich UI components to upgrade user’s spreadsheet experience."

image: "2021-04-moderntouch2/upgrade_touch_cover.png"
tags: tutorial developer
author: "Hawk Chen"
authorImg: "/images/author/hawk.png"
authorDesc: "Developer, Keikai."


imgDir: "/images/2021-04-moderntouch2"
javadoc: "https://keikai.io/javadoc/5.0.0/"
---
<!--
images come from https://drive.google.com/open?id=17EEz_BuTVsTSeAA3a8AakyMspVSd_OEb made with draw.io
-->

In the previous article <a href="https://keikai.io/blog/p/Give-your-classic-spreadsheet-a-modern-touch.html" target="_blank">Give your classic spreadsheet a modern touch</a> we have demonstrated how you can combine modern web UI components with the classic spreadsheet and enjoy the best of both worlds.

In the previous article we have used a "drawer" component containing static HTML data to display along with the spreadsheet. In this article we are looking at a more advanced example: Turn an Excel File into a Hotel Voting App, where the additional UI component (panel) interacts with the spreadsheet. 




This example is a hotel voting application for all employees. For an employee, he can:

1. Click a cell to vote for a hotel
2. Click a hotel to show more information and also vote the hotel 

Here is a short clip for the features:

![]({{ site.baseurl }}/{{page.imgDir}}/hotelvoting.gif)




# Load Pre-designed Excel File
Firstly, I create a table of hotels and voting checkboxes in an Excel file like:

![]({{ site.baseurl }}/{{page.imgDir}}/hotelvoting-excel.jpg)

Like what I have demonstrated in the <a href="https://keikai.io/blog/p/Give-your-classic-spreadsheet-a-modern-touch.html" target="_blank">previous article</a>, load the designed Excel file into Keikai with a zul.

# Add additional UI components
Similar to the previous article, I still add a `drawer` to show the "More Info" panel on the right-hand side. Since I need to show different details for different hotels, I don't include a fixed page this time. I will inject a different zul page for each clicked hotel.

```java
<drawer id="helpDrawer" visible="false" position="right" width="30%"/>
```


# Implement Application Logic with Event Listeners
Keikai supports an event-driven programming model, I should implement application logic in event listeners.

## Click to Vote a Hotel
Add `ON_CELL_CLICK` event listener:

```java
@Listen(Events.ON_CELL_CLICK+ " = spreadsheet")
public void onCellClicked(CellMouseEvent e){
    if (RangeHelper.isRangeClicked(e, moreInfoRange)) {
        ...
    }else if (isVotingRangeClicked(e)){
        updateVote();
    }
}
```



To check the cell clicking easily, I create 4 named Range: `Vote1` ~ `Vote4` for 4 voting areas, so that I can easily determine whether a user clicking is inside these 4 ranges or not.

![]({{ site.baseurl }}/{{page.imgDir}}/vote.jpg)


```java
/**
 * determine whether a user clicking is inside those voting ranges or not.
 * @return true means a user clicks a cell inside one of voting ranges
 */
private boolean isVotingRangeClicked(CellMouseEvent e) {
    int n = 1;
    do{
        Range eachVoteRange = Ranges.rangeByName(spreadsheet.getSelectedSheet(), "Vote"+n);
        if (RangeHelper.isRangeClicked(e, eachVoteRange)){
            voteRange = eachVoteRange;
            cell = RangeHelper.getTargetRange(e);
            return true;
        }
        n++;
    }while(n<=4);
    voteRange = null;
    return false;
}
```


Line 4: `Ranges.rangeByName()`, get a range of cells by a name. With this approach, the Java code can resist cell position change which is better than using cell reference.
Then, I need to update the checkmark position and the corresponding vote count.

 

```java
private static final String CHECKMARK = "√";
private Range voteRange; //clicked vote range
private Range clickedCell; //clicked cell
private static final String MY_VOTE_COLOR = "#F77228";
...
private void updateVote() {
    //update checkmark
    voteRange.clearContents();
    clickedCell.setCellValue(CHECKMARK);
    //update vote count
    Range voteCount = voteRange.toShiftedRange(0, 5);
    int row = voteCount.getRow();
    for (int offset = 0 ; offset < voteCount.getRowCount() ; offset++){
        Range eachCount = voteCount.toCellRange(offset, 0);
        if (eachCount.getCellStyle().getFont().getColor().getHtmlColor().equalsIgnoreCase(MY_VOTE_COLOR)){
            eachCount.setCellValue(eachCount.getCellData().getDoubleValue().intValue()-1);
            CellOperationUtil.applyFontColor(eachCount, ColorImpl.BLACK.getHtmlColor());
            break;
        }
    }
    Range myVote = clickedCell.toShiftedRange(0, 5);
    myVote.setCellValue(myVote.getCellData().getDoubleValue().intValue() + 1);
    CellOperationUtil.applyFontColor(myVote,MY_VOTE_COLOR);
}
```


Line 8-9: I can change the checkmark's position by setting cell value with  "√" 

Line 17: `CellOperationUtil.applyFontColor()` can change the text color in cells

### Show More Info When Clicking on a Hotel

![]({{ site.baseurl }}/{{page.imgDir}}/show.gif)

When a user clicks a cell on Day 1 (`C6:F9`), I will call `helperDrawer.open()` to show more information. But each hotel has different details, I create each zul for each hotel like:

```java
Silver Oyster Resort.zul
Silver Mountain Resort.zul
Ivory Baron Hotel.zul
Crown Lodge Resort & Spa.zul
```

Then I put a template injection component inside the `drawer`, so that I can dynamically switch the page inside the template.



```java
private ShadowTemplate moreInfo = new ShadowTemplate(true);
...
public void doAfterCompose(Component comp) throws Exception {
    super.doAfterCompose(comp);
    ...
    moreInfo.apply(helpDrawer);
}

private void showMoreInfo(Range cell) {
    String hotelName = moreInfoRange.toCellRange(cell.getRow()-moreInfoRange.getRow(), 0).getCellData().getStringValue();
    moreInfo.setTemplateURI(hotelName + ".zul");
    moreInfo.apply(helpDrawer);
}
```



Line 1,6: create a template inject component and put it into `helpDrawer`.

Line 10: get hotel name from cell value.

Line 11-12: switch to the corresponding zul page and enforce `apply()` to recreate the new zul again.

### "Vote This Hotel" Button


After the `drawer` opens, it shows more information of a hotel and a "Vote This Hotel" button and users can click the button to vote for the said hotel. Because the page is dynamically created for each cell clicking, I can't add a listener to the button. I need to forward its `onClick` event to `drawer` (see <a href="https://www.zkoss.org/wiki/ZK%20Developer's%20Reference/Event%20Handling/Event%20Forwarding" target="_blank">Event Forwarding</a>).

 
```java
<z:button id="vote" label="Vote This Hotel" width="100%" height="40px" sclass="vote-button" forward="helpDrawer.onVote"/>
```



Then listen to my custom forwarding event `onVote` to update the vote count:



```java
@Listen("onVote = #helpDrawer")
public void onVote(){
    voteRange = Ranges.rangeByName(spreadsheet.getSelectedSheet(), "Vote1");
    clickedCell = voteRange.toCellRange(clickedCell.getRow() - voteRange.getRow(), 0);
    updateVote();
}
```


Line 1: Listen to `onVote` event on the `drawer`.

Line 3-4: convert user-clicked cell into the cell in `Vote1` to update the checkmark and vote count.


# Summary
Like I mentioned in my last article, spreadsheets are brought online for easier sharing and collaboration but there are a lot more we can do than just duplicating Excel's functionality to the browsers. 

By combining modern web UI components with the classic spreadsheet, you can  bring your users a familiar yet upgraded experience.


# Source Code
You can see the complete source code in <a href="https://github.com/keikai/dev-ref/tree/master/src/main/webapp/useCase/help" target="_blank">Keikai developer reference repository</a>.




[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
