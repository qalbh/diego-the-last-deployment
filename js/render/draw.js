// Main draw pass for every frame.
function draw(){let th=THEMES[level];ctx.fillStyle=th.sky;ctx.fillRect(0,0,800,576);
// Each world has its own scenery, palette and atmosphere.
if(level===0)levelOneScenery();
if(level===1){ctx.fillStyle='#e6b5fa22';for(let i=0;i<13;i++){ctx.fillRect(i*70,25,35,6);ctx.fillRect(i*70+15,25,5,90)}}
if(level===2){for(let i=0;i<15;i++){ctx.fillStyle=i%2?'#ff692044':'#fd264833';ctx.beginPath();ctx.arc(i*59,10+Math.sin(clock*2+i)*15,25,0,Math.PI*2);ctx.fill()}}
if(level===3){ctx.fillStyle='#50f0db22';for(let i=0;i<15;i++)ctx.fillText('01 10 01',i*62,15+(i%4)*22)}
if(level===4){ctx.strokeStyle='#ab58ff44';for(let i=0;i<25;i++){ctx.beginPath();ctx.moveTo(i*40,0);ctx.lineTo(i*40+Math.sin(clock+i)*10,576);ctx.stroke()}}
if(level===0){ctx.save();ctx.translate(115,45);ctx.scale(1.25,1.25)}
for(let y=0;y<(level===0?13:ROWS);y++)for(let x=0;x<(level===0?15:COLS);x++){if(level===0){levelOneTile(x,y,!!grid?.[y]?.[x])}else if(grid?.[y]?.[x]){ctx.fillStyle=th.wall;ctx.fillRect(x*T,y*T,T,T);ctx.strokeStyle=th.edge;ctx.lineWidth=1.5;ctx.strokeRect(x*T+3,y*T+3,T-6,T-6)}else{ctx.fillStyle=(x+y)%2?th.floor:th.sky;ctx.fillRect(x*T,y*T,T,T)}}if(!player)return;if(level===0)levelOneOfficeDecor();
for(let c of coins){ctx.fillStyle=th.accent;ctx.beginPath();ctx.arc(c.x*T,c.y*T,4+Math.sin(clock*5+c.x)*1.2,0,Math.PI*2);ctx.fill()}
if(level===0){if(goldenKey&&!hasGoldenKey)levelOneCollectible(goldenKey.x*T,goldenKey.y*T,'key');
 for(const p of pickups)levelOneCollectible(p.x*T,p.y*T,p.type);}
 for(let h of hazards){if(h.dead)continue;let active=h.type==='fire'||h.type==='snake'||h.type==='bug'||h.type==='hack'||Math.sin(clock*2+h.phase)>.05;ctx.globalAlpha=active?1:.25;if(level===0&&(h.type==='snake'||h.type==='bug')){levelOneCreature(h)}else{ctx.font='25px serif';ctx.fillText(HAZARD_ICONS[h.type],h.x*T-13,h.y*T+9);if(h.type==='snake'||h.type==='bug'){ctx.fillStyle=h.type==='snake'?'#69f68c':'#ffc05e';ctx.beginPath();ctx.arc(h.x*T-h.dir[0]*13,h.y*T-h.dir[1]*13,5,0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=1}
if(level===0)levelOneExit();else{ctx.fillStyle=(level===0?hasGoldenKey:coins.length===0)?'#1ad88a':'#7e566c';ctx.fillRect(exitCell.x*T+3,exitCell.y*T+3,T-6,T-6);ctx.strokeStyle='#fff5a0';ctx.lineWidth=3;ctx.strokeRect(exitCell.x*T+5,exitCell.y*T+4,T-10,T-8);ctx.font='bold 11px system-ui';ctx.fillStyle='#08221a';ctx.fillText(level===0&&!hasGoldenKey?'LOCK':'EXIT',exitCell.x*T+3,exitCell.y*T+20);}
if(level===0)drawEffects();for(let e of enemies){if(level===0&&harisMode==='reminder'){ctx.save();ctx.shadowColor='#ff334f';ctx.shadowBlur=22;ctx.fillStyle='#ff334f';ctx.beginPath();ctx.arc(e.x*T,e.y*T-10,20,0,Math.PI*2);ctx.fill();ctx.restore();}character(e.name,e.x*T,e.y*T,32);}
// A tiny, temporary speech indicator tracks Haris himself when his mode changes.
 if(level===0&&harisBubbleTime>0){
  const haris=enemies.find(e=>e.name==='haris');
  if(haris){const label=harisMode==='reminder'?'DIEGOOOOO!!':'Kind reminder!';
   ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';
   const w=Math.max(91,ctx.measureText(label).width+18),px=Math.max(w/2+4,Math.min(15*T-w/2-4,haris.x*T)),py=haris.y*T-43;
   ctx.globalAlpha=Math.min(1,harisBubbleTime*3);ctx.fillStyle=harisMode==='reminder'?'#a51c41':'#145675';ctx.strokeStyle=harisMode==='reminder'?'#ff92ac':'#7af9f2';ctx.lineWidth=1.6;
   rr(px-w/2,py-21,w,25,8);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.moveTo(px-5,py+4);ctx.lineTo(px,py+10);ctx.lineTo(px+5,py+4);ctx.fill();
   ctx.fillStyle='#fff';ctx.fillText(label,px,py-5);ctx.restore();
  }
 }
for(let t of throws){ctx.save();ctx.translate(t.x*T,t.y*T);ctx.rotate(Math.atan2(t.vy,t.vx)+clock*12);ctx.shadowColor='#ffd67c';ctx.shadowBlur=14;ctx.strokeStyle='#ffde91';ctx.globalAlpha=.65;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(-7,0);ctx.stroke();ctx.globalAlpha=1;ctx.font='25px serif';ctx.fillText('🩴',-12,8);ctx.restore()}
// Clip enemy tickets to the physical Level 1 maze so glyphs and shadows never spill into the outer frame.
ctx.save();
if(level===0){ctx.beginPath();ctx.rect(0,0,15*T,13*T);ctx.clip()}
for(let p of projectiles){ctx.font='21px serif';ctx.fillText(p.name==='zoofi'?'🐛':p.name==='sush'||p.name==='arqam'?'📩':LEVELS[level].attack,p.x*T-12,p.y*T+8)}
ctx.restore();
if(player.inv===0||Math.floor(clock*12)%2===0){ctx.save();ctx.globalAlpha=ghost>0?.22:1;character('diego',player.x*T,player.y*T,33,true);ctx.restore()}if(ghost>0){ctx.save();ctx.globalAlpha=.4+.12*Math.sin(clock*13);ring(player.x*T,player.y*T,'#72e2ff',ghost/2,24);ctx.shadowColor='#70eaff';ctx.shadowBlur=23;ctx.font='22px serif';ctx.fillText('👻',player.x*T-10,player.y*T-23);ctx.restore()}
if(shield>0){ctx.strokeStyle='#6bffbd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x*T,player.y*T,23,0,Math.PI*2);ctx.stroke()}
if(level===0)ctx.restore();
// Mission and progress are displayed in the external game HUD, never over the maze.
if(paused){ctx.fillStyle='#070b22bb';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='bold 50px system-ui';ctx.fillStyle='white';ctx.fillText('PAUSED',300,280)}}
