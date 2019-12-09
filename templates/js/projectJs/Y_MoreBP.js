var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
/*var num =0;*/
var maxId=0;
var lastYear='';
var isGroup;
var YData;

//调试专用
// var uid = 682;

// var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1NTM4NDY3NDMsInN1YiI6IntcImltQWNjaWRcIjpcInRlc3RfZG9jdG9yXzEwMDAwMV8xNTM0OTI2MzY5XCIsXCJpbVRva2VuXCI6XCIxNWZiMDk4NTEyNzQ3YTM1ZjI1NTkyNWZmNWI1NjExZFwiLFwiaW5kZXhcIjoyMjcsXCJyZWZyZXNoVG9rZW5cIjpmYWxzZSxcInJvbGVUeXBlXCI6MixcInNlc3Npb25JZFwiOlwiODBGRDczREVBOEZFQzdGNUY2MTdCMzYzOUQ0QkJFM0VcIixcInVzZXJBZ2VudFwiOlwib2todHRwLzMuMC4xXCIsXCJ1c2VySWRcIjoxMDAwMDF9IiwiZXhwIjoxNTU5MDMwNzQzfQ.srEJ-67Dk9IGfZI-rA_unxdDRgZxvXbMMYm4H8SKVlg';
// var uid=553;

//阻止冒泡
/*document.addEventListener('touchstart', function(e) {
 e.preventDefault();
 })*/
//页面初始化
function loadUrl(){
    window.location.reload();
}
window.onload = function(){
    loaded()
    if(endTime==''){
        endTime=today();
    }else{
        endTime=endTime;
    }
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
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                if(uid!='-1'){
                    if(getCookieValue("maxId")!=0 && $('.ulItem li').length>=20){
                        pullUpAction();	// Execute custom function (ajax call?)
                    }else{
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '没有数据';
                    }
                }else{
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '访客最多只能查看15条数据';
                }
            }
        }
    });
    isGroup=true;
    if(uid=='-1'){
        visitor('','')
    }else{

        Notvisitor(maxId,lastYear,'','',isGroup);
    }
}
/*访客接口*/
function visitor(startTime,endTime){
    YData={
        'pathL':"/health/bloodPressure/listByVisitor",
        'accessToken':token,
        'endTime':endTime,
        'startTime':startTime,
        'isGroup':isGroup,
    }
    loadAction(YData);
}
/*非访客接口*/
function Notvisitor(maxId,lastYear,startTime,endTime,isGroup){
    YData={
        'pathL':"/health/bloodPressure/list",
        'accessToken':token,
        'endTime':endTime,
        'isGroup':isGroup,
        'maxId':maxId,
        'startTime':startTime,
        'uid':uid
    }
    loadAction(YData,lastYear);
}

//初始状态，加载数据
function loadAction(YData,lastYear){
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
                    var data=res.data;
                    var year=new Date().getFullYear();
                    if(data!='' && data !=null && data!=undefined){
                        var html= new EJS({url:"../compileEjs/Y_MoreBP.ejs"}).render({data:data,nowYear:year,lastYear:lastYear});
                        $(html).appendTo('#thelist');
                        $('.shadowWrapper').css('height',$(window).height()-$('.Jnav').height());
                        $('#wrapper').css('height',$('.shadowWrapper').height()-$('.title').height() - 70);
                        setCookie('maxId',data.maxId);
                        if(JSON.stringify(data.item)!="{}"){
                            $('#pullUp span').hide();
                            if($('.ulItem li').length<20){
                                $('#pullUp span').show();
                                $('#pullUp span').html('已展示全部')
                            }
                        }else{
                            $('#pullUp span').show();
                        }
                    }

            }else{
                showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
            }
            myScroll.refresh();
        },
        error:function(res){
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
    var timer1 =null;
    clearTimeout(timer1);
    timer1= setTimeout(function () {
        /* var number = num++;*/
        lastYear = $('.ulItem:last-child').attr('data-year');
        var maxIds = getCookieValue("maxId");
        if(uid=='-1'){
            visitor('','')
        }else{
            Notvisitor(maxIds,lastYear,'','',isGroup);
        }
    }, 400);
}

//获取当前的时间
function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    var d=today.getDate();
    return h+"-"+m+"-"+d;
}


