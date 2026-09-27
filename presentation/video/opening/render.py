import json, subprocess, textwrap, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
VIDEO=ROOT.parent
scenes=json.loads((ROOT/'timing.json').read_text())
old=json.loads((VIDEO/'recording-timing.json').read_text())['scenes']
trim=next(s['start'] for s in old if s['id']=='chat')
old_duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(VIDEO/'when-and-what-demo-v2.mp4')],text=True))
intro_duration=sum(s['duration'] for s in scenes)
def ass_time(t):
 c=round(t*100);h,c=divmod(c,360000);m,c=divmod(c,6000);s,c=divmod(c,100);return f'{h}:{m:02}:{s:02}.{c:02}'
def srt_time(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
style='''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,30,&H00FFFFFF,&H00FFFFFF,&H001A1020,&H001A1020,0,0,0,0,100,100,0,0,1,0,0,2,120,120,27,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
all_cues=[]
chapter_start=0
for i,s in enumerate(scenes):
 s['start']=chapter_start
 ass=style
 for cue in s['captions']:
  a=.45+cue['offset'];b=a+cue['duration'];text='\\N'.join(textwrap.wrap(cue['text'],86))
  ass+=f'Dialogue: 0,{ass_time(a)},{ass_time(b)},Default,,0,0,0,,{text}\n'
  all_cues.append((chapter_start+a,chapter_start+b,cue['text']))
 caption=ROOT/f'{s["id"]}.ass';caption.write_text(ass)
 print('Rendering slide',s['id'],round(s['duration'],1),'seconds',flush=True)
 image=ROOT/('1-problem.png' if i==0 else '2-jev-pipeline.png')
 target=ROOT/(s['id']+'.mp4')
 fade=',fade=t=in:st=0:d=0.25' if i==0 else ''
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-loop','1','-framerate','30','-i',str(image),'-i',s['audio'],'-vf',f'drawbox=x=0:y=964:w=1920:h=116:color=0x0b1732:t=fill,ass={caption.name}{fade}','-af','adelay=450,apad,loudnorm=I=-16:TP=-1.5:LRA=11','-c:v','libx264','-preset','fast','-tune','stillimage','-crf','20','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','160k','-ar','48000','-t',str(s['duration']),str(target)],cwd=ROOT,check=True)
 chapter_start+=s['duration']
for s in old:
 if s['id']=='intro':continue
 for cue in s['captions']:
  a=intro_duration+s['start']-trim+.45+cue['offset'];b=a+cue['duration']
  all_cues.append((a,b,cue['text']))
(VIDEO/'when-and-what-demo-v3.srt').write_text('\n\n'.join(f'{i+1}\n{srt_time(a)} --> {srt_time(b)}\n'+textwrap.fill(t,86) for i,(a,b,t) in enumerate(all_cues))+'\n')
meta=';FFMETADATA1\ntitle=When & What — The memory problem, Jev, and the demo\ncomment=Synthetic Ava neural narration. Jev classification and GBrain dispatch simulated in the prototype.\n'
chapters=[(s['start'],s['start']+s['duration'],s['title']) for s in scenes]+[(intro_duration+s['start']-trim,intro_duration+s['end']-trim,s['title']) for s in old if s['id']!='intro']
for a,b,title in chapters:meta+=f'\n[CHAPTER]\nTIMEBASE=1/1000\nSTART={round(a*1000)}\nEND={round(b*1000)}\ntitle={title}\n'
(ROOT/'chapters.txt').write_text(meta)
print('Joining the two slides directly to the existing demo',flush=True)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-i',str(ROOT/'problem.mp4'),'-i',str(ROOT/'jev-pipeline.mp4'),'-ss',str(trim),'-i',str(VIDEO/'when-and-what-demo-v2.mp4'),'-i',str(ROOT/'chapters.txt'),'-filter_complex','[0:v]setpts=PTS-STARTPTS,setsar=1[v0];[1:v]setpts=PTS-STARTPTS,setsar=1[v1];[2:v]setpts=PTS-STARTPTS,setsar=1[v2];[0:a]asetpts=PTS-STARTPTS[a0];[1:a]asetpts=PTS-STARTPTS[a1];[2:a]asetpts=PTS-STARTPTS[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]','-map','[v]','-map','[a]','-map_metadata','3','-map_chapters','3','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart',str(VIDEO/'when-and-what-demo-v3.mp4')],check=True)
(ROOT/'composition.json').write_text(json.dumps({'openingDuration':intro_duration,'demoTrim':trim,'expectedDuration':intro_duration+old_duration-trim,'chapters':chapters},indent=2))
md='# When & What — problem, Jev, then demo\n\nVoice: Microsoft Ava Multilingual Neural.\n\n'
for s in scenes+[s for s in old if s['id']!='intro']:md+='## '+s['title']+'\n\n'+' '.join(s['lines'])+'\n\n'
md+='Jev reference: https://typesafe.ai/blog/introducing-system-one-models-and-jev\n\nThe first slide is the product thesis, not a market-adoption statistic. The prototype uses deterministic local rules, with Jev classification and GBrain dispatch simulated.\n'
(VIDEO/'NARRATION.md').write_text(md)
print('Saved when-and-what-demo-v3.mp4',flush=True)
