// Level 3: Zoofi, Sush & Arqam, THE TRIPLE THREAT ("Release Day").
//
// Built on the Level 1 and Level 2 systems (tile movement, key and exit,
// pickups, snakes and beetles, abilities, cutscene panels, victory scene, the
// braided maze and the boss movement helpers from level2.js). Everything
// Level 3 specific lives here and in js/render/level3-art.js; shared files
// only call in when level===2.
//
// Flow: tick the 2 RELEASE CHECKLIST items -> the golden key unlocks -> grab it
// -> GO LIVE (all three come after Diego) -> exit.
//  - Zoofi (Lead QA), the hunter: chases Diego and throws 🐛 bugs.
//  - Sush (Engineering Lead), the long-range one: keeps his distance and fires
//    📨 reassigned tickets.
//  - Arqam (Developer), the guardian: hovers near Diego's next checklist item and
//    throws 🔁 tickets that fly out and come back to him.
//  - THE RELEASE CHAIN (signature combo, every ~12s, every step telegraphed):
//    Zoofi files a bug (a warning circle, then a crash lands and leaves a
//    crawling release-blocker bug) -> Sush reassigns it (3-ticket spread) ->
//    Arqam gives them back (2 returning tickets). A stunned boss skips his or
//    her step, so a well-timed chappal breaks the chain.
//  - Production fire vents cycle off -> smoke warning -> flames.
// Fairness: braided maze (loops, few dead ends), every attack has a wind-up,
// at most 3 release-blocker bugs at once, nothing kills instantly.

const L3={W:21,H:17,SCALE:.95,OX:101,OY:46};
const L3_ITEMS=[{icon:'🧪',name:'Tests passed'},{icon:'🚀',name:'Deploy approved'}];
const L3_COLORS={zoofi:'#e58bff',sush:'#7fd3ff',arqam:'#ffcf5a'};
let l3=null,l3Layout=null,levelThreeSnapshot=null,levelThreeSceneStep=0;

// ---- Maze -------------------------------------------------------------------
function createLevelThreeMaze(){
 const a=braidedMaze(L3.W,L3.H,.8,5);
 // The exit goes on the far side of the office from Diego's start (the
 // farthest walk among cells in the far part of the maze), so it never sits
 // just a few tiles from the start.
 const dist=new Map([[l2Key(1,1),0]]),q=[[1,1]];
 for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist.get(l2Key(x,y));
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);
   if(nx>0&&ny>0&&nx<L3.W-1&&ny<L3.H-1&&!a[ny][nx]&&!dist.has(k)){dist.set(k,d+1);q.push([nx,ny])}}}
 let best=null;
 for(const [k,d] of dist){const x=k%COLS,y=Math.floor(k/COLS);
  if(x+y<(L3.W+L3.H)*.55)continue;
  if(!best||d>best.d)best={x,y,d}}
 if(best)exitCell={x:best.x,y:best.y};
 return a;
}

