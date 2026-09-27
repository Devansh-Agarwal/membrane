import asyncio, json, subprocess, html
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parent
async def main():
 scenes=json.loads((ROOT/'story.json').read_text())
 for scene in scenes:
  target=ROOT/(scene['id']+'.mp3')
  boundaries=[]
  c=edge_tts.Communicate(' '.join(scene['lines']),'en-US-AvaMultilingualNeural',rate='+5%',boundary='SentenceBoundary')
  with target.open('wb') as out:
   async for chunk in c.stream():
    if chunk['type']=='audio':out.write(chunk['data'])
    elif chunk['type']=='SentenceBoundary':boundaries.append({'offset':chunk['offset']/10000000,'duration':chunk['duration']/10000000,'text':html.unescape(chunk['text']).replace('G Brain','GBrain')})
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)],text=True))
  if duration<2 or not boundaries:raise RuntimeError('Missing voice or caption data')
  scene.update(audio=str(target),audioDuration=duration,duration=duration+1.4,captions=boundaries)
  print(scene['id'],round(duration+1.4,2),'seconds',flush=True)
 (ROOT/'timing.json').write_text(json.dumps(scenes,indent=2))
asyncio.run(main())
