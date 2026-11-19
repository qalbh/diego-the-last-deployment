// Level 3 art: "Production on Fire", a red-magenta server floor on release night.
// Same character bodies, real photo faces, creatures, items and exit door as
// Levels 1 and 2. For speed, the walls use flat fills and a sharp offset shadow
// (no per-tile blur or gradient, the two most expensive canvas effects).

Object.assign(BOSS_JACKETS,{zoofi:['#e7a2ff','#8a3fb5'],sush:['#8fe3ff','#2f6fa8'],arqam:['#9dffb8','#2f8a5a']});

function levelThreeSky(){
 const W=cv.width,H=cv.height;
 const sky=ctx.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,'#0b0312');sky.addColorStop(.5,'#1c0620');sky.addColorStop(.85,'#3a0a22');sky.addColorStop(1,'#5a1426');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 for(const st of NIGHT.stars){
  ctx.globalAlpha=.25+.4*(.5+.5*Math.sin(clock*st.speed+st.phase));
  ctx.fillStyle=st.big?'#ffe0e8':'#ff9fb8';const size=st.big?2:1.2;ctx.fillRect(st.x,st.y,size,size);
 }
 ctx.globalAlpha=1;
 // A rotating red alarm beacon where Level 1's moon was.
 const bx=952,by=100,spin=clock*2.4,pulse=.5+.5*Math.sin(clock*6);
 ctx.fillStyle=`rgba(255,40,80,${.08+.06*pulse})`;ctx.beginPath();ctx.arc(bx,by,70,0,7);ctx.fill();
 ctx.fillStyle='rgba(255,70,100,.16)';
 for(const off of [0,Math.PI]){ctx.beginPath();ctx.moveTo(bx,by);ctx.arc(bx,by,95,spin+off-.28,spin+off+.28);ctx.closePath();ctx.fill()}
 ctx.fillStyle='#2a0b18';ctx.fillRect(bx-20,by+12,40,9);
 ctx.fillStyle=pulse>.5?'#ff3d5e':'#c4203f';ctx.beginPath();ctx.arc(bx,by+12,17,Math.PI,0);ctx.fill();
 ctx.fillStyle='#ffd0da';ctx.beginPath();ctx.arc(bx-5,by+5,4,0,7);ctx.fill();
 // City skyline in the side margins, amber and alarm-red windows.
 for(const b of NIGHT.skyline){ctx.fillStyle='#12040e';ctx.fillRect(b.x,H-b.h,b.w,b.h);ctx.fillStyle='#4a1030';ctx.fillRect(b.x,H-b.h,b.w,2)}
 for(const warm of [true,false]){
  ctx.fillStyle=warm?'#ffb36b':'#ff5a6e';
  for(const b of NIGHT.skyline)for(const wn of b.wins)if(wn.warm===warm){ctx.globalAlpha=.45+.35*Math.sin(clock*(warm?.7:2.2)+wn.phase);ctx.fillRect(wn.x,wn.y,3,5)}
 }
 // Embers drifting up the side margins.
 for(let i=0;i<14;i++){
  const x=i<7?14+i*13+Math.sin(clock+i)*5:906+(i-7)*13+Math.sin(clock+i)*5,y=H+20-((i*97+clock*(24+i%5*7))%(H+40));
  ctx.globalAlpha=.35+.35*Math.sin(clock*7+i);ctx.fillStyle=i%2?'#ffb347':'#ff6a3d';ctx.fillRect(x,y,2.5,2.5);
 }
 ctx.globalAlpha=1;
 ctx.font='900 17px system-ui';ctx.fillStyle='#ff3d6a55';ctx.fillText('BRIJ  /  RELEASE DAY',14,30);ctx.fillText('BRIJ  /  RELEASE DAY',16,32);
 ctx.fillStyle='#ff9fb4';ctx.fillText('BRIJ  /  RELEASE DAY',15,31);
}