// ---- Placement (once per fresh maze; Retry Same Maze reuses it) -------------
function placeLevelThreeObjects(){
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
 // The checklist items, off the direct route and spread around the office.
 const spots=[];
 for(let i=0;i<L3_ITEMS.length;i++){
  const c=pick(c=>c.d>=7&&offRoute(c)&&!near(c,spots,8))||pick(c=>c.d>=7&&!near(c,spots,6))||pick(c=>c.d>=4);
  spots.push(center(c));
 }
 const items=spots.map((p,i)=>({...p,...L3_ITEMS[i]}));
 // The golden key waits on the main route, ~60% of the way to the exit.
 let ki=Math.max(2,Math.min(route.length-3,Math.floor(route.length*.6)));
 while(used.has(l2Key(route[ki].x,route[ki].y))&&ki<route.length-2)ki++;
 used.add(l2Key(route[ki].x,route[ki].y));
 const keySpot=center(route[ki]);
 const keep=[keySpot,...items];
 // Level 1's power-ups, plus 3 coffees and an extra shield and heal for a three-boss level.
 pickups=[];
 for(const type of ['coffee','coffee','coffee','dnd','heal','goldenChappal','dnd','heal']){const c=pick(c=>c.d>4&&!near(c,keep,2)&&!near(c,pickups,4));if(c)pickups.push({type,...center(c)})}
 // Production fire vents: two on the main route, three elsewhere, spread apart.
 const vents=[];
 const ventOk=c=>c.d>=5&&!near(c,vents,4)&&!near(c,keep,2)&&!near(c,pickups,1)&&Math.abs(c.x-exitCell.x)+Math.abs(c.y-exitCell.y)>2;
 for(let i=0;i<2;i++){const c=pick(c=>!offRoute(c)&&ventOk(c));if(c)vents.push(center(c))}
 for(let i=0;i<3;i++){const c=pick(ventOk);if(c)vents.push(center(c))}
 vents.forEach((v,i)=>v.offset=i*1.37);
 // Three snakes and two beetles, a little quicker than Level 2's.
 hazards=[];
 for(let i=0;i<5;i++){const c=pick(c=>c.d>=9&&!near(c,hazards,3)&&!near(c,keep,2));
  if(c)hazards.push({...center(c),type:i<3?'snake':'bug',phase:Math.random()*6.28,dir:[1,0],turn:0,speed:(i<3?.88:1.06)+.25})}
 coins=cells.filter(c=>c.d>3&&!used.has(l2Key(c.x,c.y))&&(c.x*7+c.y*11+2)%4===0).map(center);
 // Bosses start far from Diego and from each other, never on the exit.
 const far=(c,list,r)=>list.every(o=>Math.abs(c.x-o.x)+Math.abs(c.y-o.y)>=r);
 const z=pick(c=>c.d>=15)||pick(c=>c.d>=10)||pick(c=>c.d>=6);
 const s=pick(c=>c.d>=12&&far(c,[z],7))||pick(c=>c.d>=8)||pick(c=>c.d>=6);
 const a=pick(c=>c.d>=11&&far(c,[z,s],6))||pick(c=>c.d>=8)||pick(c=>c.d>=6);
 enemies=[{name:'zoofi',...center(z),shot:3.2,move:0,dir:[0,0],pathTimer:0,charge:0},
          {name:'sush',...center(s),shot:4.4,move:0,dir:[0,0],pathTimer:0,charge:0},
          {name:'arqam',...center(a),shot:5.6,move:0,dir:[0,0],pathTimer:0,charge:0}];
 l3Layout={items,keySpot,vents};
}
function copyLevelThreeState(){return JSON.parse(JSON.stringify({grid,exitCell,l3Layout,pickups,coins,hazards,enemies}))}
function restoreLevelThreeState(){const s=JSON.parse(JSON.stringify(levelThreeSnapshot));
 grid=s.grid;exitCell=s.exitCell;l3Layout=s.l3Layout;pickups=s.pickups;coins=s.coins;hazards=s.hazards;enemies=s.enemies}

// Called by startLevel(2) after the shared resets.
function startLevelThree(retrySame){
 if(retrySame&&levelThreeSnapshot)restoreLevelThreeState();else{placeLevelThreeObjects();levelThreeSnapshot=copyLevelThreeState()}
 goldenKey=null;hasGoldenKey=false;
 l3={items:l3Layout.items.map(it=>({...it,taken:false})),keySpot:l3Layout.keySpot,vents:l3Layout.vents,
     live:false,combo:null,nextCombo:8,firstCombo:true,drops:[],bubble:null,lockHintCd:0,ventHint:false,combosBroken:0};
 phase='cutscene';levelThreeSceneStep=retrySame?2:0;renderLevelThreeIntro();
}

// ---- Helpers ----------------------------------------------------------------
function l3ItemsTaken(){return l3.items.filter(it=>it.taken).length}
function l3Bubble(name,text){l3.bubble={name,text,time:1.8}}
function l3Boss(name){return enemies.find(e=>e.name===name)}
function l3Goal(){ // the tile Diego needs to reach next
 const open=l3.items.filter(it=>!it.taken);
 if(open.length){const from=l2Cell(player),dist=l2Distances(from.x,from.y);
  return open.map(it=>({x:Math.floor(it.x),y:Math.floor(it.y)})).sort((a,b)=>(dist.get(l2Key(a.x,a.y))??999)-(dist.get(l2Key(b.x,b.y))??999))[0]}
 if(goldenKey&&!hasGoldenKey)return {x:Math.floor(goldenKey.x),y:Math.floor(goldenKey.y)};
 return {x:exitCell.x,y:exitCell.y};
}
// Fire vent cycle: off -> smoke warning (1s) -> flames (1.6s). Faster after GO LIVE.
function l3VentState(v){
 const period=level===2&&l3&&l3.live?5:6,t=(clock+v.offset)%period;
 return t<period-2.6?'off':t<period-1.6?'warn':'fire';
}
function l3Blockers(){return hazards.filter(h=>h.blocker&&!h.dead)}

