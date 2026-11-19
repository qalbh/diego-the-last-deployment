// Synthesized arcade sound effects (Web Audio, no files).
let soundCtx=null;
function arcadeSound(type){try{
 soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume();
 const presets={hit:[[190,100,.13],[130,70,.13]],pickup:[[440,660,.08],[660,880,.09]],key:[[500,800,.12],[800,1040,.16]],mode:[[240,360,.12]],win:[[540,780,.13],[780,1040,.13],[1040,1300,.16]]};
 let time=soundCtx.currentTime;for(const [a,b,length] of presets[type]||[]){const osc=soundCtx.createOscillator(),gain=soundCtx.createGain();osc.type=type==='hit'?'sawtooth':'square';osc.frequency.setValueAtTime(a,time);osc.frequency.exponentialRampToValueAtTime(Math.max(20,b),time+length);gain.gain.setValueAtTime(.065,time);gain.gain.exponentialRampToValueAtTime(.001,time+length);osc.connect(gain).connect(soundCtx.destination);osc.start(time);osc.stop(time+length);time+=length*.8;}
 }catch(e){/* audio unavailable, game remains playable */}}

// Level 1 movement "chomp": a soft two-tone blip that alternates pitch each step.
// Driven by distance actually travelled, so walking into a wall stays silent
// and the rhythm speeds up naturally with the coffee boost.
const STEP_EVERY=.7; // tiles travelled per chomp
let stepDistance=STEP_EVERY,stepAlt=false;
function footstep(moved){
 if(level!==0||phase!=='playing')return;
 if(!moved){stepDistance=STEP_EVERY;return} // next move chomps immediately
 stepDistance+=moved;if(stepDistance<STEP_EVERY)return;
 stepDistance=0;stepAlt=!stepAlt;
 try{
  soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume();
  const t=soundCtx.currentTime,osc=soundCtx.createOscillator(),gain=soundCtx.createGain(),len=.075;
  osc.type='triangle';
  osc.frequency.setValueAtTime(stepAlt?500:380,t);osc.frequency.exponentialRampToValueAtTime(stepAlt?290:210,t+len);
  gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.05,t+.01);gain.gain.exponentialRampToValueAtTime(.0001,t+len);
  osc.connect(gain).connect(soundCtx.destination);osc.start(t);osc.stop(t+len+.01);
 }catch(e){/* audio unavailable, game remains playable */}
}
