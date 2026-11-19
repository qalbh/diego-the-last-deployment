// Level 4 art: "Knowledge Transfer Lab", a turquoise server room / security lab.
// Same character bodies, real photo faces, items and exit door as the earlier
// levels. Like Level 3, walls use flat fills and a sharp offset shadow (no
// per-tile blur or gradient) so the frame rate stays high.

Object.assign(BOSS_JACKETS,{ali:['#7ff5ea','#1f7f86']});
const L4_BINARY=Array.from({length:22},(_,i)=>({x:i<11?10+(i%4)*24+(i>7?12:0):912+(i%4)*22,speed:14+(i*7)%19,phase:i*53,bit:i%2}));

function levelFourSky(){
 const W=cv.width,H=cv.height;
 const sky=ctx.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,'#010d12');sky.addColorStop(.5,'#03191f');sky.addColorStop(.85,'#06303a');sky.addColorStop(1,'#0b4450');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 for(const st of NIGHT.stars){
  ctx.globalAlpha=.25+.4*(.5+.5*Math.sin(clock*st.speed+st.phase));
  ctx.fillStyle=st.big?'#e0fffb':'#8ff0e8';const size=st.big?2:1.2;ctx.fillRect(st.x,st.y,size,size);
 }
 ctx.globalAlpha=1;
 // A slowly turning security-shield hologram where Level 1's moon was.
 const hx=950,hy=100,spin=clock*.6;
 ctx.fillStyle='rgba(127,245,234,.08)';ctx.beginPath();ctx.arc(hx,hy,62,0,7);ctx.fill();
 ctx.strokeStyle='rgba(127,245,234,.55)';ctx.lineWidth=2;ctx.beginPath();
 for(let i=0;i<=6;i++){const a=spin+i*Math.PI/3;const px=hx+Math.cos(a)*34,py=hy+Math.sin(a)*34;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();
 ctx.strokeStyle='rgba(127,245,234,.25)';ctx.beginPath();ctx.arc(hx,hy,46,spin*2,spin*2+4);ctx.stroke();
 ctx.fillStyle='#7ff5ea';ctx.fillRect(hx-9,hy-2,18,14);ctx.strokeStyle='#7ff5ea';ctx.lineWidth=3;ctx.beginPath();ctx.arc(hx,hy-3,6,Math.PI,0);ctx.stroke();
 ctx.fillStyle='#03191f';ctx.fillRect(hx-1.5,hy+2,3,6);
 // Skyline with teal and amber windows.
 for(const b of NIGHT.skyline){ctx.fillStyle='#02090d';ctx.fillRect(b.x,H-b.h,b.w,b.h);ctx.fillStyle='#0f4450';ctx.fillRect(b.x,H-b.h,b.w,2)}
 for(const warm of [true,false]){
  ctx.fillStyle=warm?'#ffcf73':'#7ff5ea';
  for(const b of NIGHT.skyline)for(const wn of b.wins)if(wn.warm===warm){ctx.globalAlpha=.45+.3*Math.sin(clock*.7+wn.phase);ctx.fillRect(wn.x,wn.y,3,5)}
 }
 // Falling binary in the side margins.
 ctx.font='bold 11px monospace';ctx.fillStyle='#7ff5ea';
 for(const b of L4_BINARY){const y=((b.phase+clock*b.speed)%(H+40))-20;ctx.globalAlpha=.18+.12*Math.sin(clock*2+b.phase);ctx.fillText(((Math.floor(clock*1.5+b.phase)+b.bit)%2)?'1':'0',b.x,y)}
 ctx.globalAlpha=1;
 ctx.font='900 17px system-ui';ctx.fillStyle='#2fd8c855';ctx.fillText('BRIJ  /  KNOWLEDGE TRANSFER',14,30);ctx.fillText('BRIJ  /  KNOWLEDGE TRANSFER',16,32);
 ctx.fillStyle='#9ff8f0';ctx.fillText('BRIJ  /  KNOWLEDGE TRANSFER',15,31);
}

