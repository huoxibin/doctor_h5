var maxId=0;
var YData;
//页面初始化
window.onload = function(){
    if(endTime==''){
        endTime=today();
    }else{
        endTime=endTime;
    }
    dataTime();
};
//右侧开始部分
/*访客接口*/
function visitor(startTime,endTime){
    YData={
        'pathL':"/health/bloodPressure/listByVisitor",
        'accessToken':token,
        'endTime':endTime,
        'startTime':startTime,
        'isGroup':false,
    }
    loadAction(YData);
}
/*非访客接口*/
function Notvisitor(maxId,startTime,endTime){
    YData={
        'pathL':"/health/bloodPressure/list",
        'endTime':endTime,
        'isGroup':false,
        'maxId':maxId,
        'startTime':startTime,
        'accessToken':token,
        'uid':uid
    }
    loadAction(YData);
}

//初始状态，加载数据
function loadAction(YData){
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
                    var PtrendData={};
                    var PPulseData=[];
                    PtrendData.Hdata=[]; PtrendData.Ldata=[];PtrendData.YpressureHead=[];
                    for(i in data.item){
                        //高压
                        PtrendData.Hdata.push(data.item[i].sbp)
                        //低压
                        PtrendData.Ldata.push(data.item[i].dbp);
                        //脉压差
                        PtrendData.YpressureHead.push(data.item[i].pressureHead);
                        //心率
                        PPulseData.push(data.item[i].heartRate);
                    }
                    var numbers = [PtrendData.Hdata.length,PtrendData.Ldata.length,PtrendData.YpressureHead.length];
                    var maxInNumbers = Math.max.apply(null, numbers);//最大数
                    initPtrend(PtrendData,maxInNumbers);     //初始化血压趋势
                    initPPulse(PPulseData,PPulseData.length);
            }else{
                showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
            }
        },
        error:function(res){
        }
    });
}


