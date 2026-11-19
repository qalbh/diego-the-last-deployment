// Level 5: Zack, THE FINAL BOSS ("Final Deployment"), then the Diego Succession
// Plan and the Memory Wall.
//
// Built on the earlier levels' systems (braided maze, boss movement helpers,
// key and exit, pickups, abilities, cutscene panels, victory scene). Hazards from
// earlier levels return in small numbers: Level 3's fire vents, Level 1's snakes
// and beetle, Level 4's hackers. Everything Level 5 specific lives here and in
// js/render/level5-art.js; shared files only call in when level===4.
//
// Flow: fix 2 production INCIDENTS -> the golden key unlocks -> grab it ->
// SURPRISE PROMO PROJECT + "YOU WILL NEVER ESCAPE US" -> exit -> victory ->
// Diego Succession Plan -> Memory Wall.
// Zack's phases:
//  1 "ARE YOU AVAILABLE?" (start): patrols and chases, 🚨 shots, URGENT pings.
//  2 "URGENT" (after the first incident is fixed): red alarms, faster, and his
//    full rotation of telegraphed requests (wind-up ring + bubble):
//    🚨 URGENT (3 target circles), ❓ EXPLAIN (5-shot spread), 🌐 DOMAIN DOWN
//    (a shockwave ring that passes through walls: outrun it or use Ghost Mode).
//  3 "YOU WILL NEVER ESCAPE US" (after the key): fastest, plus four promo bots
//    (Product Registration, Signal, Sweepstakes, Reviews) that chase Diego.
// A stunned Zack drops whatever request he was winding up. Nothing kills
// instantly: every hit is 25 HP with the usual post-hit invulnerability.

const L5={W:23,H:17,SCALE:.95,OX:63,OY:46};
const L5_INCIDENTS=[{icon:'🌐',name:'Custom domain is back up'},{icon:'🖥️',name:'Prod server restarted'}];
const L5_PROMOS=[{icon:'📝',name:'Product Registration'},{icon:'📶',name:'Signal'},{icon:'🎟️',name:'Sweepstakes'},{icon:'⭐',name:'Reviews'}];
const L5_WINDUP=1;
let l5=null,l5Layout=null,levelFiveSnapshot=null,levelFiveSceneStep=0;

// ---- Maze -------------------------------------------------------------------
function createLevelFiveMaze(){
 const a=braidedMaze(L5.W,L5.H,.85,6);
 // Exit on the far side of the arena from Diego's start (as in Levels 3 and 4).
 const dist=new Map([[l2Key(1,1),0]]),q=[[1,1]];
 for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist.get(l2Key(x,y));
  for(const [dx,dy] of L2_DIRS){const nx=x+dx,ny=y+dy,k=l2Key(nx,ny);
   if(nx>0&&ny>0&&nx<L5.W-1&&ny<L5.H-1&&!a[ny][nx]&&!dist.has(k)){dist.set(k,d+1);q.push([nx,ny])}}}
 let best=null;
 for(const [k,d] of dist){const x=k%COLS,y=Math.floor(k/COLS);
  if(x+y<(L5.W+L5.H)*.55)continue;
  if(!best||d>best.d)best={x,y,d}}
 if(best)exitCell={x:best.x,y:best.y};
 return a;
}

