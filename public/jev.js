const $ = id => document.getElementById(id);
let fixture;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label = keep => `<span class="${keep?'keep':'drop'}">${keep?'Keep':'Drop'}</span>`;
function render(result) {
  let correct = 0, baselineCorrect = 0;
  $('cases').innerHTML = fixture.cases.map((c, index) => {
    const item = result?.items[index];
    const decision = result?.jev.decisions.find(d => d.writeId === item.id);
    const baselineKeep = result?.baseline.outgoing.some(p => p.arguments.fact === c.text);
    const kept = !!item?.payload;
    if (result) { correct += kept === c.keep; baselineCorrect += baselineKeep === c.keep; }
    const disposition = !result ? '—' : !decision ? '<span class="drop">Local block</span>' : decision.disposition === 'withhold' ? '<span class="hold">Withheld</span>' : label(kept);
    return `<tr><td>${escape(c.text)}</td><td>${label(c.keep)}</td><td>${result?label(baselineKeep):'—'}</td><td>${disposition}</td><td>${decision?`${Math.round(decision.retention.confidence*100)}%`:'—'}</td><td>${escape(decision?.use.choice.replaceAll('_',' ') ?? '—')}</td></tr>`;
  }).join('');
  if (result) {
    const values = [['Local matches',`${baselineCorrect} / ${fixture.cases.length}`],['With Jev',`${correct} / ${fixture.cases.length}`],['API round trip',`${result.jev.latencyMs} ms`],['Input tokens',result.jev.usage.input_tokens]];
    $('summary').innerHTML = values.map(([title, value])=>`<div class="metric">${escape(title)}<strong>${escape(value)}</strong></div>`).join('');
    $('connection').textContent = `Last run: ${result.jev.model}`;
    $('output').textContent = JSON.stringify(result,null,2); $('receipt').hidden = false;
  }
}
$('run').onclick = async () => {
  $('run').disabled = true; $('run').textContent = 'Asking Jev…'; $('error').textContent = '';
  // Clear old results before a new request so failure cannot look like success.
  $('summary').textContent = ''; $('receipt').hidden = true; $('output').textContent = ''; render();
  try {
    const response = await fetch('/api/jev-experiment', {method:'POST'});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Experiment failed.');
    render(result);
  } catch (error) { $('error').textContent = error.message; }
  finally { $('run').disabled = !fixture.configured; $('run').textContent = 'Run live experiment'; }
};
try {
  const response = await fetch('/api/jev-experiment');
  if (!response.ok) throw new Error('Unable to load the Jev experiment.');
  fixture = await response.json();
  $('rules').textContent = fixture.rules; render();
  $('run').disabled = !fixture.configured;
  $('connection').textContent = fixture.configured ? 'Key configured · ready to run' : 'Set TYPESAFE_API_KEY or .local/jev-api-key, then reload.';
} catch (error) { $('error').textContent = error.message; }
