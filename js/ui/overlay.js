// Overlay panel helpers used by menus and cutscenes.
function show(html){panel.classList.remove('victory-panel');panel.innerHTML=html;ov.classList.remove('hidden')}function hide(){ov.classList.add('hidden')};function button(text,fn){let b=document.createElement('button');b.className='btn';b.textContent=text;b.onclick=fn;panel.appendChild(b)}
function scenePortrait(name){return `<div class="scene-person"><img alt="${name}" src="${PHOTOS[name]}"><span>${name.toUpperCase()}</span></div>`;}
function sceneButtons(primary, action, allowSkip=true){
 const row=document.createElement('div');row.className='scene-actions';
 const b=document.createElement('button');b.className='btn';b.textContent=primary;b.onclick=action;row.appendChild(b);
 if(allowSkip){const skip=document.createElement('button');skip.className='btn secondary';skip.textContent='⏭ SKIP CUTSCENE';skip.onclick=beginLevelOne;row.appendChild(skip)}
 panel.appendChild(row);
}
