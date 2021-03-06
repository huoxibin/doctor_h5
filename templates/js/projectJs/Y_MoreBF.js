var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset/*,generatedCount = 0*/;
var maxId=0;
var lastdatas='';
var YData,pageNum=0;
//页面初始化
window.onload = function(){
    loaded()
};
//右侧开始部分
function loaded(){
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
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
            }
        },
        onScrollMove: function () {
            if (this.y > 6 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
                this.minScrollY = 0;
            } else if (this.y < 6 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 6) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 6) && pullUpEl.className.match('flip')) {
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
            } else if (pullUpEl.className.match('flip')){
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                debugger;
                if(getCookieValue("IsThereData")=='false' && $('.ulItem li').length>=10){
                    pullUpAction();
                }else{
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '已展示全部数据';
                }
            }
        }
    });
    Notvisitor(lastdatas,pageNum);
}

/*非访客接口*/
function Notvisitor(lastdatas,pageNum){
    YData={
        'pathL':"/health/bodyFatRate/history",
        'accessToken':token,
        'memberId':memberId,
        'pageNum':parseInt(pageNum)+1,
        'pageSize':10
    }
    loadAction(YData,lastdatas);
}

/*判断一个对象是否为空*/
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
//初始状态，加载数据
function loadAction(YData,lastdatas){
    Ajax({
        url:servUrl,
        data:YData,
        async: false,
        beforeSend: function(){
        },
        type : 'post',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                var data=res.data;
                var html= new EJS({url:"../compileEjs/Y_MoreBF.ejs"}).render({data:data,lastdatas:lastdatas});
                $(html).appendTo('#thelist');
                $('.shadowWrapper').css('height',$(window).height()-$('.Jnav').height());
                $('#wrapper').css('height',$('.shadowWrapper').height()-$('.title').height() -70);
                /*$("#renameClick").click(function(e) {
                    e.stopPropagation();   // 阻止冒泡
                    $('#back').css("display", "block");   // 显示

                    $("#back").bind("click", function(e) {   // 相当于点击空白消失
                        $('#back').css("display", "none");
                    });
                });*/
                setCookie('pageNum',data.pageNum);
                setCookie('IsThereData',isEmptyObject(data.result));
                if(JSON.stringify(data.result)!="{}"){
                    if($('.ulItem li').length<10){
                        $('#pullUp span').show();
                        $('#pullUp span').html('已展示全部')
                    }else{
                        $('#pullUp span').show();
                    }
                }else{
                    $('#pullUp span').html('暂无数据');
                }
            }else{
                showError("无法连接到服务器 ("+res.code+"),请检查你的网络或者稍后重试");
            }
            myScroll.refresh();
        },
        error:function(res){
          /*  alert(2)*/
        }
    });
}

//下拉刷新当前数据
function pullDownAction () {
    setTimeout(function () {
        //这里执行刷新操作
        myScroll.refresh();
    }, 400);
}

//上拉加载更多数据
function pullUpAction () {
    setTimeout(function () {
        var lastdatas = $('.ulItem:last-child').attr('datas');
         pageNum = getCookieValue("pageNum");
        Notvisitor(lastdatas,pageNum);
    }, 400);
}
