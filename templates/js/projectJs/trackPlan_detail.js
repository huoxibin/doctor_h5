(function($){
	var LENDCOMPILULIST = function(){
        this.visitType = '2';
        this.memberId = getRequestParam('memberId') || null;
        this.signInfoId = getRequestParam('signInfoId') || null;
        this.headImg = getRequestParam('headImg')?getRequestParam('headImg'):'../../images/JpatientD.png';
        this.sex = decodeURI(getRequestParam('sex')) || null;
        this.familyId = decodeURI(getRequestParam('familyId')) || null;
        this.name = decodeURI(getRequestParam('name')) || null;
        this.illness = decodeURI(getRequestParam('illness')) || null;
        this.age = getRequestParam('age') || null;
        this.back_plan = getRequestParam('back_plan') || null;
        this.doctorName = getRequestParam('doctorName') || null;
        this.state = 0;
        this.visitTxt = [
            // {
            //     "name": "线上随访 — 图文",
            //     "value": "1"
            // },
            {
                "name": "线上随访 — 语音",
                "value": "2"
            },
            {
                "name": "线上随访 — 视频",
                "value": "3"
            },
            {
                "name": "线下随访",
                "value": "4"
            }
        ];
    }
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit(); //初始化用户信息
			this.initDom();
            this.bindEvent();
			this.dataTime()
		},
		pageInit:function(){
            var _this = this;
            $('#test_default').val(_this.getDate());
            $('.customer_name').html(_this.name);
            $('.customer_age').html(_this.age + ' 岁');
            $('.listImg_detail img').attr({src: _this.headImg});
            $('.listInfo_bot').html(_this.illness);
            $('.sex').removeClass('customer_female,customer_male').addClass(function () {
                if(_this.sex == '女'){
                    return 'customer_female'
                }else{
                    return 'customer_male'
                }
            });
        },
        getDate:function (){
            var _this = this;
            var date = new Date(),
                years = date.getFullYear(),
                month = parseInt(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) :  date.getMonth() + 1,
                day =parseInt(date.getDate()) < 10 ? '0' + date.getDate() : date.getDate(),
                hours = date.getHours(),
                minutes = _this.toDouble(date.getMinutes()),
                seconds = _this.toDouble(date.getSeconds()),
                uploadTime  = years + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
            return uploadTime
        },
        toDouble: function (n){
            if(n<10){
                return '0' + n
            }else{
                return n
            }
        },
        dataTime:function (){
            var now = new Date();
            var currYear = now.getFullYear();
            var currMonth = now.getMonth() + 1;
            var currDay = now.getDate();
            var opt = {}
            opt.date = {preset : 'date'};
            opt.time = {preset : 'time'};
            opt.tree_list = {preset : 'list', labels: ['Region', 'Country', 'City']};
            opt.image_text = {preset : 'list', labels: ['Cars']};
            opt.select = {preset : 'select'};
            opt.datetime = { preset : 'datetime' };
            opt.default = {
                theme: 'android-ics light', //皮肤样式
                display: 'bottom', //显示方式 ：modal（正中央）  bottom（底部）
                mode: 'scroller', //日期选择模式
                lang: 'zh',
                dateFormat: 'yyyy-mm-dd',
                showNow: true,
                nowText: "今天",
                stepMinute: 5,
                //startYear: currYear - 1990, //开始年份currYear-5不起作用的原因是加了minDate: new Date()
                //endYear: currYear + 2000, //结束年份
                maxDate: new Date(currYear + 2000, currMonth - 1, currDay),
                minDate: new Date(currYear - 1990, currMonth - 1, currDay) //加上这句话会导致startYear:currYear-5失效，去掉就可以激活startYear:currYear-5,
            };
            $('#test_default').mobiscroll($.extend(opt['datetime'], opt['default']));
        },
		initDom:function(){ //产品列表渲染方法
			var _this = this;																					
		},
		bindEvent: function() {
			var _this = this;
            //筛选弹框
            // $('#test_type').on('tap', function () {
            //     $('.tc_box, .tc').removeClass('hide');
            //     $('.tc_disease').animate({bottom:"0px"});
            // });
            // $('.test_type_box .test_type').on('tap', function () {
            //     _this.visitType = $(this).attr('visitType')
            //     $('.test_type_box .test_type').removeClass('acColor');
            //     $(this).addClass('acColor');
            //     $('#test_type').html($(this).html());
            // });
            //确定
            // $('.set').on('tap', function () {
            //     $('.tc_disease').animate({bottom:"-300px"}, function () {
            //         $('.tc_box, .tc').addClass('hide');
            //     });
            // });
            //取消
            // $('.cancel').on('tap', function () {
            //     $('.tc_disease').animate({bottom:"-300px"}, function () {
            //         $('.tc_box, .tc').addClass('hide');
            //     });
            // });
            //返回上一界面
            $('.infoDetail_btn').on('tap',function () {
               jumpMobil(); //返回app随访计划页面
            });

            //保存随访计划
            function saveTrackplan(formData,startTime) {
                var YData={
                    'pathL':"/doctor/patientVisitInfo/save",
                    'accessToken':token,
                    'memberId': _this.memberId || null,
                    'startTime': startTime,
                    'visitType': _this.visitType || null,
                    'comments': formData,
                    'isFinish': 0,
                    'familyId':_this.familyId || null
                };
                Ajax({
                    url:servUrl,
                    data:YData,
                    async: false,
                    beforeSend: function(){},
                    type : 'post',
                    dataType : "json",
                    success:function(res){
                        if(res.state == 0){
                            if(_this.back_plan == 'back_plan'){
                                jumpMobil(); //返回app随访计划页面
                            }else{
                                GHUTILS.OPENPAGE({ //返回h5随访计划页面
                                   url: "trackPlan.html"
                                });
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
            $('.saveTrackplan').on('tap',function () {
                var formData = $('#noticeTxt').val(),
                    startTime = $('#test_default').val()+':00';
                saveTrackplan(formData, startTime)
            });
            //跳转到患者详情页面
            $('.trackPlan_list').on('tap',function () {
                GHUTILS.OPENPAGE({
                    url: "J_signPDetail.html",
                    extras: {
                        'memberId': _this.memberId,
                        'signInfoId': _this.signInfoId,
                        'doctorName': _this.doctorName,
                        'state': _this.state
                    }
                });
            });
            //随访方式--滚动
            var method2=$('.select-value2').mPicker({
                level:1,
                dataJson: _this.visitTxt,
                rows:5,
                Linkage:false,
                header:'<div class="mPicker-header">非联动选择插件</div>',
                idDefault:true,
                confirm:function(json){
                    // console.info('当前选中json：', json);
                    // console.log(json.values);
                    _this.visitType = json.values
                }
            })
		}
	};	
	$(function(){
		var ptn = new LENDCOMPILULIST();
			ptn.init();
	});
})(jQuery);
