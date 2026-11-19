// Level 2 art: "Deadline Dimension", a purple sprint-planning floor at night.
// Same approach as Level 1 (hand-painted canvas shapes, real photo faces, the
// same character bodies, creatures, items and exit door), re-coloured and
// re-decorated so it reads as a different floor of the building.

// Boss jacket colours (Level 1's Haris keeps the default blue).
const BOSS_JACKETS={eren:['#ff8fd0','#a8327a'],jake:['#ffc46e','#c0632a']};

function levelTwoSky(){
 const W=cv.width,H=cv.height;
 const sky=ctx.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,'#05021a');sky.addColorStop(.5,'#160832');sky.addColorStop(.85,'#2c0f4a');sky.addColorStop(1,'#46195c');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 for(const st of NIGHT.stars){
  ctx.globalAlpha=.3+.45*(.5+.5*Math.sin(clock*st.speed+st.phase));
  ctx.fillStyle=st.big?'#ffe3fb':'#cdb9ff';const size=st.big?2:1.2;ctx.fillRect(st.x,st.y,size,size);
 }
 ctx.globalAlpha=1;
 // A deadline clock hangs where Level 1's moon was; its hands run a little too fast.
 const cx=956,cy=104,r=30;
 const halo=ctx.createRadialGradient(cx,cy,r*.6,cx,cy,r*3);halo.addColorStop(0,'#ff7ad955');halo.addColorStop(1,'#ff7ad900');
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,r*3,0,7);ctx.fill();
 ctx.fillStyle='#fbefff';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
 ctx.strokeStyle='#c04d9c';ctx.lineWidth=3;ctx.stroke();
 ctx.strokeStyle='#5b2a6e';ctx.lineWidth=2;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(r-6),cy+Math.sin(a)*(r-6));ctx.lineTo(cx+Math.cos(a)*(r-2),cy+Math.sin(a)*(r-2));ctx.stroke()}
 const hand=(a,len,w,col)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a-Math.PI/2)*len,cy+Math.sin(a-Math.PI/2)*len);ctx.stroke()};
 hand(clock*.13,r*.5,3.5,'#3b1747');hand(clock*1.6,r*.75,2.5,'#3b1747');hand(clock*6,r*.82,1.2,'#ff3f7a');
 ctx.fillStyle='#ff3f7a';ctx.beginPath();ctx.arc(cx,cy,2.5,0,7);ctx.fill();
 // City skyline in the side margins, magenta and amber windows.
 for(const b of NIGHT.skyline){ctx.fillStyle='#0b0418';ctx.fillRect(b.x,H-b.h,b.w,b.h);ctx.fillStyle='#3b1a5c';ctx.fillRect(b.x,H-b.h,b.w,2)}
 for(const warm of [true,false]){
  ctx.fillStyle=warm?'#ffc37a':'#ff8ee0';
  for(const b of NIGHT.skyline)for(const wn of b.wins)if(wn.warm===warm){ctx.globalAlpha=.5+.3*Math.sin(clock*.7+wn.phase);ctx.fillRect(wn.x,wn.y,3,5)}
 }
 ctx.globalAlpha=1;
 // Calendar pages drifting down the side margins.
 for(let i=0;i<8;i++){
  const x=i<4?12+i*19:922+(i-4)*18,y=((i*131+clock*(10+i*2))%820)-60,tilt=Math.sin(clock*.8+i)*.35;
  ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.globalAlpha=.55;
  ctx.fillStyle='#f6eefe';ctx.fillRect(-8,-9,16,18);ctx.fillStyle='#e0457b';ctx.fillRect(-8,-9,16,5);
  ctx.fillStyle='#8a6aa8';for(let k=0;k<3;k++)ctx.fillRect(-5+k*4,-1,2,2),ctx.fillRect(-5+k*4,3,2,2);
  ctx.restore();
 }
 ctx.save();ctx.shadowColor='#ff7ad9';ctx.shadowBlur=15;ctx.fillStyle='#ff9be3';ctx.font='900 17px system-ui';
 ctx.fillText('BRIJ  /  SPRINT PLANNING',15,31);ctx.restore();
}

