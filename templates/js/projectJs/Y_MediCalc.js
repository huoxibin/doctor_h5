var Y_MeScroll=0;
var Y_MeCaText=sessionStorage.getItem('Y_MeCaText');
$(function(){
    sessionStorage.setItem('JdocToken',token);
    $('.Y_MediCalcLt,.Y_MediCalcRt').css('height',$(window).height()-$('.Ynav').height())
    loadAction();
    $('.Y_MediCalcLt').on('tap','li',function(){
        var index = $(this).index()+1;
        $(this).addClass('on').siblings().removeClass('on');
        // $(this).siblings().find('dl dt img').attr('src','../images/Y_MediCalcIcon'+index+'_active.png');
        var length = $('.Y_MediCalcLt li').length
        for(var i=0;i<length;i++){
            $('.Y_MediCalcLt li').eq(i).find('dl dt img').attr('src',$('.Y_MediCalcLt li').eq(i).find('dl dt img').attr('src').replace(/_active/g,''))
        }
        $(this).find('dl dt img').attr('src','../images/Y_MediCalcIcon'+index+'_active.png')
        // $(this).find('dl dt img').attr('src',Y_str+'.png');
        //
        // var hj=$('.Y_MediCalcLt li').eq(iNum).find('dl dt img').attr('src').substr(0,25);
        // $('.Y_MediCalcLt li').eq(iNum).find('dl dt img').attr('src',hj+'_active.png');
        //
        // iNum=$(this).index();

        var isText=$(this).find('i').text();
        Y_MeScroll=$('.Y_MediCalcLt ul').scrollTop();//获取左侧的top值
        _czc.push(["_trackEvent","医学计算器", "查看", ""+isText+"大类", "", "Y_MediCalcLt"]);
        loadCalcul(isText);
    })
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorCalculator/queryCategory",
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
                    var isData=data[0].category_name;
                    var topHtml= new EJS({url:"../compileEjs/Y_MediCalc.ejs"}).render({data:data,Y_MeCaText:Y_MeCaText});
                    $('.Y_MediCalcLt ul').html(topHtml);

                    function GetRequest() {
                        var url = location.search; // 获取url中"?"符后的字串
                        var theRequest = new Object();
                        if (url.indexOf("?") != -1) {
                            var str = url.substr(1);
                            strs = str.split("&");
                            for (var i = 0; i < strs.length; i++) {
                                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                            }
                        }
                        return theRequest;
                    }
                    var listTop = GetRequest().scroll

                    if(listTop){
                        $('.Y_MediCalcLt ul').scrollTop(listTop)
                    }
                    if(!Y_MeCaText){
                        $('.Y_MediCalcLt li').eq(0).addClass('on');
                    }

                    if(Y_MeCaText){
                        loadCalcul(Y_MeCaText);
                    }else{
                        loadCalcul(isData);
                    }

                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
    function loadCalcul(isData){
        var YData={
            'pathL':"/doctor/doctorCalculator/queryCalculator",
            'category':isData,
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
                    var icategory=$('.Y_MediCalcLt li.on i').text();
                    var topHtml= new EJS({url:"../compileEjs/Y_MediCalcss.ejs"}).render({data:data,category:icategory,Y_MeScroll:Y_MeScroll});
                    $('.Y_MediCalcRt ul').html(topHtml);
                    $('.MediCalCLick').on('tap',function(){
                        var iTag=$(this).attr('iName');
                        var iHref=$(this).attr('ishref');
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","医学计算器", "查看", ""+iTag+"细类", "", "MediCalCLick"]);
                    })
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























