// Level 2: Eren & Jake, THE PROJECT GUARDIANS ("Deadline Dimension").
//
// Built on Level 1's systems (tile movement, key and exit, pickups, snakes and
// beetles, abilities, cutscene panels, victory scene) without changing how
// Level 1 plays. Everything Level 2 specific lives here and in
// js/render/level2-art.js; shared files only call in when level===1.
//
// Flow: collect the stakeholder sign-off -> golden key appears -> grab it ->
// SPRINT REVIEW (Eren hunts Diego, Jake cuts him off on the route ahead) -> exit.
//  - Eren, the hunter: chases Diego and sets DEADLINES. Reach her status-update
//    tile before the ring runs out, or she fires a dodgeable 📅 volley and
//    speeds up for a few seconds.
//  - Jake, the guardian: hovers near Diego's next objective and drops temporary
//    📋 REQUIREMENT barriers on Diego's route. They last 5s, the chappal breaks
//    them, and one is only placed if Diego still has another way round.
//  - Scope-creep floor tiles slow Diego while he stands on them.
// Fairness: the maze is "braided" (most dead ends opened into loops) so two
// chasers can't pin Diego in a corridor, and nothing here kills instantly.

const L2={W:19,H:15,SCALE:1.08,OX:90,OY:50,BARRIER_LIFE:5,TRAP_SLOW:.55};
let l2=null,l2Layout=null,levelTwoSnapshot=null,levelTwoSceneStep=0;
const L2_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const l2Key=(x,y)=>y*COLS+x;
const l2Cell=p=>({x:Math.floor(p.x),y:Math.floor(p.y)});
function l2Open(x,y){const D=level===3?L4:level===2?L3:L2;return x>0&&y>0&&x<D.W-1&&y<D.H-1&&!grid[y][x]} // Levels 3 and 4 reuse these helpers at their own size
function l2Distances(sx,sy){ // BFS step counts from one cell over walkable tiles
 const dist=new Map([[l2Key(sx,sy),0]]),q=[[sx,sy]];
 for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist.get(l2Key(x,y));
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);if(l2Open(nx,ny)&&!dist.has(k)){dist.set(k,d+1);q.push([nx,ny])}}}
 return dist;
}

// ---- Maze -------------------------------------------------------------------
function createLevelTwoMaze(){return braidedMaze(L2.W,L2.H,.7,4)}
// DFS maze, then most dead ends knocked through into loops, plus a few shortcuts.
// Shared by Level 2 and Level 3 (different sizes and amounts of braiding).
function braidedMaze(W,H,braid,shortcutCount){
 const a=Array.from({length:ROWS},()=>Array(COLS).fill(1));
 const stack=[[1,1]];a[1][1]=0;
 while(stack.length){const [x,y]=stack[stack.length-1];
  const options=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>x+dx>0&&x+dx<W-1&&y+dy>0&&y+dy<H-1&&a[y+dy][x+dx]===1);
  if(!options.length){stack.pop();continue}
  const [dx,dy]=options[Math.floor(Math.random()*options.length)];a[y+dy/2][x+dx/2]=0;a[y+dy][x+dx]=0;stack.push([x+dx,y+dy]);}
 // Two chasers need escape routes: knock most dead ends through into loops,
 // then add a few extra shortcuts, so Diego can always run around a block.
 const inside=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1;
 for(let y=1;y<H-1;y+=2)for(let x=1;x<W-1;x+=2){
  const open=L2_DIRS.filter(([dx,dy])=>a[y+dy][x+dx]===0).length;
  if(open!==1||Math.random()>braid)continue;
  const walls=L2_DIRS.filter(([dx,dy])=>a[y+dy][x+dx]===1&&inside(x+dx*2,y+dy*2));
  if(walls.length){const [dx,dy]=walls[Math.floor(Math.random()*walls.length)];a[y+dy][x+dx]=0}
 }
 const shortcuts=[];
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(a[y][x]!==1)continue;
  const horiz=a[y][x-1]===0&&a[y][x+1]===0&&a[y-1][x]===1&&a[y+1][x]===1;
  const vert=a[y-1][x]===0&&a[y+1][x]===0&&a[y][x-1]===1&&a[y][x+1]===1;
  if(horiz||vert)shortcuts.push([x,y]);}
 shortcuts.sort(()=>Math.random()-.5).slice(0,shortcutCount).forEach(([x,y])=>a[y][x]=0);
 // Exit: the open cell farthest (in steps) from Diego's start.
 const q=[[1,1,0]],seen=new Set([l2Key(1,1)]);let far=q[0];
 for(let i=0;i<q.length;i++){const [x,y,d]=q[i];if(d>far[2])far=q[i];
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);if(inside(nx,ny)&&!a[ny][nx]&&!seen.has(k)){seen.add(k);q.push([nx,ny,d+1])}}}
 exitCell={x:far[0],y:far[1]};
 return a;
}