function levelFourTile(x,y,isWall){
 const px=x*T,py=y*T;
 if(!isWall){
  ctx.fillStyle=(x+y)%2?'#0b2027':'#0e262e';ctx.fillRect(px,py,T,T);
  ctx.fillStyle='#ffffff06';ctx.fillRect(px+2,py+2,T-4,1);
  ctx.strokeStyle='#7ff5ea12';ctx.lineWidth=.7;ctx.strokeRect(px+.5,py+.5,T-1,T-1);
  if((x*5+y*9)%11===0){ctx.fillStyle='#7ff5ea18';ctx.fillRect(px+T/2-1,py+5,2,T-10)}
  return;
 }
 ctx.fillStyle='#01080b';ctx.fillRect(px+1,py+6,T-1,T-3);
 ctx.fillStyle='#0b3540';ctx.fillRect(px+2,py+4,T-3,T-5);
 ctx.fillStyle='#13505d';rr(px+2,py+1,T-4,T-7,4);ctx.fill();
 ctx.fillStyle='#9ff8ff4d';rr(px+4,py+3,T-8,3,2);ctx.fill();
 ctx.fillStyle='#03181ea9';ctx.fillRect(px+4,py+T-8,T-8,3);
 ctx.strokeStyle='#9ff7ff3d';ctx.lineWidth=1;rr(px+3.5,py+2.5,T-7,T-8,3);ctx.stroke();
 const design=(x*11+y*5)%9;
 if(design<4){ // server blades with blinking lights
  ctx.fillStyle='#062a32';ctx.fillRect(px+8,py+10,T-16,3);ctx.fillRect(px+8,py+16,T-16,3);ctx.fillRect(px+8,py+22,T-16,3);
  ctx.fillStyle=Math.sin(clock*(2+design)+x*1.3+y)>0?'#7ff5ea':'#14454d';ctx.fillRect(px+T-13,py+10,3,3);
  ctx.fillStyle=Math.sin(clock*(3.5+design)+y*2.1)>.5?'#ffcf73':'#3a3418';ctx.fillRect(px+T-13,py+16,3,3);
 }else if(design===5){ // documentation shelf (book spines)
  const cols=['#ffcf73','#7ff5ea','#ff8fa3','#9fd8ff','#c9a8ff'];
  for(let k=0;k<5;k++){ctx.fillStyle=cols[(k+x)%5];ctx.fillRect(px+9+k*4.5,py+9+(k%2),3.5,15-(k%2))}
 }else if(design===7){ // access panel
  ctx.fillStyle='#04161b';rr(px+11,py+8,18,16,2);ctx.fill();
  ctx.fillStyle=Math.sin(clock*3+x+y)>0?'#5dffa0':'#1b4a33';ctx.beginPath();ctx.arc(px+20,py+16,3,0,7);ctx.fill();
 }
}

function levelFourGate(g){
 // Firewall gate: two posts across the corridor, with lasers when shut.
 const px=g.x*T,py=g.y*T,cx=px+T/2,cy=py+T/2,st=g.closed?'shut':l4GateWanted(g);
 const vertBars=g.orient==='h'; // corridor runs left-right, so the lasers run top-bottom
 ctx.save();
 ctx.fillStyle='#062a32';
 if(vertBars){ctx.fillRect(px+3,py+1,T-6,5);ctx.fillRect(px+3,py+T-6,T-6,5)}else{ctx.fillRect(px+1,py+3,5,T-6);ctx.fillRect(px+T-6,py+3,5,T-6)}
 const light=st==='shut'?'#ff4d6d':st==='warn'?'#ffb347':'#5dffa0';
 ctx.fillStyle=light;if(vertBars){ctx.fillRect(cx-3,py+2,6,3);ctx.fillRect(cx-3,py+T-5,6,3)}else{ctx.fillRect(px+2,cy-3,3,6);ctx.fillRect(px+T-5,cy-3,3,6)}
 if(st==='shut'||(st==='warn'&&Math.sin(clock*40)>0)){
  ctx.globalAlpha=st==='shut'?.95:.45;
  if(st==='shut'){ctx.fillStyle='rgba(255,60,90,.18)';ctx.fillRect(px+2,py+2,T-4,T-4)}
  ctx.strokeStyle='#ff5d7a';ctx.lineWidth=st==='shut'?2.2:1;
  ctx.beginPath();
  for(const o of [-8,0,8]){if(vertBars){ctx.moveTo(cx+o,py+6);ctx.lineTo(cx+o,py+T-6)}else{ctx.moveTo(px+6,cy+o);ctx.lineTo(px+T-6,cy+o)}}
  ctx.stroke();
 }
 ctx.restore();
}

