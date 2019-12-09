var Y_MySerVi=sessionStorage.getItem('MySer3');
var Y_MySerViData=JSON.parse(Y_MySerVi);
var Y_fixPrice3=sessionStorage.getItem('Y_fixPrice3');
var Y_isSet1=sessionStorage.getItem('Y_isSet1');
$(function(){
    if(Y_MySerViData.status==1){
      $('.Y_button>span').attr('class','switch-on')
    }
    if(!Y_fixPrice3 || Y_fixPrice3==''){
        if(Y_MySerViData.discountPrice>0 && Y_MySerViData.discountPrice!=''){
            $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_MySerViData.discountPrice+'元/次')
        }else{
            $('.Y_MySerTXT ul li').eq(1).find('b').text('未设置')
        }
    }else{
        $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_fixPrice3+'元/次')
    }
    if(!Y_isSet1){
        if(Y_MySerViData.isSet==1){
            $('.Y_MySerTXT ul li').eq(2).find('b').text('已设置')
        }else{
            $('.Y_MySerTXT ul li').eq(2).find('b').text('未设置')
        }
    }else{
        if(Y_isSet1==1){
            $('.Y_MySerTXT ul li').eq(2).find('b').text('已设置')
        }else{
            $('.Y_MySerTXT ul li').eq(2).find('b').text('未设置')
        }
    }
    switchEvent("#fly",function(){
        Y_SerType1(1)
        if(window.webkit){
            window.webkit.messageHandlers.clickOpenService.postMessage("");
        }else if(window.jsObj){
            window.jsObj.clickOpenService();
        }
    },function(){
        Y_SerType1(0)
    });
    $('.Y_MySerTXT ul li').eq(1).on('tap',function(){
        window.location.href="../html/Y_MySerPrice.html?Y_type=3"
    })
    $('.Y_MySerTXT ul li').eq(2).on('tap',function(){
        window.location.href="../html/Y_MySerTaTime.html?Y_serviceId="+Y_MySerViData.id3+'&type=Vi';
    })
})
 function Y_SerType1(status){
     var YData={
         'pathL':"/doctor/doctorService/updateDoctorService",
         'status':status,
         "type":3,
         /* 'content':Y_MySerViData.content,*/
         'id':Y_MySerViData.id,
         /*'price':Y_MySerViData.fixPrice,*/
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
                     $('.Y_button>span').attr('class','switch-off')
                 }
             }
         },
         error:function(res){
             showalert(0,'请求失败',2);
         }
     });
 }






















