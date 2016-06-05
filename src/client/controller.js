pc.script.create('controller', function (app) {
    var SPEED = 10;
    var distance = 10;

    var Controller = function (entity) {
        this.entity = entity;

        // Disabling the context menu stops the browser displaying a menu when
        // you right-click the page
        app.mouse.disableContextMenu();
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
                //this.entity.rigidbody.applyForce(N*dir.x, N*dir.y,  N*dir.z);
                app.socket.emit('playerMove', {id: app.playerId, x: dir.x, y: dir.y, z: dir.z});
            } else if (app.keyboard.isPressed(pc.KEY_DOWN)) {
                //this.entity.rigidbody.applyForce(-N*dir.x, -N*dir.y, -N*dir.z);
                dir.x *= -1;
                dir.y *= -1;
                dir.z *= -1;
                app.socket.emit('playerMove', {id: app.playerId, x: dir.x, y: dir.y, z: dir.z});
                //app.socket.emit('playerMove', {id: app.playerId, dir: dir});
            }

            if (app.keyboard.isPressed(pc.KEY_LEFT)) {
                //this.entity.rigidbody.applyTorque(0, 300, 0);
                app.socket.emit('playerRotate', {id: app.playerId, dir: 1});
            } else if (app.keyboard.isPressed(pc.KEY_RIGHT)) {
                //this.entity.rigidbody.applyTorque(0, -300, 0);
                app.socket.emit('playerRotate', {id: app.playerId, dir: -1});
            }
        },

    };

   return Controller;
});
