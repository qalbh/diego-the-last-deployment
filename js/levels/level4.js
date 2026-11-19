// Level 4: Ali, THE KNOWLEDGE GATEKEEPER ("Knowledge Transfer Lab").
//
// Built on the earlier levels' systems (tile movement, key and exit, pickups,
// abilities, cutscene panels, victory scene, the braided maze and the boss
// movement helpers from level2.js). Everything Level 4 specific lives here and
// in js/render/level4-art.js; shared files only call in when level===3.
//
// Flow: collect 2 RUNBOOK pages -> enter the code at the SECURITY TERMINAL ->
// the golden key unlocks -> grab it -> FINAL HANDOVER -> exit.
//  - Security terminal: a 4-arrow code typed with the arrow keys/WASD. The
//    world freezes while Diego types, a wrong key just restarts the code, Esc
//    steps away. No real programming or quiz.
//  - Ali (Engineering Manager): hunts Diego up close, otherwise heads for
//    Diego's next objective (the gatekeeper). Throws 📚 requests, and every
//    ~9s makes a telegraphed special request (wind-up ring + bubble):
//    📚 RUNBOOK burst (ring of 8), 🧹 REMOVE INSTANCES (3 target circles on and
//    around Diego), 🔐 NEW SECURITY GROUP (every firewall gate shuts for 4s).
//    A stunned Ali drops the request.
//  - 👾 Hackers roam, lock on (red glare, 0.8s) and dash at Diego. The chappal
//    knocks them out; they reconnect after a while.
//  - 🔐 Firewall gates cycle open/shut on corridors. They are only placed where
//    closing ALL of them still leaves every open tile reachable, so they can
//    never trap Diego, and a gate never shuts on anyone standing in it.
//  - 💧 Water puddles slow Diego and get ⚡ electrified on a warned cycle.

const L4={W:21,H:17,SCALE:.95,OX:101,OY:46,PAGES:2,CODE:4};
let l4=null,l4Layout=null,levelFourSnapshot=null,levelFourSceneStep=0;
const L4_DIRS={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};

// ---- Maze -------------------------------------------------------------------
function createLevelFourMaze(){
 const a=braidedMaze(L4.W,L4.H,.8,5);
 // Exit on the far side of the lab from Diego's start (as in Level 3).
 const dist=new Map([[l2Key(1,1),0]]),q=[[1,1]];
 for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist.get(l2Key(x,y));
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);
   if(nx>0&&ny>0&&nx<L4.W-1&&ny<L4.H-1&&!a[ny][nx]&&!dist.has(k)){dist.set(k,d+1);q.push([nx,ny])}}}
 let best=null;
 for(const [k,d] of dist){const x=k%COLS,y=Math.floor(k/COLS);
  if(x+y<(L4.W+L4.H)*.55)continue;
  if(!best||d>best.d)best={x,y,d}}
 if(best)exitCell={x:best.x,y:best.y};
 return a;
}

