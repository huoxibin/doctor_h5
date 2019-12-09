$(function(){
    var memberId=getRequestParam('memberId');
    var applyFormId=getRequestParam('applyFormId');
    var iUrl=window.location.pathname.split('_')[2].split('.')[0];
    var iSearh=window.location.search;
    var ifPatient= getRequestParam('ifPatient');
    var myPatient= getRequestParam('myPatient');
    var styleD=getRequestParam('style');
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
                   if(res.data.templet.sendFlag==1){ //未发送进入编辑
                        window.location.href='../html/J_docAdviceEdit_'+iUrl+'.html'+iSearh+'';
                    }else{
                        var data=res.data;
                        var topHtml= new EJS({url:"../compileEjs/J_docAdviceDetail_2.ejs"}).render({data:data,memberId:memberId,ifPatient:ifPatient,myPatient:myPatient,styleD:styleD});
                        $('.TNB_form').html(topHtml);
                        $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
                        initData(data);
                       $('input,textarea').attr('disabled','disabled');
                        $('input,textarea').attr("unselectable","on");
                       $('.J_jumpBtnIback').on('tap',function(){
                           var iHref=$(this).attr('isHref');
                           if(myPatient!='' || ifPatient!=''){   //是从收入列表点击进来的
                               // window.location.href=iHref;
                              window.history.back();
                           }else{
                               jumpMobil();
                           }
                       })
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
    //初始化加载
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

})























