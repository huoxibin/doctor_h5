(function($){
    GHUTILS.eChange.COM();
	var LENDCOMPILULIST = function(){
        this.infoId = getRequestParam('infoId') || null;
        // this.doctorId = '222',
        this.provinceId = getRequestParam('provinceId') ? getRequestParam('provinceId') : '0';
        this.cityId = getRequestParam('cityId') ? getRequestParam('cityId')  : '';
        this.countyId = '';
        this.provinceName = '';
        this.cityName = '';
        this.countyName = '';

        this.customer_name = getRequestParam('name') ? getRequestParam('name') : '';
        this.customer_sex = getRequestParam('sex') ? getRequestParam('sex') : '';
        this.customer_age = getRequestParam('age') ? getRequestParam('age') : '';
        this.customer_mobile = getRequestParam('mobile') ? getRequestParam('mobile') : '';
        this.customer_location = getRequestParam('location') ? getRequestParam('location') : '';
        this.customer_diseaseHistory = getRequestParam('diseaseHistory') ? getRequestParam('diseaseHistory') : '';
        this.customer_cureHistory = getRequestParam('cureHistory') ? getRequestParam('cureHistory') : '';

    }
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit(); //处理输入框
			// this.initDom();
            this.bindEvent();
            this.initAreaList(); //获取地区列表
		},
		pageInit:function(){
            var _this = this;

            $('#nameVal').val(decodeURI(_this.customer_name));
            $('#sexVal').val(decodeURI(_this.customer_sex));
            $('#ageVal').val(_this.customer_age);
            $('#telVal').val(_this.customer_mobile);
            $('#local div').html(decodeURI(_this.customer_location));
            $('#diseaseHistoryVal').val(decodeURI(_this.customer_diseaseHistory));
            $('#cureHistoryVal').val(decodeURI(_this.customer_cureHistory));
        },
		initDom:function(name, sex, age, mobile, diseaseHistory, cureHistory){ //招幕患者报名
            var _this = this;
            var YData = {
                'pathL':"/doctor/recruitPatient/add",
                'name': name,
                'sex': sex,
                'age': age,
                'mobile': mobile,
                'provinceId': _this.provinceId,
                'cityId': _this.cityId,
                'diseaseHistory': diseaseHistory,
                'cureHistory': cureHistory,
                'infoId': _this.infoId,
                // 'doctorId': _this.doctorId,
                'accessToken': token
            }
            Ajax({
                url:servUrl,
                data:YData,
                async: false,
                beforeSend: function(){},
                type : 'POST',
                dataType : "json",
                success:function(res){
                    if(res.state == 0){
                        if(res.data.questionUrl != '' && res.data.questionUrl != undefined){
                            GHUTILS.PopBoxFunc.OpenPopBox('<div class="img recruit_icon"></div><p>报名已提交，请完成问卷</p>',{tit:'',btns:false,ClassName:"submit_box"});
                            sessionStorage.setItem('src',res.data.questionUrl);
                            clearTimeout(timer);
                            if(window.webkit){
                                var timer = setTimeout(function () {
                                    var questionnaire_ios = {
                                        'questionnaire': res.data.questionUrl
                                    };
                                    var questionnaireData = JSON.stringify(questionnaire_ios);
                                    //关闭弹窗
                                    GHUTILS.PopBoxFunc.ClosePopBox();
                                    if(window.webkit){
                                        window.webkit.messageHandlers.questionnaireFn.postMessage(questionnaireData);
                                    }
                                },2000)
                            }else if(window.jsObj){
                                var timer = setTimeout(function () {
                                    //关闭弹窗
                                    GHUTILS.PopBoxFunc.ClosePopBox();
                                    GHUTILS.OPENPAGE({
                                        url: 'recruit_questionnaire.html',
                                        extras: {
                                            'src': encodeURI(res.data.questionUrl)
                                        }
                                    });
                                },2000)
                            }
                        }else{
                            //打开弹窗
                            GHUTILS.PopBoxFunc.OpenPopBox('<div class="img recruit_icon"></div><p>报名成功，感谢参与</p>',{tit:'',btns:false,ClassName:"submit_box"});
                            clearTimeout(timer)
                            var timer = setTimeout(function () {
                                //关闭弹窗
                                GHUTILS.PopBoxFunc.ClosePopBox();
                                //报名成功后返回列表
                                jumpMobil();
                            },2000)
                        }
                    }else{
                        showalert(0, res.msg, 2);
                    }
                },
                error:function(res){
                    showalert(0, '请求失败', 2);
                }
            });
		},
        initAreaList:function(id){ //获取省市区地区列表
            var _this = this;
            var YData = {
                'pathL':"/common/area/findAreaList",
                //'accessToken':token,
                'provinceId': '0'
            }
            Ajax({
                url:servUrl,
                data:YData,
                async: false,
                beforeSend: function(){},
                type : 'get',
                dataType : "json",
                success:function(res){
                    var data = res.data;
                    if(res.state == 0){
                        //console.log(res.data)
                        var _html = '';
                        for(var i=0;i<data.length;i++){
                            _html += '<div id="' + data[i].id + '">' + data[i].name + '</div>'
                        }
                        $('.city_1').html(_html);
                    }else{
                        showError(res.msg);
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
        },
		bindEvent: function() {
			var _this = this;

			//选择患者的性别
			$('#sexVal').on('tap', function () {
                GHUTILS.PopBoxFunc.OpenPopBox('<p>女</p><p>男</p>',{tit:'请选择性别',btns:false,ClassName:"sex_box"});
			});
            $(document).on('touchend', '.sex_box p', function () { //使用touchend 解决选中input输入框问题
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).addClass('active');
                    $('#sexVal').val($(this).html());
                    GHUTILS.PopBoxFunc.ClosePopBox();
            });
			//选择地区
            $('#local').on('tap', function () {
                $('.tc_box, .tc, .cityBox').removeClass('hide');
                $('.cityBox').animate({bottom: 0},"easein");
            });
            $('.closeTc_Pr').on('tap', function () {
                $('.tc_box, .tc, .cityBox').addClass('hide');
                $('.cityBox').animate({bottom: '-17.82rem'},"easein");
                _this.initTc()
            });
            //选择省份 => 获取对应市的列表
            $(document).on('tap', '.city_1 div', function () {
                $('.city_3').empty();
                $('#city_span').html('').addClass('hide');
                $('.cityBox_inner li').addClass('hide');
                $('.cityBox_inner li').eq(1).removeClass('hide');
                _this.provinceId = $(this).attr('id');
                _this.provinceName = $(this).text();
                $('#province_span').removeClass('hide active').html($(this).html());
                if(!$('#province_span').hasClass('hide')){
                    $('#area_span').addClass('active')
                }
                var YData = {
                    'pathL':"/common/area/findAreaList",
                    //'accessToken':token,
                    'provinceId': _this.provinceId
                }
                Ajax({
                    url:servUrl,
                    data:YData,
                    async: false,
                    beforeSend: function(){},
                    type : 'get',
                    dataType : "json",
                    success:function(res){
                        var data = res.data;
                        if(res.state == 0){
                            //console.log(res.data)
                            var _html = '';
                            for(var i=0;i<data.length;i++){
                                _html += '<div id="' + data[i].id + '">' + data[i].name + '</div>'
                            }
                            $('.city_2').html(_html)
                        }else{
                            showError(res.msg);
                        }
                    },
                    error:function(res){
                        showalert(0,'请求失败',2);
                    }
                });
            });
            //点击市份获取市对应的区级列表
            $(document).on('tap','.city_2 div',function () {  //this.areaId = '';
                _this.cityId = $(this).attr('id');
                _this.cityName = $(this).text();
                $('#city_span').removeClass('hide').html($(this).html());
                $('.cityBox_inner li').addClass('hide');
                $('.cityBox_inner li').eq(2).removeClass('hide');
                if($('#city_span').hasClass('active')){
                    $('#city_span').removeClass('active');
                    $('#area_span').addClass('active')
                }
                var _id = $(this).attr('id');
                var YData = {
                    'pathL':"/common/area/findAreaList",
                    //'accessToken':token,
                    'cityId': _this.cityId
                }
                Ajax({
                    url:servUrl,
                    data:YData,
                    async: false,
                    beforeSend: function(){},
                    type : 'get',
                    dataType : "json",
                    success:function(res){
                        var data = res.data;
                        if(res.state == 0){
                            //console.log(res.data)
                            var _html = '';
                            for(var i=0;i<data.length;i++){
                                _html += '<div id="' + data[i].id + '">' + data[i].name + '</div>'
                            }
                            $('.city_3').html(_html);
                        }else{
                            showError(res.msg);
                        }
                    },
                    error:function(res){
                        showalert(0,'请求失败',2);
                    }
                });
            });

            $(document).on('tap','.city_3 div',function () {
                _this.countyId = $(this).attr('id');
                _this.countyName = $(this).text();
                $('#local div').html(_this.provinceName +  _this.cityName +  _this.countyName);
                var _height = '-' + $('.cityBox').css('height');
                $('#area_span').removeClass('hide').addClass('active');
                $('.cityBox').animate({bottom: _height}, function () {
                    $('.tc_box, .tc').addClass('hide');
                    $(this).addClass('hide');
                    _this.initTc();
                });
            });

            $('.choosed_info span').on('tap',function () {
                var _index = $(this).index();
                if(_index == 2){
                    return
                }else if(_index == 1){
                    $('.choosed_info span').removeClass('active');
                    $(this).addClass('active');
                    $('.cityBox_inner li').addClass('hide');
                    $('.cityBox_inner li').eq(_index).removeClass('hide');
                }else{
                    // $('.choosed_info span').removeClass('active');
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.choosed_info span').eq(1).addClass('hide');
                    $('.cityBox_inner li').addClass('hide');
                    $('.cityBox_inner li').eq(_index).removeClass('hide');
                }
            });
            //提交
            $('.submit-btn').on('tap', function () {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

                var namestr = $('#nameVal').val(),
                    sex = $('#sexVal').val() == '男' ? 1 : 2,
                    age = $('#ageVal').val(),
                    mobile = $('#telVal').val(),
                    diseaseHistory = $('#diseaseHistoryVal').val(),
                    cureHistory = $('#cureHistoryVal').val();

                var nameVal = $('#nameVal').val(),
                    sexVal = $('#sexVal').val(),
                    ageVal = $('#ageVal').val(),
                    telVal = $('#telVal').val(),
                    location = $('#local div').html(),
                    diseaseHistoryVal = $('#diseaseHistoryVal').val(),
                    cureHistoryVal = $('#cureHistoryVal').val();

                if($(this).hasClass('disabled')){
                    return
                }else if(nameVal == '' || sexVal == '' || ageVal == '' || telVal == '' || location == '' || diseaseHistoryVal == '' || cureHistoryVal == ''){
                    showalert(1, '请完善报名信息', 2)
                }else if(!myreg.test(telVal)){   //
                    showalert(1, '请输入正确的手机号', 2)
                }else{
                    _this.initDom(namestr, sex, age, mobile, diseaseHistory, cureHistory);
                }
            });
            //知情同意书
            $('.recruit_icon').on('tap',function () {
                if(!$(this).hasClass('active')){
                    $(this).addClass('active');
                    $('.submit-btn').removeClass('disabled');
                }else{
                    $(this).removeClass('active');
                    $('.submit-btn').addClass('disabled');
                }
            });
			$('.join-agreement span').on('tap', function () {
                var nameVal = $('#nameVal').val(),
                    sexVal = $('#sexVal').val(),
                    ageVal = $('#ageVal').val(),
                    telVal = $('#telVal').val(),
                    location = $('#local div').html(),
                    diseaseHistoryVal = $('#diseaseHistoryVal').val(),
                    cureHistoryVal = $('#cureHistoryVal').val();

                GHUTILS.OPENPAGE({ //返回h5随访计划页面
                    url: "recruit_join_rule.html",
                    extras: {
                        "name": nameVal,
                        "sex": sexVal,
                        "age": ageVal,
                        "mobile": telVal,
                        "location": location,
                        "provinceId": _this.provinceId,
                        "cityId": _this.cityId,
                        "diseaseHistory": diseaseHistoryVal,
                        "cureHistory": cureHistoryVal,
                        "infoId": _this.infoId
                    }
                });
            });
            //招募加入页面返回到招募详情页
            $('#recruitBg_back').on('tap', function () {
                GHUTILS.OPENPAGE({
                    url: "recruit.html",
                    extras: {
                        id: _this.infoId
                    }
                });
            });
            //手机号验证
            $('#telVal').on('blur', function () {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/,
                    str = $(this).val().trim();

                if (!myreg.test(str)) {
                    showalert(1, '请输入正确的手机号', 2);
                    // $(this).val('')
                }
            });
		},
        initTc: function (){ //初始化弹窗
            $('.choosed_info span').not('.choosed_info span:last-child').empty().addClass('hide');
            $('.cityBox_inner li').eq(0).removeClass('hide').nextAll().empty().addClass('hide');
        }
	};	
	$(function(){
		var ptn = new LENDCOMPILULIST();
			ptn.init();
	});
})(jQuery);
//(Zepto)