import type {Layer,Track} from './model';
type Voice={source:AudioBufferSourceNode;gain:GainNode;volume:number;retiring:boolean};
export class AudioEngine {
 context?:AudioContext; master?:GainNode; voices=new Map<string,Voice>(); cache=new Map<string,AudioBuffer>(); pending=new Map<string,Promise<AudioBuffer>>(); epoch=0; tokens=new Map<string,number>(); muted=false;
 constructor(private catalog:Track[],private onSuspended:()=>void=()=>{}){}
 private configurePlaybackSession(){
  // iOS routes Web Audio as ambient audio by default, which obeys the silent
  // switch even while AudioContext reports running. Request media playback.
  const session=(globalThis.navigator as Navigator & {audioSession?:{type:string}} | undefined)?.audioSession;
  if(session){try{session.type='playback'}catch{/* Optional API; other browsers use their default media route. */}}
 }
 async unlock(){this.configurePlaybackSession();if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=.65;const compressor=this.context.createDynamicsCompressor();compressor.threshold.value=-8;compressor.knee.value=12;compressor.ratio.value=8;this.master.connect(compressor);compressor.connect(this.context.destination);this.context.onstatechange=()=>{if(this.context&&this.context.state!=='running'&&this.context.state!=='closed')this.onSuspended()}}if(this.context.state!=='running'&&this.context.state!=='closed')await this.context.resume();if(this.context.state!=='running'){this.onSuspended();throw Error('Pulsa Reanudar para activar el audio.');}}
 setMaster(value:number){if(this.master&&this.context)this.ramp(this.master.gain,value,.04)}
 private ramp(param:AudioParam,value:number,seconds:number){const now=this.context!.currentTime;if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(now);else{const previous=param.value;param.cancelScheduledValues(now);param.setValueAtTime(previous,now)}param.linearRampToValueAtTime(value,now+seconds)}
 private trim(){let bytes=[...this.cache.values()].reduce((sum,b)=>sum+b.length*b.numberOfChannels*4,0);for(const [id,b] of this.cache){if(bytes<=128*1024*1024)break;if(!this.voices.has(id)){this.cache.delete(id);bytes-=b.length*b.numberOfChannels*4}}}
 private async buffer(id:string){if(this.cache.has(id)){const b=this.cache.get(id)!;this.cache.delete(id);this.cache.set(id,b);return b}if(this.pending.has(id))return this.pending.get(id)!;const track=this.catalog.find(t=>t.id===id);if(!track)throw Error('Pista no disponible en el catálogo.');const promise=(async()=>{const response=await fetch((import.meta.env?.BASE_URL ?? './')+track.src);if(!response.ok)throw Error(`No se ha podido cargar ${track.title}.`);const b=await this.context!.decodeAudioData(await response.arrayBuffer());this.cache.set(id,b);return b})();this.pending.set(id,promise);try{return await promise}finally{this.pending.delete(id);this.trim()}}
 private add(id:string,b:AudioBuffer,volume:number,seconds:number){const old=this.voices.get(id);if(old){old.retiring=false;old.volume=volume;this.ramp(old.gain.gain,volume,seconds);return}const source=this.context!.createBufferSource();source.buffer=b;source.loop=true;const gain=this.context!.createGain();gain.gain.value=0;source.connect(gain);gain.connect(this.master!);const voice={source,gain,volume,retiring:false};this.voices.set(id,voice);source.start();this.ramp(gain.gain,volume,seconds)}
 async play(id:string,volume:number){const epoch=this.epoch;const token=(this.tokens.get(id)||0)+1;this.tokens.set(id,token);await this.unlock();const b=await this.buffer(id);if(epoch!==this.epoch||token!==this.tokens.get(id))return false;this.add(id,b,volume,.5);this.trim();return true}
 private retire(id:string,seconds:number){const voice=this.voices.get(id);if(!voice)return;voice.retiring=true;this.ramp(voice.gain.gain,0,seconds);setTimeout(()=>{if(this.voices.get(id)===voice&&voice.retiring){voice.source.stop();voice.source.disconnect();voice.gain.disconnect();this.voices.delete(id);this.trim()}},seconds*1000+40)}
 stop(id:string){this.tokens.set(id,(this.tokens.get(id)||0)+1);if(this.context)this.retire(id,.5)}
 volume(id:string,value:number){const voice=this.voices.get(id);if(voice&&!voice.retiring){voice.volume=value;this.ramp(voice.gain.gain,value,.04)}}
 cancelPreparation(){this.epoch++;this.tokens.clear()}
 stopAll(){this.cancelPreparation();if(!this.context)return;for(const id of this.voices.keys())this.retire(id,.04)}
 async scene(layers:Layer[],master:number){const epoch=++this.epoch;this.tokens.clear();await this.unlock();const buffers=await Promise.all(layers.map(t=>this.buffer(t.trackId)));if(epoch!==this.epoch)return false;this.setMaster(master);const desired=new Set(layers.map(t=>t.trackId));for(const id of this.voices.keys())if(!desired.has(id))this.retire(id,2);layers.forEach((t,i)=>this.add(t.trackId,buffers[i],t.volume,2));this.trim();return true}
}
