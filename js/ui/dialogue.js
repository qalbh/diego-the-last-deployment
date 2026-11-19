// Speech in the HUD dialogue strip (never drawn over the maze).
function comeback(index){
 if(level!==0 || phase!=='playing')return;
 lastDiegoQuip=index;
 speakLine('diego',DIEGO_COMEBACKS[index]);
}
function speakLine(name,line){
 const pic=document.getElementById('speakerpic');pic.src=PHOTOS[name];
 document.getElementById('speaker').textContent=name.toUpperCase();
 document.getElementById('speech').textContent=line;
 document.getElementById('dialogue').style.display='flex';document.getElementById('dialogue').classList.remove('talking');void document.getElementById('dialogue').offsetWidth;document.getElementById('dialogue').classList.add('talking');
 dialogueTime=Math.min(7,Math.max(3.2,line.length/20));dialogueCooldown=3.5;
}
function speak(name,forced=false,kind='attack',index=null){if(!forced&&dialogueCooldown>0)return;let groups=QUOTES[name]||QUOTES.diego;let q=groups[kind]||groups.attack;let line=index===null?q[Math.floor(Math.random()*q.length)]:q[index%q.length];document.getElementById('speakerpic').src=PHOTOS[name];document.getElementById('speaker').textContent=name.toUpperCase();document.getElementById('speech').textContent=line;document.getElementById('dialogue').style.display='flex';document.getElementById('dialogue').classList.remove('talking');void document.getElementById('dialogue').offsetWidth;document.getElementById('dialogue').classList.add('talking');dialogueTime=Math.min(7,Math.max(3.2,line.length/23));dialogueCooldown=forced?1.5:3.4}
