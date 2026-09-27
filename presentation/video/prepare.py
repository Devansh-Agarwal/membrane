import json, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent
scenes=json.loads((ROOT/'story.json').read_text())
for scene in scenes:
    duration=0
    for j,line in enumerate(scene['lines']):
        name=f"{scene['id']}-{j+1:02d}"
        text=ROOT/'assets'/f'{name}.txt'
        audio=ROOT/'assets'/f'{name}.aiff'
        text.write_text(line)
        subprocess.run(['say','-v','Samantha','-r','178','-f',str(text),'-o',str(audio)],check=True)
        secs=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(audio)],text=True))
        if secs<0.3: raise RuntimeError('Narration synthesis produced empty audio')
        scene.setdefault('audio',[]).append({'file':str(audio),'text':line,'duration':secs,'offset':duration})
        duration+=secs+0.22
    scene['duration']=round(duration+1.3,3)
    print(scene['id'],scene['duration'],flush=True)
(ROOT/'timing.json').write_text(json.dumps(scenes,indent=2))
print('TOTAL',round(sum(s['duration'] for s in scenes),1),flush=True)
