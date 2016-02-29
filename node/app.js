var express = require('express');
var mysql      = require('mysql');
var app = express();

//引入async
var async=require('async');

//解决跨域问题
cors = require('cors');
app.use(cors());

//引入body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    user     : 'root',
    password : 'shorturl',
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
    var string = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    for(var i=0; i<len; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        string += arr[pos];
    }
    return string;
}



/*test*/
app.get('/test', function (req, res) {
    console.log("test success");
    res.send("ok");
});



/*shorten*/
app.post('/shorten', function (req, res) {

    var longurl = req.body.longurl;
    var shorturl=req.body.shorturl;
    console.log("longurl:"+longurl+"\nshorturl:"+shorturl);

    //定义插入数据的通用函数
    function inserturl(){
        //插入数据
        var myDate=new Date();
        var datetime=myDate.toLocaleString( );
        connection.query("INSERT INTO url (longurl,shorturl,datetime) VALUES ('" + longurl + "','" + shorturl + "','"+datetime+"')", function (err, rows) {
            if (err) {
                console.log(err.code);
                console.log(err.fatal);
                res.send("fail");
                return;
            }
            var data={
                'longurl':longurl,
                'shorturl':shorturl,
                'datetime':datetime
            };
            res.send(data);
            console.log("inserted");
        });
    }

    if (shorturl != "") {
        //如果用户传入的shorturl不为空则检查是否重复
        connection.query("SELECT * FROM url WHERE shorturl='"+shorturl+"'", function (err, rows) {
            if (err) {
                console.log(err.code);
                console.log(err.fatal);
                res.send("fail");
                return;
            }
            if (rows.length == 0) {
                inserturl();
            }else{
                res.send("repeat");
            }
        });
    }else{//如果shorturl为空
        //查询该longurl是否已经存在
        connection.query("SELECT * FROM url WHERE longurl='" + longurl + "'", function (err, rows) {
            if (err) {
                console.log(err.code);
                console.log(err.fatal);
                res.send("fail");
                return;
            }
            //如果存在则直接返回对应的行，并且更新时间戳
            if (rows.length != 0) {
                res.send(rows[0]);
                //todo 更新时间戳
                return;
            }
            //如果不存在，由于shorturl 为空，所以直接随机生成一个
            var string;
            function generate() {
                string = randomstr(5);
                //console.log(string);
                connection.query("SELECT * FROM url WHERE shorturl='" + string + "'", function (err, rows) {
                    if (err) {
                        console.log(err.code);
                        console.log(err.fatal);
                        res.send("fail");
                        return;
                    }
                    if (rows.length == 0) {
                        shorturl = string;
                        inserturl();
                    } else {
                        console.log("repeat!!!");
                        generate();
                    }
                });
            }
            generate();//递归调用
        });
    }


});


/*下划线开头的进行重定向*/
app.get('/_*', function (req, res) {
    var shorturl = req.path.substr(2);
    res.redirect("http://10.79.25.129/jump.html?"+shorturl);//TODO url更改
});



/*resume*/
app.get('/resume', function (req, res) {
    var shorturl = req.query.shorturl;
    console.log(shorturl);
    connection.query("SELECT * FROM url WHERE shorturl='"+shorturl+"'", function (err, rows) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            res.send("fail");
        } else {
            if (rows.length == 0) {
                res.send("noresult");//查不到结果返回noresult
            }else {
                //查询成功则返回longurl
                res.send(rows[0].longurl);
            }
        }
    });

});


/*启动服务器*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});