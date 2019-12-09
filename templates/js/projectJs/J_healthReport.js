$(function(){
   // var token=sessionStorage.getItem('patientToken');
   /*var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjM0NDg0MDYsInN1YiI6IntcImltQWNjaWRcIjpcImxvY2FsX21lbWJlcl8xN1wiLFwiaW1Ub2tlblwiOlwiYWU4Nzg2ZTgwZjY2MGVhZWQ4MjlmYjczOGJiMGU4ODBcIixcImluZGV4XCI6MCxcInJvbGVUeXBlXCI6MCxcInNlc3Npb25JZFwiOlwiNDM5MjBDRjM2MEYwODU1MDI4RTY0OEIyRDY3MkQ3M0JcIixcInVzZXJBZ2VudFwiOlwiUG9zdG1hblJ1bnRpbWUvNi40LjFcIixcInVzZXJJZFwiOjE3fSIsImV4cCI6MTU1NDk4NDQwNn0.3BYzqTqEPed6Z8R5riQMJNCGpC2bskY-KN8nQwRhcaA';*/
    var isUserId=getRequestParam('userId');   //从列表界面带过来userId   17;
    var month=getRequestParam('month');
    var monthId=getRequestParam('monthId');
    var yearMonth=[];
    var yearMonthId={};
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth()+1; //当前月
    var nowYear = now.getFullYear(); //当前年
    $('#Years').val(nowYear);
    $('#Month').val(nowMonth);
    loadData(monthId);  //加载数据
    var PPulseData=[];
    var SnumTimeData=[];   //血糖
    var PnumberData=[]
    var PtrendData={};
    //J_ReportList.html
   $('.monthRep i').text(month);
    $('.reportJump').on('tap',function(){
        if(getRequestParam('myBack')==1){ //我自己的跳转界面
            window.location.href='../html/J_ReportList.html?userId='+isUserId;
        }else{
            jumpMobil();
        }
    })
    function loadData(monthId){
        var YData={
            'pathL':"/health/healthReport/get",
            'accessToken':token,
            'memberId':isUserId,
            'id':monthId,
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
                    $('.J_Healthwrap').show();
                    var data=res.data.report;
                    //判断是否有血压
                    //判断是的有血糖
                    //判断
                    if(res.data.noreport==1){  //无数据
                        $('.J_Healthwrap').show();
                        $('.norepeat').show();
                        $('.nodata').hide();
                        $('.healthContent').hide();
                        getLastDay(res.data.reportYear,res.data.reportMonth);//没数据时候时间赋值
                        $('#healthNodata').show();
                    }else{
                        $('.healthContent').show();
                        $('#healthNodata').hide();
                        if(typeof(data)=='string'){
                            data= JSON.parse(data);
                        }
                        if(data.pressureResult==undefined || data.pressureResult==''){ //如果血压记录为空
                            getLastDay(res.data.reportYear,res.data.reportMonth);//没数据时候时间赋值
                            $('.healthPressure .healthNodataCon').show();
                            $('.healthPressure .healthList').hide();
                        }else{  //不为空赋值
                            $('.healthPressure .healthNodataCon').hide();
                            $('.healthPressure .healthList').show();
                            var iValmeas=data.pressureResult.measurement;
                            var iValtrend=data.pressureResult.trend;
                            var iValpulse=data.pressureResult.pulse;
                            //初始化饼状图 血压次数和相关建议
                            PnumberData[0]=iValmeas.toHigh;
                            PnumberData[1]=iValmeas.toLow;
                            PnumberData[2]=iValmeas.normal;
                            initPnumber(PnumberData);
                            var html=" <p>本月一共进行了"+iValmeas.count+"次血压测量，"+iValmeas.toHigh+"次血压属于“偏高血压”，"+iValmeas.toLow+"次血压属于“偏低血压”，"+iValmeas.normal+"次血压属于“正常血压”。</p><p>综合您这段时间测量的血压情况，"+iValmeas.advice+"</p>";
                            $('.Pnumber_text').html(html);

                            //初始化血压趋势
                            PtrendData.Hdata=[];
                            PtrendData.Ldata=[];
                            for(var i=0;i<iValtrend.chart.length;i++){
                                PtrendData.Hdata[i]=iValtrend.chart[i].sbp;
                                PtrendData.Ldata[i]=iValtrend.chart[i].dbp;
                            }
                            var dataLength1=iValtrend.chart.length;
                            initPtrend(PtrendData,dataLength1);     //初始化血压趋势
                            $('.Hsbp').text(iValtrend.trend.sbpHighBloodPressure.sbp+'mmHg');  //最高高压
                            $('.HsbpTime').text(addZero(iValtrend.trend.sbpHighBloodPressure.measureTime.monthValue)+'-'+addZero(iValtrend.trend.sbpHighBloodPressure.measureTime.dayOfMonth)+' '+addZero(iValtrend.trend.sbpHighBloodPressure.measureTime.hour)+':'+addZero(iValtrend.trend.sbpHighBloodPressure.measureTime.minute));
                            $('.Hdbp').text(iValtrend.trend.dbpHighBloodPressure.dbp+'mmHg');  //最高低压
                            $('.HdbpTime').text(addZero(iValtrend.trend.dbpHighBloodPressure.measureTime.monthValue)+'-'+addZero(iValtrend.trend.dbpHighBloodPressure.measureTime.dayOfMonth)+' '+addZero(iValtrend.trend.dbpHighBloodPressure.measureTime.hour)+':'+addZero(iValtrend.trend.dbpHighBloodPressure.measureTime.minute));
                            $('.Lsbp').text(iValtrend.trend.sbpLowBloodPressure.sbp+'mmHg');
                            $('.LsbpTime').text(addZero(iValtrend.trend.sbpLowBloodPressure.measureTime.monthValue)+'-'+addZero(iValtrend.trend.sbpLowBloodPressure.measureTime.dayOfMonth)+' '+addZero(iValtrend.trend.sbpLowBloodPressure.measureTime.hour)+':'+addZero(iValtrend.trend.sbpLowBloodPressure.measureTime.minute));
                            $('.Ldbp').text(iValtrend.trend.dbpLowBloodPressure.dbp+'mmHg');
                            $('.LdbpTime').text(addZero(iValtrend.trend.dbpLowBloodPressure.measureTime.monthValue)+'-'+addZero(iValtrend.trend.dbpLowBloodPressure.measureTime.dayOfMonth)+' '+addZero(iValtrend.trend.dbpLowBloodPressure.measureTime.hour)+':'+addZero(iValtrend.trend.dbpLowBloodPressure.measureTime.minute));
                            //初始化脉压差
                            PPulseData=iValpulse.differ;
                            var dataLength=iValpulse.differ.length;
                            initPPulse(PPulseData,dataLength);
                            $('.PPulse_text').text(iValpulse.advice);
                        }
                        if(data.sugarResult==undefined || data.sugarResult==''){  //如果血糖为空
                            getLastDay(res.data.reportYear,res.data.reportMonth);//没数据时候时间赋值
                            $('.healthSugar .healthNodataCon').show();
                            $('.healthSugar .healthList').hide();
                        }else{
                            $('.healthSugar .healthNodataCon').hide();
                            $('.healthSugar .healthList').show();
                            //初始化血糖
                            var iVal=data.sugarResult.bloodSugarTimes;
                            SnumTimeData[0]=iVal.emptyStomachCount;
                            SnumTimeData[1]=iVal.afterBreakfastCount;
                            SnumTimeData[2]=iVal.beforeLunchCount;
                            SnumTimeData[3]=iVal.afterLunchCount;
                            SnumTimeData[4]=iVal.beforeDinnerCount;
                            SnumTimeData[5]=iVal.afterDinnerCount;
                            SnumTimeData[6]=iVal.beforeBedCount;
                            initSnumTime(SnumTimeData);
                            //赋值给四个变量之后初始化四个图表
                            var html="<p>本月共测量血糖<i>"+data.sugarResult.totalTimes+"</i>次，其中：</p>";
                            for(var p=0;p<data.sugarResult.advice.length;p++){
                                html+="<p>"+(parseInt(p)+1)+"."+data.sugarResult.advice[p]+"</p>";
                            }
                            $('.SnumTime_text').html(html);
                        }
                    }
                }else{
                    showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
                }
            },
            error:function(res){
               // showalert(0,'请求失败',2);
            }
        });

    }

   //适配iphoneX
   if($(window).height()==812){
      $('.J_HealthwrapRepeat').css({
         'marginTop':'85px'
      });
   };


    function initPnumber(data){   //初始化饼状图 血压次数
        var myChart = echarts.init(document.getElementById('Pnumber_area'));
        var option = {
            legend: {
                top:150,
                left: 'center',
                itemGap:8,
                selectedMode:false,
                data:[{name:'偏高',    //图例的设置只能在这边
                    icon:'circle',
                    textStyle:{
                        color: '#ff5959',
                        fontSize:'14',
                        padding: [0,0,0,-8]
                    },
                },{name:'正常',
                    icon:'circle',  //设置lengend的样式
                    textStyle:{
                        color: '#4e7eff',
                        fontSize:'14',
                        padding: [0,0,0,-8]   //设置文字和图标之间的距离
                    },
                }, {name:'偏低',    //图例的设置只能在这边
                    icon:'circle',
                    textStyle:{
                        color: '#09C116',
                        fontSize:'14',
                        padding: [0,0,0,-8]
                    },
                }]
            },
            series: [
                {
                    name:'测量次数',
                    type:'pie',
                    selectedOffset:'2',
                    radius: [0, '84%'],
                    center : ['49%', '43%'],
                    label: {    //去掉饼图上面的字
                        normal: {
                            show: false
                        },
                    },
                    data:[
                        {value:data[0], name:'偏高', selected:true,
                            itemStyle: {
                                normal: {
                                    color: '#ff5959',
                                }
                            },
                        },
                        {value:data[2], name:'正常',selected:true,
                            itemStyle: {
                                normal: {
                                    color: '#4e7eff',
                                }
                            },
                        },
                        {value:data[1], name:'偏低',selected:true,
                            itemStyle: {
                                normal: {
                                    color: '#09C116',
                                }
                            },
                        }
                    ]
                },
            ]
        };
        myChart.setOption(option);
    }
    function initPtrend(data,dataLength){   //初始化折线图 血压趋势
        var myChart = echarts.init(document.getElementById('Ptrend_area'));
        var option = {
            legend: {
                itemGap: 20,
                right: 0,
                top:40,
                selectedMode:false,
                data:[{name:'高压',    //图例的设置只能在这边
                    icon:'circle',
                    textStyle:{
                        color: '#FF6464',
                        fontSize:'14',
                        padding: [0,0,0,2]
                    },
                },{name:'低压',
                    icon:'circle',  //设置lengend的样式
                    textStyle:{
                        color: '#45DAB5',
                        fontSize:'14',
                        padding: [0,0,0,2]   //设置文字和图标之间的距离
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
                    padding: [22, 0, 0,-40]
                },
                boundaryGap: false,
                data:dataLength, //个数是后台数据的个数
                /* axisLine: {    //轴线的设置
                 lineStyle: {
                 type: 'solid',
                 color: '#fff',//左边线的颜色
                 width:'2'//坐标线的宽度
                 }
                 },*/
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
                    nameTextStyle:{
                        color:'#7F7F7F',
                        fontSize :'13',
                        align:'left'
                    },
                    axisLine: {
                        lineStyle: {
                            color:'rgba(205,205,205,0.80)'
                        }
                    },
                    nameTextStyle:{
                        color:"#7F7F7F",
                        fontSize:13,
                    },
                    type: 'value',
                    splitLine: {
                        show: false
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
                            fontSize:'14',
                            color:'#7f7f7f',
                            fontWeight:'normal'
                        }
                    },
                }
            ],
            grid:{
                bottom :'20',
                right:'5',
                width:'88%',
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
                        },
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
                            color: '#45DAB5'
                        },
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
                }
            ]
        };
        myChart.setOption(option);
    }
    function initPPulse(data,dataLength){   //初始化折线图 脉压差
        var myChart = echarts.init(document.getElementById('PPulse_area'));
        var option = {
            legend: {
                itemGap: 20,
                right: 40,
                top:40,
                selectedMode:false,
                data:[{name:'脉压差',    //图例的设置只能在这边
                    icon:'circle',
                    textStyle:{
                        color: '#94000',
                        fontSize:'14',
                        padding: [0,0,0,2]
                    },
                }]
            },
            xAxis:  {
                name: '趋势',
                type: 'category',
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
                    padding: [22, 0, 0,-40]
                },
                //nameLocation:'middle',
                boundaryGap: false,
                data: dataLength, //个数是后台数据的个数
                axisLabel: {  //轴线上面文字的设置
                    textStyle: {
                        color: '#000',
                    }
                },
                axisTick:{
                    show:false
                }
            },
            yAxis : [
                {
                    name: 'mmHg',
                    nameTextStyle:{
                        color:'#7F7F7F',
                        fontSize :'14',
                        align:'left'
                    },
                    axisLine: {
                        lineStyle: {
                            color:'rgba(205,205,205,0.80)'
                        }
                    },
                    nameTextStyle:{
                        color:"#7F7F7F",
                        fontSize:13,
                    },
                    type: 'value',
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        show: false
                    },
                    /*  min: function(value) {
                     return value.min - 30;
                     },*/
                    max: function(value) {
                        return value.max + 40;
                    },
                    minInterval:20,
                    axisLabel: {  //轴线上面文字的设置
                        textStyle: {
                            fontSize:'14',
                            color:'#7f7f7f',
                            fontWeight:'normal'
                        }
                    },
                }
            ],
            grid:{
                bottom :'20',
                right:'2',
                width:'88%',
                height:'75%'
            },
            series : [
                {
                    name:'脉压差',
                    type:'line',
                    symbol:'',
                    symbolSize: 5,
                    itemStyle: {
                        normal: {
                            color: '#940000'
                        },
                    },
                    markArea: {
                        silent: true,
                        opacity:'0',
                        data: [[{
                            yAxis: '30'
                        }, {
                            yAxis: '50'
                        }]]
                    },
                    data:data,
                }
            ]
        };
        myChart.setOption(option);

    }
    function initSnumTime(data){  //初始化柱状图 血糖次数
        var myChart = echarts.init(document.getElementById('SnumTime_area'));
        var option = {
            xAxis: {
                axisTick:{
                    show:false
                },
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
                },
                axisLabel: {  //轴线上面文字的设置
                    textStyle: {
                        fontSize:'12',
                        color:'#7f7f7f',
                        fontWeight:'normal',
                        width:'15',
                        height:'60',
                       // fontStyle: 'italic',
                        align:'left',
                        lineHeight:60
                    }
                },
                data: ["空腹","早餐:后俩:小时","午餐:前","午餐:后俩:小时","晚餐:前","晚餐:后俩:小时",'睡前'].map(function (str) {
                    return str.replace(/:/g, '\n')
                })
            },
            yAxis: {
                name:'次数',
                nameTextStyle:{
                    color:'#7F7F7F',
                    fontSize :'14',
                    align:'left'
                },
                axisLine: {
                    lineStyle: {
                        color:'rgba(205,205,205,0.80)'
                    }
                },
                nameTextStyle:{
                    color:"#7F7F7F",
                    fontSize:13,
                },
                splitLine: {
                    show: false
                },
                axisTick:{
                    show:false
                },
                axisLabel: {  //轴线上面文字的设置
                    textStyle: {
                        fontSize:'14',
                        color:'#7f7f7f',
                        fontWeight:'normal'
                    }
                }
            },
            grid:{
                top :'40',
                right:'6',
                bottom:'130',
                width:'90%',
                height:'70%'
            },
            series: [{
                name: '血糖',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#09C116'
                    },
                },
                barWidth: 10,
                data: data
            }]
        };
        myChart.setOption(option);
    }
    function addZero(n){
        if(n<10){
            return '0' + n;
        }
        return '' + n;
    }
    function clearM(time){  //格式化时间格式为 月-日 时：分
        var Arr=time.split(' ');
        var monArr=Arr[0].split('-');
        var timeArr=Arr[1].split(':');
        return monArr[1]+"-"+monArr[2]+" "+timeArr[0]+":"+timeArr[1];
    }
    function getLastDay(year,month){
        var last= month+'月'+new Date(year,month,0).getDate()+'日';
        $('.healthNodata .fam_start').text(month+'月01日');
        $('.healthNodata .fam_end').text(last);
    }
})