// ---- Per-frame update (called from update() after Diego moves) ---------------
function updateLevelThree(dt){
 const s=l3;
 if(s.bubble)s.bubble.time-=dt;
 // Release checklist, then the golden key.
 for(const it of s.items){if(it.taken||distance(player,it)>=.5)continue;
  it.taken=true;score+=75;arcadeSound('pickup');burst(it.x*T,it.y*T,'#7dffb2',26,1.1);
  const n=l3ItemsTaken();
  if(n<s.items.length)showPowerText(`✅ CHECKLIST ${n}/${s.items.length}: ${it.icon} ${it.name}!`);
  else{goldenKey={...s.keySpot};arcadeSound('key');burst(goldenKey.x*T,goldenKey.y*T,'#ffe18b',30,1.3);
   showPowerText('✅ RELEASE CHECKLIST COMPLETE! 🔑 The golden key is unlocked');}
 }
 if(goldenKey&&!hasGoldenKey&&distance(player,goldenKey)<.5){
  hasGoldenKey=true;doorAnimation=1.25;burst(player.x*T,player.y*T,'#ffe18b',34,1.5);goldenKey=null;score+=100;arcadeSound('key');
  startGoLive();
 }
 // The key is visible from the start but locked until the checklist is done.
 s.lockHintCd=Math.max(0,s.lockHintCd-dt);
 if(s.lockHintCd===0&&!goldenKey&&!hasGoldenKey&&distance(player,s.keySpot)<.6){
  const left=s.items.length-l3ItemsTaken();
  showPowerText(`🔒 KEY LOCKED! Tick ${left} more ✅ checklist item${left===1?'':'s'} to unlock it`);s.lockHintCd=2.5}
 if(s.lockHintCd===0&&!hasGoldenKey&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<.8){
  showPowerText('🚪 EXIT LOCKED! Get the golden key first');s.lockHintCd=2.5}
 pickups=pickups.filter(p=>{if(distance(player,p)<.46){burst(p.x*T,p.y*T,'#fff0aa',14,.7);collectPickup(p.type);return false}return true});
 // Production fire vents.
 for(const v of s.vents){const st=l3VentState(v);
  if(st==='fire'&&distance(player,v)<.55)hit('fire');
  if(st==='warn'&&!s.ventHint&&distance(player,v)<2.5){s.ventHint=true;showPowerText('🔥 FIRE VENT! Smoke means flames are coming. Wait, then run past')}}
 // Zoofi's filed bugs: the warning circle shrinks, a crash lands, a blocker bug crawls out.
 for(const d of s.drops){d.t-=dt;
  if(d.t<=0){
   burst(d.x*T,d.y*T,'#ff5d7a',24,1.1);arcadeSound('hit');
   if(distance(player,d)<.95)hit('crash');
   if(l3Blockers().length<3)hazards.push({x:d.x,y:d.y,type:'bug',blocker:true,life:9,phase:Math.random()*6.28,dir:[1,0],turn:0,speed:1.05});
  }}
 s.drops=s.drops.filter(d=>d.t>0);
 for(const h of hazards)if(h.blocker&&!h.dead){h.life-=dt;if(h.life<=0){h.dead=true;h.expired=true}}
 // Arqam's tickets fly out, then turn round and come back to him.
 const arqam=l3Boss('arqam');
 for(const p of projectiles){if(!p.boomerang)continue;p.age+=dt;
  if(p.age>=p.turnAt&&arqam){const dx=arqam.x-p.x,dy=arqam.y-p.y,d=Math.hypot(dx,dy)||1;
   p.vx=dx/d*2.9;p.vy=dy/d*2.9;if(d<.45)p.dead=true}}
 updateReleaseChain(dt);
}

