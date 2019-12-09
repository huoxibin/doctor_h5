(function($){
    _czc.push(["Show_SharePage_NoFriendlist", "邀请好友", "无列表", "", "on"]);
    var LENDCOMPILULIST = function(){}
    LENDCOMPILULIST.prototype = {
        init:function(){
            //this.pageInit(); //页面初始化
            //this.initDom();
            this.bindEvent();
        },
        pageInit:function(){
            var _this = this;
        },
        initDom:function(){ //产品列表渲染方法
            var _this = this;
        },
        bindEvent: function() {
            var _this = this;
            //跳转活动规则页面
            $('.invitesRule').on('tap',function () {
                var _that = $(this);
                GHUTILS.OPENPAGE({
                    url: "activity_invites_rule.html",
                    extras: {
                        isFinish: '0',
                        visitId: '2'
                    }
                });
            });
            //返回按钮
            $('.goBack').on('tap',function () {
                jumpMobil();
            });
            //分享到微信
            $('#wx_ShareBtn').on('tap',function () {
                _this.wxShareFn();
            });
            //分享到QQ好友
            $('#qq_ShareBtn').on('tap',function () {
                _this.qqShareFn();
            });
            //分享到朋友圈
            $('#wxP_ShareBtn').on('tap',function () {
                _this.wxPShareFn();
            });
            //分享到QQ空间
            $('#qqP_ShareBtn').on('tap',function () {
                _this.qqPShareFn();
            });
        },
        wxShareFn: function () {
            var _this = this;
            // var shareDate_ios = {
            //     'shareLink': window.location.href + '&closeHeader=closeHeader',
            //     'shareImgUrl': shareImgUrl,
            //     'articleId': getRequestParam('articleId') || articleId,
            //     'familyId': getRequestParam('familyId')  || familyId,
            //     'shareArticletitle': shareArticletitle,
            //     'favorited': favorited
            // };
            // var shareDate = JSON.stringify(shareDate_ios);
            if(window.webkit){
                window.webkit.messageHandlers.appWxShareFn.postMessage("");
            }else if(window.jsObj){
                window.jsObj.appWxShareFn();
            }
        },
        qqShareFn: function () {
            var _this = this;
            if(window.webkit){
                window.webkit.messageHandlers.appQqShareFn.postMessage("");
            }else if(window.jsObj){
                window.jsObj.appQqShareFn();
            }
        },
        wxPShareFn: function () {
            var _this = this;
            if(window.webkit){
                window.webkit.messageHandlers.appWxpShareFn.postMessage("");
            }else if(window.jsObj){
                window.jsObj.appWxpShareFn();
            }
        },
        qqPShareFn: function () {
            var _this = this;
            if(window.webkit){
                window.webkit.messageHandlers.appQqpShareFn.postMessage("");
            }else if(window.jsObj){
                window.jsObj.appQqpShareFn();
            }
        }
    };
    $(function(){
        var ptn = new LENDCOMPILULIST();
        ptn.init();
    });
})(Zepto);
//(jQuery)