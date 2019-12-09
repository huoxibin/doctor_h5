/**
 * Created by wanglinfei on 2017/4/6.
 */
// var servpath ='http://doctor.dev.yidoka.cn/data';
/*带base的接口路径*/
var servUrl = servpath + '/my';
var servUploadImg = servpath + '/uploadImg'; //上传图片接口
var servNewFu = servpath + '/new';//上传大量文字和图片（富文本）
/*不带base的接口路径*/
var Z_servUrl = servpath + '/znyz';
/*var itoken='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjAyMzQ2MjMsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMDAzXCIsXCJpbVRva2VuXCI6XCI5YWM2MGFlMGY4Yzg4ZmViMjhkOTNlMjM4NTE2Y2RlZFwiLFwiaW5kZXhcIjo5LFwicm9sZVR5cGVcIjoyLFwic2Vzc2lvbklkXCI6XCIzQzBDREQ0NjQxREM4MTM4RDNCRTQxRTZGRTg2QkM4MFwiLFwidXNlckFnZW50XCI6XCJQb3N0bWFuUnVudGltZS82LjQuMVwiLFwidXNlcklkXCI6MTAwMDAzfSIsImV4cCI6MTU1MTc3MDYyM30.CcPvcAkwEF818zy2rFmUefuSNW62uRsomQc1qL8BN0k';*/
/**
 * data {path:接口路径,type:post||get默认post,serverName :接口服务器名,option……}
 * success 成功回调
 * error  失败回调
 */
//$('body,.wrap').css('height',$(window).height());
if($(window).height()==812){
   /* $('.Ynav').addClass('.Y_iphoneX');*/
    $('.container').addClass('iphoneX')
    $('.Ynav').css({
      'height':'68px',
      'lineHeight':'68px'
   });
   $('.Ynav .a.Y_tump,.Ynav a.Y_tump,.Ynav dfn.Y_tump').css({
        'marginTop':'21px'
    });
    $('.Ynav h1').css({
        'marginTop':'24px'
    });
    $('.Ynav b').css({
        'marginTop':'3px'
    });
    $('.Ynav b img').css({
        'marginTop':'-3px'
    });
    $('.Y_docIndex').css({
        'top':'88px'
    });
    //我的最外层的DIV，为适应iphoneX
    $('.form_type').css({
       'marginTop':'20px'
    });
    //收藏、分享图标
    $('.collectBtn').css({
       'top':'46px'
    });
    $('.shareBtn').css({
       'top':'46px'
    })
}
//解决ios移动端 软键盘收起后，页面内容不下滑
// $('input,textarea').on('blur',function(){
//    window.scroll(0,0);
// });
// $('select').on('change',function(){
//    window.scroll(0,0);
// });

