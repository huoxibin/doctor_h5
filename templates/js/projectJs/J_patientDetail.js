$(function(){
    var memberId=getRequestParam('memberId');
    // var memberId = 544;

    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorPatient/patientById",
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
                    var topHtml= new EJS({url:"../compileEjs/J_patientDetail.ejs"}).render({data:data});
                    $('.J_patient').html(topHtml);
                    if($('.flRight span').length>3){
                        //$('.flRight span').css({'marginRight':'30px','marginLeft':'0','float':'left','textAlign':'left'});
                        $('.flRight span').addClass('maxLngstyle')
                        $('.p_downIcon').show();
                        $('.p_downIcon').on('tap',function(){
                            if($('.p_downIcon').hasClass('active')){
                                $('.p_downIcon').removeClass('active');
                                $('.flRight').parent('h4').css({'height':'44px'});
                            }else{
                                $('.p_downIcon').addClass('active');
                                $('.flRight').parent('h4').css({'height':$('.flRight').height()+'px'});
                            }
                        })
                    }else{
                        $('.p_downIcon').hide();
                        // $('.p_downIcon').removeClass('active');  //1.76rem
                        $(this).parent('h4').css('height','1.76rem');
                       // $('.flRight span').css({'marginRight':'0','marginLeft':'30px','float':'right','textAlign':'right'})
                        $('.flRight span').removeClass('maxLngstyle');
                    }
                    $('.J_jumpBtnIback').on('tap',function(){
                        jumpMobil();
                        /* var iHref=$(this).attr('isHref')
                         if(ifPatient!='' && ifPatient!=undefined){   //是从收入列表点击进来的
                         window.location.href=iHref;
                         }else{

                         }*/
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
                        $('.j_patient_up').css({
                            'height':'255px'
                        })
                    }
                }else{
                    showalert(0,''+res.msg+'',2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























