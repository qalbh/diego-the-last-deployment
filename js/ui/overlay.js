// Overlay panel helpers used by menus and cutscenes.
function show(html){panel.classList.remove('victory-panel','finale-panel','memory-panel');panel.innerHTML=html;ov.classList.remove('hidden')}// Victory-scene conversation rows: [speaker, line, isDiego]. Diego's rows are highlighted.
function victoryChat(lines){return `<div class="victory-conversation">${lines.map(([who,line,me])=>`<p${me?' class="diego-line"':''}><b>${who}</b><span>“${line}”</span></p>`).join('')}</div>`}
function hide(){ov.classList.add('hidden')};function button(text,fn){let b=document.createElement('button');b.className='btn';b.textContent=text;b.onclick=fn;panel.appendChild(b)}
function scenePortrait(name){return `<div class="scene-person"><img alt="${name}" src="${PHOTOS[name]}"><span>${name.toUpperCase()}</span></div>`;}
function sceneButtons(primary, action, allowSkip=true, skipAction=beginLevelOne){
 const row=document.createElement('div');row.className='scene-actions';
 const b=document.createElement('button');b.className='btn';b.textContent=primary;b.onclick=action;row.appendChild(b);
 if(allowSkip){const skip=document.createElement('button');skip.className='btn secondary';skip.textContent='⏭ SKIP CUTSCENE';skip.onclick=skipAction;row.appendChild(skip)}
 panel.appendChild(row);
}
