$(function(){
   new FastClick(document.body);
});

$(function(){
   var diseasesId = getRequestParam('businessId');

   //点击显示与隐藏
   $(document).on('click','.historyList .titleCon',function () {
      $(this).siblings('.textareaCon').toggle();
      $(this).siblings('.textareaCon').find('.zd_textarea').focus();
      $(this).siblings('.fuIMg').toggle();
      $(this).find('.two').toggleClass('arrowTop');
   });

   var disImages = [];//上传成功的数组
   var huiImgArr = [];//回显图片数组
   var bigFinalData = [];//回显图片数组（huiImgArr） + 上传成功的 （disImages）

   var onlineStatus,belongedType,publisher,
      publishedDate,readAmount,likeAmount,
      discussionId,discussionAmount,doctorImage,doctorName,hospitalName,
      doctorProfession,doctorDepartment,allowDiscussion,createdDate,
      originalReadAmount,readamountAddrule,platformType,doctorId,ownedSecondLev,doctorPosition;

   //加载病例详情
   $(document).ready(function() {
      showLoading();
      var YData={
         'pathL':"/doctor/typicalDiseasesArticle/getDetailById",
         'accessToken':token,
         'id':diseasesId
      };
      Ajax({
         url:servUrl,
         data:YData,
         async: false,
         beforeSend: function(){
         },
         type : 'POST',
         dataType : "json",
         success:function(res){
            hideLoading();
            if(res.state==0){
               $('#diseasesTitle').val(res.data.diseasesTitle);//病例标题
               var diseasesContent = JSON.parse(res.data.diseasesContent);//基本信息+一堆病史
               for(var i in diseasesContent){
                  var diseasesHistory = diseasesContent[i];
                  if(diseasesHistory == ''){

                  }else {
                     $('#'+i).val(interlacHuo(diseasesHistory));
                     $('#'+i).parent().show();
                     $('#'+i).parent().siblings('.fuIMg').show();
                     $('#'+i).parent().siblings('.titleCon').find('.two').addClass('arrowTop');
                  }
               };
               //图片的回显
               var disImgList = JSON.parse(res.data.diseasesImages);
               huiImgArr = disImgList;
               if(disImgList.length>0){
                  var inner = '';
                  var innerTwo = '';
                  for(var i=0;i<disImgList.length;i++){
                     //图片的回显
                     inner += '<figure class="h_figImg" type="1">\n' +
                        '                    <div class="img-dv">\n' +
                        '                        <a href="' +
                        '' + disImgList[i].url +
                        '" data-size="1920x1080">\n' +
                        '                            <img src="' +
                        '' + disImgList[i].url +
                        '">\n' +
                        '                        </a>\n' +
                        '                    </div>\n' +
                        '                </figure>';
                     //对应的删除图标添加
                     innerTwo += '<div class="deleteImg typeMark" type="1">\n' +
                        '                    <img src="../images/H_delete.png">\n' +
                        '                </div>';
                  }
                  $(inner).appendTo('#H_disImaList');
                  $(innerTwo).appendTo('#imgWeiId');
               };

               //点击发布需要传的参数
               onlineStatus = res.data.onlineStatus;
               belongedType = res.data.belongedType;
               publisher  = res.data.doctorName;
               publishedDate = res.data.publishedDate;
               readAmount = res.data.readAmount;
               likeAmount = res.data.likeAmount;
               discussionId = res.data.discussionId;
               discussionAmount = res.data.discussionAmount;
               doctorImage = res.data.doctorImage;
               doctorName = res.data.doctorName;
               hospitalName = res.data.hospitalName;
               doctorProfession = res.data.doctorProfession;
               doctorDepartment = res.data.doctorDepartment;
               allowDiscussion = res.data.allowDiscussion;
               createdDate = res.data.createdDate;
               originalReadAmount = res.data.originalReadAmount;
               readamountAddrule = res.data.readamountAddrule;
               platformType = res.data.platformType;
               doctorId = res.data.doctorId;
               ownedSecondLev = res.data.ownedSecondLev;
               doctorPosition = res.data.doctorPosition;
            }else{
               showalert(0,''+res.msg+'',2);
            }
         },
         error:function(res){
            showalert(0,'请求失败',2);
         }
      });
   });

   //上传图片
   $('#upload').change(function () {
      var allFile = this.files;//上传的图片数组
      console.log(allFile);
      var totalLen = allFile.length;//上传的图片数组长度
      if(totalLen > 9){
         showalert(0,'只能一次最多上传9张图片',2);
         allFile.length = 0;
         return;
      };

      for(var i=0 ; i<totalLen ; i++){
         var file = allFile[i];//图片数组中的每一个图片信息

         //添加一层过滤
         var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
         if(!rFilter.test(file.type)) {
            alert("文件格式必须为图片");
            return;
         };

         var reader = new FileReader();
         reader.readAsDataURL(file); //用文件加载器加载文件
         //文件加载完成
         reader.onload = function(e) {

         };
         reader.onloadend = function(e) {

         };

         var formData = new FormData();  // 创建form对象
         formData.append('file', file);  // 通过append向form对象添加数据
         $.ajax({
            url: servUploadImg, //请求的接口地址
            type: 'POST',
            cache: false, //上传文件不需要缓存
            data: formData,
            processData: false, // 不要去处理发送的数据
            contentType: false, // 不要去设置Content-Type请求头
            success: function(res){
               var dataObj = JSON.parse(res);
               if(dataObj.state == 0){
                  disImages.push({name:'', url:dataObj.data.url});
                  console.log(disImages);
                  //图片的
                  var inner = '';
                  inner = '<figure class="h_figImg">\n' +
                     '                    <div class="img-dv">\n' +
                     '                        <a href="' +
                     '' + dataObj.data.url +
                     '" data-size="1920x1080">\n' +
                     '                            <img src="' +
                     '' + dataObj.data.url +
                     '">\n' +
                     '                        </a>\n' +
                     '                    </div>\n' +
                     '                </figure>';
                  $(inner).appendTo('#H_disImaList');
                  //删除的图标
                  var innerTwo = '';
                  innerTwo = '<div class="deleteImg">\n' +
                     '                    <img src="../images/H_delete.png">\n' +
                     '                </div>';
                  $(innerTwo).appendTo('#imgWeiId');
               }
            },
            error: function(err){
               console.log(err)
            }
         });
      };
   });

   //删除图片
   $(document).on('click','.deleteImg img',function () {
      var type = $(this).parent().attr('type');
      if(type == 1){//删的是回显的
         var index = $(this).parent().index();
         $(this).parent().remove();//图标删除
         $('#H_disImaList').find('.h_figImg').eq(index).remove();//回显的图片删除
         huiImgArr.splice(index,1);
         console.log(huiImgArr);
      }else {//删的是新上传的
         var index = $(this).parent().index();
         var huiLength = $(this).parent().parent().find('.typeMark').length;//回显图片的数量
         console.log(huiLength);
         $(this).parent().remove();
         $('#H_disImaList').find('.h_figImg').eq(index).remove();//回显的图片删除
         disImages.splice(index-huiLength,1);//删除新上传的图片某一个
         console.log(disImages);
      };
   });

   //点击（发布）按钮
   var isClick = true;
   $('#publish').on('tap',function () {
      console.log(huiImgArr);
      console.log(disImages);
      bigFinalData = huiImgArr.concat(disImages);
      console.log(bigFinalData);

      if($('#diseasesTitle').val() == ''){
         showalert(0,'请填写病例标题',2);
      }else if($('#baseInfo').val() == ''){
         showalert(0,'请填写基本信息',2);
      }else if($('#tell').val() == ''){
         showalert(0,'请填写主诉',2);
      }else if($('#currentDisease').val() == ''){
         showalert(0,'请填写现病史',2);
      }else if($('#past').val() == ''){
         showalert(0,'请填写既往史',2);
      }else if($('#physicalExamination').val() == ''){
         showalert(0,'请填写查体',2);
      }else if($('#auxiliary').val() == ''){
         showalert(0,'请填写辅助检查',2);
      }else if($('#diagnosis').val() == ''){
         showalert(0,'请填写诊断',2);
      }else if($('#Identification').val() == ''){
         showalert(0,'请填写鉴别诊断',2);
      }else if($('#treatment').val() == ''){
         showalert(0,'请填写治疗',2)
      }else if($('#analysis').val() == ''){
         showalert(0,'请填写分析总结',2)
      }else {
         if(isClick) {
            isClick = false;
            $('.tc_box').show();
            $('.tc').show();
            $('.tc_disease').show();
            showLoading();
            var diseasesContent={
               baseInfo:$('#baseInfo').val(),//基本信息
               tell: $('#tell').val(),//主诉
               currentDisease: $('#currentDisease').val(),//现病史
               personal: $('#personal').val(),//个人史
               past: $('#past').val(),//既往史
               marriage: $('#marriage').val(),//婚育史
               menstruation: $('#menstruation').val(),//月经史
               trauma: $('#trauma').val(),//外伤及手术史
               poisoning: $('#poisoning').val(),//中毒及药物过敏史
               metalTour: $('#metalTour').val(),//冶游史
               family: $('#family').val(),//家族史
               physicalExamination: $('#physicalExamination').val(),//查体
               auxiliary: $('#auxiliary').val(),//辅助检查
               diagnosis: $('#diagnosis').val(),//诊断
               Identification: $('#Identification').val(),//鉴别诊断
               treatment: $('#treatment').val(),//治疗
               analysis: $('#analysis').val()//分析总结
            };
            var YData={
               'pathL':"/doctor/typicalDiseasesArticle/updateDiseasesArticle",
               'accessToken':token,
               'doctorId':doctorId,//医生id
               'id':diseasesId,//主键id
               'diseasesTitle':$('#diseasesTitle').val(),//病例标题
               'onlineStatus':onlineStatus,//病例文章状态(0待审核，2审核通过，1已上线，3已下线,4审核未通过)
               'publisher':publisher,//发布人
               'belongedType':belongedType,//所属分类
               'publishedDate':publishedDate,//发布日期
               'readAmount':readAmount,//阅读数量
               'likeAmount':likeAmount,//点赞数量
               'discussionId':discussionId,//外键“无外键约束”(评论表主键id)
               'discussionAmount':discussionAmount,//评论数量
               'doctorImage':doctorImage,//医生头像图片
               'doctorName':doctorName,//医生名字
               'hospitalName':hospitalName,//医院名称
               'doctorProfession':doctorProfession,//医生擅长
               'doctorDepartment':doctorDepartment,//医生所属科室（JSON串）
               'allowDiscussion':allowDiscussion,//是否允许评论（0否，1是）
               'diseasesContent':JSON.stringify(diseasesContent),//基本信息+一堆病史
               'diseasesImages': JSON.stringify(bigFinalData),//辅助检查图片
               'createdDate':createdDate,//创建日期
               'isUpdatePublishedDate':false,//是否更新发布日期字段（isUpdatePublishedDate为true时需要更新publishedDate字段为系统当前时间点）
               'originalReadAmount':originalReadAmount,//初始阅读量
               'readamountAddrule':readamountAddrule,//增长系数
               'platformType':platformType,//平台类型：0运营平台，1多咖医生
               'ownedSecondLev':ownedSecondLev,//科室
               'doctorPosition':doctorPosition//医生岗位
            };
            Ajax({
               url:servNewFu,
               data:YData,
               async: false,
               beforeSend: function(){
               },
               type : 'post',
               dataType : "json",
               success:function(res){
                  hideLoading();
                  $('.tc_box').hide();
                  $('.tc').hide();
                  $('.tc_disease').hide();
                  isClick = true;
                  if(res.state==0){

                     if(window.webkit){
                        window.webkit.messageHandlers.backToCheck.postMessage('1');
                     }else if(window.jsObj){
                        window.jsObj.backToCheck();
                     };
                  }else{
                     showalert(0,''+res.msg+'',2);
                  }
               },
               error:function(res){
                  isClick = true;
                  $('.tc_box').hide();
                  $('.tc').hide();
                  $('.tc_disease').hide();
                  showalert(0,'请求失败',2);
               }
            });
         }
      }
   });

   //点击（取消）按钮
   $('#cannel').on('tap',function () {
      jumpMobil();
   });

   //解决ios的问题
   var pianYiLiang;//
   $(window).scroll(function () {
      pianYiLiang = $(this).scrollTop();
   });
   //方法一（内容多于一屏幕）: focusin(软键盘弹起事件)、focusout(软键盘关闭事件)
   var u = navigator.userAgent;
   var flag;
   var myFunction;
   var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
   if(isIOS){
      document.body.addEventListener('focusin', () => {  //软键盘弹起事件
         flag=true;
         clearTimeout(myFunction);
      });
      document.body.addEventListener('focusout', () => { //软键盘关闭事件
         flag=false;
         if(!flag){
            myFunction = setTimeout(function(){
               //重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
               // window.scrollTo({top:pianYiLiang - 2 - 450,left:0,behavior:"smooth"});
               qqFace_on_off = true;
               blurAdjust();
            },500);
         }else{
            return;
         }
      })
   }else{
      return;
   };
   function blurAdjust(){
      setTimeout(()=>{
         if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
            return
         };
         var result = 'pc';
         if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            result = 'ios'
         }else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
            result = 'android'
         };
         if(result = 'ios'){
            document.activeElement.scrollIntoViewIfNeeded(true);
            window.scrollTo({top:pianYiLiang - 450,left:0,behavior:"smooth"});
         }
      },50)
   }

});