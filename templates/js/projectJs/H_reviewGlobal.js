//解决ios端，window.history.back(-1)返回该页面，页面不刷新问题
window.addEventListener('pageshow', function(e) {
   // 通过persisted属性判断是否存在 BF Cache
   if (e.persisted) {
      window.location.reload();
   }
});

$(function(){
   new FastClick(document.body);
});

$(function(){
   var allowDiscussion = getRequestParam('allowDiscussion');//是否允许评论（0---不允许讨论，1---可以发表谈论）;
   var businessId = getRequestParam('businessId');//该课程id
   var businessTitle =decodeURIComponent(getRequestParam('businessTitle'));//该课程的标题
   var businessType = getRequestParam('businessType');//评论类型 1资讯详情、2病例详情、3课程学习、6课程直播、7医生推荐

   // var allowDiscussion = 1;
   // var businessId =  123;
   // var businessTitle = '供货商';
   // var businessType = 3;

   if(allowDiscussion == 0){
      $('.yesTalk').hide();
      $('.noTalk').show();
      $('.commentBtn').hide();
   };

   //点击（添加表情）事件
   $('.emotion').qqFace({
      id : 'facebox',
      assign:'saytext',
      path:'../images/'	//表情存放的路径
   });
   function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="../images/$1.gif" border="0" />');
      return str;
   };
   var qqFace_on_off = true;//用来切换表情的现实与隐藏
   $('#emotionId').on('click',function () {
      setTimeout(function() {
         if(qqFace_on_off){//显示
            $(this).click();
            $('.commentBtn .btnTwo').animate({bottom:'6.9rem'},200);
            qqFace_on_off = false;
            $('.commentBtn .btnTwo .disInput').attr("disabled","disabled");
            $('.commentBtn .btnTwo .disInput').attr("clickYes","1");
         }else {//隐藏
            $('#facebox').hide();
            $('#facebox').remove();
            $('.commentBtn .btnTwo').css({bottom:'0rem'});
            qqFace_on_off = true;
            $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
            $('.commentBtn .btnTwo .disInput').attr("clickYes","");
         }
      }, 100);
   });
   $('.commentBtn .btnTwo .discussion').on('click',function () {
      $('#facebox').hide();
      $('#facebox').remove();
      $('.commentBtn .btnTwo').css({bottom:'0rem'});
      qqFace_on_off = true;
      $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.commentBtn .btnTwo .disInput').attr("clickYes","");
      $('.commentBtn .btnTwo .disInput').focus();
   });
   //-------------------------------------------------------------------------------------------------------------失焦事件
   $('input').on('blur',function(){
      if($('.commentBtn .btnTwo .disInput').val() ==''){
         $('.commentBtn .btnOne').hide();
         $('.commentBtn .btnTwo').show();
         $('.commentBtn .btnTwo .disInput').val('');
         $('.commentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
         $('#publish').show();
         $('#publishFive').hide();
         $('#publishFour').hide();
      }
   });


   var pianYiLiang;//主评论列表的偏移量
   var mainCommentId;//主评论id
   var indexNumGlobal;//全局索引
   var pageSizeGlobal = 10;//全局一页加载10条数据
   //-------------主评论列表的一些全局参数
   var pageNumIndex = 1, timers = null, off_on = false, pagesAll =0;
   $(document).ready(function() {
      LoadingDataFn();
   });
   $(window).scroll(function () {
      var scrollTop = $(this).scrollTop();
      pianYiLiang = $(this).scrollTop();//主评论列表的偏移量
      var pianyiliangZhu = $(this).scrollTop();//主评论列表的偏移量
      sessionStorage.setItem('zhuOffectTop',pianyiliangZhu);
      // console.log('主评论列表的偏移量:'+pianyiliangZhu);
      var scrollHeight = $(document).height();
      var windowHeight = $(this).height();
      if (scrollTop + windowHeight  >  scrollHeight - 5 ) {
         if(off_on){
            $('.yesTalk .downLoad').show();
            clearTimeout(timers);
            timers = setTimeout(function() {
               pageNumIndex++;
               console.log("第" + pageNumIndex + "页");
               if(pageNumIndex <= pagesAll){
                  LoadingDataFn(); //调用执行下面的加载方法
               }else {
                  $('.yesTalk .downLoad').hide();
                  $('.yesTalk .showAllData').show();
                  off_on =false;
               }
            }, 500);
         }else {
            $('.yesTalk .downLoad').hide();
            $('.yesTalk .showAllData').show();
         }
      }
   });
   //------获取主评论数据列表
   function LoadingDataFn(){
      $('.yesTalk .showAllData').hide();
      var YData={
         'pathL':"/doctor/commentsMain/list",
         'accessToken':token,
         'pageNum':pageNumIndex,
         'pageSize':pageSizeGlobal,
         'businessId':businessId,
         'businessType':businessType
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
            if(res.state==0){
               if(res.data.total == 0){
                  $('.yesTalk .showAllData').show();
               }else {
                  $('.yesTalk .showAllData').hide();
                  pagesAll = res.data.pages;
                  off_on = true;
                  var data =res.data.result;
                  var inner = '';
                  //渲染一级列表数据
                  for(var i=0;i<data.length;i++){
                     var img = '';
                     var snapYesOn;
                     var perImage ='';
                     var emoji;
                     emoji =  replace_em(data[i].content);
                     if(data[i].support){
                        img = '<img src="../images/H_collect_y.png"/>';
                        snapYesOn = 'snapClass';
                     }else {
                        img = '<img src="../images/H_collect_n.png"/>';
                        snapYesOn = 'onSnapClass';
                     };
                     if(data[i].doctorHeadimg =='' || data[i].doctorHeadimg == null){
                        perImage = "../images/JpatientDP.png";
                     }else {
                        perImage = data[i].doctorHeadimg;
                     };
                     //这是二级评论展示与否
                     var speechTwoNei = '';
                     if(Number(data[i].replyCount) > 2){
                        speechTwoNei = '<div class="speechTwo">\n' +
                           '                                    <div class="getList">\n' +
                           '                                    </div>\n' +
                           '                                    <div class="totalLength">\n' +
                           '                                        <p>共<span>'+data[i].replyCount+'</span>条回复></p>\n' +
                           '                                    </div>\n' +
                           '                                </div>'
                     }else if(Number(data[i].replyCount) > 0 && Number(data[i].replyCount) <=2 ){
                        speechTwoNei = '<div class="speechTwo">\n' +
                           '                                    <div class="getList">\n' +
                           '                                    </div>\n' +
                           '                                </div>';
                     }else {
                        speechTwoNei = '<div class="speechTwo" style="padding: 0">\n' +
                           '                                    <div class="getList">\n' +
                           '                                    </div>\n' +
                           '                                </div>';
                     };
                     var indexNum= i + (pageNumIndex-1)*pageSizeGlobal;
                     inner += '<li indexNum = "'+indexNum+'" commentId="'+data[i].commentId+'">\n' +
                        '                                <div class="perImg" style="background-image:url(' + perImage + ')">\n'+
                        '\n' +
                        '                                </div>\n' +
                        '                                <div class="perSpeech">\n' +
                        '                                    <div class="perName">\n' +
                        '                                        <div class="doctorName">' +
                        '' +data[i].doctorName +
                        '</div>\n' +
                        '                                        <div class="doctorSnap">\n' +
                        '                                            <span class="' +
                        '' + snapYesOn +
                        '">' +
                        '' +data[i].supportCount+
                        '</span>\n' + img +
                        '\n' +
                        '                                        </div>\n' +
                        '                                    </div>\n' +
                        '                                    <div class="speechCon">\n' +
                        '                                        ' + emoji +
                        '\n' +
                        '                                    </div>\n' +
                        '                                    <div class="speechTime">\n' +
                        '                                        <span class="talkTime">' +
                        '' +data[i].dispalyTimeStr+
                        '</span>\n' +
                        '                                        <p class="replyNum">\n' +
                        '                                            <span class="wenzi">回复</span>\n' +
                        '                                        </p>\n' +
                        '                               </div>\n' +
                        '' + speechTwoNei +
                        '                                </div>\n' +
                        '                            </li>';
                  };
                  $(inner).appendTo('.yesTalk .history');
                  //渲染二级列表数据
                  var innerSecond = '';
                  for(var i=0;i<data.length;i++){
                     var secondReply = data[i].replyList;
                     if(secondReply != null){
                        for(var j=0; j<secondReply.length; j++){
                           var emojiTwo;
                           emojiTwo =  replace_em(secondReply[j].content);
                           innerSecond += '<p twoCommentId="'+secondReply[j].commentId+'" class="huiDoctor">\n' +
                              '                                        <span class="doctorName">'+secondReply[j].doctorName+'</span>:\n' +
                              '                                        <span class="talkCont">'+emojiTwo+'</span>\n' +
                              '            </p>'
                        };
                        var index= i + (pageNumIndex-1)*pageSizeGlobal;
                        $(innerSecond).appendTo($('.yesTalk').find('.history li').eq(index).find('.speechTwo .getList'));
                        innerSecond = '';
                     }
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


   //-------------------------------------------------------------------------------------------------------------------主评论中（btnTwo）中（发布）按钮点击
   $('#publish').on('tap',function () {
      if($('.commentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else {
         var YData={
            'pathL':"/doctor/commentsMain/commit",
            'accessToken':token,
            'businessId':businessId,
            'businessType':businessType,
            'content':$('.commentBtn .btnTwo .disInput').val(),
            'businessTitle':businessTitle
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
                  successMethod();
               }else{
                  showalert(0,''+res.msg+'',2);
               }
            },
            error:function(res){
               showalert(0,'请求失败',2);
            }
         });
      }
   });
   function successMethod(){
      $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.commentBtn .btnTwo .disInput').attr("clickYes",'');//--------------很容易遗漏
      $('html,body').animate({scrollTop:0},200);
      $('.commentBtn .btnTwo .disInput').val('');
      $('.commentBtn .btnTwo').hide();
      $('.commentBtn .btnOne').show();
      $('.yesTalk .history').html('');
      pageNumIndex =1;
      LoadingDataFn();
      $('#facebox').hide();
      $('#facebox').remove();
      $('.commentBtn .btnTwo').css({bottom:'0rem'});
   };
   //-------------------------------------------------------------------------------------------------------------------点击（回复）进行主评论
   $(document).on('click','.yesTalk .history li .replyNum',function () {
      $('.commentBtn .btnTwo .disInput').val('');
      mainCommentId = $(this).parent().parent().parent().attr('commentId');//全局主评论Id
      indexNumGlobal = $(this).parent().parent().parent().attr('indexNum');//全局索引
      // console.log(mainCommentId);
      if(allowDiscussion == 0){
         $('.yesTalk').hide();
         $('.noTalk').show();
         $('html,body').animate({scrollTop:0},200);
      }else {
         $('.commentBtn .btnOne').hide();
         $('.commentBtn .btnTwo').show();
         $('.commentBtn .btnTwo .disInput').focus();
         var doctorName =$(this).parent().siblings('.perName').find('.doctorName').text();//获取该医生姓名
         $('.commentBtn .btnTwo .disInput').attr('placeholder',doctorName);
         $('#publish').hide();
         $('#publishFive').hide();
         $('#publishFour').show();
      }
   });
   $('#publishFour').on('tap',function () {
      if($('.commentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else {
         var YData={
            'pathL':"/doctor/commentsReply/reply",
            'accessToken':token,
            'mainCommentId':mainCommentId,
            'replyCommentId':mainCommentId,
            'commentType':1,//1-回复主评论 2-回复评论的评论
            'content':$('.commentBtn .btnTwo .disInput').val(),
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
                  successMethodTwo();
               }else{
                  showalert(0,''+res.msg+'',2);
               }
            },
            error:function(res){
               showalert(0,'请求失败',2);
            }
         });
      }
   });
   //-------------------------------------------------------------------------------------------------------------------点击（医生说的话）进行二级评论
   var replyCommentId;//回复的评论id
   $(document).on('click','.yesTalk .history li .getList .huiDoctor',function () {
      $('.commentBtn .btnTwo .disInput').val('');
      replyCommentId = $(this).attr('twocommentid');//该评论医生得Id
      mainCommentId = $(this).parent().parent().parent().parent().attr('commentid');//该条评论主ID
      indexNumGlobal = $(this).parent().parent().parent().parent().attr('indexNum');//全局索引
      // console.log(replyCommentId);
      if(allowDiscussion == 0){
         $('.yesTalk').hide();
         $('.noTalk').show();
         $('html,body').animate({scrollTop:0},200);
      }else {
         $('.commentBtn .btnOne').hide();
         $('.commentBtn .btnTwo').show();
         var doctorName =$(this).find('.doctorName').text();//获取该医生姓名
         var huiFuYi ='回复  ' + doctorName +':';
         $('.commentBtn .btnTwo .disInput').attr('placeholder',huiFuYi);
         $('.commentBtn .btnTwo .disInput').focus();
         $('#publish').hide();
         $('#publishFive').show();
         $('#publishFour').hide();
      }
   });
   $('#publishFive').on('tap',function () {
      if($('.commentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else {
         var YData={
            'pathL':"/doctor/commentsReply/reply",
            'accessToken':token,
            'mainCommentId':mainCommentId,
            'replyCommentId':replyCommentId,
            'commentType':2,//1-回复主评论 2-回复评论的评论
            'content':$('.commentBtn .btnTwo .disInput').val(),
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
                  successMethodTwo();
               }else{
                  showalert(0,''+res.msg+'',2);
               }
            },
            error:function(res){
               showalert(0,'请求失败',2);
            }
         });
      }
   });
   function successMethodTwo(){
      $('html,body').animate({scrollTop:pianYiLiang + 100},500);
      $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.commentBtn .btnTwo .disInput').attr("clickYes",'');//--------------很容易遗漏
      $('.commentBtn .btnTwo .disInput').val('');
      $('.commentBtn .btnTwo').hide();
      $('.commentBtn .btnOne').show();
      $('#facebox').hide();
      $('#facebox').remove();
      $('.commentBtn .btnTwo').css({bottom:'0rem'});
      //局部刷新
      LoadDataListFu(mainCommentId);
   };
   function LoadDataListFu(mainCommentId){
      var YData={
         'pathL':"/doctor/commentsReply/replyList",
         'accessToken':token,
         'pageNum':1,
         'pageSize':2,
         'mainCommentId':mainCommentId
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
            if(res.state==0){
               //渲染前2条数据
               $('.yesTalk').find('.history li').eq(indexNumGlobal).find('.speechTwo').css('padding','0.4rem');
               $('.yesTalk').find('.history li').eq(indexNumGlobal).find('.speechTwo .getList').html('');//对应内容
               var data = res.data.result;
               var innerSecondHtml = '';
               for(var i=0;i<data.length;i++){
                  var emojiHtml;
                  emojiHtml =  replace_em(data[i].content);
                  innerSecondHtml += '<p twoCommentId="'+data[i].commentId+'" class="huiDoctor">\n' +
                     '                                        <span class="doctorName">'+data[i].doctorName+'</span>:\n' +
                     '                                        <span class="talkCont">'+emojiHtml+'</span>\n' +
                     '            </p>'
               };
               $(innerSecondHtml).appendTo($('.yesTalk').find('.history li').eq(indexNumGlobal).find('.speechTwo .getList'));
               //渲染多少条回复
               $('.yesTalk').find('.history li').eq(indexNumGlobal).find('.speechTwo .totalLength').remove();//对应多少条回复
               var total = res.data.total;
               var pHtml = '';
               if(total > 2){
                  pHtml = '<div class="totalLength">\n' +
                     '                                        <p>共<span>'+total+'</span>条回复></p>\n' +
                     '                                    </div>';
               }else {
                  pHtml = '';
               };
               $(pHtml).appendTo($('.yesTalk').find('.history li').eq(indexNumGlobal).find('.speechTwo'));
            }else {
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };


   //------------------------------------------------------------------------------------------------（btnOne）中的点击事件
   $('.commentBtn .btnOne').on('click',function () {
      if(allowDiscussion == 0){
         $('.yesTalk').hide();
         $('.noTalk').show();
         $('html,body').animate({scrollTop:0},200);
      }else {
         $(this).hide();
         $('.commentBtn .btnTwo').show();
         $('.commentBtn .btnTwo .disInput').focus();
         $('.commentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
         $('#publish').show();
         $('#publishFive').hide();
         $('#publishFour').hide();
      }
   });

   //-----------------------------------------------------------------------------------------------------跳转到评论二级列表
   $(document).on('tap','.yesTalk .history li .speechTwo .totalLength',function () {
      mainCommentId = $(this).parent().parent().parent().attr('commentId');//全局主评论Id
      var mobUrl ={
         'mainCommentId':mainCommentId,
         'allowDiscussion':allowDiscussion
      };
      var dataStr=JSON.stringify(mobUrl);
      if(window.webkit){
         window.webkit.messageHandlers.jumpToReplly.postMessage(dataStr);
      }else if(window.jsObj){
         window.jsObj.jumpToReplly(mainCommentId, allowDiscussion);
      }
      // window.location.href='H_replyGlobal.html?mainCommentId='+mainCommentId+'&allowDiscussion='+allowDiscussion+'&backAhead=1';
   });

   //-----------------------------------------------------------------------------------------------------------主列表点赞
   $(document).on('tap', '.yesTalk .history li .doctorSnap img', function () {
      var commentId =$(this).parent().parent().parent().parent().attr('commentId');//该条评论的commentId
      var yesNoSnap = $(this).siblings().hasClass('snapClass') ? 0 : 1;//点赞是0，不点赞是1
      var supportNum = Number($(this).siblings().text());
      if(yesNoSnap ==1){//一开始没有点赞的
         $(this).siblings().text(supportNum + 1);
         $(this).siblings().addClass('snapClass');
         $(this).attr('src','../images/H_collect_y.png');
         mainSnap(commentId,1);//0-取消点赞 1-点赞
      }else {//点过赞的
         $(this).siblings().text(supportNum - 1);
         $(this).attr('src','../images/H_collect_n.png');
         $(this).siblings().removeClass('snapClass');
         mainSnap(commentId,0);//0-取消点赞 1-点赞
      }
   });
   function mainSnap(commentId,yesNoSnap){
      var YData={
         'pathL':"/doctor/commentsSupport/support",
         'accessToken':token,
         'commentId':commentId,
         'commentType':1,//评论类型 1-主评论 2-回复评论
         'supportState':yesNoSnap//0-取消点赞 1-点赞
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

            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };



   //方法一（内容多于一屏幕）: focusin(软键盘弹起事件)、focusout(软键盘关闭事件)
   var u = navigator.userAgent;
   var flag;
   var myFunction;
   var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
   if(isIOS){
      document.body.addEventListener('focusin', () => {  //软键盘弹起事件
         flag=true;
         clearTimeout(myFunction);
      });
      document.body.addEventListener('focusout', () => { //软键盘关闭事件
         flag=false;
         if(!flag){
            myFunction = setTimeout(function(){
               //重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
               // window.scrollTo({top:pianYiLiang - 2 - 450,left:0,behavior:"smooth"});
               qqFace_on_off = true;
               blurAdjust();
            },200);
         }else{
            return;
         }
      })
   }else{
      return;
   };

   function blurAdjust(){
      setTimeout(()=>{
         if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
            return
         };
         var result = 'pc';
         if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            result = 'ios'
         }else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
            result = 'android'
         };
         if(result = 'ios'){
            document.activeElement.scrollIntoViewIfNeeded(true);
            window.scrollTo({top:pianYiLiang - 450,left:0,behavior:"smooth"});
         }
      },400)
   }

});