"""Fetch attributed open recordings and create original synthetic layers.
Requires Python + numpy + ffmpeg. Run from repository root.
"""
from pathlib import Path
import json, subprocess, urllib.request, concurrent.futures, wave, hashlib
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
RAW=Path('/tmp/ruido-recordings'); RAW.mkdir(exist_ok=True)
OUT=ROOT/'public/audio'; OUT.mkdir(parents=True,exist_ok=True)
# Exact upstream revision is recorded in the provenance file during preparation.
revision=(ROOT/'scripts/blanket-revision.txt').read_text().strip()
cc0='https://creativecommons.org/publicdomain/zero/1.0/'
by3='https://creativecommons.org/licenses/by/3.0/'
by4='https://creativecommons.org/licenses/by/4.0/'
pd='https://creativecommons.org/publicdomain/mark/1.0/'
recordings=[
('birds','Pájaros del bosque','Naturaleza',['aves','día','bosque'],'kvgarlic','https://freesound.org/people/kvgarlic/sounds/156826/','CC0 1.0',cc0,'Porrumentzio'),
('boat','Barca de madera','Agua',['remo','lago','puerto'],'Falcet','https://freesound.org/people/Falcet/sounds/439365/','CC0 1.0',cc0,'Porrumentzio'),
('city','Calle y tráfico','Ciudad',['calle','coches','tráfico'],'gezortenplotz','https://freesound.org/people/gezortenplotz/sounds/44796/','CC BY 3.0',by3,'Porrumentzio'),
('coffee-shop','Cafetería','Interiores',['gente','charla','taberna','café','restaurante'],'stephan','https://soundbible.com/1664-Restaurant-Ambiance.html','Dominio público',pd,''),
('fireplace','Fuego de hogar','Interiores',['fuego','chimenea','campamento','taberna'],'ezwa','https://soundbible.com/1543-Fireplace.html','Dominio público',pd,''),
('rain','Lluvia','Clima',['agua','tormenta','lluvia'],'alex36917','https://freesound.org/people/alex36917/sounds/524605/','CC BY 4.0',by4,'Porrumentzio'),
('storm','Tormenta lejana','Clima',['truenos','lluvia','cielo'],'Digifish music','https://freesound.org/people/digifishmusic/sounds/41739/','CC BY 4.0',by4,'Porrumentzio'),
('stream','Arroyo','Agua',['río','agua','bosque'],'gluckose','https://freesound.org/people/gluckose/sounds/333987/','CC0 1.0',cc0,''),
('summer-night','Noche de verano','Naturaleza',['grillos','noche','campo'],'Lisa Redfern','https://soundbible.com/2083-Crickets-Chirping-At-Night.html','Dominio público',pd,''),
('train','Dentro del tren','Ciudad',['viaje','vagón','máquina'],'SDLx','https://freesound.org/people/SDLx/sounds/259988/','CC BY 3.0',by3,''),
('waves','Oleaje','Agua',['mar','playa','puerto'],'Luftrum','https://freesound.org/people/Luftrum/sounds/48412/','CC BY 4.0',by4,'Porrumentzio'),
('wind','Viento abierto','Clima',['aire','montaña','viento'],'felix.blume','https://freesound.org/people/felix.blume/sounds/217506/','CC0 1.0',cc0,'Porrumentzio')]
SR=24000
tracks=[]
def write(id,x):
 x=x.astype(float);x-=x.mean()
 # Equal-power is unnecessary for correlated edges: linear overlap prevents a seam.
 l=min(SR*2,len(x)//8);t=np.linspace(0,1,l)
 x=np.concatenate([x[l:-l],x[-l:]*(1-t)+x[:l]*t])
 rms=np.sqrt(np.mean(x*x));x*=min(.12/max(rms,1e-9),.85/max(np.max(np.abs(x)),1e-9))
 path=RAW/f'{id}-loop.wav'
 with wave.open(str(path),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((x*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(path),'-codec:a','libmp3lame','-b:a','64k',str(OUT/f'{id}.mp3')],check=True)
 return round(len(x)/SR,3)
def recorded(row):
 id,title,category,tags,author,url,license,license_url,editor=row
 source=f'https://raw.githubusercontent.com/rafaelmardojai/blanket/{revision}/data/resources/sounds/{id}.ogg'
 raw=RAW/f'{id}.ogg'
 if not raw.exists():
  with urllib.request.urlopen(source,timeout=60) as r:raw.write_bytes(r.read())
 data=subprocess.run(['ffmpeg','-v','error','-i',str(raw),'-t','20','-ac','1','-ar',str(SR),'-f','f32le','pipe:1'],capture_output=True,check=True).stdout
 duration=write(id,np.frombuffer(data,dtype='<f4'))
 return dict(id=id,title=title,category=category,tags=tags,src=f'audio/{id}.mp3',author=author,sourceUrl=url,license=license,licenseUrl=license_url,modifications=(f'Edición previa: {editor}. ' if editor else '')+'Ruido: extracto, conversión a mono, ajuste de nivel y unión con fundido cruzado.',defaultVolume=.45,kind='recorded',duration=duration,upstreamUrl=source,originalSha256=hashlib.sha256(raw.read_bytes()).hexdigest())
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: tracks=list(pool.map(recorded,recordings))
# Original procedural material; deterministic seed, no samples from third parties.
rng=np.random.default_rng(241104);n=SR*18;t=np.arange(n)/SR
white=rng.standard_normal(n)
freq=np.fft.rfftfreq(n,1/SR)
def colored(power,lo=30,hi=10000):
 spec=np.fft.rfft(rng.standard_normal(n));weight=1/np.maximum(freq,lo)**power;weight[freq<lo]=0;weight[freq>hi]=0
 x=np.fft.irfft(spec*weight,n);return x/np.std(x)
synthetics=[
('soft-rain','Llovizna','Clima',['lluvia','suave'],colored(.1,700,9500)),
('roof-rain','Lluvia en el tejado','Clima',['lluvia','techo','refugio'],colored(.45,100,6500)*(1+.12*np.sin(2*np.pi*t*.4))),
('gusts','Ráfagas de viento','Clima',['aire','ventisca'],colored(.9,40,1800)*(.55+.35*np.sin(2*np.pi*t*.12))),
('deep-water','Bajo el agua','Agua',['profundidad','submarino'],colored(1.1,35,600)+.2*np.sin(2*np.pi*64*t)),
('distant-sea','Mar en calma','Agua',['olas','mar','costa'],colored(.5,100,6000)*(.6+.35*np.sin(2*np.pi*t/6))),
('engine','Motor distante','Ciudad',['máquina','industrial','tráfico'],colored(1,25,700)+.7*np.sin(2*np.pi*55*t)+.3*np.sin(2*np.pi*110*t)),
('air-vent','Ventilación','Interiores',['ventilador','nave','aire'],colored(.6,70,3500)),
('radio','Estática de radio','Interiores',['ruido','radio','señal'],colored(0,300,9000)*(.8+.2*np.sin(2*np.pi*t*.8))),
]
for id,title,notes in [('embers','Brasas',[110,164.81,220,261.63]),('suspense','Algo se acerca',[55,82.41,116.54,174.61]),('starlight','Luz entre estrellas',[130.81,196,261.63,329.63]),('pulse','Pulso electrónico',[65.41,130.81,196,261.63])]:
 x=np.zeros(n)
 for j,hz in enumerate(notes):
  hz=round(hz*18)/18
  x+=(np.sin(2*np.pi*hz*t)+.13*np.sin(2*np.pi*hz*2*t))*(.6+.25*np.sin(2*np.pi*(j+1)*t/18))/(j+1)
 if id=='pulse': x*=.35+.65*(.5+.5*np.cos(2*np.pi*1.5*t))**4
 synthetics.append((id,title,'Música',['base','electrónica','sintético','ambient'],x))
for id,title,category,tags,x in synthetics:
 duration=write(id,x)
 tracks.append(dict(id=id,title=title,category=category,tags=tags,src=f'audio/{id}.mp3',author='Ruido',sourceUrl='https://github.com/htmlboy/ruido/blob/main/scripts/prepare-audio.py',license='CC0 1.0',licenseUrl=cc0,modifications='Síntesis original generada con el script de Ruido; ajuste de nivel y bucle con fundido cruzado.',defaultVolume=.3 if category=='Música' else .4,kind='synth',duration=duration))
(ROOT/'src/catalog.json').write_text(json.dumps(tracks,ensure_ascii=False,indent=2)+'\n')
lines=['# Atribuciones de audio','',f'Grabaciones obtenidas de Blanket, revisión `{revision}`. Su código no se incorpora a Ruido. Las licencias de cada grabación son independientes del código de Blanket.','', 'Las versiones CC BY se contrastaron con los enlaces originales. La procedencia y huella del archivo descargado se conservan en `src/catalog.json`. Los audios sintetizados originales se ofrecen bajo CC0.','']
for track in tracks:
 lines.extend([f"## {track['title']} (`{track['id']}`)",'',f"- Autor: {track['author']}",f"- Fuente: {track['sourceUrl']}",f"- Licencia: [{track['license']}]({track['licenseUrl']})",f"- Modificaciones: {track['modifications']}"])
 if 'upstreamUrl' in track:lines.append(f"- Archivo utilizado: {track['upstreamUrl']}")
 lines.append('')
(ROOT/'ATTRIBUTIONS.md').write_text('\n'.join(lines))
(ROOT/'public/ATTRIBUTIONS.md').write_text('\n'.join(lines))
print(f'{len(tracks)} pistas preparadas.')
