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
//app.systems.rigidbody.setGravity(0, -9.8, 0);

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


    // add the box to the hierarchy
    //app.root.addChild(box);
    return box;
}
// ***********    Create Boxes    *******************
// create a few materials for our boxes
var red = createMaterial(new pc.Color(1,0,0));
var white = createMaterial(new pc.Color(1,1,1));

// create a floor
var floor = createBox(new pc.Vec3(0, -0.5, 0), new pc.Vec3(10, 0.1, 10), white);
// add a rigidbody component so that other objects collide with it
floor.addComponent("rigidbody", {
    type: "static",
    friction: 1,
    restitution: 0
});
// add a collision component
floor.addComponent("collision", {
    type: "box",
    halfExtents: new pc.Vec3(5, 0.05, 5)
});


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

//camera.setEulerAngles(-15, 0, 0);
camera.setName("camera");
//camera.setLocalPosition(0, 2, 5);

var rectBox = createBox(pc.Vec3.ZERO, new pc.Vec3(1, 1, 2), red);
//camera.addChild(rectBox);

// add physics
rectBox.addComponent("rigidbody", {
    type: "dynamic",
    friction: 1,
    mass: 50,
    restitution: 0
});

rectBox.addComponent("collision", {
    type: "box",
    halfExtents: new pc.Vec3(0.5, 0.5, 1)
});

// add the first_person_camera script to the camera
rectBox.addComponent("script", {
    scripts: [{
        url: 'first_person_camera.js'
    }]
});

rectBox.addChild(camera);

// add the camera to the hierarchy
app.root.addChild(rectBox);
// Move the camera a little further away
camera.translateLocal(0, 2, 3);