// ---- Placement (once per fresh maze; Retry Same Maze reuses it) -------------
function placeLevelFiveObjects(){
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
 // Two production incidents, off the direct route and far apart.
 const spots=[];
 for(let i=0;i<L5_INCIDENTS.length;i++){const c=pick(c=>c.d>=8&&offRoute(c)&&!near(c,spots,9))||pick(c=>c.d>=7&&!near(c,spots,6))||pick(c=>c.d>=4);spots.push(center(c))}
 const incidents=spots.map((p,i)=>({...p,...L5_INCIDENTS[i]}));
 // The golden key waits on the main route, ~60% of the way to the exit.
 let ki=Math.max(2,Math.min(route.length-3,Math.floor(route.length*.6)));
 while(used.has(l2Key(route[ki].x,route[ki].y))&&ki<route.length-2)ki++;
 used.add(l2Key(route[ki].x,route[ki].y));
 const keySpot=center(route[ki]);
 const keep=[keySpot,...incidents];
 // Power-ups: 3 coffees (user request), 2 shields, 2 heals, golden chappal.
 pickups=[];
 for(const type of ['coffee','coffee','coffee','dnd','heal','goldenChappal','dnd','heal']){const c=pick(c=>c.d>4&&!near(c,keep,2)&&!near(c,pickups,4));if(c)pickups.push({type,...center(c)})}
 // Returning hazards, kept few: 3 fire vents (Level 3), 2 snakes + 1 beetle (Level 1), 2 hackers (Level 4).
 const vents=[];
 const ventOk=c=>c.d>=6&&!near(c,vents,5)&&!near(c,keep,2)&&!near(c,pickups,1)&&Math.abs(c.x-exitCell.x)+Math.abs(c.y-exitCell.y)>2;
 {const c=pick(c=>!offRoute(c)&&ventOk(c));if(c)vents.push(center(c))}
 for(let i=0;i<2;i++){const c=pick(ventOk);if(c)vents.push(center(c))}
 vents.forEach((v,i)=>v.offset=i*1.9);
 hazards=[];
 for(let i=0;i<3;i++){const c=pick(c=>c.d>=9&&!near(c,hazards,4)&&!near(c,keep,2));
  if(c)hazards.push({...center(c),type:i<2?'snake':'bug',phase:Math.random()*6.28,dir:[1,0],turn:0,speed:(i<2?.88:1.06)+.25})}
 for(let i=0;i<2;i++){const c=pick(c=>c.d>=11&&!near(c,hazards,4)&&!near(c,keep,2));if(c)hazards.push(newHacker(center(c)))}
 coins=cells.filter(c=>c.d>3&&!used.has(l2Key(c.x,c.y))&&(c.x*7+c.y*11+1)%4===0).map(center);
 // Zack starts far from Diego.
 const z=pick(c=>c.d>=16)||pick(c=>c.d>=10)||pick(c=>c.d>=6);
 enemies=[{name:'zack',...center(z),shot:3.2,move:0,dir:[0,0],pathTimer:0,charge:0}];
 l5Layout={incidents,keySpot,vents};
}
function copyLevelFiveState(){return JSON.parse(JSON.stringify({grid,exitCell,l5Layout,pickups,coins,hazards,enemies}))}
function restoreLevelFiveState(){const s=JSON.parse(JSON.stringify(levelFiveSnapshot));
 grid=s.grid;exitCell=s.exitCell;l5Layout=s.l5Layout;pickups=s.pickups;coins=s.coins;hazards=s.hazards;enemies=s.enemies}

// Called by startLevel(4) after the shared resets.
function startLevelFive(retrySame){
 if(retrySame&&levelFiveSnapshot)restoreLevelFiveState();else{placeLevelFiveObjects();levelFiveSnapshot=copyLevelFiveState()}
 goldenKey=null;hasGoldenKey=false;
 l5={incidents:l5Layout.incidents.map(it=>({...it,fixed:false})),keySpot:l5Layout.keySpot,vents:l5Layout.vents,
     stage:1,special:null,nextSpecial:9,specialIdx:0,targets:[],rings:[],bubble:null,lockHintCd:0,hints:{},promosPostponed:0};
 phase='cutscene';levelFiveSceneStep=retrySame?2:0;renderLevelFiveIntro();
}

