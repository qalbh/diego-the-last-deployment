// Level 1 hand-painted canvas art: tiles, scenery, decor, items, creatures, characters.
// LEVEL 1 VISUAL SYSTEM: hand-painted canvas shapes, with real faces kept intact.
function rr(x,y,w,h,r=5){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function levelOneTile(x,y,wall){
 const px=x*T,py=y*T;
 if(!wall){
   ctx.fillStyle=(x+y)%2?'#172c45':'#1b344e';ctx.fillRect(px,py,T,T);const light=ctx.createRadialGradient(px+T*.3,py+T*.25,1,px+T*.5,py+T*.5,T*.9);light.addColorStop(0,'#bce6ff0b');light.addColorStop(1,'#060e2100');ctx.fillStyle=light;ctx.fillRect(px,py,T,T);
   // Polished office carpet, subtle diamond-grid and seam details.
   ctx.fillStyle='#ffffff08';ctx.fillRect(px+2,py+2,T-4,1);
   ctx.strokeStyle='#9cceeb12';ctx.lineWidth=.7;ctx.strokeRect(px+.5,py+.5,T-1,T-1);
   if((x*13+y*17)%11===0){ctx.fillStyle='#7ab6d71c';ctx.fillRect(px+13,py+13,6,6)}
   if((x*3+y*7)%23===0){ctx.strokeStyle='#61d5ff33';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px+6,py+25);ctx.lineTo(px+12,py+25);ctx.stroke()}
   return;
 }
 // Rich, raised filing-cabinet/office divider blocks, side depth and specular highlights.
 ctx.fillStyle='#080d20';ctx.fillRect(px+1,py+5,T-1,T-3);ctx.shadowColor='#000b';ctx.shadowBlur=6;ctx.shadowOffsetY=4;
 ctx.fillStyle='#12335c';ctx.fillRect(px+2,py+4,T-3,T-5);
 const g=ctx.createLinearGradient(px,py,px+T,py+T);
 g.addColorStop(0,'#5b87bf');g.addColorStop(.44,'#365e99');g.addColorStop(1,'#234477');
 ctx.fillStyle=g;rr(px+2,py+1,T-4,T-7,4);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.fillStyle='#83bdf4aa';rr(px+4,py+3,T-8,3,2);ctx.fill();
 ctx.fillStyle='#101f41a9';ctx.fillRect(px+4,py+T-8,T-8,3);
 ctx.strokeStyle='#9ad4fa55';ctx.lineWidth=1;rr(px+3.5,py+2.5,T-7,T-8,3);ctx.stroke();
 const design=(x*19+y*7)%13;
 if(design===0){ // tiny ticket cabinet
   ctx.fillStyle='#20395c';rr(px+9,py+8,14,12,2);ctx.fill();
   ctx.strokeStyle='#88c4e3';ctx.strokeRect(px+11,py+10,10,3);ctx.strokeRect(px+11,py+15,10,3);
 }else if(design===3){ // task board
   ctx.fillStyle='#142743';rr(px+8,py+8,17,12,2);ctx.fill();
   ctx.fillStyle='#f8ca74';ctx.fillRect(px+11,py+10,5,4);ctx.fillStyle='#76e4be';ctx.fillRect(px+18,py+10,4,4);
 }else if(design===8){ctx.fillStyle='#91b8e0';ctx.fillRect(px+10,py+10,12,2);ctx.fillRect(px+10,py+15,8,2)}
}
function levelOneScenery(){
 // Window glow, layered office facade and neon ticket-board signage.
 const bg=ctx.createLinearGradient(0,0,0,576);bg.addColorStop(0,'#15294b');bg.addColorStop(.65,'#111b38');bg.addColorStop(1,'#090f28');ctx.fillStyle=bg;ctx.fillRect(0,0,800,576);
 for(let i=0;i<14;i++){
   let x=i*65+7,y=25+(i%3)*12;
   ctx.fillStyle='#1d385e';rr(x,y,48,87,5);ctx.fill();ctx.fillStyle='#416892';rr(x+5,y+4,38,55,3);ctx.fill();
   ctx.fillStyle=i%3===0?'#fdd98a88':'#75cef16a';ctx.fillRect(x+11,y+12,9,15);ctx.fillRect(x+27,y+12,9,15);
 }
 ctx.save();ctx.shadowColor='#65d9f0';ctx.shadowBlur=15;ctx.fillStyle='#65d9f0';ctx.font='900 17px system-ui';ctx.fillText('BRIJ  /  TICKET DIVISION',15,26);ctx.restore();
 ctx.fillStyle='#89a9c9';ctx.font='11px system-ui';ctx.fillText('Haris is typing...',652,550);drawOfficeAtmosphere();
}
function levelOneOfficeDecor(){
 // Decor placed on solid walls, never changes collision or walkable route.
 const available=[];for(let y=1;y<12;y++)for(let x=1;x<14;x++)if(grid?.[y]?.[x]&&(x*7+y*11)%17===0)available.push([x,y]);
 for(let [x,y] of available){let px=x*T+16,py=y*T+15;
   if((x+y)%3===0){ // planter
     ctx.fillStyle='#101f34';rr(px-6,py-1,12,8,3);ctx.fill();ctx.fillStyle='#e39a62';rr(px-5,py-4,10,9,3);ctx.fill();ctx.strokeStyle='#6eecad';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py-4);ctx.lineTo(px-5,py-13);ctx.moveTo(px,py-4);ctx.lineTo(px+5,py-13);ctx.stroke();
   }else if((x+y)%3===1){ctx.fillStyle='#122946';rr(px-9,py-6,18,12,2);ctx.fill();ctx.fillStyle='#7bd7ef';ctx.fillRect(px-6,py-3,12,6);ctx.fillStyle='#e5d390';ctx.fillRect(px-3,py+7,6,2)}
 }
}
function levelOneCollectible(x,y,type){
 const bob=Math.sin(clock*4+x*.1)*2;ctx.save();ctx.translate(x,y+bob);ctx.shadowBlur=13;ctx.shadowColor='#ffcf64';
 if(type==='key'){
   ctx.rotate(Math.sin(clock*2)*.16);ctx.strokeStyle='#fff0a8';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-4,-3,6,0,Math.PI*2);ctx.moveTo(0,1);ctx.lineTo(11,12);ctx.moveTo(7,8);ctx.lineTo(11,4);ctx.moveTo(10,11);ctx.lineTo(14,7);ctx.stroke();ctx.strokeStyle='#f8b52f';ctx.lineWidth=2;ctx.stroke();
 }else{
   const cl={coffee:'#d6a979',dnd:'#6fe2d9',heal:'#ff7a92',goldenChappal:'#ffe078'}[type];ctx.fillStyle=cl;rr(-11,-12,22,24,6);ctx.fill();ctx.strokeStyle='#fff9cd';ctx.lineWidth=1.8;ctx.stroke();ctx.shadowBlur=0;ctx.font='19px serif';ctx.textAlign='center';ctx.fillText({coffee:'☕',dnd:'🛡',heal:'♥',goldenChappal:'🩴'}[type],0,7);
 }
 ctx.restore();
}
function levelOneExit(){
 const x=exitCell.x*T,y=exitCell.y*T,unlocked=hasGoldenKey;
 ctx.save();if(doorAnimation>0)ring(x+T*.5,y+T*.5,'#76ffbf',1-doorAnimation/1.25,26);ctx.shadowColor=unlocked?'#63ffb4':'#ffac77';ctx.shadowBlur=unlocked?18+6*Math.sin(clock*6):8;
 ctx.fillStyle='#101b35';rr(x+2,y-2,28,34,5);ctx.fill();
 const g=ctx.createLinearGradient(x,y,x+T,y+T);g.addColorStop(0,unlocked?'#81ffc9':'#a28399');g.addColorStop(1,unlocked?'#15946e':'#5d3855');ctx.fillStyle=g;ctx.save();if(unlocked)ctx.translate(3+Math.sin(clock*2)*2,0);rr(x+5,y+1,22,27,4);ctx.fill();ctx.restore();
 ctx.fillStyle='#eaf6ed';ctx.fillRect(x+12,y+5,7,10);ctx.fillStyle=unlocked?'#ffc86f':'#f5dc79';ctx.beginPath();ctx.arc(x+22,y+19,2,0,7);ctx.fill();ctx.strokeStyle='#f2d39a';ctx.lineWidth=2;ctx.strokeRect(x+3,y,T-6,T-6);
 if(unlocked){ctx.globalAlpha=.14+.1*Math.sin(clock*5);ctx.fillStyle='#87ffd2';ctx.beginPath();ctx.ellipse(x+19,y+15,20,27,0,0,7);ctx.fill();ctx.globalAlpha=1;}ctx.shadowBlur=0;ctx.fillStyle='#14243c';ctx.font='900 8px system-ui';ctx.textAlign='center';ctx.fillText(unlocked?'EXIT':'LOCK',x+16,y+27);ctx.restore();
}
function levelOneCreature(h){
 const px=h.x*T,py=h.y*T;ctx.save();ctx.translate(px,py);let wiggle=Math.sin(clock*14+h.phase);
 ctx.fillStyle='#030e20aa';ctx.beginPath();ctx.ellipse(0,9,15,5,0,0,7);ctx.fill();
 if(h.type==='snake'){
   let a=Math.atan2(h.dir?.[1]||0,h.dir?.[0]||1);ctx.rotate(a);ctx.lineCap='round';ctx.lineJoin='round';
   ctx.strokeStyle='#205a46';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-13,wiggle*4);ctx.quadraticCurveTo(-6,-9,0,0);ctx.quadraticCurveTo(6,9,11,0);ctx.stroke();
   ctx.strokeStyle='#6bea99';ctx.lineWidth=8;ctx.stroke();ctx.strokeStyle='#b4ffd0';ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle='#91f6ad';ctx.beginPath();ctx.ellipse(10,0,9,6,0,0,7);ctx.fill();
   ctx.fillStyle='#132f35';ctx.beginPath();ctx.arc(14,-2,1.7,0,7);ctx.fill();ctx.strokeStyle='#ff678b';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(18,1);ctx.lineTo(23,3+wiggle);ctx.stroke();
 }else{
   ctx.rotate(Math.sin(clock*5+h.phase)*.1);for(let leg=0;leg<3;leg++){ctx.strokeStyle='#7a3b6d';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-7+leg*7,2);ctx.lineTo(-11+leg*7,8+wiggle*2);ctx.moveTo(-7+leg*7,-2);ctx.lineTo(-11+leg*7,-8-wiggle*2);ctx.stroke()}
   ctx.fillStyle='#f9ab6c';ctx.beginPath();ctx.ellipse(0,0,11,9,0,0,7);ctx.fill();ctx.strokeStyle='#d15e77';ctx.lineWidth=1.6;ctx.stroke();ctx.strokeStyle='#a24b73';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,8);ctx.stroke();ctx.fillStyle='#26243c';ctx.beginPath();ctx.arc(5,-3,1.9,0,7);ctx.arc(5,3,1.9,0,7);ctx.fill();
 }
 ctx.restore();
}
function levelOneCharacter(name,x,y,hero){
 ctx.save();if(hero&&level===0){ctx.translate(x,y);ctx.rotate((lastPlayerStep.x||0)*.055*heroAnimation);ctx.translate(-x,-y);}const isMoving=hero?(keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight||keys.w||keys.a||keys.s||keys.d):true;
 const bounce=isMoving?Math.sin(clock*13+x*.1)*(2+heroAnimation):Math.sin(clock*2+x)*.6;
 const c=hero?['#ffbd65','#c66b2f']:['#75c4e7','#315a9e'];let size=hero?33:35;
 ctx.fillStyle='#02081795';ctx.beginPath();ctx.ellipse(x,y+18,15+heroAnimation*2,5,0,0,7);ctx.fill();
 // Feet and shoes with walking cycle.
 for(let side of [-1,1]){const stride=Math.sin(clock*12+side*Math.PI/2)*3;ctx.strokeStyle='#243f59';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+side*5,y+8);ctx.lineTo(x+side*6+stride,y+17);ctx.stroke();ctx.fillStyle='#f1e8d7';rr(x+side*7-5+stride,y+14,10,5,2);ctx.fill()}
 // Cartoon jacket and sleeves.
 const grad=ctx.createLinearGradient(x-13,y,x+12,y+13);grad.addColorStop(0,c[0]);grad.addColorStop(1,c[1]);ctx.fillStyle=grad;rr(x-12,y-1+bounce,24,16,7);ctx.fill();ctx.strokeStyle='#ffffff55';ctx.lineWidth=1;ctx.stroke();
 for(let side of [-1,1]){ctx.strokeStyle='#f4c3a4';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+side*10,y+2+bounce);ctx.lineTo(x+side*14,y+10+bounce+Math.sin(clock*9+side)*2);ctx.stroke()}
 ctx.fillStyle='#e9f5fc';ctx.fillRect(x-2,y+1+bounce,4,9);
 ctx.save();ctx.shadowColor=hero?'#ffe1a0':'#a2f1ff';ctx.shadowBlur=8;
 if(hero)face(name,x,y-12+bounce,size*.88);else pacFace(name,x,y-12+bounce,size*.95);
 ctx.restore();
 if(hero&&hitFlash>0){ctx.save();ctx.globalAlpha=hitFlash/.28;ctx.fillStyle='#ff8ca8';ctx.font='bold 19px system-ui';ctx.fillText('!',x+15,y-28);ctx.restore()}if(!hero&&harisMode==='reminder'){ctx.fillStyle='#ff4d75';ctx.beginPath();ctx.arc(x+13,y-29+bounce,5+Math.sin(clock*10)*1.5,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='900 9px system-ui';ctx.fillText('!',x+11,y-26+bounce)}
 ctx.restore();
}
