(function($){
	var LENDCOMPILULIST = function(){
        this.pageSize=5;
        this.pageNum=1;
        this.doctorId = '100004';
        this.total = '';
    }
	LENDCOMPILULIST.prototype = {
		init:function(){
			//this.pageInit(); //页面初始化
			this.initDom();
            this.bindEvent();
		},
		pageInit:function(){
            var _this = this;
        },
		initDom:function(){ //产品列表渲染方法
			var _this = this,
                myScroll,
                pullDownEl,
                pullDownOffset,
                pullUpEl,
                pullUpOffset,
                IsThereData;
            loaded();
            function loaded() {
                //动画部分
                pullDownEl = document.getElementById('pullDown');
                pullDownOffset = pullDownEl.offsetHeight;
                pullUpEl = document.getElementById('pullUp');
                pullUpOffset = pullUpEl.offsetHeight;
                myScroll = new iScroll('wrap', {
                    useTransition: true,
                    topOffset: pullDownOffset,
                    onRefresh: function () {
                        if (pullDownEl.className.match('loading')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                        } else if (pullUpEl.className.match('loading')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'flip';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                            this.minScrollY = 0;
                        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'flip';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                            this.maxScrollY = pullUpOffset;
                        }
                    },
                    onScrollEnd: function () {
                        if (pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'loading';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
                            pullDownAction();	// Execute custom function (ajax call?)
                        } else if (pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'loading';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                            if(IsThereData<5){
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';
                            }else{
                                pullUpAction();	// Execute custom function (ajax call?)
                            }
                        }
                    }
                });
                loadAction(5,1,0);
            }
            function loadAction(pageSize,pageNum,flag){
                var el, dls;
                var inner1 = "";
                el = document.getElementById('thelist');
                var YData = {
                    'pathL':"/doctor/patientVisitInfo/getPatientList",
                    'accessToken':token,
                    'doctorId': '100004',
                    'pageNum': pageNum,
                    'pageSize': pageSize,
                    'memberName':''
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
                            _this.total = res.data.visitCount;
                            var data1=res.data.visitList;
                            // var data1=[]
                            if(res.data.visitCount>0){
                                for (i=0; i<data1.length; i++) {
                                    var sex = data1.sex == '男' ? 'customer_female' : 'customer_male';
                                    var imgUrl = data1.headImg ? data1.headImg : '../../images/JpatientD.png';
                                    inner1 += '<div class="trackPlan_list" familyId="'+ data1[i].familyId +'">'
                                        +'<div class="listImg_detail"><img src="' + imgUrl + '" alt=""></div>'
                                        +' <div class="listInfo">'
                                        +'<div class="listInfo_top"><span class="customer_name">' + data1[i].name + '</span><span class="' + sex + '"></span><span class="customer_age">' + data1[i].age + '岁</span></div>'
                                        +'<div class="listInfo_bot">' + data1[i].illness + '</div>'
                                        +'</div>'
                                        +'</div>';
                                    IsThereData = data1.length;
                                }
                                if(flag==1){
                                    $('#thelist').html($(inner1));
                                }else{
                                    $(inner1).appendTo('#thelist');
                                }
                                $('.trackPlan_slide').css('height',$(window).height()-$('.wrap').height());
                                $('#thelist').removeClass('JNOdata')
                                myScroll.refresh();
                                if(data1.length<5){
                                    $('#pullUp span').text('没数据了');
                                }else{
                                    $('#pullUp span').text('上拉加载更多');
                                }
                            }else{
                                $('#thelist').html('暂无数据');
                                $('#thelist').addClass('JNOdata');
                            }
                        }else{
                            showError(res.msg);
                        }
                    },
                    error:function(res){
                    }
                });
                //myScroll.refresh();
            }
            function pullDownAction () {
                setTimeout(function () {
                    //这里执行刷新操作
                    loadAction(5,1,1);
                    _this.pageNum = 0;
                }, 400);
            }
            //上拉加载更多数据
            function pullUpAction () {
                console.log(_this.total,_this.pageSize*_this.pageNum)
                if(_this.total > _this.pageSize*_this.pageNum){
                    setTimeout(function () {
                        _this.pageNum++;
                        loadAction(_this.pageSize,_this.pageNum,0);
                    }, 400);
                }else{
                    $('#pullUp span').text('没数据了');
                }
            }
		},
		bindEvent: function() {
			var _this = this;
			//随访计划 随访任务选项卡切换
			$('.trackPlan_tab .trackPlan_nav').on('tap', function () {
                var _index = $(this).index();
                $('.trackPlan_tab .trackPlan_nav').removeClass('active');
                $(this).addClass('active')
                $('.trackPlan_wrap .slide').addClass('hide');
                $('.trackPlan_wrap .slide').eq(_index).removeClass('hide')
            });
			//随访计划跳转到详情页
            $(document).on('tap','.trackPlan_list',function () {
                GHUTILS.OPENPAGE({
                    url: "trackPlan_detail.html",
                    extras: {
                        'memberId': '12',
                        'headImg': '',
                        'sex': '女',
                        'name': 'sdf',
                        'illness': '高血压、糖尿病、高血脂',
                        'age': 'sdf'
                    }
                });
            });
            //随访任务跳转到详情页
            $('.trackTask .trackPlan_list').on('tap',function () {
                var _that = $(this);
                if(_that.hasClass('done')){
                    GHUTILS.OPENPAGE({
                        url: "trackTask_choseForm_done.html",
                        extras: {
                            isFinish: '1',
                            visitId: '2'
                        }
                    });
                }else{
                    GHUTILS.OPENPAGE({
                        url: "trackTask_choseForm.html",
                        extras: {
                            isFinish: '0',
                            visitId: '2'
                        }
                    });
                }

            });
            //筛选弹框
			$('.trackPlan_disease').on('tap', function () {
				$('.tc_box, .tc').removeClass('hide');
                $('.tc_disease').animate({bottom:"0px"});
            });
			$('.disease_box .dis').on('tap', function () {
				var _this = $(this);
				if(_this.hasClass('acBg')){
                    _this.removeClass('acBg');
				}else{
                    _this.addClass('acBg');
				}
            });
			//确定
			$('.set').on('tap', function () {
                $('.tc_disease').animate({bottom:"-300px"}, function () {
                    $('.tc_box, .tc').addClass('hide');
                });
            });
            //取消
            $('.cancel').on('tap', function () {
                $('.tc_disease').animate({bottom:"-300px"}, function () {
                    $('.tc_box, .tc').addClass('hide');
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