function levelThreeTile(x,y,isWall){
 const px=x*T,py=y*T;
 if(!isWall){
  ctx.fillStyle=(x+y)%2?'#1f0f1f':'#251227';ctx.fillRect(px,py,T,T);
  ctx.fillStyle='#ffffff06';ctx.fillRect(px+2,py+2,T-4,1);
  ctx.strokeStyle='#ff9ec412';ctx.lineWidth=.7;ctx.strokeRect(px+.5,py+.5,T-1,T-1);
  if((x*7+y*3)%13===0){ctx.fillStyle='#ff5a8a1c';ctx.fillRect(px+6,py+T/2,T-12,2)}
  return;
 }
 // Server racks: sharp drop shadow, side, face, top light, then rack details.
 ctx.fillStyle='#08020a';ctx.fillRect(px+1,py+6,T-1,T-3);
 ctx.fillStyle='#3b0f2a';ctx.fillRect(px+2,py+4,T-3,T-5);
 ctx.fillStyle='#66203f';rr(px+2,py+1,T-4,T-7,4);ctx.fill();
 ctx.fillStyle='#ff9cc555';rr(px+4,py+3,T-8,3,2);ctx.fill();
 ctx.fillStyle='#2a0a1ea9';ctx.fillRect(px+4,py+T-8,T-8,3);
 ctx.strokeStyle='#ffb0d244';ctx.lineWidth=1;rr(px+3.5,py+2.5,T-7,T-8,3);ctx.stroke();
 const design=(x*13+y*7)%9;
 if(design<4){ // rack slots with blinking status lights
  ctx.fillStyle='#2b0b20';ctx.fillRect(px+8,py+10,T-16,3);ctx.fillRect(px+8,py+16,T-16,3);ctx.fillRect(px+8,py+22,T-16,3);
  ctx.fillStyle=Math.sin(clock*(2.5+design)+x*1.7+y)>0?'#5dffa0':'#1d3b2a';ctx.fillRect(px+T-13,py+10,3,3);
  ctx.fillStyle=Math.sin(clock*(4+design)+y*2.3)>.4?'#ff4d6d':'#3a1420';ctx.fillRect(px+T-13,py+16,3,3);
 }else if(design===4){ // monitor showing a red error
  ctx.fillStyle='#14050f';rr(px+9,py+8,22,15,2);ctx.fill();
  ctx.strokeStyle=Math.sin(clock*5+x)>-.3?'#ff4d6d':'#7a2238';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(px+16,py+11);ctx.lineTo(px+24,py+19);ctx.moveTo(px+24,py+11);ctx.lineTo(px+16,py+19);ctx.stroke();
 }else if(design===6){ // build status panel: two green checks and one failing red bar
  ctx.fillStyle='#14050f';rr(px+8,py+8,24,16,2);ctx.fill();
  ctx.fillStyle='#3ddc84';ctx.fillRect(px+11,py+11,12,2);ctx.fillRect(px+11,py+15,9,2);
  ctx.fillStyle=Math.sin(clock*4+x+y)>0?'#ff4d6d':'#8a2238';ctx.fillRect(px+11,py+19,15,2);
 }
}

function levelThreeVent(v){
 const cx=Math.floor(v.x)*T+T/2,cy=Math.floor(v.y)*T+T/2,st=l3VentState(v);
 ctx.save();
 ctx.fillStyle='#140810';rr(cx-15,cy-15,30,30,5);ctx.fill();ctx.strokeStyle='#5a2a3a';ctx.lineWidth=1.5;ctx.stroke();
 ctx.fillStyle='#2c1420';for(let k=0;k<4;k++)ctx.fillRect(cx-11,cy-10+k*6,22,3);
 if(st==='warn'){
  ctx.globalAlpha=.45+.45*Math.sin(clock*30);ctx.strokeStyle='#ff9a3c';ctx.lineWidth=2.5;rr(cx-15,cy-15,30,30,5);ctx.stroke();
  for(let k=0;k<3;k++){const ph=(clock*1.6+k/3)%1;ctx.globalAlpha=.4*(1-ph);ctx.fillStyle='#d8c8d0';ctx.beginPath();ctx.arc(cx-7+k*7,cy-2-ph*18,3+ph*4,0,7);ctx.fill()}
 }else if(st==='fire'){
  const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,24);glow.addColorStop(0,'rgba(255,140,40,.75)');glow.addColorStop(1,'rgba(255,60,40,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,24,0,7);ctx.fill();
  for(let k=-1;k<=1;k++){const h=16+6*Math.sin(clock*18+k*2),fx=cx+k*8;
   for(const [col,sc] of [['#ff6a1a',1],['#ffd45a',.55]]){ctx.fillStyle=col;ctx.beginPath();
    ctx.moveTo(fx-6*sc,cy+9);ctx.quadraticCurveTo(fx-6*sc,cy+9-h*.6*sc,fx,cy+9-h*sc);ctx.quadraticCurveTo(fx+6*sc,cy+9-h*.6*sc,fx+6*sc,cy+9);ctx.fill()}}
 }
 ctx.restore();
}

