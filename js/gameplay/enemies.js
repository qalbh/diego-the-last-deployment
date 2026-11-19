// Haris modes, boss pathfinding and enemy navigation.
function setHarisMode(mode){harisMode=mode;harisModeClock=0;harisBubbleTime=1.65;arcadeSound('mode');
 if(mode==='reminder'){speak('haris',true,'attack',4);showPowerText('🚨 REMINDER MODE: HARIS IS HUNTING!');}
 else{showPowerText('💬 Haris has returned to Polite Mode');speak('haris',true,'attack',0);}updateUI();}
function nextBossStep(e){
 // Breadth-first search from the player, returning the next grid cell.
 const sx=Math.floor(e.x),sy=Math.floor(e.y),tx=Math.floor(player.x),ty=Math.floor(player.y);
 const queue=[[tx,ty]],seen=new Set([ty*COLS+tx]),parent=new Map();
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===sx&&y===sy)break;
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,k=ny*COLS+nx;if(nx>0&&ny>0&&nx<COLS-1&&ny<ROWS-1&&!grid[ny][nx]&&!seen.has(k)){seen.add(k);parent.set(k,[x,y]);queue.push([nx,ny])}}}
 return parent.get(sy*COLS+sx)||null;
}
function navigateEnemy(e,dt,speed,chase){
 // Each actor moves between tile centers, never diagonally clipping a wall.
 // A destination is chosen only at a center, avoiding oscillation and stuck corners.
 const cx=Math.floor(e.x),cy=Math.floor(e.y),centerX=cx+.5,centerY=cy+.5;
 if(!e.target || Math.hypot(e.x-e.target.x,e.y-e.target.y)<.015){
  e.x=centerX;e.y=centerY;
  const options=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:cx+dx,y:cy+dy})).filter(c=>!wall(c.x+.5,c.y+.5));
  if(!options.length){e.target=null;return}
  let chosen=null;
  if(chase){const step=nextBossStep(e);if(step)chosen=options.find(o=>o.x===step[0]&&o.y===step[1]);}
  if(!chosen){const alternatives=options.filter(o=>!e.previous||o.x!==e.previous.x||o.y!==e.previous.y);const pool=alternatives.length?alternatives:options;chosen=pool[Math.floor(Math.random()*pool.length)]}
  e.previous={x:cx,y:cy};e.target={x:chosen.x,y:chosen.y};
 }
 const tx=e.target.x+.5,ty=e.target.y+.5,dx=tx-e.x,dy=ty-e.y,dist=Math.hypot(dx,dy);
 if(dist<.0001){e.target=null;return}
 const step=Math.min(dist,speed*dt);e.x+=dx/dist*step;e.y+=dy/dist*step;
 if(step>=dist-.0001){e.x=tx;e.y=ty;e.target=null}
}
