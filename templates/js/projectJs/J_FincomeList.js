$(function () {
    $('.wrap').css('height', $(window).height())
    var boxHeight = $('.J_historyDealBox').height()
    $(".wapperbox").css('margin-top', boxHeight)
    console.log(boxHeight)
    var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;
    var pageSize = 8;
    var pageNum = 1;
    var iNowMonth;
    var itotal, IsThereData;
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
                    //pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 8) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    //pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 8) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    //pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                    //this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function () {
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    //pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
                    /* pullDownEl.querySelector('.pullDownLabel').innerHTML='<img class="loading1" src="../images/loading.gif" />';*/
                    pullDownAction(); // Execute custom function (ajax call?)
                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    //pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                    if (IsThereData < 8) {
                        // pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';
                    } else {
                        pullUpAction(); // Execute custom function (ajax call?)
                    }
                }
            }
        });
        loadAction(pageSize, pageNum, 1);
    }

    function pullDownAction() { //下拉刷新当前数据
        /*  setTimeout(function () {
               //myScroll.refresh();
               loadAction(pageSize,1,0);
           }, 400);*/
        setTimeout(function () {
            //这里执行刷新操作
            myScroll.refresh();
        }, 400);
    }

    function pullUpAction() { //上拉加载更多数据
        setTimeout(function () {
            pageNum++;
            loadAction(pageSize, pageNum, 1);
        }, 400);
    }

    function loadAction(pageSize, pageNum, ifLad) {
        var topHtml = '';
        var YData = {
            'pathL': "/doctor/doctorAccountturnover/teamFromList",
            'pageSize': pageSize,
            'pageNum': pageNum,
            'accessToken': token //'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MzE4MTM0NjMsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMTYxXCIsXCJpbVRva2VuXCI6XCI3NjBiYTM2MzU2NGZjMTRlNjcwOGVkZjE1ZDhiNmVmOVwiLFwiaW5kZXhcIjo3LFwicmVmcmVzaFRva2VuXCI6ZmFsc2UsXCJyb2xlVHlwZVwiOjIsXCJzZXNzaW9uSWRcIjpcIjdBOTM3QzhDNzdEMTk0M0E3RDU3NTA0RUQzNTY2MjQ2XCIsXCJ1c2VyQWdlbnRcIjpcIlBvc3RtYW5SdW50aW1lLzcuMS4xXCIsXCJ1c2VySWRcIjoxMDAxNjF9IiwiZXhwIjoxNTYzMzQ5NDYzfQ.gDLLRf4RjAZhKGw3UFt_fXlc9FNzVbfhfMaI5H1YQVc'
        }
        Ajax({
            url: servUrl,
            data: YData,
            async: false,
            beforeSend: function () {},
            type: 'get',
            dataType: "json",
            success: function (res) {
                if (res.state == 0) {
                    itotal = res.data.fromList.total;
                    var data = res.data.fromList.result;
                    var num = 0;
                    for (var i = 0; i < data.length; i++) {
                        num = num + data[i].data.length
                    }
                    IsThereData = num;
                    // IsThereData=res.data.result.length;
                    $('.p_cont h2').text(res.data.amountSum);
                    if (itotal > 0) {
                        $('#wrapper').show();
                        topHtml = new EJS({
                            url: "../compileEjs/J_FincomeList.ejs"
                        }).render({
                            data: data,
                            pageNum: pageNum,
                            iNowMonth: iNowMonth
                        });
                        if (ifLad == 1) {
                            $(topHtml).appendTo('#thelist');
                            iNowMonth = $('.J_incomeList' + pageNum + '').find('h2').text();
                            console.log(iNowMonth);
                        } else {
                            $('#thelist').html(topHtml);
                            iNowMonth = $('.J_incomeList' + pageNum + '').find('h2').text();
                            console.log(iNowMonth);
                        }
                        myScroll.refresh();
                        /* if(IsThereData.length<8){
                             $('#pullUp span').text('没数据了');
                         }else{
                             $('#pullUp span').text('上拉加载更多');
                         }*/
                    } else {
                        $('.JnoData').show();
                        $('#wrapper').hide();
                    }
                    // $('#wrapper,.wapperbox').css('height', $(window).height() - $('.Ynav').height());
                    $('#wrapper,.wapperbox').css('height', $(window).height() - boxHeight);
                } else {
                    showError(res.msg);
                }
            },
            error: function (res) {
                showalert(0, '请求失败', 2);
            }
        });
    }
})