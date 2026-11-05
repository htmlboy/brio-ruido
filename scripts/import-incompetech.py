"""Inventory source-declared CC BY 4.0 tracks and stage attributed media outside Git.

Default: refresh the metadata inventory only.
Examples:
  python scripts/import-incompetech.py
  python scripts/import-incompetech.py --download --isrc USUAN1200059 --transcode
  python scripts/import-incompetech.py --download --all --transcode --max-bytes 5500000000

Original files are fetched from the composer's own public download endpoints.
No credentials are needed. Full audio is never staged inside public/ or Git.
"""
from __future__ import annotations
import argparse,datetime,hashlib,json,re,shutil,subprocess,time,urllib.parse,urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://incompetech.com/music/royalty-free/'
LICENSE='https://creativecommons.org/licenses/by/4.0/'
MANIFEST=ROOT/'docs/audio/incompetech-catalog.json'
STAGING=ROOT/'.local/incompetech'

def seconds(length: str) -> int:
    if not isinstance(length,str):raise ValueError('Invalid track duration')
    parts=length.split(':')
    if len(parts)!=3 or any(not p.isdigit() for p in parts):
        raise ValueError('Invalid track duration')
    h,m,s=map(int,parts)
    if m>=60 or s>=60:raise ValueError('Invalid track duration')
    return h*3600+m*60+s

def normalize(track: dict) -> dict:
    isrc=track.get('isrc','')
    filename=track.get('filename','')
    if not re.fullmatch(r'[A-Z]{2}[A-Z0-9]{3}\d{7}',isrc):raise ValueError('Invalid ISRC')
    if not filename or filename!=Path(filename).name or '/' in filename or '\\' in filename or not filename.lower().endswith('.mp3'):
        raise ValueError('Unsafe source filename')
    duration=seconds(track['length'])
    if duration<=0:raise ValueError('Invalid track duration')
    title=track['title'].strip()
    if not title:raise ValueError('Missing title')
    return {
        'id':'km-'+isrc.lower(),'isrc':isrc,'title':title,'author':'Kevin MacLeod',
        'duration':duration,'instruments':track.get('instruments') or '',
        'moods':[x.strip() for x in (track.get('feel') or '').split(',') if x.strip()],
        'bpm':track.get('bpm') or '','genreCode':str(track.get('genre','')),
        'collectionCode':str(track.get('collection') or ''),
        'sourceUrl':SOURCE+'index.html?isrc='+isrc,
        'downloadUrl':SOURCE+'mp3-royaltyfree/'+urllib.parse.quote(filename,safe=''),
        'sourceDeclaredLicense':'CC BY 4.0','licenseUrl':LICENSE,
        'attribution':f'"{title}" Kevin MacLeod (incompetech.com). Licensed under Creative Commons Attribution 4.0: {LICENSE}',
    }

def read_url(url: str) -> bytes:
    with urllib.request.urlopen(url,timeout=45) as response:return response.read()

def inventory() -> dict:
    raw=read_url(SOURCE+'pieces.json')
    # Check the actual detail-page grant rather than infer rights from a title.
    evidence=read_url(SOURCE+'index.html?isrc=USUAN1200059')
    if b'By Attribution 4.0 License' not in evidence or b'creativecommons.org/licenses/by/4.0/' not in evidence:
        raise RuntimeError('Source license template changed: review rights before downloading')
    tracks=[];excluded=[];seen=set()
    for item in json.loads(raw):
        try:
            track=normalize(item)
            if track['isrc'] in seen:raise ValueError('Duplicate ISRC')
            seen.add(track['isrc']);tracks.append(track)
        except (ValueError,KeyError,TypeError) as error:
            excluded.append({'title':item.get('title',''),'isrc':item.get('isrc',''),'reason':str(error)})
    result={
        'source':SOURCE+'pieces.json','retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'sourceSha256':hashlib.sha256(raw).hexdigest(),
        'licenseEvidenceUrl':SOURCE+'index.html?isrc=USUAN1200059',
        'licenseEvidenceSha256':hashlib.sha256(evidence).hexdigest(),
        'licenseScope':'The official track detail page declares CC BY 4.0 for catalog entries. Preserve per-track credits; this inventory is not proof of the Delta Green console playlist.',
        'tracks':sorted(tracks,key=lambda t:t['isrc']),'excluded':excluded,
    }
    MANIFEST.parent.mkdir(parents=True,exist_ok=True)
    MANIFEST.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    return result

def digest(path: Path) -> str:
    h=hashlib.sha256()
    with path.open('rb') as file:
        for block in iter(lambda:file.read(1024*1024),b''):h.update(block)
    return h.hexdigest()