// ---- Helpers ----------------------------------------------------------------
function l5Fixed(){return l5.incidents.filter(it=>it.fixed).length}
function l5Bubble(text){l5.bubble={name:'zack',text,time:2}}
function l5Hint(id,text){if(!l5.hints[id]){l5.hints[id]=true;showPowerText(text)}}
function l5Goal(){
 const open=l5.incidents.filter(it=>!it.fixed);
 if(open.length){const from=l2Cell(player),dist=l2Distances(from.x,from.y);
  return open.map(it=>({x:Math.floor(it.x),y:Math.floor(it.y)})).sort((a,b)=>(dist.get(l2Key(a.x,a.y))??999)-(dist.get(l2Key(b.x,b.y))??999))[0]}
 if(goldenKey&&!hasGoldenKey)return {x:Math.floor(goldenKey.x),y:Math.floor(goldenKey.y)};
 return {x:exitCell.x,y:exitCell.y};
}
function l5VentState(v){return l3VentState(v)} // Level 3's cycle: off -> 1s smoke warning -> 1.6s flames
function l5FarSpot(min){
 const p=l2Cell(player),dist=l2Distances(p.x,p.y);
 const spots=[...dist.entries()].filter(([,d])=>d>=min).map(([k])=>({x:k%COLS+.5,y:Math.floor(k/COLS)+.5}));
 return spots.length?spots[Math.floor(Math.random()*spots.length)]:null;
}

// ---- Per-frame update (called from update() after Diego moves) ---------------
function updateLevelFive(dt){
 const s=l5;
 if(s.bubble)s.bubble.time-=dt;
 // Production incidents, then the golden key.
 for(const it of s.incidents){if(it.fixed||distance(player,it)>=.5)continue;
  it.fixed=true;score+=100;arcadeSound('pickup');burst(it.x*T,it.y*T,'#7dffb2',28,1.2);
  const n=l5Fixed();
  if(n<s.incidents.length){showPowerText(`✅ INCIDENT ${n}/${s.incidents.length} FIXED: ${it.icon} ${it.name}!`);if(s.stage<2)startUrgentStage()}
  else{goldenKey={...s.keySpot};arcadeSound('key');burst(goldenKey.x*T,goldenKey.y*T,'#ffe18b',30,1.3);
   showPowerText(`✅ INCIDENT ${n}/${s.incidents.length} FIXED: ${it.icon} ${it.name}! 🔑 The golden key is unlocked`);}
 }
 if(goldenKey&&!hasGoldenKey&&distance(player,goldenKey)<.5){
  hasGoldenKey=true;doorAnimation=1.25;burst(player.x*T,player.y*T,'#ffe18b',34,1.5);goldenKey=null;score+=100;arcadeSound('key');
  startPromoSurprise();
 }
 s.lockHintCd=Math.max(0,s.lockHintCd-dt);
 if(s.lockHintCd===0&&!goldenKey&&!hasGoldenKey&&distance(player,s.keySpot)<.6){
  const left=s.incidents.length-l5Fixed();
  showPowerText(`🔒 KEY LOCKED! Fix ${left} more 🚨 production incident${left===1?'':'s'} first`);s.lockHintCd=2.5}
 if(s.lockHintCd===0&&!hasGoldenKey&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<.8){
  showPowerText('🚪 EXIT LOCKED! Get the golden key first');s.lockHintCd=2.5}
 pickups=pickups.filter(p=>{if(distance(player,p)<.46){burst(p.x*T,p.y*T,'#fff0aa',14,.7);collectPickup(p.type);return false}return true});
 // Returning fire vents.
 for(const v of s.vents){const st=l5VentState(v);
  if(st==='fire'&&distance(player,v)<.55)hit('fire');
  if(st==='warn'&&distance(player,v)<2.5)l5Hint('vent','🔥 FIRE VENTS are back! Smoke means flames are coming')}
 // URGENT target circles.
 for(const t of s.targets){t.t-=dt;
  if(t.t<=0){burst(t.x*T,t.y*T,'#ff5d7a',20,1);arcadeSound('hit');if(distance(player,t)<.95)hit('crash')}}
 s.targets=s.targets.filter(t=>t.t>0);
 // DOMAIN DOWN shockwaves: an expanding ring through walls. One hit per ring at most.
 for(const r of s.rings){r.r+=r.speed*dt;
  if(!r.hit&&Math.abs(distance(player,r)-r.r)<.45){r.hit=true;hit('shock')}}
 s.rings=s.rings.filter(r=>r.r<r.max);
 updateLevelFiveCrowd(dt);
}
function updateLevelFiveCrowd(dt){
 // Hackers (Level 4 behaviour, fewer of them) and the promo bots.
 for(const h of hazards){
  if(h.type==='hack'){
   if(h.dead){if(h.respawnAt===undefined)h.respawnAt=clock+12;else if(clock>=h.respawnAt){const p=l5FarSpot(9);if(p){Object.assign(h,newHacker(p),{dead:false,target:null,previous:null});delete h.respawnAt}}continue}
   h.cool=Math.max(0,h.cool-dt);
   if(h.lock>0){h.lock-=dt;if(h.lock<=0)h.dash=1.1;continue}
   if(h.dash>0){h.dash-=dt;l2Move(h,dt,4.2,()=>l2Cell(player));continue}
   if(h.cool===0&&distance(h,player)<4.5){const c=l2Cell(h),p=l2Cell(player),d=l2Distances(c.x,c.y).get(l2Key(p.x,p.y));
    if(d!==undefined&&d<=5){h.lock=.8;h.cool=3.5+Math.random()*1.5;l5Hint('hacker','👾 HACKER LOCKED ON! It dashes after the red glare');continue}}
   l2Move(h,dt,1.0,()=>Math.random()<.3?l2Cell(player):null);
  }else if(h.type==='promo'&&!h.dead){
   l2Move(h,dt,1.3,()=>Math.random()<.65?l2Cell(player):null);
  }
 }
}

