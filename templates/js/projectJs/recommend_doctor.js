$(function(){
   GHUTILS.openInstall()  //openinstall 唤醒app
   var recommendDoctorID = getRequestParam('id');//推荐医生活动页ID
   var businessType = 7; // 1资讯详情、2病例详情、3课程学习、6课程直播、7医生推荐
   var allowDiscussion;//0不许评论、1允许


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
      recommenDoctor();
      LoadingDataFn();
   });

    //推荐医生活动页详情
    function recommenDoctor() {
        var YData = {
            'pathL':"/doctor/activityRecommendDoctor/recommendDetail",
            // 'accessToken': token,
            // 'id': 32
            'id': recommendDoctorID
        };
        Ajax({
            url:servUrl,
            data:YData,
            async: false,
            beforeSend: function(){},
            type : 'get',
            dataType : "json",
            success:function(res){
               console.log(res)
                var data = res.data,
                    course_html = '',
                    article_html = '',
                    case_html = '',
                    broadcast_live = '<img src="../images/broadcast_live.gif" alt="" class="broadcast_live">',
                    broadcast_wait = '<img src="../images/broadcast_wait.png" alt="" class="broadcast_wait">',
                    broadcast_playback = '<img src="../images/broadcast_playback.png" alt="" class="broadcast_playback">';
                if(res.state == 0){
                   allowDiscussion = data.recommend.allowComment;
                   if(allowDiscussion == 0){
                      $('.form_type_course .yesTalk').hide();
                      $('.form_type_course .noTalk').show();
                   }

                    $('.videoImg img').attr('src', data.recommend.doctorImage);
                    $('.doctor_Info h1 i').html(data.doctorInfo.doctorName);
                    $('.doctor_Info h1 span').html(data.doctorInfo.theTitleName);
                    $('.doctor_Info p i').html(data.doctorInfo.hospitalName);
                    $('.doctor_Info p span').html(data.doctorInfo.departmentName);
                    if(data.doctorInfo.introduction){
                        $('.doctor_Info_txt').html(data.doctorInfo.introduction);
                    }else{
                        $('.doctor_Info_txt').addClass('hide');
                    }

                    //课程列表
                    if(data.courseInfoList){
                       for (var i = 0; i < data.courseInfoList.length; i++) {

                          if(data.courseInfoList[i].type === 2){
                             course_html += '<li>' +
                                 '<div class="clearfix">' +
                                     broadcast_playback +
                                     '<img src="' + data.courseInfoList[i].imageUrl + '" alt="">' +
                                 '</div>' +
                                 '<p>' + data.courseInfoList[i].courseName + '</p>' +
                            '</li>'
                          }else if(data.courseInfoList[i].type === 3){
                              course_html += '<li>' +
                                '<div class="clearfix">' +
                                    // broadcast_wait +
                                    '<img src="' + data.courseInfoList[i].imageUrl + '" alt="">' +
                                '</div>' +
                                '<p>' + data.courseInfoList[i].courseName + '</p>' +
                             '</li>'
                          }else{
                             if(data.courseInfoList[i].status === 7){
                                 course_html += '<li>' +
                                         '<div class="clearfix">' +
                                         broadcast_live +
                                         '<img src="' + data.courseInfoList[i].imageUrl + '" alt="">' +
                                         '</div>' +
                                         '<p>' + data.courseInfoList[i].courseName + '</p>' +
                                         '</li>'
                             }else{
                                 course_html += '<li>' +
                                         '<div class="clearfix">' +
                                         broadcast_wait +
                                         '<img src="' + data.courseInfoList[i].imageUrl + '" alt="">' +
                                         '</div>' +
                                         '<p>' + data.courseInfoList[i].courseName + '</p>' +
                                         '</li>'
                             }
                          }
                       }
                       $('.course_list_li').append(course_html);
                    }else{
                       $('.course_list').addClass('hide');
                    }

                    //文章列表
                    if(data.newsArticleInfoList){
                       for (let j = 0; j < data.newsArticleInfoList.length; j++) {
                           article_html += '<li>' +
                                 '<div class="clearfix">' +
                                    '<img src="' + data.newsArticleInfoList[j].image + '" alt="">'+
                                 '</div>' +
                                 '<p>'+ data.newsArticleInfoList[j].title + '</p>' +
                              '</li>'
                       }
                       $('.article_list_li').append(article_html);
                    }else{
                        $('.article_list').addClass('hide');
                    }
                    //病例列表
                    if(data.typicalInfoList){
                       for (let m = 0; m < data.typicalInfoList.length; m++) {
                          if(data.typicalInfoList[m].guideImages === '' || data.typicalInfoList[m].guideImages === undefined || data.typicalInfoList[m].guideImages === null){
                              case_html += '<li>' +
                                      '<div class="clearfix">' +
                                      '<img src="../images/broadcast_default.png" alt="" class="broadcast_default"" alt="">'+
                                      '</div>' +
                                      '<p>'+ data.typicalInfoList[m].diseasesTitle + '</p>' +
                                      '</li>'
                          }else{
                              case_html += '<li>' +
                                      '<div class="clearfix">' +
                                      '<img src="' + data.typicalInfoList[m].guideImages + '" alt="">'+
                                      '</div>' +
                                      '<p>'+ data.typicalInfoList[m].diseasesTitle + '</p>' +
                                      '</li>'
                          }
                       }
                       $('.case_list_li').append(case_html);
                    }else{
                        $('.case_list').addClass('hide');
                    }
                }else{
                    showalert(1, res.msg, 2);
                }
            },
            error:function(res){
                showalert(1, res, 2);
            }
        });
    };
    //点击课程、文章、病例唤醒app
    // $(document).on('tap', '.course_list_li li, .article_list_li li, .case_list_li li', function () {
    //     GHUTILS.openApp();
    // });


   //唤起app
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
         'businessId':recommendDoctorID,
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
                     if(data[i].doctorHeadimg ==''){
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
                  $(inner).appendTo('.form_type_course .yesTalk .history');
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
                        $(innerSecond).appendTo($('.form_type_course .yesTalk').find('.history li').eq(index).find('.speechTwo .getList'));
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


});