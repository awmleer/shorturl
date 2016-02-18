var express = require('express');
var mysql      = require('mysql');
cors = require('cors');
var app = express();
app.use(cors());
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
app.get('/shorten', function (req, res) {


    var longurl = req.query.longurl;
    var shorturl=req.query.shorturl;
    console.log("longurl:"+longurl+"\nshorturl:"+shorturl);

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

        //如果不存在再去判断shorturl是否为空
        if (shorturl == "") {
            //如果用户传入的shorturl为空则随机生成一个
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
                        shorturl=string;
                        inserturl();
                    } else {
                        console.log("repeat!!!");
                        generate();
                    }
                });
            }
            generate();
        }else{
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
        }

    });

});


/*下划线开头的进行解析并重定向*/
app.get('/_*', function (req, res) {
    var shorturl = req.path.substr(2);
    connection.query("SELECT * FROM url WHERE shorturl='"+shorturl+"'", function (err, rows) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            res.send("fail");
        } else {
            if (rows.length == 0) {
                res.send("noresult");//查不到结果返回noresult
            }else {
                res.redirect(rows[0].longurl);//查询成功则重定向
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