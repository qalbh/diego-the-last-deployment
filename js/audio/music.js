// Light background music, one original looping tune per level (Web Audio, no files).
//
// Each track is an 8-bar loop: a soft melody, a quiet chord arpeggio, a bass note
// on beats 1 and 3, and a very light hi-hat. Music plays only while a level is
// being played (not in cutscenes, results or pause, so the victory fanfare stays
// clean), sits well under the sound effects, and M turns it on or off (remembered).
//
// Melody tokens are scale degrees of the track's key (0 = root, 7 = root an octave
// up), "-" is a rest and "_" holds the previous note for another eighth note.

const MUSIC_TRACKS=[
 { // Level 1, Haris: bright and bouncy (C major)
  bpm:104,root:60,scale:[0,2,4,5,7,9,11],chords:[0,4,5,3],wave:'triangle',melVol:.05,arpVol:.018,
  melody:'7 - 4 - 2 4 - - 6 - 4 - 1 4 - - 5 - 7 - 9 7 5 - 5 4 3 - 2 _ _ - 2 3 4 - 4 5 4 - 4 3 1 - 6 _ - - 5 4 2 - 4 5 7 - 8 7 5 4 7 _ _ -'},
 { // Level 2, Eren & Jake: mellow and dreamy (D dorian)
  bpm:98,root:62,scale:[0,2,3,5,7,9,10],chords:[0,3,6,0],wave:'sine',melVol:.06,arpVol:.02,
  melody:'4 - 2 - 0 - 2 4 5 _ 3 - 1 - 3 - 4 - 6 - 8 6 4 - 2 _ 1 0 - - - - 7 - 7 6 4 - 2 - 3 4 5 - 6 5 3 - 2 4 6 - 8 _ 6 - 7 6 4 2 0 _ - -'},
 { // Level 3, Zoofi, Sush & Arqam: a bit more driving (E minor)
  bpm:116,root:64,scale:[0,2,3,5,7,8,10],chords:[0,5,2,6],wave:'triangle',melVol:.05,arpVol:.018,
  melody:'7 7 - 6 4 - 3 4 5 - 4 - 2 _ - - 4 4 - 2 4 6 7 - 6 - 4 - 6 _ - - 9 - 7 - 6 7 - 4 7 - 5 - 4 _ - - 2 4 6 - 7 6 4 - 3 _ 4 _ 6 _ - -'},
 { // Level 4, Ali: techy arpeggios (F major, minor-leaning progression)
  bpm:108,root:65,scale:[0,2,4,5,7,9,11],chords:[5,3,0,4],wave:'square',melVol:.026,arpVol:.016,
  melody:'- 5 - 7 - 9 7 - - 3 - 5 - 7 _ - - 4 - 7 9 _ 7 - 8 _ 6 - 4 - - - 9 - 8 - 7 - 5 - 7 _ 5 - 3 - 5 - 4 _ 2 4 7 - 9 - 8 7 6 _ 4 _ - -'},
 { // Level 5, Zack: epic but still light (C minor)
  bpm:120,root:60,scale:[0,2,3,5,7,8,10],chords:[0,5,2,6],wave:'triangle',melVol:.055,arpVol:.02,
  melody:'7 - 7 - 9 - 7 6 7 _ 5 - 4 _ - - 4 - 4 - 6 - 7 9 8 _ 7 - 6 _ - - 11 - 9 - 7 - 9 - 10 _ 9 - 7 _ 5 - 9 - 7 - 6 - 4 - 6 _ 7 _ - - - -'}
];
MUSIC_TRACKS.forEach(t=>t.steps=t.melody.trim().split(/\s+/));

let musicOn=true;
try{musicOn=localStorage.getItem('diegoMusic')!=='off'}catch(e){}
const music={track:-1,step:0,nextTime:0,bus:null,busCtx:null,lastClock:0,noise:null};