// ---- Placement (once per fresh maze; Retry Same Maze reuses it) -------------
function placeLevelFourObjects(){
 const dist=l2Distances(1,1);
 const cells=[...dist.keys()].map(k=>({x:k%COLS,y:Math.floor(k/COLS),d:dist.get(k)}));
 const used=new Set([l2Key(1,1),l2Key(exitCell.x,exitCell.y)]);
 const cellOf=o=>({x:Math.floor(o.x),y:Math.floor(o.y)});
 const near=(c,list,r)=>list.some(o=>{const p=cellOf(o);return Math.abs(p.x-c.x)+Math.abs(p.y-c.y)<r});
 const pick=f=>{const pool=cells.filter(c=>!used.has(l2Key(c.x,c.y))&&f(c));if(!pool.length)return null;
  const c=pool[Math.floor(Math.random()*pool.length)];used.add(l2Key(c.x,c.y));return c};
 const route=mazeRoute({x:1,y:1},exitCell),onRoute=new Set(route.map(c=>l2Key(c.x,c.y)));
 const offRoute=c=>!onRoute.has(l2Key(c.x,c.y));
 const center=c=>({x:c.x+.5,y:c.y+.5});
 // Runbook pages, then the security terminal, all off the direct route and spread out.
 const pages=[];
 for(let i=0;i<L4.PAGES;i++){const c=pick(c=>c.d>=7&&offRoute(c)&&!near(c,pages,8))||pick(c=>c.d>=7&&!near(c,pages,6))||pick(c=>c.d>=4);pages.push(center(c))}
 const t=pick(c=>c.d>=9&&offRoute(c)&&!near(c,pages,6))||pick(c=>c.d>=8&&!near(c,pages,4))||pick(c=>c.d>=5);
 const terminal=center(t);
 // The golden key waits on the main route, ~60% of the way to the exit.
 let ki=Math.max(2,Math.min(route.length-3,Math.floor(route.length*.6)));
 while(used.has(l2Key(route[ki].x,route[ki].y))&&ki<route.length-2)ki++;
 used.add(l2Key(route[ki].x,route[ki].y));
 const keySpot=center(route[ki]);
 const keep=[keySpot,terminal,...pages];
 // Power-ups: 3 coffees (user request for Level 3 onwards), shields, heals, golden chappal.
 pickups=[];
 for(const type of ['coffee','coffee','coffee','dnd','heal','goldenChappal','dnd','heal']){const c=pick(c=>c.d>4&&!near(c,keep,2)&&!near(c,pickups,4));if(c)pickups.push({type,...center(c)})}
 // Water puddles: 4 small pools (1-2 tiles each).
 const puddles=[];
 for(let g=0;g<4;g++){
  const c=pick(c=>c.d>=5&&!near(c,keep,2)&&!near(c,puddles,4)&&Math.abs(c.x-exitCell.x)+Math.abs(c.y-exitCell.y)>2);if(!c)continue;
  puddles.push({x:c.x,y:c.y,group:g});
  const n=L2_DIRS.map(([dx,dy])=>({x:c.x+dx,y:c.y+dy})).find(n=>dist.has(l2Key(n.x,n.y))&&!used.has(l2Key(n.x,n.y))&&!near(n,keep,2)&&!(n.x===exitCell.x&&n.y===exitCell.y));
  if(n){used.add(l2Key(n.x,n.y));puddles.push({x:n.x,y:n.y,group:g})}
 }
 // Firewall gates on straight corridor tiles, kept only if shutting ALL of them
 // still leaves every other open tile reachable (so a gate can never trap Diego).
 const total=dist.size,gates=[];
 const connected=closed=>{const shut=new Set(closed.map(g=>l2Key(g.x,g.y)));const seen=new Set([l2Key(1,1)]),qq=[[1,1]];
  for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);
   if(dist.has(k)&&!shut.has(k)&&!seen.has(k)){seen.add(k);qq.push([nx,ny])}}}
  return seen.size===total-shut.size};
 const corridor=c=>{const o=[...L2_DIRS].map(([dx,dy])=>dist.has(l2Key(c.x+dx,c.y+dy)));
  return (o[0]&&o[1]&&!o[2]&&!o[3])?'h':(!o[0]&&!o[1]&&o[2]&&o[3])?'v':null};
 const cand=cells.filter(c=>c.d>=5&&!used.has(l2Key(c.x,c.y))&&corridor(c)&&!near(c,keep,2)&&!near(c,pickups,1)&&Math.abs(c.x-exitCell.x)+Math.abs(c.y-exitCell.y)>2).sort(()=>Math.random()-.5);
 for(const c of cand){if(gates.length>=4)break;if(near(c,gates,5))continue;
  if(connected([...gates,c])){gates.push({x:c.x,y:c.y,orient:corridor(c)});used.add(l2Key(c.x,c.y))}}
 gates.forEach((g,i)=>g.offset=i*1.9);
 // Hackers.
 hazards=[];
 for(let i=0;i<3;i++){const c=pick(c=>c.d>=10&&!near(c,hazards,4)&&!near(c,keep,2));if(c)hazards.push(newHacker(center(c)))}
 coins=cells.filter(c=>c.d>3&&!used.has(l2Key(c.x,c.y))&&(c.x*7+c.y*11+3)%4===0).map(center);
 // Ali starts far from Diego.
 const a=pick(c=>c.d>=15)||pick(c=>c.d>=10)||pick(c=>c.d>=6);
 enemies=[{name:'ali',...center(a),shot:3.4,move:0,dir:[0,0],pathTimer:0,charge:0}];
 l4Layout={pages,terminal,keySpot,puddles,gates};
}
function newHacker(p){return {...p,type:'hack',phase:Math.random()*6.28,dir:[1,0],turn:0,speed:1,lock:0,dash:0,cool:3}}
function copyLevelFourState(){return JSON.parse(JSON.stringify({grid,exitCell,l4Layout,pickups,coins,hazards,enemies}))}
function restoreLevelFourState(){const s=JSON.parse(JSON.stringify(levelFourSnapshot));
 grid=s.grid;exitCell=s.exitCell;l4Layout=s.l4Layout;pickups=s.pickups;coins=s.coins;hazards=s.hazards;enemies=s.enemies}

