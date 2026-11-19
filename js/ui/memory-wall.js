// The Memory Wall: the last heartfelt screen of the game (after the Diego
// Succession Plan). Content lives in js/data/memories.js.
//
// Layout (inside the game overlay, never over gameplay):
//  - a photo board of polaroids on the left (click one to see it large),
//  - a wall of sticky notes on the right, one per message (click to read it),
//  - a reader that opens over the wall with ‹ › / arrow keys and Esc to close.
// The wall fills the overlay and scrolls inside itself, so it is never zoomed
// down to an unreadable size by fit-overlay.js.

const MW_NOTE_COLORS=['#ffe9a8','#ffd1e8','#c9f5e3','#d6e4ff','#ffe0c7','#e6d6ff','#d2f4ff','#fff3b8'];
let mwView=null; // {kind:'note'|'photo', index}

function mwEsc(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function mwInitials(name){return name.split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()}
function mwAvatar(m,big){
 const cls='mw-avatar'+(big?' big':'');
 if(m.photo&&PHOTOS[m.photo])return `<img class="${cls}" src="${PHOTOS[m.photo]}" alt="${mwEsc(m.name)}">`;
 const hue=[...m.name].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
 return `<span class="${cls} mw-initials" style="--h:${hue}">${mwEsc(mwInitials(m.name))}</span>`;
}
// Message text: blank line = new paragraph, "## " = heading, "- " = bullet.
function mwFormat(text){
 let html='',list=false,para=[];
 const flushPara=()=>{if(para.length){html+=`<p>${para.map(mwEsc).join('<br>')}</p>`;para=[]}};
 const closeList=()=>{if(list){html+='</ul>';list=false}};
 for(const raw of text.split('\n')){const line=raw.trim();
  if(!line){flushPara();closeList();continue}
  if(line.startsWith('## ')){flushPara();closeList();html+=`<h4>${mwEsc(line.slice(3))}</h4>`;continue}
  if(line.startsWith('- ')){flushPara();if(!list){html+='<ul>';list=true}html+=`<li>${mwEsc(line.slice(2))}</li>`;continue}
  closeList();para.push(line);
 }
 flushPara();closeList();return html;
}

function memoryWall(){
 phase='final';mwView=null;
 const msgs=MEMORIES.messages||[],photos=MEMORIES.photos||[];
 const tilt=i=>[-3,2.5,-1.5,3,-2,1.5][i%6];
 const polaroids=photos.map((p,i)=>`<button class="mw-polaroid" style="--r:${tilt(i)}deg;--d:${.15+i*.12}s" data-photo="${i}" aria-label="Open photo: ${mwEsc(p.caption||'')}"><img src="${mwEsc(p.src)}" alt="${mwEsc(p.caption||'')}" loading="lazy"><span>${mwEsc(p.caption||'')}</span></button>`).join('');
 const notes=msgs.map((m,i)=>`<button class="mw-note" style="--c:${MW_NOTE_COLORS[i%MW_NOTE_COLORS.length]};--r:${(i%2?1:-1)*(.6+(i%3)*.5)}deg;--d:${.1+i*.06}s" data-note="${i}"><span class="mw-pin" aria-hidden="true"></span><span class="mw-note-head">${mwAvatar(m)}<span><b>${mwEsc(m.name)}</b>${m.role?`<small>${mwEsc(m.role)}</small>`:''}</span></span><q>${mwEsc(m.highlight||'')}</q><span class="mw-read">Read message ›</span></button>`).join('');
 show(`<div class="mw"><header class="mw-head"><div class="cinematic-kicker">THANK YOU, DIEGO</div><h2 class="mw-title">💜 THE MEMORY WALL</h2><p class="mw-sub">${msgs.length} messages and ${photos.length} photos from the Brij team. Tap a note to read it.</p></header><div class="mw-body"><div class="mw-photos">${polaroids}</div><div class="mw-notes">${notes}</div></div><p class="mw-farewell"><b>DIEGO:</b> “${QUOTES.diego.defeated[0]}”</p><div class="mw-reader" hidden></div></div>`);
 sceneButtons('😂 ONE LAST THING...',finalEscape,false);
 panel.classList.add('finale-panel','memory-panel');
 panel.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>mwOpen('note',+b.dataset.note));
 panel.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>mwOpen('photo',+b.dataset.photo));
}

function mwOpen(kind,index){
 const list=kind==='note'?MEMORIES.messages:MEMORIES.photos,n=list.length;
 index=(index+n)%n;mwView={kind,index};
 const r=panel.querySelector('.mw-reader');if(!r)return;
 let inner;
 if(kind==='note'){const m=list[index];
  inner=`<article class="mw-sheet" style="--c:${MW_NOTE_COLORS[index%MW_NOTE_COLORS.length]}"><header>${mwAvatar(m,true)}<div><b>${mwEsc(m.name)}</b>${m.role?`<small>${mwEsc(m.role)}</small>`:''}</div></header><div class="mw-text">${mwFormat(m.text)}</div></article>`;
 }else{const p=list[index];
  inner=`<figure class="mw-photo-view"><img src="${mwEsc(p.src)}" alt="${mwEsc(p.caption||'')}"><figcaption>${mwEsc(p.caption||'')}</figcaption></figure>`;
 }
 r.innerHTML=`<div class="mw-reader-inner">${inner}<nav class="mw-nav"><button class="mw-prev" aria-label="Previous">‹</button><span>${index+1} / ${n}</span><button class="mw-next" aria-label="Next">›</button><button class="mw-close">✕ Back to the wall</button></nav></div>`;
 r.hidden=false;
 r.querySelector('.mw-prev').onclick=()=>mwOpen(kind,index-1);
 r.querySelector('.mw-next').onclick=()=>mwOpen(kind,index+1);
 r.querySelector('.mw-close').onclick=mwClose;
 r.onclick=e=>{if(e.target===r)mwClose()};
 const t=r.querySelector('.mw-text');if(t)t.scrollTop=0;
}
function mwClose(){mwView=null;const r=panel.querySelector('.mw-reader');if(r){r.hidden=true;r.innerHTML=''}}
document.addEventListener('keydown',e=>{
 if(!mwView||!panel.querySelector('.mw-reader:not([hidden])'))return;
 if(e.key==='ArrowLeft'){e.preventDefault();mwOpen(mwView.kind,mwView.index-1)}
 else if(e.key==='ArrowRight'){e.preventDefault();mwOpen(mwView.kind,mwView.index+1)}
 else if(e.key==='Escape'){e.preventDefault();mwClose()}
});
