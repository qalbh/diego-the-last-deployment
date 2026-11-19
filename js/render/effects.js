// Particles, rings and ambient office effects.

function burst(x,y,color='#76ffe1',count=12,force=1){if(level>2)return;for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=(28+Math.random()*85)*force;effects.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+Math.random()*.55,max:.95,size:1.5+Math.random()*3,color})}if(effects.length>200)effects.splice(0,effects.length-200)}
function drawEffects(){ctx.save();for(const e of effects){ctx.globalAlpha=Math.max(0,e.life/e.max);ctx.fillStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=6;ctx.beginPath();ctx.arc(e.x,e.y,e.size,0,Math.PI*2);ctx.fill()}ctx.restore()}
function ring(x,y,color,age,radius=24){ctx.save();ctx.globalAlpha=Math.max(0,1-age);ctx.strokeStyle=color;ctx.lineWidth=3*age+1;ctx.shadowColor=color;ctx.shadowBlur=13;ctx.beginPath();ctx.arc(x,y,radius+(1-age)*16,0,Math.PI*2);ctx.stroke();ctx.restore()}
function drawOfficeAtmosphere(){ctx.save();for(let i=0;i<18;i++){const x=(i*137+Math.sin(clock*.32+i)*16)%800,y=(i*89+clock*(1+i%3)*4)%576;ctx.globalAlpha=.07+Math.sin(clock+i)*.025;ctx.fillStyle=i%2?'#a1dbff':'#e3b8ff';ctx.beginPath();ctx.arc(x,y,1.5+i%3,0,7);ctx.fill()}ctx.restore()}