// ---- Placement (once per fresh maze; Retry Same Maze reuses it) -------------
function placeLevelTwoObjects(){
 const dist=l2Distances(1,1);
 const cells=[...dist.keys()].map(k=>({x:k%COLS,y:Math.floor(k/COLS),d:dist.get(k)}));
 const used=new Set([l2Key(1,1),l2Key(exitCell.x,exitCell.y)]);
 const cellOf=o=>({x:Math.floor(o.x),y:Math.floor(o.y)});
 const near=(c,list,r)=>list.some(o=>{const p=cellOf(o);return Math.abs(p.x-c.x)+Math.abs(p.y-c.y)<r});
 const pick=f=>{const pool=cells.filter(c=>!used.has(l2Key(c.x,c.y))&&f(c));if(!pool.length)return null;
  const c=pool[Math.floor(Math.random()*pool.length)];used.add(l2Key(c.x,c.y));return c};
 const route=mazeRoute({x:1,y:1},exitCell),onRoute=new Set(route.map(c=>l2Key(c.x,c.y)));
 const offRoute=c=>!onRoute.has(l2Key(c.x,c.y));
 // One stakeholder sign-off, off the direct route so Diego has to detour for it.
 const s1=pick(c=>c.d>=8&&offRoute(c))||pick(c=>c.d>=8)||pick(c=>c.d>=4);
 const signoffs=[s1].map(c=>({x:c.x+.5,y:c.y+.5}));
 // The golden key appears on the main route, ~60% of the way to the exit.
 let ki=Math.max(2,Math.min(route.length-3,Math.floor(route.length*.6)));
 while(used.has(l2Key(route[ki].x,route[ki].y))&&ki<route.length-2)ki++;
 used.add(l2Key(route[ki].x,route[ki].y));
 const keySpot={x:route[ki].x+.5,y:route[ki].y+.5};
 // Same power-ups as Level 1.
 pickups=[];
 for(const type of ['coffee','dnd','heal','goldenChappal']){const c=pick(c=>c.d>4&&!near(c,[keySpot,...signoffs],2));if(c)pickups.push({type,x:c.x+.5,y:c.y+.5})}
 // Scope-creep traps: two on the main route, three elsewhere, spread apart.
 const traps=[];
 const trapOk=c=>c.d>=5&&!near(c,traps,3)&&!near(c,[keySpot,...signoffs],2)&&Math.abs(c.x-exitCell.x)+Math.abs(c.y-exitCell.y)>2;
 for(let i=0;i<2;i++){const c=pick(c=>!offRoute(c)&&trapOk(c));if(c)traps.push({x:c.x+.5,y:c.y+.5})}
 for(let i=0;i<3;i++){const c=pick(trapOk);if(c)traps.push({x:c.x+.5,y:c.y+.5})}
 // Level 1's snakes and beetles, one more of each.
 hazards=[];
 for(let i=0;i<4;i++){const c=pick(c=>c.d>=8&&!near(c,hazards,3)&&!near(c,[keySpot,...signoffs],2));
  if(c)hazards.push({x:c.x+.5,y:c.y+.5,type:i%2===0?'snake':'bug',phase:Math.random()*6.28,dir:[1,0],turn:0,speed:(i%2===0?.88:1.06)+.17})}
 coins=cells.filter(c=>c.d>3&&!used.has(l2Key(c.x,c.y))&&(c.x*7+c.y*11+1)%4===0).map(c=>({x:c.x+.5,y:c.y+.5}));
 // Bosses start far from Diego and far from each other, never on the exit.
 const e1=pick(c=>c.d>=14&&c.x>=10)||pick(c=>c.d>=10)||pick(c=>c.d>=6);
 const e2=pick(c=>c.d>=11&&c.x<10&&Math.abs(c.x-e1.x)+Math.abs(c.y-e1.y)>=8)||pick(c=>c.d>=8)||pick(c=>c.d>=6);
 enemies=[{name:'eren',x:e1.x+.5,y:e1.y+.5,shot:2.4,move:0,dir:[0,0],pathTimer:0},
          {name:'jake',x:e2.x+.5,y:e2.y+.5,shot:3.6,move:0,dir:[0,0],pathTimer:0}];
 l2Layout={signoffs,keySpot,traps};
}
function copyLevelTwoState(){return JSON.parse(JSON.stringify({grid,exitCell,l2Layout,pickups,coins,hazards,enemies}))}
function restoreLevelTwoState(){const s=JSON.parse(JSON.stringify(levelTwoSnapshot));
 grid=s.grid;exitCell=s.exitCell;l2Layout=s.l2Layout;pickups=s.pickups;coins=s.coins;hazards=s.hazards;enemies=s.enemies}

