var MySer1,MySer2,MySer3;
$(function(){
    Y_SerType1()
    Y_SerType2()
    Y_SerType3();
    ifshowMypack();  //是否显示家医服务包
    /*$('.Y_MySer').on('tap','.Y_MySerLi1',function(){
        /!*window.location.href="../html/Y_MySerTXT.html?status1="+status1+'&fixPrice1='+fixPrice1+""*!/
        window.location.href="../html/Y_MySerTXT.html"
    })
    $('.Y_MySer').on('tap','.Y_MySerLi2',function(){
       /!* window.location.href="../html/Y_MySerVoice.html?status2="+status2+'&fixPrice2='+fixPrice2+""*!/
        window.location.href="../html/Y_MySerVoice.html"
    })
    $('.Y_MySer').on('tap','.Y_MySerLi3',function(){
        /!*window.location.href="../html/Y_MySerVideo.html?status3="+status3+'&fixPrice3='+fixPrice3+""*!/
        window.location.href="../html/Y_MySerVideo.html"
    })*/
    $('.Y_MySer').on('tap','.Y_SerLiSet',function(){  //进入模板
        window.location.href="../html/J_MySerSet.html?set=1"
    })
    $('.Y_MySer').on('tap','.Y_MySerLiSet',function(){  //进入我的
        window.location.href="../html/J_MySerSet.html?set=0"
    })
})
function ifshowMypack(){
    var YData={
        'pathL':"/doctor/teamInfo/serviceQualification",
        'accessToken':token
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
                if(res.data.qualification==0 || res.data.teamRole==0){  //.不具备家医服务资格/未加入团队
                  $('.MypackWeb,.MypackWebTitle').hide();
                }else{
                    $('.MypackWeb,.MypackWebTitle').show();
                    ifUser();
                }
            }else{
                showalert(0,res.msg,2);
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
            $('.Y_MySerLiSet').hide();
        }
    });
}
function ifUser(){
    var YData={
        'pathL':"/doctor/teamPackTemplate/haveServicec",
        'accessToken':token
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
              if(res.data){ //有无我的服务包
                  $('.Y_MySerLiSet').show();
              }else{
                  $('.Y_MySerLiSet').hide();
              }
            }else{
                showalert(0,res.msg,2);
                $('.Y_MySerLiSet').hide();
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
            $('.Y_MySerLiSet').hide();
        }
    });
}
 function Y_SerType1(){
     var YData={
         'pathL':"/doctor/doctorService/getDoctorService",
         "type":1,
         'accessToken':token
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
                 var data=res.data;
                 /*status1=data.status;
                 fixPrice1=data.fixPrice;*/
                 MySer1=JSON.stringify(data);
                 sessionStorage.setItem('MySer1',MySer1);
                 if(data.status==1){
                     $('.Y_MySer ul li').eq(0).find('b').addClass('on');
                     $('.Y_MySer ul li').eq(0).find('b').text('已开通');
                 }else{
                     $('.Y_MySer ul li').eq(0).find('b').removeClass('on');
                     $('.Y_MySer ul li').eq(0).find('b').text('未开通');
                 }
                 $(".Y_MySerLi1 h2").on('tap','.Y_RRconDown',function(){
                     $(this).parent().next().toggleClass('on');
                     $(this).find('i').toggleClass('cur');
                     var Y_MySerTXT=sessionStorage.getItem('MySer1');
                     var Y_MySerTXTData=JSON.parse(Y_MySerTXT);
                     var Y_fixPrice1=sessionStorage.getItem('Y_fixPrice1');
                         //判断是否开通
                         if(Y_MySerTXTData.status==1){
                             $('.Y_MySerLi1 .Y_button>span').attr('class','switch-on')
                         }
                         //判断服务费用有没有设置
                         if(!Y_fixPrice1 || Y_fixPrice1==''){
                             if(Y_MySerTXTData.discountPrice>0 && Y_MySerTXTData.discountPrice!=''){
                                 $('.Y_MySerLi1 .Y_MySerTXT p').find('b').text(Y_MySerTXTData.discountPrice+'元/次')
                                 $('.Y_MySerLi1 .Y_MySerTXT p').find('b').addClass('on');
                             }else{
                                 $('.Y_MySerLi1 .Y_MySerTXT p').find('b').text('未设置')
                                 $('.Y_MySerLi1 .Y_MySerTXT p').find('b').css('color','#999');
                             }
                         }else{
                             $('.Y_MySerLi1 .Y_MySerTXT p').find('b').text(Y_fixPrice1+'元/次')
                             $('.Y_MySerLi1 .Y_MySerTXT p').find('b').css('color','#666');
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
                             //开通咨询加成长值（首次）
                             // if(token != ''){ //在应用内查看加积分 应用外无效
                             //     GHUTILS.integration('setService',function (result) {
                             //         if(result.data.earnTaskPoint > '0'){
                             //             GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                             //         }
                             //     });
                             // }
                         },function(){
                             //关闭状态为2
                             Y_SerType1(0)
                         });
                         $('.Y_MySerLi1 .Y_MySerTXT p').find('b').on('tap',function(){
                             window.location.href="../html/Y_MySerPrice.html?Y_type=1"
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
                                     if(status==1){
                                         $('.Y_MySerLi1 h2').find('b').addClass('on');
                                         $('.Y_MySerLi1 h2').find('b').text('已开通');

                                         if(token != ''){ //在应用内查看加积分 应用外无效
                                             GHUTILS.integration('setService',function (result) {
                                                 if(result.data.earnTaskPoint > '0'){
                                                     GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                                                 }
                                             });
                                         }

                                     }else{
                                         $('.Y_MySerLi1 h2').find('b').removeClass('on');
                                         $('.Y_MySerLi1 h2').find('b').text('未开通');
                                     }

                                 }else{
                                     if(status==1){
                                         showalert1(0,res.msg,2);
                                         $('.Y_MySerLi1 .Y_button>span').attr('class','switch-off');
                                         /*$('.Y_MySer ul li').eq(0).find('b').removeClass('on');
                                         $('.Y_MySer ul li').eq(0).find('b').text('未开通');*/
                                     }
                                 }
                             },
                             error:function(res){
                                 showalert(0,'请求失败',2);
                             }
                         });
                     }
                 });
             }
         },
         error:function(res){
             showalert(0,'请求失败',2);
         }
     });
 }
