// HUD updates: health, boss mode badge, power notices.
function updateUI(){
 const bossStatus=document.getElementById('bossStatus'),modeBadge=document.getElementById('harisModeBadge');
 bossStatus.style.display=level===0?'flex':'none';
 modeBadge.className='boss-mode '+(harisMode==='reminder'?'reminder':'polite');
 modeBadge.textContent=harisMode==='reminder'?'🚨 REMINDER MODE':'💬 POLITE MODE';
 document.getElementById("healthFill").style.width=health+"%";document.getElementById("healthText").textContent=health+" / 100";document.getElementById("quest").innerHTML=level===0?(hasGoldenKey?"🔓 <b>KEY FOUND</b> · Reach the exit":"🔒 <b>EXIT LOCKED</b> · Find the golden key"):"🎯 Find the exit and finish your objectives";let l=LEVELS[level];document.getElementById('hud').textContent=`LV ${level+1} · ${score} PTS`;document.getElementById('lifeCount').textContent=hearts;document.getElementById('stage').textContent=`LEVEL ${level+1}: ${l.title}`;document.getElementById('description').textContent=l.description;document.getElementById('bosses').innerHTML=l.bosses.map(n=>`<img title="${n}" src="${PHOTOS[n]}">`).join('');document.getElementById('skills').innerHTML=LEVELS.map((l,i)=>`<div class="skill ${unlocked.includes(i)?'on':''}">${unlocked.includes(i)?'✓':'○'} ${l.skill}</div>`).join('')}
let powerText='',powerTextTime=0;
function showPowerText(t){
 powerText=t;powerTextTime=2;
 const el=document.getElementById('activityNotice');
 el.textContent=t;el.classList.add('visible');
}
