var Y_serviceId=getRequestParam('Y_serviceId');
var type=getRequestParam('type');
var Y_MySerVo=sessionStorage.getItem('MySer2');
var Y_MySerVoData=JSON.parse(Y_MySerVo);
var Y_MySerVi=sessionStorage.getItem('MySer3');
var Y_MySerViData=JSON.parse(Y_MySerVi);
var Y_btn=1;
$(function(){
    if(type=='Vi'){
        $('.Ynav h1').text('设置视频时间');
        $('.Ynav a.Y_tump').on('touchend',function(){
            if(Y_btn==2){
                window.location.href="../html/Y_MySer.html"
            }else{
                Y_MyserTimeBtn(0,'您刚才设置的时间段还没有点击“确定”保存，你如果现在离开，则不会保存这些设置。',2);
                $('.Y_btn1s').on('tap',function(){
                    window.location.href="../html/Y_MySer.html"
                })
                $('.Y_btn2s').on('tap',function(){
                    $('.Y_MyserTime').removeClass('in');
                    $('.Y_MyserTime').remove();
                    $('#cover').remove();
                })
            }
           /* window.location.href="../html/Y_MySerVideo.html"*/
        })
    }else{
        $('.Ynav a.Y_tump').on('tap',function(){
            if(Y_btn==2){
                window.location.href="../html/Y_MySer.html"
            }else{
                Y_MyserTimeBtn(0,'您刚才设置的时间段还没有点击“确定”保存，你如果现在离开，则不会保存这些设置。',2);
                $('.Y_btn1s').on('tap',function(){
                    window.location.href="../html/Y_MySer.html"
                })
                $('.Y_btn2s').on('tap',function(){
                    $('.Y_MyserTime').removeClass('in');
                    $('.Y_MyserTime').remove();
                    $('#cover').remove();
                })
            }
            /*window.location.href="../html/Y_MySerVoice.html"*/
        })
    }
    Y_ServicePlans();
    $('.Ynav b.Y_tump1').on('tap',function(){
        save();
    })
})
function save(){ //确认按钮
    if(timeIdS.length>0){
        if(type=='Vo') {
            $.each(timeIdS, function (index, item) {
                Y_dataTimeC(1, item)
            });
        }else{
            $.each(timeIdS, function (index, item) {
                Y_dataTimeC(2, item)
            });
        }
    }
    if(timeIdC.length>0){
        $.each(timeIdC,function(index,item){
            Y_dataTimeC(0,item)
        });
    }
}
/*每天对应的排班时间*/
function Y_ServicePlans(){
    var YData={
        'pathL':"/doctor/doctorService/getDoctorServicePlans",
        'serviceId':Y_serviceId,
        // 'serviceId':716,
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
                var html= new EJS({url:"../compileEjs/Y_MySerTaTime.ejs"}).render({data:data});
                $(html).appendTo('.Y_TaTime');
                honeySwitch.init()
                $('.Y_DateatopC').css('height',$(window).height()-$('.Ynav').height()-$('.Y_DateaBotC2').height())
                $('.Y_TaTime .Y_MediCalcLt ul li').eq(0).addClass('on')
                $(".Y_TaTime .Y_MediCalcRt .Y_MediCalcRtCon").eq(0).addClass('Y_SCur')
                if(type=='Vi'){
                    $('.Y_DateaBotC2 dl dd p').text('开启后，将自动生成更多视频时间');
                    //判断是否开通
                    var Y_XH=sessionStorage.getItem('Y_XH');
                    if(!Y_XH){
                        if(Y_MySerViData.isCycle==1){
                            $('#fly').attr('class','switch-on')
                        }
                    }else{
                        if(Y_XH==1){
                            $('#fly').attr('class','switch-on')
                        }
                    }
                    switchEvent("#fly",function(){
                        Y_SerType1(1,Y_MySerViData.id3,3)
                    },function(){
                        Y_SerType1(0,Y_MySerViData.id3,3)
                    });
                }else{
                    //判断是否开通
                    var Y_XH=sessionStorage.getItem('Y_XH');
                    if(!Y_XH){
                        if(Y_MySerVoData.isCycle==1){
                            $('#fly').attr('class','switch-on')
                        }
                    }else{
                        if(Y_XH==1){
                            $('#fly').attr('class','switch-on')
                        }
                    }
                    switchEvent("#fly",function(){
                        Y_SerType1(1,Y_MySerVoData.id,2);
                    },function(){
                        Y_SerType1(0,Y_MySerVoData.id,2)
                    });
                }
                Y_DataTimeapply();
                //点击时间出现对应的时间段
                $('.Y_TaTime .Y_MediCalcLt ul').on('tap','li',function(){
                    $(this).addClass('on').siblings().removeClass('on');
                    var num =$(".Y_TaTime .Y_MediCalcLt ul li").index(this);
                    $(".Y_TaTime .Y_MediCalcRt .Y_MediCalcRtCon").hide();
                    $(".Y_TaTime .Y_MediCalcRt .Y_MediCalcRtCon").eq(num).show().siblings().hide();
                    $(".Y_TaTime .Y_MediCalcRt .Y_MediCalcRtCon").eq(num).addClass('Y_SCur').siblings().removeClass('Y_SCur');
                    Y_DataTimeapply();
                })
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}
function Y_dataTimeC(status,timeId){
    var YData={
        'pathL':"/doctor/doctorService/updateDoctorServiceTime",
        'status':status,
        'timeId':timeId,
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
                var data=res.data;
                showalert(0,'保存成功',2);
                Y_btn=2
                if(type=='Vi'){
                    if($('.Y_SCur .Y_DateTime ul li.Y_SerVi').length>0){
                        sessionStorage.setItem('Y_isSet1',1);
                    }else{
                        sessionStorage.setItem('Y_isSet1',2);
                    }
                }else{
                    if($('.Y_SCur .Y_DateTime ul li.Y_SerVo').length>0){
                        sessionStorage.setItem('Y_isSet',1);
                    }else{
                        sessionStorage.setItem('Y_isSet',2);
                    }
                }
                /*if(status==1){
                 sessionStorage.setItem('Y_isSet',1);
                 }else if(status==2){
                 sessionStorage.setItem('Y_isSet1',1);
                 }else{
                 if(type=='Vi'){
                 sessionStorage.setItem('Y_isSet1',2);
                 }else{
                 sessionStorage.setItem('Y_isSet',2);
                 }
                 }*/
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}
function Y_DataTimeapplyC(applyType,orderTime){
    var YData={
        'pathL':"/doctor/doctorApplyForm/checkOrderTime",
        'applyType':applyType,
        'orderTime':orderTime,
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
            }
        },
        error:function(res){
            showalert(0,'请求失败',2);
        }
    });
}
var timeIdS=[];
var timeIdC=[];
function Y_DataTimeapply(){
    if(type=='Vo'){
        $('.Y_MediCalcRtCon.Y_SCur div ul li').not(".Y_SerVi").on('tap',function(){
            if($(this).attr('class')!='Y_SerVo'){
                var Y_timeId=$(this).attr('timeId');
                var orderTime1=$('.Y_MediCalcLt ul li.on p').eq(0).text();
                var orderTime2=$('.Y_MediCalcLt ul li.on p').eq(1).text();
                var Y_TimeNext;
                if($(this).text()=='11:30'){
                    Y_TimeNext='12:00'
                }else if($(this).text()=='18:30'){
                    Y_TimeNext="19:00"
                }else if($(this).text()=='22:30'){
                    Y_TimeNext='23:00'
                }else{
                    Y_TimeNext=$(this).next().text();
                }
                var orderTime=orderTime2+' '+orderTime1+' '+$(this).text()+'~'+Y_TimeNext;
                $(this).addClass('Y_SerVo');
                Y_DataTimeapplyC(2,orderTime)
                /*选中的放在数组里*/
                timeIdS.push(Y_timeId);
                /*在次点击删除选中的*/
                $.each(timeIdC,function(index,item){
                    // index是索引值（即下标）   item是每次遍历得到的值；
                    if(item==Y_timeId){
                        timeIdC.splice(index,1);
                    }
                });
            }else{
                var Y_timeId=$(this).attr('timeId');
                $(this).attr('class','');
                /*Y_DataTimeapplyC(0,Y_timeId)*/
                /*在次点击删除选中的*/
                $.each(timeIdS,function(index,item){
                    // index是索引值（即下标）   item是每次遍历得到的值；
                    if(item==Y_timeId){
                        timeIdS.splice(index,1);
                    }
                });
                /*把取消的放在数组里*/
                timeIdC.push(Y_timeId);
            }
        })
    }else{
        $('.Y_MediCalcRtCon.Y_SCur div ul li').not(".Y_SerVo").on('tap',function(){
            if($(this).attr('class')!='Y_SerVi'){
                var Y_timeId=$(this).attr('timeId');
                var orderTime1=$('.Y_MediCalcLt ul li.on p').eq(0).text();
                var orderTime2=$('.Y_MediCalcLt ul li.on p').eq(1).text();
                var Y_TimeNext;
                if($(this).text()=='11:30'){
                    Y_TimeNext='12:00'
                }else if($(this).text()=='18:30'){
                    Y_TimeNext="19:00"
                }else if($(this).text()=='22:30'){
                    Y_TimeNext='23:00'
                }else{
                    Y_TimeNext=$(this).next().text();
                }
                var orderTime=orderTime2+' '+orderTime1+' '+$(this).text()+'~'+Y_TimeNext;
                $(this).addClass('Y_SerVi');
                Y_DataTimeapplyC(3,orderTime)
                /*选中的放在数组里*/
                timeIdS.push(Y_timeId);
                /*在次点击删除选中的*/
                $.each(timeIdC,function(index,item){
                    // index是索引值（即下标）   item是每次遍历得到的值；
                    if(item==Y_timeId){
                        timeIdC.splice(index,1);
                    }
                });
            }else{
                var Y_timeId=$(this).attr('timeId');
                $(this).attr('class','');
                /*Y_DataTimeapplyC(0,Y_timeId)*/
                /*在次点击删除选中的*/
                $.each(timeIdS,function(index,item){
                    // index是索引值（即下标）   item是每次遍历得到的值；
                    if(item==Y_timeId){
                        timeIdS.splice(index,1);
                    }
                });
                /*把取消的放在数组里*/
                timeIdC.push(Y_timeId);
            }
        })
    }
}
/*循环*/
function Y_SerType1(isCycle,Y_MySerId,Y_Stype){
    var YData={
        'pathL':"/doctor/doctorService/updateDoctorService",
        'id':Y_MySerId,
        'isCycle':isCycle,
        'type':Y_Stype,
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
                if(isCycle==1){
                    sessionStorage.setItem('Y_XH',1);
                }else{
                    sessionStorage.setItem('Y_XH',0);
                }
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
