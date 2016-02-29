function shorten(){
    var longurl="";
    var item="";
    var flag=true;
    $(".item").each(function(){
        item=$(this).val();
        if (item == "") flag=false;
        longurl = longurl + item + "|||||";
    });
    if (flag == false) {
        alert("请输入网址");
        return;
    }
    //调用API shorten
    $.ajax({
        url: "http://10.79.25.129:3000/shorten",
        type: "post",
        data: {
            longurl: longurl,
            shorturl:$("#short-set").val()
        }
    }).done(function (data) {
        if (data == "repeat") {
            alert("该短网址已被占用");
        }
        $("#short").text("http://10.79.25.129:3000/_"+data.shorturl);
        $("#index").hide();
        $("#result").show();
    }).fail(function () {
        alert("获取信息失败，请稍后再试");
    });
}

function copyurl(){

}

function openurl(){
    var url=$("#short").text();
    var a = $("<a href='"+url+"' target='_blank'>test</a>").get(0);

    var e = document.createEvent('MouseEvents');

    e.initEvent('click', true, true);
    a.dispatchEvent(e);
    console.log('event has been changed');
}

function add(){
    var strhtml='<div><input type="text" class="form-control item" title="long" style="display: inline;width: 85%;">&nbsp;<button onclick="remove($(this))" class="btn btn-danger" style="width: 3em;">-</button></div>';
    $("#long").append(strhtml);
}

function remove(obj){
    console.log(obj.parent());
    obj.parent().remove();
}