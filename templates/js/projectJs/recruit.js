(function($){
    GHUTILS.openInstall()  //openinstall 唤醒app
	var LENDCOMPILULIST = function(){
	    this.questionUrl = "";
        this.closeHeader=getRequestParam('closeHeader');
        this.shareHeader=getRequestParam('shareHeader');
        this.shareArticletitle = "";
        this.shareDescription = "";
        this.id = getRequestParam('id') || null;
        // this.id = 112;
    }
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit(); //页面初始化
			this.initDom();
            this.bindEvent();
		},
		pageInit:function(){
            var _this = this;
            if(_this.closeHeader == 'closeHeader'){
                $('.Ynav').addClass('hide');
                $('.infoDetail').css({paddingTop:0});

                $('.infoDetail .commentArea').hide();
                $('.infoDetail .commentBtn').hide();
                $('.infoDetail_inner').css({paddingBottom:'3rem'});
            }
            if(_this.shareHeader == 'shareHeader'){
                $('.infoDetail .commentArea').hide();
                $('.infoDetail .commentBtn').hide();
                $('.infoDetail_inner').css({paddingBottom:'3rem'});
                $('.shareHeader').removeClass('hide');
                $('.infoDetail').css({paddingTop:'2.8rem'});
                $('.recruit-join,.join-btn').hide();
                // $('.recruit').css({
                //    height: '330px',
                //    overflow: 'hidden'
                // });
                // $('.recruitgomore').removeClass('hide');
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
            }
        },
		initDom:function(){ //渲染招募详情内容
			var _this = this;
            var YData = {
                'pathL':"/doctor/recruitInfo/details",
                'id': _this.id,
                // 'accessToken': token
            }
            Ajax({
                url:servUrl,
                data:YData,
                async: false,
                beforeSend: function(){},
                type : 'POST',
                dataType : "json",
                success:function(res){
                    if(res.state==0){
                        var _innerHtml = res.data.content;
                        _this.shareArticletitle = res.data.name;
                        $('.recruit-title').html(res.data.name);
                        $('.recruit-time').html(res.data.offTime.substr(0,10));
                        $('.ql-editor').html(_innerHtml);
                        _this.questionUrl = res.data.questionUrl; //问卷星链接
                        //过期不显示 “马上报名按钮”
                        // console.log(res.data.expire);
                        if(res.data.expire == '2'){
                            $('.join-btn, .recruit-join').removeClass('hide');
                        }
                    }else{
                        showalert(1, res.msg, 2);
                    }
                },
                error:function(res){
                    showalert(1, '请求失败', 2);
                }
            });
		},
		bindEvent: function() {
			var _this = this;
			//跳转到招募报名页面
			$('.join-btn').on('tap', function () {
                if(_this.shareHeader =="shareHeader"){
                    GHUTILS.openApp();
                }else{
                    if($('.join-agreement .recruit_icon').hasClass('active')){
                        sessionStorage.setItem('src', _this.questionUrl);
                        if(window.webkit){
                            var questionnaire_ios = {
                                'questionnaire': _this.questionUrl
                            };
                            var questionnaireData = JSON.stringify(questionnaire_ios);
                            if(window.webkit){
                                window.webkit.messageHandlers.questionnaireFn.postMessage(questionnaireData);
                            }
                        }else if(window.jsObj){
                            GHUTILS.OPENPAGE({
                                url: 'recruit_questionnaire.html',
                                extras: {
                                    'src': encodeURI(_this.questionUrl)
                                }
                            });
                        }
                    }else{
                        showalert(1,'请先阅读并同意《知情同意书》',2);
                    }
                }
            });
            //勾选 知情同意书
            $('.recruit_icon_box').on('tap',function () {
                if(!$('.recruit_icon').hasClass('active')){
                    $('.recruit_icon').addClass('active');
                }else{
                    $('.recruit_icon').removeClass('active');
                }
            });
			//查看 知情同意书
            $('.join-agreement span').on('tap', function () {
                GHUTILS.OPENPAGE({
                    url: "recruit_join_rule.html",
                    extras: {
                        id: _this.id
                    }
                });
            });
			//返回列表
			$('.goBack').on('touchend', function () {
                jumpMobil();
            });
            //分享方法
            $('.shareBtn').on('tap',function () {
                _this.shareDescription = $('.ql-editor').children().html().substr(0,50);
                var shareDate_ios = {
                    'shareLink': window.location.href + '&closeHeader=closeHeader' + '&shareHeader=shareHeader&module=5',
                    'shareImgUrl': '',
                    'articleId': '',
                    'shareDescription': _this.shareDescription,
                    // 'familyId': familyId,
                    'shareArticletitle': _this.shareArticletitle,
                    //'favorited': favorited
                };
                var shareDate = JSON.stringify(shareDate_ios);
                if(window.webkit){
                    window.webkit.messageHandlers.transmitMsge.postMessage(shareDate);
                }else if(window.jsObj){
                    window.jsObj.transmitMsge(window.location.href + '&closeHeader=closeHeader&shareHeader=shareHeader&module=5','','',_this.shareDescription);
                }
            });
            //唤起app
            // $('.openApp, .getMoreBtn').on('tap',function () {
            //     GHUTILS.openApp();
            // });
		}
	};	
	$(function(){
		var ptn = new LENDCOMPILULIST();
			ptn.init();
	});
})(jQuery);
//(Zepto)