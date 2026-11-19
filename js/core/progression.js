// Starting levels, winning, and the finale.
function startLevel(n,retrySame=false){hitToastTime=0;document.getElementById("hitToast").classList.remove("visible");ghost=0;ghostCooldown=0;throwCooldown=0;throws=[];facing=[1,0];hasGoldenKey=false;goldenKey=null;pickups=[];coffeeBoost=0;dndCharges=0;harisMode="polite";harisModeClock=0;harisBubbleTime=0;hitFlash=0;effects=[];doorAnimation=0;heroAnimation=0;stats={hits:0,defeated:0};document.querySelector(".game").classList.remove("hit-flash");level=n;hearts=4;health=100;shield=0;paused=false;grid=createMaze(n);player={x:1.5,y:1.5,inv:0};coins=[];projectiles=[];enemies=[];hazards=[];clock=0;dialogueTime=0;dialogueCooldown=1;document.getElementById('dialogue').style.display='none';for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++)if(!grid[y][x]&&reachable(grid,1,1).has(y*COLS+x)&&Math.abs(x-1)+Math.abs(y-1)>3&&(x*7+y*11+n)%4===0&&!(n===0&&Math.abs(x-exitCell.x)+Math.abs(y-exitCell.y)<2)&&!(x>COLS-5&&y>ROWS-5))coins.push({x:x+.5,y:y+.5});if(n===0)placeLevelOneObjects();let safe=reachable(grid,1,1);let kinds=THEMES[n].hazards;let target=n===0?3:7+n*4;for(let y=2;y<ROWS-2;y++)for(let x=2;x<COLS-2;x++)if(hazards.length<target&&!grid[y][x]&&safe.has(y*COLS+x)&&Math.abs(x-1)+Math.abs(y-1)>6&&!(x>COLS-6&&y>ROWS-6)&&!(n===0&&((goldenKey&&Math.hypot(x+.5-goldenKey.x,y+.5-goldenKey.y)<2)||pickups.some(p=>Math.hypot(x+.5-p.x,y+.5-p.y)<1.7)))&&(x*19+y*23+n*17)%11===0)hazards.push({x:x+.5,y:y+.5,type:n===0?(hazards.length%2===0?'snake':'bug'):(hazards.length%3===0?'bug':kinds[hazards.length%kinds.length]),phase:Math.random()*6.28,dir:[1,0],turn:0,speed:(hazards.length%2===0?.88:1.06)+n*.17});
let spots=n===0?[[exitCell.x,exitCell.y]]:[[22,2],[21,14],[12,12]];spots=spots.map(([x,y])=>{if(!grid[y][x])return [x,y];let cells=[...safe].map(k=>[k%COLS,Math.floor(k/COLS)]).filter(([a,b])=>Math.abs(a-1)+Math.abs(b-1)>12);return cells[Math.floor(Math.random()*cells.length)]||[22,2]});LEVELS[n].bosses.forEach((name,i)=>enemies.push({name,x:spots[i][0]+.5,y:spots[i][1]+.5,shot:1.2+i*.7,move:0,dir:[0,0],pathTimer:0}));if(n===0){
 if(retrySame && levelOneSnapshot){restoreLevelOneState()}else{levelOneSnapshot=copyLevelOneState()}
 showLevelIntro(0);
}else if(n===1){
 startLevelTwo(retrySame);
}else if(n===2){
 startLevelThree(retrySame);
}else if(n===3){
 startLevelFour(retrySame);
}else if(n===4){
 startLevelFive(retrySame);
}else{
 phase='playing';hide();
 // Existing introductions and dialogue for future levels remain intact.
 setTimeout(()=>{if(phase==='playing'&&level===n)speak(LEVELS[n].bosses[0],true,'intro')},500);
}
updateUI();}
function win(){if(level===0){levelOneVictoryScene();return;}if(level===1){levelTwoVictoryScene();return;}if(level===2){levelThreeVictoryScene();return;}if(level===3){levelFourVictoryScene();return;}if(level===4){levelFiveVictoryScene();return;}phase='win';arcadeSound("win");if(!unlocked.includes(level))unlocked.push(level);updateUI();let l=LEVELS[level];show(`<div style="font-size:50px">🏆</div><h2>LEVEL ${level+1} CLEARED!</h2><p>You escaped <b>${l.name}</b>.</p>${level===0?`<p>⏱️ Escape time: <b>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,"0")}</b> · ❤️ Remaining: <b>${health}%</b> · 🩴 Enemies defeated: <b>${stats.defeated}</b></p>`:""}<div class="finalmsg">${l.bosses.map(n=>`<p><b>${n.toUpperCase()}:</b> ${QUOTES[n].defeated[0]}</p>`).join('')}${level===2?'<p><b>DIEGO:</b> Mom Zoofi</p>':''}</div><div class="finalmsg" style="border-color:#70f8a0;background:#173a42">🤖 <b>DIEGO AI MODULE INSTALLED</b><br>⚡ SKILL UNLOCKED: <b>${l.skill}</b><br>${level===0?"Ticket Management: Automates follow-ups, sorts the backlog and survives kind reminders.":"New capability added to Diego AI."}<br>Diego AI build: ${unlocked.length}/5 modules installed</div><p>${level===2?'QA found the bugs. Engineering assigned them to Diego. Diego somehow survived.':level===3?'Ali has finally approved the documentation handoff.':level===4?'Zack has approved the final deployment. Freedom awaits!':'Another obstacle defeated. The exit is getting closer!'}</p>`);button(level===4?'🤖 INITIALIZE DIEGO AI':'▶ NEXT LEVEL',()=>level===4?finale():startLevel(level+1))}
// The finale now lives in js/levels/level5.js (Diego Succession Plan, then the Memory Wall).
function finale(){successionPlan()}