// ---- The release chain: Zoofi -> Sush -> Arqam -------------------------------
const L3_CHAIN=[{who:'zoofi',at:0},{who:'sush',at:1.7},{who:'arqam',at:3.4}];
const L3_WINDUP=.65;
function updateReleaseChain(dt){
 const s=l3;
 if(!s.combo){s.nextCombo-=dt;if(s.nextCombo<=0)startReleaseChain();return}
 const c=s.combo;c.t+=dt;
 for(const step of c.steps){
  const boss=l3Boss(step.who);
  if(step.state==='pending'&&c.t>=step.at){
   if(!boss||boss.stun>0){breakChain(step);continue}
   step.state='charging';boss.charge=L3_WINDUP;
   l3Bubble(step.who,{zoofi:'🐞 BUG FILED!',sush:'📨 REASSIGNED → DIEGO',arqam:'🔁 GIVING THEM BACK!'}[step.who]);
   arcadeSound('mode');
   speak(step.who,true,'attack',{zoofi:1,sush:3,arqam:2}[step.who]);
  }
  if(step.state==='charging'&&c.t>=step.at+L3_WINDUP){
   if(!boss||boss.stun>0){breakChain(step);continue}
   step.state='done';boss.charge=0;chainAction(step.who,boss);
  }
 }
 if(c.steps.every(st=>st.state==='done'||st.state==='broken')){
  s.combo=null;s.nextCombo=s.live?8+Math.random()*2:11+Math.random()*3;
 }
}
function startReleaseChain(){
 l3.combo={t:0,steps:L3_CHAIN.map(st=>({...st,state:'pending'}))};
 showPowerText(l3.firstCombo?'⚠️ RELEASE CHAIN! Zoofi files a bug → Sush reassigns it → Arqam sends it back (🩴 a stunned boss breaks the chain)':'⚠️ RELEASE CHAIN incoming!');
 l3.firstCombo=false;
}
function breakChain(step){
 step.state='broken';l3.combosBroken++;
 const boss=l3Boss(step.who);if(boss)boss.charge=0;
 showPowerText(`💫 CHAIN BROKEN! ${step.who[0].toUpperCase()+step.who.slice(1)} is stunned`);score+=20;
}
function chainAction(who,boss){
 const aim=Math.atan2(player.y-boss.y,player.x-boss.x);
 if(who==='zoofi'){ // file a bug right where Diego is standing
  const c=l2Cell(player);l3.drops.push({x:c.x+.5,y:c.y+.5,t:1.3,max:1.3});
  showPowerText('🐞 Zoofi filed a bug! Move off the red circle');
 }else if(who==='sush'){
  for(let i=-1;i<=1;i++){const a=aim+i*.24;projectiles.push({x:boss.x,y:boss.y,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,name:'sush',life:5})}
 }else{
  for(const off of [-.32,.32])l3Boomerang(boss,aim+off);
 }
}
function l3Boomerang(boss,a){projectiles.push({x:boss.x,y:boss.y,vx:Math.cos(a)*3.2,vy:Math.sin(a)*3.2,name:'arqam',life:5,boomerang:true,age:0,turnAt:1})}
function startGoLive(){
 l3.live=true;l3.drops=[];l3.combo=null;l3.nextCombo=4;
 for(const e of enemies){e.stun=Math.max(e.stun||0,1.2);e.charge=0} // a short beat to react
 l3Bubble('zoofi','🚀 GO LIVE!');arcadeSound('mode');
 showPowerText('🔑 KEY FOUND! 🚀 GO LIVE: the whole team is on you. Reach the exit!');speak('zoofi',true,'attack',3);
}

