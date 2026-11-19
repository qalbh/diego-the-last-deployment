// Level 5 art: "Final Deployment", a purple executive floor with red alarms.
// Same character bodies, real photo faces, items and exit door as the earlier
// levels; returning hazards reuse their earlier art (Level 3 vents, Level 1
// creatures, Level 4 hackers). Walls use the cheap flat style (no per-tile blur).

Object.assign(BOSS_JACKETS,{zack:['#c77aff','#5a2aa8']});

function levelFiveSky(){
 const W=cv.width,H=cv.height,alarm=l5&&l5.stage>=2;
 const sky=ctx.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,'#08031a');sky.addColorStop(.5,'#1a0838');sky.addColorStop(.85,'#320f52');sky.addColorStop(1,'#4a1450');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 for(const st of NIGHT.stars){
  ctx.globalAlpha=.25+.45*(.5+.5*Math.sin(clock*st.speed+st.phase));
  ctx.fillStyle=st.big?'#fff3d8':'#d6b8ff';const size=st.big?2:1.2;ctx.fillRect(st.x,st.y,size,size);
 }
 ctx.globalAlpha=1;
 // Two searchlights sweeping the sky (red once the alarms are on).
 for(const [bx,sp] of [[40,.5],[960,-.6]]){
  const a=-Math.PI/2+Math.sin(clock*sp)*.55;
  ctx.fillStyle=alarm?'rgba(255,70,110,.10)':'rgba(220,190,255,.08)';
  ctx.beginPath();ctx.moveTo(bx,H);ctx.lineTo(bx+Math.cos(a-.06)*900,H+Math.sin(a-.06)*900);ctx.lineTo(bx+Math.cos(a+.06)*900,H+Math.sin(a+.06)*900);ctx.closePath();ctx.fill();
 }
 // Skyline with gold and violet windows.
 for(const b of NIGHT.skyline){ctx.fillStyle='#0c0420';ctx.fillRect(b.x,H-b.h,b.w,b.h);ctx.fillStyle='#3d1a6a';ctx.fillRect(b.x,H-b.h,b.w,2)}
 for(const warm of [true,false]){
  ctx.fillStyle=warm?'#ffda65':(alarm?'#ff5a7a':'#c77aff');
  for(const b of NIGHT.skyline)for(const wn of b.wins)if(wn.warm===warm){ctx.globalAlpha=.45+.35*Math.sin(clock*(alarm&&!warm?3:.7)+wn.phase);ctx.fillRect(wn.x,wn.y,3,5)}
 }
 ctx.globalAlpha=1;
 // Alarm beacons in the top corners once Zack goes URGENT.
 if(alarm){const on=Math.sin(clock*(l5.stage===3?9:6))>0;
  for(const x of [26,974]){ctx.fillStyle=on?'rgba(255,50,90,.35)':'rgba(255,50,90,.08)';ctx.beginPath();ctx.arc(x,64,30,0,7);ctx.fill();
   ctx.fillStyle=on?'#ff3d6a':'#6a1830';ctx.beginPath();ctx.arc(x,64,9,Math.PI,0);ctx.fill();ctx.fillRect(x-11,64,22,4)}}
 const title=l5&&l5.stage===3?'BRIJ  /  YOU WILL NEVER ESCAPE':'BRIJ  /  FINAL DEPLOYMENT';
 ctx.font='900 17px system-ui';ctx.fillStyle=alarm?'#ff3d6a55':'#b06cff55';ctx.fillText(title,14,30);ctx.fillText(title,16,32);
 ctx.fillStyle=alarm?'#ffb0c4':'#e3c8ff';ctx.fillText(title,15,31);
}