function levelThreeItem(it){
 // A release checklist card (clipboard) with its icon and a pulsing ring.
 const x=it.x*T,y=it.y*T+Math.sin(clock*4+it.x)*2;
 ring(x,y,'#7dffb2',(clock*.8+it.x)%1,15);
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#0b2a1c';rr(-12,-12,26,28,4);ctx.fill();
 ctx.fillStyle='#f3eefb';rr(-13,-14,26,28,4);ctx.fill();ctx.strokeStyle='#5dffb0';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#2fcf88';ctx.fillRect(-13,-14,26,6);ctx.fillStyle='#14523a';rr(-5,-17,10,5,2);ctx.fill();
 ctx.font='14px serif';ctx.textAlign='center';ctx.fillText(it.icon,0,9);
 ctx.restore();
}

function levelThreeLockedKey(){
 // The golden key waits from the start behind a padlock, with one slot per
 // checklist item that lights up as Diego ticks them off.
 const k=l3.keySpot,x=k.x*T,y=k.y*T,pulse=.5+.5*Math.sin(clock*3);
 ctx.save();
 const halo=ctx.createRadialGradient(x,y,4,x,y,30);halo.addColorStop(0,`rgba(255,215,110,${.35+.2*pulse})`);halo.addColorStop(1,'rgba(255,215,110,0)');
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,30,0,7);ctx.fill();
 ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.lineDashOffset=-clock*8;ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.restore();
 ctx.save();ctx.globalAlpha=.8;levelOneCollectible(x,y,'key');ctx.restore();
 ctx.save();
 ctx.fillStyle='#6a1f47';rr(x+2,y+2,17,14,3);ctx.fill();ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.arc(x+10.5,y+2,4.6,Math.PI,0);ctx.stroke();ctx.fillStyle='#ffe18b';ctx.beginPath();ctx.arc(x+10.5,y+8,2,0,7);ctx.fill();ctx.fillRect(x+9.7,y+8,1.6,4);
 const n=l3.items.length;
 for(let i=0;i<n;i++){ctx.fillStyle=l3.items[i].taken?'#5dffb0':'#ffffff40';ctx.strokeStyle='#1b0f1f';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x-6*(n-1)+i*12,y-24,4,0,7);ctx.fill();ctx.stroke()}
 ctx.restore();
}

function levelThreeDrop(d){
 // Zoofi's filed bug: a red circle that tightens until the crash lands.
 const f=Math.max(0,d.t/d.max),x=d.x*T,y=d.y*T,pulse=.5+.5*Math.sin(clock*16);
 ctx.save();
 ctx.fillStyle=`rgba(255,60,100,${.12+.14*(1-f)+.08*pulse})`;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();
 ctx.strokeStyle='#ff5d7a';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);ctx.lineDashOffset=clock*20;
 ctx.beginPath();ctx.arc(x,y,12+22*f,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#ffd0da';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.stroke();
 ctx.globalAlpha=Math.min(1,1.4-f);ctx.font='18px serif';ctx.textAlign='center';ctx.fillText('🐞',x,y+6-f*34);
 ctx.restore();
}

function levelThreeCharge(e){
 // Wind-up ring under a boss who is about to act in the release chain.
 const col=L3_COLORS[e.name],f=1-e.charge/L3_WINDUP;
 ctx.save();ctx.globalAlpha=.35+.25*Math.sin(clock*20);ctx.fillStyle=col;ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,24,0,7);ctx.fill();
 ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,27,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();
 ctx.restore();
}

function levelThreeBubble(){
 const b=l3.bubble;if(!b||b.time<=0)return;
 const e=l3Boss(b.name);if(!e)return;
 ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';
 const w=Math.max(91,ctx.measureText(b.text).width+18),px=Math.max(w/2+4,Math.min(L3.W*T-w/2-4,e.x*T)),py=Math.max(30,e.y*T-43);
 ctx.globalAlpha=Math.min(1,b.time*3);
 ctx.fillStyle={zoofi:'#6a1f8a',sush:'#14506e',arqam:'#7a5a12'}[b.name];ctx.strokeStyle=L3_COLORS[b.name];ctx.lineWidth=1.6;
 rr(px-w/2,py-21,w,25,8);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(px-5,py+4);ctx.lineTo(px,py+10);ctx.lineTo(px+5,py+4);ctx.fill();
 ctx.fillStyle='#fff';ctx.fillText(b.text,px,py-5);ctx.restore();
}

