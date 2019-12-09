$(function(){
    var isId= getRequestParam('id');
    var isMemo= getRequestParam('memo');
    var turnoverType = getRequestParam('turnoverType');
    // var token=sessionStorage.getItem('JdealToken');
    loadAction();
    function loadAction(){
        var YData={
            'pathL':"/doctor/doctorAccountturnover/fromOrtoTurnoverDetail",
            'id':isId,
            'turnoverMemo':'提现',
            'turnoverType':11,
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
                    var topHtml= new EJS({url:"../compileEjs/J_historyDetail.ejs"}).render({data:data,memo:isMemo});
                    $('.J_patient').html(topHtml);
                }
            },
            error:function(res){
                showalert(0,'请求失败',2);
            }
        });
    }
})























