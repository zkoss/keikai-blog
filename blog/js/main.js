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
