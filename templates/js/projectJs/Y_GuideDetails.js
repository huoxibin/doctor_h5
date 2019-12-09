$(function(){
    GHUTILS.openInstall()  //openinstall 唤醒app
    /*获取详情*/
    var closeHeader=getRequestParam('closeHeader');//关掉h5的头部
    var articleId=getRequestParam('id');
    var Y_Black=getRequestParam('Y_Black');
    var XK_title=getRequestParam('Y_case');
    var shareArticletitle = '';
    var shareDescription = '';
    // var articleId = 64;
    // $('.infoDetail_inner').height($(window).height() - $('.Ynav').height());
    //资讯详情跳转
    $('.infoDetail_btn').on('tap',function(){
        jumpMobil()
    });
    $('.XK_title').text(XK_title== 1 ? '经典案例' : '指南详情');
    //获取文章详情
    function articleDetail() {
        var JAridata={
            'pathL':"/doctor/guideConsensus/getGuideDetail",
            'id':articleId,
            'accessToken':token,
            'readCountFlag':-1
        };
        Ajax({
            url:servUrl,
            data:JAridata,
            async: false,
            beforeSend: function(){},
            type : 'get',
            dataType : "json",
            success:function(res){
                if(res.state==0){
                    document.title = res.data.consensusName;
                    shareArticletitle = res.data.consensusName;
                    var data=res.data;
                    var H_publishedDate = data.publishedDate.split(' ')[0];
                    var html= new EJS({url:"../compileEjs/Y_GuideDetails.ejs"}).render({data:data,Y_Black:Y_Black});
                    $('.infoDetail_inner').html(html);
                    $('.H_pubTime').html(H_publishedDate);

                   if($(window).height()==812){
                      $('.infoDetail_inner').css({
                         'top':'23px'
                      });
                      // $('.Ynav').css({
                      //    'paddingTop':'50px'
                      // });
                   };
                    //判断文章是否收藏
                    if(data.favorited==1){
                        $('.collectBtn').addClass('active');
                    }else{
                        $('.collectBtn').removeClass('active');
                    }
                }else{
                    showalert(0,res.msg,2);
                }
            },
            error:function(res){
                showalert(0,res.msg,2);
            }
        });
    }
    articleDetail();
    //收藏文章
    function collectFn(m){
        if(token != ''){
            var JAridata={
                'pathL':"/common/contentFavorite/favorite",
                'accessToken':token,
                'favorited': m,//1收藏、0取消收藏
                'valueId':articleId,//收藏内容的id号，资讯id号，指南id号等
                'valueTitle':shareArticletitle,//标题
                'valueMemo':'',//备注
                'valueImageUrl':'',//图标url
                'valueType':4//收藏信息类型 1资讯、2病历、3课程、4指南、5检验

            }
            Ajax({
                url:servUrl,
                data:JAridata,
                async: false,
                beforeSend: function(){},
                type : 'post',
                dataType : "json",
                success:function(res){
                    if(res.state==0){
                        if(m == 1){
                            showalert(0,"已收藏",2);
                            $('.collectBtn').addClass('active');
                            clearTimeout(timer)
                            var timer = setTimeout(function () {
                                //收藏加积分
                                if(token != ''){ //在应用内查看加积分 应用外无效
                                    GHUTILS.integration('addFavorite',function (result) {
                                        if(result.data.earnTaskPoint > '0'){
                                            GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
                                        }
                                    });
                                }
                            },2500)
                        }else{
                            showalert(0,'已取消收藏',2);
                            $('.collectBtn').removeClass('active');
                        }
                    }else{
                        showalert(0,res.msg,2);
                    }
                },
                error:function(res){
                    showalert(0,res.msg,2);
                }
            });
        }else{
            showalert(0,"您还未登录，暂不能收藏此文章",2);
        }
    }
    $('.collectBtn').on('tap',function () {
        if($(this).hasClass('active')){
            collectFn(0); //取消收藏
        }else{
            collectFn(1); //收藏
        }
    });

    //查看共识指南 （每天加一次积分）
    if(token != ''){ //在应用内查看加积分 应用外无效
        GHUTILS.integration('viewGuidelines',function (result) {
            if(result.data.earnTaskPoint > '0'){
                GHUTILS.integration_toast(result.data.notes, result.data.earnTaskPoint, 2)
            }
        });
    }


   //--------分享调用原生方法
   var closeHeader=getRequestParam('closeHeader');
   if(closeHeader == 'closeHeader'){
      $('.Ynav').addClass('hide');
      $('.shareHeader').removeClass('hide');
      $('.viewMoreClass').removeClass('hide');
      // $('.infoDetail').css({paddingTop:0});
      // $(".infoDetail").css("height","330px").css("overflow","hidden");
       $(window).scroll(function(){
           var scrollTop = parseInt($(this).scrollTop()),
               scrollHeight = parseInt($(document).height()),
               windowHeight = parseInt($(this).height()),
               _height = scrollTop + windowHeight;
           var s = scrollHeight - _height;
           if( s< 60){
               $('.recruitgomore').removeClass("hide");
           }else{
               $('.recruitgomore').addClass("hide");
           }
       });
   };
    //分享方法
    $('.shareBtn').on('tap',function () {
        shareDescription = $('.ql-editor').children().text().substr(0,200).replace(/<[^<>]+>|[&nbsp;]/g, '').substr(0,50);
        // shareDescription = $('.ql-editor').children().html().substr(0,50);
        var shareDate_ios = {
            'shareLink': window.location.href + '&closeHeader=closeHeader&module=2',
            'shareImgUrl': null,
            'shareArticletitle':shareArticletitle,
            'shareDescription':shareDescription,
        };
        var shareDate = JSON.stringify(shareDate_ios);
        if(window.webkit){
            window.webkit.messageHandlers.transmitMsge.postMessage(shareDate);
        }else if(window.jsObj){
            window.jsObj.transmitMsge(window.location.href +'&closeHeader=closeHeader&module=2',null, shareArticletitle,shareDescription);
        }
    });
    //唤起app
    // $('.openApp, .getMoreBtn').on('tap',function () {
    //     GHUTILS.openApp();
    // });
});