// ---- Bosses -------------------------------------------------------------------
function levelThreeBosses(dt){
 const ramp=l3ItemsTaken()*.07,pc=()=>l2Cell(player),busy=!!l3.combo;
 for(const e of enemies){
  e.stun=Math.max(0,(e.stun||0)-dt);
  if(e.stun>0)continue; // a stunned boss neither moves, shoots nor joins the chain
  if(e.charge>0){e.charge=Math.max(0,e.charge-dt);if(distance(e,player)<.66)hit('boss');continue} // winding up: stands still
  if(e.name==='zoofi'){
   // Hunter: chases Diego most of the time.
   const speed=l3.live?1.75:1.05+ramp;
   l2Move(e,dt,speed,()=>(l3.live||Math.random()<.55)?pc():null);
  }else if(e.name==='sush'){
   // Long range: closes in when Diego is far, drifts off when he is close.
   // After GO LIVE he cuts Diego off a few tiles ahead on the way to the exit.
   const speed=l3.live?1.6:.95+ramp;
   l2Move(e,dt,speed,()=>{
    const p=pc(),d=distance(e,player);
    if(l3.live){if(d<3.2)return p;const r=mazeRoute(p,exitCell);return r.length>5&&r[0].x===p.x&&r[0].y===p.y?r[4]:p}
    if(d>6)return p;if(d<3)return null;return Math.random()<.4?p:null;
   });
  }else{
   // Guardian: hovers near Diego's next checklist item and pounces when he gets close.
   // After GO LIVE he simply chases.
   const speed=l3.live?1.45:1.0+ramp;
   l2Move(e,dt,speed,()=>{
    const p=pc();
    if(l3.live)return Math.random()<.7?p:null;
    if(distance(e,player)<4&&Math.random()<.6)return p;
    const g=l3Goal();return Math.abs(Math.floor(e.x)-g.x)+Math.abs(Math.floor(e.y)-g.y)>2?g:null;
   });
  }
  // Single shots between chains (they hold fire while a chain plays out).
  e.shot-=dt;
  if(e.shot<=0&&!busy){
   const base={zoofi:[4.2,3.2],sush:[4.8,3.6],arqam:[5.2,4]}[e.name];
   e.shot=(l3.live?base[1]:base[0])+Math.random()*.8;
   if(Math.random()<.5)speak(e.name);
   const a=Math.atan2(player.y-e.y,player.x-e.x);
   if(e.name==='arqam')l3Boomerang(e,a);
   else{const sp=e.name==='zoofi'?2.4:2.5;projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,name:e.name,life:5})}
  }else if(e.shot<=0)e.shot=.5;
  if(distance(e,player)<.66)hit('boss');
 }
}

// ---- HUD objective text (existing objective box in the sidebar) -------------
function levelThreeQuest(){
 if(!l3)return '';
 const n=l3ItemsTaken();
 if(n<l3.items.length){const left=l3.items.filter(it=>!it.taken).map(it=>it.icon).join(' ');
  return `📋 <b>RELEASE CHECKLIST ${n}/${l3.items.length}</b> · Tick ${left} to unlock the key`}
 if(!hasGoldenKey)return '🔑 <b>KEY UNLOCKED</b> · Grab the golden key';
 return '🚀 <b>GO LIVE</b> · Ship it! Reach the exit';
}

