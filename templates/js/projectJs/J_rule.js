$(function(){
    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/common/systemParam/queryParamInfo",
            'paramKey':'withdrawTime'
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
                    var data=res.data.paramValue;
                    var str1 = data.replace(',', '~');
                    $('.Jtimes').text(str1);
                    $('.J_rule').show();
                }else{
                    $('.Jtimes').text('10～15');
                    $('.J_rule').show();
                    showalert(0,''+res.msg+'',2);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