function dataTime(){
    /*var currYear = (new Date()).getFullYear();*/
    var now = new Date();
    var currYear = now.getFullYear();
    var currMonth = now.getMonth() + 1;
    var currDay = now.getDate();
    var opt={};
    opt.date = {preset : 'date'};
    opt.datetime = {preset : 'datetime'};
    opt.time = {preset : 'time'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear - 1900, //开始年份
        endYear: currYear + 2000, //结束年份
        maxDate: new Date(currYear, currMonth - 1, currDay)
    };
    var times;
    if(endTime==''){
        var iTime=today();
        Y_DateTime(6,iTime);
        times=today();
    }else{
        Y_DateTime(6,endTime);
        times=endTime;
    }
    if(uid=='-1'){
        $("#appDate1").val(today());//结束时间
        $('#appDate').val('2017-01-01');//开始时间
        $('#appDate,#appDate1').attr("disabled", true);
        visitor(Y_time,times)
    }else{
        $('#appDate,#appDate1').removeAttr("disabled");
        $("#appDate").mobiscroll($.extend(opt['date'], opt['default']));
        $("#appDate1").mobiscroll($.extend(opt['date'], opt['default']));
        $("#appDate1").val(endTime);//结束时间
        $('#appDate').val(Y_time);//开始时间
        Notvisitor(maxId,Y_time,times);
    }

}
//获取当前的时间
function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    var d=today.getDate();
    return h+"-"+m+"-"+d;
}
//设置日期，当前日期的前六天
var Y_time;
function Y_DateTime(data,imyDate){
    var myDate = new Date(imyDate); //获取今天日期
    var datass;
    if(imyDate!=undefined){
        datass=imyDate.replace(/-/g, "/")
    }else{
        datass=imyDate
    }
    myDate = myDate.getFullYear() > 0 ? myDate : new Date(datass);
    myDate.setDate(myDate.getDate() - data);
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < data; i++) {
        dateTemp =myDate.getFullYear()+"-"+ (myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    Y_time=dateArray[0]
}
/*function Y_DateTime(data,myDate){
    var myDate = new Date(myDate); //获取今天日期
    myDate.setDate(myDate.getDate() - data);
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < data; i++) {
        dateTemp =myDate.getFullYear()+"-"+ (myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    Y_time=dateArray[0]
}*/

//初始化折线图 血压趋势
function initPtrend(data,maxInNumbers){
    var arrNumbers=[];
    for(var i=0;i<maxInNumbers;i++){
        arrNumbers.push(i)
    }
    var myChart = echarts.init(document.getElementById('Ptrend_area'));
    var option = {
        legend: {
            itemGap: 20,
            bottom: -3,
            selectedMode:false,
            data:[{name:'高压',    //图例的设置只能在这边
                icon:'circle',
                textStyle:{
                    color: '#FF6464',
                    fontSize:'14',
                    padding: [0,0,0,14]
                },
            },{name:'低压',
                icon:'circle',  //设置lengend的样式
                textStyle:{
                    color: '#33D6AC',
                    fontSize:'14',
                    padding: [0,0,0,14]   //设置文字和图标之间的距离
                },
            },{name:'脉压差',
                icon:'circle',  //设置lengend的样式
                textStyle:{
                    color: '#940000',
                    fontSize:'14',
                    padding: [0,0,0,14]   //设置文字和图标之间的距离
                },
            }]
        },
        xAxis:  {
            name: '趋势',
            type: 'category',
            nameLocation:"end",
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color:'rgba(205,205,205,0.80)'
                }
            },
            nameTextStyle:{
                color:"#7F7F7F",
                fontSize:13,
                padding:[22,0,0,-40]
            },
            fontSize:13,
            boundaryGap: false,
            data: arrNumbers, //个数是后台数据的个数
            axisLabel: {  //轴线上面文字的设置
                textStyle: {
                    color: '#fff',
                }
            },
            axisTick:{
                show:false
            }
        },
        yAxis : [
            {
                name: 'mmHg',
                nameGap: 15,
                position: 'left',
                nameTextStyle:{
                    color:'#7F7F7F',
                    fontSize :13,
                },
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'rgba(205,205,205,0.80)'
                    }
                },
                minInterval: 1,
                min:0,
                max: function(value) {
                    return value.max + 60;
                },
                interval:20,
                axisTick:{
                    show:false
                },
                axisLabel: {  //轴线上面文字的设置
                    textStyle: {
                        fontSize:'13',
                        color:'#7f7f7f',
                        fontWeight:'normal'
                    }
                },
            }
        ],
        grid:{
            top:'12%',
            bottom :'5%',
            left:'8%',
            width:'80%',
            height:'75%'
        },
        series : [
            {
                name:'高压',
                type:'line',
                symbol:'',
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: '#FF6464'
                    }
                },
                markArea: {
                    silent: true,
                    data: [[{
                        yAxis: '90'
                    }, {
                        yAxis: '139'
                    }]]
                },
                data:data.Hdata,
            },
            {
                name:'低压',
                type:'line',
                symbol:'',
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: '#33D6AC'
                    }
                },
                markArea: {
                    silent: true,
                    data: [[{
                        yAxis: '60'
                    }, {
                        yAxis: '89'
                    }]]
                },
                data:data.Ldata,
            },
            {
                name:'脉压差',
                type:'line',
                symbol:'',
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: '#940000'
                    }
                },
                markArea: {
                    silent: true,
                    data: [[{
                        yAxis: '20'
                    }, {
                        yAxis: '60'
                    }]]
                },
                data:data.YpressureHead,
            }
        ]
    };
    myChart.setOption(option);
}
//初始化折线图 脉压差
function initPPulse(data,maxInNumbers){
    var arrNumbers=[];
    for(var i=0;i<maxInNumbers;i++){
        arrNumbers.push(i)
    }
    var myChart = echarts.init(document.getElementById('PPulse_area'));
    var option = {
        legend: {
            itemGap: 20,
            bottom: -3,
            data:[{name:'心率',    //图例的设置只能在这边
                icon:'circle',
                textStyle:{
                    color: '#09C116',
                    fontSize:'14',
                    padding: [0,0,0,14]
                },
            }]
        },
        xAxis:  {
            name: '趋势',
            type: 'category',
            nameLocation:"end",
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color:'rgba(205,205,205,0.80)'
                }
            },
            nameTextStyle:{
                color:"#7F7F7F",
                fontSize:13,
                padding:[22,0,0,-40]
            },
            boundaryGap: false,
            data:maxInNumbers,
            axisLabel: {  //轴线上面文字的设置
                textStyle: {
                    color: '#fff',
                }
            },
            axisTick:{
                show:false
            }
        },
        yAxis : [
            {
                name: 'bpm',
                nameGap: 15,
                position: 'left',
                nameTextStyle:{
                    color:'#7F7F7F',
                    fontSize :13,
                },
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'rgba(205,205,205,0.80)'
                    }
                },
                minInterval: 1,
                min:0,
                max: function(value) {
                    return value.max + 60;
                },
                interval:20,
                axisTick:{
                    show:false
                },
                axisLabel: {  //轴线上面文字的设置
                    textStyle: {
                        fontSize:'13',
                        color:'#7f7f7f',
                        fontWeight:'normal'
                    }
                },
            }
        ],
        grid:{
            top:'12%',
            bottom :'5%',
            left:'8%',
            width:'80%',
            height:'75%'
        },
        series : [
            {
                name:'心率',
                type:'line',
                symbol:'',
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: '#09C116 '
                    }
                },
                markArea: {
                    silent: true,
                    data: [[{
                        yAxis: '60'
                    }, {
                        yAxis: '100'
                    }]]
                },
                data:data,
            }
        ]
    };
    myChart.setOption(option);
}
