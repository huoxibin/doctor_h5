(function ($) {
    var LENDCOMPILULIST = function () {
        this.isFinish = decodeURI(getRequestParam('isFinish')) || null; //是否完成
        this.visitId = decodeURI(getRequestParam('visitId')) || null; //任务ID
        // this.isFinish = 0;
        // this.visitId = 69;
        this.memberId = '';
        this.name = ''; //姓名
        this.startTime = ''; //随访日期
        this.visitType = ''; //随访方式
    };
    LENDCOMPILULIST.prototype = {
        init: function () {
            //this.pageInit(); //页面初始化
            //this.initDom();
            this.bindEvent();
            this.recordList();
        },
        pageInit: function () {
            var _this = this;
            //选择日期时间
        },
        initDom: function () { //产品列表渲染方法
            var _this = this;
        },
        recordList: function () { //获取随访纪律列表
            var _this = this;
            var YData = {
                'pathL': "/doctor/patientVisitRecord/getRecordList",
                'accessToken': token,
                'visitId': _this.visitId, //任务id
                'isFinish': _this.isFinish //是否完成0.未完成，1.已完成
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
                        console.log(res);
                        _this.name = res.data.name;
                        _this.startTime = encodeURIComponent(res.data.startTime);
                        // console.log(_this.startTime);
                        _this.visitType = res.data.visitType;
                        _this.memberId = res.data.memberId;
                        var recordList = res.data.recordList;
                        // console.log(recordList);
                        var disableArr = []; //定义数组储存列表的 isFinish
                        var _html = '';
                        for (var i = 0; i < recordList.length; i++) {
                            disableArr.push(recordList[i].isFinish);
                            if (_this.isFinish == '0') {
                                if (recordList[i].isFinish == '1') {
                                    _html += '<div class="test_type arrow_huo h_isFinish" recordId=' + recordList[i].recordId +
                                        ' saveType=' + recordList[i].type + '>' + recordList[i].name + '</div>'
                                } else {
                                    _html += '<div class="test_type arrow_huo" recordId=' + recordList[i].recordId +
                                        ' saveType=' + recordList[i].type + '>' + recordList[i].name + '</div>'
                                }
                            } else {
                                if (recordList[i].isFinish == '1') {
                                    _html += '<div class="test_type done arrow_huo h_isFinish" recordId=' + recordList[
                                        i].recordId + ' saveType=' + recordList[i].type + '>' + recordList[i].name + '</div>'
                                } else {
                                    _html += '<div class="test_type done arrow_huo" recordId=' + recordList[i].recordId +
                                        ' saveType=' + recordList[i].type + '>' + recordList[i].name + '</div>'
                                }
                            }
                            $('.test_type_box').html(_html);
                        };
                        disableArr.filter(function (item) {
                            if (item == '1'){
                                $('.btn').removeClass('disabled');
                            }
                        });
                    }
                },
                error: function (res) {
                    showalert(0, '请求失败', 2);
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            //点击用户随访列表  跳转 不同页面
            $(document).on('tap', '.test_type', function () {
                var _that = $(this);
                if (_that.hasClass('done')) {
                    if (_that.attr('recordId') != null) {
                        GHUTILS.OPENPAGE({
                            url: "trackPlan_record_detail.html", //预览表单
                            extras: {
                                'saveType': _that.attr('saveType'),
                                'formName': _that.html(),
                                'name': _this.name,
                                'startTime': _this.startTime,
                                'visitType': _this.visitType,
                                'isFinish': _this.isFinish, //是否完成
                                'visitId': _this.visitId, //任务ID
                                'memberId': _this.memberId, //患者ID
                                'recordId': _that.attr('recordId') //随访历史详情
                            }
                        });
                    } else {
                        showalert1(2, '该记录表未保存过', 2)
                    }
                } else {
                    GHUTILS.OPENPAGE({
                        url: "trackTask_detail.html", //填写表单
                        extras: {
                            'saveType': _that.attr('saveType'),
                            'formName': _that.html(),
                            'name': _this.name,
                            'startTime': _this.startTime,
                            'visitType': _this.visitType,
                            'isFinish': _this.isFinish, //是否完成
                            'visitId': _this.visitId, //任务ID
                            'memberId': _this.memberId, //患者ID
                            'recordId': _that.attr('recordId') //随访历史详情
                        }
                    });
                }
            });

            //确定按钮
            $("#form_hypertension_btn").on('tap', function () {
                if ($(this).hasClass('disabled')) {
                    return
                }else{
                    $('.Htc_box, .Htc').removeClass('hide');
                    $('.Htc_disease').css({
                        'bottom': '300px'
                    });
                }
            });
            // 弹框 取消按钮
            $('.Hcancel').on('tap', function () {
                $('.Htc_box, .Htc').addClass('hide');
                $('.Htc_disease').css({
                    'bottom': '-300px'
                });
            });
            // 弹框 确定按钮
            $('.Hset').on('tap', function () {
                var YData = {
                    'pathL': "/doctor/patientVisitInfo/finishVisitInfo",
                    'accessToken': token,
                    'visitId': _this.visitId
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
                            $('.Htc_box, .Htc').addClass('hide');
                            $('.Htc_disease').css({
                                'bottom': '-300px'
                            });
                            jumpMobil();
                        }
                    },
                    error: function (res) {
                        showalert(0, '请求失败', 2);
                    }
                });
            });

            //返回上一界面
            $('.infoDetail_btn').on('tap', function () {
                jumpMobil(); //返回app随访计划页面
            });
        }
    };
    $(function () {
        var ptn = new LENDCOMPILULIST();
        ptn.init();
    });
})(jQuery);