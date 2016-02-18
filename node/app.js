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
});

app.get('/shorten', function (req, res) {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected  id:' + connection.threadId);
    });

    var long = req.query.long;
    console.log(long);
    connection.query("SELECT * FROM url WHERE long='" + long + "'", function (err, rows) {
        if (err) {
            console.log(err.code); // 'ECONNREFUSED'
            console.log(err.fatal); // true
            res.send("fail");
            //connection.query("INSERT INTO url (long,short) values('test1','test2')",function(err,rows){
            //    if(err){
            //        console.log("insert error");
            //    }else{
            //        res.send("inserted!");
            //    }
            //});
        } else {
            res.send("ok");
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

    var short = req.query.short;
    connection.query("SELECT * FROM url WHERE short='"+short+"'", function (err, rows) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            res.send("fail");
        } else {
            res.send(rows.long);
        }
    });

    connection.end();
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});