// ---- Cutscenes (Level 1's cutscene panels) -----------------------------------
function renderLevelThreeIntro(){
 const trio=scenePortrait('zoofi')+scenePortrait('sush')+scenePortrait('arqam');
 if(levelThreeSceneStep===0){
  show(`<div class="scene-label">BRIJ FAREWELL ARCADE · EPISODE 3/5</div><h2>IT'S RELEASE DAY</h2><div class="scene-people">${trio}</div><div class="scene-card"><p class="scene-quote">Diego survived sprint planning. Now QA has found bugs, engineering is reassigning them, and somehow every ticket ends up with Diego.</p></div><small>LEVEL 3 · ZOOFI, SUSH & ARQAM, THE TRIPLE THREAT</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelThreeSceneStep=1;renderLevelThreeIntro()},true,beginLevelThree);
 }else if(levelThreeSceneStep===1){
  show(`<div class="scene-label">THE RELEASE CHANNEL WAKES UP</div><div class="scene-people">${trio}</div><div class="scene-card"><p class="scene-quote">ZOOFI: “${QUOTES.zoofi.intro[0]}” ... “${QUOTES.zoofi.intro[1]}”</p><p class="scene-quote">SUSH: “${QUOTES.sush.intro[0]}”</p><p class="scene-quote">ARQAM: “${QUOTES.arqam.intro[0]}”</p></div><small>Lead QA, Engineering Lead and Developer have entered the chat.</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelThreeSceneStep=2;renderLevelThreeIntro()},true,beginLevelThree);
 }else{
  show(`<div class="scene-label">DIEGO HAS A PLAN</div><div class="scene-people">${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.diego.attack[0]}”</p></div><h2>MISSION 3: SURVIVE RELEASE DAY!</h2><p>✅ Tick the 2 release checklist items 🧪 🚀 to unlock the 🔑 golden key · 🔑 Grab it · 🚪 Ship it through the exit</p><small>Watch out: 🐞 Zoofi files bugs → 📨 Sush reassigns them → 🔁 Arqam sends them back · 🩴 stun a boss to break the chain · 🔥 fire vents</small>`);
  sceneButtons('▶ BEGIN LEVEL 3',beginLevelThree,false);
 }
}
function beginLevelThree(){
 if(level!==2)return;
 phase='playing';hide();dialogueCooldown=2.2;
 document.getElementById('dialogue').style.display='none';updateUI();
 showPowerText('🔒 The golden key is locked. Tick the 2 ✅ release checklist items to unlock it');
 setTimeout(()=>{if(phase==='playing'&&level===2)speak('zoofi',true,'intro',0)},900);
 setTimeout(()=>{if(phase==='playing'&&level===2)speak('zoofi',true,'intro',1)},2600);
}
function levelThreeVictoryScene(){
 phase='victoryScene';victoryFanfare();
 const palette=['#ff8fa3','#e58bff','#ffcf5a','#7fd3ff','#8dffc0'];
 const confetti=Array.from({length:46},(_,i)=>{
  const left=(i*47+13)%100,delay=(i*0.19)%2.4,duration=3.1+(i%7)*0.33;
  return `<i class="victory-confetti" style="--x:${left}%;--delay:${delay}s;--duration:${duration}s;--tilt:${(i%2?1:-1)*(35+i%5*17)}deg;--color:${palette[i%palette.length]}"></i>`;
 }).join('');
 const bursts=Array.from({length:3},(_,j)=>`<div class="victory-firework firework-${j+1}">${Array.from({length:12},(_,i)=>`<b style="--angle:${i*30}deg;--distance:${62+j*20}px;--delay:${j*.35}s"></b>`).join('')}</div>`).join('');
 show(`<div class="victory-experience"><div class="victory-particles" aria-hidden="true">${confetti}${bursts}</div><div class="victory-orbit" aria-hidden="true"></div><div class="victory-kicker"><span class="victory-status-light"></span> MISSION 03 COMPLETE <span class="victory-separator">/</span> RELEASE SHIPPED</div><div class="victory-medal" aria-hidden="true">🏆</div><h2 class="victory-headline">DIEGO HAS<br><em>ESCAPED!</em></h2><div class="victory-ribbon"><span>🐞 RELEASE DAY</span><strong>SURVIVED</strong><span>🚪 FREEDOM UNLOCKED</span></div><div class="victory-faceoff">${scenePortrait('zoofi')}${scenePortrait('sush')}${scenePortrait('arqam')}<div class="victory-vs">VS <span>✓</span></div><div class="scene-person reaction-person"><img class="reaction-gif" src="${REACTIONS.happy}" alt="Diego laughing"><span>DIEGO</span></div></div><div class="victory-conversation"><p><b>ZOOFI</b><span>“${QUOTES.zoofi.defeated[0]}”</span></p><p><b>SUSH</b><span>“${QUOTES.sush.defeated[0]}”</span></p><p><b>ARQAM</b><span>“${QUOTES.arqam.defeated[0]}”</span></p><p><b>DIEGO</b><span>“${QUOTES.diego.defeated[1]}”</span></p></div><div class="victory-tagline">Release shipped. Zero open bugs. (Zoofi is still checking.)</div><div class="victory-next-label">THE NEXT CHAPTER IS READY</div></div>`);
 sceneButtons('▶ SEE RESULTS',levelThreeResults,false);
 panel.classList.add('victory-panel');
}
function levelThreeResults(){
 phase='win';if(!unlocked.includes(2))unlocked.push(2);updateUI();
 const stars=clock<240?3:clock<330?2:1;
 show(`<div class="cinematic-kicker">BOSSES DEFEATED · LEVEL 3 / 5</div><h2 class="cinematic-title">LEVEL 3 CLEARED!</h2><div class="cinematic-sparkles">${'★'.repeat(stars)}</div><div class="cinematic-stats"><div><strong>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,'0')}</strong><span>ESCAPE TIME</span></div><div><strong>${health}%</strong><span>HEALTH LEFT</span></div><div><strong>${stats.defeated}</strong><span>BUGS SQUASHED</span></div></div><p>Sush: “${QUOTES.sush.defeated[0]}”</p>`);
 sceneButtons('▶ NEXT LEVEL: ALI',()=>startLevel(3),false);
}
