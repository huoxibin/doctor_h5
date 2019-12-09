$(function(){
   GHUTILS.openInstall();  //openinstall 唤醒app
   var courseId = getRequestParam('courseId');//该课程ID
   var doctorId = getRequestParam('doctorId');//医生ID
   var businessType = getRequestParam('businessType'); // 1资讯详情、2病例详情、3课程学习、6课程直播、7医生推荐


   var doctorIdGlo;
   // var courseId = 10;
   // var doctorId = 100001;
   // var businessType =6;

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

   $(document).ready(function() {
      $('#course_box .yesTalk .history').html('');
      $('#course_box_two .yesTalk .history').html('');
      LoadingDataFn();
      if(businessType == 3){
         $('.course_intr').show();
         classLearn();
         $('.course_ul').show();
         document.getElementsByTagName("title")[0].innerText = '课程学习分享';
      }else if(businessType == 6){
         $('.course_intr_two').show();
         classZhibo();
         $('.course_ul_two').show();
         $('#relationCourse').html('');
         document.getElementsByTagName("title")[0].innerText = '课程直播分享';
      }
   });

   //课程学习接口
   function classLearn() {
      var YData = {
         'pathL':"/doctor/course/getCourseDetail",
         'courseId': courseId,
         'doctorId': doctorId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){},
         type : 'get',
         dataType : "json",
         success:function(res){
            var date = res.data;
            if(res.state==0){
               if(date.videoFrameUrl == ''){
                  // $('.videoImg img').attr({src:'../images/noVido.png'});
               }else {
                  $('.videoImg img').attr({src:date.videoFrameUrl});
               };
               $('.courseTitle').html(date.courseName);
               $('.icon-time').html(date.createTime.substr(0, 10));
               $('.icon-view i').html(date.readCount);
               $('.icon-collect i').html(date.favoriteCount);
               if(date.doctorInfo.doctorUrl == '' || date.doctorInfo.doctorUrl == null || date.doctorInfo.doctorUrl.indexOf('blob:http://localhost') != -1){
                  $('.doctorUrl img').attr({src:'../images/JpatientDP.png'});
               }else {
                  $('.doctorUrl img').attr({src:date.doctorInfo.doctorUrl});
               };
               $('.doctorName').html(date.doctorInfo.doctorName);
               $('.titleName').html(date.doctorInfo.titleName);
               $('.hospitalName').html(date.doctorInfo.hospitalName);
               $('.departmentName').html(date.doctorInfo.departmentName);
               $('.course_introduce').html(interlac(date.introduction));
               $('.doctor_introduce').html(interlac(date.doctorInfo.introduction));

               var allowDiscussion = date.isAllowComment;
               if(allowDiscussion == 0){
                  $('#course_box .yesTalk').hide();
                  $('#course_box .noTalk').show();
               };
            }else{
               showError(res.msg);
            }
         },
         error:function(res){
         }
      });
   };
   //课程直播接口
   function classZhibo() {
      var YData = {
         'pathL':"/doctor/livecourseInfo/detailsApp",
         'id': courseId,
         'doctorId': doctorId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){},
         type : 'post',
         dataType : "json",
         success:function(res){
            if(res.state==0){
               var date = res.data;
               doctorIdGlo = date.doctorId;
               if(date.videoUrl == ''){
                  // $('.videoImg img').attr({src:'../images/noVido.png'});
               }else {
                  $('.videoImg img').attr({src:date.videoUrl});
               };
               $('.courseTitle').html(date.name);
               $('.icon-time').html(date.liveTime);
               $('.icon-view i').html(date.readCount);
               $('.icon-collect .course_icon').remove();
               $('#watchPerson').html(date.readCount);

               $('.doctor_introduce').html(interlac(date.doctorIntroduction));

               if(date.headimg == '' || date.headimg == null || date.headimg.indexOf('blob:http://localhost') != -1){
                  $('.doctorUrl img').attr({src:'../images/JpatientDP.png'});
               }else {
                  $('.doctorUrl img').attr({src:date.headimg});
               }
               $('.doctorName').html(date.doctorName);
               $('.oneCont').html(interlac(date.introduction));
               $('.twoCont').html(interlac(date.outline));


               $('.titleName').html(date.titleName);
               $('.hospitalName').html(date.hospitalName);
               $('.departmentName').html(date.deptName);

               var allowDiscussion = date.isAllowComment;
               if(allowDiscussion == 0){
                  $('#course_box_two .yesTalk').hide();
                  $('#course_box_two .noTalk').show();
               };

               relationClass();
            }else{
               showError(res.msg);
            }
         },
         error:function(res){
         }
      });
   };
   //直播课程--相关课程接口
   function relationClass(){
      var YData = {
         'pathL':"/doctor/livecourseInfo/related",
         'id': courseId,
         'doctorId': doctorIdGlo,
         'tagStr':''
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){},
         type : 'post',
         dataType : "json",
         success:function(res){
            if(res.state==0){
               var data = res.data;
               var innerClass = '';
               if(data.length == 0){
                  $('.noTalkTwo').show();
               }else {
                  for(var i=0;i<data.length;i++){
                     var classImage ='';
                     if(data[i].imageUrl ==''){
                        classImage = "../images/JpatientDP.png";
                     }else {
                        classImage = data[i].imageUrl;
                     };
                     var statusImg;
                     if(data[i].type == 2){
                        statusImg = '<p class="statusOne">\n' +
                           '                                <img src="../images/imgreview.png"/>\n' +
                           '                            </p>';
                     }else if(data[i].type == 1){
                        if(data[i].status == 7){//直播中
                           statusImg = '<p class="statusTwo">\n' +
                              '                                <img src="../images/living.gif"/>\n' +
                              '                            </p>';
                        }else if(data[i].status == 1){//待播
                           statusImg = '<p class="statusThree">\n' +
                              '                                <img src="../images/waitplay.png"/>\n' +
                              '                            </p>';
                        };
                     };
                     innerClass += '<li>\n' +
                        '                    <div class="content">\n' +
                        '                        <div class="title">\n' +
                        '' + data[i].name +
                        '                        </div>\n' +
                        '                        <div class="watch">\n' +
                        ''+ statusImg +
                        '                            <p class="person">\n' +
                        '                                <img src="../images/profile_view.png"/>\n' +
                        '                                <span>' +
                        '' + data[i].readCount +
                        '</span>人观看\n' +
                        '                            </p>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                    <div class="img" style="background-image:url(' + classImage + ')">\n' +
                        '\n' +
                        '                    </div>\n' +
                        '                </li>';
                  };
                  $(innerClass).appendTo('#relationCourse');
               }
            }else{
               showError(res.msg);
            }
         },
         error:function(res){
         }
      });
   };

   //课程学习
   $('.course_intr .course_nav div').on('tap', function () {
      var _index = $(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      $('#course_box .course_box').eq(_index).removeClass('hide').siblings().addClass('hide');
   });
   //课程直播
   $('.course_intr_two .course_nav div').on('tap', function () {
      var _index = $(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      $('#course_box_two .course_box').eq(_index).removeClass('hide').siblings().addClass('hide');
   });

   // //唤起app
   // $('.openApp, .getMoreBtn, .videoImg_btn').on('tap',function () {
   //    GHUTILS.openApp();
   // });

   //-------------主评论列表的一些全局参数
   var pageSizeGlobal = 2;//全局一页加载10条数据
   var pageNumIndex = 1, timers = null, off_on = false, pagesAll =0;

   function LoadingDataFn(){
      $('.yesTalk .showAllData').hide();
      var YData={
         'pathL':"/doctor/commentsMain/list",
         'accessToken':token,
         'pageNum':pageNumIndex,
         'pageSize':pageSizeGlobal,
         'businessId':courseId,
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
                  if(businessType == 3){
                     $(inner).appendTo('#course_box .yesTalk .history');
                  }else if(businessType == 6){
                     $(inner).appendTo('#course_box_two .yesTalk .history');
                  };
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
                        if(businessType == 3){
                           $(innerSecond).appendTo($('#course_box .yesTalk').find('.history li').eq(index).find('.speechTwo .getList'));
                        }else if(businessType == 6){
                           $(innerSecond).appendTo($('#course_box_two .yesTalk').find('.history li').eq(index).find('.speechTwo .getList'));
                        };
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
   function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="../images/$1.gif" border="0" />');
      return str;
   };

   //(\n)换行成（br）
   function interlac(msg) {
      if(msg == '' || msg == null){
         return ''
      }else {
         return msg.replace(/\n/g,'</br>');
      }
   };
});