function levelFourPuddle(w){
 const px=w.x*T,py=w.y*T,cx=px+T/2,cy=py+T/2,st=l4PuddleState(w);
 ctx.save();
 ctx.fillStyle=st==='zap'?'rgba(170,240,255,.6)':'rgba(70,165,255,.55)';rr(px+3,py+4,T-6,T-8,12);ctx.fill();
 ctx.fillStyle='rgba(200,235,255,.35)';rr(px+8,py+8,12,3,2);ctx.fill();
 ctx.strokeStyle='rgba(160,220,255,.45)';ctx.lineWidth=1;
 const r=(clock*.7+w.x*.3)%1;ctx.globalAlpha=.6*(1-r);ctx.beginPath();ctx.ellipse(cx,cy,4+r*12,2+r*6,0,0,7);ctx.stroke();ctx.globalAlpha=1;
 if(st==='warn'){
  ctx.fillStyle='#ffe066';
  for(let k=0;k<4;k++){if(Math.sin(clock*30+k*2.3+w.y)>.2)ctx.fillRect(px+7+((k*9+Math.floor(clock*20))%26),py+8+((k*13)%22),3,3)}
 }else if(st==='zap'){
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();
  for(let k=0;k<2;k++){let x=px+6,y=py+10+k*14;ctx.moveTo(x,y);for(let s=0;s<5;s++){x+=6;y+=(Math.sin(clock*50+s*3+k)>0?5:-5);ctx.lineTo(x,y)}}
  ctx.stroke();
  ctx.strokeStyle='#7ff5ea';ctx.lineWidth=4;ctx.globalAlpha=.35;ctx.stroke();
 }
 ctx.restore();
}

function levelFourPage(p){
 // A runbook page: a blue binder card with a pulsing ring.
 const x=p.x*T,y=p.y*T+Math.sin(clock*4+p.x)*2;
 ring(x,y,'#7ff5ea',(clock*.8+p.x)%1,15);
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#04161b';rr(-11,-12,25,28,4);ctx.fill();
 ctx.fillStyle='#e9fbff';rr(-12,-14,24,28,3);ctx.fill();ctx.strokeStyle='#7ff5ea';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#2b7fd8';ctx.fillRect(-12,-14,6,28);
 ctx.fillStyle='#8aa7b5';for(let k=0;k<4;k++)ctx.fillRect(-3,-8+k*5,12-(k%2)*4,2);
 ctx.restore();
}

