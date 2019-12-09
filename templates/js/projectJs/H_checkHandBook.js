$(function(){
   _czc.push(["Show_Inspection_manual", "检验手册", "", "on"]);
   //------------点击图标进入下级页面
   $('.chenkBook .target').on('tap',function () {
      var type= $(this).attr('type');
      switch (type){
         case '体格检验':
            _czc.push(["Click_Medical_Inspection_manual", "体格检验", "", "on"]);
            break;
         case '化学检验':
            _czc.push(["Click_Chemical _Inspection_manual", "化学检验", "", "on"]);
            break;
         case '物理检验':
            _czc.push(["Click_Physical_Inspection_manual", "物理检验", "", "on"]);
            break;
      };
      window.location.href='H_checkHandBookList.html?type=' + type;
   });

   loadAction();
   function loadAction(){
      showLoading();
      var YData={
         'pathL':"/doctor/testExaminationItem/getShowFrequentList"
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
            hideLoading();
            if(res.state==0){
               var data =res.data;
               var inner = '';
               for(var i=0;i<data.length;i++){
                  inner += '<li id="' +
                     '' +data[i].id+
                     '" name="' +
                     '' + data[i].examinationName +
                     '">' +
                     '' + data[i].examinationName +
                     '</li>'
               };
               $(inner).appendTo('.checkTitle .recommend');
            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            hideLoading();
            showalert(0,'请求失败',2);
         }
      });
   };
   $(document).on('tap','.recommend li',function () {
      var id = $(this).attr('id');
      var name = $(this).attr('name');
      window.location.href='H_checkListDetail.html?itemId='+id+'&name='+name;
   });


   //全局搜索
   $('.search_h img').on('tap',function () {
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