function levelFiveTile(x,y,isWall){
 const px=x*T,py=y*T;
 if(!isWall){
  ctx.fillStyle=(x+y)%2?'#170b2c':'#1b0e33';ctx.fillRect(px,py,T,T);
  ctx.fillStyle='#ffffff06';ctx.fillRect(px+2,py+2,T-4,1);
  ctx.strokeStyle='#c77aff12';ctx.lineWidth=.7;ctx.strokeRect(px+.5,py+.5,T-1,T-1);
  if((x*3+y*7)%13===0){ctx.fillStyle='#ffda6514';ctx.fillRect(px+8,py+T/2-1,T-16,2)}
  return;
 }
 ctx.fillStyle='#05020c';ctx.fillRect(px+1,py+6,T-1,T-3);
 ctx.fillStyle='#2a1655';ctx.fillRect(px+2,py+4,T-3,T-5);
 ctx.fillStyle='#45267f';rr(px+2,py+1,T-4,T-7,4);ctx.fill();
 ctx.fillStyle='#e3c8ff4d';rr(px+4,py+3,T-8,3,2);ctx.fill();
 ctx.fillStyle='#ffda6555';ctx.fillRect(px+4,py+T-9,T-8,1.5); // gold trim
 ctx.fillStyle='#14082ba9';ctx.fillRect(px+4,py+T-8,T-8,3);
 ctx.strokeStyle='#d6b8ff3d';ctx.lineWidth=1;rr(px+3.5,py+2.5,T-7,T-8,3);ctx.stroke();
 const design=(x*7+y*13)%11;
 if(design<3){ // boardroom monitor with a chart
  ctx.fillStyle='#0c0420';rr(px+9,py+8,22,15,2);ctx.fill();
  ctx.strokeStyle='#ffda65';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px+11,py+20);ctx.lineTo(px+16,py+15);ctx.lineTo(px+21,py+17);ctx.lineTo(px+28,py+10);ctx.stroke();
 }else if(design===5){ // alarm light, flashing once Zack goes URGENT
  const on=l5&&l5.stage>=2&&Math.sin(clock*7+x+y)>0;
  ctx.fillStyle=on?'#ff3d6a':'#4a1a3a';ctx.beginPath();ctx.arc(px+20,py+16,5,Math.PI,0);ctx.fill();ctx.fillRect(px+14,py+16,12,3);
 }else if(design===8){ // a framed Brij logo plate
  ctx.strokeStyle='#ffda6588';ctx.lineWidth=1.2;rr(px+11,py+9,18,13,2);ctx.stroke();ctx.fillStyle='#c77aff';ctx.beginPath();ctx.arc(px+20,py+15.5,3.5,0,7);ctx.fill();
 }
}

function levelFiveIncident(it){
 // A server with a flashing red alarm: touch it to fix the incident.
 const x=it.x*T,y=it.y*T,on=Math.sin(clock*8+it.x)>0;
 ring(x,y,'#ff5d7a',(clock*.9+it.x)%1,16);
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#0c0420';rr(-12,-11,25,27,4);ctx.fill();
 ctx.fillStyle='#2a1655';rr(-13,-13,26,26,4);ctx.fill();ctx.strokeStyle=on?'#ff5d7a':'#8a3050';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle=on?'#ff3d6a':'#6a1830';ctx.beginPath();ctx.arc(0,-13,5,Math.PI,0);ctx.fill();
 ctx.font='14px serif';ctx.textAlign='center';ctx.fillText(it.icon,0,8);
 ctx.restore();
}

function levelFiveLockedKey(){
 const k=l5.keySpot,x=k.x*T,y=k.y*T,pulse=.5+.5*Math.sin(clock*3);
 ctx.save();
 const halo=ctx.createRadialGradient(x,y,4,x,y,30);halo.addColorStop(0,`rgba(255,215,110,${.35+.2*pulse})`);halo.addColorStop(1,'rgba(255,215,110,0)');
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,30,0,7);ctx.fill();
 ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.lineDashOffset=-clock*8;ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.restore();
 ctx.save();ctx.globalAlpha=.8;levelOneCollectible(x,y,'key');ctx.restore();
 ctx.save();
 ctx.fillStyle='#45267f';rr(x+2,y+2,17,14,3);ctx.fill();ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.arc(x+10.5,y+2,4.6,Math.PI,0);ctx.stroke();ctx.fillStyle='#ffe18b';ctx.beginPath();ctx.arc(x+10.5,y+8,2,0,7);ctx.fill();ctx.fillRect(x+9.7,y+8,1.6,4);
 const n=l5.incidents.length;
 for(let i=0;i<n;i++){ctx.fillStyle=l5.incidents[i].fixed?'#5dffb0':'#ffffff40';ctx.strokeStyle='#0c0420';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x-6*(n-1)+i*12,y-24,4,0,7);ctx.fill();ctx.stroke()}
 ctx.restore();
}

