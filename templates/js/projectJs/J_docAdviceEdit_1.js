$(function(){
    var memberId=getRequestParam('memberId');
    var applyFormId=getRequestParam('applyFormId');
    var ifPatient= getRequestParam('ifPatient');
    var myPatient= getRequestParam('myPatient');
    /* var ifNew=getRequestParam('ifNew');
   if(ifNew!='' && ifNew=='1'){
        var data=null;
        var topHtml= new EJS({url:"../compileEjs/J_docAdviceEdit_1.ejs"}).render({data:data,memberId:memberId,applyFormId:applyFormId});
        $('.TNB_form').html(topHtml);
        $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
        loadData();
        methodThing();  //编辑新建时候调用
    }else{
        //初始化数据
        loadAction();
    }*/
    //初始化数据
    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/diabetesTemplet/getTempletInfo",
            'accessToken':token,
            'applyFormId':applyFormId
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
                    var data=res.data;
                    var state=res.state;
                    var topHtml= new EJS({url:"../compileEjs/J_docAdviceEdit_1.ejs"}).render({data:data,memberId:memberId,applyFormId:applyFormId,state:state,ifPatient:ifPatient,myPatient:myPatient});
                    $('.TNB_form').html(topHtml);
                    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
                    $('input,textarea').removeAttr('disabled');
                    $('input,textarea').removeAttr("unselectable");
                    if(state==6214){
                        $('.ifSaveBtn').addClass('hideBtn')
                    }
                    if($(window).height()==812){
                    $('.Ynav').css({
                        'height':'68px',
                        'lineHeight':'68px'
                    })
                    $('.Ynav .a.Y_tump,.Ynav a.Y_tump,.Ynav dfn.Y_tump').css({
                        'marginTop':'21px'
                    })
                    $('.Ynav h1').css({
                        'marginTop':'24px'
                    })
                    $('.Y_docIndex').css({
                        'top':'88px'
                    })
                }
                    //根据有没有值判断按钮是否显示   hideBtn
                    if($('.startTime').val()==''||$('.sickYears').val()==''||$('.hospitalName').val()==''||$('.askReason').val()==''){
                        $('.ifSaveBtn').addClass('hideBtn')
                    }else{
                        $('.ifSaveBtn').removeClass('hideBtn')
                    }
                    $('.J_jumpBtnIback').on('tap',function(){
                        var iHref=$(this).attr('isHref')
                        if(myPatient!='' || ifPatient!=''){   //是从收入列表点击进来的
                            // window.location.href=iHref;
                            window.history.back();
                        }else{
                            jumpMobil();
                        }
                    })
                    loadData();
                    if(data!=null&&data!=undefined){
                        initData(data);
                    }
                    methodThing();  //编辑新建时候调用
                    //temSave();

                /*else{
                   $('.JnoDatahide').show();
                   $('.JnoDatahide dd').text(res.msg);
                }*/
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
    //初始化加载
    function initData(data){
        //初始化药品类型,显示隐藏那个用药
        var isId='.isTap'+$('.selectMadicType').attr('isTap');
        $('.selectH4').hide();
        $(isId).show();
        //用药添加class，方便序列化时候
        $('.medicineForm input').addClass('flau_u_ro');
        //初始化具体药物选择
        var medicineData=data.medicine;
        for(var i in medicineData){
            var box='.'+i;
            if(medicineData[i]!='' && medicineData[i]!=null){
                $(box).addClass('checkedBox');
                $(box).find('h5 i').addClass('checked');
                $(box).find('.form_right').show();
                var iarrs=JSON.parse(medicineData[i]);
                for(j in iarrs){
                    var isbox='.'+j+'_inp';
                    if(iarrs[j]==null){
                        $(box).find(isbox).val('');
                    }else{
                        $(box).find(isbox).val(iarrs[j]);
                    }
                }
            }else{
                $(box).removeClass('checkedBox');
                $(box).find('h5 i').removeClass('checked');
                $(box).find('.form_right').hide();
            }
        }
    }
    function methodThing(){
        //判断基本信息是否为空 ifNullInp
        $('.ifNullInp').on('change',function(){
            if($(this).val()!=''){
                var iVal=0;
                var iBox=$(this).parents('h4').siblings();
                for(var i=0;i<iBox.length;i++){
                    if($(iBox[i]).find('.ifNullInp').val()!=''){ //如果有一个
                        iVal++;
                    }else{
                        iVal--;
                    }
                    console.log(iVal);
                }
                if(iVal>=3){
                    $('.ifSaveBtn').removeClass('hideBtn')
                }
            }else{
                $('.ifSaveBtn').addClass('hideBtn')
            }
        })
        //表单textarea改变时候
        $('.sickReason,.askReason').on('input',function(){
            var maxwidth=300;
            if($(this).val().length>=maxwidth){
                $(this).val($(this).val().substring(0,maxwidth));
            }
        })
        $('.TNB_advTTextarea').on('input',function(){
            var maxwidth=500;
            if($(this).val().length>=maxwidth){
                $(this).val($(this).val().substring(0,maxwidth));
            }
        })
        //tips返回按钮点击
        $('.adviceBackIn').on('tap',function(){
            $('.TNB_form').show().siblings('.TNB_list').hide();
        })
        //点击用药类型，返回类型标识，显示不同的div，单选
        $('.selectMadicType').on('tap',function(){
            $('.TNB_medTypes').show().siblings('.TNB_list').hide();
        })
        //点击建议，返回相应的文字，多选
        var Jtips='';
        $('.Jtips').on('tap',function(){
            Jtips=$('.TNB_advTTextarea').val();
            $('.TNB_adviceType').show().siblings('.TNB_list').hide();
        })
        //多选按钮点击
        $('.select_itemMadic').on('tap',function(){
            $(this).toggleClass('checkedBox');
            $(this).find('h5 i').toggleClass('checked');
            $(this).find('.form_right').toggle();
        })
        //单选按钮点击
        $('.radioSelect p').on('tap',function(){
            var isId=$(this).find('.radioBtn').attr('isId');
            $(this).find('.radioBtn').addClass('checkedRadio');
            $(this).siblings('p').find('.radioBtn').removeClass('checkedRadio');
            $(this).parent().find('input').val(isId);
        })
        //用药类型点击
        $('.TNB_medTypes .TNB_medTypeSelect').on('tap',function(){
            $('.TNB_medTypes .TNB_medTypeSelect em').removeClass('emSelected');
            $(this).find('em').addClass('emSelected');
            var Id=$(this).attr('isTap');
            var isval=$(this).find('label').text();
            $(this).parent().parent().find('input').val(Id);
            $(this).parent().parent().find('input').attr('isval',isval)
        })
        //用药类型确定
        $('.TNB_medTypes .TNB_mTypeOk').on('tap',function(){
            var isId='.isTap'+$('.TNB_mTypeSelInp').val();
            $('.TNB_form').show().siblings('.TNB_list').hide();
            $('.selectMadicType').val($('.TNB_mTypeSelInp').attr('isval'));
            $('.selectMadicType').attr('isTap',$('.TNB_mTypeSelInp').val())
            $('.selectH4').hide();
            $(isId).show();
        })
        //建议点击
        var iarr=[];
        $('.TNB_adviceType .TNB_medTypeSelect').on('tap',function(){
            if($(this).find('em').hasClass('emSelected')){
                $(this).find('em').removeClass('emSelected');
                var isval=$(this).find('label').text();
                var ids=iarr.indexOf(isval);
                iarr.splice(ids,1)
            }else{
                $(this).find('em').addClass('emSelected');
                iarr.push($(this).find('label').text());
            }
        })
        //建议确定
        $('.TNB_adviceType .TNB_adviceTypeOk').on('tap',function(){
            $(this).parent().next('.Y_docIndex').find('input').val(iarr.join(','));
            //alert(iarr.join(','));
            $('.TNB_form').show().siblings('.TNB_list').hide();
            if(Jtips==''){
                $('.TNB_advTTextarea').val($('.TNB_adviceTypeInp').val());
            }else{
                $('.TNB_advTTextarea').val(Jtips+','+$('.TNB_adviceTypeInp').val());
                var maxwidth=500;
                if($('.TNB_advTTextarea').val().length>=maxwidth){
                    $('.TNB_advTTextarea').val($('.TNB_advTTextarea').val().substring(0,maxwidth));
                }
            }
        })
        //点击保存
        $('.temSave').on('tap',function(){
            temSave(1);
        })
        //点击发送
        $('.temOk').on('tap',function(){
            temSave(2);
        })
    }
    function temSave(Ibtn){
        //判断字数
        if($('.askReason').val().length<=300){
            if($('.sickReason').val().length<=300){  //TNB_advTTextarea
                if($('.TNB_advTTextarea').val().length<=500){
                    var medicine={};
                    var isData={};
                    var iData=$('input,textarea').not('.flau_u_ro').serializeArray();
                    var iH=$('.historyNum').val()==''?null:$('.historyNum').val();
                    var iHl=$('.historyNumlowNum').val()==''?null:$('.historyNumlowNum').val();
                    var iL=$('.recentNum').val()==''?null:$('.recentNum').val();
                    var iLl=$('.recentNumlowNum').val()==''?null:$('.recentNumlowNum').val();
                    var isMedData={
                        "historyNum":'{"highestNum":'+iH+',"lowNum":'+iHl+'}',
                        "recentNum":'{"highestNum":'+iL+',"lowNum":'+iLl+'}'
                    };
                    for(var i=0;i<iData.length;i++){
                        isData[''+iData[i].name+'']=iData[i].value;
                    }
                    var iUrl;
                    if(Ibtn==1){
                        iUrl={
                            'pathL':"/doctor/hypertensionTemplet/addHypertensionTemplet",
                            'accessToken':token,
                            'sendFlag':1,
                        };
                    }else{
                        iUrl={
                            'pathL':"/doctor/hypertensionTemplet/addHypertensionTemplet",
                            'accessToken':token,
                            'sendFlag':2,
                        };
                    }
                    var ajaxData = $.extend({},isData,isMedData,iUrl);
                    console.log(ajaxData);
                    Ajax({
                        url:servUrl,
                        data:ajaxData,
                        async: false,
                        beforeSend: function(){
                        },
                        type : 'post',
                        dataType : "json",
                        success:function(res){
                            if(res.state==0){
                                if(Ibtn==1){
                                    showalert(0,'保存成功',2);
                                }else if(Ibtn==2){
                                    var mobUrl={
                                        'startTime':$('.startTime').val(),
                                        'sickYears':$('.sickYears').val(),
                                        'hospitalName':$('.hospitalName').val(),
                                        'askReason':$('.askReason').val(),
                                        'applyFormId':applyFormId,
                                        'memberId':memberId,
                                        'templetType':1,
                                        'familyImAccid':$('#familyImAccid').val()
                                    };
                                    var dataStr=JSON.stringify(mobUrl);
                                    turnText();
                                    console.log(dataStr);
                                    saveMobile(dataStr);
                                }
                            }else{
                                showalert(0,res.msg,2);
                            }
                        },
                        error:function(res){
                            showalert(0,'保存失败',2);
                        }
                    });
                }else{
                    showalert(0,'健康建议不能超过500字',2);
                }
            }else{
                showalert(0,'血压升高原因不能超过300字',2);
            }
        }else{
            showalert(0,'咨询原因不能超过300字',2);
        }
    }
    function turnText(){
        $('.ifSaveBtn').hide();
        $('input,textarea').attr('disabled','disabled');
        $('input,textarea').attr("unselectable","on");
        $('input,textarea').addClass('ime-disabled')
    }
    function loadData(){
        var currYear = (new Date()).getFullYear();
        var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear - 1900, //开始年份
            endYear: currYear + 2000 //结束年份
        };
        $(".startTime").mobiscroll($.extend(opt['date'], opt['default']));
    }
    function saveMobile(dataStr){
        if(window.webkit){
            window.webkit.messageHandlers.saveConsultData.postMessage(dataStr);
        }else if(window.jsObj){
            window.jsObj.saveConsultData(dataStr);
        }
    }
})


