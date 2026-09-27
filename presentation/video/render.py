import json, subprocess, wave, array, sys, textwrap
from pathlib import Path
ROOT=Path(__file__).resolve().parent
record=json.loads((ROOT/'recording-timing.json').read_text())
scenes=record['scenes']
video=ROOT/'assets/screen-recording.webm'
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(video)],text=True))
rate=24000
mix=array.array('h',[0])*int((duration+.2)*rate)
cues=[]
for scene in scenes:
    for clip in scene['audio']:
        begin=scene['start']+.45+clip['offset']
        pcm=subprocess.check_output(['ffmpeg','-v','error','-i',clip['file'],'-f','s16le','-ac','1','-ar',str(rate),'pipe:1'])
        samples=array.array('h',pcm)
        if sys.byteorder=='big': samples.byteswap()
        start=int(begin*rate)
        mix[start:start+len(samples)]=samples
        if not scene.get('captions'):
            cues.append((begin,begin+len(samples)/rate,clip['text']))
    for cue in scene.get('captions',[]):
        begin=scene['start']+.45+cue['offset']
        cues.append((begin,begin+cue['duration'],cue['text']))
with wave.open(str(ROOT/'assets/narration.wav'),'wb') as out:
    out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate);out.writeframes(mix.tobytes())
def srt_time(t):
    ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
def ass_time(t):
    cs=round(t*100);h,cs=divmod(cs,360000);m,cs=divmod(cs,6000);s,cs=divmod(cs,100)
    return f'{h}:{m:02}:{s:02}.{cs:02}'
(ROOT/'when-and-what-demo.srt').write_text('\n\n'.join(f'{i+1}\n{srt_time(a)} --> {srt_time(b)}\n'+textwrap.fill(t,86) for i,(a,b,t) in enumerate(cues))+'\n')
ass='''[Script Info]
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
for a,b,t in cues:
    text='\\N'.join(textwrap.wrap(t,86)).replace('{','').replace('}','')
    ass+=f'Dialogue: 0,{ass_time(a)},{ass_time(b)},Default,,0,0,0,,{text}\n'
(ROOT/'assets/captions.ass').write_text(ass)
meta=';FFMETADATA1\ntitle=When & What — Remember the fix, not the secrets\ncomment=Synthetic ops demo. Local deterministic redaction. Jev, GBrain dispatch and training simulated. Synthetic voice: Microsoft Ava Multilingual Neural.\n'
for s in scenes:
    meta+=f"\n[CHAPTER]\nTIMEBASE=1/1000\nSTART={round(s['start']*1000)}\nEND={round(s['end']*1000)}\ntitle={s['title']}\n"
(ROOT/'assets/chapters.txt').write_text(meta)
script='# When & What — video narration\n\nApprox. two minutes. Synthetic Microsoft Ava neural narration; captions included.\n\n'
for s in scenes:
    script+=f"## {s['title']}\n\n"+' '.join(s['lines'])+'\n\n'
(ROOT/'NARRATION.md').write_text(script)
cmd=['ffmpeg','-hide_banner','-loglevel','warning','-y','-i',str(video),'-i',str(ROOT/'assets/narration.wav'),'-i',str(ROOT/'assets/chapters.txt'),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-vf',f"drawbox=x=0:y=964:w=1920:h=116:color=0x0b1732:t=fill,ass=assets/captions.ass,fade=t=in:st=0:d=0.25,fade=t=out:st={duration-.4:.3f}:d=0.4",'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','160k','-ar','48000','-t',str(duration),'-movflags','+faststart',str(ROOT/'when-and-what-demo-v2.mp4')]
print('Rendering',round(duration,1),'seconds',flush=True)
subprocess.run(cmd,cwd=ROOT,check=True)
print('Saved',ROOT/'when-and-what-demo-v2.mp4',flush=True)
