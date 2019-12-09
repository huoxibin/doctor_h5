$(function(){
    var memberId=getRequestParam('memberId');
    var signInfoId=getRequestParam('signInfoId');
    var doctorName = getRequestParam('doctorName');
    var state = getRequestParam('state');

    var ifPatient=getRequestParam('ifPatient');
    var styleD=getRequestParam('style');

    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorApplyForm/applyListFromUser",
            'accessToken':token,
            'memberId':memberId
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
                    var topHtml= new EJS({url:"../compileEjs/J_docAdviceList.ejs"}).render({data:data,memberId:memberId,ifPatient:ifPatient,styleD:styleD});
                    $('.J_advice').html(topHtml);
                    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());

                   $('.H_backPre').on('tap',function () {
                       if(styleD == 2){ //从患者详情（内容比较多的那个）
                          window.location.href='J_signPDetail.html?memberId='+memberId+'&signInfoId='+signInfoId+'&doctorName='+doctorName+'&state='+ state;
                       }else {//从患者详情（内容比较少的）
                          window.location.href='J_patientDetail.html?memberId='+memberId;
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
                }else{
                    showError(res.msg);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























