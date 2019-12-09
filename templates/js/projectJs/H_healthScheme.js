$(function(){
   var memberId=getRequestParam('memberId');
   var planId = getRequestParam('planId');
   var signInfoId=getRequestParam('signInfoId');
   var state = getRequestParam('state');//'0'代表是从（健康方案）(患者详情)跳过来的、‘1’代表是从（家医签约）（患者详情）列表跳过来的

   if(state == 0){
      $('.H_editor').show();
      $('.H_reset').hide();
      $('.JnoData').hide();
   }else if(state == 1){
      //从（家医签约）（患者详情）列表跳过来的时候该页面只做展示，不做任何确定按钮和编辑按钮点击事件
      if(planId == 0){
         $('.title').hide();
         $('.splitLine').hide();
         $('.textPlan').hide();
         $('.editor').hide();
         $('.JNOdata').show();
      }else {
         $('.H_editor').hide();
         $('.H_reset').hide();
         $('#sureBtn').hide();
         $('#sureBtno').hide();
         $('.splitTexto').hide();
         $('.special_title_h').hide();
         $('.special_text').hide();
         $('.JnoData').hide();
      }
   };

   loadAction();
   function loadAction(){
      showLoading();
      var YData={
         'pathL':"/health/healthPlanMember/memberPlanDetail",
         'accessToken':token,
         'id':planId
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
               var data = res.data;
               var doctorId = data.doctorId;
               //.replace(/-/g, ".").substring(0,16)

               //平台推送
               if(doctorId == 0){
                  $('.title_l img').attr('src','../images/h_history.png');
                  $('.H_createTime').text(data.createTime);
                  //文案展示
                  var dataText =JSON.parse(res.data.planeRecommend);
                  // console.log(dataText);
                  //运动
                  var sportText = dataText.exercise;
                  // console.log(sportText);
                  var sportTextBr = sportText.replace(/\n/g,'</br>');
                  if(sportText == ''){
                     // $('.sport_title').hide();
                     $('.sport_title').show();
                  }else {
                     $('.sportText').html(sportTextBr);
                     $('.sport_title').show();
                  }
                  //膳食
                  var dietText = dataText.diet;
                  // console.log(dietText);
                  var dietTextBr = dietText.replace(/\n/g,'</br>');
                  if(dietText == ''){
                     // $('.diet_title').hide();
                     $('.diet_title').show();
                  }else {
                     $('.dietText').html(dietTextBr);
                     $('.diet_title').show();
                  }
                  //行为
                  var actionText = dataText.behavior;
                  // console.log(actionText);
                  var actionTextBr = actionText.replace(/\n/g,'</br>');
                  if(actionText == ''){
                     // $('.action_title').hide();
                     $('.action_title').show();
                  }else {
                     $('.actionText').html(actionTextBr);
                     $('.action_title').show();
                  }
                  //心理
                  var heartText = dataText.psychology;
                  // console.log(heartText);
                  var heartTextBr = heartText.replace(/\n/g,'</br>');
                  if(heartText ==''){
                     // $('.heart_title').hide();
                     $('.heart_title').show();
                  }else {
                     $('.heartText').html(heartTextBr);
                     $('.heart_title').show();
                  }
                  //其他
                  var precautionsText = dataText.precautions;
                  // console.log(precautionsText);
                  var precautionsTextBr = precautionsText.replace(/\n/g,'</br>');
                  if(precautionsText ==''){
                     // $('.precautions_title').hide();
                     $('.precautions_title').show();
                  }else {
                     $('.precautionsText').html(precautionsTextBr);
                     $('.precautions_title').show();
                  }

                  //叮嘱
                  var specialText = res.data.doctorAdvice;
                  // console.log(specialText);
                  var specialTextBr = specialText.replace(/\n/g,'</br>');
                  if(specialText == ''){
                     // $('.special_title').hide();
                     $('.special_title').show()
                  }else {
                     $('.specialText').html(specialTextBr);
                     $('.special_title').show();
                  }
                  //平台推送 确定按钮
                  $('#sureBtno .sure').on('tap',function () {
                     if($('#specialTxte').val() == ''){
                        showalert(2,'特别叮嘱不能为空',2);
                        return;
                     }else {
                        var YData={
                           'pathL':"/health/healthPlanMember/editPlanRecommend",
                           'accessToken':token,
                           'signInfoId':signInfoId,
                           'memberId':memberId,
                           'id':planId,
                           'advice':$('#specialTxte').val()
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
                                 $('.H_editor').show();
                                 $('.H_reset').hide();
                                 $('.textPlan').show();
                                 $(".editor").hide();
                                 loadAction();
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
               }else if( doctorId !== 0){ //医生编辑或者确定过
                  $('#sureBtnTwo').show();
                  $('.textPlan .splitTexto').hide();
                  $('.textPlan .special_title').hide();
                  $('.textPlan .special_title_h').hide();
                  $('.textPlan .special_text').hide();
                  $('#sureBtno').hide();
                  $('.H_createTime').text(data.affirmTime);
                  $('.title_l img').attr('src','../images/h_person.png');
                  //文案展示
                  var dataText =JSON.parse(res.data.planeRecommend);
                  // console.log(dataText);
                  //运动
                  var sportText = dataText.exercise;
                  // console.log(sportText);
                  var sportTextBr = sportText.replace(/\n/g,'</br>');
                  if(sportText == ''){
                     // $('.sport_title').hide();
                     $('.sport_title').show();
                  }else {
                     $('.sportText').html(sportTextBr);
                     $('.sport_title').show();
                  }
                  //膳食
                  var dietText = dataText.diet;
                  // console.log(dietText);
                  var dietTextBr = dietText.replace(/\n/g,'</br>');
                  if(dietText == ''){
                     // $('.diet_title').hide();
                     $('.diet_title').show();
                  }else {
                     $('.dietText').html(dietTextBr);
                     $('.diet_title').show();
                  }
                  //行为
                  var actionText = dataText.behavior;
                  // console.log(actionText);
                  var actionTextBr = actionText.replace(/\n/g,'</br>');
                  if(actionText == ''){
                     // $('.action_title').hide();
                     $('.action_title').show();
                  }else {
                     $('.actionText').html(actionTextBr);
                     $('.action_title').show();
                  }
                  //心理
                  var heartText = dataText.psychology;
                  // console.log(heartText);
                  var heartTextBr = heartText.replace(/\n/g,'</br>');
                  if(heartText ==''){
                     // $('.heart_title').hide();
                     $('.heart_title').show();
                  }else {
                     $('.heartText').html(heartTextBr);
                     $('.heart_title').show();
                  }
                  //其他
                  var precautionsText = dataText.precautions;
                  // console.log(precautionsText);
                  var precautionsTextBr = precautionsText.replace(/\n/g,'</br>');
                  if(precautionsText ==''){
                     // $('.precautions_title').hide();
                     $('.precautions_title').show();
                  }else {
                     $('.precautionsText').html(precautionsTextBr);
                     $('.precautions_title').show();
                  }

                  //叮嘱
                  var specialText = res.data.doctorAdvice;
                  // console.log(specialText);
                  var specialTextBr = specialText.replace(/\n/g,'</br>');
                  if(specialText == ''){
                     // $('.textPlan .special_title').hide();
                     $('.textPlan .special_title').show()
                  }else {
                     $('.specialText').html(specialTextBr);
                     $('.special_title').show();
                  };


                  //(医生编辑或者确定)的确定按钮
                  $('#sureBtnTwo .sure').on('tap',function () {
                     H_saveLoading();
                     var YData={
                        'pathL':"/health/healthPlanMember/editPlanRecommend",
                        'accessToken':token,
                        'signInfoId':signInfoId,
                        'memberId':memberId,
                        'id':planId,
                        'movement':dataText.exercise,
                        'dietary':dataText.diet,
                        'behavior':dataText.behavior,
                        'psychological':dataText.psychology,
                        'precautions':dataText.precautions,
                        'advice':res.data.doctorAdvice
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
                           H_hidesaveLoading();
                           if(res.state==0){
                              $('.H_editor').show();
                              $('.H_reset').hide();
                              $('.textPlan').show();
                              $(".editor").hide();
                              loadAction();
                           }else{
                              showalert(0,''+res.msg+'',2);
                           }
                        },
                        error:function(res){
                           H_hidesaveLoading();
                           showalert(0,'请求失败',2);
                        }
                     });
                  });

               };

               //编辑 按钮
               $('.H_editor').on('tap',function () {
                     $('.H_reset').show();
                     $('.H_editor').hide();
                     $('.textPlan').hide();
                     $(".editor").show();
                     //运动
                     $(".editor .sport_title").show();
                     $('#sportTxt').val(sportText);
                     //膳食
                     $(".editor .diet_title").show();
                     $('#diettTxt').val(dietText);
                     //行为
                     $(".editor .action_title").show();
                     $("#actionTxt").val(actionText);
                     //心理
                     $(".editor .heart_title").show();
                     $('#heartTxt').val(heartText);
                     //其他
                     $('.editor .precautions_title').show();
                     $('#precautionsTxt').val(precautionsText);
                     //叮嘱
                     $(".editor .special_title").show();
                     $('#specialTxt').val(specialText);
               });

               //重置 按钮
               $('.H_reset').on('tap',function () {
                  $('#sportTxt').val(sportText);
                  $('#diettTxt').val(dietText);
                  $("#actionTxt").val(actionText);
                  $('#heartTxt').val(heartText);
                  $('#precautionsTxt').val(precautionsText);
                  $('#specialTxt').val(specialText);
               });

            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            hideLoading();
            showalert(0,'请求失败',2);
         }
      });
   };

   //编辑里  确定按钮
   $('#sureBtn .sure').on('tap',function () {
      if($('#sportTxt').val() == ''){
         showalert(2,'运动建议不能为空',2);
         return;
      }else if($('#diettTxt').val() == ''){
         showalert(2,'膳食建议不能为空',2);
         return;
      }else if($("#actionTxt").val() == ''){
         showalert(2,'行为建议不能为空',2);
         return;
      }else if($('#heartTxt').val() == ''){
         showalert(2,'心理建议不能为空',2);
         return;
      }else if($('#precautionsTxt').val() == ''){
         showalert(2,'其他不能为空',2);
         return;
      }else if($('#specialTxt').val() == ''){
         showalert(2,'特别叮嘱不能为空',2);
         return;
      }else{
         H_saveLoading();
         var YData={
            'pathL':"/health/healthPlanMember/editPlanRecommend",
            'accessToken':token,
            'signInfoId':signInfoId,
            'memberId':memberId,
            'id':planId,
            'movement':$('#sportTxt').val(),
            'dietary':$('#diettTxt').val(),
            'behavior':$("#actionTxt").val(),
            'psychological':$('#heartTxt').val(),
            'precautions':$('#precautionsTxt').val(),
            'advice':$('#specialTxt').val()
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
               H_hidesaveLoading();
               if(res.state==0){
                  $('.H_editor').show();
                  $('.H_reset').hide();
                  $('.textPlan').show();
                  $(".editor").hide();
                  loadAction();
               }else{
                  showalert(0,''+res.msg+'',2);
               }
            },
            error:function(res){
               H_hidesaveLoading();
               showalert(0,'请求失败',2);
            }
         });
      }
   });


   //点击跳转到---方案历史页面
   // $('.title').on('tap',function(){
   //    window.location.href='H_proHistory.html?memberId='+memberId;
   // });
});