// ---- Stages and surprises ---------------------------------------------------
function startUrgentStage(){
 const s=l5;s.stage=2;s.nextSpecial=Math.min(s.nextSpecial,3);
 l5Bubble('🚨 URGENT!');arcadeSound('mode');
 showPowerText('🚨 ZACK IS IN URGENT MODE! Alarms are on. Watch for 🌐 shockwaves (outrun them or use 👻 Ghost Mode)');
 speak('zack',true,'attack',2);
}
function startPromoSurprise(){
 const s=l5;s.stage=3;s.special=null;s.targets=[];s.nextSpecial=4;
 const z=enemies[0];
 for(const e of enemies){e.stun=Math.max(e.stun||0,1.5);e.charge=0} // a beat to read the surprise
 if(z){burst(z.x*T,z.y*T,'#ffcf5a',36,1.4);
  // The four promos pop out around Zack and start chasing Diego.
  const c=l2Cell(z),dist=l2Distances(c.x,c.y);
  const around=[...dist.entries()].filter(([,d])=>d>=1&&d<=3).map(([k])=>({x:k%COLS+.5,y:Math.floor(k/COLS)+.5}));
  L5_PROMOS.forEach((pr,i)=>{const p=around.length?around[(i*3)%around.length]:{x:z.x,y:z.y};
   hazards.push({...p,type:'promo',icon:pr.icon,promo:pr.name,phase:Math.random()*6.28,dir:[1,0],turn:0,speed:1.3})});
 }
 l5Bubble('🎁 SURPRISE PROMOS!');arcadeSound('mode');
 showPowerText('🔑 KEY FOUND! 🎁 SURPRISE PROMO PROJECT: 📝 Product Registration, 📶 Signal, 🎟️ Sweepstakes and ⭐ Reviews are chasing you. RUN!');
 speak('zack',true,'attack',5);
 setTimeout(()=>{if(phase==='playing'&&level===4&&l5&&l5.stage===3)speak('zack',true,'attack',4)},5200);
}

