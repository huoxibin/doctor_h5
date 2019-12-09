$(function(){
    var token=sessionStorage.getItem('JdocToken');
    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
    loadAction();
    function loadAction(){
        var Icategory=decodeURI(getRequestParam('category'));
        $('.category').text(Icategory);
        var YData={
            'pathL':"/doctor/doctorSearchDiseaseCategory/queryDisease",
            'category':Icategory,
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
                    var data=res.data.diseases;
                    var category=res.data.category;
                    var topHtml= new EJS({url:"../compileEjs/Y_DCList.ejs"}).render({data:data,category:category});
                    $('.Y_DCConList ul').html(topHtml);
                    $('.IcatClick').on('tap',function(){
                        var iTag=$(this).attr('Icat');
                        var iHref=$(this).attr('ishref');
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","查看"+iTag+"详情", "查看", ""+iTag+"", "", "IcatClick"]);
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