function musicBus(){
 if(music.busCtx!==soundCtx){ // (re)build the music chain for this audio context
  const g=soundCtx.createGain(),f=soundCtx.createBiquadFilter();
  g.gain.value=.36;f.type='lowpass';f.frequency.value=2600;
  g.connect(f).connect(soundCtx.destination);music.bus=g;music.busCtx=soundCtx;music.noise=null;
 }
 return music.bus;
}
function musicMidi(n){return 440*Math.pow(2,(n-69)/12)}
function musicDegree(t,deg,base){const n=t.scale.length,o=Math.floor(deg/n),i=((deg%n)+n)%n;return base+t.scale[i]+12*o}
function musicNote(freq,time,dur,type,vol){
 const o=soundCtx.createOscillator(),g=soundCtx.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,time);
 g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(vol,time+.012);
 g.gain.setValueAtTime(vol,time+Math.max(.02,dur*.55));g.gain.exponentialRampToValueAtTime(.0001,time+dur);
 o.connect(g).connect(musicBus());o.start(time);o.stop(time+dur+.03);
}
function musicHat(time,vol){
 if(!music.noise){const len=Math.floor(soundCtx.sampleRate*.05),buf=soundCtx.createBuffer(1,len,soundCtx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;music.noise=buf}
 const s=soundCtx.createBufferSource(),f=soundCtx.createBiquadFilter(),g=soundCtx.createGain();
 s.buffer=music.noise;f.type='highpass';f.frequency.value=7000;
 g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(.0001,time+.04);
 s.connect(f).connect(g).connect(musicBus());s.start(time);s.stop(time+.05);
}
// One eighth note of a track: bass, arpeggio, melody and hi-hat.
function musicStep(t,step,time){
 const eighth=60/t.bpm/2,i=step%8,chord=t.chords[Math.floor(step/8)%t.chords.length];
 if(i===0||i===4)musicNote(musicMidi(musicDegree(t,chord,t.root-24)),time,eighth*3.6,'triangle',.07);
 musicNote(musicMidi(musicDegree(t,chord+[0,2,4,2][i%4],t.root)),time,eighth*.9,t.wave==='square'?'square':'sine',t.arpVol);
 const k=step%t.steps.length,tok=t.steps[k];
 if(tok!=='-'&&tok!=='_'){
  let len=1;while(t.steps[(k+len)%t.steps.length]==='_'&&len<8)len++;
  musicNote(musicMidi(musicDegree(t,+tok,t.root+12)),time,eighth*len*.95,t.wave,t.melVol);
 }
 if(i%2===1)musicHat(time,.012);
}
function musicTick(){
 if(typeof soundCtx==='undefined'||!soundCtx)return;
 const playing=musicOn&&(phase==='playing'||phase==='terminal')&&!paused&&!document.hidden&&level>=0&&level<MUSIC_TRACKS.length;
 if(!playing){music.nextTime=0;return}
 if(soundCtx.state==='suspended')soundCtx.resume();
 // A new level, or a restart of this one, starts the tune from the top.
 if(music.track!==level||clock<music.lastClock){music.track=level;music.step=0;music.nextTime=0}
 music.lastClock=clock;
 const t=MUSIC_TRACKS[level],now=soundCtx.currentTime;
 if(music.nextTime<now)music.nextTime=now+.06; // after a pause or cutscene
 while(music.nextTime<now+.25){musicStep(t,music.step,music.nextTime);music.step++;music.nextTime+=60/t.bpm/2}
}
setInterval(musicTick,60);
// Browsers only allow audio after a click or key press: open the audio context then.
function musicUnlock(){try{soundCtx=soundCtx||new(window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')soundCtx.resume()}catch(e){}}
document.addEventListener('pointerdown',musicUnlock);
document.addEventListener('keydown',e=>{
 musicUnlock();
 if(e.key.toLowerCase()==='m'&&!e.repeat){
  musicOn=!musicOn;try{localStorage.setItem('diegoMusic',musicOn?'on':'off')}catch(err){}
  if(typeof showPowerText==='function'&&phase==='playing')showPowerText(musicOn?'🎵 Music on (M to turn it off)':'🔇 Music off (M to turn it back on)');
 }
});
