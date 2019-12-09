$(function(){
   var isId= getRequestParam('id');
   var memo= decodeURI(getRequestParam('memo'));
   var turnoverType = getRequestParam('turnoverType');
   loadAction();
   function loadAction(){
      var YData={
         'pathL':"/doctor/doctorAccountturnover/fromOrtoTurnoverDetail",
         'id':isId,
         'turnoverMemo':memo,
         'turnoverType':turnoverType,
         'accessToken':token
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
               var data=res.data;
               var topHtml= new EJS({url:"../compileEjs/H_buyClassDetail.ejs"}).render({data:data,memo:memo});
               $('.J_incomeDetailBox').html(topHtml);
               $('.category').html(memo);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   }
})























