$(function(){
    var Icategory = decodeURI(getRequestParam('category'));
    var returnBack = decodeURI(getRequestParam('returnBack'));
    var IdiseaseName=decodeURI(getRequestParam('diseaseName'));
    var diseaseToken = returnBack == '1' ? token : sessionStorage.getItem('JdocToken'); //如果是全局搜索跳转疾病详情使用token
    $('.diseaseName').html(IdiseaseName);
    $('.dcDetailBack').on('tap', function () {
        if(returnBack == '1'){
            jumpMobil()
        }else if(Icategory == '' || Icategory == 'undefined') {
            GHUTILS.OPENPAGE({
                url: 'Y_DCSearch.html'
            });
        }else{
            GHUTILS.OPENPAGE({
                url: 'Y_DCList.html',
                extras: {
                    'category': Icategory
                }
            });
        }
    });

    loadAction();
    function loadAction(){
        var IdiseaseName=decodeURI(getRequestParam('diseaseName'));
        var Icategory=decodeURI(getRequestParam('category'));
        $('.diseaseName').text(IdiseaseName);
        var YData={
            'pathL':"/doctor/doctorSearchDiseaseInfo/queryDiseaseInfo",
            'diseaseName':IdiseaseName,
            'accessToken':diseaseToken
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
                    var ms=res.data.medicine;
                    var imedicine=[];
                    var isMed='';
                    if(ms!=undefined&&ms!=''){
                        for(var j = 0; j<ms.length; j++){
                            imedicine.push(ms[j].name);
                        }
                        isMed=imedicine.join('、');
                    }
                    var topHtml= new EJS({url:"../compileEjs/Y_DCdetails.ejs"}).render({data:data,medicine:isMed,category:Icategory});
                    $('.Ydcdetails').html(topHtml);
                    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());

                   if($(window).height()==812){
                      $('.Y_docIndex').css({
                         'top':'87px'
                      });
                   };
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























