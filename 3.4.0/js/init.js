(function($) {
  console.log("start init.ja");
  
  // include touch.js on desktop browsers only
  if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
    var script = document.createElement('script');
    script.src = 'touch.js';
    var tag = $('head').append(script);
    $.os.android = true; //let's make it run like an android device
    $.os.desktop = true;
  }
  
  var webRoot = "./";
  $.ui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen
  /* This function runs when the body is loaded.*/
  var init = function () {
          console.log("Event::DOMContentLoaded");
          $.ui.backButtonText = "Back";// We override the back button text to always say "Back"
          window.setTimeout(function () {
              $.ui.launch(); 
          }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
      };
  document.addEventListener("DOMContentLoaded", init, false);
  $.ui.ready(function () {
      //This function will get executed when $.ui.launch has completed
      console.log("Call $.ui.ready");
      repliesUpdate();
  });

  /* This code is used for appMobi native apps */
  var onDeviceReady = function () {
          console.log("Event::appMobi.device.ready");
          AppMobi.device.setRotateOrientation("portrait");
          AppMobi.device.setAutoRotate(false);
          webRoot = AppMobi.webRoot + "/";
          //hide splash screen
          AppMobi.device.hideSplashScreen();

  };
  document.addEventListener("appMobi.device.ready", onDeviceReady, false);
})(jq);


/* This function runs once the page is loaded, but appMobi is not yet active */
var init = function(){
    console.log("Event::load");
};
window.addEventListener("load",init,false);  

/* This code prevents users from dragging the page */
var preventDefaultScroll = function(event) {
    console.log("Event::touchmove");
    event.preventDefault();
    window.scroll(0,0);
    return false;
};
document.addEventListener('touchmove', preventDefaultScroll, false);

/* Themes変更 */
var oldElem="default";
function setActiveStyleSheet(title) {
  var a = document.getElementsByTagName("link");
  var currElem;
  
  if(title==oldElem.getAttribute("title")||oldElem=="default")
     return;
  for(i=0; i<a.length; i++) {
  
      if(a[i].getAttribute("title")==title){
        currElem=a[i];
      }
      else if(!a[i].getAttribute("disabled")&&a[i].getAttribute("title"))
         oldElem=a[i];
  }
  
  currElem.removeAttribute("disabled");
  jq.ui.showMask();
  window.setTimeout(function(){
     jq.ui.hideMask();
     oldElem.setAttribute("disabled","true");
  },500);
}
$(document).ready(function(){
  oldElem=document.getElementsByTagName("link")[0];
});