// Called by startLevel(1) after the shared resets.
function startLevelTwo(retrySame){
 if(retrySame&&levelTwoSnapshot)restoreLevelTwoState();else{placeLevelTwoObjects();levelTwoSnapshot=copyLevelTwoState()}
 goldenKey=null;hasGoldenKey=false;
 l2={signoffs:l2Layout.signoffs.map(s=>({...s,taken:false})),keySpot:l2Layout.keySpot,traps:l2Layout.traps,
     barriers:[],deadline:null,nextDeadline:7,nextBarrier:5.5,sprint:false,enrage:0,onTrap:false,bubble:null,
     deadlinesMet:0,deadlinesMissed:0,firstBarrier:true,lockHintCd:0};
 phase='cutscene';levelTwoSceneStep=retrySame?2:0;renderLevelTwoIntro();
}

// ---- Helpers ----------------------------------------------------------------
function l2SignoffsTaken(){return l2.signoffs.filter(s=>s.taken).length}
function l2Bubble(name,text){l2.bubble={name,text,time:1.8}}
function l2OnTile(list,c){return list.some(o=>Math.floor(o.x)===c.x&&Math.floor(o.y)===c.y)}
function levelTwoSpeedFactor(){return l2&&l2OnTile(l2.traps,l2Cell(player))?L2.TRAP_SLOW:1}
function l2Busy(x,y){ // tiles that must stay walkable / unblocked
 const c={x,y};
 return (x===exitCell.x&&y===exitCell.y)||(x===1&&y===1)||l2OnTile(l2.traps,c)||l2OnTile(l2.signoffs.filter(s=>!s.taken),c)
  ||l2OnTile([l2.keySpot],c)||l2OnTile(pickups,c)||l2.barriers.some(b=>b.x===x&&b.y===y)||(l2.deadline&&l2OnTile([l2.deadline],c));
}
function l2Occupied(x,y){ // any actor standing on, or walking into, this tile
 const actors=[player,...enemies,...hazards.filter(h=>!h.dead)];
 return actors.some(a=>(Math.floor(a.x)===x&&Math.floor(a.y)===y)||(a.target&&a.target.x===x&&a.target.y===y));
}
function l2Goal(){ // the tile Diego needs to reach next
 const open=l2.signoffs.filter(s=>!s.taken);
 if(open.length){const from=l2Cell(player),dist=l2Distances(from.x,from.y);
  return open.map(s=>({x:Math.floor(s.x),y:Math.floor(s.y)})).sort((a,b)=>(dist.get(l2Key(a.x,a.y))??999)-(dist.get(l2Key(b.x,b.y))??999))[0]}
 if(goldenKey&&!hasGoldenKey)return {x:Math.floor(goldenKey.x),y:Math.floor(goldenKey.y)};
 return {x:exitCell.x,y:exitCell.y};
}

