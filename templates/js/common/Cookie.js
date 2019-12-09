//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。   
function setCookie(name, value/*,hours,path*/) {
    var name = escape(name);
    var value = escape(value);
    /*var expires = new Date(); */
    /*expires.setTime(expires.getTime() + hours*3600000);   
     path = path == "" ? "" : ";path=" + path;
     _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
     document.cookie = name + "=" + value + _expires + path; */
    document.cookie = name + "=" + value + ";path=/";
}
//获取cookie值方法
function getCookieValue(name) {
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie   
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置   
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1) {
        var start = pos + name.length;                  //cookie值开始的位置   
        var end = allcookies.indexOf(";", start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置`                                     `
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie   
        var value = allcookies.substring(start, end);  //提取cookie的值
        return unescape(value);                                      //对它解码
    }
    else return "";                                             //搜索失败，返回空字符串
}

function delCookie(name) {
    setCookie(name,'',-1);
   /* var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookieValue(name);
    if (cval != null){
        document.cookie = name + "=" + '' + ";path=/";
        return unescape(value);                           //对它解码         
    }
    else return "";      */                                       //搜索失败，返回空字符串
}

/*eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjQ1NDE0NTAsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMDE5XCIsXCJpbVRva2VuXCI6XCJhNDI5ZWVlYWRmOWI3Yzg5YTBmODNlNTEzZDVhZDFhY1wiLFwiaW5kZXhcIjo3MCxcInJvbGVUeXBlXCI6MixcInNlc3Npb25JZFwiOlwiMEM3RUNCOUYzQzk5ODQxNjgyQjg3OTYxOEQ3MjU1OThcIixcInVzZXJBZ2VudFwiOlwib2todHRwLzMuMC4xXCIsXCJ1c2VySWRcIjoxMDAwMTl9IiwiZXhwIjoxNTU2MDc3NDUwfQ.kOP97QSOQzky1h3KNGB4fZAQYh11i4NuQ6eJ8q2J_nU*/
var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1NzA3Nzc0ODgsInN1YiI6IntcImltQWNjaWRcIjpcInRlc3RfZG9jdG9yXzEwMDAwMV8xNTM0OTI2MzY5XCIsXCJpbVRva2VuXCI6XCIxNWZiMDk4NTEyNzQ3YTM1ZjI1NTkyNWZmNWI1NjExZFwiLFwiaW5kZXhcIjozOTIsXCJyZWZyZXNoVG9rZW5cIjpmYWxzZSxcInJvbGVUeXBlXCI6MixcInVzZXJBZ2VudFwiOlwiWllEb2N0b3IvMi4wLjAgKGlQaG9uZTsgaU9TIDEyLjQ7IFNjYWxlLzMuMDApXCIsXCJ1c2VySWRcIjoxMDAwMDF9IiwiZXhwIjoxNTc1OTYxNDg4fQ.TudZp0rB34xXYTiKdbQSgwbMl5lu-RS9ZUDd12O4uNQ';
// if(getCookieValue("accessToken")==(null) ||getCookieValue("accessToken")=='(null)' || getCookieValue("accessToken")=="" || getCookieValue("accessToken")=="null" || getCookieValue("accessToken")==null || getCookieValue("accessToken")==undefined || getCookieValue("accessToken")=="undefined" || getCookieValue("accessToken").length==0){
//     token='';
// }else{
//     token=getCookieValue("accessToken");
// }

/*var token = getCookieValue("accessToken")==""?'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjQ1NDE0NTAsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMDE5XCIsXCJpbVRva2VuXCI6XCJhNDI5ZWVlYWRmOWI3Yzg5YTBmODNlNTEzZDVhZDFhY1wiLFwiaW5kZXhcIjo3MCxcInJvbGVUeXBlXCI6MixcInNlc3Npb25JZFwiOlwiMEM3RUNCOUYzQzk5ODQxNjgyQjg3OTYxOEQ3MjU1OThcIixcInVzZXJBZ2VudFwiOlwib2todHRwLzMuMC4xXCIsXCJ1c2VySWRcIjoxMDAwMTl9IiwiZXhwIjoxNTU2MDc3NDUwfQ.kOP97QSOQzky1h3KNGB4fZAQYh11i4NuQ6eJ8q2J_nU':getCookieValue("accessToken");*/
//var token== getCookieValue("accessToken")==""?'':getCookieValue("accessToken");
var channelId=getCookieValue('channelId');
var ip = getCookieValue("ip")==""?'123.125.71.38':getCookieValue("ip");
var uuid = getCookieValue("uuip")==""?'001':getCookieValue("uuip");
var userAgent = getCookieValue("appid")==""?'0':getCookieValue("appid");
var familyId=getCookieValue("familyId")==""?'27':getCookieValue("familyId");
var city=getCookieValue("city")==""?"":getCookieValue("city");
var age='0';
var userId=getCookieValue("userId")=="" ? '' : (getCookieValue("userId")=="(null)" ? '' : getCookieValue("userId"));
var endTime = getCookieValue("endtime")==""?'':getCookieValue("endtime");
var uid = getCookieValue("uid")==""?'0':getCookieValue("uid");
var memberId=getCookieValue("memberId")==""?'563':getCookieValue("memberId");




