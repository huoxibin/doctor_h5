(function($){
    var LENDCOMPILULIST = function(){
        this.currentDaySigned = false; //当天是否签到
    }
    LENDCOMPILULIST.prototype = {
        init:function(){
            this.pageInit(); //初始化用户信息
            this.initDom();
            this.bindEvent();
        },
        pageInit:function(){
            var _this = this,
                myDate = new Date(),
                _years = myDate.getFullYear(),
                _month = myDate.getMonth() + 1,
                _day = myDate.getDate();
            // console.log(_years, _month)
            $('.sign-month').html(_month + '月');
            $('.select-value2').val(_years + '年' + ' ');
            this.createMonthDay(_years, _month, _day);
            // console.log(_years, _month, _day);

            //获取当前用户是否关闭签到提醒
            var YData = {
                'pathL': "/doctor/creditCheckIn/getUnsignFlagByDoctorId",
                'accessToken': token,
                // 'doctorId': '10800336'
                'doctorId': userId
            };
            Ajax({
                url: servUrl,
                data: YData,
                async: false,
                beforeSend: function () {},
                type: 'get',
                dataType: "json",
                success: function (res) {
                    if (res.state == 0) {
                        if(res.data.unsignTimerFlag == 0){
                            $('.switch').addClass('switch-animbg');
                        }else{
                            $('.switch').removeClass('switch-animbg');
                        }
                    } else {
                        showalert(0, res.msg, 2);
                    }
                },
                error: function (res) {
                    showalert(0, res, 2);
                }
            });
        },
        initDom:function(){
            var _this = this;
        },
        createMonthDay: function (y, m, d) {
            // console.log(y, m, d);
            var _this = this;
            var daysOfMonth = [];
            var lastDayOfMonth = new Date(y, m, 0).getDate();
            var month = m > 10 ? m : '0' + m;
            var anySignDate = y + '-' + month + '-01' ;
            var _html = '';
            var currentDay;
            var YData = {
                'pathL': "/doctor/creditCheckIn/getMonthSignList",
                'accessToken': token,
                'anySignDate': anySignDate,
                'doctorId': userId
                // 'doctorId': '10800336'
            };
            Ajax({
                url: servUrl,
                data: YData,
                async: false,
                beforeSend: function () {},
                type: 'get',
                dataType: "json",
                success: function (res) {
                    var data = res.data;
                    if (res.state == 0) {

                        //已签到数据
                        var signDateStr = [];
                        data.forEach(function (element, index) {
                            signDateStr.push(element.signDate.substr(8,2));
                        });
                        signDateStr = signDateStr.join('-');

                        //当天已经签到将签到按钮致灰
                        if(signDateStr.indexOf(d) > -1){
                            _this.currentDaySigned = true;
                            $('.sign-btn').addClass('disabled');
                        }

                        if(d){
                            for (var i = 1; i <= lastDayOfMonth; i++) {
                                currentDay = parseInt(d) == i ? 'currentDay' : '';
                                daysOfMonth.push(y + '-' + m + '-' + i);
                                var double_i = i>=10 ? i : '0' + i;
                                double_i = double_i.toString();
                                if(signDateStr.indexOf(double_i) > -1){
                                    _html += '<li class="able signed ' + currentDay + '"' + 'dateTime="' + y + '-' + m + '-' + i + '"><span>'
                                        + i + '</span><i>已签</i></li>'
                                }else{
                                    _html += '<li class="able ' + currentDay + '"' + 'dateTime="' + y + '-' + m + '-' + i + '"><span>'
                                        + i + '</span></li>'
                                }
                            };
                        }else{
                            for (var i = 1; i <= lastDayOfMonth; i++) {
                                // currentDay = parseInt(d) == i ? 'currentDay' : '';
                                daysOfMonth.push(y + '-' + m + '-' + i);
                                var double_i = i>=10 ? i : '0' + i;
                                double_i = double_i.toString();
                                if(signDateStr.indexOf(double_i) > -1){
                                    _html += '<li class="able signed ' + currentDay + '"' + 'dateTime="' + y + '-' + m + '-' + i + '"><span>'
                                        + i + '</span><i>已签</i></li>'
                                }else{
                                    _html += '<li class="able ' + currentDay + '"' + 'dateTime="' + y + '-' + m + '-' + i + '"><span>'
                                        + i + '</span></li>'
                                }
                            };
                        }
                        var _terminalHtml = _this.oneDay(y, m, 1) + _html;
                        $('#body').html(_terminalHtml);
                    } else {
                        showalert(0, res.msg, 2);
                    }
                },
                error: function (res) {
                    showalert(0, res, 2);
                }
            });
            // return daysOfMonth;
        },
        oneDay: function (y,m,d) {
                var myDate=new Date();
                myDate.setFullYear(y,m-1,d);
                var week = myDate.getDay(); //获取当天具体是周几
                var _html_space = ''
                switch(week){
                    case 0: //周日
                        return _html_space = ''
                    case 1: //周一
                        return _html_space = '<li></li>'
                    case 2: //周二
                        return _html_space = '<li></li><li></li>'
                    case 3: //周三
                        return _html_space = '<li></li><li></li><li></li>'
                    case 4: //周四
                        return _html_space = '<li></li><li></li><li></li><li></li>'
                    case 5: //周五
                        return _html_space = '<li></li><li></li><li></li><li></li><li></li>'
                    case 6: //周六
                        return _html_space = '<li></li><li></li><li></li><li></li><li></li><li></li>'
                }
        },
        bindEvent: function() {
            var _this = this,
                myDate = new Date(),
                _month = myDate.getMonth() + 1, //当前月份
                _day = myDate.getDate(); // 当前日期
            var method2=$('.select-value2').mPicker({
                level:2,
                dataJson:yearsData,
                rows:5,
                Linkage:false,
                header:'<div class="mPicker-header">非联动选择插件</div>',
                idDefault:true,
                valueSpace:true, // 两级联动插件  true-> 保留第一个选中值  false-> 两个选中的值都保留
                confirm:function(json){
                    // console.log(json)
                    var _yearsStr = json.values.substr(0, 4);
                    var _monthStr = json.values.substr(6).replace(/[\u4e00-\u9fa5]/g,"");
                    $('.sign-month').html(_monthStr + '月');
                    if(_month == _monthStr){

                        // 切换到当前月份将签到按钮显示
                        $('.sign-btn').removeClass('hide');

                        //当前月份当天未签到 将按钮致为可点击状态
                        if(!_this.currentDaySigned){
                           $('.sign-btn').removeClass('disabled');
                        }

                        _this.createMonthDay(_yearsStr, _monthStr, _day);
                    }else{
                        _this.createMonthDay(_yearsStr, _monthStr);

                        // 切换到非当前月份将签到按钮隐藏
                        $('.sign-btn').addClass('hide');
                    }
                }
            });
            //点击日历中具体某一天签到Fn
            $(document).on('tap', '.able', function () {
                var _that = $(this),
                    myDate = new Date(),
                    _years = myDate.getFullYear(),
                    _month = myDate.getMonth() + 1,
                    _day = myDate.getDate(),
                    dateStr = _years + '-' + _month + '-' +_day;
                var _dateStr = _that.attr('datetime');
                // console.log(typeof(dateStr), typeof(_dateStr));
                //获取签到信息
                if(dateStr === _dateStr && !_that.hasClass('signed')){
                    var YData = {
                        'pathL': "/doctor/creditCheckIn/checkIn",
                        'accessToken': token
                    };
                    Ajax({
                        url: servUrl,
                        data: YData,
                        async: false,
                        beforeSend: function () {},
                        type: 'post',
                        dataType: "json",
                        success: function (res) {
                            if (res.state == 0) {
                                var date = res.data;
                                $('.sign-btn').addClass('disabled');
                                _that.addClass('signed');
                                _that.append('<i>已签</i>');
                                if(date.notes.match('今日签到成功')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_1');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_1').html('+' + date.earnTaskPoint + ' 成长值');
                                }else if(date.notes.match('已连续签到')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_5');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_5').html('+' + date.earnTaskPoint + ' 成长值');
                                }else if(date.notes.match('连续签到满')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_30');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_30').html('+' + date.earnTaskPoint + ' 成长值');
                                }
                            } else {
                                showalert(0, res.msg, 2);
                            }
                        },
                        error: function (res) {
                            showalert(0, res, 2);
                        }
                    });
                }
            });
            //点击签到按钮Fn
            $(document).on('tap', '.sign-btn', function () {
                var _that = $(this);
                //获取签到信息
                if(!_that.hasClass('disabled')){
                    var YData = {
                        'pathL': "/doctor/creditCheckIn/checkIn",
                        'accessToken': token
                    };
                    Ajax({
                        url: servUrl,
                        data: YData,
                        async: false,
                        beforeSend: function () {},
                        type: 'post',
                        dataType: "json",
                        success: function (res) {
                            if (res.state == 0) {
                                var date = res.data
                                _that.addClass('disabled');
                                $('.currentDay').addClass('signed').append('<i>已签</i>');
                                if(date.notes.match('今日签到成功')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_1');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_1').html('+' + date.earnTaskPoint + ' 成长值');
                                }else if(date.notes.match('已连续签到')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_5');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_5').html('+' + date.earnTaskPoint + ' 成长值');
                                }else if(date.notes.match('连续签到满')){
                                    $('.tc_box, .tc').removeClass('hide');
                                    $('.sign-icon').addClass('sign-icon_30');
                                    $('.sign-txt').html(date.notes);
                                    $('.sign-point').addClass('sign-point_30').html('+' + date.earnTaskPoint + ' 成长值');
                                }
                            } else {
                                showalert(0, res.msg, 2);
                            }
                        },
                        error: function (res) {
                            showalert(0, res, 2);
                        }
                    });
                }
            });
            //关闭弹窗
            $('.close').on('tap', function () {
                $('.tc_box, .tc').addClass('hide');
            });
            //跳转到签到成长值规则
            $('.sign-rule').on('tap',function () {
                // GHUTILS.OPENPAGE({
                //     url: "signIn_everyDay_rule.html"
                // });
                if(window.webkit){
                    window.webkit.messageHandlers.viewSinginrule.postMessage('');
                }else if(window.jsObj){
                    window.jsObj.viewSinginrule();
                }
            });
            //开启或关闭提醒
            $('.remind-sign').on('tap', function () {
                var unsignTimerFlag = $('.switch').hasClass('switch-animbg') ? 1 : 0;
                console.log(unsignTimerFlag);
                var YData = {
                    'pathL': "/doctor/creditCheckIn/addOrRemoveUnsignJob",
                    'accessToken': token,
                    'unsignTimerFlag': unsignTimerFlag,
                    // 'doctorId': '10800336',
                    'doctorId': userId
                };
                Ajax({
                    url: servUrl,
                    data: YData,
                    async: false,
                    beforeSend: function () {},
                    type: 'post',
                    dataType: "json",
                    success: function (res) {
                        if (res.state == 0) {
                            console.log(res);
                            if(res.data.unsignTimerFlag == 0){
                                $('.switch').addClass('switch-animbg');
                                showalert(0, '已开启签到提醒消息', 2);
                            }else if(res.data.unsignTimerFlag == 1){
                                $('.switch').removeClass('switch-animbg');
                                showalert(0, '已关闭签到提醒消息', 2);
                            }
                        } else {
                            showalert(0, res.msg, 2);
                        }
                    },
                    error: function (res) {
                        showalert(0, res, 2);
                    }
                });
            });
        }
    };
    $(function(){
        var ptn = new LENDCOMPILULIST();
        ptn.init();
    });
})(jQuery);