// ---- Per-frame update (called from update() after Diego moves) ---------------
function updateLevelTwo(dt){
 const s=l2;
 s.enrage=Math.max(0,s.enrage-dt);if(s.bubble)s.bubble.time-=dt;
 // Scope creep: the slowdown itself is applied to Diego's speed in update().
 const onTrap=levelTwoSpeedFactor()<1;
 if(onTrap&&!s.onTrap){showPowerText('📈 SCOPE CREEP! Diego is slowed down');arcadeSound('mode')}
 s.onTrap=onTrap;
 // Stakeholder sign-offs, then the golden key.
 for(const so of s.signoffs){if(so.taken||distance(player,so)>=.5)continue;
  so.taken=true;score+=75;arcadeSound('pickup');burst(so.x*T,so.y*T,'#7dffb2',26,1.1);
  const n=l2SignoffsTaken();
  if(n<s.signoffs.length)showPowerText(`✅ STAKEHOLDER SIGN-OFF ${n}/${s.signoffs.length}!`);
  else{goldenKey={...s.keySpot};arcadeSound('key');burst(goldenKey.x*T,goldenKey.y*T,'#ffe18b',30,1.3);
   showPowerText('✅ SIGN-OFF APPROVED! 🔑 The golden key is unlocked');}
 }
 if(goldenKey&&!hasGoldenKey&&distance(player,goldenKey)<.5){
  hasGoldenKey=true;doorAnimation=1.25;burst(player.x*T,player.y*T,'#ffe18b',34,1.5);goldenKey=null;score+=100;arcadeSound('key');
  startSprintReview();
 }
 // The key is visible from the start but locked until the sign-off is in.
 s.lockHintCd=Math.max(0,s.lockHintCd-dt);
 if(s.lockHintCd===0&&!goldenKey&&!hasGoldenKey&&distance(player,s.keySpot)<.6){
  showPowerText(`🔒 KEY LOCKED! Collect ${s.signoffs.length-l2SignoffsTaken()} more ✅ sign-off${s.signoffs.length-l2SignoffsTaken()===1?'':'s'} to unlock it`);s.lockHintCd=2.5}
 if(s.lockHintCd===0&&!hasGoldenKey&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<.8){
  showPowerText('🚪 EXIT LOCKED! Get the golden key first');s.lockHintCd=2.5}
 pickups=pickups.filter(p=>{if(distance(player,p)<.46){burst(p.x*T,p.y*T,'#fff0aa',14,.7);collectPickup(p.type);return false}return true});
 // Eren's deadlines (only before the key; the Sprint Review is its own climax).
 if(!s.sprint){
  if(!s.deadline){s.nextDeadline-=dt;if(s.nextDeadline<=0)startDeadline()}
  else{s.deadline.time-=dt;
   if(distance(player,s.deadline)<.55)deadlineMet();else if(s.deadline.time<=0)deadlineMissed();}
 }
 // Jake's requirement barriers: a chappal breaks one, otherwise it expires.
 for(const t of throws){const nx=Math.floor(t.x+t.vx*dt),ny=Math.floor(t.y+t.vy*dt);
  const b=s.barriers.find(b=>b.x===nx&&b.y===ny&&b.life>0);
  if(b){b.life=0;t.life=0;score+=15;burst((b.x+.5)*T,(b.y+.5)*T,'#ffb36b',22,1);showPowerText('🩴 Requirement rejected! Path cleared +15')}}
 for(const b of s.barriers){b.life-=dt;if(b.life<=0)grid[b.y][b.x]=0}
 s.barriers=s.barriers.filter(b=>b.life>0);
}

