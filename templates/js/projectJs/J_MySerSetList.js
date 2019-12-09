$(function () {
    //判断是我的还是模板
    var bar=decodeURI(getRequestParam('bar'));
    var id=decodeURI(getRequestParam('id'));
    /* var userId=decodeURI(getRequestParam('userId'));*/
    var packageName=decodeURI(getRequestParam('packageName'));
    var packageNum=decodeURI(getRequestParam('packageNum'));
    var isCaptain,IsuggestPrice;
    var ifPrice=false;
    var selectArr=[];
    var iSF;
    $('.isT').text(packageName);
    $('.sign_d_title i').text(packageNum);
    //加载服务包项ajajx
    ajajLoad();
    function ajajLoad(){
        if(bar==0){ //如果是我的，可以进行编辑修改添加
            var YData={
                'pathL':"/doctor/teamPackItem/getPackItems",
                "packageId":id,
                'accessToken':token
            }
            loadAction(YData,bar);
        }else{  //如果是模板列表 去掉编辑和添加按钮
            var YData={
                'pathL':"/doctor/teamPackTemplateitem/getItemList",
                "packageId":id,
                'accessToken':token
            }
            loadAction(YData,bar);
        }
    }
    $('.JserBack').on('tap',function(){
        window.location.href="../html/J_MySerSet.html?set="+bar+"";
    })
    function loadAction(YData,bar){
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
                    isCaptain=data.isCaptain;
                    var isData=data.itemList;
                    var topHtml= new EJS({url:"../compileEjs/J_MySerSetList.ejs"}).render({data:isData,bar:bar,isCaptain:isCaptain,selectArr:selectArr});
                    $('.J_setContLists').html(topHtml); //packIcon
                    //点击详情
                    $('.J_setContLists img').on('tap',function(){
                        //var iBox=$(this).parent().siblings('.J_setDetailbox');
                        if($(this).parent().siblings('.J_setDetailbox').hasClass('active')){
                            $(this).attr('src','../../images/JserBottom.png');
                            $(this).parent().siblings('.J_setDetailbox').removeClass('active');

                        }else{
                            $(this).parent().siblings('.J_setDetailbox').addClass('active');
                            $(this).attr('src','../../images/JserTop.png');
                        }
                    })
                    //点击选择框
                    $('.checkBox').on('tap',function(){  //判断是否是队长
                        if(isCaptain==1){  //是队长
                            var isId=Number($(this).attr('isId'));
                            if($(this).hasClass('active')){
                                $(this).removeClass('active');
                                selectArr.splice(selectArr.indexOf(isId),1);
                            }else{
                                $(this).addClass('active');
                                selectArr.push(isId);
                            }
                        }else{  //不是队长
                            showalert(0,'您不是队长不能选择',2);
                        }
                    })
                    if(bar==0){  //判断是我的还是模板
                        if(isCaptain==1){//是队长
                            $('.editSer,.addSer').show();
                            $('.J_setContList ul').css('height',$(window).height()-$('.J_setTitle').height()-$('.Ynav').height()-80);
                        }else{
                            $('.editSer,.addSer').hide();
                            $('.J_setContList ul').css('height',$(window).height()-$('.J_setTitle').height()-$('.Ynav').height());
                        }
                    }else{
                        $('.editSer,.addSer').hide();
                        $('.J_setContList ul').css('height',$(window).height()-$('.J_setTitle').height()-$('.Ynav').height());
                    }
                    $('.editSer').on('tap',function(){  //编辑按钮点击时候
                        $('.diaTitle').text('编辑服务项');
                        $('.suggestPriceBox').hide();
                        iSF=$(this).attr('isBtn');
                        var packageId=$(this).attr('packageId');
                        var isData=JSON.parse($(this).attr('isData'));
                        isData.description==null?isData.description='':isData.description=isData.description;
                        isData.suggestPrice==null?isData.suggestPrice='':isData.suggestPrice=isData.suggestPrice;
                        IsuggestPrice=isData.suggestPrice;
                        if(isData.suggestPrice==null||isData.suggestPrice==''){
                            ifPrice=false
                        }else{
                            ifPrice=true;
                        }
                        $('.JdialogBox').show().css('opacity','1');
                        //初始化表单
                        $('.JdialogBox .kind').val(2);
                        for(var i in isData){
                            if(i=='suggestPrice'){
                                $('.JdialogBox').find('.'+i+'').text(isData[i]);
                            }else{
                                $('.JdialogBox').find('.'+i+'').val(isData[i]);
                            }
                        }
                        // $('.JdialogBox .price').val(to($('.JdialogBox .price').val()),2);
                        $('.keydownVal em').text($('.JdialogBox .description').val().length);
                        //$(".diaBox form").serialize()
                    })
                    //添加按钮点击
                    $('.addSer').on('tap',function(){
                        $('.diaTitle').text('添加服务项');
                        IsuggestPrice='';
                        iSF=2;
                        $('.suggestPriceBox').hide();
                        $('.JdialogBox').show().css('opacity','1');
                        $('.JdialogBox input,.JdialogBox textarea').val('');
                        $('.JdialogBox .kind').val(1);
                        //$('.JdialogBox .price').val(to($('.JdialogBox .price').val()),2);
                        $('.keydownVal em').text(0);
                        $('.JdialogBox .packageId').val(id);
                    })
                    $('.cancleBtn').on('tap',function(){
                        $('.JdialogBox').hide().css('opacity','0');
                    })
                    //表单金额value改变时候
                    $('.JdialogBox .price').off('change').on('change',function(){
                        $('.JdialogBox .price').val(to($('.JdialogBox .price').val(),2));
                    })
                    $('.JdialogBox .price').on('focus',function(){
                        $(this).attr('placeholder','');
                        if(iSF==1){ //是模板服务项,有建议价格
                            if(ifPrice){
                                $('.suggestPriceBox').show();
                            }else{
                                $('.suggestPriceBox').hide();
                            }
                        }else{
                            $('.suggestPriceBox').hide();
                        }
                    })
                    $('.JdialogBox .price').on('blur',function(){
                        $(this).attr('placeholder','0.00');
                    })
                    $('.JdialogBox .frequency').on('blur',function(){
                        $(this).attr('placeholder','0');
                    })
                    $('.JdialogBox .frequency').on('focus',function(){
                        $(this).attr('placeholder','');
                    })
                    //表单textarea改变时候
                    $('.JdialogBox .description').on('input',function(){
                        var iL=$(this).val().length;
                        $('.keydownVal em').text(iL);
                        var maxwidth=40;
                        if($(this).val().length>=maxwidth){
                            $(this).val($(this).val().substring(0,maxwidth));
                            $('.keydownVal em').text(40);
                        }
                    })
                    //表单textarea改变时候
                    $('.JdialogBox .itemNames').on('input',function(){
                        var maxwidth=20;
                        if($(this).val().length>=maxwidth){
                            $(this).val($(this).val().substring(0,maxwidth));
                        }
                    })
                    $('.okBtn').off('tap').on('tap',function(){
                        //验证表单
                        var iNum=true;
                        $('.JdialogBox .inputSel').each(function(i){
                            if($('.JdialogBox .inputSel').eq(i).val()==''){
                                iNum=false;
                                return;
                            }
                        })
                        if(iNum){
                            if($('.itemNames').val().length<=20){
                                var param = $('.itemNames').val();
                                var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
                                if(!param.match(regRule)){
                                    var numVal=$('.frequency').val();
                                    var price=$('.price').val();
                                    var re=/^\d+$/;
                                    if(Number(numVal)>=1 && Number(numVal)<=999){
                                        if (re.test(numVal)){
                                            if(parseFloat(removeFormatMoney(price))>=0 && parseFloat(removeFormatMoney(price))<=9999){
                                                if(IsuggestPrice!=''){  //如果有建议价格是后台创建
                                                    IsuggestPriceMin=Number(IsuggestPrice.split('—')[0].split('元')[0]);
                                                    IsuggestPriceMax=Number(IsuggestPrice.split('—')[1].split('元')[0]);
                                                    if(parseFloat(removeFormatMoney(price))>=IsuggestPriceMin && parseFloat(removeFormatMoney(price))<=IsuggestPriceMax){
                                                        if($('.description').val().length<=40){
                                                            var param = $('.description').val();
                                                            if(!param.match(regRule)){
                                                                var YData={
                                                                    'pathL':"/doctor/teamPackItem/editOrAddItem",
                                                                    "itemId":$('.JdialogBox .itemId').val(),
                                                                    "itemName":$('.JdialogBox .itemName').val(),
                                                                    "frequency":$('.JdialogBox .frequency').val(),
                                                                    'price':removeFormatMoney($('.JdialogBox .price').val()),
                                                                    'description':$('.JdialogBox .description').val(),
                                                                    'packageId':$('.JdialogBox .packageId').val(),
                                                                    'kind':$('.JdialogBox .kind').val(),
                                                                    'accessToken':token
                                                                }
                                                                EditBar(YData);
                                                            }else{
                                                                showalert(0,'服务说明不能输入表情符',2);
                                                            }
                                                        }else{
                                                            showalert(0,'服务说明不能超过40字',2);
                                                        }
                                                    }else{
                                                        showalert(0,'您输入的价格只能在指导价范围之内',2);
                                                    }
                                                }else{
                                                    if($('.description').val().length<=40){
                                                        var param = $('.description').val();
                                                        if(!param.match(regRule)){
                                                            var YData={
                                                                'pathL':"/doctor/teamPackItem/editOrAddItem",
                                                                "itemId":$('.JdialogBox .itemId').val(),
                                                                "itemName":$('.JdialogBox .itemName').val(),
                                                                "frequency":$('.JdialogBox .frequency').val(),
                                                                'price':removeFormatMoney($('.JdialogBox .price').val()),
                                                                'description':$('.JdialogBox .description').val(),
                                                                'packageId':$('.JdialogBox .packageId').val(),
                                                                'kind':$('.JdialogBox .kind').val(),
                                                                'accessToken':token
                                                            }
                                                            EditBar(YData);
                                                        }else{
                                                            showalert(0,'服务说明不能输入表情符',2);
                                                        }
                                                    }else{
                                                        showalert(0,'服务说明不能超过40字',2);
                                                    }
                                                }
                                            }else{
                                                showalert(0,'价格大于0小于9999',2);
                                            }
                                        }else{
                                            showalert(0,'频次只能输入整数',2);
                                        }
                                    }else{
                                        showalert(0,'频次大于1小于999',2);
                                    }
                                }else{
                                    showalert(0,'服务项名称不能输入表情符',2);
                                }
                            }else{
                                showalert(0,'服务项名称不能超过20字',2);
                            }
                        }else{
                            showalert(0,'请输入全部字段',2);
                        }
                    })
                }else{
                    showalert(0,res.msg,2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
   $('.JsaveBar').on('tap',function(){
       if(bar==0){ //如果是我的的保存，前台展示用
           if(selectArr.length>0){
               var YData={
                   'pathL':"/doctor/teamPackItem/showItem",
                   "itemIds":selectArr.join(','),
                   "packageId":id,
                   'accessToken':token
               }
               saveBar(YData,bar);
           }else{
               var YData={
                   'pathL':"/doctor/teamPackItem/showItem",
                   "itemIds":'',
                   "packageId":id,
                   'accessToken':token
               }
               saveBar(YData,bar);
           }
       }else{  //如果是模板的保存
           if(selectArr.length>0){
               var YData={
                   'pathL':"/doctor/teamPackTemplateitem/saveItemList",
                   "packageName":packageName,
                   "packageId":id,
                   "packIcon":$('#packIcon').val(),
                   "itemIds":selectArr.join(','),
                   'accessToken':token
               }
               saveBar(YData,bar);
           }else{
               showalert(0,'请勾选一项',2);
           }
       }
   })
    function EditBar(YData){
        Ajax({
            url:servUrl,
            data:YData,
            async: false,
            beforeSend: function(){
                showLoading();
            },
            type : 'get',
            dataType : "json",
            success:function(res){
                hideLoading();
                if(res.state==0){
                    showalert(0,res.msg,2);
                    ajajLoad(); //更新后面列表
                    $('.JdialogBox').hide().css('opacity','0');
                }else{
                    showalert(0,res.msg,2);
                }
            },
            error:function(res){
                hideLoading();
                showalert(0,'请求失败',2);
            }
        });
    }
    function saveBar(YData,bar){
        Ajax({
            url:servUrl,
            data:YData,
            async: false,
            beforeSend: function(){
                showLoading();
            },
            type : 'get',
            dataType : "json",
            success:function(res){
                hideLoading();
                if(res.state==0){
                    showalert(0,res.msg,2);
                    if(bar!=0){   //如果是服务包模板保存
                      // window.location.href="../../html/J_MySerSet.html?set=1"
                      window.history.back(-1);
                    }
                }else{
                    showalert(0,res.msg,2);
                }
            },
            error:function(res){
                hideLoading();
                showalert(0,'请求失败',2);
            }
        });
    }
    $('.checkAll').on('tap',function(){
        /* if(isCaptain==1){  //是队长
         var isId=$(this).attr('isId');
         if($(this).hasClass('active')){
         $(this).removeClass('active');
         selectArr.splice(selectArr.indexOf(isId),1);
         }else{
         $(this).addClass('active');
         selectArr.push(isId);
         }
         }else{  //不是队长
         showalert(0,'您不是队长不能选择',2);
         }*/


        if(isCaptain==1){//是队长
            $('.checkBox').addClass('active');
            $('.checkBox').each(function(i){
                var isId=$('.checkBox').eq(i).attr('isId');
                selectArr.push(isId);
            })
        }else{
            showalert(0,'您不是队长不能选择',2);
        }
    })
});

// 解决ios移动端 软键盘收起后，页面内容不下滑
$('input,textarea').on('blur',function(){
   window.scroll(0,0);
});
$('select').on('change',function(){
   window.scroll(0,0);
});