import {readFile,writeFile} from 'node:fs/promises';
process.env.NODE_ENV='production';
const {render}=await import('../.ssg/entry-server.js');

const file=new URL('../dist/index.html',import.meta.url);
let html=await readFile(file,'utf8');
if(!html.includes('<div id="root"></div>'))throw new Error('Expected a fresh client build');
const markup=render();
if(!markup.includes('Biblioteca')||!markup.includes('Lluvia'))throw new Error('Public library is missing from static output');
html=html.replace('<div id="root"></div>',`<div id="root" data-prerendered="true">${markup}</div>`);
await writeFile(file,html);
console.log('Rendered public Ruido catalogue as HTML.');
