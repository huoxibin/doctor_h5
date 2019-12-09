var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
var IsThereData,pageNum,Ytotal;
var Y_liIds=sessionStorage.getItem('Y_liId');
//左侧数据的加载
function createList(callback){
    var list = document.querySelector('#list');
    var inner = "";
    var YData={
        'pathL':"/news/articleAuxiliary/auxiliaryTopChannels",
        'appId':'doctorAPP',
        'accessToken':token
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
                var data=res.data;
                for(var i = 0; i<data.length; i++){
                    if(Y_liIds){
                        if(data[i].id==Y_liIds){
                            inner += "<li id="+data[i].id+" class='active'><a name="+  [i].name+">"+data[i].name+"<i></i></a></li>";
                        }else{
                            inner += "<li id="+data[i].id+"><a name="+data[i].name+">"+data[i].name+"<i></i></a></li>";
                        }
                    }else{
                        inner += "<li id="+data[i].id+"><a name="+data[i].name+">"+data[i].name+"<i></i></a></li>";
                    }
                }
                list.innerHTML = inner;
                function GetRequest() {
                    var url = location.search; // 获取url中"?"符后的字串
                    var theRequest = new Object();
                    if (url.indexOf("?") != -1) {
                        var str = url.substr(1);
                        strs = str.split("&");
                        for (var i = 0; i < strs.length; i++) {
                            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                        }
                    }
                    return theRequest;
                }
                var listLeft = GetRequest().scroll

                if(listLeft){
                    $("#list").scrollLeft(listLeft)
                }
                if(!Y_liIds){
                    $('#list li').eq(0).addClass('active');
                }
                //高亮定位当前选中的列目
                var iScrol;
                if($('#list li.on').index()==0 || $('#list li.on').length==0){
                    iScrol=0
                }else{
                    iScrol=parseInt($('#list li.on').prev('li').offset().top);
                }
                loaded()
            }
        },
        error:function(res){
        }
    });
}
//阻止冒泡
//页面初始化
window.onload = function(){
    $('.Y_docIndex').css('height',$(window).height()-$('.Ynav').height());
    //初始化左侧列表
    createList();
};
//右侧开始部分
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
                /*pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';*/
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                /*pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';*/
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
                /* pullDownEl.querySelector('.pullDownLabel').innerHTML='<img class="loading1" src="../images/loading.gif" />';*/
                pullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                /*pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';*/
                if(Ytotal>0){
                    if(IsThereData<5){
                        /*pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';*/
                    }else{
                        pullUpAction();	// Execute custom function (ajax call?)
                    }
                }else{
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
                }
            }
        }
    });
    var liId;
    if(Y_liIds){
        loadAction(Y_liIds,0);
    }else{
        liId=channelId||$('#list li').attr('id');
        loadAction(liId,0);
    }
    /*liId=channelId||$('#list li').attr('id');
     loadAction(liId,0);*/
    var timer1 =null;
    $('#list').off('tap').on('tap','li',function(){
        var _this = $(this);
        clearTimeout(timer1);
        timer1=setTimeout(function(){
            _this.addClass('active').siblings().removeClass("active")
            liId=_this.attr('id')
            $('#thelist').html("")
            loadAction(liId,0);
        },30)
    })
}
//初始状态，加载数据
function loadAction(liId,pageNum){
    var el;
    var inner1 = "";
    el = document.getElementById('thelist');
    var YData={
        'pathL':"/news/articleAuxiliary/auxiliaryHotArticles",
        'appId':'doctorAPP',
        'channelId':liId,
        'pageNum':parseInt(pageNum)+1,
        'pageSize':5,
        'accessToken':token,
        'doctorId':userId
    }
    Ajax({
        url:servUrl,
        data:YData,
        async: false,
        beforeSend: function(){
            /*$('#pullDown,#pullUp').html('');
             $('#pullDown').html('<img class="loading" src="../images/loading.gif" />')*/
        },
        type : 'get',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                var data1=res.data.result;
                Ytotal=res.data.total;
                if(res.data.total>0){
                    var listScrollLeft = $('#list').scrollLeft();
                    for (i=0; i<data1.length; i++) {
                        //Ydata(data1[i].add_time)
                       var readCount =  '';
                       if(data1[i].readCount == null){
                          readCount = ''
                       }else {
                          readCount = data1[i].readCount;
                       };
                       var favoriteCount = '';
                       if(data1[i].favoriteCount == null){
                          favoriteCount = ''
                       }else {
                          favoriteCount = data1[i].favoriteCount;
                       };
                        var collected = data1[i].favorite && data1[i].favorite ==1 ? 'collected' : '';
                        inner1+="<div class='Y_medCon_C' ishref='../html/Y_MedicalInDe.html?id="+data1[i].id+'&Y_id='+liId+'&collected='+collected+'&shareImgUrl='+data1[i].image+'&Y_scroll='+listScrollLeft+"&Y_Black=2'>" +
                               "<dl>" +
                                   "<dt>" +
                                        "<img src="+data1[i].image+">" +
                                   "</dt>" +
                                   "<dd>" +
                                       "<h3>"+data1[i].title+"</h3>" +
                                       "<p>"+data1[i].publish_btime.substr(0,10)+"</p>" +
                                       "<p class='shouCangHuo'>" +
                                            "<img class='hScanum' src='../images/scanum.png'>" +
                                            "<span>"+readCount+"</span>"+
                                            "<img class='hScanuTwo' src='../images/collectnum.png'>" +
                                            "<span>"+favoriteCount+"</span>"+
                                       "</p>"+
                                   "</dd>" +
                               "</dl>" +
                           "</div>";
                        setCookie('pageNum',res.data.pageNum);
                        IsThereData=data1.length;
                    }
                    $(inner1).appendTo('#thelist');
                    $('#thelist').removeClass('JNOdata')
                    $('#wrapper,.Y_medInCon').css('height',$(window).height()-$('.Y_MedicalInT').height()-$('.Ynav').height());
                    _czc.push(["_trackEvent","医学资讯", "列表", $('#list li.active').text(),"", "Y_medCon"]);
                    console.log($('#list li.active').text())
                    $('.Y_medCon_C').on('tap',function(){
                        var iHref=$(this).attr('ishref');
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","医学资讯", "查看", "医疗资讯详情", "", "Y_medConA"]);
                    })
                    myScroll.refresh();
                    /*if(data1.length<5){
                     /!*$('#pullUp span').hide();*!/
                     $('#pullUp span').text('没数据了');
                     }else{
                     /!*$('#pullUp span').show();*!/
                     $('#pullUp span').text('上拉加载更多');
                     }*/
                }else{
                    $('#thelist').html('暂无数据')
                    $('#thelist').addClass('JNOdata')
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
        pageNum = getCookieValue("pageNum");
        var liId=$('#list li.active').attr('id')
        loadAction(liId,pageNum);
    }, 400);
}