function startDeadline(){
 const from=l2Cell(player),dist=l2Distances(from.x,from.y);
 const pool=[...dist.entries()].filter(([,d])=>d>=7&&d<=12).map(([k,d])=>({x:k%COLS,y:Math.floor(k/COLS),d})).filter(c=>!l2Busy(c.x,c.y));
 if(!pool.length){l2.nextDeadline=3;return}
 const c=pool[Math.floor(Math.random()*pool.length)];
 // Travel time with some slack; the slack shrinks as Diego collects sign-offs.
 const budget=c.d/4.7*1.3+Math.max(2.6,4.6-l2SignoffsTaken()*.9);
 l2.deadline={x:c.x+.5,y:c.y+.5,time:budget,max:budget};
 l2Bubble('eren','⏰ DEADLINE!');arcadeSound('mode');
 showPowerText('⏰ EREN SET A DEADLINE! Reach the status update in time');speak('eren',true,'attack',1);
}
function deadlineMet(){
 const d=l2.deadline;l2.deadline=null;l2.deadlinesMet++;l2.nextDeadline=15+Math.random()*4;
 score+=50;arcadeSound('pickup');burst(d.x*T,d.y*T,'#6ff7ff',24,1);
 const eren=enemies.find(e=>e.name==='eren');if(eren)eren.stun=Math.max(eren.stun||0,1.5);
 showPowerText('✅ Status update sent on time! +50 (Eren is reading it)');
}
function deadlineMissed(){
 l2.deadline=null;l2.deadlinesMissed++;l2.nextDeadline=14+Math.random()*3;l2.enrage=4;
 const eren=enemies.find(e=>e.name==='eren');
 if(eren){const base=Math.atan2(player.y-eren.y,player.x-eren.x);
  for(let i=-2;i<=2;i++){const a=base+i*.22;projectiles.push({x:eren.x,y:eren.y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,name:'eren',life:5})}}
 l2Bubble('eren','ESCALATING!');arcadeSound('mode');
 showPowerText('⏰ DEADLINE MISSED! Eren is escalating (dodge the 📅)');speak('eren',true,'attack',0);
}
function tryPlaceBarrier(){
 const from=l2Cell(player),goal=l2Goal(),path=mazeRoute(from,goal);
 if(path.length<6||path[0].x!==from.x||path[0].y!==from.y)return false;
 for(const i of [4,5,3,6,7]){if(i>=path.length-1)continue;const c=path[i];
  if(l2Busy(c.x,c.y)||l2Occupied(c.x,c.y))continue;
  grid[c.y][c.x]=1; // try it: Diego must still be able to reach his goal and the exit another way
  const reach=l2Distances(from.x,from.y);
  if(reach.has(l2Key(goal.x,goal.y))&&reach.has(l2Key(exitCell.x,exitCell.y))){
   l2.barriers.push({x:c.x,y:c.y,life:L2.BARRIER_LIFE});
   l2Bubble('jake','📋 NEW REQUIREMENT!');arcadeSound('mode');
   showPowerText('📋 Jake added a requirement! Path blocked for 5s (🩴 breaks it)');
   if(l2.firstBarrier){l2.firstBarrier=false;speak('jake',true,'intro')}else speak('jake');
   return true;
  }
  grid[c.y][c.x]=0;
 }
 return false;
}
function startSprintReview(){
 l2.sprint=true;l2.deadline=null;
 for(const e of enemies)e.stun=Math.max(e.stun||0,1.2); // a short beat to react
 l2Bubble('jake','🏃 SPRINT REVIEW!');arcadeSound('mode');
 showPowerText('🔑 KEY FOUND! 🏃 SPRINT REVIEW: Eren & Jake are coordinating. Run!');speak('jake',true,'attack',1);
}

