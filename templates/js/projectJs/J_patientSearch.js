$(function(){
    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
    var inp = $("#YSeachinput");
    var inputLock = false;
    var searchType=0;
    inp.on('compositionstart', function(){
        inputLock = true;
    })
    inp.on('compositionend', function(){
        inputLock = false;
        if(!inputLock){
            var val = $(this).val();
            _czc.push(["_trackEvent","患者搜索", "搜索", "搜索使用次数", "", "YSeachinput"]);
            isSearch(val);
        }
    })
    inp.on('input',function(){
        if(!inputLock){
            var val = $(this).val();
            _czc.push(["_trackEvent","患者搜索", "搜索", "搜索使用次数", "", "YSeachinput"]);
            isSearch(val);
        }
    })
    $('.DCcancleBtn').on('tap',function(){  //点击取消按钮清空数据
        $("#YSeachinput").val('');
        $('.Y_DCSeach li').hide();
        $('.JnoData').hide();
        $('.J_patientList li').hide();

    })
    function isSearch(val){
        if(val!=''){
            if(isNaN(val) == true){
                searchType=0;
            }else{
                searchType=1
            }
            search(val,searchType);
        }else{
            $('.J_patientList li').hide();
            $('.JnoData').hide();
        }
    }
    function search(val,searchType){
        var YData={
            'pathL':"/doctor/doctorPatient/myPatientBySearch",
            'accessToken':token,
            'searchType':searchType,
            'serachValue':val
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
                    if(data.length>0){
                        for(var i=0;i<data.length;i++){
                            var iVal=JSON.stringify(data[i]);
                            allData.push(iVal);
                        }
                    }
                    var topHtml= new EJS({url:"../compileEjs/J_patientSearch.ejs"}).render({data:data});
                    $('.J_patientList').html(topHtml);

                    $('.p_item').on('tap',function(){
                        var isId=$(this).attr('isId');
                        var iHref="../html/J_patientDetail.html?memberId="+isId;
                        sessionStorage.setItem('patientSession',allData[$(this).index()]);
                        window.location.href=iHref;
                        //界面跳转，缓存数据   sessionStorage.getItem('dataSession')
                    })
                    //sessionStorage.setItem('patientSession',allData[$(this).index()]);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























