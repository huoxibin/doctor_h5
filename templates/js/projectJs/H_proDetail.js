$(function(){
   var historyId=getRequestParam('historyId');

   showLoading();
   loadAction();
   function loadAction(){
      var YData={
         'pathL':"/health/healthPlanMemberHistory/historyDetail",
         'accessToken':token,
         'historyId':historyId
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
               var data = JSON.parse(res.data.planeRecommend);
               console.log(data);
               //运动
               var sportText = data.exercise.replace(/\n/g,'</br>');
               console.log(sportText);
               if(sportText == ''){
                  // $('.sport_title').hide();
                  $('.sport_title').show();
               }else {
                  $('.sportText').html(sportText);
                  $('.sport_title').show();
               }
               //膳食
               var dietText = data.diet.replace(/\n/g,'</br>');
               console.log(dietText);
               if(dietText == ''){
                  // $('.diet_title').hide();
                  $('.diet_title').show();
               }else {
                  $('.dietText').html(dietText);
                  $('.diet_title').show();
               }
               //行为
               var actionText = data.behavior.replace(/\n/g,'</br>');
               console.log(actionText);
               if(actionText == ''){
                  // $('.action_title').hide();
                  $('.action_title').show();
               }else {
                  $('.actionText').html(actionText);
                  $('.action_title').show();
               }
               //心理
               var heartText = data.psychology.replace(/\n/g,'</br>');
               console.log(heartText);
               if(heartText ==''){
                  // $('.heart_title').hide();
                  $('.heart_title').show();
               }else {
                  $('.heartText').html(heartText);
                  $('.heart_title').show();
               }
               //其他
               var precautionsText = data.precautions.replace(/\n/g,'</br>');
               console.log(precautionsText);
               if(precautionsText ==''){
                  // $('.precautions_title').hide();
                  $('.precautions_title').show();
               }else {
                  $('.precautionsText').html(precautionsText);
                  $('.precautions_title').show();
               }
               //叮嘱
               var specialText = res.data.doctorAdvice.replace(/\n/g,'</br>');
               console.log(specialText);
               if(specialText == ''){
                  // $('.special_title').hide();
                  $('.special_title').show();
               }else {
                  $('.specialText').html(specialText);
                  $('.special_title').show();
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
});