function levelFiveTarget(t){
 const f=Math.max(0,t.t/t.max),x=t.x*T,y=t.y*T;
 ctx.save();
 ctx.fillStyle=`rgba(255,60,100,${.12+.18*(1-f)})`;ctx.beginPath();ctx.arc(x,y,32,0,7);ctx.fill();
 ctx.strokeStyle='#ff5d7a';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);ctx.lineDashOffset=clock*20;ctx.beginPath();ctx.arc(x,y,10+22*f,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#ffd0da';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,32,0,7);ctx.stroke();
 ctx.globalAlpha=Math.min(1,1.4-f);ctx.font='16px serif';ctx.textAlign='center';ctx.fillText('🚨',x,y+6);
 ctx.restore();
}

function levelFiveRing(r){
 // DOMAIN DOWN shockwave: a bright expanding ring (it passes through walls).
 const x=r.x*T,y=r.y*T,rad=r.r*T,fade=Math.max(0,1-r.r/r.max);
 ctx.save();
 ctx.globalAlpha=.25*fade;ctx.strokeStyle='#ff3d6a';ctx.lineWidth=18;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.stroke();
 ctx.globalAlpha=.9*fade;ctx.strokeStyle='#ffd0da';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.stroke();
 ctx.globalAlpha=.6*fade;ctx.font='16px serif';ctx.textAlign='center';
 for(let i=0;i<6;i++){const a=i*Math.PI/3+clock;ctx.fillText('🌐',x+Math.cos(a)*rad,y+Math.sin(a)*rad+5)}
 ctx.restore();
}

function levelFivePromo(h){
 // A promo bot: a little card with the promo's icon, bobbing as it chases.
 const x=h.x*T,y=h.y*T+Math.sin(clock*7+h.phase)*2;
 ctx.save();
 ctx.fillStyle='#010608aa';ctx.beginPath();ctx.ellipse(x,y+14,12,4,0,0,7);ctx.fill();
 ctx.fillStyle='#ffda65';rr(x-13,y-13,26,24,6);ctx.fill();ctx.strokeStyle='#fff6d0';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#5a2aa8';ctx.fillRect(x-13,y-13,26,5);
 ctx.font='14px serif';ctx.textAlign='center';ctx.fillText(h.icon,x,y+6);
 ctx.restore();
}

function levelFiveCharge(e){
 const f=1-e.charge/L5_WINDUP;
 ctx.save();ctx.globalAlpha=.35+.25*Math.sin(clock*20);ctx.fillStyle='#ff4d6d';ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,26,0,7);ctx.fill();
 ctx.globalAlpha=1;ctx.strokeStyle='#ffd0da';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,29,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();
 ctx.restore();
}

function levelFiveBubble(){
 const b=l5.bubble;if(!b||b.time<=0)return;
 const e=enemies.find(n=>n.name==='zack');if(!e)return;
 ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';
 const w=Math.max(91,ctx.measureText(b.text).width+18),px=Math.max(w/2+4,Math.min(L5.W*T-w/2-4,e.x*T)),py=Math.max(30,e.y*T-43);
 ctx.globalAlpha=Math.min(1,b.time*3);
 ctx.fillStyle='#5a1a6a';ctx.strokeStyle='#ff9be3';ctx.lineWidth=1.6;
 rr(px-w/2,py-21,w,25,8);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(px-5,py+4);ctx.lineTo(px,py+10);ctx.lineTo(px+5,py+4);ctx.fill();
 ctx.fillStyle='#fff';ctx.fillText(b.text,px,py-5);ctx.restore();
}