// Called by startLevel(3) after the shared resets.
function startLevelFour(retrySame){
 if(retrySame&&levelFourSnapshot)restoreLevelFourState();else{placeLevelFourObjects();levelFourSnapshot=copyLevelFourState()}
 goldenKey=null;hasGoldenKey=false;
 for(const g of l4Layout.gates)grid[g.y][g.x]=0;
 l4={pages:l4Layout.pages.map(p=>({...p,taken:false})),terminal:{...l4Layout.terminal,done:false},keySpot:l4Layout.keySpot,
     puddles:l4Layout.puddles,gates:l4Layout.gates.map(g=>({...g,closed:false,forced:0})),
     final:false,special:null,nextSpecial:7,specialIdx:0,targets:[],bubble:null,lockHintCd:0,
     termArmed:true,termCode:null,termPos:0,termFlash:0,onWater:false,hints:{},specialsDodged:0};
 phase='cutscene';levelFourSceneStep=retrySame?2:0;renderLevelFourIntro();
}

// ---- Helpers ----------------------------------------------------------------
function l4PagesTaken(){return l4.pages.filter(p=>p.taken).length}
function l4Bubble(text){l4.bubble={name:'ali',text,time:1.8}}
function l4Hint(id,text){if(!l4.hints[id]){l4.hints[id]=true;showPowerText(text)}}
function l4OnPuddle(p){const x=Math.floor(p.x),y=Math.floor(p.y);return l4.puddles.find(w=>w.x===x&&w.y===y)}
function levelFourSpeedFactor(){return l4&&l4OnPuddle(player)?.7:1}
// Electrified water cycle per pool: off -> sparks warning (0.9s) -> zap (1.2s). Faster in the final chase.
function l4PuddleState(w){
 const period=l4&&l4.final?5:6.5,t=(clock+w.group*1.6)%period;
 return t<period-2.1?'off':t<period-1.2?'warn':'zap';
}
// Firewall gate cycle: open -> flicker warning (0.8s) -> shut (2.2s). Ali's special shuts them all.
function l4GateWanted(g){
 if(g.forced>0)return 'shut';
 const t=(clock+g.offset)%7;
 return t<4?'open':t<4.8?'warn':'shut';
}
function l4GateClear(g){ // nobody standing in (or walking into) the gate tile
 const cx=g.x+.5,cy=g.y+.5;
 if(Math.abs(player.x-cx)<.8&&Math.abs(player.y-cy)<.8)return false;
 return ![...enemies,...hazards.filter(h=>!h.dead)].some(a=>(Math.abs(a.x-cx)<.95&&Math.abs(a.y-cy)<.95)||(a.target&&a.target.x===g.x&&a.target.y===g.y));
}
function l4Goal(){ // the tile Diego needs to reach next
 const open=l4.pages.filter(p=>!p.taken);
 if(open.length){const from=l2Cell(player),dist=l2Distances(from.x,from.y);
  return open.map(p=>({x:Math.floor(p.x),y:Math.floor(p.y)})).sort((a,b)=>(dist.get(l2Key(a.x,a.y))??999)-(dist.get(l2Key(b.x,b.y))??999))[0]}
 if(!l4.terminal.done)return {x:Math.floor(l4.terminal.x),y:Math.floor(l4.terminal.y)};
 if(goldenKey&&!hasGoldenKey)return {x:Math.floor(goldenKey.x),y:Math.floor(goldenKey.y)};
 return {x:exitCell.x,y:exitCell.y};
}

