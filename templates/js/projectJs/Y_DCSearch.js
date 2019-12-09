$(function(){
    //FastClick.attach(document.body);
    var token=sessionStorage.getItem('JdocToken');
    $('.JindexBox').css('height',$(window).height()-$('.Ynav').height());
    var inp = $("#YSeachinput");
    inp.on('input',function(){
        _czc.push(["_trackEvent","疾病搜索", "搜索", "搜索使用次数", "", "YSeachinput"]);
        search(inp);
    })
    /*搜索方法*/
    var search = function (This) {
        //$('.J_RecomSearch li').hide();
        var val = This.val();
        if(val!=''){
            //调取ajax
            loadAction(val);
        }else{
            $('.Y_DCSeach li').hide();
            $('.JloadAll').hide();
        }
    };
    function addColor(val){
        var NewLength=[];
        var val=$("#YSeachinput").val();
        var iText=$.trim(val).split('');
        var ispan='<span class="isTip">'+val+'</span>';
        if (iText.indexOf(val) >= 0) { //如果有
            NewLength.push(iText.indexOf(val));
        }else{ //如果没有
            if (iText.indexOf(toUpperCase(val)) >= 0) { //如果有
                NewLength.push(iText.indexOf(toUpperCase(val)));
            }
        }
        iText.splice(NewLength[0],val.length,ispan);
        iText.join('');
        console.log(iText.join(''));
    }
    $('.DCcancleBtn').on('tap',function(){  //点击取消按钮清空数据
        $("#YSeachinput").val('');
        $('.Y_DCSeach li').hide();
    })
    function loadAction(val){
        var YData={
            'pathL':"/doctor/doctorSearchDiseaseInfo/queryDiseaseName",
            'param':val,
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
                   /* var res={"data":{"diseaseName":["EB病毒","EB病毒感染","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒","EB病毒感染与鼻咽癌","Ehler-Danlos综合征","Ehler-Danlos综合征(皮肤弹性过度综合征)"],"param":"e"},"msg":"成功","state":0}*/
                    var data=res.data;
                    var disease=data.diseaseName;
                    var param=data.param;
                    var topHtml= new EJS({url:"../compileEjs/Y_DCSearch.ejs"}).render({data:disease,param:param});
                    $('.Y_DCSeach').html(topHtml);
                    $('.JloadAll').show();
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
                        $('.j_patient_up').css({
                            'height':'255px'
                        })
                    }
                    //$('.Y_DCSeach ul').css('height',$('.JindexBox').height()-)
                    $(".dcListclick").on("tap", function (event) {
                        var This=$(this);
                        setTimeout(function(){
                            var iHref=This.attr('iHref');
                            window.location.href=iHref;
                        },320);
                        event.preventDefault();
                    });
                    $('.Y_DCSeach li').each(function(i){
                      if(i>10){
                          $('.Y_DCSeach li').eq(i).hide();
                      }
                    })
                    $('.JloadAll').on('tap',function(){
                        $('.Y_DCSeach li').show();
                        $('.JloadAll').removeClass('active');
                        $('.JloadAll').text('更多结果请输入完整搜索内容');
                    })
                   /* var arr=new Array();
                    $('.Y_DCSeach ul li').each(function(){
                        arr.push($(this).find('a').html())
                    })*/
                    var val=$('.YSeachinput').val();
                    /*if(val!=''){
                        debugger;
                        /!*第几个li*!/
                        var NewNum=[];
                        /!*搜索的字在li里是第几个*!/
                        var NewLength=[];
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].indexOf(val) >= 0) {
                                NewLength.push(arr[i].indexOf(val));
                                NewNum.push(i);
                            }
                        }
                        if(NewNum.length!=0){
                            for(var j=0;j<NewNum.length;j++){
                                var ispan='<span class="isTip">'+val+'</span>';
                                var iText=$.trim($('.Y_DCSeach ul li').eq(NewNum[j]).text()).split('');
                                iText.splice(NewLength[j],val.length,ispan);
                                iText.join('');
                                debugger;
                                $('.Y_DCSeach ul li').eq(NewNum[j]).find('a').html(iText);
                                $('.Y_DCSeach ul li').eq(NewNum[j]).show();
                            }
                        }
                    }*/

                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