// ---- Zack ---------------------------------------------------------------------
const L5_SPECIALS={1:['urgent'],2:['urgent','explain','domain'],3:['domain','urgent','explain']};
function levelFiveBosses(dt){
 const s=l5,pc=()=>l2Cell(player);
 for(const e of enemies){
  e.stun=Math.max(0,(e.stun||0)-dt);
  if(s.special){s.special.t-=dt;
   if(e.stun>0){s.special=null;e.charge=0;s.nextSpecial=s.stage===3?5.5:8;showPowerText('💫 REQUEST CANCELLED! Zack is stunned');score+=25}
   else{e.charge=Math.max(0,s.special.t);if(s.special.t<=0){zackSpecial(s.special.kind,e);s.special=null;e.charge=0;s.nextSpecial=(s.stage===3?5.5:s.stage===2?7.5:10)+Math.random()*1.5}}
  }else{s.nextSpecial-=dt;
   if(s.nextSpecial<=0&&e.stun<=0){const list=L5_SPECIALS[s.stage],kind=list[s.specialIdx++%list.length];s.special={kind,t:L5_WINDUP};e.charge=L5_WINDUP;
    l5Bubble({urgent:'🚨 URGENT!',explain:'❓ EXPLAIN THIS!',domain:'🌐 DOMAIN DOWN AGAIN!'}[kind]);arcadeSound('mode');
    speak('zack',true,'attack',{urgent:2,explain:0,domain:3}[kind]);}
  }
  if(e.stun>0)continue;
  if(e.charge>0){if(distance(e,player)<.66)hit('boss');continue}
  const speed=s.stage===3?1.9:s.stage===2?1.35:1.1;
  l2Move(e,dt,speed,()=>{
   if(s.stage===3||distance(e,player)<6||Math.random()<(s.stage===2?.6:.4))return pc();
   const g=l5Goal();return Math.abs(Math.floor(e.x)-g.x)+Math.abs(Math.floor(e.y)-g.y)>2?g:pc();
  });
  e.shot-=dt;
  if(e.shot<=0&&!s.special){
   e.shot=(s.stage===3?2.1:s.stage===2?2.6:3.2)+Math.random()*.7;
   if(Math.random()<.45)speak('zack',false,'attack',1);
   const a=Math.atan2(player.y-e.y,player.x-e.x);
   projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,name:'zack',icon:'🚨',life:5});
  }
  if(distance(e,player)<.66)hit('boss');
 }
}
function zackSpecial(kind,e){
 const s=l5;
 if(kind==='urgent'){
  const p=l2Cell(player),dist=l2Distances(p.x,p.y);
  const around=[...dist.entries()].filter(([,d])=>d>=2&&d<=3).map(([k])=>({x:k%COLS,y:Math.floor(k/COLS)})).sort(()=>Math.random()-.5).slice(0,2);
  for(const c of [p,...around])s.targets.push({x:c.x+.5,y:c.y+.5,t:1.4,max:1.4});
  showPowerText('🚨 URGENT PINGS! Get off the red circles');
 }else if(kind==='explain'){
  const base=Math.atan2(player.y-e.y,player.x-e.x);
  for(let i=-2;i<=2;i++){const a=base+i*.22;projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,name:'zack',icon:'❓',life:5})}
  showPowerText('❓ "Explain exactly what happened here!" Dodge the questions');
 }else{
  s.rings.push({x:e.x,y:e.y,r:.3,max:7,speed:3.1,hit:false});
  showPowerText('🌐 CUSTOM DOMAIN DOWN! Shockwave incoming: outrun it or use 👻 Ghost Mode');
 }
}

// ---- HUD objective text (existing objective box in the sidebar) -------------
function levelFiveQuest(){
 if(!l5)return '';
 const n=l5Fixed();
 if(n<l5.incidents.length){const left=l5.incidents.filter(it=>!it.fixed).map(it=>it.icon).join(' ');
  return `🚨 <b>INCIDENTS ${n}/${l5.incidents.length}</b> · Fix ${left} to unlock the key`}
 if(!hasGoldenKey)return '🔑 <b>KEY UNLOCKED</b> · Grab the golden key';
 return '🚪 <b>ESCAPE BRIJ!</b> · Reach the exit!';
}