function drawLevelThree(){
 levelThreeSky();
 if(!grid||!player||!l3)return;
 ctx.save();ctx.translate(L3.OX,L3.OY);ctx.scale(L3.SCALE,L3.SCALE);
 for(let y=0;y<L3.H;y++)for(let x=0;x<L3.W;x++)levelThreeTile(x,y,grid[y][x]===1);
 for(const v of l3.vents)levelThreeVent(v);
 for(const c of coins){ctx.fillStyle='#ffcf7a';ctx.beginPath();ctx.arc(c.x*T,c.y*T,4+Math.sin(clock*5+c.x)*1.2,0,Math.PI*2);ctx.fill()}
 for(const it of l3.items)if(!it.taken)levelThreeItem(it);
 if(goldenKey&&!hasGoldenKey)levelOneCollectible(goldenKey.x*T,goldenKey.y*T,'key');else if(!hasGoldenKey)levelThreeLockedKey();
 for(const p of pickups)levelOneCollectible(p.x*T,p.y*T,p.type);
 for(const d of l3.drops)levelThreeDrop(d);
 for(const h of hazards)if(!h.dead){
  if(h.blocker){ctx.save();ctx.globalAlpha=.55+.25*Math.sin(clock*9);ctx.strokeStyle='#ff4d6d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x*T,h.y*T,15,0,7);ctx.stroke();ctx.restore()}
  levelOneCreature(h);
 }
 levelOneExit();
 drawEffects();
 for(const e of enemies){
  if(e.charge>0&&e.stun<=0)levelThreeCharge(e);
  else if(l3.live){ctx.save();const g=ctx.createRadialGradient(e.x*T,e.y*T-10,4,e.x*T,e.y*T-10,26);g.addColorStop(0,'rgba(255,140,60,.55)');g.addColorStop(1,'rgba(255,90,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x*T,e.y*T-10,26,0,7);ctx.fill();ctx.restore()}
  levelOneCharacter(e.name,e.x*T,e.y*T,false);
  if(e.stun>0){ctx.save();ctx.font='14px serif';ctx.textAlign='center';ctx.fillText('💫',e.x*T+Math.sin(clock*6)*8,e.y*T-34);ctx.restore()}
 }
 levelThreeBubble();
 for(const t of throws){ctx.save();ctx.translate(t.x*T,t.y*T);ctx.rotate(Math.atan2(t.vy,t.vx)+clock*12);ctx.strokeStyle='#ffde91';ctx.globalAlpha=.65;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(-7,0);ctx.stroke();ctx.globalAlpha=1;ctx.font='25px serif';ctx.fillText('🩴',-12,8);ctx.restore()}
 // Enemy attacks fly through interior walls but are clipped to the maze frame.
 ctx.save();ctx.beginPath();ctx.rect(0,0,L3.W*T,L3.H*T);ctx.clip();
 ctx.font='21px serif';
 for(const p of projectiles){
  const icon={zoofi:'🐛',sush:'📨',arqam:'🔁'}[p.name]||'📋';
  if(p.boomerang){ctx.save();ctx.translate(p.x*T,p.y*T);ctx.rotate(clock*9);ctx.fillText(icon,-12,8);ctx.restore()}
  else ctx.fillText(icon,p.x*T-12,p.y*T+8);
 }
 ctx.restore();
 if(player.inv===0||Math.floor(clock*12)%2===0){ctx.save();ctx.globalAlpha=ghost>0?.22:1;levelOneCharacter('diego',player.x*T,player.y*T,true);ctx.restore()}
 if(ghost>0){ctx.save();ctx.globalAlpha=.4+.12*Math.sin(clock*13);ring(player.x*T,player.y*T,'#72e2ff',ghost/GHOST_TIME,24);ctx.font='22px serif';ctx.fillText('👻',player.x*T-10,player.y*T-23);ctx.restore()}
 if(shield>0){ctx.strokeStyle='#6bffbd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x*T,player.y*T,23,0,Math.PI*2);ctx.stroke()}
 ctx.restore();
 if(paused){ctx.fillStyle='#070b22bb';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='bold 50px system-ui';ctx.fillStyle='white';ctx.fillText('PAUSED',300,280)}
}
