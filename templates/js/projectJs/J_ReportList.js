$(function(){
    // var token=sessionStorage.getItem('patientToken');
   /* var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjM0NDg0MDYsInN1YiI6IntcImltQWNjaWRcIjpcImxvY2FsX21lbWJlcl8xN1wiLFwiaW1Ub2tlblwiOlwiYWU4Nzg2ZTgwZjY2MGVhZWQ4MjlmYjczOGJiMGU4ODBcIixcImluZGV4XCI6MCxcInJvbGVUeXBlXCI6MCxcInNlc3Npb25JZFwiOlwiNDM5MjBDRjM2MEYwODU1MDI4RTY0OEIyRDY3MkQ3M0JcIixcInVzZXJBZ2VudFwiOlwiUG9zdG1hblJ1bnRpbWUvNi40LjFcIixcInVzZXJJZFwiOjE3fSIsImV4cCI6MTU1NDk4NDQwNn0.3BYzqTqEPed6Z8R5riQMJNCGpC2bskY-KN8nQwRhcaA';*/
    var userId=getRequestParam('userId');// 从Url里面传过来
    var signInfoId=getRequestParam('signInfoId');
    var now = new Date(); //当前日期
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth()+1; //当前月
    var nowYear = now.getFullYear(); //当前年
    //加载当前年的无数据月份,加载初始化出来的月份，加载第一个月份的数据
    loadyearMonth(nowYear);
    function loadyearMonth(nowYear,btn){
        var YData={
            'pathL':"/health/healthReport/getReportMonth",
            'accessToken':token,
            'memberId':'553', //140
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
                    var data=res;
                    var last=addZero(nowMonth)+'.01~'+addZero(nowMonth)+'.'+addZero(new Date(nowYear,nowMonth,0).getDate());
                    var oneData={
                        'year':nowYear,
                        'month':addZero(nowMonth),
                        'monthLast':last
                    }
                    var idata =$.extend({},oneData,data);
                    var topHtml= new EJS({url:"../compileEjs/J_ReportList.ejs"}).render({data:idata,userId:userId});
                    $('.JreportListCon').html(topHtml);
                }else{
                    showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
                }
            },
            error:function(res){
                debugger;
                //showalert(0,'请求失败',2);
            }
        });
    }
    $('.patientBack').on('tap',function(){
        var iH="J_signPDetail.html?memberId="+userId+"&signInfoId="+signInfoId+"";  //?memberId=321&signInfoId=2
        window.location.href=iH;
    })
    function addZero(n){
        if(n<10){
            return '0' + n;
        }
        return '' + n;
    }
})























