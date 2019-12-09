$(function(){
   var name = decodeURIComponent(getRequestParam('name'));
   var searchId = getRequestParam('searchId');

   $('.H_checkTitle').text(name);
   showLoading();
   var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
   var IsThereData,pageNum;

   //页面初始化
   window.onload = function(){
      loaded()
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
            if (this.y > 10 && !pullDownEl.className.match('flip')) {
               pullDownEl.className = 'flip';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
               this.minScrollY = 0;
            } else if (this.y < 10 && pullDownEl.className.match('flip')) {
               pullDownEl.className = '';
               pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
               this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 10) && !pullUpEl.className.match('flip')) {
               pullUpEl.className = 'flip';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
               this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 10) && pullUpEl.className.match('flip')) {
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
               if(IsThereData<10){
                  pullUpEl.querySelector('.pullUpLabel').innerHTML = '没数据了';
               }else{
                  pullUpAction();	// Execute custom function (ajax call?)
               }
            }
         }
      });
      loadAction(2,0,0);
   };

   //获取数据列表
   function loadAction(liId,pageNum,Y_num){
      hideLoading();
      var YData={
         'pathL':"/doctor/testExaminationItem/getForthMenuList",
         'accessToken':token,
         'pageNum':parseInt(pageNum)+1,
         'pageSize':20,
         'name':name,
         'searchId':searchId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){
         },
         type : 'post',
         dataType : "json",
         success:function(res){
            hideLoading();
            if(res.state==0){
               var data=res.data.result;
               // console.log(data);
               if(res.data.total>0){
                  var inner = '';
                  for(var i=0;i<data.length;i++){
                     inner += '<li itemId="' +
                        '' +data[i].itemId+
                        '" name="' +
                        '' +data[i].name+
                        '">' +
                        '' +data[i].name+
                        '</li>';
                  };
                  if(Y_num==1){
                     $('#thelist .history').html($(inner));
                  }else{
                     $(inner).appendTo('#thelist .history');
                  }
                  myScroll.refresh();
                  //把页面存在cookie
                  setCookie('pageNum',res.data.pageNum);
                  IsThereData=data.length;
                  $('.form_type').css('height',$(window).height());
                  $('#wrapper').css('height',$('.form_type').height() + $('.Ynav').height() - 60);
               }else {
                  $('#wrapper').hide();
                  $('.form_type').addClass('JNOdata');
               }

               //点击跳转
               $('.history li').on('tap',function(){
                  var itemId = $(this).attr('itemId');
                  var name = $(this).attr('name');
                  // console.log(historyId);
                  window.location.href='H_checkListDetail.html?itemId='+itemId+'&name='+name;
               });
            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });

   };

   //下拉刷新当前数据
   function pullDownAction () {
      setTimeout(function () {
         //这里执行刷新操作
         loadAction(2,0,1)
      }, 400);
   };
   //上拉加载更多数据
   function pullUpAction () {
      setTimeout(function () {
         pageNum = getCookieValue("pageNum");
         var liId=$('#list li.active').attr('historyId');
         console.log(liId);
         // console.log(pageNum);
         loadAction(liId,pageNum,0);
      }, 400);
   };

   //全局搜索
   $('.search_h img').on('tap',function () {
      // console.log('全局');
      var shareDate_ios = {
         'type': 'course',
      };
      var shareDate = JSON.stringify(shareDate_ios);
      if(window.webkit){
         window.webkit.messageHandlers.globalSearch.postMessage(shareDate);
      }else if(window.jsObj){
         window.jsObj.globalSearch(shareDate_ios);
      }
   })
});