// ***********    Initialize application   *******************
var canvas = document.getElementById("application-canvas");

// focus the canvas for keyboard input
canvas.focus();

// Create the application and start the update loop
var app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    keyboard: new pc.Keyboard(document.body)
});

app.start();

app.keyboard.on(pc.EVENT_KEYDOWN, function(e) {
    e.event.preventDefault();
});

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);
app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);


//Physics - gravity
app.systems.rigidbody.setGravity(0, -9.8, 0);

// ***********    Helper functions    *******************
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

function createPlayer(player) {
    var playerEntity = createBox(new pc.Vec3(player.x, player.y, player.z),
        new pc.Vec3(1, 1, 2), red);
    console.log("x:", player.x, "\ty:", player.y , "\tz:", player.z);

    playerEntity.setLocalEulerAngles(0, player.beta, 0);
    applyPhysics(playerEntity, "dynamic", 0.5, 50, 0);
    return playerEntity;
}

// create a few materials for our boxes
var red = createMaterial(new pc.Color(1,0,0));
var white = createMaterial(new pc.Color(1,1,1));

// create a floor
var floor = createBox(new pc.Vec3(0, -0.1, 0), new pc.Vec3(20, 0.1, 20), white);
applyPhysics(floor, "static", 0.5, 0, 0);
app.root.addChild(floor);

// ***********    Create lights   *******************
// make our scene prettier by adding a directional light
var light = new pc.Entity();
light.addComponent("light", {
    type: "point",
    color: new pc.Color(1, 1, 1),
    range: 30,
    castShadows: true
});
light.setLocalPosition(5, 10, 2);

// add the light to the hierarchy
app.root.addChild(light);

// ***********    Create camera    *******************
// Create an Entity with a camera component
var camera = new pc.Entity();
camera.addComponent("camera", {
    clearColor: new pc.Color(0.5, 0.5, 0.8),
    nearClip: 0.3,
    farClip: 30
});

camera.setName("camera");
camera.translateLocal(0, 2, 3);


/*** socket.io testing ***/
var socket = io();
socket.emit('initialize');
var player;
var players = [];

socket.on('playerData', function(data) {
    console.log("id:", data.id, "\tplayer.x:", data.players[0].x);
    players = data.players;
    var myId = data.id;

    for(i = 0; i < players.length; i++) {
        players[i].entity = createPlayer(data.players[i]);
        if( i === myId ) {
            player = players[i];
            players[i].entity.addChild(camera);
            players[i].entity.addComponent("script", {
                scripts: [{
                    url: 'controller.js'
                }]
            });
        }
        app.root.addChild(players[i].entity);      
    }
});

// add the first_person_camera script to the camera
/*
templateBox.addComponent("script", {
    scripts: [{
        url: 'controller.js'
    }]
});
*/
/**** Other boxes ****/
//var box1 = createBox(new pc.Vec3(0, 0, -2), pc.Vec3.ONE, red);
//applyPhysics(box1, "dynamic", 0.5, 50, 0);

//app.root.addChild(templateBox);
//app.root.addChild(box1);

