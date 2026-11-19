// Game loop and boot. Loaded last, after every other script.
function frame(t){let dt=Math.min(.04,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(frame)}
grid=createMaze(0);player={x:1.5,y:1.5,inv:0};coins=[];enemies=[];projectiles=[];updateUI();startScreen();requestAnimationFrame(frame);