var Ajax = function (AjaxParams) {
    if (typeof AjaxParams === 'object' && !!isNaN(AjaxParams.length)) {
        AjaxParams.data.version=version;
        $.ajax({
            url: AjaxParams.url||servUrl,
            data: AjaxParams.data||{},
            type: AjaxParams.type||'get',
            cache: AjaxParams.cache||false,
            dataType: AjaxParams.dataType||"json",
            async:AjaxParams.async||"true",
            timeout:  AjaxParams.timeout||30000,
            beforeSend: function () {
             AjaxParams.beforeSend&&AjaxParams.beforeSend()
            },
            success: function (res) {AjaxParams.success && AjaxParams.success(res);},
            error: function (err) {AjaxParams.error && AjaxParams.error(err);}
        });
    }
};
/*获取地址栏Url参数值*/
var getRequestParam = function (key) {
    var params = getParams();
    if (params && params != null) {
        var args = params.split("&");
        for (var i = 0; i < args.length; i++) {
            var param = args[i].split("=");
            if (param[0] == key) {
                return param[1];
            }
        }
        return "";
    }
};
function getParams() {
    var url = String(window.location);
    if (url.indexOf('?') > 0) {
        return url.substring(url.indexOf("?") - 0 + 1);
    }
    return "";
}
Array.prototype.myForEach = function myForEach(callBack, context) {
    typeof context === "undefined" ? context = window : null;

    if ("forEach" in Array.prototype) {
        this.forEach(callBack, context);
        return;
    }

    //->不兼容处理
    for (var i = 0; i < this.length; i++) {
        typeof callBack === "function" ? callBack.call(context, this[i], i, this) : null;
    }
};
/*
 * 格式化时间格式，，以分钟为单位的时间 param format yyyy-MM-dd hh:mm:ss
 * YYYY年MM月dd日hh小时mm分ss秒 yyyy年MM月dd日 MM/dd/yyyy yyyyMMdd yyyy-MM-dd hh:mm:ss
 * yyyy.MM.dd hh:mm
 *
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//获取系统时间、系统时间之前或者之后的日期  GetDateStr(-1)---系统时间前一天
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
    return y+"-"+m+"-"+d;
}
/*删除数组元素*/
function deleArr(count,arr){
    for(var i=0; i<arr.length;i++){
        if(arr[i]==count){
            arr.splice(i,1);
            i--;
        }
    }
    return arr
}
/*jsonToString*/
function jsonToString(json){
    var str=''
    for(var key in json){
        str+='&'+key+'='+json[key]
    }
    return str.substring(1,str.length);
}
var times1,times2,times3;
function Ydata(time){
    var year=time.substr(0,4);
    //alert(year);
    var index1=time.indexOf("-");
    var index2=time.lastIndexOf("-");
    var cha=parseInt(index2)-(parseInt(index1)+1);
    var month=time.substr((parseInt(index1)+1),cha);
    // alert(month);
    var kg=time.indexOf(" ");
    cha=parseInt(kg)-parseInt(index2);
    var day=time.substr(parseInt(index2)+1,cha);
    //alert(day);
    var mh=time.indexOf(":");
    cha=parseInt(mh)-(parseInt(kg)+1);
    var hour=time.substr(parseInt(kg)+1,cha);
    //alert(hour);
    var mh2=time.lastIndexOf(":");
    cha=parseInt(mh2)-(parseInt(mh)+1);
    var hour2=time.substr(parseInt(mh)+1,cha);
    // alert(hour2);
    var mh2=time.lastIndexOf(":");
    var hour3=time.substr(parseInt(mh2)+1);
    //alert(hour3);
    times1=month+'-'+day+''+hour+':'+hour2+':'+hour3;
    times2=month+'.'+day;
    times3=month+'-'+day+''+hour+':'+hour2;
}
function showalert(level,msg,stoptime){
    //level 警告框级别，0-2 共4个级别;
    //msg 警告框内容;
    //几秒后关闭，不填代表不关闭;
    var iDiv=$('<div class="alert in"><p></p></div>');
    iDiv.appendTo('body');
    if (level==0){
        $('.alert').addClass('alert-info'); //0，黑色背景，信息提示
    }else if ((level==1)){
        $('.alert').addClass('alert-success'); //1，绿色背景，代表成功，警告
    }else if ((level==2)){
        $('.alert').addClass('alert-warning'); //2，红色背景，代表错误，严重
    }else{
        $('.alert').addClass('alert-info');  //默认黑色背景，代表信息提示
    }
    $('.alert p').text(msg);
    if (stoptime!=''){
        setTimeout("$('.alert').removeClass('in');$('.alert').remove();",stoptime*1000);
    }
}
function showalert1(level,msg,stoptime){
    //level 警告框级别，0-2 共4个级别;
    //msg 警告框内容;
    //几秒后关闭，不填代表不关闭;
    var iDiv=$('<div  id="cover"><div class="Y_MyserAlert in"><p></p></div></div>');
    iDiv.appendTo('body');
    if (level==0){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info'); //0，黑色背景，信息提示
    }else if ((level==1)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-success'); //1，绿色背景，代表成功，警告
    }else if ((level==2)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-warning'); //2，红色背景，代表错误，严重
    }else{
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info');  //默认黑色背景，代表信息提示
    }
    $('.Y_MyserAlert p').text(msg);
    if (stoptime!=''){
       setTimeout("$('.Y_MyserAlert').removeClass('in');$('.Y_MyserAlert').remove();$('#cover').remove();",stoptime*1000);
    }
}

function Y_MyserTimeBtn(level,msg,stoptime){
    //level 警告框级别，0-2 共4个级别;
    //msg 警告框内容;
    //几秒后关闭，不填代表不关闭;
    var iDiv=$('<div id="cover"><div class="Y_MyserAlert in Y_MyserTime"><p></p><div><button class="Y_btn1s">离开</button><button class="Y_btn2s">返回</button></div></div></div>');
    iDiv.appendTo('body');
    if (level==0){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info'); //0，黑色背景，信息提示
    }else if ((level==1)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-success'); //1，绿色背景，代表成功，警告
    }else if ((level==2)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-warning'); //2，红色背景，代表错误，严重
    }else{
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info');  //默认黑色背景，代表信息提示
    }
    $('.Y_MyserAlert p').text(msg);
}