function drawLevelFive(){
 levelFiveSky();
 if(!grid||!player||!l5)return;
 ctx.save();ctx.translate(L5.OX,L5.OY);ctx.scale(L5.SCALE,L5.SCALE);
 for(let y=0;y<L5.H;y++)for(let x=0;x<L5.W;x++)levelFiveTile(x,y,grid[y][x]===1);
 for(const v of l5.vents)levelThreeVent(v); // Level 3's vent art; its 6s cycle matches l5VentState
 for(const c of coins){ctx.fillStyle='#ffcf7a';ctx.beginPath();ctx.arc(c.x*T,c.y*T,4+Math.sin(clock*5+c.x)*1.2,0,Math.PI*2);ctx.fill()}
 for(const it of l5.incidents)if(!it.fixed)levelFiveIncident(it);
 if(goldenKey&&!hasGoldenKey)levelOneCollectible(goldenKey.x*T,goldenKey.y*T,'key');else if(!hasGoldenKey)levelFiveLockedKey();
 for(const p of pickups)levelOneCollectible(p.x*T,p.y*T,p.type);
 for(const t of l5.targets)levelFiveTarget(t);
 for(const h of hazards){if(h.dead)continue;
  if(h.type==='hack')levelFourHacker(h);else if(h.type==='promo')levelFivePromo(h);else levelOneCreature(h)}
 levelOneExit();
 drawEffects();
 for(const e of enemies){
  if(e.charge>0&&e.stun<=0)levelFiveCharge(e);
  else if(l5.stage===3){ctx.save();const g=ctx.createRadialGradient(e.x*T,e.y*T-10,4,e.x*T,e.y*T-10,28);g.addColorStop(0,'rgba(255,70,110,.6)');g.addColorStop(1,'rgba(255,40,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x*T,e.y*T-10,28,0,7);ctx.fill();ctx.restore()}
  levelOneCharacter(e.name,e.x*T,e.y*T,false);
  if(e.stun>0){ctx.save();ctx.font='14px serif';ctx.textAlign='center';ctx.fillText('💫',e.x*T+Math.sin(clock*6)*8,e.y*T-34);ctx.restore()}
 }
 levelFiveBubble();
 for(const t of throws){ctx.save();ctx.translate(t.x*T,t.y*T);ctx.rotate(Math.atan2(t.vy,t.vx)+clock*12);ctx.strokeStyle='#ffde91';ctx.globalAlpha=.65;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(-7,0);ctx.stroke();ctx.globalAlpha=1;ctx.font='25px serif';ctx.fillText('🩴',-12,8);ctx.restore()}
 // Attacks and shockwaves pass through interior walls but are clipped to the maze frame.
 ctx.save();ctx.beginPath();ctx.rect(0,0,L5.W*T,L5.H*T);ctx.clip();
 for(const r of l5.rings)levelFiveRing(r);
 ctx.font='21px serif';for(const p of projectiles)ctx.fillText(p.icon||'🚨',p.x*T-12,p.y*T+8);
 // Red alarm wash over the arena once Zack goes URGENT (subtle, pulsing).
 if(l5.stage>=2){ctx.fillStyle=`rgba(255,40,80,${(l5.stage===3?.07:.045)*(.5+.5*Math.sin(clock*(l5.stage===3?9:6)))})`;ctx.fillRect(0,0,L5.W*T,L5.H*T)}
 ctx.restore();
 if(player.inv===0||Math.floor(clock*12)%2===0){ctx.save();ctx.globalAlpha=ghost>0?.22:1;levelOneCharacter('diego',player.x*T,player.y*T,true);ctx.restore()}
 if(ghost>0){ctx.save();ctx.globalAlpha=.4+.12*Math.sin(clock*13);ring(player.x*T,player.y*T,'#72e2ff',ghost/ghostTime(),24);ctx.font='22px serif';ctx.fillText('👻',player.x*T-10,player.y*T-23);ctx.restore()}
 if(shield>0){ctx.strokeStyle='#6bffbd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x*T,player.y*T,23,0,Math.PI*2);ctx.stroke()}
 ctx.restore();
 if(paused){ctx.fillStyle='#070b22bb';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='bold 50px system-ui';ctx.fillStyle='white';ctx.fillText('PAUSED',300,280)}
}
