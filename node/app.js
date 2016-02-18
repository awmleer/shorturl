var express = require('express');
var mysql      = require('mysql');
var app = express();
var connection = mysql.createConnection({
    host     : '121.42.209.162',
    user     : 'root',//TODO 貌似这里不能是root啊。。
    password : '86.corrode',
    database : 'shorturl'
});

app.get('/test', function (req, res) {
    console.log("test success");
    res.send("ok");
});

app.get('/shorten', function (req, res) {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected  id:' + connection.threadId);
    });

    var longurl = req.query.longurl;
    console.log(longurl);
    connection.query("SELECT * FROM url WHERE longurl='" + longurl + "'", function (err, rows) {
        if (err) {
            console.log(err.code); // 'ECONNREFUSED'
            console.log(err.fatal); // true
            res.send("fail");
            //connection.query("INSERT INTO url (longurl,shorturl) values('test1','test2')",function(err,rows){
            //    if(err){
            //        console.log("insert error");
            //    }else{
            //        res.send("inserted!");
            //    }
            //});
        } else {
            res.send(rows[0].shorturl);
        }

    });
    connection.end();
});

app.get('find', function (req, res) {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected  id:' + connection.threadId);
    });

    var shorturl = req.query.shorturl;
    connection.query("SELECT * FROM url WHERE shorturl='"+shorturl+"'", function (err, rows) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            res.send("fail");
        } else {
            res.send(rows.longurl);
        }
    });

    connection.end();
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});