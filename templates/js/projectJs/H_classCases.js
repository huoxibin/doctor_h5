//解决ios端，window.history.back(-1)返回该页面，页面不刷新问题
window.addEventListener('pageshow', function(e) {
   // 通过persisted属性判断是否存在 BF Cache
   if (e.persisted) {
      window.location.reload();
   }
});

$(function(){
   new FastClick(document.body);
    GHUTILS.openInstall()  //openinstall 唤醒app
});

$(function(){
   var businessId = getRequestParam('businessId');
   var checkStatus = getRequestParam('checkStatus');
   // var businessId = 22;

   //从我的病例（审核中、审核通过）
   if(checkStatus == 1){//审核中(不展示评论、收藏和分享按钮)
      $('.commentArea').hide();
      $('.commentBtn').hide();
      $('.Ynav .collectBtn').hide();
      $('.Ynav .shareBtn').hide();
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

   var pageNumFu = 1;
   var maskZhe = false;
   var shareDescription;//分享描述
   var pianYiLiang,pianYiLiangTwo;//主评论列表的偏移量
   var businessTitle;//该病例标题
   var favorited;//0是未收藏、1是已收藏
   var doctorImage;//医生头像
   var allowDiscussion;//是否允许评论（0---不允许讨论，1---可以发表谈论）
   loadActionDis();
   showLoading();
   function loadActionDis(){
      var YData={
         'pathL':"/doctor/typicalDiseasesArticle/getTypicalDetail",
         'accessToken':token,
         'id':businessId
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
               $('.demoTitle').html(res.data.diseasesTitle);
               businessTitle = res.data.diseasesTitle;
               favorited = res.data.favorited;
               // console.log(favorited);
               if(favorited == 0){//0是未收藏
                  $('.collectBtn').removeClass('active');
               }else {//1是已收藏
                  $('.collectBtn').addClass('active');
               };

               $('.perInfo_good .name').html(res.data.doctorName);
               $('.perInfo_good .job').html(res.data.doctorPosition);
               $('.hospitalName .hospital').html(res.data.hospitalName);
               $('.hospitalName .doctorDepartment').html(res.data.ownedSecondLev);

               // if(res.data.doctorId){
               //    $('.hospitalName .doctorDepartment').html(res.data.doctorDepartment);
               // }else {
               //    $('.hospitalName .doctorDepartment').html(JSON.parse(res.data.doctorDepartment)[0].label);
               // };

               //字符串截取
               // var goodAt = res.data.doctorProfession;
               // $('.goodAtCon').html(subStr(goodAt));
               // function subStr(msg) {
               //    return '擅长：'+ msg.substring(0,28) + '...';
               // };
               // var toggle = true;
               // $('.triangle img').on('tap',function () {
               //    if(toggle){
               //       $(this).attr('src','../images/H_triangle_d.png');
               //       toggle = false;
               //       $('.goodAtCon').text('擅长：'+ goodAt);
               //    }else{
               //       $(this).attr('src','../images/H_triangle_n.png');
               //       toggle = true;
               //       $('.goodAtCon').text(subStr(goodAt));
               //    }
               // });

               //医生头像
               doctorImage = res.data.doctorImage;
               // $('.perInfo_img img').attr('src',doctorImage);
               if(doctorImage =='' || doctorImage == null){
                  $('.perInfo_img').css('background-image',"url(../images/JpatientDP.png)");
                  $('.perInfo_img').css('background-size',"contain");
               }else {
                  $('.perInfo_img').css('background-image',"url(" + doctorImage + ")");
                  $('.perInfo_img').css('background-size',"cover");
               };


               var diseasesContent = JSON.parse(res.data.diseasesContent);
               shareDescription = diseasesContent.baseInfo;
               console.log(shareDescription);
               for(var i in diseasesContent){
                  var diseasesHistory = diseasesContent[i];
                  // console.log(diseasesHistory);
                  if(diseasesHistory==''){
                     // $('.'+i).html('无');
                     $('.'+i).parent().hide();
                  }else {
                     $('.'+i).html(interlac(diseasesHistory));
                  }
               };

               //--------------------------------------------------------------(初始默认加载9张图片)辅助检查中得图片列表
               var diseasesImagesList = JSON.parse(res.data.diseasesImages);
               var jieQuImg = 9;//这是默认加载几张图片
               if(diseasesImagesList.length>0){
                  if(diseasesImagesList.length < jieQuImg){
                     $('.viewMore').hide();
                     var inner = '';
                     for(var i=0;i<diseasesImagesList.length;i++){
                        inner += '<figure class="h_figImg">\n' +
                           '                    <div class="img-dv">\n' +
                           '                        <a href="' +
                           '' + diseasesImagesList[i].url +
                           '" data-size="1920x1080">\n' +
                           '                            <img src="' +
                           '' + diseasesImagesList[i].url +
                           '">\n' +
                           '                        </a>\n' +
                           '                    </div>\n' +
                           '                </figure>'
                     }
                     $(inner).appendTo('#H_disImaList');
                  }else {
                     diseasesImagesList.splice(jieQuImg,100);
                     var inner = '';
                     for(var i=0;i<diseasesImagesList.length;i++){
                        inner += '<figure class="h_figImg">\n' +
                           '                    <div class="img-dv">\n' +
                           '                        <a href="' +
                           '' + diseasesImagesList[i].url +
                           '" data-size="1920x1080">\n' +
                           '                            <img src="' +
                           '' + diseasesImagesList[i].url +
                           '">\n' +
                           '                        </a>\n' +
                           '                    </div>\n' +
                           '                </figure>'
                     }
                     $(inner).appendTo('#H_disImaList');
                  }
               }else {
                  $('.viewMore').hide();
               }

               //-------------------------------------------------------------------------点击（查看更多）
               var count = 1;
               $('.viewMore').on('click',function () {
                  $('#H_disImaList').html('');
                  var diseasesImagesList = JSON.parse(res.data.diseasesImages);
                  count++;
                  var imgJie = diseasesImagesList.slice(jieQuImg*count);
                  console.log(imgJie);
                  if(imgJie.length == 0){
                     $('.viewMore').hide();
                  };
                  diseasesImagesList.splice(jieQuImg*count,100);
                  console.log(diseasesImagesList.length);
                  var inner = '';
                  for(var i=0;i<diseasesImagesList.length;i++){
                     inner += '<figure class="h_figImg">\n' +
                        '                    <div class="img-dv">\n' +
                        '                        <a href="' +
                        '' + diseasesImagesList[i].url +
                        '" data-size="1920x1080">\n' +
                        '                            <img src="' +
                        '' + diseasesImagesList[i].url +
                        '">\n' +
                        '                        </a>\n' +
                        '                    </div>\n' +
                        '                </figure>'
                  }
                  $(inner).appendTo('#H_disImaList');
               });

               //是否允许评论（0否，1是）
               allowDiscussion = res.data.allowDiscussion;
               if(allowDiscussion == 0){
                  $('.yesTalk').hide();
                  $('.noTalk').show();
                  $('.commentBtn').hide();
               };
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
   $('.collectBtn').on('click',function () {
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
         'valueId':businessId,//收藏内容的id号，资讯id号，指南id号等
         'valueTitle':businessTitle,//标题
         'valueMemo':'',//备注
         'valueImageUrl':doctorImage,//图标url
         'valueType':2,//收藏信息类型 1资讯、2病历、3课程、4指南、5检验
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
                   clearTimeout(timer)
                   var timer = setTimeout(function () {
                       //收藏加积分
                       if(token != ''){ //在应用内查看加积分 应用外无效
                           GHUTILS.integration('addFavorite',function (result) {
                               if(result.data.earnTaskPoint > '0'){
                                   GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                               }
                           });
                       }
                   },2500)
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

    var H_scrollTop=sessionStorage.getItem("H_pianYi");
    console.log(H_scrollTop);
    window.onload = function(){
       // $(window).scrollTop(H_scrollTop);
       $('html,body').animate({scrollTop:H_scrollTop},10);
       sessionStorage.clear();
    };

    var mainCommentId;//主评论id
    var indexNumGlobal;//全局索引
    var pageSizeGlobal = 10;//全局一页加载10条数据
    //-------------主评论列表的一些全局参数
    var pageNumIndex = 1, timers = null, off_on = false, pagesAll =0;
    $(document).ready(function() {
        LoadingDataFn();
    });
    $(window).scroll(function () {
        //已经滚动到上面的页面高度
        var scrollTop = $(this).scrollTop();
        pianYiLiang = $(this).scrollTop();//主评论列表的偏移量
        // console.log(pianYiLiang);
        //页面高度
        var scrollHeight = $(document).height();
        // console.log(scrollHeight);//1813
        //浏览器窗口高度
        var windowHeight = $(this).height();
        // console.log(windowHeight);//568
        //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
        if (scrollTop + windowHeight  >  scrollHeight - 5 ) {
           if(shareGlobal == 1){
               console.log('不加载数据！')//配合分享出去之后展示2条数据
           }else {
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
        }
    });
    //----------------------------------------------------------------------------------------获取主评论数据列表
    function LoadingDataFn(){
        $('.yesTalk .showAllData').hide();
        var YData={
            'pathL':"/doctor/commentsMain/list",
            'accessToken':token,
            'pageNum':pageNumIndex,
            'pageSize':pageSizeGlobal,
            'businessId':businessId,
            'businessType':2
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

   //-------------------------------------------------------------------------------------------------------------------对改文章进行评论
   $('#publish').on('click',function () {
      if($('.commentBtn .btnTwo .disInput').val() ==''){
         showalert(0,'请输入内容',2);
         return;
      }else {
         var YData={
            'pathL':"/doctor/commentsMain/commit",
            'accessToken':token,
            'businessId':businessId,
            'businessType':2,
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
   //-------------------------------------------------------------------------------------------------------------------点击（回复）进行主评论
   $(document).on('click','.yesTalk .history li .replyNum',function () {
      if(shareGlobal == 1){
         console.log('不许点击！');
      }else {
         $('.commentBtn .btnTwo .disInput').val('');
         mainCommentId = $(this).parent().parent().parent().attr('commentId');//全局主评论Id
         indexNumGlobal = $(this).parent().parent().parent().attr('indexNum');//全局索引
         // console.log(mainCommentId);
         if(allowDiscussion == 0){
            $('.yesTalk').hide();
            $('.noTalk').show();
            var H_offsetTop = $('.casesDemo').height();
            $('html,body').animate({scrollTop:H_offsetTop},200);
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
      }
   });
   $('#publishFour').on('click',function () {
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
      if(shareGlobal == 1){
         console.log('不许点击！');
      }else {
         $('.commentBtn .btnTwo .disInput').val('');
         replyCommentId = $(this).attr('twocommentid');//该评论医生得Id
         mainCommentId = $(this).parent().parent().parent().parent().attr('commentid');//该条评论主ID
         indexNumGlobal = $(this).parent().parent().parent().parent().attr('indexNum');//全局索引
         // console.log(replyCommentId);
         if(allowDiscussion == 0){
            $('.yesTalk').hide();
            $('.noTalk').show();
            var H_offsetTop = $('.casesDemo').height();
            $('html,body').animate({scrollTop:H_offsetTop},200);
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
      }
   });
   $('#publishFive').on('click',function () {
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
   function successMethod(){
      var H_offsetTop = $('.casesDemo').height() + $('.commentArea .titleCon').height() +50;
      $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.commentBtn .btnTwo .disInput').attr("clickYes",'');//--------------很容易遗漏
      $('html,body').animate({scrollTop:H_offsetTop},200);
      $('.commentBtn .btnTwo .disInput').val('');
      $('.commentBtn .btnTwo').hide();
      $('.commentBtn .btnOne').show();
      $('.commentBtn .btnOne .goBottom').hide();
      $('.commentBtn .btnOne .goTop').show();
      $('.yesTalk .history').html('');
      pageNumIndex =1;
      LoadingDataFn();
      $('#facebox').hide();
      $('#facebox').remove();
      $('.commentBtn .btnTwo').css({bottom:'0rem'});
   };
   function successMethodTwo(){
      $('html,body').animate({scrollTop:pianYiLiang + 100},500);
      $('.commentBtn .btnTwo .disInput').removeAttr("disabled");
      $('.commentBtn .btnTwo .disInput').attr("clickYes",'');//--------------很容易遗漏
      $('.commentBtn .btnTwo .disInput').val('');
      $('.commentBtn .btnTwo').hide();
      $('.commentBtn .btnOne').show();
      $('.commentBtn .btnOne .goBottom').hide();
      $('.commentBtn .btnOne .goTop').show();
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

   //-----------------------------------------------------------------------------------------------------跳转到评论二级列表
   $(document).on('click','.yesTalk .history li .speechTwo .totalLength',function () {
      if(shareGlobal == 1){
         console.log('不许点击！');
      }else {
         mainCommentId = $(this).parent().parent().parent().attr('commentId');//全局主评论Id
         console.log(mainCommentId);
         window.location.href='H_replyGlobal.html?mainCommentId='+mainCommentId+'&pianYiLiang='+pianYiLiang+'&allowDiscussion='+allowDiscussion+'&backAhead=1';

         // $('.tc_box, .tc').removeClass('hide');
         // $('.dialogReply').animate({top:"70px"});
         //
         // mainCommentId = $(this).parent().parent().parent().attr('commentid');//该条评论主ID
         // $('.dialogTop').attr('fuCommentId',mainCommentId);
         // $('.dialogCommentBtn .btnTwo .disInput').val('');
         // $('.dialogCommentBtn .btnOne').hide();
         // $('.dialogCommentBtn .btnTwo').show();
         //
         //
         // $('.doctorDiscuss .doctorDiscussList').html('');
         // LoadDataListFuDialog(mainCommentId);
         // LoadDataListZhu(mainCommentId);
         //
         // maskZhe = true;
         // document.body.classList.add('overflow-hidden');
         // // document.addEventListener('touchmove',  function(e) {e.preventDefault()},{ passive: false });
         //
         // pianYiLiangTwo = pianYiLiang;
      }
   });

   //关闭弹窗
   // $('.dialogTop').on('tap',function () {
   //    $('html,body').animate({scrollTop:pianYiLiangTwo});
   //    LoadDataListFu($(this).attr('fuCommentId'));
   //    $('.tc_box, .tc').addClass('hide');
   //    $('.dialogReply').animate({top:"950px"});
   //    maskZhe = false;
   //    document.body.classList.remove('overflow-hidden');
   //    // document.removeEventListener('touchmove', function(e) {e.preventDefault()},{ passive: false });
   // });


    //----------------------------------------------------------------------------------------------------------主列表点赞
    $(document).on('click', '.yesTalk .history li .doctorSnap img', function () {
       if(shareGlobal == 1){
          console.log('不许点击！');
       }else {
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

    //-------------------------------------------------------------------------------------------------（btnOne）中的点击事件
    $('.commentBtn .btnOne .discussion').on('click',function () {
       if(allowDiscussion == 0){
          $('.yesTalk').hide();
          $('.noTalk').show();
          var H_offsetTop = $('.casesDemo').height();
          $('html,body').animate({scrollTop:H_offsetTop},200);
       }else {
          $(this).parent().hide();
          $('#publish').show();
          $('#publishFive').hide();
          $('#publishFour').hide();
          $('.commentBtn .btnTwo').show();
          $('.commentBtn .btnTwo .disInput').focus();
          $('.commentBtn .btnTwo .disInput').attr('placeholder','说说您的看法');
       }
    });
    $('.commentBtn .btnOne .goBottom').on('click',function () {
      var H_offsetTop = $('.casesDemo').height() + 50;
      $('html,body').animate({scrollTop:H_offsetTop},500);
      $(this).hide();
      $(this).siblings('.goTop').show();
   });
    $('.commentBtn .btnOne .goTop').on('click',function () {
      $(this).hide();
      $(this).siblings('.goBottom').show();
      window.scroll(0,0);
   });


   //--------分享调用原生方法
   var shareGlobal;
   var closeHeader=getRequestParam('closeHeader');
   if(closeHeader == 'closeHeader'){
      $('.Ynav').addClass('hide');
      $('.shareHeader').removeClass('hide');
      $('.viewMoreClass').removeClass('hide');
      $('.commentArea').show();
      pageSizeGlobal = 2;
      shareGlobal =1;
      $('.commentBtn').hide();
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
   };
   //--------点击（分享）按钮
   $('.shareBtn').on('tap',function () {
      shareDescription = shareDescription.substr(0,50);
      // console.log(window.location.href);
      var shareDate_ios = {
         'shareLink': window.location.href + '&closeHeader=closeHeader' + '&shareHeader=shareHeader&module=6',
         'shareImgUrl': getRequestParam('shareImgUrl') || null,
         'shareArticletitle':businessTitle,
         'shareDescription': shareDescription
      };
      var shareDate = JSON.stringify(shareDate_ios);
      if(window.webkit){
         window.webkit.messageHandlers.transmitMsge.postMessage(shareDate);
      }else if(window.jsObj){
         window.jsObj.transmitMsge(window.location.href +'&closeHeader=closeHeader&shareHeader=shareHeader&module=6','', businessTitle,shareDescription);
      };
   });

   //(\n)换行成（br）
   function interlac(msg) {
      return msg.replace(/\n/g,'</br>');
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
            },500);
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

   //方法一（内容不满一屏幕）: 解决ios移动端 软键盘收起后，页面内容不下滑
   /*$('input,textarea').on('blur',function(){
      window.scroll(pianYiLiang,pianYiLiang);
   });
   $('input').on('focus',function(){
       window.scroll(pianYiLiang,pianYiLiang);
   });*/

   //方法二（内容多于一屏幕）: scrollIntoViewIfNeeded
   /*$('input').on('blur',function(){
      blurAdjust();
   });*/




   //---------------------------------------------------二级评论---------------------------------------------------------


   //-------------复评论列表的一些全局参数
   var timersFu = null, off_on_fu = false, pagesAllFu =0;
   var pianYiLiangFu;

   // $(window).scroll(function () {
   //    if(maskZhe){
   //       var scrollTop = $(this).scrollTop();
   //       pianYiLiangFu = $(this).scrollTop();
   //       var scrollHeight = $(document).height();
   //       var windowHeight = $(this).height();
   //       if (scrollTop + windowHeight  >  scrollHeight - 5 ) {
   //          if(off_on_fu){
   //             $('.doctorDiscuss .downLoad').show();
   //             clearTimeout(timersFu);
   //             timersFu = setTimeout(function() {
   //                pageNumFu++;
   //                console.log("第" + pageNumFu + "页");
   //                if(pageNumFu <= pagesAllFu){
   //                   LoadDataListFuDialog(mainCommentId);
   //                }else {
   //                   $('.doctorDiscuss .downLoad').hide();
   //                   $('.doctorDiscuss .showAllData').show();
   //                   off_on_fu =false;
   //                }
   //             }, 500);
   //          }else {
   //             $('.doctorDiscuss .downLoad').hide();
   //             $('.doctorDiscuss .showAllData').show();
   //          }
   //       }
   //    }
   // });

   //------获取复评论数据列表
   // function LoadDataListFuDialog(mainCommentId){
   //    $('.doctorDiscuss .showAllData').hide();
   //    var YData={
   //       'pathL':"/doctor/commentsReply/replyList",
   //       'accessToken':token,
   //       'pageNum':pageNumFu,
   //       'pageSize':10,
   //       'mainCommentId':mainCommentId
   //    };
   //    Ajax({
   //       url:servUrl,
   //       data:YData,
   //       async: false,
   //       beforeSend: function(){
   //       },
   //       type : 'get',
   //       dataType : "json",
   //       success:function(res){
   //          if(res.state==0){
   //             $('.Hnav .dialogTop span').html(res.data.total);
   //             if(res.data.total == 0){
   //                $('.doctorDiscuss .showAllData').show();
   //             }else {
   //                $('.doctorDiscuss .showAllData').hide();
   //                pagesAllFu = res.data.pages;
   //                off_on_fu = true;
   //
   //                var data =res.data.result;
   //                var result = '';
   //                for(var i = 0; i < data.length; i++){
   //                   var img = '';
   //                   var snapYesOn;
   //                   var perImage ='';
   //                   var emoji;
   //                   emoji =  replace_em(data[i].content);
   //                   if(data[i].support){
   //                      img = '<img src="../images/H_collect_y.png"/>';
   //                      snapYesOn = 'snapClass';
   //                   }else {
   //                      img = '<img src="../images/H_collect_n.png"/>';
   //                      snapYesOn = 'onSnapClass';
   //                   };
   //                   if(data[i].doctorHeadimg =='' || data[i].doctorHeadimg == null){
   //                      perImage = "../images/JpatientDP.png";
   //                   }else {
   //                      perImage = data[i].doctorHeadimg;
   //                   };
   //                   result += '<li commentId="'+data[i].commentId+'">\n' +
   //                      '                        <div class="perImg" style="background-image:url(' + perImage + ')">\n'+
   //                      '\n' +
   //                      '                        </div>\n' +
   //                      '                        <div class="perSpeech">\n' +
   //                      '                            <div class="perName">\n' +
   //                      '                                <div class="doctorName">' +
   //                      '' +data[i].doctorName+
   //                      '</div>\n' +
   //                      '                                <div class="doctorSnap">\n' +
   //                      '                                    <span class="' +
   //                      '' + snapYesOn +
   //                      '">' +
   //                      '' +data[i].supportCount +
   //                      '</span>\n' + img  +
   //                      '\n' +
   //                      '                                </div>\n' +
   //                      '                            </div>\n' +
   //                      '                            <div class="speechCon">\n' +
   //                      '                               ' + emoji +
   //                      '\n' +
   //                      '                            </div>\n' +
   //                      '                            <div class="speechTime">\n' +
   //                      '                                <span class="talkTime">' +
   //                      '' +data[i].dispalyTimeStr+
   //                      '</span>\n' +
   //                      '                                <span class="wenzi">回复</span>\n' +
   //                      '                            </div>\n' +
   //                      '                        </div>\n' +
   //                      '                    </li>'
   //                }
   //                $(result).appendTo('.doctorDiscuss .doctorDiscussList');
   //             }
   //          }else {
   //             showalert(0,''+res.msg+'',2);
   //          }
   //       },
   //       error:function(res){
   //          showalert(0,'请求失败',2);
   //       }
   //    });
   // };


   //--------------------------------------------------------------------------------------------------------获取主评论接口
   // function LoadDataListZhu(mainCommentId){
   //    var YData={
   //       'pathL':"/doctor/commentsMain/infoById",
   //       'accessToken':token,
   //       'mainCommentId':mainCommentId
   //    };
   //    Ajax({
   //       url:servUrl,
   //       data:YData,
   //       async: false,
   //       beforeSend: function(){
   //       },
   //       type : 'get',
   //       dataType : "json",
   //       success:function(res){
   //          if(res.state==0){
   //             var zhuMsg = res.data;
   //             if(zhuMsg.doctorHeadimg =='' || zhuMsg.doctorHeadimg == null){
   //                $('.docotrTalk .perImg').css('background-image',"url(../images/JpatientDP.png)");
   //             }else {
   //                // $('.docotrTalk .perImg img').attr('src',zhuMsg.doctorHeadimg);
   //                $('.docotrTalk .perImg').css('background-image',"url(" + zhuMsg.doctorHeadimg + ")");
   //
   //             };
   //             $('.docotrTalk .perName .doctorName').html(zhuMsg.doctorName);
   //             $('.docotrTalk .speechCon').html(replace_em(zhuMsg.content));
   //             $('.docotrTalk .speechTime .talkTime').html(zhuMsg.dispalyTimeStr);
   //             $('.docotrTalk .doctorSnap span').text(zhuMsg.supportCount);
   //
   //             var snapYesOn = res.data.support;
   //             if(snapYesOn){
   //                $('.docotrTalk .doctorSnap span').addClass('snapClass');
   //                $('.docotrTalk .doctorSnap img').attr('src','../images/H_collect_y.png')
   //             }else {
   //                $('.docotrTalk .doctorSnap span').removeClass('snapClass');
   //                $('.docotrTalk .doctorSnap img').attr('src','../images/H_collect_n.png')
   //             }
   //          }else {
   //             showalert(0,''+res.msg+'',2);
   //          }
   //       },
   //       error:function(res){
   //          showalert(0,'请求失败',2);
   //       }
   //    });
   // };




});