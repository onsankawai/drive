var http = require('http');
var url = require('url');
var io = require('socket.io');
var fs = require('fs');

function onRequest(req, res) {
    console.log('Connection');
    var pathname = url.parse(req.url).pathname;
    
    if( pathname === '/' ) {
    ///*
        fs.readFile("../client/client.html", function(err, data) {
            if(err) {
                res.writeHead(404, {"Content-Type":"text/html"});
                res.end();
            } else { 
                res.writeHead(200, {"Content-Type":"text/html"});
                res.write(data, "utf8");
                res.end();
            }
        });
    //*/
    /*
        res.writeHead(200, {"Content-Type":"text/html"});
        res.write("Dir:"+ __dirname);
        res.end();
    */
    } else if( pathname === '/client.js') {
        fs.readFile("../client/client.js", function(err, data) {
            if(err) {
                res.writeHead(404, {"Content-Type":"text/html"});
                res.end();
            } else {
                res.writeHead(200, {"Content-Type":"application/javascript"});
                res.write(data);
                res.end();
            }
        });

    } else if( pathname === '/first_person_camera.js') {
        fs.readFile("../client/first_person_camera.js", function(err, data) {
            if(err) {
                res.writeHead(404, {"Content-Type":"text/html"});
                res.end();
            } else {
                res.writeHead(200, {"Content-Type":"application/javascript"});
                res.write(data);
                res.end();
            }
        });

    } else if( pathname.substring(0,4) === '/lib') {
        fs.readFile("../client"+pathname , function(err, data) {
            if(err) {
                res.writeHead(404, {"Content-Type":"text/html"});
                res.end();
            } else {
                res.writeHead(200, {"Content-Type":"application/javascript"});
                res.write(data);
                res.end();
            }
        });

    } else  {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end();
    }

}

var server = http.createServer(onRequest);

server.listen(8080);

var socket_io = io.listen(server);
socket_io.sockets.on('connection', function(socket) {
    console.log("Client connected.");
    socket.emit('message', {"message":"GG, WP"});
});

console.log("Server started.");
