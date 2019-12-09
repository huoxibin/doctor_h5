var Y_MySer,Y_MySerPriceData;
var Y_type=getRequestParam('Y_type');
/*var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjM1MDA3MTYsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMDM5XCIsXCJpbVRva2VuXCI6XCI5NDJlYjVjNmU3MTdiZTczNTExYWQzMjkxZmNmMWE1OFwiLFwiaW5kZXhcIjo0LFwicm9sZVR5cGVcIjoyLFwic2Vzc2lvbklkXCI6XCI2OENDQkVENEM5NUM0MjgzMjI3NUUzQ0Q0QjZDRTBGNFwiLFwidXNlckFnZW50XCI6XCJaWURvY3Rvci8xLjAgKGlQaG9uZTsgaU9TIDExLjM7IFNjYWxlLzMuMDApXCIsXCJ1c2VySWRcIjoxMDAwMzl9IiwiZXhwIjoxNTU1MDM2NzE2fQ.JOUUkdTwqLeKZrQck2twDGU1wGfgON33Fna4XX31mEQ';*/
var Y_fixPrice1=sessionStorage.getItem('Y_fixPrice1');
var Y_fixPrice1s=sessionStorage.getItem('Y_fixPrice1s');
var Y_fixPrice2=sessionStorage.getItem('Y_fixPrice2');
var Y_fixPrice2s=sessionStorage.getItem('Y_fixPrice2s');
var Y_fixPrice3=sessionStorage.getItem('Y_fixPrice3');
var Y_fixPrice3s=sessionStorage.getItem('Y_fixPrice3s');
var Y_values;
$(function(){
    Y_FW();
    if(Y_type==1){
        Y_MySer=sessionStorage.getItem('MySer1');
        Y_MySerPriceData=JSON.parse(Y_MySer);
        $('.Y_TXTNo').hide();
        if(Y_fixPrice1!='' && Y_fixPrice1!=null){
            $('.Y_Price').val(Y_fixPrice1s);
            $('.Y_Price2').val(Y_fixPrice1);
        }else{
            if(Y_MySerPriceData.fixPrice>0 && Y_MySerPriceData.fixPrice!=''){
                $('.Y_Price').val(Y_MySerPriceData.fixPrice);
                $('.Y_Price2').val(Y_MySerPriceData.discountPrice);
            }
        }
    }else if(Y_type==2){
        /*设置语音咨询*/
        Y_MySer=sessionStorage.getItem('MySer2');
        Y_MySerPriceData=JSON.parse(Y_MySer);
        $('.Y_TXTNo').show();
        $('.input-item span').attr('data-unit','元/次');
        $('.Y_MediCalcDeB p').eq(1).text('1，单次服务时长为15分钟，单次服务定价建议区间50元-500元/次');
        if(Y_fixPrice2!='' && Y_fixPrice2!=null){
            $('.Y_Price').val(Y_fixPrice2s);
            $('.Y_Price2').val(Y_fixPrice2);
        }else{
            if(Y_MySerPriceData.fixPrice>0 && Y_MySerPriceData.fixPrice!=''){
                $('.Y_Price').val(Y_MySerPriceData.fixPrice);
                $('.Y_Price2').val(Y_MySerPriceData.discountPrice);
            }
        }
    }else{
        /*设置视频服务费用*/
        Y_MySer=sessionStorage.getItem('MySer3');
        Y_MySerPriceData=JSON.parse(Y_MySer);
        $('.Y_TXTNo').show();
        $('.input-item span').attr('data-unit','元/次');
        $('.Y_MediCalcDeB p').eq(1).text('1，单次服务时长为15分钟，单次服务定价建议区间100元-1000元/次');
        if(Y_fixPrice3!='' && Y_fixPrice3!=null){
            $('.Y_Price').val(Y_fixPrice3s);
            $('.Y_Price2').val(Y_fixPrice3);
        }else{
            if(Y_MySerPriceData.fixPrice>0 && Y_MySerPriceData.fixPrice!=''){
                $('.Y_Price').val(Y_MySerPriceData.fixPrice);
                $('.Y_Price2').val(Y_MySerPriceData.discountPrice);
            }
        }
    }
    $('.Y_Price').on('input',function(){
        var value=$(this).val();
        $('.Y_Price2').val(value*(100-Y_values)/100);
    })
    $('.Ynav b.Y_tump').on('tap',function(){
        if($('.Y_Price').val()!=''){
            Y_SerType1(Y_MySerPriceData.status)
        }else{
            showalert1(0,'服务费用不能为空',2);
        }

    })
    $('.Ynav a.Y_tump').on('tap',function(){
        /*pd();*/
        window.location.href="../html/Y_MySer.html"
    })
})
/*function pd(){
    if(Y_type==1){
        window.location.href="../html/Y_MySerTXT.html"
    }else if(Y_type==2){
        window.location.href="../html/Y_MySerVoice.html"
    }else{
        window.location.href="../html/Y_MySerVideo.html"
    }
}*/

//调取更新服务的接口
function Y_SerType1(status){
    var YData={
        'pathL':"/doctor/doctorService/updateDoctorService",
        'status':status,
        "type":Y_type,
        'content':Y_MySerPriceData.content,
        'id':Y_MySerPriceData.id,
        'price':$('.Y_MySerPrice .Y_Price').val(),
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
                sessionStorage.setItem('Y_fixPrice1','');
                sessionStorage.setItem('Y_fixPrice2','');
                sessionStorage.setItem('Y_fixPrice3','');
                sessionStorage.setItem('Y_fixPrice1s','');
                sessionStorage.setItem('Y_fixPrice2s','');
                sessionStorage.setItem('Y_fixPrice3s','');

                if(Y_type==1){
                    sessionStorage.setItem('Y_fixPrice1',$('.Y_MySerPrice .Y_Price2').val());
                    sessionStorage.setItem('Y_fixPrice1s',$('.Y_MySerPrice .Y_Price').val());
                }else if(Y_type==2){
                    sessionStorage.setItem('Y_fixPrice2',$('.Y_MySerPrice .Y_Price2').val());
                    sessionStorage.setItem('Y_fixPrice2s',$('.Y_MySerPrice .Y_Price').val());
                }else{
                    sessionStorage.setItem('Y_fixPrice3',$('.Y_MySerPrice .Y_Price2').val());
                    sessionStorage.setItem('Y_fixPrice3s',$('.Y_MySerPrice .Y_Price').val());
                }
                /*pd();*/
                window.location.href="../html/Y_MySer.html"
            }else{
                showalert1(0,res.msg,2);
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}
//获取业务服务费
function Y_FW(){
    var YData={
        'pathL':"/doctor/doctorService/getPlatformShareParam"
    }
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
              $('.Y_MediCalcDeB p b').text(res.data)
                Y_values=res.data
            }else{
                showalert1(0,res.msg,2);
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}





















