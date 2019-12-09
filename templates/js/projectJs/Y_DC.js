$(function(){
    /*var token=sessionStorage.getItem('JdocToken');*/
    sessionStorage.setItem('JdocToken',token);
    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorSearchDiseaseCategory/queryDiseaseCategory",
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
                    var isData=data[0];
                    var topHtml= new EJS({url:"../compileEjs/Y_DC.ejs"}).render({data:data});
                    $('.Y_DCCon ul').html(topHtml);
                    $('.IhrefA').on('tap',function(){
                        var iTag=$(this).attr('iTag');
                        var iHref=$(this).attr('ishref');
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","查看"+iTag+"疾病分类", "查看", ""+iTag+"", "", "IhrefA"]);
                    })
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























