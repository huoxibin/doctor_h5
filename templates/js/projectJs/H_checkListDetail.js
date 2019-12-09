$(function(){
    GHUTILS.openInstall()  //openinstall 唤醒app
    var itemId = getRequestParam('itemId');//该检查名称ID
   var name=decodeURIComponent(getRequestParam('name'));//该检查名称或者是标题
   var shareDescription;//分享描述

   //从原生我的收藏进入该页面
   var returnMine = getRequestParam('returnMine') || null;
   $('.infoDetail_btn').on('tap',function () {
      if(returnMine == 0){
         jumpMobil();
      }else {
         window.history.back();
      }
   });


   $('.H_checkTitle').text(name);

   showLoading();
   loadAction();
   function loadAction(){
      var YData={
         'pathL':"/doctor/testExaminationItem/getExaminationResultItem",
         'accessToken':token,
         'itemId':itemId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){
         },
         type : 'post',
         dataType : "json",
         success:function(res){
            hideLoading();
            if(res.state==0){
               var detailText = res.data;
               if(JSON.stringify(detailText) !== "{}") {
                  shareDescription = detailText.clinicMeans;
                  for(var i in detailText){
                     var detailCount = detailText[i];
                     if( i == 'examinationName'|| i== 'specimenType' || i== 'normalScope' || i == 'clinicMeans' || i== 'exampleResource' || i=='relatedDiseases'){
                        if(detailCount == ''){
                           $('.'+i).html('无');
                        }else {
                           $('.'+i).html(interlac(detailCount));
                        }
                     };
                  };
               }else {
                  $('.checkTop').html('无');
               }
            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };

   var favorited;//0是未收藏、1是已收藏
   function shouCang() {
      var YData={
         'pathL':"/doctor/testExaminationItem/getHandbookDetail",
         'accessToken':token,
         'id':itemId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){
         },
         type : 'get',
         dataType : "json",
         success:function(res){
            hideLoading();
            if(res.state==0){
               var collect = res.data;
               // console.log(collect);
               if(JSON.stringify(collect) !== "{}"){
                  favorited = collect.favorited;
                  if(favorited == 0){//0是未收藏
                     $('.collectBtn').removeClass('active');
                  }else if(favorited == 1){//1是已收藏
                     $('.collectBtn').addClass('active');
                  };
               }
            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };
   //--------收藏该病例
   $('.collectBtn').on('tap',function () {
      if($(this).hasClass('active')){
         collectFn(0); //取消收藏
      }else{
         collectFn(1); //收藏
      }
   });
   function collectFn(m) {
      var JAridata={
         'pathL':"/common/contentFavorite/favorite",
         'accessToken':token,
         'favorited': m,//1收藏、0取消收藏
         'valueId':itemId,//收藏内容的id号，资讯id号，指南id号等
         'valueTitle':name,//标题
         'valueMemo':'',//备注
         'valueImageUrl':'',//图标url
         'valueType':5,//收藏信息类型 1资讯、2病历、3课程、4指南、5检验
      };
      Ajax({
         url:servUrl,
         data:JAridata,
         async: false,
         beforeSend: function(){},
         type : 'post',
         dataType : "json",
         success:function(res){
            if(res.state==0){
               if(m == 1){
                  showalert(0,"已收藏",2);
                  $('.collectBtn').addClass('active');
               }else{
                  showalert(0,'已取消收藏',2);
                  $('.collectBtn').removeClass('active');
               }
            }else{
               showalert(0,res.msg,2);
            }
         },
         error:function(res){
            showalert(0,res.msg,2);
         }
      });
   };

   //--------分享调用原生方法
   var closeHeader=getRequestParam('closeHeader');
   if(closeHeader == 'closeHeader'){
      $('.Ynav').addClass('hide');
      $('.shareHeader').removeClass('hide');
      $('.viewMore').removeClass('hide');
      // $('.form_type').css({paddingTop:0});
      // $(".checkDetail").css("height","330px").css("overflow","hidden");
       $(window).scroll(function(){
           var scrollTop = parseInt($(this).scrollTop()),
               scrollHeight = parseInt($(document).height()),
               windowHeight = parseInt($(this).height()),
               _height = scrollTop + windowHeight;
           var s = scrollHeight - _height;
           if( s< 60){
               $('.recruitgomore').removeClass("hide");
           }else{
               $('.recruitgomore').addClass("hide");
           }
       });
   }else {
      shouCang();
   };
   $('.shareBtn').on('tap',function () {
      shareDescription = shareDescription.substr(0,50);
      console.log(shareDescription);
      var shareDate_ios = {
         'shareLink': window.location.href + '&closeHeader=closeHeader&module=1',
         'shareImgUrl': null,
         'shareArticletitle':name,
         'shareDescription': shareDescription
      };
      var shareDate = JSON.stringify(shareDate_ios);
      if(window.webkit){
         window.webkit.messageHandlers.transmitMsge.postMessage(shareDate);
      }else if(window.jsObj){
         window.jsObj.transmitMsge(window.location.href +'&closeHeader=closeHeader&module=1','', name,shareDescription);
      }
   });

   // console.log(window.location.href+'&closeHeader=closeHeader');

   // $('.viewMore').on('tap',function () {
   //     GHUTILS.openApp();
   // });
   //(\n)换行成（br）
    function interlac(msg) {
       if(msg == '' || msg == null){
          return ''
       }else {
          return msg.replace(/\n/g,'</br>');
       }
    };
    //唤起app
    // $('.openApp, .recruitgomore').on('tap',function () {
    //     GHUTILS.openApp();
    // });
});