// ---- Cutscenes (Level 1's cutscene panels) -----------------------------------
function renderLevelFiveIntro(){
 if(levelFiveSceneStep===0){
  show(`<div class="scene-label">BRIJ FAREWELL ARCADE · FINAL EPISODE</div><h2>THE FINAL DEPLOYMENT</h2><div class="scene-people">${scenePortrait('zack')}</div><div class="scene-card"><p class="scene-quote">Tickets closed. Sprints planned. Release shipped. Handover done. Only one person stands between Diego and the door: Zack, the CTO.</p></div><small>LEVEL 5 · ZACK, THE FINAL BOSS</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelFiveSceneStep=1;renderLevelFiveIntro()},true,beginLevelFive);
 }else if(levelFiveSceneStep===1){
  show(`<div class="scene-label">A MESSAGE FROM THE CTO</div><div class="scene-people">${scenePortrait('zack')}${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">ZACK: “${QUOTES.zack.intro[0]}”</p><p class="scene-quote">ZACK: “${QUOTES.zack.attack[2]}”</p></div><small>The CTO has entered the chat. Diego's calendar: suddenly full.</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelFiveSceneStep=2;renderLevelFiveIntro()},true,beginLevelFive);
 }else{
  show(`<div class="scene-label">DIEGO HAS ONE LAST PLAN</div><div class="scene-people">${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.diego.attack[0]}”</p></div><h2>FINAL MISSION: ESCAPE BRIJ!</h2><p>🚨 Fix 2 production incidents to unlock the 🔑 golden key · 🔑 Grab it · 🚪 Escape</p><small>Use everything you learned: 👻 Ghost Mode through 🌐 shockwaves · 🩴 stun Zack to cancel his requests · 🔥 vents, 👾 hackers and a surprise are waiting</small>`);
  sceneButtons('▶ BEGIN THE FINAL LEVEL',beginLevelFive,false);
 }
}
function beginLevelFive(){
 if(level!==4)return;
 phase='playing';hide();dialogueCooldown=2.2;
 document.getElementById('dialogue').style.display='none';updateUI();
 showPowerText('🔒 The golden key is locked. Fix the 2 🚨 production incidents to unlock it');
 setTimeout(()=>{if(phase==='playing'&&level===4)speak('zack',true,'intro',0)},900);
}
function levelFiveVictoryScene(){
 phase='victoryScene';victoryFanfare();
 const palette=['#c77aff','#ffda65','#ff6b91','#7ff5ea','#8dffc0'];
 const confetti=Array.from({length:60},(_,i)=>{
  const left=(i*47+13)%100,delay=(i*0.19)%2.4,duration=3.1+(i%7)*0.33;
  return `<i class="victory-confetti" style="--x:${left}%;--delay:${delay}s;--duration:${duration}s;--tilt:${(i%2?1:-1)*(35+i%5*17)}deg;--color:${palette[i%palette.length]}"></i>`;
 }).join('');
 const bursts=Array.from({length:3},(_,j)=>`<div class="victory-firework firework-${j+1}">${Array.from({length:12},(_,i)=>`<b style="--angle:${i*30}deg;--distance:${62+j*20}px;--delay:${j*.35}s"></b>`).join('')}</div>`).join('');
 show(`<div class="victory-experience"><div class="victory-particles" aria-hidden="true">${confetti}${bursts}</div><div class="victory-orbit" aria-hidden="true"></div><div class="victory-kicker"><span class="victory-status-light"></span> FINAL MISSION COMPLETE <span class="victory-separator">/</span> DEPLOYMENT APPROVED</div><div class="victory-medal" aria-hidden="true">🏆</div><h2 class="victory-headline">DIEGO HAS<br><em>ESCAPED BRIJ!</em></h2><div class="victory-ribbon"><span>🚨 FINAL BOSS</span><strong>DEFEATED</strong><span>✈️ FREEDOM</span></div><div class="victory-faceoff">${scenePortrait('zack')}<div class="victory-vs">VS <span>✓</span></div><div class="scene-person reaction-person"><img class="reaction-gif" src="${REACTIONS.happy}" alt="Diego laughing"><span>DIEGO</span></div></div><div class="victory-conversation"><p><b>ZACK</b><span>“${QUOTES.zack.defeated[0]}”</span></p></div><div class="victory-tagline">One agenda item left.</div><div class="victory-next-label">17 NOV 2026 · AGENDA ITEM</div></div>`);
 sceneButtons('🤖 OPEN: DIEGO SUCCESSION PLAN',levelFiveResults,false);
 panel.classList.add('victory-panel');
}
function levelFiveResults(){
 phase='win';if(!unlocked.includes(4))unlocked.push(4);updateUI();
 const stars=clock<300?3:clock<400?2:1;
 show(`<div class="cinematic-kicker">FINAL BOSS DEFEATED · DIEGO AI 5 / 5</div><h2 class="cinematic-title">LEVEL 5 CLEARED!</h2><div class="cinematic-sparkles">${'★'.repeat(stars)}</div><div class="cinematic-stats"><div><strong>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,'0')}</strong><span>ESCAPE TIME</span></div><div><strong>${health}%</strong><span>HEALTH LEFT</span></div><div><strong>${score}</strong><span>FINAL SCORE</span></div></div><div class="cinematic-skill"><div class="cinematic-kicker">🤖 DIEGO AI MODULE INSTALLED</div><h2>✓ AI LEADERSHIP</h2><p>Stays calm through URGENT pings, explains exactly what happened, and somehow ships every promo.</p><b style="color:#90ffb5">BUILD PROGRESS: 5 / 5 MODULES</b></div>`);
 sceneButtons('🤖 INITIALIZE DIEGO AI',successionPlan,false);
}

// ---- Diego Succession Plan (Zack's agenda item, 17 Nov 2026) ----------------
function successionPlan(){
 phase='final';
 const modules=LEVELS.map((l,i)=>`<div class="succession-module" style="--d:${.35+i*.45}s"><span>${['🎫','📅','🐞','📘','🚨'][i]}</span><b>${l.skill}</b><em>INSTALLED</em></div>`).join('');
 show(`<div class="succession"><div class="cinematic-kicker">MEETING AGENDA · 17 NOV 2026 · ITEM 1</div><h2 class="succession-title">DIEGO SUCCESSION PLAN</h2><div class="succession-bot" aria-hidden="true">🤖</div><div class="succession-modules">${modules}</div><div class="succession-bar"><i></i></div><div class="succession-status"><b>DIEGO AI v1.0: ONLINE</b><span>All five skill modules installed. Running first task...</span></div><div class="succession-test"><p><b>DIEGO AI:</b> “${QUOTES.diego.attack[0]}”</p><p class="succession-error"><b>REPLACEMENT CONFIDENCE: 0%</b><br>ERROR: Original Diego is irreplaceable. 💜</p></div></div>`);
 sceneButtons('💜 OPEN THE MEMORY WALL',memoryWall,false);
 panel.classList.add('finale-panel');
}

// ---- Memory Wall --------------------------------------------------------------
function memoryWall(){
 phase='final';
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const line=p=>p.message||(p.id==='diego'?QUOTES.diego.intro[0]:(QUOTES[p.id]?.defeated?.[0]||''));
 const cards=MEMORIES.people.map((p,i)=>`<figure class="memory-card${p.id==='diego'?' memory-hero':''}" style="--d:${i*.08}s"><img src="${PHOTOS[p.id]}" alt="${esc(p.name)}"><figcaption><b>${esc(p.name)}</b><small>${esc(p.role)}</small><q>${esc(line(p))}</q></figcaption></figure>`).join('');
 const shots=(MEMORIES.screenshots||[]).map(s=>`<figure class="memory-shot"><img src="${esc(s.src)}" alt="${esc(s.caption||'')}"><figcaption>${esc(s.caption||'')}</figcaption></figure>`).join('');
 show(`<div class="memory-wall"><div class="cinematic-kicker">THANK YOU, DIEGO</div><h2 class="memory-title">💜 THE MEMORY WALL</h2><p class="memory-intro">Thanks for the fixes, the experiments, the teamwork, and every time you showed up for Brij. We wish you the very best on your next adventure!</p><div class="memory-grid">${cards}</div>${shots?`<div class="memory-shots">${shots}</div>`:''}<p class="memory-farewell"><b>DIEGO:</b> “${QUOTES.diego.defeated[0]}”</p><div class="memory-end">GAME COMPLETE · EXIT APPROVED ✈️</div></div>`);
 sceneButtons('↻ PLAY AGAIN FROM LEVEL 1',()=>{score=0;unlocked=[];startLevel(0)},false);
 panel.classList.add('finale-panel');
}