// ---- Per-frame update (called from update() after Diego moves) ---------------
function updateLevelFour(dt){
 const s=l4;
 if(s.bubble)s.bubble.time-=dt;
 // Runbook pages.
 for(const p of s.pages){if(p.taken||distance(player,p)>=.5)continue;
  p.taken=true;score+=75;arcadeSound('pickup');burst(p.x*T,p.y*T,'#7ff5ea',26,1.1);
  const n=l4PagesTaken();
  showPowerText(n<s.pages.length?`📘 RUNBOOK PAGE ${n}/${s.pages.length}!`:'📘 RUNBOOK COMPLETE! 🖥️ Now enter the code at the security terminal');
 }
 // Security terminal.
 if(!s.terminal.done){
  const d=distance(player,s.terminal);
  if(d>.9)s.termArmed=true;
  if(d<.5&&s.termArmed){
   if(l4PagesTaken()<s.pages.length){if(s.lockHintCd===0){const left=s.pages.length-l4PagesTaken();showPowerText(`🖥️ TERMINAL LOCKED! Collect ${left} more 📘 runbook page${left===1?'':'s'} first`);s.lockHintCd=2.5}}
   else{enterTerminal();return}
  }
 }
 if(goldenKey&&!hasGoldenKey&&distance(player,goldenKey)<.5){
  hasGoldenKey=true;doorAnimation=1.25;burst(player.x*T,player.y*T,'#ffe18b',34,1.5);goldenKey=null;score+=100;arcadeSound('key');
  startFinalHandover();
 }
 // Locked key / exit hints.
 s.lockHintCd=Math.max(0,s.lockHintCd-dt);
 if(s.lockHintCd===0&&!goldenKey&&!hasGoldenKey&&distance(player,s.keySpot)<.6){
  showPowerText(l4PagesTaken()<s.pages.length?'🔒 KEY LOCKED! Collect the 📘 runbook pages, then use the 🖥️ terminal':'🔒 KEY LOCKED! Enter the code at the 🖥️ security terminal');s.lockHintCd=2.5}
 if(s.lockHintCd===0&&!hasGoldenKey&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<.8){
  showPowerText('🚪 EXIT LOCKED! Get the golden key first');s.lockHintCd=2.5}
 pickups=pickups.filter(p=>{if(distance(player,p)<.46){burst(p.x*T,p.y*T,'#fff0aa',14,.7);collectPickup(p.type);return false}return true});
 // Water and electricity.
 const pool=l4OnPuddle(player);
 if(pool&&!s.onWater)l4Hint('water','💧 SERVER ROOM LEAK! Water slows you down, and ⚡ sparks mean it is about to be electrified');
 s.onWater=!!pool;
 if(pool&&l4PuddleState(pool)==='zap')hit('zap');
 // Firewall gates.
 for(const g of s.gates){
  g.forced=Math.max(0,g.forced-dt);
  const want=l4GateWanted(g)==='shut';
  if(want&&!g.closed&&l4GateClear(g)){g.closed=true;grid[g.y][g.x]=1}
  else if(!want&&g.closed){g.closed=false;grid[g.y][g.x]=0}
  if(g.closed&&distance(player,{x:g.x+.5,y:g.y+.5})<1.6)l4Hint('gate','🔐 FIREWALL GATE! It opens again in a moment, or take another route');
 }
 // Ali's "remove instances" targets.
 for(const t of s.targets){t.t-=dt;
  if(t.t<=0){burst(t.x*T,t.y*T,'#ff5d7a',20,1);arcadeSound('hit');if(distance(player,t)<.95)hit('crash')}}
 s.targets=s.targets.filter(t=>t.t>0);
 updateHackers(dt);
}