function Y_SerType2(){
    var YData={
        'pathL':"/doctor/doctorService/getDoctorService",
        "type":2,
        'accessToken':token
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
                var data=res.data;
                /*status2=data.status;
                fixPrice2=data.fixPrice;*/
                MySer2=JSON.stringify(data);
                sessionStorage.setItem('MySer2',MySer2);
                if(data.status==1){
                    $('.Y_MySer ul li').eq(1).find('b').addClass('on');
                    $('.Y_MySer ul li').eq(1).find('b').text('已开通');
                }else{
                    $('.Y_MySer ul li').eq(1).find('b').removeClass('on');
                    $('.Y_MySer ul li').eq(1).find('b').text('未开通');
                }
                $(".Y_MySerLi2 h2").on('tap','.Y_RRconDown',function(){
                    $(this).parent().next().toggleClass('on');
                    $(this).find('i').toggleClass('cur');
                    var Y_MySerVo=sessionStorage.getItem('MySer2');
                    var Y_MySerVoData=JSON.parse(Y_MySerVo);
                    var Y_fixPrice2=sessionStorage.getItem('Y_fixPrice2');
                    var Y_isSet=sessionStorage.getItem('Y_isSet');
                        //判断是否开通
                        if(Y_MySerVoData.status==1){
                            $('.Y_MySerLi2 .Y_button>span').attr('class','switch-on')
                        }
                        //判断服务费用有没有设置
                        if(!Y_fixPrice2 || Y_fixPrice2==''){
                            if(Y_MySerVoData.fixPrice>0 && Y_MySerVoData.discountPrice!=''){
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(1).find('b').text(Y_MySerVoData.discountPrice+'元/次')
                            }else{
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(1).find('b').text('未设置')
                            }
                        }else{
                            $('.Y_MySerLi2 .Y_MySerTXT p').eq(1).find('b').text(Y_fixPrice2+'元/次')
                        }
                        if(!Y_isSet){
                            if(Y_MySerVoData.isSet==1){
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(2).find('b').text('已设置')
                            }else{
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(2).find('b').text('未设置')
                            }
                        }else{
                            if(Y_isSet==1){
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(2).find('b').text('已设置')
                            }else{
                                $('.Y_MySerLi2 .Y_MySerTXT p').eq(2).find('b').text('未设置')
                            }
                        }
                        //点击开通服务的按钮
                        switchEvent("#fly1",function(){
                            Y_SerType1(1);
                            if(window.webkit){
                                window.webkit.messageHandlers.clickOpenService.postMessage("");
                            }else if(window.jsObj){
                                window.jsObj.clickOpenService();
                            }
                            //开通咨询加成长值（首次）
                            // if(token != ''){ //在应用内查看加积分 应用外无效
                            //     GHUTILS.integration('setService',function (result) {
                            //         if(result.data.earnTaskPoint > '0'){
                            //             GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                            //         }
                            //     });
                            // }
                        },function(){
                            Y_SerType1(0)
                        });
                        $('.Y_MySerLi2 .Y_MySerTXT p').eq(1).on('tap',function(){
                            window.location.href="../html/Y_MySerPrice.html?Y_type=2"
                        })
                        $('.Y_MySerLi2 .Y_MySerTXT p').eq(2).on('tap',function(){
                            window.location.href="../html/Y_MySerTaTime.html?Y_serviceId="+Y_MySerVoData.id+'&type=Vo';
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
                                    if(status==1){
                                        $('.Y_MySerLi2 h2').find('b').addClass('on');
                                        $('.Y_MySerLi2 h2').find('b').text('已开通');

                                        if(token != ''){ //在应用内查看加积分 应用外无效
                                            GHUTILS.integration('setService',function (result) {
                                                if(result.data.earnTaskPoint > '0'){
                                                    GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                                                }
                                            });
                                        }

                                    }else{
                                        $('.Y_MySerLi2 h2').find('b').removeClass('on');
                                        $('.Y_MySerLi2 h2').find('b').text('未开通');
                                    }
                                }else{
                                    if(status==1){
                                        showalert1(0,res.msg,2);
                                        $('.Y_MySerLi2 .Y_button>span').attr('class','switch-off')
                                    }
                                }
                            },
                            error:function(res){
                                showalert(0,'请求失败',2);
                            }
                        });
                    }
                });

            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}
