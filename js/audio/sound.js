// Synthesized arcade sound effects (Web Audio, no files).
let soundCtx=null;
function arcadeSound(type){try{
 soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume();
 const presets={hit:[[190,100,.13],[130,70,.13]],pickup:[[440,660,.08],[660,880,.09]],key:[[500,800,.12],[800,1040,.16]],mode:[[240,360,.12]],win:[[540,780,.13],[780,1040,.13],[1040,1300,.16]]};
 let time=soundCtx.currentTime;for(const [a,b,length] of presets[type]||[]){const osc=soundCtx.createOscillator(),gain=soundCtx.createGain();osc.type=type==='hit'?'sawtooth':'square';osc.frequency.setValueAtTime(a,time);osc.frequency.exponentialRampToValueAtTime(Math.max(20,b),time+length);gain.gain.setValueAtTime(.065,time);gain.gain.exponentialRampToValueAtTime(.001,time+length);osc.connect(gain).connect(soundCtx.destination);osc.start(time);osc.stop(time+length);time+=length*.8;}
 }catch(e){/* audio unavailable, game remains playable */}}
