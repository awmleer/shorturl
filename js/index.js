function shorten(){
    $.ajax({
        url: "http://localhost:3000/shorten",
        type: "get",
        data: {long: $("#long").val()},
        dataType: "json"
    }).done(function (data) {
        $("#short").val(data.short);
        $("#index").hide();
        $("#result").show();
    }).fail(function () {
        alert("获取信息失败，请稍后再试");
    });
}

function copy(){

}