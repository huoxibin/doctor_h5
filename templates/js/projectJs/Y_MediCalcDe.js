$(function(){
    var token=sessionStorage.getItem('JdocToken');
    var Y_MeCaText=decodeURI(getRequestParam('Y_MeCaText'));
    var Y_MeScroll=getRequestParam('Y_MeScroll');
    sessionStorage.setItem('Y_MeCaText',Y_MeCaText);   //存在session的数据，为了返回时候回显
    debugger;
    //计算器详情返回按钮
    $('.Y_MEIcDeBack').on('tap',function(){
        history.go(-1)
        //window.location.href="/html/Y_MediCalc.html?scroll="+Y_MeScroll;
    });

    loadAction();
    function loadAction(){
        var Icategory=decodeURI(getRequestParam('category'));
        var Iname=decodeURI(getRequestParam('name'));
        $('.Y_sum').text(Iname+'计算');
        var YData={
            'pathL':"/doctor/doctorCalculator/queryCalculatorInfo",
            'category':Icategory,
            'name':Iname,
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
                    var category=data[0].category;
                    var     name=data[0].name;
                    var topHtml= new EJS({url:"../compileEjs/Y_MediCalcDe.ejs"}).render({data:data,category:category,name:name});
                    $('.medicalDeBox').html(topHtml);
                    //初始化日期格式的input
                    loadData();
                    //给age或者sex赋默认值
                    $('.select-li').each(function(){
                        if(!$(this).hasClass('Jhide')){
                            $(this).find('#race').val($(this).find('.S_radio.active').attr('isval'));
                        }
                    })
                    //点击单选按钮切换 及赋值；输入input调取结果接口
                    $('.Y_MediCont').each(function(i){
                        $('.Y_MediCont').eq(i).find('.S_radio').on('tap',function(){
                            var isindex=$(this).index();
                            $('.Y_MediCont').eq(isindex).addClass('show').siblings().removeClass('show');
                            $('.Y_MediCont').eq(isindex).find('.S_radio').eq(isindex).addClass('active').siblings().removeClass('active');
                            $('.Y_MediCont').eq(isindex).find('#race').val($('.Y_MediCont').eq(isindex).find('.S_radio').eq(isindex).attr('isval'));
                        })
                        $('.Y_MediCont').eq(i).find('.input-item input').on('input',function(){
                            var isindex=$(this).index();
                            var iVal=0;
                            var iLength=$(this).parents('li').siblings().not('.Jhide').find('.height-select').length;
                            var iAjax=false;
                            $(this).parents('li').siblings().not('.Jhide').find('.height-select').each(function(i){
                                if($(this).find('input').val()!=''){
                                    iVal++;
                                }
                            })
                            if(iVal==iLength){
                                iAjax=true;
                            }
                            if(iAjax){
                                var Jdata={
                                    'pathL':"/doctor/doctorCalculator/doCalculator",
                                    'accessToken':token
                                }
                                var isData=$('.Y_MediCont.show .Y_MediContForm').serializeArray();
                                for(var i=0;i<isData.length;i++ ){
                                    Jdata[isData[i].name]=isData[i].value;
                                }
                                loadAjaxResult(Jdata);
                            }
                        })
                    })
                    $(".noAfter").on('change',function(){
                        var Jdata={
                            'pathL':"/doctor/doctorCalculator/doCalculator",
                            'accessToken':token
                        }
                        var isData=$('.Y_MediCont.show .Y_MediContForm').serializeArray();
                        for(var i=0;i<isData.length;i++ ){
                            Jdata[isData[i].name]=isData[i].value;
                        }
                        loadAjaxResult(Jdata);
                    })
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
    function loadAjaxResult(isData){
        if(isData.param1!='' && isData.param2!=''){
            Ajax({
                url:servUrl,
                data:isData,
                async: false,
                beforeSend: function(){
                },
                type : 'get',
                dataType : "json",
                success:function(res){
                    if(res.state==0){
                        if(res.data.name=="预产期"||res.data.name=="孕周"){
                            $('.Y_MediCont.show .resultInp').val(res.data.result)
                        }else{
                            var iresult=Math.floor(res.data.result * 100)/100;  //res.data.result;  //Math.floor(res.data.result * 100) / 100
                            $('.Y_MediCont.show .resultInp').val(iresult)
                        }
                    }
                },
                error:function(res){
                    showalert(0,'请求失败',2);
                }
            });
        }else{
            $('.Y_MediCont.show .resultInp').val('')
        }
    }
    function loadData(){
        var currYear = (new Date()).getFullYear();
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
            endYear: currYear + 2000 //结束年份
        };
        $(".noAfter").mobiscroll($.extend(opt['date'], opt['default']));
        $(".noAfter").val('');
    }
})























