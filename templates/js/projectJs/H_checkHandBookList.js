$(function(){
   var checkType=decodeURIComponent(getRequestParam('type'));
   var checkTypeList;

   switch (checkType){
      case '体格检验':
         $('.checkType').html('体格检验');
         checkTypeList = '体格检查';
         break;
      case '化学检验':
         $('.checkType').html('化学检验');
         checkTypeList = '化学检查';
         break;
      case '物理检验':
         $('.checkType').html('物理检验');
         checkTypeList = '物理检查';
         break;
   }

   loadAction();
   function loadAction(){
      var YData={
         'pathL':"/doctor/testExaminationItem/getFirstMenuListBack",
         'accessToken':token,
         'parentId':-1,
         'name':checkTypeList
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
            if(res.state==0){
               var secondMemuList = res.data.secondMemuList;
               var innerSecond = '';
               var innerThird='';
               //-----------------------------------------------------渲染二级列表
               for(var i=0;i<secondMemuList.length;i++){
                  innerSecond += '<ul class="H_secList">\n' +
                     '            <div class="titleCon" style="background: #fff" secondLeveName=\'' +
                     '' +secondMemuList[i].secondLeveName +
                     '\' secondLevelId="' +
                     '' +secondMemuList[i].secondLevelId +
                     '">\n' +
                     '                <span>' +
                     '' +secondMemuList[i].secondLeveName +
                     '</span>\n' +
                     '                <img typeImg="1" class="desImgToggle" src="../images/Shape_Copy_8.png"/>\n' +
                     '            </div>\n' +
                     '            <div class="checkList" style="display: none">\n' +
                     '              <ul class="checkListText">\n'+
                     '              </ul>\n'+
                     '            </div>\n' +
                     '        </ul>';
               };
               $(innerSecond).appendTo('.handList');
               //-------------------------------------------------------渲染三级列表
               for(var i=0;i<secondMemuList.length;i++){
                  var thirdMenuList = secondMemuList[i].thirdMenuList;
                  console.log(thirdMenuList);
                  if(thirdMenuList != null){
                     for(var j=0; j<thirdMenuList.length; j++){
                        innerThird += '<li thirdLevelName=\'' +
                           '' +thirdMenuList[j].thirdLevelName+
                           '\' thirdLevelId =\'' +
                           '' +thirdMenuList[j].thirdLevelId+
                           '\'>' +
                           '' +thirdMenuList[j].thirdLevelName+
                           '</li>';
                     };
                     $(innerThird).appendTo($('.handList').find('.H_secList .checkListText').eq(i));
                     innerThird ='';
                  }else {
                     $('.handList').find('.H_secList').eq(i).find('.desImgToggle').hide(); //为空的话，没有那个小图片へ
                     $('.handList').find('.H_secList').eq(i).find('.titleCon').addClass('noThirdMemuList');//给三级thirdMenuList为null的加一个类，以便点击事件
                  }
               };
               //---------------------------------------------------------显示与隐藏
               $('.titleCon').on('tap',function () {
                  var imgType = $(this).find('.desImgToggle').attr('typeImg');
                  if(imgType == 1){
                     $(this).find('.desImgToggle').attr('src','../images/Shape_Copy_7.png');
                     $(this).find('.desImgToggle').attr('typeImg','2');
                     $(this).siblings().show(200);
                  }else {
                     $(this).find('.desImgToggle').attr('src','../images/Shape_Copy_8.png');
                     $(this).find('.desImgToggle').attr('typeImg','1');
                     $(this).siblings().hide(200);
                  };
               });


               //----------------------------------------------------------从二级跳到四级列表
               $('.H_secList .noThirdMemuList').on('tap',function(){
                  var name = $(this).attr('secondlevename');
                  var searchId= $(this).attr('secondlevelid');
                  window.location.href='H_checkList.html?name='+name+'&searchId='+searchId;
               });
               //----------------------------------------------------------从三级跳到四级列表
               $('.H_secList .checkListText li').on('tap',function(){
                  var name = $(this).attr('thirdlevelname');
                  var searchId= $(this).attr('thirdlevelid');
                  window.location.href='H_checkList.html?name='+name+'&searchId='+searchId;
               });

            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };

   //全局搜索
   $('.search_h img').on('tap',function () {
      // console.log('全局');
      var shareDate_ios = {
         'type': 'course',
      };
      var shareDate = JSON.stringify(shareDate_ios);
      if(window.webkit){
         window.webkit.messageHandlers.globalSearch.postMessage(shareDate);
      }else if(window.jsObj){
         window.jsObj.globalSearch(shareDate_ios);
      }
   })


});