(function($){
	var LENDCOMPILULIST = function(){
        // this.src = getRequestParam('src') || null;
        this.src = sessionStorage.getItem("src");
    }
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit();
		},
		pageInit:function(){
            var _this = this;
			var _height = $(window).height();
            var _innerHeight = (_height + 1900)*0.02;
            // GHUTILS.PopBoxFunc.OpenPopBox(sessionStorage.getItem("src"),{tit:'',btns:false,ClassName:"submit_box"});
            // $('html, body, #questionnaire').height(_innerHeight + 'rem');
            $('.ques-body').height(_height);
            $('#questionnaire').attr({'src': sessionStorage.getItem("src")});
        },
		initDom:function(){
            var _this = this;
		},
		bindEvent: function() {
			var _this = this;
		}
	};	
	$(function(){
		var ptn = new LENDCOMPILULIST();
			ptn.init();
	});
})(jQuery);
//(Zepto)