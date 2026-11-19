// Maze generation, routing, Level 1 object placement and collision helpers.
function reachable(a,sx,sy){let seen=new Set([sy*COLS+sx]),queue=[[sx,sy]];for(let i=0;i<queue.length;i++){let [x,y]=queue[i];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,k=ny*COLS+nx;if(nx>0&&nx<COLS-1&&ny>0&&ny<ROWS-1&&!a[ny][nx]&&!seen.has(k)){seen.add(k);queue.push([nx,ny])}}}return seen}
function createMaze(n){
 if(n===1)return createLevelTwoMaze();
 if(n===2)return createLevelThreeMaze();
 if(n===3)return createLevelFourMaze();
 if(n!==0){let a=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||y===0||x===COLS-1||y===ROWS-1?1:0));for(let y=2;y<ROWS-2;y+=3)for(let x=2;x<COLS-2;x++)if((x*7+y*11+n)%6===0)a[y][x]=1;for(let x=4;x<COLS-2;x+=5)for(let y=2;y<ROWS-2;y++)if((y+x+n)%5===0)a[y][x]=1;let px=1,py=1;while(px<COLS-3)a[py][++px]=0;while(py<ROWS-3)a[++py][px]=0;exitCell={x:COLS-3,y:ROWS-3};return a}
 // Level 1 is a compact perfect maze: exactly one route to the exit,
 // with many side branches to dodge Haris and escape his projectiles.
 const maxX=14,maxY=12;
 let a=Array.from({length:ROWS},()=>Array(COLS).fill(1));
 let stack=[[1,1]];a[1][1]=0;
 while(stack.length){let [x,y]=stack[stack.length-1];let options=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>x+dx>0&&x+dx<maxX&&y+dy>0&&y+dy<maxY&&a[y+dy][x+dx]===1);if(!options.length){stack.pop();continue}let [dx,dy]=options[Math.floor(Math.random()*options.length)];a[y+dy/2][x+dx/2]=0;a[y+dy][x+dx]=0;stack.push([x+dx,y+dy])}
 let q=[[1,1,0]],seen=new Set(['1,1']),far=q[0];for(let i=0;i<q.length;i++){let [x,y,d]=q[i];if(d>far[2])far=q[i];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,k=nx+','+ny;if(nx>0&&nx<maxX&&ny>0&&ny<maxY&&!a[ny][nx]&&!seen.has(k)){seen.add(k);q.push([nx,ny,d+1])}}}
 exitCell={x:far[0],y:far[1]};return a
}
function mazeRoute(start,goal){
 const q=[[start.x,start.y]], seen=new Set([start.y*COLS+start.x]),parent=new Map();
 for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===goal.x&&y===goal.y)break;
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,k=ny*COLS+nx;if(nx>0&&ny>0&&nx<COLS-1&&ny<ROWS-1&&!grid[ny][nx]&&!seen.has(k)){seen.add(k);parent.set(k,[x,y]);q.push([nx,ny])}}}
 let at=[goal.x,goal.y],path=[];
 while(at&&path.length<COLS*ROWS){path.push({x:at[0],y:at[1]});if(at[0]===start.x&&at[1]===start.y)break;at=parent.get(at[1]*COLS+at[0]);}
 return path.reverse();
}
function placeLevelOneObjects(){
 const route=mazeRoute({x:1,y:1},exitCell);
 const safe=[...reachable(grid,1,1)].map(k=>({x:k%COLS,y:Math.floor(k/COLS)})).filter(c=>Math.abs(c.x-1)+Math.abs(c.y-1)>4&&!(c.x===exitCell.x&&c.y===exitCell.y));
 // Key on the main route makes completion possible without requiring a dead-end search.
 const keyTile=route[Math.max(2,Math.min(route.length-3,Math.floor(route.length*.62)))];
 goldenKey={x:keyTile.x+.5,y:keyTile.y+.5};
 const occupied=new Set([keyTile.x+','+keyTile.y,exitCell.x+','+exitCell.y,'1,1']);
 const shuffled=safe.sort(()=>Math.random()-.5);
 for(const type of ['coffee','dnd','heal','goldenChappal']){
  let cell=shuffled.find(c=>!occupied.has(c.x+','+c.y)&&Math.abs(c.x-keyTile.x)+Math.abs(c.y-keyTile.y)>1);
  if(cell){pickups.push({type,x:cell.x+.5,y:cell.y+.5});occupied.add(cell.x+','+cell.y)}
 }
}
function wall(x,y){return x<0||y<0||x>=COLS||y>=ROWS||grid[Math.floor(y)][Math.floor(x)]===1}function free(x,y,r=.27){return !wall(x-r,y-r)&&!wall(x+r,y-r)&&!wall(x-r,y+r)&&!wall(x+r,y+r)}function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
