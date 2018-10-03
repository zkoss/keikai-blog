window.addEventListener('load',function(){  
  jQuery('[href*="https://docs.google.com/forms/"]').click(function(){
    ga('send', 'event','link','click','register');
  })
})