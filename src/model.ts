export type Track = {id:string;title:string;description?:string;category:string;tags:string[];src:string;author:string;sourceUrl:string;license:string;licenseUrl:string;modifications:string;defaultVolume:number;kind:'recorded'|'synth'|'composition';duration:number;playback?:'stream'};
export type Layer = {trackId:string;volume:number};
export type Scene = {id:string;name:string;tracks:Layer[];description?:string;art?:string};
export type SavedData = {schemaVersion:1;masterVolume:number;scenes:Scene[]};
export const LIMIT=8;
export const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function validLayers(x:unknown):x is Layer[]{return Array.isArray(x)&&x.length>0&&x.length<=LIMIT&&new Set(x.map(t=>t?.trackId)).size===x.length&&x.every(t=>typeof t?.trackId==='string'&&Number.isFinite(t.volume)&&t.volume>=0&&t.volume<=1)}
export function parseSaved(raw:string|null):SavedData {if(raw===null)return {schemaVersion:1,masterVolume:.65,scenes:[]};const x=JSON.parse(raw);if(x.schemaVersion!==1||!Number.isFinite(x.masterVolume)||x.masterVolume<0||x.masterVolume>1||!Array.isArray(x.scenes)||!x.scenes.every((s:Scene)=>typeof s.id==='string'&&typeof s.name==='string'&&s.name.trim().length>0&&s.name.length<=60&&(s.art===undefined||typeof s.art==='string')&&validLayers(s.tracks))||new Set(x.scenes.map((s:Scene)=>s.id)).size!==x.scenes.length)throw Error('Datos guardados no válidos');return x}
export function searchTracks(tracks:Track[],query:string,category:string){const q=normalize(query.trim());return tracks.filter(t=>(category==='Todos'||t.category===category)&&normalize([t.title,...t.tags].join(' ')).includes(q))}
