import type {Layer, Track} from './model';

type Voice = {source: AudioBufferSourceNode; gain: GainNode; volume: number; retiring: boolean};
type StreamVoice = {
 id: string; element: HTMLAudioElement; source: MediaElementAudioSourceNode; gain: GainNode;
 volume: number; committed: boolean; retiring: boolean; disposed: boolean;
 ready: Promise<void>; timer?: ReturnType<typeof setTimeout>;
};
type Prepared = {kind: 'buffer'; buffer: AudioBuffer} | {kind: 'stream'; voice: StreamVoice};

export class AudioEngine {
 context?: AudioContext;
 master?: GainNode;
 voices = new Map<string, Voice>();
 streams = new Map<string, StreamVoice>();
 cache = new Map<string, AudioBuffer>();
 pending = new Map<string, Promise<AudioBuffer>>();
 epoch = 0;
 tokens = new Map<string, number>();
 private allStreams = new Set<StreamVoice>();

 constructor(private catalog: Track[], private onSuspended: () => void = () => {}) {}

 private configurePlaybackSession() {
  // iOS ambient audio can obey the silent switch even with a running context.
  const session = (globalThis.navigator as Navigator & {audioSession?: {type: string}} | undefined)?.audioSession;
  if (session) {try {session.type = 'playback';} catch {/* Optional API. */}}
 }

 async unlock() {
  this.configurePlaybackSession();
  if (!this.context) {
   this.context = new AudioContext();
   this.master = this.context.createGain();
   this.master.gain.value = .65;
   const compressor = this.context.createDynamicsCompressor();
   compressor.threshold.value = -8; compressor.knee.value = 12; compressor.ratio.value = 8;
   this.master.connect(compressor); compressor.connect(this.context.destination);
   this.context.onstatechange = () => {
    if (this.context && this.context.state !== 'running' && this.context.state !== 'closed') this.onSuspended();
   };
  }
  const resumes: Promise<void>[] = [];
  if (this.context.state !== 'running' && this.context.state !== 'closed') resumes.push(this.context.resume());
  // Keep these play() calls synchronous with the user's new gesture too.
  for (const voice of this.allStreams) {
   if (voice.committed && !voice.retiring && voice.element.paused) resumes.push(voice.element.play());
  }
  await Promise.all(resumes);
  if (this.context.state !== 'running') {this.onSuspended(); throw Error('Pulsa Reanudar para activar el audio.');}
 }

 setMaster(value: number) {if (this.master && this.context) this.ramp(this.master.gain, value, .04);}

 private ramp(param: AudioParam, value: number, seconds: number) {
  const now = this.context!.currentTime;
  if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(now);
  else {const previous = param.value; param.cancelScheduledValues(now); param.setValueAtTime(previous, now);}
  param.linearRampToValueAtTime(value, now + seconds);
 }

 private trim() {
  let bytes = [...this.cache.values()].reduce((sum, buffer) => sum + buffer.length * buffer.numberOfChannels * 4, 0);
  for (const [id, buffer] of this.cache) {
   if (bytes <= 128 * 1024 * 1024) break;
   if (!this.voices.has(id)) {this.cache.delete(id); bytes -= buffer.length * buffer.numberOfChannels * 4;}
  }
 }

 private async buffer(track: Track) {
  const id = track.id;
  if (this.cache.has(id)) {const buffer = this.cache.get(id)!; this.cache.delete(id); this.cache.set(id, buffer); return buffer;}
  if (this.pending.has(id)) return this.pending.get(id)!;
  const promise = (async () => {
   const response = await fetch((import.meta.env?.BASE_URL ?? './') + track.src);
   if (!response.ok) throw Error(`No se ha podido cargar ${track.title}.`);
   const buffer = await this.context!.decodeAudioData(await response.arrayBuffer());
   this.cache.set(id, buffer); return buffer;
  })();
  this.pending.set(id, promise);
  try {return await promise;} finally {this.pending.delete(id); this.trim();}
 }

 private disposeStream(voice: StreamVoice) {
  if (voice.disposed) return;
  voice.disposed = true;
  clearTimeout(voice.timer);
  voice.element.pause();
  voice.element.removeAttribute('src');
  voice.element.load();
  voice.source.disconnect(); voice.gain.disconnect();
  this.allStreams.delete(voice);
  if (this.streams.get(voice.id) === voice) this.streams.delete(voice.id);
 }

 private async prepare(track: Track): Promise<Prepared> {
  if (track.playback !== 'stream') return {kind: 'buffer', buffer: await this.buffer(track)};
  let voice = this.streams.get(track.id);
  if (!voice || voice.retiring || voice.disposed) {
   const element = new Audio();
   element.preload = 'auto'; element.loop = true;
   element.src = (import.meta.env?.BASE_URL ?? './') + track.src;
   const source = this.context!.createMediaElementSource(element);
   const gain = this.context!.createGain(); gain.gain.value = 0;
   source.connect(gain); gain.connect(this.master!);
   voice = {id: track.id, element, source, gain, volume: 0, committed: false, retiring: false, disposed: false, ready: Promise.resolve()};
   const created = voice;
   this.streams.set(track.id, created); this.allStreams.add(created);
   element.addEventListener('pause', () => {
    if (created.committed && !created.retiring && !created.disposed) this.onSuspended();
   });
   // Start silently before any await: iOS media playback needs the user gesture.
   try {created.ready = Promise.resolve(element.play());}
   catch (error) {this.disposeStream(created); throw error;}
   created.ready = created.ready.catch(error => {if (!created.committed) this.disposeStream(created); throw error;});
  }
  await voice.ready;
  return {kind: 'stream', voice};
 }

