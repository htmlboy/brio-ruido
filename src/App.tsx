import {useEffect,useRef,useState} from 'react';
import {AudioLines,Search,Play,Pause,X,Volume2,Square,SlidersHorizontal,Bookmark,ArrowUpRight,Info,Trash2,RefreshCw,LoaderCircle,Download,Upload} from 'lucide-react';
import catalogJson from './catalog.json';
import {AudioEngine} from './audio';
import {examples} from './scenes';
import {LIMIT,parseSaved,searchTracks,type Track,type Layer,type Scene,type SavedData} from './model';
const tracks=catalogJson as Track[];
const categories=['Todos','Tensión','Horror','Acción','Música','Naturaleza','Clima','Agua','Ciudad','Interiores'];
const STORE='ruido:v1';
type Status='loading'|'playing'|'stopped'|'error';
type Selected=Layer&{status:Status};
function readInitial(){try{return {data:parseSaved(localStorage.getItem(STORE)),error:''}}catch{return {data:parseSaved(null),error:'No podemos leer tus datos guardados. Puedes exportar una copia o restablecerlos; no los sobrescribiremos.'}}}
const initial=readInitial();
export default function App(){
 const [showMixer,setShowMixer]=useState(false);
 const [tab,setTab]=useState<'library'|'scenes'>('library');const [category,setCategory]=useState('Todos');const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<Selected[]>([]);const selectedRef=useRef(selected);selectedRef.current=selected;
 const [master,setMaster]=useState(initial.data.masterVolume);const [scenes,setScenes]=useState<Scene[]>(initial.data.scenes);const [storageError,setStorageError]=useState(initial.error);const [storageLocked,setStorageLocked]=useState(!!initial.error);
 const [message,setMessage]=useState('');const [preparing,setPreparing]=useState<string|null>(null);const [activeScene,setActiveScene]=useState<string|null>(null);const [suspended,setSuspended]=useState(false);
 const [modal,setModal]=useState<'save'|'credits'|'help'|'delete'|null>(null);const [sceneName,setSceneName]=useState('');const [deleteId,setDeleteId]=useState<string|null>(null);const [creditId,setCreditId]=useState<string|null>(null);
 const engineRef=useRef<AudioEngine|null>(null);if(!engineRef.current)engineRef.current=new AudioEngine(tracks,()=>setSuspended(true));const engine=engineRef.current;
 const generation=useRef(0);const operations=useRef(new Map<string,number>());const masterRef=useRef(master);masterRef.current=master;
 useEffect(()=>{if(storageLocked)return;try{const data:SavedData={schemaVersion:1,masterVolume:master,scenes};localStorage.setItem(STORE,JSON.stringify(data));setStorageError('')}catch{setStorageError('El navegador no permite guardar los cambios. La mezcla sigue funcionando.')}},[master,scenes,storageLocked]);
 useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),6000);return()=>clearTimeout(t)},[message]);
 useEffect(()=>{const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')setModal(null);if(e.key==='/'&&!['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName)&&!modal){e.preventDefault();document.querySelector<HTMLInputElement>('[aria-label="Buscar sonidos"]')?.focus()}};window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc)},[modal]);
 const visible=searchTracks(tracks,query,category);const playing=selected.filter(t=>t.status==='playing').length;
 function cancelPreparation(){generation.current++;engine.cancelPreparation();setPreparing(null)}
 async function toggle(track:Track){if(preparing)cancelPreparation();const current=selectedRef.current.find(t=>t.trackId===track.id);const token=(operations.current.get(track.id)||0)+1;operations.current.set(track.id,token);
  if(current&&(current.status==='playing'||current.status==='loading')){engine.stop(track.id);setSelected(s=>s.map(t=>t.trackId===track.id?{...t,status:'stopped'}:t));return}
  if(!current&&selectedRef.current.length>=LIMIT){setMessage('Tu mezcla tiene ocho pistas. Retira una para añadir otra.');return}
  const item:Selected={trackId:track.id,volume:current?.volume??track.defaultVolume,status:'loading'};
  setSelected(s=>current?s.map(t=>t.trackId===track.id?item:t):[...s,item]);
  try{const ok=await engine.play(track.id,item.volume);engine.setMaster(masterRef.current);engine.volume(track.id,selectedRef.current.find(t=>t.trackId===track.id)?.volume??item.volume);setSuspended(false);if(operations.current.get(track.id)!==token)return;setSelected(s=>s.map(t=>t.trackId===track.id?{...t,status:ok?'playing':'stopped'}:t))}catch{if(operations.current.get(track.id)!==token)return;setSelected(s=>s.map(t=>t.trackId===track.id?{...t,status:'error'}:t));setMessage(`No se ha podido cargar «${track.title}». Pulsa reproducir para reintentar.`)}
 }
 function remove(id:string){if(preparing)cancelPreparation();operations.current.set(id,(operations.current.get(id)||0)+1);engine.stop(id);setSelected(s=>s.filter(t=>t.trackId!==id))}
 function volume(id:string,value:number){if(preparing)cancelPreparation();engine.volume(id,value);setSelected(s=>s.map(t=>t.trackId===id?{...t,volume:value}:t))}
 function stopAll(){generation.current++;operations.current.clear();engine.stopAll();setPreparing(null);setSelected(s=>s.map(t=>({...t,status:'stopped'})));setMessage('Todo detenido.')}
 async function loadScene(scene:Scene){if(scene.tracks.some(t=>!tracks.some(x=>x.id===t.trackId))){setMessage('Esta escena contiene pistas que ya no están disponibles.');return}const gen=++generation.current;operations.current.clear();setPreparing(scene.id);setSelected(s=>s.map(t=>t.status==='loading'?{...t,status:'stopped'}:t));
  try{const ok=await engine.scene(scene.tracks,masterRef.current);if(generation.current!==gen)return;if(ok){engine.setMaster(masterRef.current);setSelected(scene.tracks.map(t=>({...t,status:'playing'})));setActiveScene(scene.id);setSuspended(false);setMessage(`Suena «${scene.name}».`)}setPreparing(null)}catch{if(generation.current!==gen)return;setPreparing(null);setMessage(`No se ha podido preparar «${scene.name}». Tu mezcla anterior continúa. Vuelve a pulsar la escena para reintentar.`)}
 }
 function saveScene(){const name=sceneName.trim();if(!name||name.length>60||!selected.length)return;const scene:Scene={id:crypto.randomUUID(),name,tracks:selected.map(({trackId,volume})=>({trackId,volume}))};setScenes(s=>[...s,scene]);setActiveScene(scene.id);setModal(null);setMessage('Escena guardada en este navegador.')}
 function updateScene(){setScenes(s=>s.map(scene=>scene.id===activeScene?{...scene,tracks:selected.map(({trackId,volume})=>({trackId,volume}))}:scene));setMessage('Escena actualizada.')}
 function download(){const raw=storageLocked?localStorage.getItem(STORE):JSON.stringify({schemaVersion:1,masterVolume:master,scenes},null,2);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([raw||''],{type:'application/json'}));a.download='ruido-escenas.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 const originalScene=[...examples,...scenes].find(s=>s.id===activeScene);
 const activeName=originalScene?.name||'Mezcla sin guardar';
 const modified=!!originalScene&&(originalScene.tracks.length!==selected.length||originalScene.tracks.some(t=>selected.find(layer=>layer.trackId===t.trackId)?.volume!==t.volume));
 return <>
  <header className="app-header">
   <a className="brand" href="#" onClick={e=>{e.preventDefault();setTab('library')}}>ruido<span>.</span></a>
   <span className="app-purpose">Sonido para partidas de rol</span>
   <nav aria-label="Principal">
    <button aria-current={tab==='library'?'page':undefined} onClick={()=>setTab('library')}>Biblioteca</button>
    <button aria-current={tab==='scenes'?'page':undefined} onClick={()=>setTab('scenes')}>Mis escenas <span>{scenes.length}</span></button>
   </nav>
   <button className="icon-button" aria-label="Ayuda" onClick={()=>setModal('help')}><Info size={18}/></button>
  </header>
  <div className="transport" role="group" aria-label="Controles de reproducción">
   <div className={`playback-status ${playing?'playing':''}`}><span/>{playing?`${playing} pistas sonando`:'Sin reproducción'}</div>
   <label className="master-volume"><Volume2 size={18}/><span>General</span><input type="range" min="0" max="100" value={Math.round(master*100)} aria-label="Volumen general" onChange={e=>{const v=+e.target.value/100;setMaster(v);engine.setMaster(v)}} style={{'--range':`${master*100}%`} as React.CSSProperties}/><output>{Math.round(master*100)}%</output></label>
   <button className="mobile-mix-button" aria-expanded={showMixer} aria-controls="mixer" onClick={()=>setShowMixer(v=>!v)}><SlidersHorizontal size={17}/> Mezcla <span>{selected.length}</span></button>
   <button className="stop-button" onClick={stopAll}><Square size={13} fill="currentColor"/> Parar todo</button>
  </div>
  <main>
   {storageError&&<div className="warning" role="alert">{storageError}<button onClick={download}>Exportar copia</button>{storageLocked&&<button onClick={()=>{setStorageLocked(false);setStorageError('')}}>Restablecer almacenamiento</button>}</div>}
   <section className="presets" aria-labelledby="presets-title">
    <div className="section-heading"><h1 id="presets-title">Escenas</h1><span>Un clic carga la mezcla · transición de 2 s</span></div>
    <div className="preset-list">{examples.map(scene=><button key={scene.id} className={`preset ${activeScene===scene.id?'active':''}`} onClick={()=>loadScene(scene)} aria-label={`Cargar escena ${scene.name}`} aria-busy={preparing===scene.id}>
     <span className="preset-content"><strong>{scene.name}</strong><small>{scene.description}</small></span><span className="preset-layers">{scene.tracks.length} pistas</span><span className="preset-action">{preparing===scene.id?<LoaderCircle size={17} className="spin"/>:activeScene===scene.id&&playing?<AudioLines size={18}/>:<Play size={16}/>}</span>
    </button>)}</div>
   </section>
   <div className="workspace">
    <section className="library" aria-labelledby="library-title">
     <div className="section-heading"><h2 id="library-title">{tab==='library'?'Biblioteca':'Mis escenas'}</h2><span>{tab==='library'?`${visible.length} de ${tracks.length} pistas`:`${scenes.length} guardadas en este navegador`}</span></div>
     {tab==='library'?<>
      <div className="search"><Search size={18}/><input aria-label="Buscar sonidos" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por sonido o situación…"/>{query?<button className="icon-button" onClick={()=>setQuery('')} aria-label="Limpiar búsqueda"><X size={17}/></button>:<kbd>/</kbd>}</div>
      <div className="categories" role="group" aria-label="Filtrar por categoría">{categories.map(cat=><button key={cat} aria-pressed={category===cat} onClick={()=>setCategory(cat)}>{cat}</button>)}</div>
      <div className="list-heading" aria-hidden="true"><span>SONIDO</span><span>TIPO</span></div>
      <div className="sound-list">{visible.map(track=>{const item=selected.find(t=>t.trackId===track.id);const isOn=item?.status==='playing';return <article key={track.id} className={`sound-row ${item?'selected':''} ${isOn?'playing':''}`}>
       <button className="sound-play" onClick={()=>toggle(track)} aria-label={`${isOn?'Detener':item?.status==='error'?'Reintentar':'Reproducir'} ${track.title}`} aria-pressed={isOn}>{item?.status==='loading'?<LoaderCircle size={18} className="spin"/>:isOn?<Pause size={18} fill="currentColor"/>:<Play size={17}/>}</button>
       <div className="sound-name"><h3>{track.title}</h3><p>{track.description||track.tags.slice(0,3).join(' · ')}</p></div>
       <span className="sound-state">{item?.status==='loading'?'Cargando':item?.status==='error'?'Error':isOn?'Sonando':item?'En mezcla':''}</span>
       <span className="sound-type">{track.category}<small>{track.kind==='synth'?'Síntesis':track.kind==='composition'?'Composición':'Grabación'}</small></span>
       <button className="icon-button sound-info" aria-label={`Créditos de ${track.title}`} onClick={()=>{setCreditId(track.id);setModal('credits')}}><Info size={16}/></button>
      </article>})}</div>
      {!visible.length&&<div className="empty-state"><h3>Sin resultados</h3><p>Prueba otra búsqueda o cambia de categoría.</p><button className="secondary-button" onClick={()=>{setQuery('');setCategory('Todos')}}>Limpiar filtros</button></div>}
     </>:<>
      <div className="saved-tools"><p>Guarda combinaciones desde el panel de mezcla. Exporta una copia para conservarlas fuera del navegador.</p><div><button className="secondary-button" onClick={download}><Download size={15}/> Exportar</button><label className="secondary-button import-button"><Upload size={15}/> Importar<input type="file" accept="application/json" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=parseSaved(await file.text());setScenes(s=>[...s,...data.scenes.map(scene=>({...scene,id:crypto.randomUUID()}))]);setMessage('Escenas importadas.')}catch{setMessage('La copia no tiene un formato válido.')}e.target.value=''}}/></label></div></div>
      {!scenes.length?<div className="empty-state"><h3>No hay escenas guardadas</h3><p>Añade pistas y pulsa «Guardar escena» en tu mezcla.</p><button className="secondary-button" onClick={()=>setTab('library')}>Ir a la biblioteca</button></div>:<div className="saved-list">{scenes.map(scene=><article key={scene.id}><button className="saved-load" onClick={()=>loadScene(scene)}><span>{preparing===scene.id?<LoaderCircle size={17} className="spin"/>:<Play size={17}/>}</span><span><strong>{scene.name}</strong><small>{scene.tracks.length} pistas{scene.tracks.some(t=>!tracks.some(x=>x.id===t.trackId))?' · Contiene pistas no disponibles':''}</small></span></button><button className="icon-button" aria-label={`Eliminar ${scene.name}`} onClick={()=>{setDeleteId(scene.id);setModal('delete')}}><Trash2 size={17}/></button></article>)}</div>}
     </>}
    </section>
    <aside id="mixer" className={`mixer ${showMixer?'mobile-open':''}`} aria-labelledby="mix-title">
     <div className="mixer-heading"><h2 id="mix-title">Mezcla</h2><span>{selected.length}/{LIMIT} pistas</span><button className="icon-button mobile-close" aria-label="Cerrar mezcla" onClick={()=>setShowMixer(false)}><X size={19}/></button></div>
     <div className="mix-title"><strong>{activeName}{modified?' · modificada':''}</strong><span>Volumen por pista</span></div>
     {preparing&&<div className="preparing" role="status"><LoaderCircle size={16} className="spin"/><span>Preparando escena</span><button onClick={cancelPreparation}>Cancelar</button></div>}
     <div className="mix-layers">{!selected.length?<div className="empty-mix"><p>La mezcla está vacía.</p><span>Reproduce una pista o carga una escena para empezar.</span></div>:selected.map(layer=>{const track=tracks.find(t=>t.id===layer.trackId)!;return <div className={`mix-layer ${layer.status==='playing'?'playing':''}`} key={layer.trackId}>
      <div className="layer-heading"><button className="layer-toggle" onClick={()=>toggle(track)} aria-label={`${layer.status==='playing'?'Detener':'Reproducir'} ${track.title}`}>{layer.status==='loading'?<LoaderCircle size={16} className="spin"/>:layer.status==='playing'?<Pause size={16}/>:<Play size={16}/>}</button><span>{track.title}</span><button className="icon-button remove-layer" aria-label={`Retirar ${track.title}`} onClick={()=>remove(track.id)}><X size={16}/></button></div>
      <div className="layer-volume"><input type="range" min="0" max="100" value={Math.round(layer.volume*100)} aria-label={`Volumen de ${track.title}`} onChange={e=>volume(track.id,+e.target.value/100)} style={{'--range':`${layer.volume*100}%`} as React.CSSProperties}/><output>{Math.round(layer.volume*100)}%</output></div>
      {layer.status!=='playing'&&<small className={layer.status==='error'?'layer-error':''}>{layer.status==='loading'?'Cargando…':layer.status==='error'?'No se pudo cargar. Pulsa reproducir para reintentar.':'Detenida'}</small>}
     </div>})}</div>
     <div className="mix-actions"><button className="primary-button" disabled={!selected.length} onClick={()=>{setSceneName('');setModal('save')}}><Bookmark size={16}/> Guardar escena</button>{activeScene&&scenes.some(s=>s.id===activeScene)&&<button className="secondary-button" disabled={!selected.length} onClick={updateScene}><RefreshCw size={15}/> Actualizar escena</button>}<p>Guardado local en este navegador.</p></div>
     {suspended&&<button className="resume primary-button" onClick={async()=>{try{await engine.unlock();setSuspended(false)}catch{setMessage('El navegador no permite reanudar el audio.')}}}>Reanudar audio</button>}
    </aside>
   </div>
  </main>
  <footer><span>Ruido</span><div><button onClick={()=>{setCreditId(null);setModal('credits')}}>Fuentes y licencias</button><a href="./LICENSE.txt" target="_blank" rel="noreferrer">Condiciones</a><a href="https://github.com/htmlboy/ruido" target="_blank" rel="noreferrer">Código</a></div></footer>
  <div className={`toast ${message?'visible':''}`} role="status">{message&&<><span>{message}</span><button className="icon-button" aria-label="Cerrar aviso" onClick={()=>setMessage('')}><X size={17}/></button></>}</div>
  {modal&&<Modal title={modal==='save'?'Guardar escena':modal==='credits'?'Fuentes y licencias':modal==='delete'?'Eliminar escena':'Cómo usar Ruido'} onClose={()=>setModal(null)}>
   {modal==='save'?<form onSubmit={e=>{e.preventDefault();saveScene()}}><p>Se guardan las pistas y sus volúmenes. El volumen general no se incluye.</p><label className="field-label" htmlFor="scene-name">Nombre</label><input id="scene-name" className="name-input" autoFocus maxLength={60} required value={sceneName} placeholder="Nombre de la escena" onChange={e=>setSceneName(e.target.value)}/><p className="modal-detail">{selected.length} pistas · Se guarda en este navegador.</p><button type="submit" className="primary-button" disabled={!sceneName.trim()}>Guardar</button></form>:modal==='delete'?<><p>Se eliminará de este navegador. La mezcla actual seguirá sonando.</p><button className="danger-button" onClick={()=>{setScenes(s=>s.filter(scene=>scene.id!==deleteId));if(activeScene===deleteId)setActiveScene(null);setModal(null)}}>Eliminar escena</button></>:modal==='help'?<><ol className="help-list"><li>Carga una escena o reproduce pistas de la biblioteca.</li><li>Ajusta cada pista en «Mezcla» y la salida en «General».</li><li>Guarda la escena para usarla de nuevo. Exporta una copia desde «Mis escenas».</li></ol><p>Los cambios de escena duran dos segundos. «Parar todo» detiene también las cargas pendientes.</p><p>Si una pista no carga, comprueba la conexión y las reglas del bloqueador de contenido para este sitio. La reproducción en segundo plano depende del navegador y del dispositivo.</p></>:<><p>Los archivos se alojan con Ruido. Las grabaciones y las composiciones de terceros conservan sus autores y licencias. Las capas de síntesis se identifican en la biblioteca.</p><div className="credit-list">{tracks.filter(t=>!creditId||t.id===creditId).map(t=><article key={t.id}><h3>{t.title}</h3><p>{t.author} · <a href={t.licenseUrl} target="_blank" rel="noreferrer">{t.license}</a></p><small>{t.modifications}</small><a href={t.sourceUrl} target="_blank" rel="noreferrer">Fuente original <ArrowUpRight size={12}/></a></article>)}</div><p className="modal-detail"><a href="./ATTRIBUTIONS.md" target="_blank">Registro completo de atribuciones</a></p></>}
  </Modal>}
 </>
}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{const dialog=ref.current!;const previous=document.activeElement as HTMLElement|null;dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=old;previous?.focus()}},[]);return <dialog ref={ref} className="modal" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}} aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button aria-label="Cerrar" onClick={onClose}><X size={20}/></button></div>{children}</dialog>}
