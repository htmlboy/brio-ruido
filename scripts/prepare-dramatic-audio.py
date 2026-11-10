"""Prepare the dramatic library from documented OpenGameArt compositions.
Run after prepare-audio.py. Requires numpy and ffmpeg. No API token needed.
"""
from pathlib import Path
import concurrent.futures,hashlib,json,subprocess,urllib.request,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
RAW=Path('/tmp/ruido-dramatic');RAW.mkdir(exist_ok=True)
OUT=ROOT/'public/audio';SR=24000
SOURCES=json.loads((ROOT/'docs/audio/dramatic-sources.json').read_text())
CC0='https://creativecommons.org/publicdomain/zero/1.0/'
def encode(id,x,overlap):
 x=np.asarray(x,dtype=float);x-=x.mean()
 l=int(min(overlap*SR,len(x)//8))
 if l:
  t=np.linspace(0,1,l);x=np.concatenate([x[l:-l],x[-l:]*(1-t)+x[:l]*t])
 rms=np.sqrt(np.mean(x*x));peak=np.max(np.abs(x));x*=min(.105/max(rms,1e-9),.82/max(peak,1e-9))
 wav=RAW/f'{id}.wav'
 with wave.open(str(wav),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((x*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(OUT/f'{id}.mp3')],check=True)
 return round(len(x)/SR,3)
def prepare(source):
 raw=RAW/(source['id']+'-source.mp3')
 if not raw.exists():
  with urllib.request.urlopen(source['assetUrl'],timeout=60) as r:raw.write_bytes(r.read())
 cmd=['ffmpeg','-v','error','-i',str(raw)]
 if source['maxSeconds']:cmd+=['-t',str(source['maxSeconds'])]
 pcm=subprocess.run(cmd+['-ar',str(SR),'-ac','1','-f','f32le','pipe:1'],check=True,capture_output=True).stdout
 duration=encode(source['id'],np.frombuffer(pcm,dtype='<f4'),source['overlap'])
 return dict(id=source['id'],title=source['title'],description=source['description'],category=source['category'],tags=source['tags'],src=f"audio/{source['id']}.mp3",author=source['author'],sourceUrl=source['sourceUrl'],license=source['license'],licenseUrl=source['licenseUrl'],modifications='Composición obtenida de OpenGameArt; '+('extracto, ' if source['maxSeconds'] else '')+'conversión a mono, ajuste de nivel y unión de bucle con fundido cruzado.',defaultVolume=source['volume'],kind=source['kind'],duration=duration,upstreamUrl=source['assetUrl'],originalSha256=hashlib.sha256(raw.read_bytes()).hexdigest(),licenseEvidence=source['evidenceUrl'])
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:new=list(pool.map(prepare,SOURCES))
# Two original rhythmic layers. Their time structure is integral to each loop.
rng=np.random.default_rng(20261105)
def impulse_bed(id,seconds,bpm,style):
 n=int(SR*seconds);x=np.zeros(n);beat=60/bpm
 def add(offset,sample,level=1):
  start=int(offset*SR);idx=(np.arange(len(sample))+start)%n;np.add.at(x,idx,sample*level)
 if style=='heart':
  for pos in np.arange(0,seconds,beat):
   for delay,level in [(0,1),(.19,.65)]:
    t=np.arange(int(.22*SR))/SR;hit=np.sin(2*np.pi*(65*t+20*(1-np.exp(-t*15))/15))*np.exp(-t*25)
    hit+=rng.standard_normal(len(t))*.08*np.exp(-t*45);add(pos+delay,hit,level)
 else:
  for step,pos in enumerate(np.arange(0,seconds,beat/2)):
   t=np.arange(int(.3*SR))/SR
   if step%2==0:
    hit=np.sin(2*np.pi*(46*t+55*(1-np.exp(-t*25))/25))*np.exp(-t*15)
    hit+=rng.standard_normal(len(t))*.16*np.exp(-t*23);add(pos,hit,.8 if step%8==0 else .55)
   tick=rng.standard_normal(int(.055*SR));tick=np.concatenate([[0],np.diff(tick)])[:len(tick)]*np.exp(-np.arange(len(tick))/SR*90);add(pos,tick,.08 if step%2 else .05)
   hz=[110,110,130.8128,123.4708,110,164.8138,130.8128,103.8262][step%8]
   t=np.arange(int(beat*.8*SR))/SR;note=(np.sin(2*np.pi*hz*t)+.3*np.sin(2*np.pi*hz*2*t))*np.exp(-t*11)*(1-np.exp(-t*150));add(pos,note,.22)
 # A small crossfade closes the rendered seam without washing out the rhythm.
 return encode(id,x,.005)
for id,title,description,category,tags,bpm,style,seconds in [
 ('heartbeat','Latido acelerado','Doble pulso grave. Para peligro cercano y cuenta atrás.','Tensión',['latido','corazón','peligro','cuenta atrás','amenaza'],96,'heart',40),
 ('pursuit','Ritmo de persecución','Percusión seca y secuencia menor a 120 BPM.','Acción',['persecución','combate','huida','ritmo','120 bpm'],120,'chase',32)]:
 duration=impulse_bed(id,seconds,bpm,style)
 new.append(dict(id=id,title=title,description=description,category=category,tags=tags,src=f'audio/{id}.mp3',author='Ruido',sourceUrl='https://github.com/htmlboy/brio-ruido/blob/main/scripts/prepare-dramatic-audio.py',license='CC0 1.0',licenseUrl=CC0,modifications='Síntesis original por impulsos y osciladores, secuenciada sin muestras externas; ajuste de nivel y preparación del bucle.',defaultVolume=.35,kind='synth',duration=duration))
ids={t['id'] for t in new}
base=[t for t in json.loads((ROOT/'src/catalog.json').read_text()) if t['id'] not in ids]
tracks=new+base
(ROOT/'src/catalog.json').write_text(json.dumps(tracks,ensure_ascii=False,indent=2)+'\n')
lines=['# Atribuciones de audio','','Cada archivo conserva su licencia independiente de la licencia restrictiva del código. Las fuentes, modificaciones y huellas de los originales están documentadas en `src/catalog.json`.','','Las grabaciones iniciales proceden del catálogo de Blanket, en la revisión fijada en `scripts/blanket-revision.txt`. La ampliación dramática utiliza composiciones de OpenGameArt bajo CC0, CC BY 3.0 y OGA-BY 3.0, con evidencia por archivo en `docs/audio/dramatic-sources.json`. Las capas originales de Ruido se publican bajo CC0.','']
for t in tracks:
 lines += [f"## {t['title']} (`{t['id']}`)",'',f"- Autor: {t['author']}",f"- Fuente: {t['sourceUrl']}",f"- Licencia: [{t['license']}]({t['licenseUrl']})",f"- Modificaciones: {t['modifications']}"]
 if t.get('upstreamUrl'):lines.append(f"- Archivo utilizado: {t['upstreamUrl']}")
 if t.get('licenseEvidence'):lines.append(f"- Evidencia de licencia: {t['licenseEvidence']}")
 lines.append('')
for p in [ROOT/'ATTRIBUTIONS.md',ROOT/'public/ATTRIBUTIONS.md']:p.write_text('\n'.join(lines))
print(f'{len(new)} pistas dramáticas preparadas; {len(tracks)} pistas en total.')