// ---- Bosses -------------------------------------------------------------------
function l2StepToward(e,goal){ // next tile on the shortest path from the actor to goal
 const sx=Math.floor(e.x),sy=Math.floor(e.y);if(sx===goal.x&&sy===goal.y)return null;
 const q=[[goal.x,goal.y]],seen=new Set([l2Key(goal.x,goal.y)]),parent=new Map();
 for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===sx&&y===sy)break;
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);if(l2Open(nx,ny)&&!seen.has(k)){seen.add(k);parent.set(k,[x,y]);q.push([nx,ny])}}}
 return parent.get(l2Key(sx,sy))||null;
}
function l2Move(e,dt,speed,goalFn){
 // Same tile-to-tile movement as Level 1's navigateEnemy, but aimed at any goal
 // (chosen lazily, only at tile centers). No goal means wander.
 const cx=Math.floor(e.x),cy=Math.floor(e.y);
 if(!e.target||Math.hypot(e.x-e.target.x,e.y-e.target.y)<.015){
  e.x=cx+.5;e.y=cy+.5;
  const options=L2_DIRS.map(([dx,dy])=>({x:cx+dx,y:cy+dy})).filter(c=>!wall(c.x+.5,c.y+.5));
  if(!options.length){e.target=null;return}
  let chosen=null;const goal=goalFn();
  if(goal){const step=l2StepToward(e,goal);if(step)chosen=options.find(o=>o.x===step[0]&&o.y===step[1])}
  if(!chosen){const alt=options.filter(o=>!e.previous||o.x!==e.previous.x||o.y!==e.previous.y);const pool=alt.length?alt:options;chosen=pool[Math.floor(Math.random()*pool.length)]}
  e.previous={x:cx,y:cy};e.target={x:chosen.x,y:chosen.y};
 }
 const tx=e.target.x+.5,ty=e.target.y+.5,dx=tx-e.x,dy=ty-e.y,dist=Math.hypot(dx,dy);
 if(dist<.0001){e.target=null;return}
 const step=Math.min(dist,speed*dt);e.x+=dx/dist*step;e.y+=dy/dist*step;
 if(step>=dist-.0001){e.x=tx;e.y=ty;e.target=null}
}
function levelTwoBosses(dt){
 const ramp=l2SignoffsTaken()*.12,pc=()=>l2Cell(player);
 for(const e of enemies){
  e.stun=Math.max(0,(e.stun||0)-dt);
  if(e.stun>0)continue; // a stunned boss neither moves, shoots nor drops barriers
  if(e.name==='jake'){l2.nextBarrier-=dt;
   if(l2.nextBarrier<=0)l2.nextBarrier=tryPlaceBarrier()?(l2.sprint?6.5:Math.max(6.5,10-l2SignoffsTaken()*1.5)):2;}
  if(e.name==='eren'){
   // Hunter: chases Diego, harder during a deadline, relentless after a missed one.
   let speed=l2.sprint?1.85:1.08+ramp;if(l2.enrage>0)speed*=1.4;
   l2Move(e,dt,speed,()=>(l2.sprint||l2.enrage>0||Math.random()<(l2.deadline?.75:.5))?pc():null);
  }else{
   // Guardian: hovers near Diego's next objective and pounces when he gets close.
   // In the Sprint Review it cuts Diego off a few tiles ahead on his route to the exit.
   const speed=l2.sprint?1.7:1.0+ramp;
   l2Move(e,dt,speed,()=>{
    const p=pc();
    if(l2.sprint){if(distance(e,player)<3.2)return p;const r=mazeRoute(p,exitCell);return r.length>5&&r[0].x===p.x&&r[0].y===p.y?r[4]:p}
    if(distance(e,player)<4&&Math.random()<.6)return p;
    const g=l2Goal();return Math.abs(Math.floor(e.x)-g.x)+Math.abs(Math.floor(e.y)-g.y)>2?g:null;
   });
  }
  e.shot-=dt;
  if(e.shot<=0){
   e.shot=e.name==='eren'?(l2.sprint?1.9:2.6)+Math.random()*.8:(l2.sprint?2.8:3.8)+Math.random()*.9;
   if(Math.random()<.5)speak(e.name);
   const vx=player.x-e.x,vy=player.y-e.y,d=Math.hypot(vx,vy)||1,sp=2.3+(l2.sprint?.35:0);
   projectiles.push({x:e.x,y:e.y,vx:vx/d*sp,vy:vy/d*sp,name:e.name,life:5});
  }
  if(distance(e,player)<.66)hit('boss');
 }
}

