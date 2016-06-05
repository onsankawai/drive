//=========================================================
// Browser variable setup
//=========================================================
var pc, app;
window = {};
document = {};

Ammo = {};

Element = {};
Element.prototype = {mozRequestFullScreen:false};

//webgl null function for headless server
var webgl_null = function(){};
//headless null all functions
webgl_null.prototype={
    getParameter:function(){},
    getExtension:function(){},
    disable:function(){},
    blendFunc:function(){},
    blendEquation:function(){},
    colorMask:function(){},
    enable:function(){},
    cullFace:function(){},
    depthMask:function(){},
    clearDepth:function(){},
    clearColor:function(){},
    createBuffer:function(){},
    bindBuffer:function(){},
    bufferData:function(){},
    getError:function(){},
    vertexAttribPointer:function(){},
    deleteBuffer:function(){},
    createShader:function(){},
    shaderSource:function(){},
    compileShader:function(){},
    createProgram:function(){},
    attachShader:function(){},
};

var canvas;
function start(socket_io) {
    //load web browser variable & functions
    var jsdom = require("jsdom");
    jsdom.env(
        "<html><body><canvas id='application-canvas'></canvas></body></html>",
        function(err, owindow) {
            window = owindow;
            document = window.document;
            canvas = window.document.getElementById("application-canvas");
            canvas.getContext = function(canvas, options) {
                return new webgl_null();
            }
            window.WebGLRenderingContext = true;

            Ammo = require('../client/lib/ammo.751ec5f.js');

            setupPlayCanvas();
            setupNetwork(socket_io);
        }
    );
}


// *************** Helper functions *************** //
function createMaterial (color) {
    var material = new pc.PhongMaterial();
    material.diffuse = color;
    // we need to call material.update when we change its properties
    material.update()
    return material;
}

function createBox (position, size, material) {
    // create an entity and add a model component of type 'box'
    var box = new pc.Entity();
    box.addComponent("model", {
        type: "box",
        castShadows: true
    });
    box.model.material = material;
    // move the box
    box.setLocalPosition(position);
    box.setLocalScale(size);

    return box;
}

function applyPhysics(box, rType, rFriction, rMass, rRest) {
    box.addComponent("rigidbody", {
        type: rType,
        friction: rFriction,
        mass: rMass,
        angularDamping: 0.8,
        restitution: rRest
    });

    scale = box.getLocalScale();
    box.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(scale.x/2, scale.y/2, scale.z/2)
    });

}

var red;
function createPlayer(player) {
    var playerEntity = createBox(new pc.Vec3(player.x, player.y, player.z),
        new pc.Vec3(1, 1, 2), red);
    console.log("x:", player.x, "\ty:", player.y , "\tz:", player.z);

    playerEntity.setLocalEulerAngles(0, player.beta, 0);
    applyPhysics(playerEntity, "dynamic", 0.5, 50, 0);
    return playerEntity;
}

//=========================================================
//set up playcanvas app
//=========================================================
var playerLocs = [];
var playerEntities = [];
function Player(id, x, y, z, beta) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = 0;
    this.beta = beta;
    this.gamma = 0;
}


function setupPlayCanvas(){
    pc = require('../client/lib/playcanvas-stable.min.js').pc;

    app = new pc.Application(canvas,{});
    app.start();

    app.systems.rigidbody.setGravity(0, -9.8, 0);
    createScene();
}

var timeElapsed = 0.0;
function setupNetwork(socket_io) {
    socket_io.sockets.on('connection', function(socket) {
        socket.on('initialize', function() {
            var playerId = playerLocs.length;
            console.log("playerId:", playerId);
            var newPlayer;
            switch(playerId) {
            case 0:
                newPlayer = new Player(playerId, 6, 0, 6, 45);
                break;
            case 1:
                newPlayer = new Player(playerId, -6, 0, -6, 225);
                break;
            case 2:
                newPlayer = new Player(playerId, 6, 0, -6, 135);
                break;
            case 3:
                newPlayer = new Player(playerId, -6, 0, 6, 315);
                break;
            }

            playerLocs.push(newPlayer);

            var newPlayerEntity = createPlayer(newPlayer);
            playerEntities.push(newPlayerEntity);
            
            app.root.addChild(newPlayerEntity);

            socket.emit('playerData', {id: playerId, players: playerLocs});

            socket.broadcast.emit('playerJoined', newPlayer);
        });

        socket.on('playerMove', function(data) {
            playerEntities[data.id].rigidbody.applyForce(700*data.x,
                700*data.y,
                700*data.z);

        });

        socket.on('playerRotate', function(data) {
            playerEntities[data.id].rigidbody.applyTorque(0, 300*data.dir, 0);
        });

    });

    // Update all players' positions to all players
    app.on('update', function(dt) {
        timeElapsed += dt;
        if( timeElapsed > 0.030) {
            timeElapsed = 0;
            for(i = 0; i < playerEntities.length; i++) {
                var pos = playerEntities[i].getPosition();
                if( pos.y < -20 ) {
                    playerEntities[i].rigidbody.linearVelocity = new pc.Vec3(0, 0, 0);
                    playerEntities[i].rigidbody.angularVelocity = new pc.Vec3(0, 0, 0);
                    playerEntities[i].rigidbody.teleport(0, 5, 0, 0, 0, 0);
                }
                var ang = playerEntities[i].getEulerAngles();
                playerLocs[i].x = pos.x;
                playerLocs[i].y = pos.y;
                playerLocs[i].z = pos.z;
                playerLocs[i].alpha = ang.x;
                playerLocs[i].beta = ang.y;
                playerLocs[i].gamma = ang.z;
            }
            socket_io.sockets.emit('positionUpdate', playerLocs);
        }
    });
}


// **************** Scene creation *************** //
function createScene(){
    // create a few materials for our boxes
    red = createMaterial(new pc.Color(1,0,0));
    var white = createMaterial(new pc.Color(1,1,1));
    
    // Floor
    var floor = createBox(new pc.Vec3(0, -0.1, 0), new pc.Vec3(20, 0.1, 20), white);
    applyPhysics(floor, "static", 0.5, 0, 0);
    app.root.addChild(floor);

    
}

exports.start = start;
