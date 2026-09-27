import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation, PresentationFile, FileBlob} from '@oai/artifact-tool';

const root = '/Users/devanshagarwal/Documents/ChatGPT/Own your intelligence';
const skill = '/Users/devanshagarwal/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const build = path.join(root, 'presentation/.final-build');
const output = path.join(root, 'presentation/output/when-and-what-final.pptx');
const {resolvePresentationFont, applyPresentationChartFont, finalizePresentation} = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
const font = resolvePresentationFont();
const data = await import(pathToFileURL(path.join(root, 'public/ops-data.js')).href);
const records = data.library(true);
const examples = data.trainingRows(records, data.defaults);
const noTraining = data.trainingRows(records, {...data.defaults, employee: data.defaults.employee.replace('Allow training: yes', 'Allow training: no')});
const tokenCount = data.totalTokens(records);
const C = {navy:'#15253D', blue:'#3468EF', pale:'#EAF0FF', bg:'#EEF2F7', white:'#FFFFFF', muted:'#64748B', line:'#D7DFEB', light:'#AABDDC'};
const p = Presentation.create({slideSize:{width:1280,height:720}});
const notes = [];

function add(bg=C.white) { const s=p.slides.add(); s.background.fill=bg; return s; }
function txt(s, text, x,y,w,h, size=28,color=C.navy,bold=false) {
  const sh=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  sh.text=text; sh.text.style={typeface:font,fontSize:size,bold,color,autoFit:'none',wrap:'word',insets:{top:0,bottom:0,left:0,right:0}};
  return sh;
}
function rect(s,x,y,w,h,fill,line='none',lineWidth=0) { return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:lineWidth}}); }
function line(s,x,y,w,color=C.line) { rect(s,x,y,w,1,color); }
function heading(s,kicker,title,sub='') {
  txt(s,kicker.toUpperCase(),64,38,1110,23,15,C.blue,true);
  txt(s,title,64,84,1152,72,46,C.navy,true);
  if(sub) txt(s,sub,64,159,1130,60,23,C.muted);
}
function footer(s,n,caption='') { line(s,64,663,1152); txt(s,'when & what',64,681,190,23,15,C.navy,true); if(caption)txt(s,caption,271,680,860,24,15,C.muted); txt(s,String(n).padStart(2,'0'),1177,680,40,24,15,C.muted); }
function note(s,title,text) {s.speakerNotes.textFrame.setText(text);notes.push({title,text});}
function connect(s,a,b,from='right',to='left',dashed=false){s.shapes.connect(a,b,{kind:from==='right'?'straight':'elbow',fromSide:from,toSide:to,line:{fill:C.blue,width:2,style:dashed?'dashed':'solid'},tail:{type:'triangle',width:'sm',length:'sm'}});}

