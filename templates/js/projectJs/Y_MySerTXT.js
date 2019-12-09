var Y_MySerTXT=sessionStorage.getItem('MySer1');
var Y_MySerTXTData=JSON.parse(Y_MySerTXT);
var Y_fixPrice1=sessionStorage.getItem('Y_fixPrice1');
$(function(){
    //判断是否开通
    if(Y_MySerTXTData.status==1){
      $('.Y_button>span').attr('class','switch-on')
    }
    //判断服务费用有没有设置
    if(!Y_fixPrice1 || Y_fixPrice1==''){
        if(Y_MySerTXTData.discountPrice>0 && Y_MySerTXTData.discountPrice!=''){
            $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_MySerTXTData.discountPrice+'元/次')
        }else{
            $('.Y_MySerTXT ul li').eq(1).find('b').text('未设置')
        }
    }else{
        $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_fixPrice1+'元/次')
    }
    //点击开通服务的按钮
    switchEvent("#fly",function(){
        //开通状态为1
        Y_SerType1(1);
        if(window.webkit){
            window.webkit.messageHandlers.clickOpenService.postMessage("");
        }else if(window.jsObj){
            window.jsObj.clickOpenService();
        }
    },function(){
        //关闭状态为2
        Y_SerType1(0)
    });
    $('.Y_MySerTXT ul li').eq(1).on('tap',function(){
        window.location.href="../html/Y_MySerPrice.html?Y_type=1"
    })
})
//调取更新服务的接口
 function Y_SerType1(status){
     var YData={
         'pathL':"/doctor/doctorService/updateDoctorService",
         'status':status,
         "type":1,
         'content':Y_MySerTXTData.content,
         'id':Y_MySerTXTData.id,
         /*'price':Y_MySerTXTData.fixPrice,*/
         'accessToken':token
     }
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
                 if(status==1){
                     showalert1(0,res.msg,2);
                     $('.Y_button>span').attr('class','switch-off');
                 }
             }
         },
         error:function(res){
             showalert(0,'请求失败',2);
         }
     });
 }






















