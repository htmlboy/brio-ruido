"""Prepare only the editorially selected, attributed tracks. No bulk catalog import.
Requires Python 3, ffmpeg and network access when original sources are not cached.
"""
from pathlib import Path
import hashlib,json,shutil,subprocess,urllib.request

ROOT=Path(__file__).resolve().parents[1]
SELECTION=ROOT/'docs/audio/incompetech-selection.json'
CACHE=Path('/tmp/ruido-incompetech-selection');CACHE.mkdir(exist_ok=True)
OUT=ROOT/'public/audio/music';OUT.mkdir(parents=True,exist_ok=True)

def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as file:
  for block in iter(lambda:file.read(1024*1024),b''):h.update(block)
 return h.hexdigest()

def write_credits(tracks):
 lines=['# Atribuciones de audio','','Los archivos conservan sus licencias individuales. La licencia restrictiva del código no se aplica a estos audios. Los títulos originales, autores, enlaces, modificaciones y huellas están documentados en `src/catalog.json` y los manifiestos de `docs/audio/`.','']
 for t in tracks:
  lines += [f"## {t['title']} (`{t['id']}`)",'',f"- Autor: {t['author']}",f"- Fuente: {t['sourceUrl']}",f"- Licencia: [{t['license']}]({t['licenseUrl']})",f"- Modificaciones: {t['modifications']}"]
  if t.get('attribution'):lines.append('- Crédito: '+t['attribution'])
  if t.get('upstreamUrl'):lines.append('- Archivo original: '+t['upstreamUrl'])
  if t.get('licenseEvidence'):lines.append('- Evidencia de licencia: '+t['licenseEvidence'])
  lines.append('')
 for path in [ROOT/'ATTRIBUTIONS.md',ROOT/'public/ATTRIBUTIONS.md']:path.write_text('\n'.join(lines))

def main():
 selected=json.loads(SELECTION.read_text())
 if len(selected)!=18:raise RuntimeError('This preparation script is limited to the reviewed 18-track selection')
 for track in selected:
  if track['license']!='CC BY 4.0' or track['licenseUrl']!='https://creativecommons.org/licenses/by/4.0/':
   raise RuntimeError('Unexpected source license; review before downloading')
  target=ROOT/'public'/track['src']
  if target.exists() and sha(target)==track['outputSha256']:continue
  staged=ROOT/'.local/incompetech'/(track['isrc']+'.mp3')
  if staged.exists() and sha(staged)==track['outputSha256']:
   shutil.copyfile(staged,target);continue
  raw=CACHE/(track['isrc']+'-original.mp3')
  if not raw.exists():
   with urllib.request.urlopen(track['upstreamUrl'],timeout=60) as response,raw.open('wb') as file:shutil.copyfileobj(response,file)
  if sha(raw)!=track['originalSha256']:raise RuntimeError('Original recording changed; review source and license before replacing it')
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-vn','-ar','44100','-ac','2','-codec:a','libmp3lame','-b:a','128k',
   '-metadata','title='+track['title'],'-metadata','artist=Kevin MacLeod','-metadata','comment='+track['attribution'],str(target)],check=True)
  track['outputSha256']=sha(target)
 ids={track['id'] for track in selected}
 original=json.loads((ROOT/'src/catalog.json').read_text())
 tracks=selected+[track for track in original if track['id'] not in ids]
 (ROOT/'src/catalog.json').write_text(json.dumps(tracks,ensure_ascii=False,indent=2)+'\n')
 SELECTION.write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n')
 write_credits(tracks)
 print('Prepared',len(selected),'complete tracks; active catalog:',len(tracks))

if __name__=='__main__':main()
