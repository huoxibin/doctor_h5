var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
var IsThereData,pageNum;
var Y_liIds=sessionStorage.getItem('Y_liId');
sessionStorage.setItem('JdocToken',token);
function loadUrl(){
    window.location.reload();
}
//阻止冒泡
//页面初始化
window.onload = function(){
    //初始化左侧列表
        loaded();
        $('.Y_medTitleCon').on('tap','dl',function(){
            var _this = $(this);
            if(token!=''){
                if(_this.find('dd').text()=='名医带教'){
                    showalert(0,'敬请期待',2);
                }else{
                    var YData1={
                        'pathL':"/doctor/doctorCertifiedCard/getcardlst",
                        'accessToken':token
                    }
                    Ajax({
                        url:servUrl,
                        data:YData1,
                        async: false,
                        beforeSend: function(){
                        },
                        type : 'get',
                        dataType : "json",
                        success:function(res){
                            if(res.state==0){
                                var data1=res.data[0];
                                if(data1.checked==2){
                                    if(_this.find('dd').text()=='疾病查询'){
                                        _czc.push(["_trackEvent","疾病查询", "查看", "疾病查询入口", "", "JBCX_click"]);
                                        window.location.href='../html/Y_DC.html'
                                    }else if(_this.find('dd').text()=='医学计算器'){
                                        _czc.push(["_trackEvent","医学计算器", "查看", "医学计算器入口", "", "JSQ_click"]);
                                        window.location.href='../html/Y_MediCalc.html'
                                    }
                                }else{
                                    if(window.webkit){ //ios
                                        window.webkit.messageHandlers.toCertificate.postMessage('');
                                    }else if(window.jsObj){ //安卓
                                        window.jsObj.toCertificate();
                                    }
                                }
                            }
                        },
                        error:function(res){
                        }
                    });
                }
            }else{
                if(window.webkit){ //ios
                    window.webkit.messageHandlers.toLoginAction.postMessage('');
                }else if(window.jsObj){ //安卓
                    window.jsObj.toLoginAction();
                }
            }
        })
   /* $('.Amore').on('tap',function(){
        var iHref=$(this).attr('ishref');
        window.location.href=iHref;
        _czc.push(["_trackEvent","医疗资讯", "查看", "查看更多", "", "Amore"]);
    })*/
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
    loadAction(2,0,0);
}
/*document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//阻止冒泡
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 0); }, false);*/
//初始状态，加载数据
function loadAction(liId,pageNum,Y_num){
    var el, dls;
    var inner1 = "";
    el = document.getElementById('thelist');
    var YData={
        'pathL':"/news/doctorArticle/queryHotTagListByPage",
        'appid':'doctorAPP',
        'pageNum':parseInt(pageNum)+1,
        'pageSize':5,
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
                var data1=res.data.result;
               // var data1=[]
                if(res.data.total>0){
                    for (i=0; i<data1.length; i++) {
                        //Ydata(data1[i].addTime)
                        var dataStr = data1[i].addTime.substr(0,10);
                        if(data1[i].videoUrl==undefined){
                            inner1+="<div class='Y_medCon_C'><a href='../html/Y_MedicalInDe.html?id="+data1[i].id+"&Y_Black=1'><dl><dt><img src="+data1[i].image+"></dt><dd><h3>"+data1[i].title+"</h3><p>"+dataStr+"</p></dd></dl></a></div>";
                        }else{
                            inner1+="<div class='Y_medCon_C'><a href='../html/Y_MedicalInDe.html?id="+data1[i].id+"&Y_Black=1'><dl><dt><img src="+data1[i].image+"><span class='view'></span></dt><dd><h3>"+data1[i].title+"</h3><p>"+dataStr+"</p></dd></dl></a></div>";
                        }
                        setCookie('pageNum',res.data.pageNum);
                        IsThereData=data1.length;
                    }
                    if(Y_num==1){
                        $('#thelist').html($(inner1));
                    }else{
                        $(inner1).appendTo('#thelist');
                    }
                    $('#wrapper,.Y_medCon_CS').css('height',$(window).height()-$('.Ynav').height()-$('.Y_medCon h2').height()-157);//469
                    $('#thelist').removeClass('JNOdata')
                    myScroll.refresh();
                    if(data1.length<5){
                        /*$('#pullUp span').hide();*/
                        $('#pullUp span').text('没数据了');
                    }else{
                        /*$('#pullUp span').show();*/
                        $('#pullUp span').text('上拉加载更多');
                    }
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
        loadAction(2,0,1);
        /*myScroll.refresh();*/
    }, 400);
}
//上拉加载更多数据
function pullUpAction () {
    setTimeout(function () {
        pageNum = getCookieValue("pageNum");
        var liId=$('#list li.active').attr('id')
        loadAction(liId,pageNum,0);
    }, 400);
}