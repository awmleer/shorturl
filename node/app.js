var express = require('express');
var app = express();


app.get('/shorten', function (req, res) {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : '121.42.209.162',
        user     : 'root',
        password : '86.corrode',
        database : 'shorturl'
    });

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });

    var long=req.query.long;
    console.log(long);


    connection.query("SELECT * FROM url WHERE long=\"test\"", function(err, rows) {
        if(err){
            console.log(err.code); // 'ECONNREFUSED'
            console.log(err.fatal); // true
            connection.query("INSERT INTO url (long,short) values('test1','test2')",function(err,rows){
                if(err){
                    console.log("insert error");
                }else{
                    res.send("inserted!");
                }
            });
        }else{
            res.send("ok");
        }

    });

    connection.end();

});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});