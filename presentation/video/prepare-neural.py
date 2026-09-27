"""Generate natural narration and sentence timings from the synthetic demo script."""
import asyncio, json, subprocess, html
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parent
VOICE='en-US-AvaMultilingualNeural'
RATE='+5%'
async def generate(scene):
    target=ROOT/'assets'/f"neural-{scene['id']}.mp3"
    narration=' '.join(scene['lines'])
    # Pronunciation hint stays in the spoken track; captions retain the written names.
    spoken=narration.replace('Jev, GBrain','Jev, G Brain')
    boundaries=[]
    communicate=edge_tts.Communicate(spoken,VOICE,rate=RATE,boundary='SentenceBoundary')
    with target.open('wb') as out:
        async for chunk in communicate.stream():
            if chunk['type']=='audio': out.write(chunk['data'])
            elif chunk['type']=='SentenceBoundary':
                boundaries.append({'offset':chunk['offset']/10_000_000,'duration':chunk['duration']/10_000_000,'text':html.unescape(chunk['text']).replace('G Brain','GBrain')})
    duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)],text=True))
    if duration<2 or not boundaries: raise RuntimeError('Narration or caption timings missing')
    scene['audio']=[{'file':str(target),'duration':duration,'offset':0,'text':narration}]
    scene['captions']=boundaries
    scene['duration']=round(duration+1.3,3)
    scene['voice']={'provider':'Microsoft Edge online speech','name':VOICE,'rate':RATE,'synthetic':True}
    print(scene['id'],scene['duration'],'seconds;',len(boundaries),'captions',flush=True)
async def main():
    scenes=json.loads((ROOT/'story.json').read_text())
    for scene in scenes: await generate(scene)
    (ROOT/'timing.json').write_text(json.dumps(scenes,indent=2))
    print('TOTAL',round(sum(s['duration'] for s in scenes),1),flush=True)
asyncio.run(main())
