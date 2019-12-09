$(function(){
    var memberId=getRequestParam('memberId');
    var signInfoId=getRequestParam('signInfoId');
    var doctorName = getRequestParam('doctorName');
    var state = getRequestParam('state');//'0'代表是从（健康方案、用户随访）列表跳过来的、‘1’代表是从（家医签约）列表跳过来的
    var familyId,memberName,planText,planId;


    // var state = 0;
    // var memberId = 460;
    // var signInfoId = 498;
    // var doctorName = '崔小艳';

    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/teamSignInfo/patientDetails",
            'accessToken':token,
            'signInfoId':signInfoId,
            'memberId':memberId
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
                if(res.state==0){
                    var data=res.data;
                    var memberName = res.data.name;
                    familyId = res.data.familyId;  //点击（签约服务包） 跳到 王兵页面得时候需要传得
                    planId = res.data.planId;      //这是点击（干预方案）跳到 健康方案H5页面的时候传的
                    planText = res.data.plan;      //干预方案 文案展示
                    var topHtml= new EJS({url:"../compileEjs/J_signPDetail.ejs"}).render({data:data,signInfoId:signInfoId,doctorName:doctorName,state:state});
                    $('.J_patient').html(topHtml);

                    //返回按钮
                    $('.J_jumpBtnIback').on('tap',function(){
                        jumpMobil();
                    });


                    //点击---签约服务包
                   $('.serPackage').on('tap',function () {
                      var dataStr=JSON.stringify(familyId);
                      console.log(dataStr);
                      if(window.webkit){
                         window.webkit.messageHandlers.serPackageJump.postMessage(dataStr);
                      }else if(window.jsObj){
                         window.jsObj.serPackageJump(dataStr);
                      }
                   });
                   //点击---签约服务包
                   $('#signPackage').on('tap',function () {
                      var dataStr=JSON.stringify(familyId);
                      console.log(dataStr);
                      if(window.webkit){
                         window.webkit.messageHandlers.serPackageJump.postMessage(dataStr);
                      }else if(window.jsObj){
                         window.jsObj.serPackageJump(dataStr);
                      }
                   });


                    // 自测数据
                    $('.SelftestData').on('tap',function(){
                        //调取事件
                        if(window.webkit){
                            window.webkit.messageHandlers.SelftestData.postMessage('');
                        }else if(window.jsObj){
                            window.jsObj.SelftestData();
                        }
                    });

                    //这是适配有刘海的ipone的
                    if($(window).height()==812){
                        $('.Ynav').css({
                            'height':'68px',
                            'lineHeight':'68px'
                        })
                        $('.Ynav .a.Y_tump,.Ynav a.Y_tump,.Ynav dfn.Y_tump').css({
                            'marginTop':'21px'
                        })
                        $('.Ynav h1').css({
                            'marginTop':'24px'
                        })
                        $('.Y_docIndex').css({
                            'top':'88px'
                        })
                        // $('.j_patient_up').css({
                        //     'height':'160px'
                        // });
                        $('.h_datTop').css({
                           'marginTop':'20px'
                        })
                    };

                   //文字显示
                   if( planText == '没有方案' ){
                      $('.schemeName').html('没有方案').css({color:'#B4B4B4'})
                   }else if(planText == '新方案'){
                      $('.schemeName').html('新方案').css({color:'#FF8887'})
                   }else if(planText == '已有方案'){
                      $('.schemeName').html('已有方案').css({color:'#49DDEF'})
                   };


                   //干预方案 跳转
                   $('#tamper').on('tap',function () {
                      //state为0的时候表示：从（健康方案、用户随访）列表跳过来的
                      //state为1的时候表示：从（家医签约）列表跳过来的
                      if(state ==0){
                         if(planId == 0){
                            //督促页面(没有方案)
                            window.location.href='H_noHealthScheme.html?memberId='+memberId+'&memberName='+memberName +'&doctorName='+doctorName +'&signInfoId='+signInfoId;
                         }else {
                            //健康方案页面（已有方案、新方案、健康方案）
                            window.location.href='H_healthScheme.html?memberId=' + memberId+ '&planId=' +planId +'&state=' + state+'&signInfoId='+signInfoId;
                         }
                      }else {
                         window.location.href='H_healthScheme.html?memberId=' + memberId+ '&planId=' +planId +'&state=' + state+'&signInfoId='+signInfoId;
                      }


                   });

                   //弹框出现
                   $('#crowd').on('tap', function () {
                      $('.tc_box, .tc').removeClass('hide');
                      $('.tc_disease').animate({bottom:"0px"});
                   });
                   $('#personZhan').on('tap', function () {
                      $('.tc_box, .tc').removeClass('hide');
                      $('.tc_disease').animate({bottom:"0px"});
                   });

                   //取消按钮
                   $('.cancel').on('tap', function (){
                      $('.tc_disease').animate({bottom:"-300px"}, function () {
                         $('.tc_box, .tc').addClass('hide');
                      });
                   });
                   //点击（遮盖层）
                   $('.tc').on('tap', function (){
                      $('.tc_disease').animate({bottom:"-300px"}, function () {
                         $('.tc_box, .tc').addClass('hide');
                      });
                   });

                   //点击疾病
                   $('.illness').on('tap',function () {
                      if($(this).hasClass('disabled')){
                         $(this).removeClass('acColor');
                      }else {
                         if($(this).hasClass('acColor')){
                            $(this).removeClass('acColor');
                         }else {
                            $(this).addClass('acColor');
                         }
                      }
                   });

                   //一进入页面 患者人群分类标签回显
                   h_patients();
                   function h_patients() {
                      var YData={
                         'pathL':"/doctor/teamSignDoctorPatient/tags",
                         'signInfoId':signInfoId,
                         'accessToken':token,
                         'memberId':memberId
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
                            if(res.state==0){
                               var crowList = res.data;
                               // console.log(crowList);
                               var illnessList = $('.jibing').find('.illness');
                               // console.log(illnessList);

                               for(var j=0; j < illnessList.length; j++){
                                  for(var i=0;i < crowList.length ; i++){
                                     if(illnessList[j].innerText == crowList[i]){
                                        $('.jibing').find('.illness').eq(j).addClass('acColor');
                                        $('.jibing').find('.illness').eq(7).removeClass('acColor');
                                     }
                                  }
                               }

                               var _html='';
                               for(var i=0;i<crowList.length;i++){
                                  _html += "<span>"+crowList[i]+"</span>";
                               }
                               $(_html).appendTo($('.crowdList'));
                            }else{
                               showalert(0,''+res.msg+'',2);
                            }
                         },
                         error:function(res){
                            showalert(0,'请求失败',2);
                         }
                      });
                   }


                   //确定按钮事件
                   $('.set').on('tap', function () {
                      var iVal=[];
                      $('.illness_form').find('.acColor').each(function(){
                         iVal.push($(this).attr('isname'));
                      });
                      $('#illnessList').val(iVal.join(','));
                      var iValstr=iVal.join(',');
                      console.log(iValstr);
                      if(iValstr.indexOf('老人') != -1 && iValstr.indexOf('儿童') != -1 && iValstr.indexOf('孕产妇') != -1){
                         showalert(2,'老人、儿童、孕产妇只能选一个',3);
                         return;
                      }else if(iValstr.indexOf('老人') != -1 && iValstr.indexOf('儿童') != -1){
                         showalert(2,'老人、儿童、孕产妇只能选一个',3);
                         return;
                      }else if(iValstr.indexOf('儿童') != -1 && iValstr.indexOf('孕产妇') != -1){
                         showalert(2,'老人、儿童、孕产妇只能选一个',3);
                         return;
                      }else if(iValstr.indexOf('老人') != -1 && iValstr.indexOf('孕产妇') != -1){
                         showalert(2,'老人、儿童、孕产妇只能选一个',3);
                         return;
                      }else {
                         saveLoading();
                         $('.set').attr('disabled',true);
                         var YData={
                            'pathL':"/doctor/teamSignDoctorPatient/addTagToPatient",
                            'accessToken':token,
                            'signInfoId':signInfoId,
                            'memberId':memberId,
                            tags:iValstr
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
                               hidesaveLoading();
                               $('.set').attr('disabled',false);
                               if(res.state==0){
                                  $('.crowdList').html('');
                                  $('.tc_disease').animate({bottom:"-300px"},200,function () {
                                     $('.tc_box, .tc').addClass('hide');
                                  });
                                  patients();
                               }else{
                                  showalert(0,''+res.msg+'',2);
                               }
                            },
                            error:function(res){
                               showalert(0,'请求失败',2);
                            }
                         });
                      }

                   });

                   //患者人群分类标签回显
                   function patients() {
                      var YData={
                         'pathL':"/doctor/teamSignDoctorPatient/tags",
                         'signInfoId':signInfoId,
                         'accessToken':token,
                         'memberId':memberId
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
                            if(res.state==0){
                              var crowList = res.data;
                              var _html='';
                              for(var i=0;i<crowList.length;i++){
                                 _html += "<span>"+crowList[i]+"</span>";
                              }
                              $(_html).appendTo($('.crowdList'));
                            }else{
                               showalert(0,''+res.msg+'',2);
                            }
                         },
                         error:function(res){
                            showalert(0,'请求失败',2);
                         }
                      });
                   }


                }else{
                    showalert(0,''+res.msg+'',2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    };
});























