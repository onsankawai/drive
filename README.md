# drive
3D multi-player browser game developed using the PlayCanvas engine.

# Game Play
Use the arrow keys on your keyboard to move and push your opponents to fall!

The whole game consists of 2 parts: the node.js server and the client.

# Game Server
All the physics (movement and collisions) are handled at server-side.
In order to run the PlayCanvas engine at the server-side (which is not what it's supposed to be), the node.js server has to have a headless browser to mock a dom environment and inject a canvas element into the engine.

The server-side PlayCanvas engine runs the main game loop and update all players' positions by socket.io broadcasting.

# Game Client
The client also includes a PlayCanvas engine for rendering purpose. 
It collects each player's input and send it to the game server.
Update signals will be received periodically and all clients update every player's position.
