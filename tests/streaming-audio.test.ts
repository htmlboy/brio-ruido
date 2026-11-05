import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {AudioEngine} from '../src/audio';
import type {Track} from '../src/model';

class Param {value = 0; cancelAndHoldAtTime() {} linearRampToValueAtTime(value: number) {this.value = value;}}
class Gain {gain = new Param(); connect() {} disconnect() {}}
class BufferSource {buffer: unknown; loop = false; connect() {} disconnect() {} start() {} stop() {}}
class Media extends EventTarget {
 static created: Media[] = [];
 static gate: (() => Promise<void>) | null = null;
 src = ''; loop = false; preload = ''; paused = true; currentTime = 0; playCalls = 0; pauseCalls = 0;
 constructor() {super(); Media.created.push(this);}
 play() {this.playCalls++; this.paused = false; return Media.gate?.() ?? Promise.resolve();}
 pause() {this.pauseCalls++; this.paused = true; this.dispatchEvent(new Event('pause'));}
 removeAttribute() {this.src = '';}
 load() {}
}
class Context {
 state = 'running'; currentTime = 0; destination = {}; onstatechange?: () => void;
 createGain() {return new Gain();}
 createDynamicsCompressor() {return {threshold: {value: 0}, knee: {value: 0}, ratio: {value: 0}, connect() {}};}
 createBufferSource() {return new BufferSource();}
 createMediaElementSource(_media: Media) {return {connect() {}, disconnect() {}};}
 async decodeAudioData() {return {length: 24000, numberOfChannels: 1};}
 async resume() {this.state = 'running';}
}
const music = {id: 'music', title: 'Music', playback: 'stream', src: 'audio/music.mp3'} as Track;
const other = {...music, id: 'other', src: 'audio/other.mp3'};
const birds = {id: 'birds', title: 'Birds', src: 'audio/birds.mp3'} as Track;
function deferred() {let resolve!: () => void; const promise = new Promise<void>(r => {resolve = r;}); return {promise, resolve};}

describe('long music playback', () => {
 beforeEach(() => {
  Media.created = []; Media.gate = null;
  Object.assign(globalThis, {AudioContext: Context, Audio: Media});
  globalThis.fetch = async () => ({ok: true, arrayBuffer: async () => new ArrayBuffer(1)}) as Response;
 });
 const engine = () => new AudioEngine([music, other, birds]);

 test('primes media synchronously with the user gesture, without a decoded PCM buffer', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  const e = engine(); const playback = e.play('music', .4);
  assert.equal(Media.created.length, 1);
  assert.equal(Media.created[0].playCalls, 1);
  assert.equal(e.streams.get('music')!.gain.gain.value, 0);
  gate.resolve(); assert.equal(await playback, true);
  assert.equal(e.cache.size, 0); assert.equal(e.voices.size, 0);
  assert.equal(e.streams.get('music')!.gain.gain.value, .4);
  e.stopAll();
 });

 test('stopping a loading track prevents a late audible start', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  const e = engine(), playback = e.play('music', .4);
  e.stop('music'); gate.resolve();
  assert.equal(await playback, false);
  assert.equal(e.streams.size, 0);
  assert.equal(Media.created[0].paused, true);
 });

 test('stop all cancels media preparation as well as buffer playback', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  const e = engine(), scene = e.scene([{trackId: 'music', volume: .4}], .6);
  e.stopAll(); gate.resolve();
  assert.equal(await scene, false);
  assert.equal(e.streams.size, 0);
  assert.equal(Media.created[0].paused, true);
 });

 test('volume changes cannot make a staged track audible before it is committed', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  const e = engine(), playback = e.play('music', .4);
  e.volume('music', .8);
  assert.equal(e.streams.get('music')!.gain.gain.value, 0);
  gate.resolve(); await playback; e.stopAll();
 });

 test('a shared musical track continues at the same position when changing scenes', async () => {
  const e = engine(); await e.scene([{trackId: 'music', volume: .4}], .6);
  const element = Media.created[0]; element.currentTime = 42;
  await e.scene([{trackId: 'music', volume: .2}, {trackId: 'birds', volume: .3}], .6);
  assert.equal(Media.created.length, 1);
  assert.equal(element.currentTime, 42);
  assert.equal(element.playCalls, 1);
  e.stopAll();
 });

 test('a failed destination retains the current musical mix', async () => {
  const e = engine(); await e.play('music', .4);
  const current = e.streams.get('music');
  Media.gate = () => Promise.reject(new Error('Missing media'));
  await assert.rejects(e.scene([{trackId: 'other', volume: .5}], .6));
  assert.equal(e.streams.get('music'), current);
  assert.equal(current!.retiring, false);
  assert.equal(current!.element.paused, false);
  assert.equal(e.streams.has('other'), false);
  e.stopAll();
 });

 test('a failed buffer load releases silently staged musical media', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  globalThis.fetch = async () => ({ok: false}) as Response;
  const e = engine();
  await assert.rejects(e.scene([{trackId: 'music', volume: .4}, {trackId: 'birds', volume: .2}], .6));
  assert.equal(e.streams.size, 0);
  assert.equal(Media.created[0].paused, true);
  gate.resolve();
 });

 test('only the last scene request can activate its staged media', async () => {
  const gate = deferred(); Media.gate = () => gate.promise;
  const e = engine();
  const first = e.scene([{trackId: 'music', volume: .4}], .6);
  const second = e.scene([{trackId: 'other', volume: .3}], .6);
  gate.resolve();
  assert.equal(await first, false); assert.equal(await second, true);
  assert.equal(e.streams.has('music'), false); assert.equal(e.streams.has('other'), true);
  assert.equal(Media.created[0].paused, true);
  e.stopAll();
 });

 test('master and layer volume still use the common Web Audio gain graph', async () => {
  const e = engine(); await e.play('music', .4);
  e.volume('music', .2); e.setMaster(0);
  assert.equal(e.streams.get('music')!.gain.gain.value, .2);
  assert.equal(e.master!.gain.value, 0);
  e.stopAll();
 });

 test('a new gesture can resume a browser-paused musical element', async () => {
  let interrupted = false;
  const e = new AudioEngine([music], () => {interrupted = true;});
  await e.play('music', .4); Media.created[0].pause();
  assert.equal(interrupted, true);
  await e.unlock();
  assert.equal(Media.created[0].paused, false);
  assert.equal(Media.created[0].playCalls, 2);
  e.stopAll();
 });
});
