pc.script.create('controller', function (app) {
    var SPEED = 10;
    var distance = 10;

    var Controller = function (entity) {
        this.entity = entity;

        // Disabling the context menu stops the browser displaying a menu when
        // you right-click the page
        app.mouse.disableContextMenu();
        //app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        //app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    var angle = 0;
    
    Controller.prototype = {
        update: function (dt) {
            var camera = this.entity.findByName("camera");       
   
            // get facing direction 
            var camPos = camera.getPosition();
            camPos.y = 0;

            var dir = this.entity.getPosition().sub(camPos);
            dir.normalize();

            // Update the camera's position
            var N = 700;
            if (app.keyboard.isPressed(pc.KEY_UP)) {
                this.entity.rigidbody.applyForce(N*dir.x, N*dir.y,  N*dir.z);
                
            } else if (app.keyboard.isPressed(pc.KEY_DOWN)) {
                this.entity.rigidbody.applyForce(-N*dir.x, -N*dir.y, -N*dir.z);
            }

            if (app.keyboard.isPressed(pc.KEY_LEFT)) {
                this.entity.rigidbody.applyTorque(0, 300, 0);
            } else if (app.keyboard.isPressed(pc.KEY_RIGHT)) {
                this.entity.rigidbody.applyTorque(0, -300, 0);
            }

            var p = this.entity.getLocalEulerAngles();
            console.log("x:", p.x, "\ty:", p.y, "\tz:", p.z);
        },

        onMouseMove: function (event) {
            // Update the current Euler angles, clamp the pitch.
            this.ex -= event.dy / 5;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx / 5;
        },

        onMouseDown: function (event) {
            // When the mouse button is clicked try and capture the pointer
            if (!pc.Mouse.isPointerLocked()) {
                app.mouse.enablePointerLock();
            }
        },
    };

   return Controller;
});