function levelTwoTile(x,y,isWall){
 const px=x*T,py=y*T;
 if(!isWall){
  ctx.fillStyle=(x+y)%2?'#1f1638':'#241a42';ctx.fillRect(px,py,T,T);
  ctx.fillStyle='#ffffff07';ctx.fillRect(px+2,py+2,T-4,1);
  ctx.strokeStyle='#d6b8ff12';ctx.lineWidth=.7;ctx.strokeRect(px+.5,py+.5,T-1,T-1);
  if((x*11+y*5)%9===0){ctx.fillStyle='#c79bff18';for(let k=0;k<3;k++)ctx.fillRect(px+10+k*8,py+19,3,3)}
  return;
 }
 // Raised violet planning boards with sticky notes, calendars, kanban and burndown charts.
 ctx.fillStyle='#0c0618';ctx.fillRect(px+1,py+5,T-1,T-3);ctx.shadowColor='#000b';ctx.shadowBlur=6;ctx.shadowOffsetY=4;
 ctx.fillStyle='#3a2363';ctx.fillRect(px+2,py+4,T-3,T-5);
 const g=ctx.createLinearGradient(px,py,px+T,py+T);g.addColorStop(0,'#9a6fd6');g.addColorStop(.45,'#6b46b0');g.addColorStop(1,'#4a2f86');
 ctx.fillStyle=g;rr(px+2,py+1,T-4,T-7,4);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.fillStyle='#d9bcffaa';rr(px+4,py+3,T-8,3,2);ctx.fill();
 ctx.fillStyle='#1b0f33a9';ctx.fillRect(px+4,py+T-8,T-8,3);
 ctx.strokeStyle='#e2c8ff55';ctx.lineWidth=1;rr(px+3.5,py+2.5,T-7,T-8,3);ctx.stroke();
 const design=(x*17+y*5)%11;
 if(design===0){ // sticky notes
  [['#ffe27a',9,9],['#ff9fd6',18,11],['#7ff0d8',13,18]].forEach(([c,ox,oy])=>{ctx.fillStyle=c;ctx.fillRect(px+ox,py+oy,8,7)});
 }else if(design===3){ // calendar
  ctx.fillStyle='#f6eefe';rr(px+10,py+8,18,15,2);ctx.fill();ctx.fillStyle='#e0457b';ctx.fillRect(px+10,py+8,18,4);
  ctx.fillStyle='#8a6aa8';for(let k=0;k<4;k++)ctx.fillRect(px+12+k*4,py+15,2,2);ctx.fillStyle='#e0457b';ctx.fillRect(px+20,py+19,2,2);
 }else if(design===6){ // kanban columns
  ctx.fillStyle='#2a1850';rr(px+8,py+8,22,15,2);ctx.fill();
  ctx.fillStyle='#ffd37a';ctx.fillRect(px+10,py+10,5,3);ctx.fillStyle='#8ff0c8';ctx.fillRect(px+17,py+10,5,3);ctx.fillRect(px+17,py+15,5,3);ctx.fillStyle='#ff9fd6';ctx.fillRect(px+24,py+10,4,3);
 }else if(design===9){ // burndown chart
  ctx.strokeStyle='#ffd9f4';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px+10,py+10);ctx.lineTo(px+16,py+15);ctx.lineTo(px+21,py+13);ctx.lineTo(px+28,py+21);ctx.stroke();
 }
}

function levelTwoTrap(t){
 // Scope creep: a swirling purple floor patch with little "+" items piling on.
 const cx=Math.floor(t.x)*T+T/2,cy=Math.floor(t.y)*T+T/2,pulse=.5+.5*Math.sin(clock*3+t.x);
 ctx.save();
 ctx.fillStyle=`rgba(186,72,255,${.16+.1*pulse})`;rr(cx-17,cy-17,34,34,8);ctx.fill();
 ctx.strokeStyle='#d58cff';ctx.lineWidth=2;ctx.globalAlpha=.75;
 for(let i=0;i<3;i++){const a=clock*1.8+i*2.1;ctx.beginPath();ctx.arc(cx,cy,5+i*4,a,a+2.4);ctx.stroke()}
 ctx.globalAlpha=.85;ctx.fillStyle='#ffd1fb';ctx.font='bold 10px system-ui';ctx.textAlign='center';
 for(let i=0;i<3;i++){const ph=(clock*.8+i/3)%1;ctx.globalAlpha=.8*(1-ph);ctx.fillText('+',cx-9+i*9,cy+8-ph*16)}
 ctx.restore();
}

function levelTwoSignoff(s){
 // Stakeholder sign-off: a green approval card with a check mark and a pulsing glow ring.
 const x=s.x*T,y=s.y*T+Math.sin(clock*4+s.x)*2;
 ring(x,y,'#5dffb0',(clock*.8+s.x)%1,14);
 ctx.save();ctx.translate(x,y);ctx.shadowColor='#5dffb0';ctx.shadowBlur=14;
 ctx.fillStyle='#2fcf88';rr(-12,-13,24,26,6);ctx.fill();ctx.shadowBlur=0;
 ctx.strokeStyle='#eafff3';ctx.lineWidth=1.8;ctx.stroke();
 ctx.strokeStyle='#ffffff';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-1,5);ctx.lineTo(7,-5);ctx.stroke();
 ctx.fillStyle='#0f5a3a';ctx.fillRect(-7,8,14,2);
 ctx.restore();
}

