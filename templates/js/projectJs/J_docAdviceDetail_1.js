$(function(){
    var memberId=getRequestParam('memberId');
    var applyFormId=getRequestParam('applyFormId');
    var iUrl=window.location.pathname.split('_')[2].split('.')[0];
    var iSearh=window.location.search;
    var ifPatient= getRequestParam('ifPatient');
    var myPatient= getRequestParam('myPatient');
    var styleD=getRequestParam('style');//1是从患者详情内容少的进来的，2是从患者详情内容多的进来的
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
                if(res.state==0){
                    if(res.data.templet.sendFlag==1){ //未发送则可以编辑
                        window.location.href='../html/J_docAdviceEdit_'+iUrl+'.html'+iSearh+'';
                    }else{
                        var data=res.data;
                        var topHtml= new EJS({url:"../compileEjs/J_docAdviceDetail_1.ejs"}).render({data:data,memberId:memberId,ifPatient:ifPatient,myPatient:myPatient,styleD:styleD});
                        $('.TNB_form').html(topHtml);
                        $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
                        $('input,textarea').attr('disabled','disabled');
                        $('input,textarea').attr("unselectable","on");

                        //返回上一页面
                        $('.J_jumpBtnIback').on('tap',function(){
                            var iHref=$(this).attr('isHref');
                            if(myPatient!='' || ifPatient!=''){   //是从收入列表点击进来的
                                // window.location.href=iHref;
                               window.history.back();
                            }else{
                                jumpMobil();
                            }
                        });
                        

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
                    }
                }else if(res.state==6214){
                    window.location.href='../html/J_docAdviceEdit_'+iUrl+'.html'+iSearh+'';
                }else{
                    showalert(0,''+res.msg+'',2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
    //初始化糖尿病加载
    function initData(data){
        //初始化药品类型,显示隐藏那个用药
        var isId='.isTap'+$('.selectMadicType').attr('isTap');
        $('.selectH4').hide();
        $(isId).show();
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
    //新建编辑时候事件方法
    function methodThing(){
        //点击用药类型，返回类型标识，显示不同的div，单选
        $('.selectMadicType').on('tap',function(){
            $('.TNB_medTypes').show().siblings('.TNB_list').hide();
        })
        //点击建议，返回相应的文字，多选
        $('.Jtips').on('tap',function(){
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
            alert(iarr.join(','));
            $('.TNB_form').show().siblings('.TNB_list').hide();
            $('.TNB_advTTextarea').val($('.TNB_adviceTypeInp').val());
        })
    }
})