def download(track: dict,transcode: bool,remaining: int) -> dict:
    if track['sourceDeclaredLicense']!='CC BY 4.0' or track['licenseUrl']!=LICENSE:
        raise ValueError('Unapproved source license')
    parsed=urllib.parse.urlsplit(track['downloadUrl'])
    if parsed.scheme!='https' or parsed.hostname!='incompetech.com' or not parsed.path.startswith('/music/royalty-free/mp3-royaltyfree/'):
        raise ValueError('Unexpected source download origin')
    STAGING.mkdir(parents=True,exist_ok=True)
    output=STAGING/(track['isrc']+'.mp3')
    receipt=STAGING/(track['isrc']+'.json')
    if receipt.exists() and output.exists():
        previous=json.loads(receipt.read_text())
        if previous['outputSha256']==digest(output) and previous['transcoded']==transcode:
            return previous
        raise RuntimeError('Existing output differs; inspect it before replacing it')
    estimate=int(track['duration']*128000/8+32768) if transcode else None
    if estimate is not None and estimate>remaining:
        raise RuntimeError('Staging byte budget reached; resume with a larger --max-bytes')
    part=STAGING/(track['isrc']+'.source.part')
    try:
        with urllib.request.urlopen(track['downloadUrl'],timeout=60) as response,part.open('wb') as file:
            length=int(response.headers.get('Content-Length','0'))
            # Transcoding also needs temporary space for the source file.
            if length and shutil.disk_usage(STAGING).free<length*2+200*1024*1024:
                raise RuntimeError('Insufficient staging disk space')
            received=0
            while chunk:=response.read(1024*1024):
                received+=len(chunk)
                if received>1024*1024*1024:raise RuntimeError('Unexpectedly large source file')
                file.write(chunk)
        source_hash=digest(part)
        probe=subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(part)],text=True)
        actual_duration=float(json.loads(probe)['format']['duration'])
        if abs(actual_duration-track['duration'])>max(3,track['duration']*.02):
            raise RuntimeError('Source duration differs from catalog; review the file')
        estimate=int(actual_duration*128000/8+32768) if transcode else part.stat().st_size
        if estimate>remaining:raise RuntimeError('Staging byte budget reached; resume with a larger --max-bytes')
        if transcode:
            subprocess.run(['ffmpeg','-v','error','-y','-i',str(part),'-vn','-ar','44100','-ac','2','-codec:a','libmp3lame','-b:a','128k',
                '-metadata','title='+track['title'],'-metadata','artist=Kevin MacLeod','-metadata','comment='+track['attribution'],str(output)],check=True)
            changes='Re-encoded to stereo MP3, 44.1 kHz, 128 kbps; duration and musical structure retained. No loop edits or cuts.'
        else:
            part.replace(output);changes='Original source audio; no audio modifications.'
        if output.stat().st_size>remaining:
            output.unlink();raise RuntimeError('Staging byte budget reached')
        result={**track,'file':output.name,'sourceSha256':source_hash,'outputSha256':digest(output),
                'bytes':output.stat().st_size,'transcoded':transcode,'modifications':changes}
        receipt.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        return result
    finally:
        part.unlink(missing_ok=True)

def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh',action='store_true',help='Refresh official metadata and license evidence')
    parser.add_argument('--download',action='store_true')
    parser.add_argument('--all',action='store_true',help='Select all inventory tracks explicitly')
    parser.add_argument('--isrc',action='append',default=[],help='Select a specific ISRC; repeat as needed')
    parser.add_argument('--transcode',action='store_true',help='Re-encode to 128 kbps stereo while preserving complete tracks')
    parser.add_argument('--max-bytes',type=int,default=512*1024*1024,help='Total audio staging budget; default 512 MiB')
    args=parser.parse_args()
    if args.max_bytes<=0:parser.error('--max-bytes must be positive')
    data=inventory() if args.refresh or not MANIFEST.exists() else json.loads(MANIFEST.read_text())
    print(f"Inventory: {len(data['tracks'])} tracks; {len(data['excluded'])} excluded; {sum(t['duration'] for t in data['tracks'])/3600:.1f} hours",flush=True)
    if not args.download:return
    if not args.all and not args.isrc:parser.error('--download requires --all or at least one --isrc')
    known={t['isrc'] for t in data['tracks']}
    if set(args.isrc)-known:parser.error('Unknown selected ISRC')
    selected=[t for t in data['tracks'] if args.all or t['isrc'] in args.isrc]
    used=sum(p.stat().st_size for p in STAGING.glob('*.mp3')) if STAGING.exists() else 0
    for i,track in enumerate(selected):
        already=(STAGING/(track['isrc']+'.mp3')).exists()
        receipt=download(track,args.transcode,args.max_bytes-used)
        if not already:used+=receipt['bytes']
        print(f"{i+1}/{len(selected)} {track['isrc']} {track['title']} | staged {used/1024/1024:.1f} MiB",flush=True)
        # Be conservative with requests to the composer's service.
        time.sleep(.5)
    credits=['# Incompetech staged media attribution','']
    for track in selected:
        receipt=json.loads((STAGING/(track['isrc']+'.json')).read_text())
        credits.extend([receipt['attribution'],'Source: '+receipt['sourceUrl'],'Modifications: '+receipt['modifications'],''])
    (STAGING/'ATTRIBUTIONS.md').write_text('\n'.join(credits))
    print('Staging complete. Media is local and ignored by Git; uploading/publishing is a separate step.',flush=True)

if __name__=='__main__':main()
