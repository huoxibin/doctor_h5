//解决移动端200毫秒延迟，点投事件
$(function(){
   new FastClick(document.body);
});

$(function(){
    var mainCommentId = getRequestParam('mainCommentId');//上个页面主评论的评论id
    var allowDiscussion = getRequestParam('allowDiscussion');//是否允许评论
    var replyCommentId;//回复的评论id
    //---------------------------------------------分享出去之后
    var closeHeader=getRequestParam('closeHeader');
    if(closeHeader == 'closeHeader'){
      $('.Ynav').hide();
    };
    //---------------------------------------------偏移量
     var pianYiLiang = getRequestParam('pianYiLiang');
     sessionStorage.setItem("H_pianYi", pianYiLiang);
    //----------------------------------------------返回按钮（配合原生用的）
    var backAhead = getRequestParam('backAhead') || null;
    $('.Hnav .dialogTop').on('tap',function () {
       if(backAhead == 1){
          window.history.back();
       }else {
          jumpMobil();
       }
    });



    //参与讨论(输入区)中（添加表情）点击事件
   $('.emotion').qqFace({
      id : 'facebox',
      assign:'saytext',
      path:'../images/'	//表情存放的路径
   });
   var qqFace_on_off = true;//用来切换表情的现实与隐藏
   $('#emotionId').on('click',function () {
      setTimeout(function() {
         if(qqFace_on_off){//显示
            $(this).click();
            $('.dialogCommentBtn .btnTwo').animate({bottom:'6.9rem'},200);
            $('.dialogCommentBtn .btnTwo .disInput').attr("disabled","disabled");
            $('.dialogCommentBtn .btnTwo .disInput').attr("clickYes","1");
            qqFace_on_off = false;
         }else {//隐藏
            $('#facebox').hide();
            $('#facebox').remove();
            $('.dialogCommentBtn .btnTwo').css({bottom:'0rem'});
            qqFace_on_off = true;
            $('.dialogCommentBtn .btnTwo .disInput').removeAttr("disabled");
            $('.dialogCommentBtn .btnTwo .disInput').attr("clickYes","");
         }
      }, 100);
   });
   $('.dialogCommentBtn .btnTwo .discussion').on('click',function () {
      $('#facebox').hide();
      $('#facebox').remove();
      $('.dialogCommentBtn .btnTwo').css({bottom:'0rem'});
      qqFace_on_off = true;
      $('.dialogCommentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.dialogCommentBtn .btnTwo .disInput').attr("clickYes","");
      $('.dialogCommentBtn .btnTwo .disInput').focus();
   });
   //-------------------------------------------------------------------------------------------------------------失焦事件
   $('input').on('blur',function(){
      if($('.dialogCommentBtn .btnTwo .disInput').val() ==''){
         $('.dialogCommentBtn .btnOne').hide();
         $('.dialogCommentBtn .btnTwo').show();
         $('.dialogCommentBtn .btnTwo .disInput').val('');
         $('.dialogCommentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
         $('#dialogPublish').show();
         $('#dialogToSomePublish').hide();
      }
   });


    //-------------复评论列表的一些全局参数
    var pageNumFu = 1, timersFu = null, off_on_fu = false, pagesAllFu =0;
    var pianYiLiangFu;
    //页面初始化
    window.onload = function(){
        // $(window).scrollTop(0);
        $('.dialogReply').animate({top:'0px'},500);
        // $('.dialogReply').animate({top:10,bottom:0},500);
        $('.dialogCommentBtn .btnTwo .disInput').val('');
        $('.dialogCommentBtn .btnOne').hide();
        $('.dialogCommentBtn .btnTwo').show();
        // $('.dialogCommentBtn .btnTwo .disInput').focus();
        LoadDataListFu(mainCommentId);
        LoadDataListZhu(mainCommentId);
    };
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        pianYiLiangFu = $(this).scrollTop();
        // console.log(pianYiLiangFu);
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight  >  scrollHeight - 5 ) {
            if(off_on_fu){
                $('.doctorDiscuss .downLoad').show();
                clearTimeout(timersFu);
                timersFu = setTimeout(function() {
                    pageNumFu++;
                    console.log("第" + pageNumFu + "页");
                    if(pageNumFu <= pagesAllFu){
                        LoadDataListFu(mainCommentId);
                    }else {
                        $('.doctorDiscuss .downLoad').hide();
                        $('.doctorDiscuss .showAllData').show();
                        off_on_fu =false;
                    }
                }, 500);
            }else {
                $('.doctorDiscuss .downLoad').hide();
                $('.doctorDiscuss .showAllData').show();
            }
        }
    });
    //------获取复评论数据列表
    function LoadDataListFu(mainCommentId){
        $('.doctorDiscuss .showAllData').hide();
        var YData={
            'pathL':"/doctor/commentsReply/replyList",
            'accessToken':token,
            'pageNum':pageNumFu,
            'pageSize':10,
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
                    $('.Hnav .dialogTop span').html(res.data.total);
                    if(res.data.total == 0){
                       $('.doctorDiscuss .showAllData').show();
                    }else {
                       $('.doctorDiscuss .showAllData').hide();
                       pagesAllFu = res.data.pages;
                       off_on_fu = true;

                       var data =res.data.result;
                       var result = '';
                       for(var i = 0; i < data.length; i++){
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
                          result += '<li commentId="'+data[i].commentId+'">\n' +
                             '                        <div class="perImg" style="background-image:url(' + perImage + ')">\n'+
                             '\n' +
                             '                        </div>\n' +
                             '                        <div class="perSpeech">\n' +
                             '                            <div class="perName">\n' +
                             '                                <div class="doctorName">' +
                             '' +data[i].doctorName+
                             '</div>\n' +
                             '                                <div class="doctorSnap">\n' +
                             '                                    <span class="' +
                             '' + snapYesOn +
                             '">' +
                             '' +data[i].supportCount +
                             '</span>\n' + img  +
                             '\n' +
                             '                                </div>\n' +
                             '                            </div>\n' +
                             '                            <div class="speechCon">\n' +
                             '                               ' + emoji +
                             '\n' +
                             '                            </div>\n' +
                             '                            <div class="speechTime">\n' +
                             '                                <span class="talkTime">' +
                             '' +data[i].dispalyTimeStr+
                             '</span>\n' +
                             '                                <span class="wenzi">回复</span>\n' +
                             '                            </div>\n' +
                             '                        </div>\n' +
                             '                    </li>'
                       }
                       $(result).appendTo('.doctorDiscuss .doctorDiscussList');
                    }
                }else {
                    showalert(0,''+res.msg+'',2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    };

   //-------------------------------------------------------------------------------复评论中（btnOne）中（说说您的看法）按钮点击
   $('.dialogCommentBtn .btnOne').on('click',function (){
      $('.dialogCommentBtn .btnOne').hide();
      $('.dialogCommentBtn .btnTwo').show();
      $('.dialogCommentBtn .btnTwo .disInput').focus();
      $('.dialogCommentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
      $('#dialogPublish').show();
      $('#dialogToSomePublish').hide();
   });

   //--------------------------------------------------------------------------------------点击（医生说的话、回复）按钮回复某人
   $(document).on('click','.doctorDiscussList li .wenzi',function () {
      $('.dialogCommentBtn .btnOne').hide();
      $('.dialogCommentBtn .btnTwo').show();
      $('#dialogPublish').hide();
      $('#dialogToSomePublish').show();

      replyCommentId = $(this).parent().parent().parent().attr('commentId');//对李名医生说话的人
      var doctorName =$(this).parent().parent().parent().find('.doctorName').text();//获取该医生姓名
      var huiFuYi ='回复  ' + doctorName +':';
      $('.dialogCommentBtn .btnTwo .disInput').attr('placeholder',huiFuYi);
      $('.dialogCommentBtn .btnTwo .disInput').focus();
   });
   $(document).on('click','.doctorDiscussList li .speechCon',function () {
      $('.dialogCommentBtn .btnOne').hide();
      $('.dialogCommentBtn .btnTwo').show();
      $('#dialogPublish').hide();
      $('#dialogToSomePublish').show();

      replyCommentId = $(this).parent().parent().attr('commentId');//对李名医生说话的人
      var doctorName =$(this).parent().parent().find('.doctorName').text();//获取该医生姓名
      var huiFuYi ='回复  ' + doctorName +':';
      $('.dialogCommentBtn .btnTwo .disInput').attr('placeholder',huiFuYi);
      $('.dialogCommentBtn .btnTwo .disInput').focus();
   });
   $('#dialogToSomePublish').on('tap',function () {
      if($('.dialogCommentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else {
         var YData={
            'pathL':"/doctor/commentsReply/reply",
            'accessToken':token,
            'mainCommentId':mainCommentId,
            'replyCommentId':replyCommentId,
            'commentType':2,//1-回复主评论 2-回复评论的评论
            'content':$('.dialogCommentBtn .btnTwo .disInput').val(),
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
   //-------------------------------------------------------------------------------------（btnTwo）中（对主评论发布）按钮点击
   $('#dialogPublish').on('tap',function () {
      if($('.dialogCommentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else if(allowDiscussion == 0){
         showalert(0,'该用户不允许评论',2);
         return;
      } else {
         var YData={
            'pathL':"/doctor/commentsReply/reply",
            'accessToken':token,
            'mainCommentId':mainCommentId,
            'replyCommentId':mainCommentId,
            'commentType':1,//1-回复主评论 2-回复评论的评论
            'content':$('.dialogCommentBtn .btnTwo .disInput').val(),
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
      $('.dialogCommentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.dialogCommentBtn .btnTwo .disInput').attr("clickYes",'');//--------------很容易遗漏
      $('.dialogCommentBtn .btnTwo .disInput').val('');
      $('.dialogCommentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
      $('.dialogCommentBtn .btnOne').show();
      $('.dialogCommentBtn .btnTwo').hide();
      $('.doctorDiscuss .doctorDiscussList').html('');
      pageNumFu =1;
      LoadDataListFu(mainCommentId);
      $('#facebox').hide();
      $('#facebox').remove();
      $('.dialogCommentBtn .btnTwo').css({bottom:'0rem'});
      window.scrollTo({top:0,left:0,behavior:"smooth"});
   };

   //-----------------------------------------------------------------------------------------------------------复评论点赞
   $(document).on('tap','.doctorDiscussList li .doctorSnap img',function () {
      var commentId =$(this).parent().parent().parent().parent().attr('commentId');
      var yesNoSnap = $(this).siblings().hasClass('snapClass') ? 0 : 1;
      var supportNum = Number($(this).siblings().text());
      if(yesNoSnap ==1){//一开始没有点赞的
         $(this).siblings().text(supportNum + 1);
         $(this).siblings().addClass('snapClass');
         $(this).attr('src','../images/H_collect_y.png');
         fuSnap(commentId,yesNoSnap);
      }else {//点过赞的
         $(this).siblings().text(supportNum - 1);
         $(this).attr('src','../images/H_collect_n.png');
         $(this).siblings().removeClass('snapClass');
         fuSnap(commentId,yesNoSnap);
      }
   });
   function fuSnap(commentId,yesNoSnap){
      var YData={
         'pathL':"/doctor/commentsSupport/support",
         'accessToken':token,
         'commentId':commentId,
         'commentType':2,//评论类型 1-主评论 2-回复评论
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

   //--------------------------------------------------------------------------------------------------------获取主评论接口
   function LoadDataListZhu(mainCommentId){
      var YData={
         'pathL':"/doctor/commentsMain/infoById",
         'accessToken':token,
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
               var zhuMsg = res.data;
               if(zhuMsg.doctorHeadimg =='' || zhuMsg.doctorHeadimg == null){
                  $('.docotrTalk .perImg').css('background-image',"url(../images/JpatientDP.png)");
               }else {
                  // $('.docotrTalk .perImg img').attr('src',zhuMsg.doctorHeadimg);
                  $('.docotrTalk .perImg').css('background-image',"url(" + zhuMsg.doctorHeadimg + ")");

               };
               $('.docotrTalk .perName .doctorName').html(zhuMsg.doctorName);
               $('.docotrTalk .speechCon').html(replace_em(zhuMsg.content));
               $('.docotrTalk .speechTime .talkTime').html(zhuMsg.dispalyTimeStr);
               $('.docotrTalk .doctorSnap span').text(zhuMsg.supportCount);

               var snapYesOn = res.data.support;
               if(snapYesOn){
                  $('.docotrTalk .doctorSnap span').addClass('snapClass');
                  $('.docotrTalk .doctorSnap img').attr('src','../images/H_collect_y.png')
               }else {
                  $('.docotrTalk .doctorSnap span').removeClass('snapClass');
                  $('.docotrTalk .doctorSnap img').attr('src','../images/H_collect_n.png')
               }
            }else {
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };
   //---------------------------------------------------------------------------------------------------------对主评论点赞
   $('.dialogReply .perSpeech .doctorSnap img').on('tap',function () {
      var yesNoSnap = $(this).siblings().hasClass('snapClass') ? 0 : 1;//点赞是0，不点赞是1
      var supportNum = Number($(this).siblings().text());
      if(yesNoSnap ==1){//一开始没有点赞的
         $(this).siblings().text(supportNum + 1);
         $(this).siblings().addClass('snapClass');
         $(this).attr('src','../images/H_collect_y.png');
         mainSnap(mainCommentId,1);//0-取消点赞 1-点赞
      }else {//点过赞的
         $(this).siblings().text(supportNum - 1);
         $(this).attr('src','../images/H_collect_n.png');
         $(this).siblings().removeClass('snapClass');
         mainSnap(mainCommentId,0);//0-取消点赞 1-点赞
      }
    });
   function mainSnap(mainCommentId,yesNoSnap) {
      var YData={
         'pathL':"/doctor/commentsSupport/support",
         'accessToken':token,
         'commentId':mainCommentId,
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

   //表情的正则
   function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="../images/$1.gif" border="0" />');
      return str;
   };


   //focusin(软键盘弹起事件)、focusout(软键盘关闭事件)
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
               blurAdjust();
               qqFace_on_off = true;
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
            window.scrollTo({top:pianYiLiangFu - 450,left:0,behavior:"smooth"});
         }
      },400)
   }
});