 private add(id: string, prepared: Prepared, volume: number, seconds: number) {
  if (prepared.kind === 'stream') {
   const voice = prepared.voice;
   if (voice.disposed) throw Error('La reproducción se ha cancelado.');
   if (!voice.committed) voice.element.currentTime = 0;
   voice.committed = true; voice.retiring = false; voice.volume = volume;
   clearTimeout(voice.timer); this.ramp(voice.gain.gain, volume, seconds); return;
  }
  const old = this.voices.get(id);
  if (old) {old.retiring = false; old.volume = volume; this.ramp(old.gain.gain, volume, seconds); return;}
  const source = this.context!.createBufferSource(); source.buffer = prepared.buffer; source.loop = true;
  const gain = this.context!.createGain(); gain.gain.value = 0;
  source.connect(gain); gain.connect(this.master!);
  this.voices.set(id, {source, gain, volume, retiring: false});
  source.start(); this.ramp(gain.gain, volume, seconds);
 }

 private track(id: string) {
  const track = this.catalog.find(track => track.id === id);
  if (!track) throw Error('Pista no disponible en el catálogo.');
  return track;
 }

 async play(id: string, volume: number) {
  const track = this.track(id), epoch = this.epoch, token = (this.tokens.get(id) || 0) + 1;
  this.tokens.set(id, token);
  try {
   // Evaluation order creates the context, then primes media, in the same gesture.
   const [, prepared] = await Promise.all([this.unlock(), this.prepare(track)]);
   if (epoch !== this.epoch || token !== this.tokens.get(id)) return false;
   this.add(id, prepared, volume, .5); this.trim(); return true;
  } catch (error) {
   if (epoch !== this.epoch || token !== this.tokens.get(id)) return false;
   const voice = this.streams.get(id);
   if (voice && !voice.committed) this.disposeStream(voice);
   throw error;
  }
 }

 private retireStream(voice: StreamVoice, seconds: number) {
  if (voice.disposed) return;
  if (!voice.committed) {this.disposeStream(voice); return;}
  voice.retiring = true; this.ramp(voice.gain.gain, 0, seconds);
  clearTimeout(voice.timer);
  voice.timer = setTimeout(() => {if (voice.retiring) this.disposeStream(voice);}, seconds * 1000 + 40);
 }

 private retire(id: string, seconds: number) {
  const voice = this.voices.get(id);
  if (voice) {
   voice.retiring = true; this.ramp(voice.gain.gain, 0, seconds);
   setTimeout(() => {
    if (this.voices.get(id) === voice && voice.retiring) {
     voice.source.stop(); voice.source.disconnect(); voice.gain.disconnect(); this.voices.delete(id); this.trim();
    }
   }, seconds * 1000 + 40);
  }
  const stream = this.streams.get(id);
  if (stream) this.retireStream(stream, seconds);
 }

 stop(id: string) {this.tokens.set(id, (this.tokens.get(id) || 0) + 1); if (this.context) this.retire(id, .5);}
 volume(id: string, value: number) {
  const voice = this.voices.get(id) ?? this.streams.get(id);
  if (voice && !voice.retiring) {
   voice.volume = value;
   if (!('committed' in voice) || voice.committed) this.ramp(voice.gain.gain, value, .04);
  }
 }

 cancelPreparation() {
  this.epoch++; this.tokens.clear();
  for (const voice of this.allStreams) if (!voice.committed) this.disposeStream(voice);
 }
 stopAll() {
  this.cancelPreparation(); if (!this.context) return;
  for (const id of this.voices.keys()) this.retire(id, .04);
  for (const voice of this.allStreams) this.retireStream(voice, .04);
 }

 async scene(layers: Layer[], master: number) {
  const tracks = layers.map(layer => this.track(layer.trackId)), epoch = ++this.epoch;
  this.tokens.clear();
  const desired = new Set(layers.map(layer => layer.trackId));
  for (const voice of this.allStreams) if (!voice.committed && !desired.has(voice.id)) this.disposeStream(voice);
  try {
   const [, prepared] = await Promise.all([this.unlock(), Promise.all(tracks.map(track => this.prepare(track)))]);
   if (epoch !== this.epoch) return false;
   this.setMaster(master);
   for (const id of this.voices.keys()) if (!desired.has(id)) this.retire(id, 2);
   for (const voice of this.allStreams) if (voice.committed && !desired.has(voice.id)) this.retireStream(voice, 2);
   layers.forEach((layer, i) => this.add(layer.trackId, prepared[i], layer.volume, 2));
   this.trim(); return true;
  } catch (error) {
   if (epoch !== this.epoch) return false;
   for (const voice of this.allStreams) if (!voice.committed) this.disposeStream(voice);
   throw error;
  }
 }
}