// ---- HUD objective text (existing objective box in the sidebar) -------------
function levelTwoQuest(){
 if(!l2)return '';
 if(l2.deadline)return `⏰ <b>DEADLINE ${Math.ceil(l2.deadline.time)}s</b> · Reach Eren's status update`;
 const n=l2SignoffsTaken();
 if(n<l2.signoffs.length)return `🔒 <b>KEY LOCKED</b> · Collect the ✅ sign-off to unlock it`;
 if(!hasGoldenKey)return '🔑 <b>KEY UNLOCKED</b> · Grab the golden key';
 return '🏃 <b>SPRINT REVIEW</b> · Reach the exit!';
}

// ---- Cutscenes (Level 1's cutscene panels) -----------------------------------
function renderLevelTwoIntro(){
 if(levelTwoSceneStep===0){
  show(`<div class="scene-label">BRIJ FAREWELL ARCADE · EPISODE 2/5</div><h2>SPRINT PLANNING NEVER ENDS</h2><div class="scene-people">${scenePortrait('eren')}${scenePortrait('jake')}</div><div class="scene-card"><p class="scene-quote">Diego escaped the backlog. Now two project managers guard the next door, one with a deadline and one with a brand new set of requirements.</p></div><small>LEVEL 2 · EREN & JAKE, THE PROJECT GUARDIANS</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelTwoSceneStep=1;renderLevelTwoIntro()},true,beginLevelTwo);
 }else if(levelTwoSceneStep===1){
  show(`<div class="scene-label">STANDUP IS RUNNING LONG</div><div class="scene-people">${scenePortrait('eren')}${scenePortrait('jake')}</div><div class="scene-card"><p class="scene-quote">EREN: “${QUOTES.eren.attack[1]}”</p><p class="scene-quote">JAKE: “${QUOTES.jake.attack[1]}”</p></div><small>Two PMs have entered the chat. Escape status: blocked.</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelTwoSceneStep=2;renderLevelTwoIntro()},true,beginLevelTwo);
 }else{
  show(`<div class="scene-label">DIEGO HAS A PLAN</div><div class="scene-people">${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.diego.attack[0]}”</p></div><h2>MISSION 2: SURVIVE SPRINT PLANNING!</h2><p>✅ Collect the sign-off to unlock the 🔑 golden key · 🔑 Grab it · 🚪 Unlock the exit</p><small>Watch out: ⏰ Eren's deadlines · 📋 Jake's barriers (🩴 breaks them) · 🌀 scope creep slows you down</small>`);
  sceneButtons('▶ BEGIN LEVEL 2',beginLevelTwo,false);
 }
}
function beginLevelTwo(){
 if(level!==1)return;
 phase='playing';hide();dialogueCooldown=2.2;
 document.getElementById('dialogue').style.display='none';updateUI();
 showPowerText('🔒 The golden key is locked. Collect the ✅ sign-off to unlock it');
 setTimeout(()=>{if(phase==='playing'&&level===1)speak('eren',true,'intro')},900);
}
function levelTwoVictoryScene(){
 phase='victoryScene';victoryFanfare();
 const palette=['#ff9be3','#c9a8ff','#ffcf7a','#7ff0ff','#8dffc0'];
 const confetti=Array.from({length:46},(_,i)=>{
  const left=(i*47+13)%100,delay=(i*0.19)%2.4,duration=3.1+(i%7)*0.33;
  return `<i class="victory-confetti" style="--x:${left}%;--delay:${delay}s;--duration:${duration}s;--tilt:${(i%2?1:-1)*(35+i%5*17)}deg;--color:${palette[i%palette.length]}"></i>`;
 }).join('');
 const bursts=Array.from({length:3},(_,j)=>`<div class="victory-firework firework-${j+1}">${Array.from({length:12},(_,i)=>`<b style="--angle:${i*30}deg;--distance:${62+j*20}px;--delay:${j*.35}s"></b>`).join('')}</div>`).join('');
 show(`<div class="victory-experience"><div class="victory-particles" aria-hidden="true">${confetti}${bursts}</div><div class="victory-orbit" aria-hidden="true"></div><div class="victory-kicker"><span class="victory-status-light"></span> MISSION 02 COMPLETE <span class="victory-separator">/</span> SPRINT APPROVED</div><div class="victory-medal" aria-hidden="true">🏆</div><h2 class="victory-headline">DIEGO HAS<br><em>ESCAPED!</em></h2><div class="victory-ribbon"><span>📅 SPRINT PLANNING</span><strong>DEFEATED</strong><span>🚪 FREEDOM UNLOCKED</span></div><div class="victory-faceoff">${scenePortrait('eren')}${scenePortrait('jake')}<div class="victory-vs">VS <span>✓</span></div><div class="scene-person reaction-person"><img class="reaction-gif" src="${REACTIONS.happy}" alt="Diego laughing"><span>DIEGO</span></div></div><div class="victory-conversation"><p><b>EREN</b><span>“${QUOTES.eren.defeated[0]}”</span></p><p><b>JAKE</b><span>“${QUOTES.jake.defeated[0]}”</span></p></div><div class="victory-tagline">One sign-off. Zero extra sprints.</div><div class="victory-next-label">THE NEXT CHAPTER IS READY</div></div>`);
 sceneButtons('✨ UNLOCK DIEGO AI SKILL',levelTwoResults,false);
 panel.classList.add('victory-panel');
}
function levelTwoResults(){
 phase='win';if(!unlocked.includes(1))unlocked.push(1);updateUI();
 const stars=clock<180?3:clock<240?2:1;
 show(`<div class="cinematic-kicker">BOSSES DEFEATED · DIEGO AI 2 / 5</div><h2 class="cinematic-title">LEVEL 2 CLEARED!</h2><div class="cinematic-sparkles">${'★'.repeat(stars)}</div><div class="cinematic-stats"><div><strong>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,'0')}</strong><span>ESCAPE TIME</span></div><div><strong>${health}%</strong><span>HEALTH LEFT</span></div><div><strong>${l2.deadlinesMet}</strong><span>DEADLINES MET</span></div></div><div class="cinematic-skill"><div class="cinematic-kicker">🤖 DIEGO AI MODULE INSTALLED</div><h2>✓ PROJECT MASTERY</h2><p>Plans sprints, meets deadlines and clears new requirements before they become blockers.</p><b style="color:#90ffb5">BUILD PROGRESS: 2 / 5 MODULES</b></div><p>Jake: “${QUOTES.jake.defeated[0]}”</p>`);
 sceneButtons('▶ NEXT LEVEL: ZOOFI, SUSH & ARQAM',()=>startLevel(2),false);
}
