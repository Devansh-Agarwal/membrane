export const defaults = {
  company: '# Company memory policy\n\n- Never store: credentials, customer emails, customer revenue\n- Allow training: sanitized operational procedures\n- Minimum repeated runs: 3\n\nRetain the diagnosis, useful tool results and resolution.\n',
  employee: '# Maya Chen · SRE\n\n- Never store: raw request payloads\n- Allow training: yes\n\nKeep the full context for debugging. Remember the diagnosis and reusable fix.\n'
};
export const incident = {id:'INC-284', title:'Checkout errors after deploy', pattern:'pool', date:'Today, 14:32', input:12840, output:1184, consent:true};
export const events = [
  {name:'Maya Chen',role:'SRE',initials:'MC',tone:'lavender',time:'14:32',text:'Checkout errors are at 18% since v2.14. Customer caroline@northstar.example cannot complete an order.'},
  {name:'Ravi Patel',role:'Backend',initials:'RP',tone:'sand',time:'14:33',text:'DB connections are pinned at 200/200. Debug DSN: postgres://svc_ops:demo-password@db.internal:5432/core'},
  {name:'Lena Park',role:'Support',initials:'LP',tone:'pink',time:'14:33',text:'This is a $96,000 ARR account. I have the customer update covered.'},
  {name:'Maya Chen',role:'SRE',initials:'MC',tone:'lavender',time:'14:34',text:'Use sk-demo-ops-7fa2 for the debug session. Raw request payload: session_id=demo-session-84; cart_total=240.'},
  {name:'Ops agent',role:'Tool result · traces',initials:'✳',tone:'green',time:'14:34',text:'The retry path skips client.release(). Each failed request holds a database connection. The pool is exhausted.'},
  {name:'Ravi Patel',role:'Backend',initials:'RP',tone:'sand',time:'14:35',text:'Rolled back v2.14. Error rate is now 0.2%. Add client.release() in a finally block and cap worker concurrency at 40.'}
];
export const patterns = {
  pool:{name:'Connection pool exhaustion',color:'green',symptom:'Checkout errors rise after a deployment; database pool reaches 200/200 connections.',steps:['Compare error rate with deployment time.','Check pool utilization and retry traces.','Roll back the release; verify recovery.','Release connections in finally; cap concurrency.'],resolution:'Roll back the release. Add client.release() in a finally block and cap worker concurrency at 40.'},
  retry:{name:'Retry storm after timeout',color:'purple',symptom:'Upstream timeouts trigger immediate retries and amplify request volume.',steps:['Compare retry rate with upstream timeouts.','Check queue depth and request amplification.','Apply exponential backoff with jitter.','Limit attempts; verify queue recovery.'],resolution:'Apply exponential backoff with jitter, limit retry attempts to three, and verify that the queue drains.'},
  disk:{name:'Worker disk saturation',color:'amber',symptom:'A worker stops accepting jobs after its local log volume fills the disk.',steps:['Check disk utilization.','Identify the growing log volume.','Rotate logs and verify job recovery.'],resolution:'Rotate logs, reduce debug logging, and alert at 80% disk utilization.'}
};
export const history = [
  {id:'INC-281',pattern:'pool',date:'Sep 26',input:11640,output:1040,consent:true},
  {id:'INC-276',pattern:'pool',date:'Sep 24',input:14380,output:1260,consent:true},
  {id:'INC-269',pattern:'pool',date:'Sep 22',input:10980,output:920,consent:false},
  {id:'INC-262',pattern:'pool',date:'Sep 20',input:13200,output:1120,consent:true},
  {id:'INC-278',pattern:'retry',date:'Sep 25',input:8620,output:890,consent:true},
  {id:'INC-271',pattern:'retry',date:'Sep 23',input:9280,output:940,consent:true},
  {id:'INC-255',pattern:'retry',date:'Sep 18',input:7960,output:860,consent:true},
  {id:'INC-258',pattern:'disk',date:'Sep 19',input:6140,output:720,consent:true}
];

