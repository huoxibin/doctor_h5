(function($){
	var LENDCOMPILULIST = function(){
	    this.formName = decodeURI(getRequestParam('formName')) || null;//表的名字
        this.saveType = getRequestParam('saveType') || null;//1是高血压，2是糖尿病
        this.name = decodeURI(getRequestParam('name')) || null;//姓名
        this.startTime = decodeURIComponent(getRequestParam('startTime')) || null;//随访时间
        this.visitType = decodeURI(getRequestParam('visitType')) || null;//随访方式
        this.recordId = decodeURI(getRequestParam('recordId')) || null;//随访历史详情recordId
        this.isFinish = decodeURI(getRequestParam('isFinish')) || null;//是否已完成
        this.visitId = decodeURI(getRequestParam('visitId')) || null;//任务id
    };
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit(); //页面初始化
            this.initDom(); //获取表单数据
            this.bindEvent();
		},
		pageInit:function(){
            var _this = this;
            //头部标题内容渲染  根据地址栏传的参数信息
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
                    break;
                case '2':
                    $('.trackTask_user_left .visitType').text('语音');
                    break;
                case '3':
                    $('.trackTask_user_left .visitType').text('视频');
                    break;
                case '4':
                    $('.trackTask_user_left .visitType').text('线下随访');
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
                            $('input[name="'+ x +'"]').val(textVal[x]).attr({disabled:'disabled'});
                        }
                    }
                }
                //单选按钮
                for(var x in radioVal){
                    for(var i=0;i< $('#form_hypertension input[name="' + x +'"]').length;i++){
                        $('#form_hypertension input[name="' + x +'"]').eq(i).attr({disabled:'disabled'});
                        $('#form_hypertension input[name="' + x +'"]').eq(radioVal[x].substr(0,1)).attr({checked:'checked'});
                    }
                }
                //多选框
                arr_checkboxObj.each(function (index, element) {
                    if(checkboxVal.indexOf(element.value) != '-1'){
                        $('[id^="h_symptom_box"]').attr({disabled:'disabled'}).eq(index).attr({checked:'checked'});
                    }else{
                        $('[id^="h_symptom_box"]').attr({disabled:'disabled'});
                    }
                });
                //文本域
                arr_textareaObj.val(textareaVal).attr({disabled:'disabled'});
            }
            function setForm_d(textVal,radioVal,checkboxVal,textareaVal) {
                var arr_checkboxObj = $('#form_diabetes input[type="checkbox"]'),
                    arr_textareaObj = $('#form_diabetes textarea'),
                    arr_textObj = $('#form_diabetes input[type="text"]');
                //输入框
                for(var m=0; m<arr_textObj.length; m++){
                    for(var x in textVal){
                        if(arr_textObj[m].name == x){
                            $('input[name="'+ x +'"]').val(textVal[x]).attr({disabled:'disabled'});
                        }
                    }
                }
                //单选按钮
                for(var x in radioVal){
                    for(var i=0;i< $('#form_diabetes input[name="' + x +'"]').length;i++){
                        $('#form_diabetes input[name="' + x +'"]').eq(i).attr({disabled:'disabled'});
                        $('#form_diabetes input[name="' + x +'"]').eq(radioVal[x].substr(0,1)).attr({checked:'checked'});
                    }
                }
                //多选框
                arr_checkboxObj.each(function (index, element) {
                    if(checkboxVal.indexOf(element.value) != '-1'){
                        $('[id^="d_symptom_box"]').attr({disabled:'disabled'}).eq(index).attr({checked:'checked'});
                    }else{
                        $('[id^="d_s_symptom_box"]').attr({disabled:'disabled'});
                    }
                });
                //文本域
                arr_textareaObj.val(textareaVal).attr({disabled:'disabled'});
            }
		},
		bindEvent: function() {
			var _this = this;
            //返回上一界面
            $('.infoDetail_btn').on('tap',function () {
                GHUTILS.OPENPAGE({
                    url: 'trackTask_choseForm_done.html',
                    extras: {
                        isFinish: '1',
                        visitId: _this.visitId
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
//(Zepto)