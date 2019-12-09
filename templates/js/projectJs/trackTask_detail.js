(function($){
    GHUTILS.eChange.COM();
	var LENDCOMPILULIST = function(){
        this.formName = decodeURI(getRequestParam('formName'));//表单名字
        this.saveType = getRequestParam('saveType');//1是糖尿病，2是高血压
        this.name = decodeURI(getRequestParam('name')) || null;//姓名
        this.startTime = decodeURIComponent(getRequestParam('startTime')) || null;//随访时间
        this.visitType = decodeURI(getRequestParam('visitType')) || null;//随访方式
        this.isFinish = decodeURI(getRequestParam('isFinish')) || null;//是否已完成
        this.recordId = decodeURI(getRequestParam('recordId')) || null;//用户随访recordId
        this.visitId = decodeURI(getRequestParam('visitId')) || null;//任务id
        this.memberId = decodeURI(getRequestParam('memberId')) || null;//患者id
    };
	LENDCOMPILULIST.prototype = {
		init:function(){
            this.pageInit(); //页面初始化
            this.initDom();
            this.bindEvent();
		},
		pageInit:function(){
            var _this = this;
            //选择不同的表单
            switch (_this.saveType){
                case '1':
                    $('.diabetes').removeClass('hide');
                    break;
                case '2':
                    $('.hypertension').removeClass('hide');
                    break;
            }
            $('.selectBox_show').text(_this.formName);
            $('.trackTask_user_left .name').text(_this.name);
            $('.trackTask_user_left .startTime').text(decodeURIComponent(_this.startTime));
            switch (_this.visitType){
                case '1':
                    $('.trackTask_user_left .visitType').text('图文');
                    $('.makePhone').addClass('makearticle');
                    break;
                case '2':
                    $('.trackTask_user_left .visitType').text('语音');
                    break;
                case '3':
                    $('.trackTask_user_left .visitType').text('视频');
                    $('.makePhone').addClass('makevedio');
                    break;
                case '4':
                    $('.trackTask_user_left .visitType').text('线下随访');
                    $('.makePhone').addClass('hide');
                    break;
            }
        },
        initDom:function(){ //产品列表渲染方法
            var _this = this;
            var YData={
                'pathL':"/doctor/patientVisitRecord/details",
                'accessToken':token,
                'recordId': (_this.recordId == null || _this.recordId == 'null') ? '0' : _this.recordId
            };
            Ajax({
                url:servUrl,
                data:YData,
                async: false,
                beforeSend: function(){},
                type : 'post',
                dataType : "json",
                success:function(res){
                    if(res.state==0){
                        var resData = res.data.recordInfo;
                        if(_this.saveType == 1){ //预览糖尿病表单
                            setForm_d(resData.arr_textVal,resData.arr_radioVal,resData.d_symptom_box,resData.arr_textarea_val);
                        }else{ //预览高血压表单
                            setForm_h(resData.arr_textVal,resData.arr_radioVal,resData.h_symptom_box,resData.arr_textarea_val);
                        }
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
            function setForm_h(textVal,radioVal,checkboxVal,textareaVal) {
                var arr_textObj = $('#form_hypertension input[type="text"]'),
                    arr_checkboxObj = $('#form_hypertension input[type="checkbox"]'),
                    arr_textareaObj = $('#form_hypertension textarea');
                //输入框
                for(var m=0; m<arr_textObj.length; m++){
                    for(var x in textVal){
                        if(arr_textObj[m].name == x){
                            $('input[name="'+ x +'"]').val(textVal[x]);
                        }
                    }
                }
                //单选按钮
                for(var x in radioVal){
                    for(var i=0;i< $('#form_hypertension input[name="' + x +'"]').length;i++){
                        //$('#form_hypertension input[name="' + x +'"]').eq(i).attr({disabled:'disabled'});
                        $('#form_hypertension input[name="' + x +'"]').eq(radioVal[x].substr(0,1)).attr({checked:'checked'});
                    }
                }
                //多选框
                arr_checkboxObj.each(function (index, element) {
                    if(checkboxVal.indexOf(element.value) != '-1'){
                        $('[id^="h_symptom_box"]').eq(index).attr({checked:'checked'});
                    }
                });
                //文本域
                arr_textareaObj.val(textareaVal);
            }
            function setForm_d(textVal,radioVal,checkboxVal,textareaVal) {
                var arr_checkboxObj = $('#form_diabetes input[type="checkbox"]'),
                    arr_textareaObj = $('#form_diabetes textarea'),
                    arr_textObj = $('#form_diabetes input[type="text"]');
                //输入框
                for(var m=0; m<arr_textObj.length; m++){
                    for(var x in textVal){
                        if(arr_textObj[m].name == x){
                            $('input[name="'+ x +'"]').val(textVal[x]);
                        }
                    }
                }
                //单选按钮
                for(var x in radioVal){
                    for(var i=0;i< $('#form_diabetes input[name="' + x +'"]').length;i++){
                        //$('#form_diabetes input[name="' + x +'"]').eq(i).attr({disabled:'disabled'});
                        $('#form_diabetes input[name="' + x +'"]').eq(radioVal[x].substr(0,1)).attr({checked:'checked'});
                    }
                }
                //多选框
                arr_checkboxObj.each(function (index, element) {
                    if(checkboxVal.indexOf(element.value) != '-1'){
                        $('[id^="d_symptom_box"]').eq(index).attr({checked:'checked'});
                    }
                });
                //文本域
                arr_textareaObj.val(textareaVal);
            }
        },
		bindEvent: function() {
			var _this = this;
            function saveForm(formData,uploadImg) {
                var date = new Date(),
                    years = date.getFullYear(),
                    month = parseInt(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) :  date.getMonth() + 1,
                    day =parseInt(date.getDate()) < 10 ? '0' + date.getDate() : date.getDate(),
                    hours = parseInt(date.getHours()) <10 ? '0' + date.getHours() : date.getHours(),
                    minutes = _this.toDouble(date.getMinutes()),
                    seconds = _this.toDouble(date.getSeconds()),
                    uploadTime  = years + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                var YData={
                    'pathL':"/doctor/patientVisitRecord/save",
                    'accessToken':token,
                    'recordId':(_this.recordId == null || _this.recordId == 'null' ) ? '0' : _this.recordId,
                    'visitId': _this.visitId,
                    'type': _this.saveType,
                    'imageUrl': uploadImg || null,
                    'uploadTime': uploadTime,
                    'formData': '&'+ formData || null
                };
                Ajax({
                    url:servUrl,
                    data:YData,
                    async: false,
                    beforeSend: function(){
                       saveLoading();
                    },
                    type : 'post',
                    dataType : "json",
                    success:function(res){
                        console.log(res);
                        if(res.state==0){
                            hidesaveLoading();
                            //每成功随访一名患者获得成长值（填写完随访表单视为成功随访）
                            var DoctorTask={
                                'pathL':"/doctor/creditDoctorTask/doTaskWithMember",
                                'accessToken': token,
                                'taskTag': "visitPatient",
                                'memberId': _this.memberId,
                            };
                            Ajax({
                                url:servUrl,
                                data:DoctorTask,
                                async: false,
                                beforeSend: function(){
                                },
                                type : 'post',
                                dataType : "json",
                                success:function(res){
                                    if(res.state==0){
                                      if(res.data.earnTaskPoint > '0'){
                                        GHUTILS.integration_toast(res.data.notes, res.data.earnTaskPoint, 2)
                                        clearTimeout(timer)
                                        var timer = setTimeout(function () {
                                          GHUTILS.OPENPAGE({
                                            url: "trackTask_choseForm.html",
                                            extras: {
                                              isFinish: '0',
                                              visitId: _this.visitId
                                            }
                                          });
                                        },2500);
                                      }else{
                                        GHUTILS.OPENPAGE({
                                          url: "trackTask_choseForm.html",
                                          extras: {
                                            isFinish: '0',
                                            visitId: _this.visitId
                                          }
                                        });
                                      }
                                    }else{
                                    }
                                },
                                error:function(res){
                                    console.log(res)
                                }
                            });
                        }else{
                            showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
                        }
                    },
                    error:function(res){
                        console.log(res)
                    }
                });
            };

            $('#form_hypertension_btn').on('tap',function () { //保存高血压表单
               saveForm(decodeURI($('#form_hypertension').serialize()));
            });

            $('#form_diabetes_btn').on('tap',function () { //保存糖尿病表单
                saveForm(decodeURI($('#form_diabetes').serialize()));
            });

            //拨打电话按钮
            $('.makePhone').on('tap',function () {
               chatOrDial(Number(_this.visitType));//1是图文,2是语音,3是视频,4是线下
            });


          //返回上一界面
            $('.infoDetail_btn').on('tap',function () {
               window.location.href='trackTask_choseForm.html?isFinish=0'+'&visitId=' + _this.visitId;
            });

            //线下随访上传图片
            $("#underLine").change(function(){
                var objUrl = getObjectURL(this.files[0]);
                if (objUrl) {
                    $("#imgUrl").attr("src", objUrl);  // 在这里修改图片的地址属性
                }
                var imgFile = this.files[0]; //获取图片文件
                var formData = new FormData();  // 创建form对象
                formData.append('file', imgFile);  // 通过append向form对象添加数据
                //formData.append('pathL', '/uploadImg')  // 如果还需要传替他参数的话
                $.ajax({
                    url: servUploadImg, //请求的接口地址
                    type: 'POST',
                    cache: false, //上传文件不需要缓存
                    data: formData,
                    processData: false, // 不要去处理发送的数据
                    contentType: false, // 不要去设置Content-Type请求头
                    success: function(res){
                        var dataObj = JSON.parse(res);
                        if(dataObj.state == 0){
                            $('#form_underLine_btn').on('tap',function () {
                                saveForm(dataObj.data.url);
                            });
                        }
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
            });
            function getObjectURL(file) {
                var url = null ;
                // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
                if (window.createObjectURL!=undefined) { // basic
                    url = window.createObjectURL(file) ;
                } else if (window.URL!=undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file) ;
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file) ;
                }
                return url ;
            }
        },
        toDouble:function (n){
            if(n<10){
                return '0' + n
            }else{
                return n
            }
        }
	};	
	$(function(){
		var ptn = new LENDCOMPILULIST();
			ptn.init();
	});
})(jQuery);
//监听手机的返回键，如果H5页面要屏蔽，则返回true；如果不屏蔽，则返回false
var  visitId = decodeURI(getRequestParam('visitId')) || null;//任务id
function phoneBackButtonListener() {
   // 执行H5的处理逻辑
   window.location.href='trackTask_choseForm.html?isFinish=0'+'&visitId=' + visitId;
   return true;
};