$(function(){
    var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;
    var pageSize=8;
    var pageNum=1;
    var iNowMonth;
    var itotal,IsThereData;
    sessionStorage.setItem('JincomeToken',token);
    loaded();
    /*只选择年月*/
    /*$.selectDateSimple("#select_5",{
        start:1994,
        end:2019
    },function (data) {
        loadAction(pageSize,pageNum,1);
        console.log(data);
    });*/
    var method2=$('.select-value2').mPicker({
        level:2,
        dataJson:yearsData,
        rows:5,
        Linkage:false,
        header:'<div class="mPicker-header">非联动选择插件</div>',
        idDefault:true,
        // valueSpace:true, // 两级联动插件  true-> 保留第一个选中值  false-> 两个选中的值都保留
        confirm:function(json){
            var _yearsStr = json.values.substr(0, 4);
            var _monthStr = json.values.substr(6).replace(/[\u4e00-\u9fa5]/g,"");
            loadAction(pageSize,pageNum,1,_yearsStr+Appendzero(_monthStr));
            $('.sign-month').html(_monthStr + '月');
        }
    });
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
        var myDate = new Date(),
            _years = myDate.getFullYear()
            _month = myDate.getMonth() + 1;
        $('.select-value2').val(_years + '年 ' +_month + '月');
        loadAction(pageSize,pageNum,1,_years+Appendzero(_month));
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
            loadAction(pageSize,pageNum,1,'');
        }, 400);
    }

    function loadAction(pageSize,pageNum,ifLad,yearMonth){
        var topHtml='';
        var YData={
            'pathL':"/doctor/doctorAccountturnover/fromAndToTurnoverList",
            'pageSize':pageSize,
            'pageNum':pageNum,
            'accessToken':token,
            'yearMonth':yearMonth
        }
        Ajax({
            url:servUrl,
            data:YData,
            async: false,
            beforeSend: function(){
            },
            type : 'get',
            dataType : "json",
            success:function(res){
                if(res.state==0){
                    itotal=res.data.total;
                    var data=res.data.result;
                    var num=0;
                    for(var i=0;i<data.length;i++){
                        num=num+data[i].data.length
                    }
                    IsThereData=num;
                   // IsThereData=res.data.result.length;
                    if(itotal>0){
                        $('#wrapper').show();
                        topHtml= new EJS({url:"../compileEjs/J_incomeList.ejs"}).render({data:data,pageNum:pageNum,iNowMonth:iNowMonth});
                        if(ifLad==1){
                            $(topHtml).appendTo('#thelist');
                            iNowMonth=$('.J_incomeList'+pageNum+'').find('h2').text();
                            console.log(iNowMonth);
                        }else{
                            $('#thelist').html(topHtml);
                            iNowMonth=$('.J_incomeList'+pageNum+'').find('h2').text();
                            console.log(iNowMonth);
                        }
                        myScroll.refresh();
                        /*if(IsThereData.length<8){
                           $('#pullUp span').text('没数据了');
                        }else{
                            $('#pullUp span').text('上拉加载更多');
                        }*/
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
    //收入列表跳转详情
   /* $(document).on('tap','.p_item div',function () {
        window.open($(this).attr('href'),'_self')
    })*/
})























