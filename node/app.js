var express = require('express');
var mysql      = require('mysql');
var app = express();
var connection = mysql.createConnection({
    host     : '121.42.209.162',
    user     : 'root',//TODO 貌似这里不能是root啊。。
    password : '86.corrode',
    database : 'shorturl'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected  id:' + connection.threadId);
});


/*随机产生字符串函数*/
function randomstr(len){
    var str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    for(var i=0; i<len; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}



/*test*/
app.get('/test', function (req, res) {
    console.log("test success");
    res.send("ok");
});



/*shorten*/
app.get('/shorten', function (req, res) {


    var longurl = req.query.longurl;
    var shorturl=req.query.shorturl;
    console.log("longurl:"+longurl+"\nshorturl:"+shorturl);
    if (shorturl == "") {

    }else {
        connection.query("SELECT * FROM url WHERE longurl='" + longurl + "'", function (err, rows) {
            if (err) {
                console.log(err.code);
                console.log(err.fatal);
                res.send("fail");
                return;
            }
            console.log("query1 success");

            if (rows.length==0) {
                var myDate=new Date();
                var datetime=myDate.toLocaleString( );
                connection.query("INSERT INTO url (longurl,shorturl,datetime) VALUES ('" + longurl + "','" + shorturl + "','"+datetime+"')", function (err, rows) {
                    if (err) {
                        console.log(err.code);
                        console.log(err.fatal);
                        res.send("fail");
                        return;
                    }
                    res.send("inserted!");
                });
            } else {
                res.send(rows[0].shorturl);
            }
        });
    }


    //connection.end();
});


/*find*/
app.get('find', function (req, res) {

    var shorturl = req.query.shorturl;
    connection.query("SELECT * FROM url WHERE shorturl='"+shorturl+"'", function (err, rows) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            res.send("fail");
        } else {
            res.send(rows[0].longurl);
        }
    });

});


/*启动服务器*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});