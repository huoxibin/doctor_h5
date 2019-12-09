$(function () {
    $('.J_setContList ul').css('height',$(window).height()-$('.J_setTop').height()-$('.Ynav').height());
    //判断url参数是我的还是模板显示
    var set=getRequestParam('set');
    //初始化加载界面
    Newload();
    function Newload(){
        $('.J_setTop h2').eq(set).addClass('active').siblings('h2').removeClass('active');
        $('.J_setContList').eq(set).addClass('active').siblings().removeClass('active');
        if(set==1){//如果是模板
            var YData={
                'pathL':"/doctor/teamPackTemplate/getTemplateList",
                'accessToken':token
            }
            loadAction(YData,$('.J_setContListTwo'),1);
        }else{  //如果是我的
            var YData={
                'pathL':"/doctor/teamPackInfo/getTeamPackInfo",
                'accessToken':token
            }
            loadAction(YData,$('.J_setContListOne'),0);
        }
    }
    $('.J_setTop h2').on('tap',function(){
        $(this).addClass('active').siblings('h2').removeClass('active');
        var Index=0;
        var jump=1;
        if($(this).index()==2){ //如果是服务包模板
            Index=1;
            //请求接口
            jump=1;
            var YData={
                'pathL':"/doctor/teamPackTemplate/getTemplateList",
                'accessToken':token
            }
            loadAction(YData,$('.J_setContListTwo'),jump);

        }else{   //如果是我的服务包
            jump=0;
            var YData={
                'pathL':"/doctor/teamPackInfo/getTeamPackInfo",
                'accessToken':token
            }
            loadAction(YData,$('.J_setContListOne'),jump);
        }
        $('.J_setContList').eq(Index).addClass('active').siblings().removeClass('active')
    })
    function loadAction(YData,box,jump){
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
                    if(jump==0){  //如果是我的，返回格式不一样
                        var data=res.data.itemList;
                        var teamRole=res.data.teamRole;
                        var topHtml= new EJS({url:"../compileEjs/J_MySerSet.ejs"}).render({data:data,jump:jump,teamRole:teamRole});
                        box.html(topHtml);
                        $('.J_setContList').eq(0).addClass('active').siblings().removeClass('active');
                    }else{
                        var data=res.data;
                        var topHtml= new EJS({url:"../compileEjs/J_MySerSet.ejs"}).render({data:data,jump:jump});
                        box.html(topHtml);
                        $('.J_setContList').eq(1).addClass('active').siblings().removeClass('active');
                    }

                   /* $('.p_item').on('tap',function(){
                        var isId=$(this).attr('isId');
                        var iHref="../html/J_patientDetail.html?memberId="+isId+"";
                        // sessionStorage.setItem('patientSession',allData[$(this).index()]);
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","患者管理", "查看", "查看患者详情", "","p_item"]);
                    })*/
                }else{
                    showError(res.msg);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }



})