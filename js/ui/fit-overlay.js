// Keeps overlay screens (start, cutscenes, victory, results, game over) fully
// visible inside the game box. The canvas now scales to the window, so on
// shorter screens a panel can be taller than the box; when that happens the
// panel is zoomed down just enough to fit, so its buttons are never cut off.
(function(){
 let queued=false;
 function fitOverlay(){
  queued=false;
  panel.style.zoom='';
  if(ov.classList.contains('hidden'))return;
  const cs=getComputedStyle(ov);
  const room=ov.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const need=panel.scrollHeight;
  if(room>0&&need>room)panel.style.zoom=String(Math.max(.5,room/need));
 }
 function queueFit(){if(!queued){queued=true;requestAnimationFrame(fitOverlay)}}
 new MutationObserver(queueFit).observe(panel,{childList:true,subtree:true,characterData:true});
 new MutationObserver(queueFit).observe(ov,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',queueFit);
 queueFit();
})();
