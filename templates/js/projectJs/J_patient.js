$(function(){
    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorPatient/myPatientList",
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
                    var allData=[];
                    for(var i=0;i<data.length;i++){
                        var iVal=JSON.stringify(data[i]);
                        allData.push(iVal);
                    }
                    var topHtml= new EJS({url:"../compileEjs/J_patient.ejs"}).render({data:data});
                    $('.J_patientList').html(topHtml);
                    $('.p_item').on('tap',function(){
                        var isId=$(this).attr('isId');
                        var iHref="../html/J_patientDetail.html?memberId="+isId+"";
                       // sessionStorage.setItem('patientSession',allData[$(this).index()]);
                        window.location.href=iHref;
                        _czc.push(["_trackEvent","患者管理", "查看", "查看患者详情", "","p_item"]);
                    })
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























