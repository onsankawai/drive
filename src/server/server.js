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

    } else if( pathname === '/controller.js') {
        fs.readFile("../client/controller.js", function(err, data) {
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

/* Player data */
var players = [];
function Player(id) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.beta = 0;

}

server.listen(8080);

var socket_io = io.listen(server);
socket_io.sockets.on('connection', function(socket) {
    console.log("Client connected.");
    //socket.emit('message', {"message":"GG, WP"});

    socket.on('initialize', function() {
        if( players.length <= 4 ) {
            var playerId = players.length;
            console.log("playerId:", playerId);
            var newPlayer = new Player(playerId);
            switch(playerId) {
            case 0:
                newPlayer.x = 6;
                newPlayer.z = 6;
                newPlayer.beta = 45;
                break;
            case 1:
                newPlayer.x = -6;
                newPlayer.z = -6;
                newPlayer.beta = 225;
                break;
            case 2:
                newPlayer.x = 6;
                newPlayer.z = -6;
                newPlayer.beta = 135;
                break;
            case 3:
                newPlayer.x = -6;
                newPlayer.z = 6;
                newPlayer.beta = 315;
                break;
            }
            players.push(newPlayer);
            socket.emit('playerData', {id: playerId, players: players});
        }
        //socket.broadcast.emit('playerJoined', newPlayer);
    });
});

console.log("Server started.");
