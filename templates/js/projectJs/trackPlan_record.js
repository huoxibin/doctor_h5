(function($){
	var LENDCOMPILULIST = function(){}
	LENDCOMPILULIST.prototype = {
		init:function(){
			this.pageInit(); //页面初始化
			this.initDom();
            this.bindEvent();
		},
		pageInit:function(){
            var _this = this;
        },
		initDom:function(){ //产品列表渲染方法
			var _this = this;

            var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;
            var pageSize=8;
            var pageNum=1;
            var iNowMonth;
            var itotal,IsThereData;
            sessionStorage.setItem('JincomeToken',token);
            loaded();
            function loaded() {
                //动画部分
                pullDownEl = document.getElementById('pullDown');
                pullDownOffset = pullDownEl.offsetHeight;
                pullUpEl = document.getElementById('pullUp');
                pullUpOffset = pullUpEl.offsetHeight;
                myScroll = new iScroll('wrapper', {
                    useTransition: true,
                    topOffset: pullDownOffset,
                    onRefresh: function () {
                        if (pullDownEl.className.match('loading')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                        } else if (pullUpEl.className.match('loading')) {
                            pullUpEl.className = '';
                            // pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 8 && !pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'flip';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                            this.minScrollY = 0;
                        } else if (this.y < 8 && pullDownEl.className.match('flip')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 8) && !pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'flip';
                            //pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + 8) && pullUpEl.className.match('flip')) {
                            pullUpEl.className = '';
                            // pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                            //this.maxScrollY = pullUpOffset;
                        }
                    },
                    onScrollEnd: function () {
                        if (pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'loading';
                            // pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
                            /* pullDownEl.querySelector('.pullDownLabel').innerHTML='<img class="loading1" src="../images/loading.gif" />';*/
                            pullDownAction();	// Execute custom function (ajax call?)
                        } else if (pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'loading';
                            // pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                            if(IsThereData<8){
                                //pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';
                            }else{
                                pullUpAction();	// Execute custom function (ajax call?)
                            }
                        }
                    }
                });
                loadAction(pageSize,pageNum,1);
            }
            function pullDownAction () {//下拉刷新当前数据
                /*  setTimeout(function () {
                       //myScroll.refresh();
                       loadAction(pageSize,1,0);
                   }, 400);*/
                setTimeout(function () {
                    //这里执行刷新操作
                    myScroll.refresh();
                }, 400);
            }
            function pullUpAction () {//上拉加载更多数据
                setTimeout(function () {
                    pageNum++;
                    loadAction(pageSize,pageNum,1);
                }, 400);
            }

            function loadAction(pageSize,pageNum,ifLad){
                var topHtml='';
                var YData={
                    'pathL':"/doctor/patientVisitRecord/getVisitHistory",
                    'accessToken':token,
                    'doctorId': '100004',
                    'pageNum': pageNum,
                    'pageSize': pageSize
                }
                Ajax({
                    url:servUrl,
                    data:YData,
                    async: false,
                    beforeSend: function(){},
                    type : 'get',
                    dataType : "json",
                    success:function(res){
                        if(res.state==0){
                            itotal = res.data.total;
                            //console.log(itotal)
                            var date = res.data.historyList;
                            //console.log(date)
                            var num=0;
                            for(var i=0;i<date.length;i++){
                                num=num+date[i]
                            }
                            IsThereData=date.length;
                            // IsThereData=res.data.result.length;
                            if(itotal>0){
                                $('#wrapper').show();
                                topHtml = new EJS({url:"../compileEjs/trackPlan_record.ejs"}).render({data:date});
                                if(ifLad==1){
                                    $(topHtml).appendTo('#thelist');
                                    // iNowMonth=$('.J_incomeList'+pageNum+'').find('h2').text();
                                    // console.log(iNowMonth);
                                }else{
                                    $('#thelist').html(topHtml);
                                    // iNowMonth=$('.J_incomeList'+pageNum+'').find('h2').text();
                                    // console.log(iNowMonth);
                                }
                                myScroll.refresh();
                                if(IsThereData.length<8){
                                   $('#pullUp span').text('没数据了');
                                }else{
                                    $('#pullUp span').text('上拉加载更多');
                                }
                            }else{
                                $('.JnoData').show();
                                $('#wrapper').hide();
                            }
                            $('#wrapper,.wapperbox').css('height',$(window).height()-$('.Ynav').height());
                        }else{
                            showError(res.msg);
                        }
                    },
                    error:function(res){
                        showalert(0,'请求失败',2);
                    }
                });
            }
		},
		bindEvent: function() {
			var _this = this;
			//随访计划跳转到详情页
            $(document).on('tap','.record',function () {
                var recordId = $(this).attr('recordId')
                GHUTILS.OPENPAGE({
                    url: "trackPlan_record_detail.html",
                    extras: {
                        'recordId': recordId
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