function levelFourTerminal(){
 const t=l4.terminal,x=t.x*T,y=t.y*T,ready=l4PagesTaken()>=l4.pages.length;
 ctx.save();
 if(ready&&!t.done&&phase!=='terminal')ring(x,y,'#7ff5ea',(clock*.9)%1,17);
 ctx.fillStyle='#02090d';rr(x-14,y-8,28,24,4);ctx.fill();
 ctx.fillStyle='#0b3540';rr(x-15,y-16,30,20,3);ctx.fill();ctx.strokeStyle=t.done?'#5dffa0':ready?'#7ff5ea':'#3a6670';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle=t.done?'#1d6b45':ready?(Math.sin(clock*5)>0?'#12606a':'#0d4a52'):'#082a30';ctx.fillRect(x-12,y-13,24,14);
 ctx.fillStyle=t.done?'#5dffa0':ready?'#9ff8ff':'#2d5960';
 if(t.done){ctx.lineWidth=2.5;ctx.strokeStyle='#5dffa0';ctx.beginPath();ctx.moveTo(x-5,y-6);ctx.lineTo(x-1,y-2);ctx.lineTo(x+6,y-10);ctx.stroke()}
 else{ctx.fillRect(x-9,y-10,10,2);ctx.fillRect(x-9,y-6,15,2)}
 ctx.fillStyle='#062a32';ctx.fillRect(x-11,y+6,22,5);
 ctx.restore();
}
function levelFourCodeHologram(x,y){
 // The code floats above the terminal as arrow tiles (no text on the maze).
 const code=l4.termCode,n=code.length,size=22,gap=5,w=n*size+(n-1)*gap,left=Math.max(4,Math.min(L4.W*T-w-4,x-w/2)),top=Math.max(4,y-62);
 const wrong=performance.now()-l4.termFlash<350,ang={right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2};
 ctx.save();
 ctx.fillStyle='rgba(2,20,26,.88)';rr(left-7,top-7,w+14,size+14,8);ctx.fill();ctx.strokeStyle=wrong?'#ff5d7a':'#7ff5ea';ctx.lineWidth=2;ctx.stroke();
 for(let i=0;i<n;i++){const bx=left+i*(size+gap),done=i<l4.termPos,cur=i===l4.termPos;
  ctx.fillStyle=done?'#1d6b45':cur?'#12606a':'#062a32';rr(bx,top,size,size,4);ctx.fill();
  ctx.strokeStyle=wrong?'#ff5d7a':done?'#5dffa0':cur?'#ffffff':'#3f8f97';ctx.lineWidth=cur?2:1.2;ctx.stroke();
  ctx.save();ctx.translate(bx+size/2,top+size/2);ctx.rotate(ang[code[i]]);ctx.fillStyle=done?'#5dffa0':'#e9fbff';
  ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-3,-7);ctx.lineTo(-3,-3);ctx.lineTo(-7,-3);ctx.lineTo(-7,3);ctx.lineTo(-3,3);ctx.lineTo(-3,7);ctx.closePath();ctx.fill();ctx.restore();
 }
 ctx.beginPath();ctx.moveTo(x-6,top+size+7);ctx.lineTo(x,top+size+13);ctx.lineTo(x+6,top+size+7);ctx.fillStyle='rgba(2,20,26,.88)';ctx.fill();
 ctx.restore();
}

function levelFourLockedKey(){
 const k=l4.keySpot,x=k.x*T,y=k.y*T,pulse=.5+.5*Math.sin(clock*3);
 ctx.save();
 const halo=ctx.createRadialGradient(x,y,4,x,y,30);halo.addColorStop(0,`rgba(255,215,110,${.35+.2*pulse})`);halo.addColorStop(1,'rgba(255,215,110,0)');
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,30,0,7);ctx.fill();
 ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.lineDashOffset=-clock*8;ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.restore();
 ctx.save();ctx.globalAlpha=.8;levelOneCollectible(x,y,'key');ctx.restore();
 ctx.save();
 ctx.fillStyle='#13505d';rr(x+2,y+2,17,14,3);ctx.fill();ctx.strokeStyle='#ffe18b';ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.arc(x+10.5,y+2,4.6,Math.PI,0);ctx.stroke();ctx.fillStyle='#ffe18b';ctx.beginPath();ctx.arc(x+10.5,y+8,2,0,7);ctx.fill();ctx.fillRect(x+9.7,y+8,1.6,4);
 // One slot per runbook page plus one for the terminal.
 const steps=[...l4.pages.map(p=>p.taken),l4.terminal.done],n=steps.length;
 for(let i=0;i<n;i++){ctx.fillStyle=steps[i]?'#5dffb0':'#ffffff40';ctx.strokeStyle='#02090d';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x-6*(n-1)+i*12,y-24,4,0,7);ctx.fill();ctx.stroke()}
 ctx.restore();
}