function Y_SerType3(){
    var YData={
        'pathL':"/doctor/doctorService/getDoctorService",
        "type":3,
        'accessToken':token
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
                var data=res.data;
                /*status3=data.status;
                fixPrice3=data.fixPrice;*/
                MySer3=JSON.stringify(data);
                sessionStorage.setItem('MySer3',MySer3);
                if(data.status==1){
                    $('.Y_MySer ul li').eq(2).find('b').addClass('on');
                    $('.Y_MySer ul li').eq(2).find('b').text('已开通');
                }else{
                    $('.Y_MySer ul li').eq(2).find('b').removeClass('on');
                    $('.Y_MySer ul li').eq(2).find('b').text('未开通');
                }
                $(".Y_MySerLi3 h2").on('tap','.Y_RRconDown',function(){
                    $(this).parent().next().toggleClass('on');
                    $(this).find('i').toggleClass('cur');
                    var Y_MySerVi=sessionStorage.getItem('MySer3');
                    var Y_MySerViData=JSON.parse(Y_MySerVi);
                    var Y_fixPrice3=sessionStorage.getItem('Y_fixPrice3');
                    var Y_isSet1=sessionStorage.getItem('Y_isSet1');
                    $(function(){
                        if(Y_MySerViData.status==1){
                            $('.Y_MySerLi3 .Y_button>span').attr('class','switch-on')
                        }
                        if(!Y_fixPrice3 || Y_fixPrice3==''){
                            if(Y_MySerViData.discountPrice>0 && Y_MySerViData.discountPrice!=''){
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(1).find('b').text(Y_MySerViData.discountPrice+'元/次')
                            }else{
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(1).find('b').text('未设置')
                            }
                        }else{
                            $('.Y_MySerLi3 .Y_MySerTXT p').eq(1).find('b').text(Y_fixPrice3+'元/次')
                        }
                        if(!Y_isSet1){
                            if(Y_MySerViData.isSet==1){
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(2).find('b').text('已设置')
                            }else{
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(2).find('b').text('未设置')
                            }
                        }else{
                            if(Y_isSet1==1){
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(2).find('b').text('已设置')
                            }else{
                                $('.Y_MySerLi3 .Y_MySerTXT p').eq(2).find('b').text('未设置')
                            }
                        }
                        switchEvent("#fly2",function(){
                            Y_SerType1(1)
                            if(window.webkit){
                                window.webkit.messageHandlers.clickOpenService.postMessage("");
                            }else if(window.jsObj){
                                window.jsObj.clickOpenService();
                            }
                            //开通咨询加成长值（首次）
                            // if(token != ''){ //在应用内查看加积分 应用外无效
                            //     GHUTILS.integration('setService',function (result) {
                            //         if(result.data.earnTaskPoint > '0'){
                            //             GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                            //         }
                            //     });
                            // }
                        },function(){
                            Y_SerType1(0)
                        });
                        $('.Y_MySerLi3 .Y_MySerTXT p').eq(1).on('tap',function(){
                            window.location.href="../html/Y_MySerPrice.html?Y_type=3"
                        })
                        $('.Y_MySerLi3 .Y_MySerTXT p').eq(2).on('tap',function(){
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
                                    if(status==1){
                                        $('.Y_MySerLi3 h2').find('b').addClass('on');
                                        $('.Y_MySerLi3 h2').find('b').text('已开通');

                                        if(token != ''){ //在应用内查看加积分 应用外无效
                                            GHUTILS.integration('setService',function (result) {
                                                if(result.data.earnTaskPoint > '0'){
                                                    GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                                                }
                                            });
                                        }

                                    }else{
                                        $('.Y_MySerLi3 h2').find('b').removeClass('on');
                                        $('.Y_MySerLi3 h2').find('b').text('未开通');
                                    }
                                }else{
                                    if(status==1){
                                        showalert1(0,res.msg,2);
                                        $('.Y_MySerLi3 .Y_button>span').attr('class','switch-off')
                                    }
                                }
                            },
                            error:function(res){
                                showalert(0,'请求失败',2);
                            }
                        });
                    }
                });
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}






















