function shorten(){
    //调用shorten方法
    $.ajax({
        url: "http://localhost:3000/shorten",
        type: "get",
        data: {
            longurl: $("#long").val(),
            shorturl:""
        }
    }).done(function (data) {
        if (data == "repeat") {
            alert("该短网址已被占用");
        }
        $("#short").text("http://s.zjuqsc.com/_"+data.shorturl);
        $("#index").hide();
        $("#result").show();
    }).fail(function () {
        alert("获取信息失败，请稍后再试");
    });
}

function copy(){

}


function add(){
    var strhtml='<div><input type="text" class="form-control" title="long" style="display: inline;width: 85%;">&nbsp;<button onclick="remove($(this))" class="btn btn-danger" style="width: 3em;">-</button></div>';
    $("#long").append(strhtml);
}

function remove(obj){
    console.log(obj.parent());
    obj.parent().remove();
}