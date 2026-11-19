// Synthesized arcade sound effects (Web Audio, no files).
let soundCtx=null;
function arcadeSound(type){try{
 soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume();
 const presets={hit:[[190,100,.13],[130,70,.13]],pickup:[[440,660,.08],[660,880,.09]],key:[[500,800,.12],[800,1040,.16]],mode:[[240,360,.12]],win:[[540,780,.13],[780,1040,.13],[1040,1300,.16]]};
 let time=soundCtx.currentTime;for(const [a,b,length] of presets[type]||[]){const osc=soundCtx.createOscillator(),gain=soundCtx.createGain();osc.type=type==='hit'?'sawtooth':'square';osc.frequency.setValueAtTime(a,time);osc.frequency.exponentialRampToValueAtTime(Math.max(20,b),time+length);gain.gain.setValueAtTime(.065,time);gain.gain.exponentialRampToValueAtTime(.001,time+length);osc.connect(gain).connect(soundCtx.destination);osc.start(time);osc.stop(time+length);time+=length*.8;}
 }catch(e){/* audio unavailable, game remains playable */}}

// Level 1 escape fanfare (original): a rising run, a "ta-da" pickup, then a
// bright held chord with a bass note and a sprinkle of sparkles. About 2.2s.
function victoryFanfare(){try{
 soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume();
 const t0=soundCtx.currentTime+.05,master=soundCtx.createGain();master.gain.value=.9;master.connect(soundCtx.destination);
 const note=(freq,start,len,type='square',vol=.06)=>{
  const o=soundCtx.createOscillator(),g=soundCtx.createGain(),a=t0+start;
  o.type=type;o.frequency.setValueAtTime(freq,a);
  g.gain.setValueAtTime(.0001,a);g.gain.exponentialRampToValueAtTime(vol,a+.015);
  g.gain.setValueAtTime(vol,a+len*.6);g.gain.exponentialRampToValueAtTime(.0001,a+len);
  o.connect(g).connect(master);o.start(a);o.stop(a+len+.02);
 };
 [[523,0],[659,.09],[784,.18],[1047,.27]].forEach(([f,s])=>note(f,s,.12));       // rising run C E G C
 note(784,.45,.1);note(880,.56,.1);note(988,.67,.12);                           // ta-da pickup G A B
 for(const f of [1047,1319,1568])note(f,.82,1.3,'square',.035);                 // final C major chord
 note(1047,.82,1.4,'triangle',.07);note(262,.82,1.2,'triangle',.09);             // warmth + bass
 [2093,2637,2349,3136,2794,3520].forEach((f,i)=>note(f,.95+i*.11,.08,'triangle',.025)); // sparkles
}catch(e){/* audio unavailable, game remains playable */}}

// Level 1 movement "chomp": a soft two-tone blip that alternates pitch each step.
// Driven by distance actually travelled, so walking into a wall stays silent
// and the rhythm speeds up naturally with the coffee boost.
const STEP_EVERY=.7; // tiles travelled per chomp
let stepDistance=STEP_EVERY,stepAlt=false;
function footstep(moved){
 if(level>2||phase!=='playing')return;
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