// 1. A native typographic cover.
{
 const s=add(C.navy);
 txt(s,'when & what',64,48,900,49,34,C.white,true);
 txt(s,'Useful context.\nSelective memory.',64,205,1110,223,86,C.white,true);
 txt(s,'A policy layer for what agents remember\nand what models learn.',68,471,1060,98,33,C.light);
 txt(s,'OPS INCIDENT DEMO',68,648,700,30,17,C.light,true);
 note(s,'When & What','An incident chat contains two kinds of information: what the agent needs right now, and what the company should keep. Those are different decisions. When & What keeps the authorized context available for the current task, then applies company rules and employee preferences before memory or training. This is a synthetic ops demo.');
}
// 2. Native editable product architecture.
{
 const s=add();heading(s,'Product pipeline','A policy hook before persistent memory','The current task keeps its context. The persistent copy follows the rules.');
 const rules=rect(s,332,223,240,54,C.pale);
 txt(s,'company.md\nemployee.md',344,229,218,44,17,C.blue,true);
 const a=rect(s,64,324,212,132,C.bg);
 txt(s,'Agent',84,344,172,42,31,C.navy,true);
 txt(s,'Memory writes\nAgent trajectories',84,397,176,53,21,C.muted);
 const b=rect(s,332,324,240,132,C.blue);
 txt(s,'When & What',350,344,204,42,29,C.white,true);
 txt(s,'Listen, classify,\nand redact',350,397,204,53,21,C.white);
 const c=rect(s,628,324,240,132,C.pale);
 txt(s,'Cleaned output',647,344,205,42,26,C.navy,true);
 txt(s,'Useful facts\nSanitized trajectory',647,397,205,53,21,C.muted);
 const d=rect(s,924,324,292,132,C.navy);
 txt(s,'GBrain',946,344,246,42,31,C.white,true);
 txt(s,'Memory for future tasks\nHandoff simulated',946,397,248,53,21,C.light);
 const jev=rect(s,332,505,240,71,C.white,C.line,1);
 txt(s,'Jev decisions',350,516,204,27,21,C.navy,true);
 txt(s,'Simulated classifier',350,547,204,24,17,C.muted);
 const exportBox=rect(s,628,505,240,71,C.white,C.line,1);
 txt(s,'Training export',647,516,205,27,21,C.navy,true);
 txt(s,'Separate permission',647,547,205,24,17,C.muted);
 connect(s,a,b);connect(s,b,c);connect(s,c,d);connect(s,rules,b,'bottom','top');connect(s,jev,b,'top','bottom',true);connect(s,c,exportBox,'bottom','top');
 footer(s,2,'Deterministic local rules run today. Jev and GBrain are integration points.');
 note(s,'The pipeline','The agent produces memory writes and execution trajectories. A listener intercepts them before persistence. Company policy and an employee Markdown file determine what can survive. Jev is the intended typed classifier; our code applies those decisions and assembles the cleaned output. For this demo, deterministic local rules perform that work. GBrain is the intended memory destination, and training export has its own consent gate. The UI replays traces; Jev calls and the GBrain handoff are simulated. Hosted classification would also have to respect data-egress policy. Source for Jev capability: https://typesafe.ai/blog/introducing-system-one-models-and-jev');
}
// 3 and 4. Actual product screens, each with its real heading and no extra frame.
for(const [file,title,narration] of [
 ['01-team-chat.jpg','Incident chat','Here is the incident. Checkout errors jumped to 18 percent after a deploy. Maya, Ravi and Lena share useful debugging context, but also a customer email, revenue, a connection credential and a raw request. The ops agent traces the failure to a connection leak. The team rolls back and identifies a fix. The original conversation remains available for this task. All names, incidents and credentials in this screen are synthetic.'],
 ['02-redacted-trajectory.jpg','Agent trajectory','Now look at the persistent copy of the execution trace. The hook removes five sensitive spans automatically: customer email, revenue, connection credential, API token and raw request payload. It keeps the useful tool result, diagnosis and resolution. There is no review queue or save button. The cleaning runs locally; the displayed GBrain handoff is simulated. In a live demo, Replay redaction reveals the transformation step by step.']
]){
 const s=add(C.bg);s.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,'presentation/ui',file))),contentType:'image/jpeg',alt:title+' in the When & What ops demo',fit:'contain',position:{left:0,top:0,width:1280,height:720}});note(s,title,narration);
}
// 5. Editable Markdown policy examples.
{
 const s=add();heading(s,'Rules and personalization','Two files decide what survives','Company restrictions and personal preferences meet at the same hook.');
 rect(s,64,243,550,304,C.bg);rect(s,644,243,572,304,C.pale);
 txt(s,'company.md',86,263,505,34,24,C.navy,true);
 txt(s,'# Company memory policy\n\n- Never store: credentials,\n  customer emails, customer revenue\n- Allow training: sanitized\n  operational procedures\n- Minimum repeated runs: 3',86,321,506,202,23,C.navy);
 txt(s,'maya.md',667,263,521,34,24,C.blue,true);
 txt(s,'# Maya Chen\n\n- Never store: raw request payloads\n- Allow training: yes\n\nKeep the diagnosis and reusable fix.',667,321,520,199,23,C.navy);
 txt(s,'A preference change applies on the next replay and training export.',65,589,1145,42,28,C.navy,true);
 footer(s,5,'Prototype policy parser. Previously stored data and trained models are separate concerns.');
 note(s,'Rules and personalization','The rules fit into two Markdown files. The company excludes credentials, customer emails and revenue. Maya adds raw request payloads and grants permission for sanitized operational training examples. We retain the diagnosis and reusable fix. The demo uses a small local parser and known sensitive patterns, so these files are easy to edit and replay. A rule change affects the next generated output; this is not a claim that previously stored records or trained weights have been erased.');
}
// 6. Native chart generated from the same synthetic fixtures as the app.
{
 const s=add();heading(s,'Repeated work','Nine incidents. Two recurring procedures.','Repeated steps and token usage identify candidates for a training experiment.');
 const groups=data.grouped(records);
 const chart=s.charts.add('bar',{
   position:{left:62,top:258,width:704,height:317},
   categories:['Pool exhaustion','Retry storm','Disk saturation'],
   series:[{name:'Incident runs',values:groups.map(g=>g.runs.length),fill:C.blue,points:[{idx:2,fill:'#C5D2EB'}]}],
   barOptions:{direction:'column',grouping:'clustered',gapWidth:95},hasLegend:false,
   chartFill:C.white,plotAreaFill:C.white,chartLine:{fill:'none',width:0},plotAreaLine:{fill:'none',width:0},
   xAxis:{visible:true,textStyle:{typeface:font,fontSize:20,fill:C.muted},line:{fill:C.line,width:1},majorGridlines:null},
   yAxis:{visible:false,min:0,max:6,majorUnit:1,majorGridlines:null},
   dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:font,fontSize:31,bold:true,fill:C.navy}}
 });applyPresentationChartFont(chart,{fontFamily:font});
 txt(s,tokenCount.toLocaleString('en-US'),840,254,367,85,64,C.navy,true);
 txt(s,'tokens across nine runs',844,347,351,37,23,C.muted);
 txt(s,String(examples.length),840,424,355,84,64,C.blue,true);
 txt(s,'eligible example records',844,517,358,37,23,C.muted);
 txt(s,'Minimum repeat count: 3. One run lacks consent; one procedure has only one run.',67,602,1138,37,23,C.navy);
 footer(s,6,'Synthetic incident history and token counts. No training performance is claimed.');
 note(s,'Repeated work',`The same small set of procedures appears repeatedly in our synthetic history. There are five pool-exhaustion incidents, three retry storms and one disk issue. The seeded telemetry totals ${tokenCount.toLocaleString('en-US')} input and output tokens. At a repeat threshold of three, and after checking consent, ${examples.length} example records are eligible: four pool examples and three retry examples. One pool run lacks consent; the disk issue has not repeated enough. These are fixtures grouped by a known pattern label, not a live clustering model. They signal an experiment, not proof that fine-tuning will work. Data source: public/ops-data.js, library(true), grouped(), totalTokens() and trainingRows().`);
}
// 7. Two distinct uses, and an explicit consent change.
{
 const s=add();heading(s,'When to learn','Permission comes before a training pilot','Token count alone cannot tell you whether a model needs training.');
 txt(s,'Keep in retrieval',66,249,531,47,34,C.navy,true);
 txt(s,'Facts that change',66,318,525,39,29,C.blue,true);
 txt(s,'Current incidents, customers\nand company knowledge.\n\nRetrieve permitted information\nwhen the task needs it.',66,372,523,185,26,C.navy);
 line(s,64,293,535);
 txt(s,'Test a training pilot',674,249,539,47,34,C.navy,true);
 txt(s,'Procedures that repeat',674,318,540,39,29,C.blue,true);
 txt(s,'Clean examples with consent.\n\nCompare a custom model with\nthe RAG baseline on new incidents\nbefore deciding to train further.',674,372,540,185,26,C.navy);
 line(s,674,293,542);
 rect(s,64,587,1152,57,C.pale);
 txt(s,`Allow training: no     ${examples.length} eligible examples become ${noTraining.length} on the next export.`,84,603,1110,33,25,C.blue,true);
 footer(s,7,'The demo exports JSONL. Training and its expected benefits are simulated.');
 note(s,'Permission before training','When and what are separate questions. Changing company facts belong in governed retrieval. A stable, repeated procedure may justify a training pilot, provided the examples are permitted and useful. The pilot needs held-out incidents and a comparison against the current RAG baseline. Our seven demo records are synthetic and repeat templates; they are not a validated training dataset. The concrete control is permission: changing Allow training from yes to no makes the next export contain zero eligible examples. That does not untrain an existing model. River or another training service is a proposed downstream connection; no model is trained here.');
}
// 8. Close on the product promise with precise prototype scope.
{
 const s=add(C.navy);
 txt(s,'when & what',64,43,1050,47,30,C.white,true);
 txt(s,'The fix survives.\nThe sensitive details don’t.',64,162,1152,164,61,C.white,true);
 txt(s,'RUNNING IN THE DEMO',68,400,510,32,16,C.light,true);
 txt(s,'Markdown rules\nAutomatic trace redaction\nConsent-filtered JSONL export',68,451,548,132,28,C.white);
 txt(s,'NEXT CONNECTIONS',684,400,527,32,16,C.light,true);
 txt(s,'Jev classification\nLive writes into GBrain\nA custom-model training pilot',684,451,535,132,28,C.white);
 txt(s,'Synthetic ops data. Jev, GBrain handoff and training are simulated.',68,652,1130,30,18,C.light);
 note(s,'The fix survives','The product promise is simple: remember the fix without retaining the sensitive details that happened to be nearby. Today the demo runs Markdown rules, automatic redaction and a consent-filtered JSONL export. Local GBrain has been set up and verified separately, but the UI handoff is simulated. Jev classification and a custom-model training pilot are the next connections. This is the policy layer between useful work now, useful memory later and deliberate learning.');
}

await fs.writeFile(path.join(build,'notes.json'),JSON.stringify(notes,null,2));
await fs.writeFile(path.join(build,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
console.log('Candidate saved; rendering slides.');
for(let i=0;i<p.slides.items.length;i++) {
 const png=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,`preview-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));
}
if(process.argv.includes('--preview-only')) process.exit(0);
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:output,
 pythonExecutable:'/Users/devanshagarwal/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[6],materializeLiteralChartWorkbooks:true,
 fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,
 receiptPath:path.join(build,'validation.json')});
console.log(JSON.stringify(result));
const final=await PresentationFile.importPptx(await FileBlob.load(output));
for(let i=0;i<final.slides.items.length;i++) {
 const png=await final.export({slide:final.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,`slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));
}
console.log('Saved',output);
