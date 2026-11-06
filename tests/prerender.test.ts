import {test} from 'node:test';
import assert from 'node:assert/strict';
import {render} from '../src/entry-server';
import catalog from '../src/catalog.json';

test('static HTML exposes the full initial catalogue without browser storage or audio',()=>{
 const html=render();
 assert.match(html,/<h1[^>]*>Escenas<\/h1>/);
 assert.equal((html.match(/class="sound-row/g)||[]).length,catalog.length);
 assert.match(html,/Lluvia/);
 assert.match(html,/Volumen general/);
 assert.doesNotMatch(html,/No podemos leer tus datos guardados/);
 assert.equal(render(),html,'build output must not depend on a previous render');
});
