const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>', check:'<path d="m5 12 4 4L19 6"/>',
  code:'<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-4-13-2 20"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  spark:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  reset:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>',
  edit:'<path d="m15 5 4 4M4 20l5-1L20 8l-4-4L5 15l-1 5Z"/>',
}[name] || ''}</svg>`;
let example, rules = '', trajectory = '', result = null, busy = false, error = '', stale = false;

async function request(path, body) {
  const response = await fetch(`/api/${path}`, body === undefined ? {} : {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function toast(message) {
  $('#toast').textContent = message; $('#toast').className = 'visible';
  clearTimeout(toast.timer); toast.timer = setTimeout(()=>$('#toast').className='',3000);
}
function render() {
  const rows = result?.items || [];
  $('#app').innerHTML = `<div class="main simple-main hook-main"><header class="topbar"><a class="simple-brand" href="/">when <span>&</span> what</a><div class="top-actions"><span class="demo-tag"><span></span>Simulated GBrain writes</span><button class="button ghost small-button" id="reset" ${busy?'disabled':''}>${icon('reset')} Reset sample</button></div></header>
  <main><div class="hero"><div><div class="eyebrow">MEMORY SURGERY FOR YOUR COMPANY AI</div><h1>Full context. <em>Selective memory.</em></h1><p>A Markdown hook that edits what your agent remembers.</p></div><div class="hook-mark">${icon('lock')}Before it reaches GBrain</div></div>
  <div class="hook-flow"><span><b>1</b> Employee rules</span><span><b>2</b> Agent trajectory</span><span><b>3</b> Outgoing memory writes</span></div>
  <div class="hook-grid">
    <section class="panel hook-rules"><div class="panel-heading"><h2>${icon('code')} ops-memory.md</h2><button class="text-button" id="upload">${icon('upload')} Upload</button><input id="rule-file" type="file" accept=".md,text/markdown,text/plain" hidden></div><p class="hook-intro">Tell the agent what can enter lasting memory.</p><label class="sr-only" for="rules">Markdown memory rules</label><textarea id="rules" spellcheck="false" ${busy?'disabled':''}>${esc(rules)}</textarea><button class="rule-preset" id="restrict" ${busy?'disabled':''}>${icon('ban')} Keep only the reusable runbook</button><div class="hook-note">${icon('lock')} The demo excludes credentials, customer details and raw debug payloads.</div><div class="hook-parser">Simple rules: “Never store: …” and “Forget incident details after: Friday”.</div></section>
    <section class="panel hook-input"><div class="panel-heading"><h2>${icon('code')} trajectory.jsonl</h2><span class="quiet-label">Editable sample</span></div><p class="hook-intro">Conversation + the agent’s proposed memory calls.</p><label class="sr-only" for="trajectory">Agent trajectory JSON or JSONL</label><textarea id="trajectory" spellcheck="false" ${busy?'disabled':''}>${esc(trajectory)}</textarea><button class="button primary" id="run" ${busy?'disabled':''}>${icon('spark')} ${busy?'Applying memory rules…':'Run memory hook'} ${icon('arrow')}</button><div class="hook-note">${icon('check')} Original conversation stays intact for the current task.</div></section>
    <section class="panel hook-output"><div class="panel-heading"><h2>${icon('lock')} Ready for memory</h2><span class="quiet-label">Preview · no live write</span></div>${result ? `<div class="hook-counts"><span class="allowed"><strong>${result.counts.allowed}</strong> allowed</span><span class="edited"><strong>${result.counts.edited}</strong> edited</span><span class="blocked"><strong>${result.counts.blocked}</strong> blocked</span></div>${stale ? '<div class="stale-warning">Inputs changed. Run the hook to update this preview.</div>' : ''}<div class="hook-results">${rows.map(item=>`<article class="hook-result ${item.status}"><div class="result-title"><span>${icon(item.status==='blocked'?'ban':item.status==='edited'?'edit':'check')} ${item.status}</span><code>${esc(item.tool)}</code></div>${item.status !== 'allowed' ? `<div class="original-write">${esc(item.original)}</div>` : ''}${item.cleaned ? `<p class="clean-write">${esc(item.cleaned)}</p>` : '<p class="no-write">No memory write is forwarded.</p>'}<div class="result-reasons">${item.reasons.map(reason=>`<span>${esc(reason)}</span>`).join('')}</div>${item.payload ? `<div class="payload-tags"><span>${item.payload.policy?.audience?.includes('maya')?'Private to employee':'Team memory'}</span><span>Training off</span>${item.payload.arguments?.ttl?'<span>Until Friday ends</span>':''}</div>` : ''}</article>`).join('')}</div><div class="hook-receipt">${icon('check')} ${result.untouchedMessages} conversation messages untouched · ${result.outgoing.length} write intents</div>` : `<div class="hook-empty">${icon('spark')}<h3>Catch it at the boundary.</h3><p>Keep the diagnosis.<br>Remember the reusable fix.<br>Leave credentials and raw payloads out.</p><span>Run the hook to see the exact edits.</span></div>`}</section>
  </div>${error ? `<div class="hook-error" role="alert">${esc(error)}</div>` : ''}${result ? `<details class="panel hook-payload"><summary>${icon('code')} Inspect the outgoing payload <span>Only these edited intents may be forwarded</span></summary><pre>${esc(JSON.stringify(result.outgoing,null,2))}</pre></details>` : ''}
  <footer class="footer"><span>Current-task context stays useful. Future memory follows your rules.</span><span>Deterministic demo rules · synthetic data · GBrain dispatch simulated</span></footer></main></div>`;
  $('#rules').oninput = event => { rules = event.target.value; markStale(); };
  $('#trajectory').oninput = event => { trajectory = event.target.value; markStale(); };
  $('#run').onclick = run;
  $('#reset').onclick = () => { rules=example.rules; trajectory=example.trajectory; result=null; error=''; stale=false; render(); };
  $('#restrict').onclick = () => { if (!/never store:\s*incident details/i.test(rules)) rules += '\n- Never store: incident details\n'; run(); };
  $('#upload').onclick = () => $('#rule-file').click();
  $('#rule-file').onchange = async event => { const file=event.target.files[0]; if(!file) return; if(!file.name.toLowerCase().endsWith('.md') || file.size>12000) { toast('Choose an .md file smaller than 12 KB.');return; } rules=await file.text(); stale=!!result; render(); toast('Rule file loaded. Run the hook to apply it.'); };
}
function markStale() {
  if (!result || stale) return;
  stale = true;
  const warning = document.createElement('div'); warning.className='stale-warning'; warning.textContent='Inputs changed. Run the hook to update this preview.';
  document.querySelector('.hook-counts').after(warning);
}
async function run() {
  if (busy) return;
  busy=true;error='';render();
  try {result=await request('hook',{rules,trajectory});stale=false;}
  catch(e){error=e.message;}
  finally{busy=false;render();}
}
try {example=await request('hook-example');rules=example.rules;trajectory=example.trajectory;render();}
catch(e){$('#app').innerHTML=`<div class="boot"><h1>Open the demo server first.</h1><p>${esc(e.message)}</p></div>`;}
