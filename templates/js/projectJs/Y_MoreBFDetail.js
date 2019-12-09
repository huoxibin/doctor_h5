$(function(){
    var H_id=getRequestParam('id');
    var YData={
        'pathL':"/health/bodyFatRate/details",
        // 'accessToken':'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1MzcxNTE2OTEsInN1YiI6IntcImltQWNjaWRcIjpcImRldl9kb2N0b3JfMTAwMjQzXCIsXCJpbVRva2VuXCI6XCI2ZTdiOTZiYjc0YWRhYzJhYzAzZjEyYWQxNzVkNjRlZVwiLFwiaW5kZXhcIjo3LFwicmVmcmVzaFRva2VuXCI6ZmFsc2UsXCJyb2xlVHlwZVwiOjIsXCJzZXNzaW9uSWRcIjpcIjZFMUE4Q0NENzE4RDYzREIxOTZEOUEzQkM0MzM5Mzk5XCIsXCJ1c2VyQWdlbnRcIjpcIlBvc3RtYW5SdW50aW1lLzcuMy4wXCIsXCJ1c2VySWRcIjoxMDAyNDN9IiwiZXhwIjoxNTM3NzU2NDkxfQ.Qi6TOefCqnVJyNhhewb4mYWul3Bpocue_UKzPHLs7Bc',
        // 'id':28
        'accessToken':token,
        'id':H_id
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
                var html= new EJS({url:"../compileEjs/Y_MoreBFDetail.ejs"}).render({data:data});
                $(html).appendTo('.Y_MoreBFDa');
                // 注意指标
                var inner1 = '';
                for (var i=0; i<data.listHightData.length; i++) {
                    var dataH = data.listHightData;
                    var img = '';
                    if(dataH[i].name == '体重')img = '<img src="../images/Group_9.png"/>';
                    if(dataH[i].name == '基础代谢率')img = '<img src="../images/Group_10.png"/>';
                    if(dataH[i].name == '蛋白质率')img = '<img src="../images/Group_11.png"/>';
                    if(dataH[i].name == '体脂率')img = '<img src="../images/Group_13.png"/>';
                    if(dataH[i].name == '内脏脂肪数')img = '<img src="../images/Group_14.png"/>';
                    if(dataH[i].name == '肌肉率')img = '<img src="../images/Group_16.png"/>';
                    if(dataH[i].name == '身体含水率')img = '<img src="../images/Group_18.png"/>';
                    if(dataH[i].name == '骨骼质量')img = '<img src="../images/Group_19.png"/>';
                    if(dataH[i].name == '皮下脂肪率')img = '<img src="../images/Group_20.png"/>';
                    inner1 += "<div class=\"content\">\n" +
                        "                <div class=\"content_left\">\n" +
                        "                    <div class=\"content_img\">"+img+"</div>\n" +
                        "                    <div class=\"content_o\">"+dataH[i].name+"</div>\n" +
                        "                    <div class=\"content_t\">"+dataH[i].value+"</div>\n" +
                        "                    <div class=\"content_r\">"+dataH[i].LevelInfo+"</div>\n" +
                        "                </div>\n" +
                        "                <div class=\"arrow_loc\">\n" +
                        "                    <span>\n" +
                        "                    </span>\n" +
                        "                    <div class=\"weight\">\n" +
                        "                        <div class=\"weight_con\">\n" +
                        "                            "+dataH[i].LevelDesc+"\n" +
                        "                        </div>\n" +
                        "                        <s>\n" +
                        "                            <i></i>\n" +
                        "                        </s>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>"
                }
                $(inner1).appendTo('#listHightData_list');
                // 警告指标
                var inner2 = '';
                for (var i=0; i<data.listLowData.length; i++) {
                    var dataH = data.listLowData;
                    var img = '';
                    if(dataH[i].name == '体重')img = '<img src="../images/Group_9.png"/>';
                    if(dataH[i].name == '基础代谢率')img = '<img src="../images/Group_10.png"/>';
                    if(dataH[i].name == '蛋白质率')img = '<img src="../images/Group_11.png"/>';
                    if(dataH[i].name == '体脂率')img = '<img src="../images/Group_13.png"/>';
                    if(dataH[i].name == '内脏脂肪数')img = '<img src="../images/Group_14.png"/>';
                    if(dataH[i].name == '肌肉率')img = '<img src="../images/Group_16.png"/>';
                    if(dataH[i].name == '身体含水率')img = '<img src="../images/Group_18.png"/>';
                    if(dataH[i].name == '骨骼质量')img = '<img src="../images/Group_19.png"/>';
                    if(dataH[i].name == '皮下脂肪率')img = '<img src="../images/Group_20.png"/>';
                    inner2 += "<div class=\"content\">\n" +
                        "                <div class=\"content_left\">\n" +
                        "                    <div class=\"content_img\">"+img+"</div>\n" +
                        "                    <div class=\"content_o\">"+dataH[i].name+"</div>\n" +
                        "                    <div class=\"content_t\">"+dataH[i].value+"</div>\n" +
                        "                    <div class=\"content_r_t\">"+dataH[i].LevelInfo+"</div>\n" +
                        "                </div>\n" +
                        "                <div class=\"arrow_loc\">\n" +
                        "                    <span>\n" +
                        "                    </span>\n" +
                        "                    <div class=\"weight\">\n" +
                        "                        <div class=\"weight_con\">\n" +
                        "                            "+dataH[i].LevelDesc+"\n" +
                        "                        </div>\n" +
                        "                        <s>\n" +
                        "                            <i></i>\n" +
                        "                        </s>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>"
                }
                $(inner2).appendTo('#listLowData');
                // 放心指标
                var inner3 = '';
                for (var i=0; i<data.listNormalData.length; i++) {
                    var dataH = data.listNormalData;
                    var img = '';
                    if(dataH[i].name == '体重')img = '<img src="../images/Group_9.png"/>';
                    if(dataH[i].name == '基础代谢率')img = '<img src="../images/Group_10.png"/>';
                    if(dataH[i].name == '蛋白质率')img = '<img src="../images/Group_11.png"/>';
                    if(dataH[i].name == '体脂率')img = '<img src="../images/Group_13.png"/>';
                    if(dataH[i].name == '内脏脂肪数')img = '<img src="../images/Group_14.png"/>';
                    if(dataH[i].name == '肌肉率')img = '<img src="../images/Group_16.png"/>';
                    if(dataH[i].name == '身体含水率')img = '<img src="../images/Group_18.png"/>';
                    if(dataH[i].name == '骨骼质量')img = '<img src="../images/Group_19.png"/>';
                    if(dataH[i].name == '皮下脂肪率')img = '<img src="../images/Group_20.png"/>';
                    inner3 += "<div class=\"content\">\n" +
                        "                <div class=\"content_left\">\n" +
                        "                    <div class=\"content_img\">"+img+"</div>\n" +
                        "                    <div class=\"content_o\">"+dataH[i].name+"</div>\n" +
                        "                    <div class=\"content_t\">"+dataH[i].value+"</div>\n" +
                        "                    <div class=\"content_r_n\">"+dataH[i].LevelInfo+"</div>\n" +
                        "                </div>\n" +
                        "                <div class=\"arrow_loc\">\n" +
                        "                    <span>\n" +
                        "                    </span>\n" +
                        "                    <div class=\"weight\">\n" +
                        "                        <div class=\"weight_con\">\n" +
                        "                            "+dataH[i].LevelDesc+"\n" +
                        "                        </div>\n" +
                        "                        <s>\n" +
                        "                            <i></i>\n" +
                        "                        </s>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>"
                }
                $(inner3).appendTo('#listNormalData');
                $(".content").on('tap',function () {
                    $(this).find('.weight').toggle();
                    $(this).find("span").toggleClass('arrow_1');
                });
                /*$('.shadowWrapper').css('height',$(window).height()-$('.Jnav').height());
                $('#wrapper').css('height',$('.shadowWrapper').height()-$('.title').height());*/
            }else{
                showError("无法连接到服务器 ("+res.state+"),请检查你的网络或者稍后重试");
            }
        },
        error:function(res){
            /*  alert(2)*/
        }
    });
});