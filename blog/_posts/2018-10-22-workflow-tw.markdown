---
layout: post
title:  "IT 別再做白工"
date:   2018-10-22
categories: 
hidden: true

index-intro: "IT 別再做白工<br/>
<br/>
何不讓使用者自己設計 UI!
 "

image: "2018-10-workflow-tw/fillForm.png"
tags: tutorial developer
author: "Jean Yen"
authorImg: "/images/author/jean.jpg"
authorDesc: "Customer Care，Keikai."


imgDir: "2018-10-workflow-tw"
---
<style>
    #body #post .right-part .markdown li {
        color: rgba(0，0，0，0.9);
        font-weight: 400;
    }
</style>

## 您嘔心瀝血做出來的系統，使用者卻不習慣?

何不讓使用者自己設計 UI?

只要會 Excel，人人都可以設計 UI。使用 Keikai 網路試算表，IT 部門可以輕易的匯入Excel 檔，加上工作流程，快速的作成一個網路應用程式!

不相信? 讓我們繼續看下去 … 

###使用情境

假設公司的 HR 部門，希望有一個請假系統，讓員工可以填寫請假單並送給主管審核。

###Step 1

HR 部門決定好請假流程，以及請假單上要有的欄位。

###Step 2

HR 部門用既有的 Excel 技能就能把請假表格做好，例如設定字形、字體、 排版、 資料排序、 篩選、 公式運算、 唯讀設定等等。

![Form1]({{ site.baseurl }}/images/2018-10-workflow-tw/fillForm.png)

例如上圖中的 Days in Total (請假日數) 就是設定 Excel 公式，由公式自動計算出來的。

接下來在畫面上加上兩顆按鈕，提交以及取消: 提交就是把表單送給主管，取消則離開本頁。

###Step 3

使用者設計完，工程師終於要出馬了。

將設計好的 Excel 檔匯入 Keikai 之後，透過 Keikai 所提供的 Events 及 API，可以在聽取到提交事件時，把表單存入資料庫，並做下一步處理。在聽取到取消事件時，則是離開本頁。

![Form1]({{ site.baseurl }}/images/2018-10-workflow-tw/submit2.gif)

就是這麼簡單! 

##IT 輕鬆  使用者滿意

由最了解 Domain Know-how 的使用者自己設計 UI 及流程，而讓工程師把它串接起來，各司其職。這種開發方法可以大幅降低工程師與使用者的溝通成本，也不需要由工程師自己實作 Excel 既有的各項功能例如資料排序、篩選、公式運算等等。連 CSS 都可以省了。唯一要做的就是把有使用者行為的地方依照工作流程的需求串接起來!

到這裡聽起來很不錯，但如果使用者突然想要加一個欄位，或是更換設計怎麼辦? 很多情況下，可以完全不更動程式碼，直接重新匯入新的 Excel 表單即可。 

有興趣?

趕緊來聽 Keikai 研討會，了解產品功能以及可能性。發表會後並有個別諮詢時段，開放給您諮詢和討論。

* 日期: 11/2 (五) 14:00~16:00
* 地點: 臺北創新實驗室 內湖區洲子街12號2樓(港墘站2號出口5分鐘)
* 活動網址: https://keikai.io/blog/p/keikai-event.html
* 免費參加，名額有限，請盡速報名([線上報名連結](https://docs.google.com/forms/d/e/1FAIpQLSfHYxJzBVHUS2pVJVVOptqsQI3k0ejoHv3qZpePWoZ3mG_rrw/viewform
))
* 主辦單位: 普奇科技

如您有興趣了解 Keikai 但不克參加 11/2 的活動，請於報名表中註明，我們會盡快做其他安排，謝謝您!



[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help