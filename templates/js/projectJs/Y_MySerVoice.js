var Y_MySerVo=sessionStorage.getItem('MySer2');
var Y_MySerVoData=JSON.parse(Y_MySerVo);
var Y_fixPrice2=sessionStorage.getItem('Y_fixPrice2');
var Y_isSet=sessionStorage.getItem('Y_isSet');
$(function(){
    //判断是否开通
    if(Y_MySerVoData.status==1){
      $('.Y_button>span').attr('class','switch-on')
    }
    //判断服务费用有没有设置
    if(!Y_fixPrice2 || Y_fixPrice2==''){
        if(Y_MySerVoData.fixPrice>0 && Y_MySerVoData.discountPrice!=''){
            $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_MySerVoData.discountPrice+'元/次')
        }else{
            $('.Y_MySerTXT ul li').eq(1).find('b').text('未设置')
        }
    }else{
        $('.Y_MySerTXT ul li').eq(1).find('b').text(Y_fixPrice2+'元/次')
    }
    if(!Y_isSet){
        if(Y_MySerVoData.isSet==1){
            $('.Y_MySerTXT ul li').eq(2).find('b').text('已设置')
        }else{
            $('.Y_MySerTXT ul li').eq(2).find('b').text('未设置')
        }
    }else{
        if(Y_isSet==1){
            $('.Y_MySerTXT ul li').eq(2).find('b').text('已设置')
        }else{
            $('.Y_MySerTXT ul li').eq(2).find('b').text('未设置')
        }
    }
    //点击开通服务的按钮
    switchEvent("#fly",function(){
        Y_SerType1(1);
        if(window.webkit){
            window.webkit.messageHandlers.clickOpenService.postMessage("");
        }else if(window.jsObj){
            window.jsObj.clickOpenService();
        }
    },function(){
        Y_SerType1(0)
    });
    $('.Y_MySerTXT ul li').eq(1).on('tap',function(){
        window.location.href="../html/Y_MySerPrice.html?Y_type=2"
    })
    $('.Y_MySerTXT ul li').eq(2).on('tap',function(){
        window.location.href="../html/Y_MySerTaTime.html?Y_serviceId="+Y_MySerVoData.id+'&type=Vo';
    })
})
//调取更新服务的接口
 function Y_SerType1(status){
     var YData={
         'pathL':"/doctor/doctorService/updateDoctorService",
         'status':status,
         "type":2,
        /*'content':Y_MySerVoData.content,*/
         'id':Y_MySerVoData.id,
         /*'price':Y_MySerVoData.fixPrice,*/
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






















