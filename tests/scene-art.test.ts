import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SCENE_ARTWORKS, sceneArtId} from '../src/sceneArt';
import {SceneIllustration} from '../src/components/SceneIllustration';
import {SceneArtPicker} from '../src/components/SceneArtPicker';
import {parseSaved} from '../src/model';
import {examples} from '../src/scenes';

const scene = {id: 'saved', name: 'Mi escena', tracks: [{trackId: 'birds', volume: .37}]};
const saved = (art?: unknown) => JSON.stringify({schemaVersion: 1, masterVolume: .4, scenes: [{...scene, ...(art === undefined ? {} : {art})}]});

test('legacy scenes without artwork keep their data and get a neutral image', () => {
 const data = parseSaved(saved());
 assert.deepEqual(data.scenes[0], scene);
 assert.equal(sceneArtId(data.scenes[0]), 'abstract');
});

test('artwork survives export/import without changing tracks or volumes', () => {
 const data = parseSaved(saved('forest'));
 const imported = parseSaved(JSON.stringify(data));
 assert.equal(imported.scenes[0].art, 'forest');
 assert.deepEqual(imported.scenes[0].tracks, scene.tracks);
 assert.equal(imported.masterVolume, .4);
});

test('unknown artwork IDs are preserved for forwards compatibility and render safely', () => {
 const data = parseSaved(saved('future-artwork'));
 assert.equal(data.scenes[0].art, 'future-artwork');
 assert.equal(sceneArtId(data.scenes[0]), 'abstract');
 assert.equal(sceneArtId({art: 'https://example.com/tracking.svg'}), 'abstract');
});

test('non-string artwork metadata is rejected without accepting corrupt scene data', () => {
 for (const art of [null, 3, {}, []]) assert.throws(() => parseSaved(saved(art)));
});

test('preset scenes have supported illustrations with visual variety', () => {
 assert.equal(new Set(SCENE_ARTWORKS.map(art => art.id)).size, 16);
 assert.ok(new Set(examples.map(scene => scene.art)).size >= 12);
 for (const scene of examples) {
  assert.ok(scene.art);
  assert.notEqual(sceneArtId(scene), 'abstract');
 }
});

test('all illustrations render as self-contained SVG without external resources', () => {
 for (const art of SCENE_ARTWORKS) {
  const markup = renderToStaticMarkup(createElement(SceneIllustration, {art: art.id}));
  assert.match(markup, /<svg/);
  assert.match(markup, /aria-hidden="true"/);
  assert.doesNotMatch(markup, /<(?:image|script|iframe)\b|href=|url\(/);
 }
});

test('the picker exposes labelled native radio controls with one selected artwork', () => {
 const markup = renderToStaticMarkup(createElement(SceneArtPicker, {value: 'forest', onChange: () => {}}));
 assert.equal((markup.match(/type="radio"/g) || []).length, 16);
 assert.equal((markup.match(/checked=""/g) || []).length, 1);
 const checkedInputs = (markup.match(/<input\b[^>]*>/g) || []).filter(input => input.includes('checked=""'));
 assert.match(checkedInputs[0], /value="forest"/);
 assert.match(markup, /<legend>Ilustración<\/legend>/);
 for (const art of SCENE_ARTWORKS) assert.ok(markup.includes(art.label));
});
