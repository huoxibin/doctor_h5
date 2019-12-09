$(function(){
    var Y_lidata=localStorage.getItem("Y_lidata");
    var html= new EJS({url:"../compileEjs/Y_MoreECGDetail.ejs"}).render({data:JSON.parse(Y_lidata)});
    $(html).appendTo('.Y_MoreECGDa');
})