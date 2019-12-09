$(function(){
   $('.gotoLogin').on('tap',function () {
      var shareDate_ios = {
         'shareLink': '123456',
      };
      var shareDate = JSON.stringify(shareDate_ios);
      if(window.webkit){
         window.webkit.messageHandlers.gotoLogin.postMessage(shareDate);
      }else if(window.jsObj){
         window.jsObj.gotoLogin();
      }
   });
});