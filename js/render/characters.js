// Photo-head characters and Pac-Man boss faces.
function character(name,x,y,size=30,hero=false){if(level===0){levelOneCharacter(name,x,y,hero);return;}ctx.save();let bounce=Math.sin(clock*10+x)*2;let torso=size*.76;ctx.fillStyle='#050a1a88';ctx.beginPath();ctx.ellipse(x,y+size*.65,size*.48,5,0,0,Math.PI*2);ctx.fill();ctx.lineWidth=4;ctx.lineCap='round';ctx.strokeStyle=hero?'#a1a7ff':name==='zoofi'?'#ff9fd0':'#b7c7ee';ctx.beginPath();ctx.moveTo(x-5,y+size*.32);ctx.lineTo(x-7,y+size*.65+bounce);ctx.moveTo(x+5,y+size*.32);ctx.lineTo(x+7,y+size*.65-bounce);ctx.stroke();ctx.fillStyle=hero?'#6255d7':name==='zoofi'?'#b23c83':'#324f91';ctx.beginPath();ctx.roundRect(x-torso/2,y-2,torso,size*.48,6);ctx.fill();ctx.strokeStyle='#e5b39c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-torso/2,y+4);ctx.lineTo(x-torso*.7,y+size*.2+bounce);ctx.moveTo(x+torso/2,y+4);ctx.lineTo(x+torso*.7,y+size*.2-bounce);ctx.stroke();if(hero)face(name,x,y-size*.30,size*.8);else pacFace(name,x,y-size*.30,size*.92);ctx.restore()}
function face(name,x,y,size=28){ctx.save();ctx.beginPath();ctx.arc(x,y,size/2,0,Math.PI*2);ctx.clip();let im=faces[name];if(im&&im.complete)ctx.drawImage(im,x-size/2,y-size/2,size,size);else{ctx.fillStyle='#bd81ef';ctx.fillRect(x-size/2,y-size/2,size,size)}ctx.restore();ctx.strokeStyle='#e2c4ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,size/2,0,Math.PI*2);ctx.stroke()}
function pacFace(name,x,y,size){
 const radius=size/2, angle=.18+.24*(.5+.5*Math.sin(clock*11+x));
 const actor=enemies.find(e=>e.name===name);
 const heading=actor?.target?Math.atan2(actor.target.y+.5-actor.y,actor.target.x+.5-actor.x):0;
 ctx.save();ctx.translate(x,y);ctx.rotate(heading);
 // Pac-Man silhouette, with the teammate's actual face clipped inside it.
 ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,radius,angle,Math.PI*2-angle);ctx.closePath();ctx.clip();
 ctx.fillStyle='#ffdb49';ctx.fillRect(-radius,-radius,size,size);
 const im=faces[name];if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,-radius,-radius,size,size);
 ctx.restore();
 ctx.save();ctx.translate(x,y);ctx.rotate(heading);ctx.strokeStyle='#ffdf55';ctx.lineWidth=2.5;
 ctx.beginPath();ctx.arc(0,0,radius,angle,Math.PI*2-angle);ctx.stroke();ctx.restore();
}