// ---- Hackers --------------------------------------------------------------------
function updateHackers(dt){
 const want=l4.final?4:3;
 for(const h of hazards){if(h.type!=='hack')continue;
  if(h.dead){ // knocked out by a chappal: reconnects later, far from Diego
   if(h.respawnAt===undefined)h.respawnAt=clock+(l4.final?7:12);
   else if(clock>=h.respawnAt){const p=l2Cell(player),dist=l2Distances(p.x,p.y);
    const spots=[...dist.entries()].filter(([,d])=>d>=9).map(([k])=>({x:k%COLS+.5,y:Math.floor(k/COLS)+.5}));
    if(spots.length){Object.assign(h,newHacker(spots[Math.floor(Math.random()*spots.length)]),{dead:false,target:null,previous:null});delete h.respawnAt;showPowerText('👾 A hacker reconnected')}}
   continue}
  h.cool=Math.max(0,h.cool-dt);
  if(h.lock>0){h.lock-=dt;if(h.lock<=0)h.dash=1.1;continue}
  if(h.dash>0){h.dash-=dt;l2Move(h,dt,4.2,()=>l2Cell(player));continue}
  if(h.cool===0&&distance(h,player)<4.5){
   const c=l2Cell(h),p=l2Cell(player),d=l2Distances(c.x,c.y).get(l2Key(p.x,p.y));
   if(d!==undefined&&d<=5){h.lock=.8;h.cool=3.5+Math.random()*1.5;l4Hint('hacker','👾 HACKER LOCKED ON! It dashes at you after the red glare (🩴 knocks it out)');continue}
  }
  l2Move(h,dt,1.0,()=>Math.random()<.3?l2Cell(player):null);
 }
 // The final chase brings one more hacker online.
 if(hazards.filter(h=>h.type==='hack').length<want){
  const p=l2Cell(player),dist=l2Distances(p.x,p.y);
  const spots=[...dist.entries()].filter(([,d])=>d>=9).map(([k])=>({x:k%COLS+.5,y:Math.floor(k/COLS)+.5}));
  if(spots.length)hazards.push(newHacker(spots[Math.floor(Math.random()*spots.length)]));
 }
}