function Y_MyserTimeBtn1(level,msg,stoptime){
    //level 警告框级别，0-2 共4个级别;
    //msg 警告框内容;
    //几秒后关闭，不填代表不关闭;
    var iDiv=$('<div id="cover"><div class="Y_MyserAlert in Y_MyserTime"><p></p><div><button class="Y_btn1s">取消</button><button class="Y_btn2s"><a download="abc.pdf" href="http://yidoka-admin.oss-cn-beijing.aliyuncs.com/develop/news-article/7514130530">确认</a> </button></div></div></div>');
    iDiv.appendTo('body');
    if (level==0){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info'); //0，黑色背景，信息提示
    }else if ((level==1)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-success'); //1，绿色背景，代表成功，警告
    }else if ((level==2)){
        $('.Y_MyserAlert').addClass('Y_MyserAlert-warning'); //2，红色背景，代表错误，严重
    }else{
        $('.Y_MyserAlert').addClass('Y_MyserAlert-info');  //默认黑色背景，代表信息提示
    }
    $('.Y_MyserAlert p').text(msg);
}
function showLoading(){
    var iDiv=$('<div class="mhloading"><p>加载中...</p></div>');
    iDiv.appendTo('body');
}
function hideLoading(){
    $('.mhloading').remove();
}

function saveLoading(){
   var iDiv=$('<div class="saloading"><p>保存中...</p></div>');
   iDiv.appendTo('body');
}
function hidesaveLoading(){
   $('.saloading').remove();
}

function H_saveLoading(){
   var iDiv=$('<div class="H_tc_box">\n' +
      '        <div class="H_tc"></div>\n' +
      '        <div class="H_tc_disease">\n' +
      '            <img src="../images/loading.gif"/>\n' +
      '            <h3>保存中--</h3>\n' +
      '        </div>\n' +
      '    </div>');
   iDiv.appendTo('body');
}
function H_hidesaveLoading(){
   $('.H_tc_box').remove();
}



function showError(text){
    var iDiv;
    if(text!=undefined && text!=''){
        iDiv=$('<div class="error-container"><img src="../images/noadvice.png"/><h3>'+text+'</h3></div>');
    }else{
        iDiv=$('<div class="error-container"><img src="../images/Y_BG1.png"/><h3>加载失败</h3></div>');
    }
    $('.JcontentBox *').hide();
    iDiv.appendTo('.JcontentBox');
}
function hideError(){
    $('.JcontentBox *').show();
    $('.error-container').remove();
}
//数组去重
function select(arr){
    arr.sort;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == arr[i+1]) {
            arr.splice(i,1)
            i--;
        }
    }
    return arr;
}

//获取当前的时间
var Y_data;
function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    var d=today.getDate();
    Y_data=d;
    return h+"-"+m+"-"+d;
}
/*日期不满两位补零*/
function Appendzero(obj) {
    if(obj<10) return "0" +""+ obj;
    else return obj;
}

//(\n)换行成（br）
function interlacHuo(msg) {
   if (msg == '' || msg == null) {
      return ''
   } else {
      return msg.replace(/\n/g, '</br>');
   }
};
/*返回*/
$('.J_jumpBtn').on('tap',function(){
    jumpMobil();
});
function jumpMobil(){
    if(window.webkit){
        window.webkit.messageHandlers.backPresent.postMessage('');
    }else if(window.jsObj){
        window.jsObj.jumpMobil();
    }
}
// 电话点击事件
function chatOrDial(num) {
   var chatOrDial_ios = {
      'chatOrDial': num
   };
   var  chatOrDial_data = JSON.stringify(chatOrDial_ios);
   if(window.webkit){
      window.webkit.messageHandlers.chatOrDial.postMessage(chatOrDial_data);
   }else if(window.jsObj){
      window.jsObj.chatOrDial(num);
   }
}

// 返回数字
function removeFormatMoney(s) {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}

