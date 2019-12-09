$(function(){
   var memberId=getRequestParam('memberId');
   var memberName = decodeURIComponent(getRequestParam('memberName'));
   var doctorName =decodeURIComponent(getRequestParam('doctorName'));
   var signInfoId=getRequestParam('signInfoId');

   $('#remindBtn').on('tap',function () {
      if($('#noSpecialTxt').val() == ''){
         showalert(2,'特别叮嘱不能为空',2);
         return;
      }else {
         var YData={
            'pathL':"/health/healthPlanMember/doctorSupervise",
            'accessToken':token,
            'memberName':memberName,
            'memberId':memberId,
            'supervise':$('#noSpecialTxt').val(),
            'doctorName':doctorName,
            'signInfoId':signInfoId
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
                  $('#noSpecialTxt').val('');
                  jumpMobil();
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
});