// ---- Security terminal (world paused while Diego types) -----------------------
function enterTerminal(){
 const s=l4;phase='terminal';player.x=s.terminal.x;player.y=s.terminal.y;
 const dirs=Object.keys(L4_DIRS);s.termCode=Array.from({length:L4.CODE},()=>dirs[Math.floor(Math.random()*4)]);s.termPos=0;s.termFlash=0;
 arcadeSound('mode');showPowerText('🔐 SECURITY TERMINAL: type the code with the arrow keys or WASD (Esc steps away)');
 speak('ali',true,'attack',3);updateUI();
}
function levelFourTerminalKey(k){
 const s=l4;if(phase!=='terminal'||!s)return;
 if(k==='Escape'){exitTerminal();return}
 const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down',left:'left',right:'right',up:'up',down:'down'};
 const dir=map[k];if(!dir)return;
 if(dir===s.termCode[s.termPos]){s.termPos++;arcadeSound('pickup');
  if(s.termPos>=s.termCode.length){terminalGranted();return}}
 else{s.termPos=0;s.termFlash=performance.now();arcadeSound('hit');showPowerText('❌ ACCESS DENIED! Start the code again')}
 updateUI();
}
function terminalGranted(){
 const s=l4;s.terminal.done=true;s.termCode=null;phase='playing';
 goldenKey={...s.keySpot};score+=100;arcadeSound('key');burst(s.terminal.x*T,s.terminal.y*T,'#7ff5ea',28,1.2);burst(goldenKey.x*T,goldenKey.y*T,'#ffe18b',30,1.3);
 player.inv=Math.max(player.inv,1.5); // a moment to get moving again
 showPowerText('✅ ACCESS GRANTED! 🔑 The golden key is unlocked');updateUI();
}
function exitTerminal(){
 const s=l4;phase='playing';s.termArmed=false;s.termCode=null;player.inv=Math.max(player.inv,1);
 showPowerText('🖥️ Stepped away from the terminal. Come back when you are ready');updateUI();
}

// ---- Ali ----------------------------------------------------------------------------
const L4_SPECIALS=['runbook','instances','security'];
const L4_WINDUP=.8;
function levelFourBosses(dt){
 const s=l4,pc=()=>l2Cell(player);
 for(const e of enemies){
  e.stun=Math.max(0,(e.stun||0)-dt);
  // Special requests: wind up, then act. A stun cancels the request.
  if(s.special){s.special.t-=dt;
   if(e.stun>0){s.special=null;e.charge=0;s.nextSpecial=s.final?6:8.5;showPowerText('💫 REQUEST CANCELLED! Ali is stunned');score+=20}
   else{e.charge=Math.max(0,s.special.t);if(s.special.t<=0){aliSpecial(s.special.kind,e);s.special=null;e.charge=0;s.nextSpecial=(s.final?6:8.5)+Math.random()*1.5}}
  }else{s.nextSpecial-=dt;
   if(s.nextSpecial<=0&&e.stun<=0){const kind=L4_SPECIALS[s.specialIdx++%L4_SPECIALS.length];s.special={kind,t:L4_WINDUP};e.charge=L4_WINDUP;
    l4Bubble({runbook:'📚 RUNBOOK PLEASE!',instances:'🧹 REMOVE INSTANCES!',security:'🔐 NEW SECURITY GROUP!'}[kind]);arcadeSound('mode');
    speak('ali',true,'attack',{runbook:0,instances:2,security:1}[kind]);}
  }
  if(e.stun>0)continue;
  if(e.charge>0){if(distance(e,player)<.66)hit('boss');continue} // winding up: stands still
  // Gatekeeper: hunts Diego up close, otherwise heads for Diego's next objective.
  const speed=s.final?1.9:1.15+l4PagesTaken()*.08;
  l2Move(e,dt,speed,()=>{
   if(s.final||distance(e,player)<6||Math.random()<.35)return pc();
   const g=l4Goal();return Math.abs(Math.floor(e.x)-g.x)+Math.abs(Math.floor(e.y)-g.y)>2?g:pc();
  });
  e.shot-=dt;
  if(e.shot<=0&&!s.special){
   e.shot=(s.final?2.2:3.0)+Math.random()*.7;
   if(Math.random()<.45)speak('ali');
   const a=Math.atan2(player.y-e.y,player.x-e.x);
   projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,name:'ali',life:5});
  }
  if(distance(e,player)<.66)hit('boss');
 }
}
function aliSpecial(kind,e){
 const s=l4;
 if(kind==='runbook'){
  for(let i=0;i<8;i++){const a=i*Math.PI/4+.2;projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*2.3,vy:Math.sin(a)*2.3,name:'ali',life:5})}
  showPowerText('📚 RUNBOOK REQUESTS INCOMING! Dodge the books');
 }else if(kind==='instances'){
  const p=l2Cell(player),dist=l2Distances(p.x,p.y);
  const around=[...dist.entries()].filter(([,d])=>d>=2&&d<=3).map(([k])=>({x:k%COLS,y:Math.floor(k/COLS)})).sort(()=>Math.random()-.5).slice(0,2);
  for(const c of [p,...around])s.targets.push({x:c.x+.5,y:c.y+.5,t:1.4,max:1.4});
  showPowerText('🧹 ALI IS REMOVING INSTANCES! Get off the red circles');
 }else{
  for(const g of s.gates)g.forced=4;
  showPowerText(s.gates.length?'🔐 NEW SECURITY GROUP! Every firewall gate shuts for 4s':'🔐 NEW SECURITY GROUP!');
 }
}
function startFinalHandover(){
 const s=l4;s.final=true;s.special=null;s.targets=[];s.nextSpecial=4;
 for(const e of enemies){e.stun=Math.max(e.stun||0,1.2);e.charge=0} // a short beat to react
 l4Bubble('🚪 ONE LAST KT!');arcadeSound('mode');
 showPowerText('🔑 KEY FOUND! 🚪 FINAL HANDOVER: Ali wants one last knowledge transfer. Run!');speak('ali',true,'attack',4);
}

