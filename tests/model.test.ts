import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {parseSaved,validLayers,searchTracks,type Track} from '../src/model';
import catalog from '../src/catalog.json';
import {examples} from '../src/scenes';
const tracks=catalog as Track[];
test('catalog IDs, files, provenance, volumes and durations are valid',()=>{assert.equal(new Set(tracks.map(t=>t.id)).size,tracks.length);assert.equal(tracks.length,42);for(const t of tracks){assert.ok(existsSync(`public/${t.src}`),t.id);assert.ok(t.duration>2);assert.ok(t.defaultVolume>=0&&t.defaultVolume<=1);assert.match(t.sourceUrl,/^https:\/\//);assert.match(t.licenseUrl,/^https:\/\//);assert.ok(t.author);assert.ok(t.modifications);assert.ok(readFileSync('ATTRIBUTIONS.md','utf8').includes(t.sourceUrl))}});
test('example scenes reference available, unique tracks',()=>{for(const scene of examples){assert.ok(validLayers(scene.tracks));for(const t of scene.tracks)assert.ok(tracks.some(track=>track.id===t.trackId))}});
test('search combines category, tags, case and accent normalization',()=>{assert.ok(searchTracks(tracks,'PAJAROS','Naturaleza').some(t=>t.id==='birds'));assert.ok(searchTracks(tracks,'CAFE','Interiores').some(t=>t.id==='coffee-shop'));assert.equal(searchTracks(tracks,'lluvia','Ciudad').length,0);assert.equal(searchTracks(tracks,'   ','Todos').length,tracks.length)});
test('missing storage returns a safe silent default',()=>{const x=parseSaved(null);assert.deepEqual(x.scenes,[]);assert.equal(x.schemaVersion,1)});
test('valid scenes roundtrip without changing values',()=>{const data={schemaVersion:1,masterVolume:0,scenes:[{id:'a',name:'Mi bosque',tracks:[{trackId:'birds',volume:.37}]}]};assert.deepEqual(parseSaved(JSON.stringify(data)),data)});
test('corrupt, unsupported and invalid saved data is rejected',()=>{for(const raw of ['{','null','{}',JSON.stringify({schemaVersion:2,scenes:[],masterVolume:.5}),JSON.stringify({schemaVersion:1,scenes:[],masterVolume:2}),JSON.stringify({schemaVersion:1,masterVolume:.5,scenes:[{id:'a',name:' ',tracks:[]} ]})])assert.throws(()=>parseSaved(raw))});
test('duplicate IDs and tracks are rejected',()=>{const scene={id:'a',name:'A',tracks:[{trackId:'birds',volume:.5}]};assert.throws(()=>parseSaved(JSON.stringify({schemaVersion:1,masterVolume:.5,scenes:[scene,scene]})));assert.equal(validLayers([...scene.tracks,...scene.tracks]),false)});
test('empty, oversized and invalid-volume scenes are rejected',()=>{assert.equal(validLayers([]),false);assert.equal(validLayers(Array.from({length:9},(_,i)=>({trackId:String(i),volume:.5}))),false);for(const volume of [-1,2,NaN,Infinity])assert.equal(validLayers([{trackId:'birds',volume}]),false)});

test('dramatic library has distinct, sourced tracks for tension, horror and action',()=>{
 for(const category of ['Tensión','Horror','Acción']) {
  const group=tracks.filter(t=>t.category===category);
  assert.ok(group.length>=3,category);
  assert.ok(group.every(t=>t.description&&t.description.length>20));
 }
 const sources=JSON.parse(readFileSync('docs/audio/dramatic-sources.json','utf8'));
 assert.equal(sources.length,10);
 for(const source of sources){
  const track=tracks.find(t=>t.id===source.id)!;
  assert.equal(track.license,source.license);
  assert.equal(track.author,source.author);
  assert.equal(source.licenseTextObserved,source.license);
  assert.match(source.evidencePageSha256,/^[a-f0-9]{64}$/);
 }
});
test('new examples offer different narrative uses without removing old track IDs',()=>{
 for(const id of ['investigation','threat','chase','combat','catacombs']) assert.ok(examples.some(s=>s.id===id));
 for(const id of ['birds','coffee-shop','fireplace','rain','suspense','pulse']) assert.ok(tracks.some(t=>t.id===id));
 assert.ok(searchTracks(tracks,'persecucion','Acción').some(t=>t.id==='pursuit'));
});

test('the music addition is limited to six complete, attributed Incompetech tracks',()=>{
 const selection=JSON.parse(readFileSync('docs/audio/incompetech-selection.json','utf8'));
 assert.equal(selection.length,6);
 assert.equal(tracks.filter(track=>track.playback==='stream').length,6);
 for(const entry of selection){
  const track=tracks.find(track=>track.id===entry.id)!;
  assert.equal(track.title,entry.title);
  assert.equal(track.duration,entry.duration);
  assert.ok(track.duration>=190&&track.duration<470);
  assert.equal(track.license,'CC BY 4.0');
  assert.equal(track.playback,'stream');
  assert.match(entry.isrc,/^USUAN[0-9]{7}$/);
  assert.ok(entry.attribution.includes(entry.title));
  assert.ok(entry.attribution.includes('Kevin MacLeod'));
  assert.ok(readFileSync('ATTRIBUTIONS.md','utf8').includes(entry.attribution));
 }
});