function levelTwoLockedKey(){
 // The golden key waits in place from the start, glowing behind a padlock, with
 // one slot per sign-off that lights up as Diego collects them.
 const k=l2.keySpot,x=k.x*T,y=k.y*T,n=l2SignoffsTaken(),pulse=.5+.5*Math.sin(clock*3);
 ctx.save();
 const halo=ctx.createRadialGradient(x,y,4,x,y,30);halo.addColorStop(0,`rgba(255,215,110,${.35+.2*pulse})`);halo.addColorStop(1,'rgba(255,215,110,0)');
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,30,0,7);ctx.fill();
 ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.lineDashOffset=-clock*8;ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.restore();
 ctx.save();ctx.globalAlpha=.8;levelOneCollectible(x,y,'key');ctx.restore();
 ctx.save();
 ctx.fillStyle='#5b2a8c';rr(x+2,y+2,17,14,3);ctx.fill();ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.arc(x+10.5,y+2,4.6,Math.PI,0);ctx.stroke();ctx.fillStyle='#ffe18b';ctx.beginPath();ctx.arc(x+10.5,y+8,2,0,7);ctx.fill();ctx.fillRect(x+9.7,y+8,1.6,4);
 for(let i=0;i<l2.signoffs.length;i++){ctx.fillStyle=i<n?'#5dffb0':'#ffffff40';ctx.strokeStyle='#1b0f33';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x-6+i*12,y-24,4,0,7);ctx.fill();ctx.stroke()}
 ctx.restore();
}
function levelTwoDeadlineSpot(d){
 // Eren's status-update tile, with a countdown ring (no text on the maze).
 const x=d.x*T,y=d.y*T,f=Math.max(0,d.time/d.max),urgent=f<.35,pulse=.5+.5*Math.sin(clock*(urgent?14:6));
 ctx.save();
 ctx.fillStyle=urgent?`rgba(255,80,120,${.18+.15*pulse})`:`rgba(111,247,255,${.14+.1*pulse})`;rr(x-17,y-17,34,34,8);ctx.fill();
 ctx.lineWidth=4;ctx.strokeStyle='#ffffff22';ctx.beginPath();ctx.arc(x,y,16,0,7);ctx.stroke();
 ctx.strokeStyle=urgent?'#ff5d7a':'#6ff7ff';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=10;
 ctx.beginPath();ctx.arc(x,y,16,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
 ctx.font='16px serif';ctx.textAlign='center';ctx.fillText('📊',x,y+6);
 ctx.restore();
}

function levelTwoBarrier(b){
 // Jake's requirement: a striped block with a clipboard and a draining timer bar.
 const px=b.x*T,py=b.y*T,f=Math.max(0,b.life/L2.BARRIER_LIFE);
 const shake=f<.25?Math.sin(clock*40)*1.5:0;
 ctx.save();ctx.translate(shake,0);
 ctx.shadowColor='#ff8a5c';ctx.shadowBlur=12;
 const g=ctx.createLinearGradient(px,py,px,py+T);g.addColorStop(0,'#ffa25c');g.addColorStop(1,'#d9465f');
 ctx.fillStyle=g;rr(px+2,py+2,T-4,T-6,5);ctx.fill();ctx.shadowBlur=0;
 ctx.save();rr(px+2,py+2,T-4,T-6,5);ctx.clip();ctx.strokeStyle='#5a153055';ctx.lineWidth=5;
 for(let k=-T;k<T*2;k+=11){ctx.beginPath();ctx.moveTo(px+k,py);ctx.lineTo(px+k+T,py+T);ctx.stroke()}ctx.restore();
 ctx.strokeStyle='#fff1d6';ctx.lineWidth=1.5;rr(px+2,py+2,T-4,T-6,5);ctx.stroke();
 ctx.font='17px serif';ctx.textAlign='center';ctx.fillText('📋',px+T/2,py+T/2+5);
 ctx.fillStyle='#2b0d1f';ctx.fillRect(px+5,py+T-9,T-10,3);ctx.fillStyle='#fff3b0';ctx.fillRect(px+5,py+T-9,(T-10)*f,3);
 ctx.restore();
}

function levelTwoBubble(){
 // Small speech bubble over Eren or Jake when they act (same style as Haris's).
 const b=l2.bubble;if(!b||b.time<=0)return;
 const e=enemies.find(n=>n.name===b.name);if(!e)return;
 ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';
 const w=Math.max(91,ctx.measureText(b.text).width+18),px=Math.max(w/2+4,Math.min(L2.W*T-w/2-4,e.x*T)),py=e.y*T-43;
 ctx.globalAlpha=Math.min(1,b.time*3);
 ctx.fillStyle=b.name==='eren'?'#8c1f5f':'#8a3f12';ctx.strokeStyle=b.name==='eren'?'#ff9be3':'#ffc46e';ctx.lineWidth=1.6;
 rr(px-w/2,py-21,w,25,8);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(px-5,py+4);ctx.lineTo(px,py+10);ctx.lineTo(px+5,py+4);ctx.fill();
 ctx.fillStyle='#fff';ctx.fillText(b.text,px,py-5);ctx.restore();
}

function drawLevelTwo(){
 levelTwoSky();
 if(!grid||!player||!l2)return;
 ctx.save();ctx.translate(L2.OX,L2.OY);ctx.scale(L2.SCALE,L2.SCALE);
 const blocked=new Set(l2.barriers.map(b=>l2Key(b.x,b.y)));
 for(let y=0;y<L2.H;y++)for(let x=0;x<L2.W;x++)levelTwoTile(x,y,grid[y][x]===1&&!blocked.has(l2Key(x,y)));
 for(const t of l2.traps)levelTwoTrap(t);
 for(const c of coins){ctx.fillStyle='#ffcf7a';ctx.beginPath();ctx.arc(c.x*T,c.y*T,4+Math.sin(clock*5+c.x)*1.2,0,Math.PI*2);ctx.fill()}
 for(const s of l2.signoffs)if(!s.taken)levelTwoSignoff(s);
 if(goldenKey&&!hasGoldenKey)levelOneCollectible(goldenKey.x*T,goldenKey.y*T,'key');else if(!hasGoldenKey)levelTwoLockedKey();
 for(const p of pickups)levelOneCollectible(p.x*T,p.y*T,p.type);
 if(l2.deadline)levelTwoDeadlineSpot(l2.deadline);
 for(const b of l2.barriers)levelTwoBarrier(b);
 for(const h of hazards)if(!h.dead)levelOneCreature(h);
 levelOneExit();
 drawEffects();
 for(const e of enemies){
  const aura=l2.sprint?'#ff9a3c':(e.name==='eren'&&l2.enrage>0)?'#ff334f':null;
  if(aura){ctx.save();ctx.shadowColor=aura;ctx.shadowBlur=22;ctx.fillStyle=aura;ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(e.x*T,e.y*T-10,20,0,Math.PI*2);ctx.fill();ctx.restore()}
  levelOneCharacter(e.name,e.x*T,e.y*T,false);
 }
 levelTwoBubble();
 for(const t of throws){ctx.save();ctx.translate(t.x*T,t.y*T);ctx.rotate(Math.atan2(t.vy,t.vx)+clock*12);ctx.shadowColor='#ffd67c';ctx.shadowBlur=14;ctx.strokeStyle='#ffde91';ctx.globalAlpha=.65;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(-7,0);ctx.stroke();ctx.globalAlpha=1;ctx.font='25px serif';ctx.fillText('🩴',-12,8);ctx.restore()}
 // Enemy attacks fly through interior walls but are clipped to the maze frame.
 ctx.save();ctx.beginPath();ctx.rect(0,0,L2.W*T,L2.H*T);ctx.clip();
 ctx.font='21px serif';for(const p of projectiles)ctx.fillText(p.name==='jake'?'📋':'📅',p.x*T-12,p.y*T+8);
 ctx.restore();
 if(player.inv===0||Math.floor(clock*12)%2===0){ctx.save();ctx.globalAlpha=ghost>0?.22:1;levelOneCharacter('diego',player.x*T,player.y*T,true);ctx.restore()}
 if(ghost>0){ctx.save();ctx.globalAlpha=.4+.12*Math.sin(clock*13);ring(player.x*T,player.y*T,'#72e2ff',ghost/2,24);ctx.shadowColor='#70eaff';ctx.shadowBlur=23;ctx.font='22px serif';ctx.fillText('👻',player.x*T-10,player.y*T-23);ctx.restore()}
 if(shield>0){ctx.strokeStyle='#6bffbd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x*T,player.y*T,23,0,Math.PI*2);ctx.stroke()}
 ctx.restore();
 if(paused){ctx.fillStyle='#070b22bb';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='bold 50px system-ui';ctx.fillStyle='white';ctx.fillText('PAUSED',300,280)}
}