// ---- HUD objective text (existing objective box in the sidebar) -------------
function levelFourQuest(){
 if(!l4)return '';
 const arrow={left:'←',right:'→',up:'↑',down:'↓'};
 if(phase==='terminal'&&l4.termCode)return `🔐 <b>ENTER THE CODE</b> · ${l4.termCode.map((d,i)=>i<l4.termPos?'✓':arrow[d]).join(' ')}`;
 const n=l4PagesTaken();
 if(n<l4.pages.length)return `📘 <b>RUNBOOK ${n}/${l4.pages.length}</b> · Collect the pages, then use the 🖥️ terminal`;
 if(!l4.terminal.done)return '🖥️ <b>SECURITY TERMINAL</b> · Enter the code to unlock the key';
 if(!hasGoldenKey)return '🔑 <b>KEY UNLOCKED</b> · Grab the golden key';
 return '🚪 <b>FINAL HANDOVER</b> · Reach the exit!';
}

// ---- Cutscenes (Level 1's cutscene panels) -----------------------------------
function renderLevelFourIntro(){
 if(levelFourSceneStep===0){
  show(`<div class="scene-label">BRIJ FAREWELL ARCADE · EPISODE 4/5</div><h2>THE HANDOVER</h2><div class="scene-people">${scenePortrait('ali')}</div><div class="scene-card"><p class="scene-quote">Release day survived. One more door before the CTO: Ali, the Engineering Manager, will not let anyone leave without a proper knowledge transfer.</p></div><small>LEVEL 4 · ALI, THE KNOWLEDGE GATEKEEPER</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelFourSceneStep=1;renderLevelFourIntro()},true,beginLevelFour);
 }else if(levelFourSceneStep===1){
  show(`<div class="scene-label">ONE LAST KT SESSION</div><div class="scene-people">${scenePortrait('ali')}${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">ALI: “${QUOTES.ali.intro[0]}”</p><p class="scene-quote">ALI: “${QUOTES.ali.attack[3]}”</p></div><small>The Engineering Manager has entered the chat. Handover status: pending review.</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelFourSceneStep=2;renderLevelFourIntro()},true,beginLevelFour);
 }else{
  show(`<div class="scene-label">DIEGO HAS A PLAN</div><div class="scene-people">${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.diego.attack[0]}”</p></div><h2>MISSION 4: COMPLETE THE HANDOVER!</h2><p>📘 Collect 2 runbook pages · 🖥️ Enter the code at the security terminal · 🔑 Grab the golden key · 🚪 Escape</p><small>Watch out: 👾 hackers dash at you (🩴 knocks them out) · 🔐 firewall gates · 💧⚡ electrified water · 📚 Ali's requests (🩴 a stun cancels them)</small>`);
  sceneButtons('▶ BEGIN LEVEL 4',beginLevelFour,false);
 }
}
function beginLevelFour(){
 if(level!==3)return;
 phase='playing';hide();dialogueCooldown=2.2;
 document.getElementById('dialogue').style.display='none';updateUI();
 showPowerText('🔒 The golden key is locked. Collect 2 📘 runbook pages, then enter the code at the 🖥️ terminal');
 setTimeout(()=>{if(phase==='playing'&&level===3)speak('ali',true,'intro',0)},900);
}
function levelFourVictoryScene(){
 phase='victoryScene';victoryFanfare();
 const palette=['#7ff5ea','#9fd8ff','#ffcf5a','#c9a8ff','#8dffc0'];
 const confetti=Array.from({length:46},(_,i)=>{
  const left=(i*47+13)%100,delay=(i*0.19)%2.4,duration=3.1+(i%7)*0.33;
  return `<i class="victory-confetti" style="--x:${left}%;--delay:${delay}s;--duration:${duration}s;--tilt:${(i%2?1:-1)*(35+i%5*17)}deg;--color:${palette[i%palette.length]}"></i>`;
 }).join('');
 const bursts=Array.from({length:3},(_,j)=>`<div class="victory-firework firework-${j+1}">${Array.from({length:12},(_,i)=>`<b style="--angle:${i*30}deg;--distance:${62+j*20}px;--delay:${j*.35}s"></b>`).join('')}</div>`).join('');
 show(`<div class="victory-experience"><div class="victory-particles" aria-hidden="true">${confetti}${bursts}</div><div class="victory-orbit" aria-hidden="true"></div><div class="victory-kicker"><span class="victory-status-light"></span> MISSION 04 COMPLETE <span class="victory-separator">/</span> HANDOVER APPROVED</div><div class="victory-medal" aria-hidden="true">🏆</div><h2 class="victory-headline">DIEGO HAS<br><em>ESCAPED!</em></h2><div class="victory-ribbon"><span>📘 KNOWLEDGE TRANSFER</span><strong>COMPLETE</strong><span>🚪 FREEDOM UNLOCKED</span></div><div class="victory-faceoff">${scenePortrait('ali')}<div class="victory-vs">VS <span>✓</span></div><div class="scene-person reaction-person"><img class="reaction-gif" src="${REACTIONS.happy}" alt="Diego laughing"><span>DIEGO</span></div></div>${victoryChat([['ALI',QUOTES.ali.attack[3]],['DIEGO','The runbook is in the repo. Somewhere. Good luck! 😇',true],['ALI',QUOTES.ali.defeated[0]]])}<div class="victory-tagline">Runbook delivered. Knowledge transferred. Mostly.</div><div class="victory-next-label">ONE BOSS LEFT</div></div>`);
 sceneButtons('▶ SEE RESULTS',levelFourResults,false);
 panel.classList.add('victory-panel');
}
function levelFourResults(){
 phase='win';if(!unlocked.includes(3))unlocked.push(3);updateUI();
 const stars=clock<240?3:clock<330?2:1;
 show(`<div class="cinematic-kicker">BOSS DEFEATED · LEVEL 4 / 5</div><h2 class="cinematic-title">LEVEL 4 CLEARED!</h2><div class="cinematic-sparkles">${'★'.repeat(stars)}</div><div class="cinematic-stats"><div><strong>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,'0')}</strong><span>ESCAPE TIME</span></div><div><strong>${health}%</strong><span>HEALTH LEFT</span></div><div><strong>${stats.defeated}</strong><span>HACKERS KNOCKED OUT</span></div></div><p>Ali: “${QUOTES.ali.defeated[0]}”</p>`);
 sceneButtons('▶ FINAL LEVEL: ZACK',()=>startLevel(4),false);
}