/*
 * formatMoney(s,type)
 * 功能：金额按千位逗号分隔
 * 参数：s，需要格式化的金额数值.
 * 参数：type,判断格式化后的金额是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
function to(s, type) {
    if (/[^0-9\.]/.test(s))
        return "0.00";
    if (s == null || s == "null" || s == "")
        return "0.00";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    return s;
}
/*
/!*计算年龄*!/
function parseDate(str){
    if(str.match(/^\d{4}[\-\/\s+]\d{1,2}[\-\/\s+]\d{1,2}$/)){
        return new Date(str.replace(/[\-\/\s+]/i,'/'));
    }
    else if(str.match(/^\d{8}$/)){
        return new Date(str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6));
    }
    else{
        return ('时间转换发生错误！');
    }
}
function GetAgeByBrithday(birthday){
    var age=-1;
    var today=new Date();
    debugger;
    var todayYear=today.getFullYear();
    var todayMonth=today.getMonth()+1;
    var todayDay=today.getDate();
    if(parseDate(birthday)!='时间转换发生错误！'){
        birthday=parseDate(birthday);
        birthdayYear=birthday.getFullYear();
        birthdayMonth=birthday.getMonth()+1;
        birthdayDay=birthday.getDate();
        if(todayYear-birthdayYear<0){
            alert("出生日期选择错误!");
        }else{
            //如果现在-生日>0 则直接相减
            //如果现在-生日=0 对比日 如果当前日-日>0 则直接相减；<0 则-1
            //如果现在-生日<0 则-1
            if(todayMonth*1-birthdayMonth*1>0){
                age = (todayYear*1-birthdayYear*1);
            }else if(todayMonth*1-birthdayMonth*1==0){
                if(todayDay-birthdayDay>=0){
                    age = (todayYear*1-birthdayYear*1);
                }else{
                    age = (todayYear*1-birthdayYear*1)-1;
                }
            }else{
                age = (todayYear*1-birthdayYear*1)-1;
            }
        }
        return age*1;
    }
    else{
        return -1;
    }
}*/
//新增方法
var GHUTILS = {
    eChange:{
        isPlaceholder:("placeholder" in document.createElement("input")),
        COM:function(e,c){
            var e=e ? ($(e).is('[txtype]')?$(e):$(e).find('[txtype]')) : $('[txtype]'); //input Dom对象
            var objThis=this,
                domInput=$('<input type="text" />')[0],
                bind_name = ('oninput' in domInput) ? 'input blur' :  ( !$.support.leadingWhitespace ? 'keyup blur' : (('onpropertychange' in domInput) ? 'propertychange' : 'keyup blur') );
            bind_name=c?c:bind_name;//input blur 事件类型
            e.bind(bind_name,function(){
                var regs,
                    wz=$(this).is(':focus')&&GHUTILS.getLocation($(this)[0]); //获取光标位置
                if($(this).attr('txtype') in objThis.regData){
                    regs=objThis.regData[$(this).attr('txtype')];
                }else{
                    regs=eval($(this).attr('txtype'));
                }
                if($(this).is('[input-func-before]')){ eval($(this).attr('input-func-before')); }
                if(typeof(regs)==='function'){
                    var matchArr=regs($(this).val());
                }else{
                    var matchArr=$(this).val().match(regs);
                    matchArr=(matchArr ? matchArr : '')[0];
                }

                (!objThis.isPlaceholder)&&(matchArr=matchArr||$(this).attr('placeholder'));
                $(this).val(matchArr);
                if($(this).is('[input-func-after]')){ eval($(this).attr('input-func-after')); }
                $(this).is(':focus')&&GHUTILS.setLocation($(this)[0],wz);
            });
        },
        regData:{
            'phoneCode':/[0-9A-z]{0,6}/,
            'tel_move':/(1([3-9]\d{0,9})?)?/, //手机号码
            'Int':/([0-9]+)?/, //小数
            'ageInt':/([0-9]{0,3})?/, //年龄
            'FloatZ':/([0-9]+(\.)?[0-9]{0,2})?/, //小数
            'FloatZ100':/(100|([0-9]{1,2}(\.[0-9]{0,2})?))?/, //100以内小数
            'FloatZ5W':/(50000|([1-4]?[0-9]{0,4}(\.[0-9]{0,2})?))?/,
            'FloatZ100W':/[1-9]?\d{0,6}(\.\d{0,2})?/,
            'FloatZ5W':/50000|[1-4]?[0-9]{0,4}(\.\d{0,2})?/,
            'FloatZ1000W':/[1-9]?\d{0,7}(\.\d{0,4})?/, //允许四位小数
        }
    },
    getLocation:function(elm) { //获取光标位置
        if(elm.createTextRange&&document.selection) { // IE
            var range = document.selection.createRange();
            range.setEndPoint('StartToStart', elm.createTextRange());
            return range.text.length;
        } else if(typeof elm.selectionStart == 'number') { // Firefox
            return elm.selectionStart;
        }
    },
    setLocation:function(elm, n) { //设置光标位置
        if(n > elm.value.length){ n = elm.value.length; };
        if(elm.createTextRange) {   // IE
            var textRange = elm.createTextRange();
            textRange.moveStart('character', n);
            textRange.collapse();
            textRange.select();
        } else if(elm.setSelectionRange) { // Firefox
            elm.setSelectionRange(n, n);
            elm.focus();
        }
    },
    //打开新页面
    OPENPAGE:function(op){
        //op -- >url,extras.
        if(!op.url){ return;}
        window.location.href = GHUTILS.buildQueryUrl(op.url,op.extras);
    },
    //象转换成带参数的形式 &a=1&b=2
    buildQueryUrl:function(url,param){
        var x = url;
        var ba = true;
        var allurl = '';
        if(x.indexOf('?')!=-1){
            if(x.indexOf('?')==url.length-1){
                ba = false;
            }else{
                ba = true;
            }
        }else{
            ba = false;
        }
        var builder = '';
        for(var i in param){
            var p = '&'+i+'=';
            if(param[i]||(param[i]+''=='0')){
                var v = param[i];
                if(Object.prototype.toString.call(v)==='[object Array]'){
                    for(var j = 0; j<v.length; j++){
                        builder = builder + p + encodeURIComponent(v[j])
                    }
                }else if(typeof(v)=="object"&&Object.prototype.toString.call(v).toLowerCase()=="[object object]"&&!v.length){
                    builder = builder+p+encodeURIComponent(JSON.stringify(v));
                }else{
                    builder = builder + p + encodeURIComponent(v);
                }
            }
        }
        if(!ba){
            builder = builder.substring(1);
        }
        if(builder){
            x = x + '?';
        }
        return x + builder;
    },
    /*
	@公共弹框集合(显示部分可控、按钮可控)
	1.默认弹框:
	GHUTILS.PopBoxFunc.OpenPopBox('内容',{tit:'标题',btns:'<a href="javascript:;" class="closepop">取消</a><a href="#">确定</a>'});
	2.默认叉关闭弹框:
	GHUTILS.PopBoxFunc.OpenPopBox('内容',{tit:'标题',btns:false,OnlyCloseBtn:true});
	3.橙色头弹框:
	GHUTILS.PopBoxFunc.OpenPopBox('内容',{tit:'标题',btns:'<a href="javascript:;" class="closepop">取消</a><a href="#">确定</a>',ClassName:"com_yellow_pop"});
	4.橙色头叉关闭弹框:
	GHUTILS.PopBoxFunc.OpenPopBox('内容',{tit:'标题',btns:false,OnlyCloseBtn:true,ClassName:"com_yellow_pop"});
	...
	*/
    PopBoxFunc:{
        BackMask:function(){
            var bMask = '<div class="com_mask" style="position:fixed; top:0px; right:0; bottom:0; left:0; background:#000; opacity:0.8; display:block; z-index:101;"></div>';
            return bMask;
        },
        OpenPopBox:function(txt,obj){
            var Po = {tit:'',btns:'<a href="javascript:;" class="closepop">确定</a>',ClassName:'',OnlyCloseBtn:false,closeCallback:function(){}}, Po = $.extend({},Po,obj);
            var str = /^\s*\<[\s\S]*\>\s*$/g;
            var txt = str.test(txt)==false?'<div class="com_onlytxt">'+txt+'</div>':txt,
                PopBoxT = Po.tit==false?'':'<div class="com_pop_t">'+ Po.tit +'</div>',
                PopBoxBtn = Po.btns==false?'':'<div class="com_pop_btn">'+ Po.btns +'</div>';
            var PopBox = $('<section class="com_pop mui-text-center com_pop_js '+ Po.ClassName +'"><div class="com_pop_box">'+PopBoxT+'<div class="com_pop_c">'+ txt +'</div>'+PopBoxBtn+'</div></section>');
            var PBtn = PopBox.find(".com_pop_btn a"), PBtnNum = PBtn.length;
            PBtn.css("width",100/PBtnNum+"%");
            var Cross = '<a href="javascript:;" class="cross closepop"></a>';
            if(Po.OnlyCloseBtn==true){PopBox.append(Cross);};
            PopBox.appendTo("body");
            PopBox.before(GHUTILS.PopBoxFunc.BackMask());
            $(window).on("touchmove",function(e){ e.preventDefault();}); $(".com_pop_c").on("touchmove",function(e){ e.stopPropagation();});
            $(".com_pop").one("tap",".closepop",function(){GHUTILS.PopBoxFunc.ClosePopBox(Po.closeCallback);});
        },
        ClosePopBox:function(closeCallback){
            var Pop = $(".com_pop");
            if(Pop.hasClass("com_pop_js")){ $(".com_pop").remove(); $(".com_mask").remove();}
            $(window).off("touchmove"); $(".com_pop_c").off("touchmove");
            closeCallback&&closeCallback();
        }
    },
    //唤醒、引导下载app  该地址为应用宝地址
    openApp:function(){
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jky.doctor";
    },
    //积分任务
    integration:function (value, callback) {
        var JAridata={
            'pathL':"/doctor/creditDoctorTask/doTask",
            'taskTag': value,
            'accessToken':token
        }
        Ajax({
            url:servUrl,
            data:JAridata,
            async: false,
            beforeSend: function(){},
            type : 'post',
            dataType : "json",
            success:function(res){
                //回调
                if(callback && typeof(callback) == 'function'){
                    callback.apply(null, arguments);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    },
    integration_toast:function (txt, point, stoptime){
        //txt 警告框内容;
        //point 积分数值;
        //stoptime 几秒后关闭，不填代表不关闭;
        var iDiv=$('<div class="integration in"><span class="txt"></span><span class="point"></span><img src="../../images/point_increase.png" alt=""></div>');
        iDiv.appendTo('body');
        $('.integration .txt').text(txt);
        $('.integration .point').text('+' + point);
        if (stoptime!=''){
            setTimeout("$('.integration').removeClass('in');$('.integration').remove();",stoptime*1000);
        }
    },
    openInstall:function () {
        //openinstall初始化时将与openinstall服务器交互，应尽可能早的调用
        /*web页面向app传递的json数据(json string/js Object)，应用被拉起或是首次安装时，通过相应的android/ios api可以获取此数据*/
        var data = OpenInstall.parseUrlParams();//openinstall.js中提供的工具函数，解析url中的所有查询参数
        // console.log(data);
        new OpenInstall({
            /*appKey必选参数，openinstall平台为每个应用分配的ID*/
            appKey : "t9kjup",
            /*可选参数，自定义android平台的apk下载文件名；个别andriod浏览器下载时，中文文件名显示乱码，请慎用中文文件名！*/
            //apkFileName : 'com.fm.openinstalldemo-v2.2.0.apk',
            /*可选参数，是否优先考虑拉起app，以牺牲下载体验为代价*/
            preferWakeup:true,
            /*自定义遮罩的html*/
            mask:function(){
                return "<div id='openinstall_shadow' style='position:fixed;left:0;top:0;background:rgba(0,0,0,0.5);filter:alpha(opacity=50);width:100%;height:100%;z-index:10000;'><div class='guideTxt' style='padding:0.4rem 0;width:10.98rem;float: left;margin-left: 0.6rem;margin-top: 1.5rem;background: #ffffff;border-radius: 8px;'><h1 style='font-size: 0.6rem;margin-bottom: .04rem;color: #333333;padding-left: 0.48rem;line-height: 0.92rem;'>点击右上角选择浏览器打开</h1><p style='font-size: 0.48rem;color: #666666;line-height: 0.68rem;padding-left: 0.6rem;'>如浏览器打开失败，请移步桌面直接打开应用</p></div><img src='../images/guideTobrowser.png' alt='' style='width: 2.1rem;height: 1.68rem;float: left;margin-left: 0.1rem;margin-top: 0.1rem;'></div>"
            },
            /*openinstall初始化完成的回调函数，可选*/
            onready : function() {
                var m = this,
                    button = document.getElementById("openApp"),  //打开 按钮
                    getMoreBtn = document.getElementById("getMoreBtn"); //打开APP查看更多详情 按钮
                button.style.visibility = "visible";

                //如果存在该id执行唤起app操作  
                if(document.getElementById("videoOpenApp")){
                    var videoOpenApp = document.getElementById("videoOpenApp");  //课程直播、课程学习  那个播放按钮图标
                    videoOpenApp.style.visibility = 'visible';
                    videoOpenApp.onclick = function(){
                        m.wakeupOrInstall();
                        return false;
                    };
                }
                /*在app已安装的情况尝试拉起app*/
                m.schemeWakeup();
                /*用户点击某个按钮时(假定按钮id为downloadButton)，安装app*/
                button.onclick = function() {
                    m.wakeupOrInstall();
                    return false;
                };
                getMoreBtn.onclick = function() {
                    m.wakeupOrInstall();
                    return false;
                };
            }
        }, data);
    }
}