function levelFourTarget(t){
 // "Remove instances": a red crosshair that tightens until it lands.
 const f=Math.max(0,t.t/t.max),x=t.x*T,y=t.y*T;
 ctx.save();
 ctx.fillStyle=`rgba(255,60,100,${.12+.18*(1-f)})`;ctx.beginPath();ctx.arc(x,y,32,0,7);ctx.fill();
 ctx.strokeStyle='#ff5d7a';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);ctx.lineDashOffset=clock*20;ctx.beginPath();ctx.arc(x,y,10+22*f,0,7);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#ffd0da';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,32,0,7);ctx.moveTo(x-8,y);ctx.lineTo(x+8,y);ctx.moveTo(x,y-8);ctx.lineTo(x,y+8);ctx.stroke();
 ctx.restore();
}

function levelFourHacker(h){
 const x=h.x*T,y=h.y*T,locked=h.lock>0,dashing=h.dash>0;
 ctx.save();
 if(dashing&&h.target){const dx=h.target.x+.5-h.x,dy=h.target.y+.5-h.y,d=Math.hypot(dx,dy)||1;
  for(let k=1;k<=3;k++){ctx.globalAlpha=.18/k;ctx.fillStyle='#7cff9e';ctx.beginPath();ctx.arc(x-dx/d*k*7,y-dy/d*k*7,12,0,7);ctx.fill()}ctx.globalAlpha=1}
 if(locked){ctx.strokeStyle='rgba(255,60,90,.7)';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(player.x*T,player.y*T);ctx.stroke();ctx.setLineDash([])}
 ctx.fillStyle='#010608aa';ctx.beginPath();ctx.ellipse(x,y+12,13,4,0,0,7);ctx.fill();
 const bob=Math.sin(clock*8+h.phase)*1.5;
 ctx.fillStyle='#1d1430';ctx.beginPath();ctx.moveTo(x-12,y+11);ctx.quadraticCurveTo(x-13,y-14+bob,x,y-15+bob);ctx.quadraticCurveTo(x+13,y-14+bob,x+12,y+11);ctx.closePath();ctx.fill();
 ctx.strokeStyle=locked?'#ff4d6d':'#3dff8a';ctx.lineWidth=1.2;ctx.stroke();
 ctx.fillStyle='#05030a';ctx.beginPath();ctx.ellipse(x,y-4+bob,7,6,0,0,7);ctx.fill();
 ctx.fillStyle=locked?'#ff4d6d':'#3dff8a';ctx.fillRect(x-4,y-5+bob,2.5,2);ctx.fillRect(x+1.5,y-5+bob,2.5,2);
 ctx.fillStyle='#2b3a40';ctx.fillRect(x-9,y+4,18,6);ctx.fillStyle=locked?'#ff4d6d88':'#3dff8a88';ctx.fillRect(x-7,y+5,14,3);
 ctx.restore();
}

function levelFourCharge(e){
 const f=1-e.charge/L4_WINDUP;
 ctx.save();ctx.globalAlpha=.35+.25*Math.sin(clock*20);ctx.fillStyle='#7ff5ea';ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,25,0,7);ctx.fill();
 ctx.globalAlpha=1;ctx.strokeStyle='#7ff5ea';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x*T,e.y*T-8,28,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();
 ctx.restore();
}

function levelFourBubble(){
 const b=l4.bubble;if(!b||b.time<=0)return;
 const e=enemies.find(n=>n.name==='ali');if(!e)return;
 ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';
 const w=Math.max(91,ctx.measureText(b.text).width+18),px=Math.max(w/2+4,Math.min(L4.W*T-w/2-4,e.x*T)),py=Math.max(30,e.y*T-43);
 ctx.globalAlpha=Math.min(1,b.time*3);
 ctx.fillStyle='#0d4a52';ctx.strokeStyle='#7ff5ea';ctx.lineWidth=1.6;
 rr(px-w/2,py-21,w,25,8);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(px-5,py+4);ctx.lineTo(px,py+10);ctx.lineTo(px+5,py+4);ctx.fill();
 ctx.fillStyle='#fff';ctx.fillText(b.text,px,py-5);ctx.restore();
}

