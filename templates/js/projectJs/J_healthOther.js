$(function(){
    //根据url参数获取相对应的数据，给input赋值，选中的状态；编辑保存
    //先获取数据
    // var token=sessionStorage.getItem('patientToken');
   /*var token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MjMzNDI5NzMsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9tZW1iZXJfMjc1XCIsXCJpbVRva2VuXCI6XCIwMDllZTY5NjMxYzU3ZWUwMmIyODQwYTIxMGMxOWY5NVwiLFwiaW5kZXhcIjoyLFwicm9sZVR5cGVcIjowLFwic2Vzc2lvbklkXCI6XCIxMThDMjVCQUYwNjFGOTg3RUU4M0JENDg4QjlEMjZERVwiLFwidXNlckFnZW50XCI6XCJQb3N0bWFuUnVudGltZS82LjQuMVwiLFwidXNlcklkXCI6Mjc1fSIsImV4cCI6MTU1NDg3ODk3M30.V4GoajmTR1uyeatqywLawDCjV3A3xK8KdVhMm7OOvuI';*/
    var iUrl=getRequestParam('iurl');
    var userId=getRequestParam('userId');
    var signInfoId=getRequestParam('signInfoId');
    loadAjax();
    function loadAjax(){
       Ajax({
            url:servUrl,
           data:{
               'healthVersion':2,
               'memberId':userId,
               'pathL':'/user/relativeMember/healthInfoByMember',
               'accessToken':token,
               'healthType':iUrl
           },
            async: false,
            type : 'get',
            dataType : "json",
            success:function(res){
                if(res.state == 0){
                    if(res.data.healthInfo==null && res.data.healthType==null && res.data.version==null){ //没有保存过
                        $('.weui-cell').removeClass('active');
                        $('.Ifsmoke').hide();
                        $('.Ifsmoke').eq(0).show();
                        $('.Select_j').removeClass('active');
                        $('#custom_form_form .button').hide();
                        $('.weui-cell').removeClass('active');
                        $('#medicalHistory_form').hide();
                    }else{
                        if(res.data.healthInfo!=''){
                            $('#medicalHistory_form').show();
                            res.data.healthInfo= decodeURIComponent(res.data.healthInfo);
                            console.log(res.data.healthInfo);
                            InputType(res.data.healthInfo,res.data.healthType)
                        }
                    }
                }else{
                    showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
                }
            },
            error:function(res){
                console.log(res)
            }
        });
    }
    function InputType(ijson,elm){
        if(ijson!=''){  //如果不是空，则修改过；
            $('.Ifsmoke').show();
            $('.button').show();
            $('#'+iUrl+'_form').find('.weui-cell').removeClass('active');
            $('#'+iUrl+'_form').find('.Select_j').removeClass('active');
            if(elm=='medicalHistory'){
               //（既往病史）
               $('#'+iUrl+'_form').find('#'+ elm).val(ijson); //给Id为medicalHistory的input赋值；
               var ival=ijson.split(',');
               console.log(ival);
               for(var j=0;j<ival.length;j++){
                  /* if($('#'+iUrl+'_form').find('.'+ival[j]).length!=0){
                      $('#'+iUrl+'_form').find('.'+ival[j]).addClass('active');
                      $('#'+iUrl+'_form').find('.'+ival[j]).siblings('.medInput').show();
                      $('#jb26Info').val(JSON.parse(ival[ival.length-3]).jb26Info);
                      $('#jb27Info').val(JSON.parse(ival[ival.length-2]).jb27Info);
                      $('#jb28Info').val(JSON.parse(ival[ival.length-1]).jb28Info);
                   }*/
                  if(ival[j].indexOf('jb26Info') != -1 || ival[j].indexOf('jb27Info') != -1  || ival[j].indexOf('jb28Info') != -1){
                     console.log('既往病史');
                  }else {
                     $('#'+iUrl+'_form').find('.'+ival[j]).addClass('active');
                     $('#'+iUrl+'_form').find('.'+ival[j]).siblings('.medInput').show();
                     $('#jb26Info').val(JSON.parse(ival[ival.length-3]).jb26Info);
                     $('#jb27Info').val(JSON.parse(ival[ival.length-2]).jb27Info);
                     $('#jb28Info').val(JSON.parse(ival[ival.length-1]).jb28Info);
                  }

               }
            }
        }else{
            $('.Ifsmoke').hide();
            $('.Ifsmoke').eq(0).show();
            $('.Select_j').removeClass('active');
            $('#custom_form_form .button').hide();
            $('.weui-cell').removeClass('active');
        }
    }
    $('.patientBack').on('tap',function(){
        var iH="J_signPDetail.html?memberId="+userId+"&signInfoId="+signInfoId+"";  //?memberId=321&signInfoId=2
        window.location.href=iH;
    })

});






















