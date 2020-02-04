(function(win) {
  $('#side-menu-toggle').click(function() {
    $('#wrap').toggleClass('menu-open');
  });
  $('#header-wrapper').addClass('qr-collapse-navbar');
  $('#header #menu-toggle').click(function() {
    $(this).toggleClass('open');
    $('#header nav').toggleClass('in');
  });

  var toggleStickyShareButtons = function() {
    var $shareDiv = $('div.share');
    if(window.innerWidth >= 1180) {
      $shareDiv.sticky({topSpacing: 57});
    } else {
      $shareDiv.unstick();
    }
  };
  toggleStickyShareButtons();
  $(win).resize(toggleStickyShareButtons);
}
)(window);

/*Google Page Tracker*/
//https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers
//https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
//instantiation!
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-116749276-1', 'auto');
ga('send', 'pageview');

function initFooterResponsive () {
    var toggleClass = function (element, name, add) {
        if (!element) {
            return;
        }
        var arr = element.className.split(' ');
        var i = arr.indexOf(name);
        if (i === -1) {
            if (add) {
                element.className += ' ' + name;
            }
        } else if (!add) {
            arr.splice(i, 1);
            element.className = arr.join(' ');
        }
    };
    var toggleFooter = function (evt) {
        var sectionTitle = evt.currentTarget;
        var sectionList = sectionTitle.nextElementSibling;
        var currentTitle = document.querySelector('#footer-upper .sections .footer-open-section');
        var currentList = document.querySelector('#footer-upper .sections .footer-show-list');

        toggleClass(currentTitle, 'footer-open-section', false);
        toggleClass(currentList, 'footer-show-list', false);

        if (sectionList && sectionTitle !== currentTitle) {
            toggleClass(sectionTitle, 'footer-open-section', true);
            toggleClass(sectionList, 'footer-show-list', true);
        }
    };
    window.onload = function () {
        var sectionTitles = document.querySelectorAll('#footer .section > .sectionTitle');
        for (var i = 0; i < sectionTitles.length; i++) {
            var element = sectionTitles[i];
            element.addEventListener('click', toggleFooter);
        }
    };
}
function browserDemoDetection () {
    var userAgent = navigator.userAgent.toLowerCase();
    var screenMinLength = Math.min(window.screen.width, window.screen.height);
    var isIOS = /iphone|ipad/.test(userAgent);
    var isMobile = userAgent.indexOf('mobi') !== -1;
    var mightNotBeChrome = userAgent.indexOf('chrome') === -1;
    if (isIOS || (!isIOS && isMobile && (screenMinLength < 640 || mightNotBeChrome))) {
        var x = document.getElementsByClassName('nomob');
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].className += ' hidden';
        }
    }
}
initFooterResponsive();
browserDemoDetection();
