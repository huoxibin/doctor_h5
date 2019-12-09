$(function(){
   if($(window).height()==812){
      $('.H_incomeTitle').css({
         'top':'80px'
      });
   };

   var myDate = new Date();
   var _years = myDate.getFullYear();
   var _month = myDate.getMonth() + 1;

   var yearMonth = _years + monthZeroHuo(_month);//传递的时间参数'201903'
   var yearMonthPullUp = _years + monthZeroHuo(_month);//上拉加载时候用到的
   var yearMonthPullDown = _years + monthZeroHuo(_month);//下拉加载时候用到的


   $('.select-value2').val(_years + '年 ' +_month + '月');//用于展示
   loadAction(2,yearMonth,0,0);
   setTimeout(function(){
      pullUpAction();
      // console.log('22');
   }, 500);
   setTimeout(function () {
      pullUpAction();
      // console.log('33');
   }, 1000);

   var method2=$('.select-value2').mPicker({
      //级别
      level:2,
      //需要渲染的json，二级联动的需要嵌套子元素，有一定的json格式要求
      dataJson:yearsData,
      //true:联动
      Linkage:true,
      //显示行数
      rows:5,
      //默认值填充
      idDefault:true,
      //分割符号
      // splitStr:'-',
      //头部代码
      header:'<\div class="mPicker-header">两级联动选择插件<\/div>',
      confirm:function(json){
         // console.info($('.select-value2').data('value1').replace('年','')+'-'+$('.select-value2').data('value2').replace('月',''));
         var _yearsStr = json.values.substr(0, 4);
         var _monthStr = json.values.substr(6).replace(/[\u4e00-\u9fa5]/g,"");

         yearMonthPullUp = _yearsStr+""+monthZeroHuo(_monthStr);
         yearMonthPullDown = _yearsStr+""+monthZeroHuo(_monthStr);

         $('#thelist .billText .nextMonth').html('');
         $('#thelist .billText .currentMonth .billList').html('');
         $('#thelist .billText .currentMonth .billTime').html('');
         $('#thelist .billText .lastMonth').html('');
         loadAction(2,_yearsStr+monthZeroHuo(_monthStr),0,0);
         setTimeout(function(){
            pullUpAction();
            // console.log('44');
         }, 500);
         setTimeout(function(){
            pullUpAction();
            // console.log('55');
         }, 1000);
      },
      cancel:function(){
         // console.info($('.select-value2').data('value1')+'-'+$('.select-value2').data('value2'));
      }
   });

   //iscroll动画效果
   var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
   var IsThereData;//返回的数据的条数
   loaded();
   function loaded(){
      //动画部分
      pullDownEl = document.getElementById('pullDown');//下拉刷新
      pullDownOffset = pullDownEl.offsetHeight;//30
      pullUpEl = document.getElementById('pullUp');//上拉加载
      pullUpOffset = pullUpEl.offsetHeight;//30
      myScroll = new iScroll('wrapper', {
         useTransition: true,
         topOffset: pullDownOffset,
         onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
               pullDownEl.className = '';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉查看下一月份数据';
            } else if (pullUpEl.className.match('loading')) {
               pullUpEl.className = '';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉查看上一月份数据';
            }
         },
         onScrollMove: function () {
            if (this.y > 10 && !pullDownEl.className.match('flip')) {
               pullDownEl.className = 'flip';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉查看下一月份数据';
               this.minScrollY = 0;
            } else if (this.y < 10 && pullDownEl.className.match('flip')) {
               pullDownEl.className = '';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉查看下一月份数据';
               this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 10) && !pullUpEl.className.match('flip')) {
               pullUpEl.className = 'flip';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉查看上一月份数据';
               this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 10) && pullUpEl.className.match('flip')) {
               pullUpEl.className = '';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉查看上一月份数据';
               this.maxScrollY = pullUpOffset;
            }
         },
         onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
               pullDownEl.className = 'loading';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
               pullDownAction();	 // 下拉动作
            } else if (pullUpEl.className.match('flip')) {
               pullUpEl.className = 'loading';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
               if(IsThereData == 0){
                  pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';
               }else{
                  pullUpAction(); //上拉动作
               }
            }
         }
      });
   };

   //获取数据
   function loadAction(liId,yearMonth,Y_num,monthType){
      var YData={
         'pathL':"/doctor/virtualTurnover/turnoverList",
         'pageSize':100,
         'pageNum':1,
         'accessToken':token,
         'yearMonth':yearMonth,
         'monthType':monthType //0 传入参数的月份,1 后续一个月，-1 前面一个月
      };
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
               var datagGet = res.data.result; //拿到的数据
               if(datagGet.length == 0){
                  if(Y_num==0){//当前月（3月份）
                     $('#thelist .billText .currentMonth .billList').html('');
                     $('#thelist .billText .currentMonth .billTime').html('');

                     $('#thelist .billText .currentMonth .billTime').html(yearMonth.substring(0,4) +'-' + yearMonth.substring(yearMonth.length-2));
                     $('#thelist .billText .currentMonth .billNoData').show();
                  }else if(Y_num==1){//下拉加载下一个月（4月份）
                     // $('#thelist .billText .nextMonth').show();
                     //
                     // $('#thelist .billText .nextMonth').prepend('<div class="bill"><p class="billTime">' +
                     //    '' +yearMonth.substring(0,4) +'-' + yearMonth.substring(yearMonth.length-2) +
                     //    '</p><p class="billNoData" style="display: block">当月暂无数据</p></div>');
                  }else if(Y_num==2){//上拉加载上一个月（2月份）
                     // IsThereData=datagGet.length;

                     // $('#thelist .billText .lastMonth').show();
                     //
                     // $('#thelist .billText .lastMonth').append('<div class="bill"><p class="billTime">' +
                     //    '' +yearMonth.substring(0,4) +'-' + yearMonth.substring(yearMonth.length-2) +
                     //    '</p><p class="billNoData" style="display: block">当月暂无数据</p></div>');
                  };
               }else {
                  //拿到的数据
                  var itotal=res.data.result[0].data;
                  var inner = '';
                  for(var i=0;i<itotal.length;i++){
                     var img = '';
                     var memo,turnoverType;
                     //301余额充值、321视频课程消费
                     if(itotal[i].type == 301)img = '<img src="../images/H_goldDetails301.png">';
                     if(itotal[i].type == 321)img = '<img src="../images/H_goldDetails321.png">';
                     if(itotal[i].type == 301){
                        memo = '金额充值';
                        turnoverType ='+';
                     }else if(itotal[i].type == 321){
                        memo = '视频课程';
                        turnoverType = '-';
                     }
                     var itime = itotal[i].successTime.split(' ')[0].split('-');
                     var itimes = itotal[i].successTime.split(' ')[1].split(':');
                     inner +='<li id="' +
                        '' +itotal[i].id+
                        '" memo="' +
                        '' +itotal[i].memo+
                        '">\n' +
                        '                                    <div class="billOne">\n' +
                        '                                        ' +img+
                        '\n' +
                        '                                        <span class="billType">' +
                        '' + memo +
                        '</span>\n' +
                        '                                    </div>\n' +
                        '                                    <div class="billTwo">\n' +
                        '                                        ' + turnoverType +itotal[i].amount + '金币' +
                        '\n' +
                        '                                    </div>\n' +
                        '                                    <div class="billThree">\n' +
                        '                                        <span class="timeOne">' +
                        '' +itime[1]+
                        '-' +
                        '' +itime[2]+
                        '</span>\n' +
                        '                                        <span class="timeTwo">' +
                        '' +itimes[0]+
                        ':' +
                        '' +itimes[1]+
                        '</span>\n' +
                        '                                    </div>\n' +
                        '                                </li>';
                  };
                  if(Y_num==0){//当前月(3月份)
                     var monthShow = res.data.result[0].groupMonth;
                     $('#thelist .billText .currentMonth .billTime').html(monthShow);
                     $('#thelist .billText .currentMonth .billNoData').hide();
                     $(inner).appendTo('#thelist .billText .currentMonth .billList');
                  }else if(Y_num==1){//下拉加载下一个月(4月份)
                     $('#thelist .billText .nextMonth').show();

                     var monthShow = res.data.result[0].groupMonth;
                     yearMonthPullDown = monthShow.replace(/-/g, "");

                     $('#thelist .billText .nextMonth').prepend('<div class="bill"><p class="billTime">' +
                        '' +monthShow+
                        '</p><ul class="billList">' +
                        '' +inner+
                        '</ul></div>');
                  }else if(Y_num==2){//上拉加载上一个月(2月份)
                     $('#thelist .billText .lastMonth').show();

                     var monthShow = res.data.result[0].groupMonth;
                     yearMonthPullUp = monthShow.replace(/-/g, "");

                     $('#thelist .billText .lastMonth').append('<div class="bill"><p class="billTime">' +
                        '' +monthShow+
                        '</p><ul class="billList">' +
                        '' + inner +
                        '</ul></div>');
                  };
               };
               myScroll.refresh();
               $('.form_type').css('height',$(window).height());
               $('#wrapper').css('height',$('.form_type').height() + $('.Ynav').height() + 160);
            }else{
               showError(res.msg);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   };

   //下拉刷新当前数据
   function pullDownAction(){
      loadAction(2,yearMonthPullDown,1,1);
   };

   //上拉加载更多数据
   function pullUpAction () {
      loadAction(2,yearMonthPullUp,2,-1);
   };

   //时间不满10补0
   function monthZeroHuo(obj) {
      if(obj < 10){
         return "0" + obj
      }else {
         return obj;
      }
   }

});