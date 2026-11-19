// Level 1 intro cutscene, same-maze retry, victory scene and results.
function showLevelIntro(n){
 if(n!==0){phase='playing';hide();return}
 phase='cutscene';levelOneSceneStep=0;renderLevelOneIntro();
}
function renderLevelOneIntro(){
 if(levelOneSceneStep===0){
  show(`<div class="scene-label">BRIJ FAREWELL ARCADE · EPISODE 1/5</div><h2>THE LAST DAY AT BRIJ</h2><div class="scene-people">${scenePortrait('diego')}${scenePortrait('haris')}</div><div class="scene-card"><p class="scene-quote">Diego is one hallway away from freedom, until Haris arrives with one last perfectly reasonable request.</p></div><small>LEVEL 1 · HARIS, THE TICKET MASTER</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelOneSceneStep=1;renderLevelOneIntro()});
 }else if(levelOneSceneStep===1){
  show(`<div class="scene-label">INCOMING KIND REMINDER</div><div class="scene-people">${scenePortrait('haris')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.haris.intro[0]}”</p></div><small>Haris has entered the chat. Escape status: pending.</small>`);
  sceneButtons('CONTINUE ▶',()=>{levelOneSceneStep=2;renderLevelOneIntro()});
 }else{
  show(`<div class="scene-label">DIEGO HAS A PLAN</div><div class="scene-people">${scenePortrait('diego')}</div><div class="scene-card"><p class="scene-quote">“${QUOTES.diego.intro[0]}”</p></div><h2>MISSION 1: ESCAPE THE BACKLOG!</h2><p>🔑 Find the golden key · 🚪 Reach the exit · 🩴 Survive Haris</p><small>Arrows / WASD to move · SPACE to disappear · F to throw a chappal</small>`);
  sceneButtons('▶ BEGIN LEVEL 1',beginLevelOne,false);
 }
}
function beginLevelOne(){
 if(level!==0)return;
 phase='playing';hide();dialogueCooldown=2.2;diegoTicketCount=0;
 document.getElementById('dialogue').style.display='none';updateUI();
}
function copyLevelOneState(){
 return JSON.parse(JSON.stringify({grid,exitCell,goldenKey,pickups,coins,hazards,enemies}));
}
function restoreLevelOneState(){
 const saved=JSON.parse(JSON.stringify(levelOneSnapshot));
 grid=saved.grid;exitCell=saved.exitCell;goldenKey=saved.goldenKey;
 pickups=saved.pickups;coins=saved.coins;hazards=saved.hazards;enemies=saved.enemies;
}
function replayLevelOne(){startLevel(0,true)}
function levelOneVictoryScene(){
 phase='victoryScene';victoryFanfare();
 const palette=['#6ff6c1','#a8b8ff','#ffdf7d','#79d6ff','#ff9cba'];
 const confetti=Array.from({length:46},(_,i)=>{
   const left=(i*47+13)%100,delay=(i*0.19)%2.4, duration=3.1+(i%7)*0.33;
   return `<i class="victory-confetti" style="--x:${left}%;--delay:${delay}s;--duration:${duration}s;--tilt:${(i%2?1:-1)*(35+i%5*17)}deg;--color:${palette[i%palette.length]}"></i>`;
 }).join('');
 const bursts=Array.from({length:3},(_,j)=>`<div class="victory-firework firework-${j+1}">${Array.from({length:12},(_,i)=>`<b style="--angle:${i*30}deg;--distance:${62+j*20}px;--delay:${j*.35}s"></b>`).join('')}</div>`).join('');
 show(`<div class="victory-experience"><div class="victory-particles" aria-hidden="true">${confetti}${bursts}</div><div class="victory-orbit" aria-hidden="true"></div><div class="victory-kicker"><span class="victory-status-light"></span> MISSION 01 COMPLETE <span class="victory-separator">/</span> ESCAPE APPROVED</div><div class="victory-medal" aria-hidden="true">🏆</div><h2 class="victory-headline">HARIS HAS BEEN<br><em>ESCAPED!</em></h2><div class="victory-ribbon"><span>🎫 TICKET BACKLOG</span><strong>DEFEATED</strong><span>🚪 FREEDOM UNLOCKED</span></div><div class="victory-faceoff">${scenePortrait('haris')}<div class="victory-vs">VS <span>✓</span></div>${scenePortrait('diego')}</div><div class="victory-conversation"><p><b>HARIS</b><span>“${QUOTES.haris.defeated[0]}”</span></p><p><b>DIEGO</b><span>“${DIEGO_COMEBACKS[3]}”</span></p></div><div class="victory-tagline">One ticket closed. Only approximately a million left.</div><div class="victory-next-label">THE NEXT CHAPTER IS READY</div></div>`);
 sceneButtons('✨ UNLOCK DIEGO AI SKILL',levelOneResults,false);
 panel.classList.add('victory-panel');
}
function levelOneResults(){
 phase='win';if(!unlocked.includes(0))unlocked.push(0);updateUI();
 const stars=clock<120?3:clock<180?2:1;
 show(`<div class="cinematic-kicker">BOSS DEFEATED · DIEGO AI 1 / 5</div><h2 class="cinematic-title">LEVEL 1 CLEARED!</h2><div class="cinematic-sparkles">${'★'.repeat(stars)}</div><div class="cinematic-stats"><div><strong>${Math.floor(clock/60)}:${String(Math.floor(clock%60)).padStart(2,'0')}</strong><span>ESCAPE TIME</span></div><div><strong>${health}%</strong><span>HEALTH LEFT</span></div><div><strong>${stats.defeated}</strong><span>ENEMIES DEFEATED</span></div></div><div class="cinematic-skill"><div class="cinematic-kicker">🤖 DIEGO AI MODULE INSTALLED</div><h2>✓ TICKET INTELLIGENCE</h2><p>Sorts tickets, automates follow-ups and survives kind reminders.</p><b style="color:#90ffb5">BUILD PROGRESS: 1 / 5 MODULES</b></div><p>Haris: “${QUOTES.haris.defeated[0]}”</p>`);
 sceneButtons('▶ NEXT LEVEL: EREN & JAKE',()=>startLevel(1),false);
}