function drawLevelFour(){
 levelFourSky();
 if(!grid||!player||!l4)return;
 ctx.save();ctx.translate(L4.OX,L4.OY);ctx.scale(L4.SCALE,L4.SCALE);
 const gateAt=new Set(l4.gates.map(g=>l2Key(g.x,g.y)));
 for(let y=0;y<L4.H;y++)for(let x=0;x<L4.W;x++)levelFourTile(x,y,grid[y][x]===1&&!gateAt.has(l2Key(x,y)));
 for(const w of l4.puddles)levelFourPuddle(w);
 for(const g of l4.gates)levelFourGate(g);
 for(const c of coins){ctx.fillStyle='#ffcf7a';ctx.beginPath();ctx.arc(c.x*T,c.y*T,4+Math.sin(clock*5+c.x)*1.2,0,Math.PI*2);ctx.fill()}
 for(const p of l4.pages)if(!p.taken)levelFourPage(p);
 levelFourTerminal();
 if(goldenKey&&!hasGoldenKey)levelOneCollectible(goldenKey.x*T,goldenKey.y*T,'key');else if(!hasGoldenKey)levelFourLockedKey();
 for(const p of pickups)levelOneCollectible(p.x*T,p.y*T,p.type);
 for(const t of l4.targets)levelFourTarget(t);
 for(const h of hazards)if(!h.dead)levelFourHacker(h);
 levelOneExit();
 drawEffects();
 for(const e of enemies){
  if(e.charge>0&&e.stun<=0)levelFourCharge(e);
  else if(l4.final){ctx.save();const g=ctx.createRadialGradient(e.x*T,e.y*T-10,4,e.x*T,e.y*T-10,26);g.addColorStop(0,'rgba(255,140,60,.55)');g.addColorStop(1,'rgba(255,90,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x*T,e.y*T-10,26,0,7);ctx.fill();ctx.restore()}
  levelOneCharacter(e.name,e.x*T,e.y*T,false);
  if(e.stun>0){ctx.save();ctx.font='14px serif';ctx.textAlign='center';ctx.fillText('💫',e.x*T+Math.sin(clock*6)*8,e.y*T-34);ctx.restore()}
 }
 for(const t of throws){ctx.save();ctx.translate(t.x*T,t.y*T);ctx.rotate(Math.atan2(t.vy,t.vx)+clock*12);ctx.strokeStyle='#ffde91';ctx.globalAlpha=.65;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(-7,0);ctx.stroke();ctx.globalAlpha=1;ctx.font='25px serif';ctx.fillText('🩴',-12,8);ctx.restore()}
 // Enemy attacks fly through interior walls but are clipped to the maze frame.
 ctx.save();ctx.beginPath();ctx.rect(0,0,L4.W*T,L4.H*T);ctx.clip();
 ctx.font='21px serif';for(const p of projectiles)ctx.fillText('📚',p.x*T-12,p.y*T+8);
 ctx.restore();
 if(phase==='terminal'||player.inv===0||Math.floor(clock*12)%2===0){ctx.save();ctx.globalAlpha=ghost>0?.22:1;levelOneCharacter('diego',player.x*T,player.y*T,true);ctx.restore()}
 if(ghost>0){ctx.save();ctx.globalAlpha=.4+.12*Math.sin(clock*13);ring(player.x*T,player.y*T,'#72e2ff',ghost/GHOST_TIME,24);ctx.font='22px serif';ctx.fillText('👻',player.x*T-10,player.y*T-23);ctx.restore()}
 if(shield>0){ctx.strokeStyle='#6bffbd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x*T,player.y*T,23,0,Math.PI*2);ctx.stroke()}
 if(phase==='terminal'&&l4.termCode)levelFourCodeHologram(l4.terminal.x*T,l4.terminal.y*T); // above everything
 levelFourBubble();
 ctx.restore();
 if(paused){ctx.fillStyle='#070b22bb';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='bold 50px system-ui';ctx.fillStyle='white';ctx.fillText('PAUSED',300,280)}
}
