(function($){
    _czc.push(["Show_SharePage_My", "邀请好友", "有列表", "on"]);
    var LENDCOMPILULIST = function(){
        this.doctorId = getRequestParam('doctorId') ? getRequestParam('doctorId') : '100004';
    }
    LENDCOMPILULIST.prototype = {
        init:function(){
            this.pageInit(); //好友列表
            this.initDom();  //唤醒好友列表
            this.bindEvent();
            this.ishasActivity();
        },
        ishasActivity:function(){ //查看是否有红包活动
            var _this = this;
            var Title = {
                'pathL':"/doctor/activityInfo/activityValid",
                'activityTag': 'doctor_invite_get_packet'
            }
            Ajax({
                url:servUrl,
                data:Title,
                async: false,
                beforeSend: function(){},
                type : 'get',
                dataType : "json",
                success:function(res){
                    if(res.state == 0 && res.data.valid == false){
                        $('.invitesBanner').addClass('noActivity');
                        $('.bannerTxt').removeClass('hide');
                        $('.invitesRule').addClass('hide');
                        $('.invitesCon').css('padding-top',0);
                    }else{
                        //showalert(0,res.msg,2);
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
        },
        pageInit:function(){ //好友列表
            var _this = this;
            var Title = {
                'pathL':"/doctor/doctorInfo/getCheckedDoctorInfo",
                'doctorId': _this.doctorId
            }
            Ajax({
                url:servUrl,
                data:Title,
                async: false,
                beforeSend: function(){},
                type : 'get',
                dataType : "json",
                success:function(res){
                    var data = res.data;
                    var _html = '';
                    if(res.state == 0){
                        if(data.length != 0){
                            for(var i=0;i<data.length;i++){
                                _html += '<dl class="wrap clearfix">'
                                    + '<dd><div class="listName">' + data[i].name + '</div>'
                                    + '<div class="listPhone">' + data[i].mobile + '</div></dd>'
                                    + '</dl>'
                            }
                        }else{
                            _html = '<div class="noFriend"><img src="../images/noFriend.png"><p>一个好友都没有哦！</p></div>'
                        }
                        $('.friendList').html(_html)
                    }else{
                        showalert(0,res.msg,2);
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
        },
        initDom:function(){ //唤醒好友列表
            var _this = this;
            var  remindIds_str= getCookieValue('remindIds');
            var Title = {
                'pathL':"/doctor/doctorInfo/getUncheckedDoctorInfo",
                'doctorId': _this.doctorId
            }
            Ajax({
                url:servUrl,
                data:Title,
                async: false,
                beforeSend: function(){},
                type : 'get',
                dataType : "json",
                success:function(res){
                    var data = res.data;
                    var _html = '';
                    if(res.state == 0){
                        if(data.length != 0){
                            for(var i=0;i<data.length;i++){
                              var active = remindIds_str.indexOf(data[i].doctorId) == -1 ? '': 'active',
                                  activeTxt = remindIds_str.indexOf(data[i].doctorId) == -1 ? '去提醒': '已提醒';
                                _html += '<dl class="wrap clearfix" doctorId="' + data[i].doctorId + '">'
                                    + '<dd><div class="listName">' + data[i].name + '</div>'
                                    + '<div class="listPhone">' + data[i].mobile + '</div></dd>'
                                    + '<dt class="clearfix"><div class="invitesBtn ' + active + '">'+ activeTxt +'</div></dt>'
                                    + '</dl>'
                            }
                        }else{
                            _html = '<div class="noFriend"><img src="../images/noFriend.png"><p>一个好友都没有哦！</p></div>'
                        }
                        $('.invitesList').html(_html);
                    }else{
                        showalert(0,res.msg,2);
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
        },
        bindEvent: function() {
            var _this = this;
            //随访计划 随访任务选项卡切换
            $('.nav li').on('tap', function () {
                var _index = $(this).index();
                $('.nav li').removeClass('active');
                $(this).addClass('active')
                $('.navBox').addClass('hide');
                $('.navBox').eq(_index).removeClass('hide')
            });
            //跳转活动详情页面
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
            //去提醒
            $(document).on('tap','.wrap .invitesBtn',function () {
                var _this_ = $(this),
                    doctorId = _this_.parents('.wrap').attr('doctorId'),
                    remindIds_str = getCookieValue('remindIds') + doctorId;
                _czc.push(["Click_Remind_WakeupFriend", "邀请好友", "去提醒", "", "on"]);
                if(_this_.hasClass('active')){
                    return
                }else{
                    var Title = {
                        'pathL':"/doctor/doctorInfo/remindInvitee",
                        'doctorId': _this.doctorId,
                        'inviteeDoctorId': doctorId
                    }
                    Ajax({
                        url:servUrl,
                        data:Title,
                        async: false,
                        beforeSend: function(){},
                        type : 'post',
                        dataType : "json",
                        success:function(res){
                            if(res.state == 0){
                                invites_setCookie('remindIds',remindIds_str,1);
                                _this_.addClass('active').html('已提醒');
                            }else{
                                showalert(0,res.msg,2);
                            }
                        },
                        error:function(res){
                            showalert(0,'请求失败',2);
                        }
                    });
                }
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
function invites_setCookie(name,value,day) {
    var _name = escape(name),
        value = escape(value),
        expires = new Date();
    expires.setDate(expires.getDate() + day);
    document.cookie = _name + '=' + value + ';expires=' + expires + ';path=/';
}