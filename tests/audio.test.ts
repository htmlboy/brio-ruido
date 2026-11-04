import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {AudioEngine} from '../src/audio';
import catalog from '../src/catalog.json';
import type {Track} from '../src/model';
class Param {value=0;calls:number[]=[];cancelAndHoldAtTime(){}linearRampToValueAtTime(v:number){this.value=v;this.calls.push(v)}}
class Gain {gain=new Param();connect(){}disconnect(){}}
class Source {buffer:unknown;loop=false;started=0;stopped=0;connect(){}disconnect(){}start(){this.started++}stop(){this.stopped++}}
class Context {state='running';currentTime=0;destination={};sources:Source[]=[];onstatechange?:()=>void;createGain(){return new Gain()}createDynamicsCompressor(){return {threshold:{value:0},knee:{value:0},ratio:{value:0},connect(){}}}createBufferSource(){const source=new Source();this.sources.push(source);return source}async resume(){this.state='running'}async decodeAudioData(){return {length:24000,numberOfChannels:1}}}
const originalFetch=globalThis.fetch;
beforeEach(()=>{Object.assign(globalThis,{AudioContext:Context});globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}) as Response});
function engine(){return new AudioEngine(catalog as Track[])}
function defer(){let resolve!:(r:Response)=>void;const promise=new Promise<Response>(r=>{resolve=r});return {promise,resolve:()=>resolve({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)} as Response)}}
test('construction does not start an audio context or playback',()=>{const e=engine();assert.equal(e.context,undefined);assert.equal(e.voices.size,0)});
test('starting a track creates one looping voice and reuses it',async()=>{const e=engine();assert.equal(await e.play('birds',.4),true);const voice=e.voices.get('birds')!;assert.equal(voice.source.loop,true);assert.equal(await e.play('birds',.6),true);assert.equal(e.voices.size,1);assert.equal(e.voices.get('birds'),voice);e.stopAll()});
test('stopping while fetch is pending prevents late playback',async()=>{const d=defer();globalThis.fetch=()=>d.promise;const e=engine();const p=e.play('birds',.4);await Promise.resolve();e.stop('birds');d.resolve();assert.equal(await p,false);assert.equal(e.voices.size,0)});
test('stop all cancels a scene being prepared',async()=>{const d=defer();globalThis.fetch=()=>d.promise;const e=engine();const p=e.scene([{trackId:'birds',volume:.3}],.6);await Promise.resolve();e.stopAll();d.resolve();assert.equal(await p,false);assert.equal(e.voices.size,0)});
test('shared voices keep their playback position across scenes',async()=>{const e=engine();await e.scene([{trackId:'birds',volume:.4}],.7);const source=e.voices.get('birds')!.source;await e.scene([{trackId:'birds',volume:.2},{trackId:'stream',volume:.3}],.7);assert.equal(e.voices.get('birds')!.source,source);assert.equal(e.voices.size,2);e.stopAll()});
test('failed destination preserves current sources',async()=>{const e=engine();await e.play('birds',.4);const voice=e.voices.get('birds');globalThis.fetch=async()=>({ok:false}) as Response;await assert.rejects(e.scene([{trackId:'stream',volume:.3}],.7));assert.equal(e.voices.get('birds'),voice);assert.equal(voice?.retiring,false);e.stopAll()});
test('only latest requested scene can be applied',async()=>{const d=defer();globalThis.fetch=()=>d.promise;const e=engine();const first=e.scene([{trackId:'birds',volume:.4}],.7);const second=e.scene([{trackId:'stream',volume:.3}],.7);d.resolve();assert.equal(await first,false);assert.equal(await second,true);assert.equal(e.voices.has('birds'),false);assert.equal(e.voices.has('stream'),true);e.stopAll()});
test('master gain changes preserve per-track volume',async()=>{const e=engine();await e.play('birds',.4);e.setMaster(0);assert.equal(e.voices.get('birds')!.volume,.4);assert.equal(e.master!.gain.value,0);e.stopAll()});

test('requests an iOS playback session before starting audio',async()=>{
 const session={type:'ambient'};
 Object.defineProperty(globalThis.navigator,'audioSession',{configurable:true,value:session});
 try{const e=engine();await e.play('birds',.4);assert.equal(session.type,'playback');e.stopAll()}
 finally{Reflect.deleteProperty(globalThis.navigator,'audioSession')}
});
test('unsupported audio-session configuration does not prevent playback',async()=>{
 Object.defineProperty(globalThis.navigator,'audioSession',{configurable:true,value:{set type(_value:string){throw Error('Unsupported')}}});
 try{const e=engine();assert.equal(await e.play('birds',.4),true);e.stopAll()}
 finally{Reflect.deleteProperty(globalThis.navigator,'audioSession')}
});
test('resumes the Safari interrupted state on a new user gesture',async()=>{
 const e=engine();await e.unlock();Object.assign(e.context!,{state:'interrupted'});
 await e.unlock();assert.equal(e.context!.state,'running');
});