const ruleset = [
  {type:'Credential',pattern:/postgres:\/\/[^\s]+/gi,replace:'[connection credential removed]'},
  {type:'Credential',pattern:/\bsk-[\w-]+/gi,replace:'[API key removed]'},
  {type:'Customer email',pattern:/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,replace:'[customer email removed]'},
  {type:'Customer revenue',pattern:/\$[\d,]+\s*ARR/gi,replace:'[customer revenue removed]'},
  {type:'Debug payload',pattern:/Raw request payload:[^\n]+/gi,replace:'[raw request payload removed]'}
];
export function redact(text, rules=defaults) {
  let cleaned=text; const removed=[];
  const extra=[...`${rules.company}\n${rules.employee}`.matchAll(/never store:\s*(.+)/gi)].flatMap(m=>m[1].split(',')).map(s=>s.trim()).filter(s=>s && !['credentials','customer emails','customer revenue','raw request payloads'].includes(s.toLowerCase()));
  for(const r of [...ruleset,...extra.map(term=>({type:'Employee / company rule',pattern:new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),replace:'[excluded by rule]'}))]){
    cleaned=cleaned.replace(r.pattern,match=>{removed.push({type:r.type,value:match});return r.replace;});
  }
  return {cleaned,removed};
}
export function cleanEvents(rules){return events.map(e=>({...e,...redact(e.text,rules)}));}
export function minimum(rules){return Math.min(20,Math.max(2,Number(rules.company.match(/Minimum repeated runs:\s*(\d+)/i)?.[1]||3)));}
export function trainingAllowed(rules){return !/allow training:\s*(?:no|false|off)\b/i.test(`${rules.company}\n${rules.employee}`);}
export function library(saved){return saved?[incident,...history]:history;}
export function grouped(records){return Object.entries(patterns).map(([key,p])=>({...p,key,runs:records.filter(r=>r.pattern===key)}));}
export function eligible(records,rules){return records.filter(r=>r.consent&&trainingAllowed(rules)&&records.filter(t=>t.pattern===r.pattern).length>=minimum(rules));}
export function trainingRows(records,rules){return eligible(records,rules).map(r=>({id:r.id,messages:[{role:'user',content:redact(patterns[r.pattern].symptom,rules).cleaned},{role:'assistant',content:redact(patterns[r.pattern].resolution,rules).cleaned}],metadata:{synthetic:true,pattern:r.pattern,training_consent:true}})).filter(r=>!r.messages.some(m=>m.content.includes('[excluded by rule]')));}
export const totalTokens = records=>records.reduce((n,r)=>n+r.input+r.output,0);

// Synthetic agent events behind the incident, separate from the human chat.
export const agentTrajectory = [
  {kind:'CONTEXT',name:'incident.opened',time:'14:32:08',fields:[['incident','INC-284 · checkout error rate 18% after deploy v2.14'],['customer','caroline@northstar.example · $96,000 ARR']]},
  {kind:'TOOL CALL',name:'database.inspect_pool',time:'14:33:12',fields:[['connection','postgres://svc_ops:demo-password@db.internal:5432/core'],['result','active_connections: 200 / 200']]},
  {kind:'TOOL CALL',name:'traces.search',time:'14:34:06',fields:[['authorization','Bearer sk-demo-ops-7fa2'],['request','Raw request payload: session_id=demo-session-84; cart_total=240.']]},
  {kind:'TOOL RESULT',name:'traces.result',time:'14:34:07',fields:[['finding','Retry path skips client.release(); failed requests hold database connections.']]},
  {kind:'OUTPUT',name:'incident.resolve',time:'14:35:21',fields:[['recovery','Rollback v2.14. Checkout error rate: 18% → 0.2%.'],['fix','Release clients in finally; cap worker concurrency at 40.']]}
];
