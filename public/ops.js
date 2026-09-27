import {defaults,incident,events,patterns,redact,cleanEvents,library,grouped,trainingRows,trainingAllowed,minimum,totalTokens,agentTrajectory} from './ops-data.js';

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
 pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
 branch:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 7v10m12-10v3a5 5 0 0 1-5 5H6"/>',
 sliders:'<path d="M4 7h7m6 0h3M4 17h2m6 0h8"/><circle cx="14" cy="7" r="3"/><circle cx="9" cy="17" r="3"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 play:'<path d="m9 5 11 7-11 7V5Z"/>',
 spark:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
 upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 reset:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 screen:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-4 0h8"/>',
 code:'<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-4-13-2 20"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 circle:'<circle cx="12" cy="12" r="8"/><path d="m6 6 12 12"/>',
 database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
 file:'<path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6"/>'
};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]||paths.spark}</svg>`;
const fmt=n=>new Intl.NumberFormat('en-US').format(n);
const compact=n=>`${(n/1000).toFixed(1)}k`;
const pages=[['chat','Incident chat','pulse'],['trajectory','Agent trajectory','code'],['memory','Clean memory','layers'],['learning','Learning signals','branch']];
const requestedPage=new URLSearchParams(location.search).get('view')||'chat';
const currentPage=()=>state.tab==='incident'?state.scene:state.tab;
function pageTabs(){return `<span class="product-wordmark">Membrane</span><span class="product-nav-divider"></span>${pages.map(([id,label])=>`<button class="${currentPage()===id?'selected':''}" data-page="${id}" aria-current="${currentPage()===id?'page':'false'}">${label}</button>`).join('')}`;}
const state={tab:['memory','learning'].includes(requestedPage)?requestedPage:'incident',processed:true,playing:false,visible:6,saved:false,rules:{...defaults},dialog:null,selected:incident.id,training:'idle',progress:0,present:new URLSearchParams(location.search).has('present'),arranging:false,layout:{},scene:new URLSearchParams(location.search).get('view')==='trajectory'?'trajectory':'chat',redactedThrough:5,redacting:false};
let playTimer,trainTimer;
const records=()=>library(state.saved);
const cleaned=()=>cleanEvents(state.rules);
const removed=()=>cleaned().flatMap(e=>e.removed);
const dataset=()=>trainingRows(records(),state.rules);
function toast(text){$('#toast').textContent=text;$('#toast').className='visible';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').className='',3200);}
function badge(text,tone='neutral'){return `<span class="badge ${tone}">${text}</span>`;}
function logo(){return `<span class="logo-mark">M</span><span class="logo-name">Membrane<span>A POLICY LAYER FOR AI MEMORY</span></span>`;}
function heading(kicker,title,description,action){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div><div class="heading-action">${action||''}</div></div>`;}
function pipeline(){
 const active=state.playing?1:state.tab==='learning'?4:state.tab==='memory'||state.saved?3:state.processed?2:0;
 const steps=[['pulse','Team + agent','Full incident context'],['lock','Memory listener','Intercept before saving'],['spark','Jev + your rules','Classify · demo adapter'],['database','GBrain','Clean facts + trajectories'],['branch','Learn from repeats','Permissioned examples']];
 return `<div class="pipeline" aria-label="Product pipeline">${steps.map(([i,t,s],n)=>`<div class="pipe-node ${n===active?'active':''} ${n<active?'complete':''}"><div class="pipe-icon">${icon(n<active?'check':i)}</div><div><strong>${t}</strong><span>${s}</span></div>${n<4?'<span class="pipe-chevron">›</span>':''}</div>`).join('')}</div>`;
}
function cleanedText(event){
 const labels={'customer email removed':'EMAIL REDACTED','connection credential removed':'CONNECTION REDACTED','API key removed':'TOKEN REDACTED','customer revenue removed':'REVENUE REDACTED','raw request payload removed':'PAYLOAD REDACTED','excluded by rule':'REDACTED'};
 return esc(event.cleaned).replace(/\[([^\]]+)\]/g,(_,label)=>`<span class="redacted-token" title="Removed from persistent memory">${labels[label]||label}</span>`);
}
function chatRow(event,clean=false){return `<article class="chat-message"><div class="avatar ${event.tone}">${event.initials}</div><div class="chat-body"><div class="chat-author"><strong>${event.name}</strong><span>${event.role}</span><time>${event.time}</time></div><p>${clean?cleanedText(event):esc(event.text)}</p></div></article>`;}
function trajectoryCard(step,index){
 const clean=index<state.redactedThrough;
 const fields=step.fields.map(([key,value])=>({key,value,result:redact(value,state.rules)}));
 const count=fields.flatMap(f=>f.result.removed).length;
 return `<article class="trajectory-event ${count&&clean?'redacted-event':''}"><div class="event-number">${String(index+1).padStart(2,'0')}</div><div class="event-content"><div class="event-heading"><span class="event-kind">${step.kind}</span><strong>${step.name}</strong>${count&&clean?`<span class="event-verdict">${icon('lock')} ${count} redacted</span>`:`<span class="event-verdict unchanged">${clean?'Retained':'Captured'}</span>`}<time>${step.time}</time></div><div class="event-fields">${fields.map(f=>`<div class="event-field"><span>${f.key}</span><p>${clean?cleanedText(f.result):esc(f.value)}</p></div>`).join('')}</div></div></article>`;
}
function incidentView(){
 const trajectory=state.scene==='trajectory';
 const count=agentTrajectory.slice(0,state.redactedThrough).flatMap(step=>step.fields.flatMap(([,value])=>redact(value,state.rules).removed)).length;
 const action=trajectory?`<button class="button primary" data-action="replay-redaction" ${state.redacting?'disabled':''}>${icon('play')}${state.redacting?'Applying rules…':'Replay redaction'}</button>`:`<button class="button primary" data-action="replay" ${state.playing?'disabled':''}>${icon('play')}${state.playing?'Replaying incident…':'Replay incident'}</button>`;
 const title='Checkout errors after deploy';
 return heading(trajectory?'AGENT TRAJECTORY / INC-284':'INCIDENT CHAT / INC-284',title,trajectory?'Execution trace · Company and employee policies applied before persistence':'Checkout service · Production · Maya, Ravi, Lena & the ops agent',`<button class="button secondary" data-action="settings">${icon('sliders')} Memory rules</button>${action}`)+`
 <div class="incident-layout single-screen ${trajectory?'trajectory-scene':'chat-scene'}">
 ${trajectory?`<section class="panel trajectory-window comparison-window" aria-label="Redacted agent trajectory"><div class="panel-top window-top"><div class="window-dots"><i></i><i></i><i></i></div><h2>Agent trajectory</h2><span class="window-state cleaned-state">${icon('lock')} LISTENER ACTIVE</span></div><div class="trajectory-toolbar"><span>${icon('code')} ${agentTrajectory.length} execution events</span><div>${badge('company.md')}${badge('maya.md')}</div><span class="window-chip blue">${count} redactions</span></div><div class="trajectory-stream">${agentTrajectory.map(trajectoryCard).join('')}</div><div class="window-footer trajectory-footer">${icon('check')}<strong>${count} sensitive spans removed automatically</strong><span class="auto-handoff">${icon('database')} GBrain handoff · simulated</span></div></section>`:
 `<section class="panel conversation comparison-window" aria-label="Team conversation"><div class="panel-top window-top"><div class="window-dots"><i></i><i></i><i></i></div><h2>Incident chat</h2><span class="window-state"><i></i> ORIGINAL CONTEXT</span></div><div class="window-channel"><span class="channel-symbol">#</span><div><strong>inc-284 · checkout-errors</strong><span>Maya, Ravi, Lena & the ops agent</span></div><span class="window-chip">Full context</span></div><div class="chat-stream">${events.slice(0,state.visible).map(e=>chatRow(e)).join('')}</div><div class="window-footer">${icon('pulse')}<strong>${state.visible} messages</strong><span>Available to solve the incident</span>${badge('Original chat stays untouched')}</div></section>`}
 </div><div class="comparison-note"><span>${icon('lock')} ${trajectory?'Policy applied: company.md + maya.md · Automatic memory capture':'Session context · Original messages retained for the current task'}</span><span>Synthetic incident · Jev and GBrain simulated</span></div>`;
}
function memoryView(){
 const selected=records().find(r=>r.id===state.selected)||records()[0];
 const p=patterns[selected.pattern];
 const current=selected.id===incident.id;
 return heading('02 / REMEMBER WHAT MATTERS','Useful memory. <span>Nothing extra.</span>','Clean facts and replayable trajectories, ready for the next incident.',`<button class="button secondary" data-action="download-trace">${icon('download')} Export clean trajectory</button>`)+pipeline()+`
 <div class="memory-layout"><section class="panel archive"><div class="panel-top"><h2>Trajectory archive</h2>${badge(`${records().length} runs`)}</div><div class="archive-sub">GBrain destination · simulated storage</div><div class="archive-list">${records().map(r=>`<button class="archive-row ${r.id===selected.id?'selected':''}" data-select="${r.id}"><div class="archive-symbol ${patterns[r.pattern].color}">${icon('file')}</div><div><strong>${r.id} <span>${r.date}</span></strong><p>${patterns[r.pattern].name}</p><div>${compact(r.input+r.output)} tokens <span>·</span> ${r.consent?'Training permitted':'Training excluded'}</div></div>${icon('arrow')}</button>`).join('')}</div></section>
 <section class="panel document"><div class="panel-top"><div class="panel-title">${icon('file')}<h2>${selected.id.toLowerCase()}.cleaned.md</h2></div>${badge('Sanitized','green')}</div><div class="document-body"><div class="doc-eyebrow">INCIDENT MEMORY / ${selected.id}</div><h2>${p.name}</h2><div class="doc-tags">${badge('Operational knowledge')}${badge('Sensitive details removed','green')}${badge(selected.consent?'Training consent recorded':'Excluded from training',selected.consent?'purple':'amber')}</div><div class="doc-callout">${icon('spark')}<p>${esc(redact(p.resolution,state.rules).cleaned)}</p></div><h3>Resolution trajectory</h3><ol class="step-list">${p.steps.map((s,i)=>`<li><span>0${i+1}</span>${esc(redact(s,state.rules).cleaned)}</li>`).join('')}</ol>${current?`<details class="trace-details"><summary>${icon('code')} View all ${events.length} cleaned events</summary>${cleaned().map(e=>`<div><strong>${esc(e.role)}</strong><p>${esc(e.cleaned)}</p></div>`).join('')}</details>`:''}<div class="document-footer"><span>Source: synthetic incident replay</span><span>Training permission checked separately</span></div></div></section></div>`;
}
function learningView(){
 const all=records(), groups=grouped(all), rows=dataset(), repeat=groups.filter(g=>g.runs.length>=minimum(state.rules));
 const counts=repeat.map(g=>({name:g.name,count:g.runs.length,tokens:totalTokens(g.runs),color:g.color}));
 return heading('03 / TURN REPEATS INTO LEARNING','You’ve solved this before. <span>Teach the pattern.</span>','Find repeated procedures. Export only the examples your policies allow.',`<button class="button secondary" data-action="download-training" ${!rows.length?'disabled':''}>${icon('download')} Export training JSONL</button>`)+pipeline()+`
 <div class="learning-stats"><div><span>REPEATED PATTERNS</span><strong>${repeat.length}<small>across ${all.length} incident runs</small></strong></div><div><span>TOKENS ACROSS RUNS</span><strong>${compact(totalTokens(all))}<small>synthetic input + output usage</small></strong></div><div><span>PERMITTED EXAMPLES</span><strong>${rows.length}<small>cleaned and consented</small></strong></div><div><span>EXCLUDED RUNS</span><strong>${all.length-rows.length}<small>consent, policy or insufficient repeats</small></strong></div></div>
 <div class="learning-layout"><section class="panel patterns"><div class="panel-top"><div><h2>Same procedure. Another long context.</h2><p>Grouped by a shared resolution in the synthetic fixtures.</p></div>${badge(`${minimum(state.rules)}+ runs / pattern`)}</div><div class="patterns-content">${groups.map(g=>`<article class="pattern-row"><div class="pattern-heading"><span class="square-icon ${g.color}">${icon('branch')}</span><div><h3>${g.name}</h3><p>${g.runs.length>=minimum(state.rules)?'Recurring procedure · candidate for a training pilot':'One-off incident · keep in retrieval'}</p></div><strong>${g.runs.length}<span>runs</span></strong></div><div class="run-track">${g.runs.map(r=>`<div class="run-segment ${g.color} ${!r.consent?'excluded':''}" title="${r.id}: ${fmt(r.input+r.output)} tokens; ${r.consent?'training permitted':'training excluded'}" style="flex:${r.input+r.output}"><span>${r.id}</span><b>${compact(r.input+r.output)}</b></div>`).join('')}</div><div class="pattern-caption"><span>${fmt(totalTokens(g.runs))} tokens across these runs</span><span>${g.runs.filter(r=>r.consent&&trainingAllowed(state.rules)).length} with consent</span></div></article>`).join('')}<div class="chart-legend"><span><i></i> Consented run</span><span><i class="hatch"></i> Training excluded</span><span>Lengths reflect synthetic token totals</span></div></div></section>
 <section class="panel training-card"><div class="panel-top"><div class="panel-title"><div class="square-icon purple">${icon('spark')}</div><h2>A small model, a specific job</h2></div></div><div class="training-body">${badge('TRAINING PILOT','purple')}<h3>Learn the procedure.<br>Keep the facts in memory.</h3><p>Teach a model the recurring diagnostic steps. Retrieve current systems, owners and thresholds from GBrain.</p><div class="dataset-box"><div>${icon('file')}<strong>ops-procedures.jsonl</strong></div><span>${rows.length} cleaned examples · ${repeat.length} recurring patterns</span><div class="dataset-dots">${all.map(r=>`<i class="${rows.some(x=>x.id===r.id)?'included':'excluded'}" title="${r.id}"></i>`).join('')}</div></div><ul class="training-checks"><li>${icon('check')} Sensitive spans removed</li><li>${icon('check')} Company and employee permission checked</li><li>${icon('check')} Incident-specific details stay in retrieval</li></ul>
 ${state.training==='done'?`<div class="training-finished">${icon('check')}<div><strong>Simulated run complete</strong><span>ops-triage-demo · ${rows.length} examples</span></div></div><p class="training-fine">No model weights were trained. Next: compare against RAG on held-out incidents.</p>`:state.training==='running'?`<div class="train-progress"><div><strong>${state.progress<40?'Preparing permitted examples':state.progress<80?'Simulating optimization':'Packaging demo checkpoint'}</strong><span>${state.progress}%</span></div><div class="progress-track"><i style="width:${state.progress}%"></i></div></div>`:`<button class="button dark full" data-action="train" ${!rows.length?'disabled':''}>${icon('play')} Run training simulation ${icon('arrow')}</button><p class="training-fine">Demo dataset, not a validated training corpus. Repetition and tokens suggest a pilot; evaluation decides if training helps.</p>`}</div></section></div>`;
}
function modal(){
 if(!state.dialog)return '';
 return `<div class="modal-backdrop"><section class="settings-modal" role="dialog" aria-modal="true" aria-label="Rules and connections"><div class="modal-header"><div><div class="eyebrow">YOUR POLICY, AT THE MEMORY BOUNDARY</div><h2>Rules & connections</h2></div><button class="icon-button" data-action="close" aria-label="Close rules">${icon('close')}</button></div><div class="connections"><div><div class="square-icon purple">${icon('spark')}</div><div><strong>Jev classifier</strong><span>Deterministic demo adapter</span></div>${badge('Simulated','purple')}</div><div><div class="square-icon green">${icon('database')}</div><div><strong>GBrain memory</strong><span>In-session demo store</span></div>${badge('Simulated','green')}</div></div><div class="rule-editors">${[['company','company.md','Company policy'],['employee','maya.md','Employee personalization']].map(([key,file,label])=>`<div><div class="rule-title"><label for="rule-${key}">${icon('file')} ${file}</label><button class="text-button" data-upload="${key}">${icon('upload')} Upload .md</button><input type="file" accept=".md,text/markdown" id="upload-${key}" hidden></div><textarea id="rule-${key}" spellcheck="false" aria-label="${label}">${esc(state.rules[key])}</textarea></div>`).join('')}</div><div class="rule-help"><strong>Simple demo rules</strong><p>“Never store: phrase” removes matching text. “Allow training: no” excludes the demo data from training. “Minimum repeated runs: 3” sets the repetition threshold. The sample sensitive categories are always removed.</p></div><div class="modal-footer"><span>Changes reprocess the synthetic replay.<br>No external records are modified.</span><button class="button secondary" data-action="no-training">Turn employee training off</button><button class="button primary" data-action="apply-rules">Apply rules ${icon('arrow')}</button></div></section></div>`;
}
function render(){
 document.body.classList.add('app-theme');
 document.body.classList.toggle('presentation-mode',state.present);
 document.body.classList.toggle('incident-screen',state.tab==='incident');
 document.body.classList.toggle('single-demo',state.tab==='incident');
 const names={incident:'Live incident',memory:'Clean memory',learning:'Learning signals'};
 $('#app').innerHTML=`<aside class="sidebar"><a class="brand" href="/">${logo()}</a><div class="workspace"><span class="workspace-mark">N</span><div><strong>Northstar operations</strong><span>Demo workspace</span></div><span>⌄</span></div><div class="nav-label">WORKSPACE</div><nav>${pages.map(([id,label,glyph])=>`<button class="nav-item ${currentPage()===id?'selected':''}" data-page="${id}">${icon(glyph)}<span>${label}</span></button>`).join('')}<button class="nav-item" data-action="settings">${icon('sliders')}<span>Rules & connections</span></button></nav><div class="sidebar-story"><div class="story-orbit">${icon('spark')}</div><p>Every incident<br>leaves a lesson.</p><span>You decide what stays.</span></div><div class="sidebar-bottom"><div>${icon('lock')} Local demo workspace</div><span>Synthetic data · no external calls</span><a href="/hook">Open Markdown hook ${icon('arrow')}</a><div class="profile"><span class="avatar lavender">MC</span><div><strong>Maya Chen</strong><span>Platform engineering</span></div></div></div></aside>
 <div class="shell"><header class="topbar"><div class="breadcrumb">Workspace <span>/</span> <strong>${pages.find(([id])=>id===currentPage())[1]}</strong></div><div class="presentation-nav">${pageTabs()}</div><div class="top-actions"><span class="demo-chip"><i></i> INTERACTIVE DEMO</span><button class="button small secondary" data-action="present">${icon('screen')}${state.present?'Exit presentation':'Present'}</button></div></header><main>${state.tab==='incident'?incidentView():state.tab==='memory'?memoryView():learningView()}<footer class="footer"><span>MEMBRANE <i>·</i> Use the context now. Choose what survives.</span><span>Synthetic token telemetry · Jev, GBrain & training simulated</span></footer></main></div>${modal()}`;
 document.body.classList.toggle('arranging',state.present&&state.arranging);
 if(state.present&&state.tab==='incident'){
   $('.top-actions').insertAdjacentHTML('afterbegin',`<button class="button small secondary" data-action="arrange">${icon('sliders')}${state.arranging?'Finish arranging':'Move cards'}</button>${state.arranging?'<button class="button small secondary" data-action="reset-layout">Reset positions</button>':''}`);
   document.querySelectorAll('.incident-layout>.panel').forEach((card,index)=>{
     const position=state.layout[index]||{x:0,y:0};
     card.style.transform=`translate(${position.x}px,${position.y}px)`;
     if(!state.arranging)return;
     const handle=card.querySelector('.panel-top');
     handle.tabIndex=0;handle.setAttribute('aria-label','Move card with drag or arrow keys');
     const move=(x,y)=>{state.layout[index]={x:Math.round(x/8)*8,y:Math.round(y/8)*8};card.style.transform=`translate(${state.layout[index].x}px,${state.layout[index].y}px)`;};
     handle.onkeydown=e=>{const p=state.layout[index]||{x:0,y:0};if(e.key.startsWith('Arrow')){e.preventDefault();move(p.x+(e.key==='ArrowRight'?8:e.key==='ArrowLeft'?-8:0),p.y+(e.key==='ArrowDown'?8:e.key==='ArrowUp'?-8:0));}};
     handle.onpointerdown=e=>{if(e.button!==0)return;const start={x:e.clientX,y:e.clientY,...{px:(state.layout[index]?.x||0),py:(state.layout[index]?.y||0)}};handle.setPointerCapture(e.pointerId);card.style.zIndex='2';handle.onpointermove=m=>move(start.px+m.clientX-start.x,start.py+m.clientY-start.y);handle.onpointerup=()=>{handle.onpointermove=null;card.style.zIndex='';};};
   });
 }
 bind();
}
function navigatePage(page){
 if(!pages.some(([id])=>id===page))return;
 state.tab=['chat','trajectory'].includes(page)?'incident':page;
 if(state.tab==='incident')state.scene=page;
 state.layout={};
 const url=new URL(location.href);url.searchParams.set('view',page);history.replaceState(null,'',url);
 render();window.scrollTo(0,0);
}
function navigate(tab){navigatePage(tab==='incident'?'chat':tab);}
function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`${name} exported`);}
function traceMarkdown(){const selected=records().find(r=>r.id===state.selected)||records()[0];const p=patterns[selected.pattern];return `# ${selected.id}: ${p.name}\n\nSynthetic demo trajectory.\n\n## Resolution\n${redact(p.resolution,state.rules).cleaned}\n\n## Cleaned events\n${selected.id===incident.id?cleaned().map(e=>`- ${e.role}: ${e.cleaned}`).join('\n'):p.steps.map(s=>`- ${redact(s,state.rules).cleaned}`).join('\n')}\n`;}
function bind(){
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navigatePage(b.dataset.page));
 document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{state.scene=b.dataset.scene;state.layout={};const url=new URL(location.href);url.searchParams.set('view',state.scene);history.replaceState(null,'',url);render();window.scrollTo(0,0);});
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
 document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{state.selected=b.dataset.select;render();});
 document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
 document.querySelectorAll('[data-upload]').forEach(b=>b.onclick=()=>$('#upload-'+b.dataset.upload).click());
 for(const key of ['company','employee']){const input=$('#upload-'+key);if(input)input.onchange=async e=>{const file=e.target.files[0];if(!file)return;if(!file.name.endsWith('.md')||file.size>20000){toast('Choose a Markdown file smaller than 20 KB.');return;}$('#rule-'+key).value=await file.text();toast(`${file.name} loaded. Apply rules to use it.`);};}
}
function action(name){
 if(name==='replay-redaction'){if(state.redacting)return;state.redacting=true;state.redactedThrough=0;render();const timer=setInterval(()=>{state.redactedThrough++;if(state.redactedThrough===agentTrajectory.length){clearInterval(timer);state.redacting=false;state.saved=true;}render();},550);}
 if(name==='replay'){if(state.playing)return;clearInterval(playTimer);state.playing=true;state.processed=false;state.visible=0;render();playTimer=setInterval(()=>{state.visible++;if(state.visible>=events.length){clearInterval(playTimer);state.playing=false;state.processed=true;}render();},450);}
 if(name==='reset'){clearInterval(playTimer);clearInterval(trainTimer);Object.assign(state,{processed:false,playing:false,visible:6,saved:false,training:'idle',progress:0});render();}
 if(name==='settings'){state.dialog='settings';render();$('#rule-company').focus();}
 if(name==='close'){state.dialog=null;render();}
 if(name==='no-training'){let text=$('#rule-employee').value;$('#rule-employee').value=/allow training:/i.test(text)?text.replace(/allow training:\s*[^\n]*/i,'Allow training: no'):text+'\n- Allow training: no\n';}
 if(name==='apply-rules'){const company=$('#rule-company').value,employee=$('#rule-employee').value;if(!company.trim()||!employee.trim()){toast('Add both rule files before applying.');return;}state.rules={company,employee};state.dialog=null;clearInterval(trainTimer);state.training='idle';state.progress=0;render();toast('Rules applied to the synthetic replay and training export.');}
 if(name==='present'){state.present=!state.present;render();}
 if(name==='arrange'){state.arranging=!state.arranging;render();}
 if(name==='reset-layout'){state.layout={};render();}
 if(name==='download-trace')download(`${(records().find(r=>r.id===state.selected)||records()[0]).id.toLowerCase()}.cleaned.md`,traceMarkdown(),'text/markdown');
 if(name==='download-training'&&dataset().length)download('ops-procedures.jsonl',dataset().map(row=>JSON.stringify(row)).join('\n')+'\n','application/x-ndjson');
 if(name==='train'){if(!dataset().length||state.training==='running')return;state.training='running';state.progress=0;render();trainTimer=setInterval(()=>{state.progress=Math.min(100,state.progress+10);if(state.progress===100){clearInterval(trainTimer);state.training='done';}render();},300);}
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.dialog){state.dialog=null;render();}if(state.present&&!state.arranging&&!state.dialog&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){const index=pages.findIndex(([id])=>id===currentPage());if(event.key==='ArrowRight')navigatePage(pages[Math.min(pages.length-1,index+1)][0]);if(event.key==='ArrowLeft')navigatePage(pages[Math.max(0,index-1)][0]);}});
render();
