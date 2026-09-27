import { chromium } from '/Users/devanshagarwal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const base=path.resolve(root,'../..');
const scenes=JSON.parse(await fs.readFile(path.join(root,'timing.json'),'utf8'));
// Freeze the presentation assets for a consistent recording while the presentation chat continues.
const files=new Map();
for(const name of ['ops.html','ops.css','ops.js','ops-data.js','favicon.svg']) files.set('/'+name,await fs.readFile(path.join(base,'public',name)));
files.set('/',files.get('/ops.html'));
files.set('/title.html',await fs.readFile(path.join(root,'title.html')));
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,recordVideo:{dir:path.join(root,'assets','capture'),size:{width:1920,height:1080}}});
await context.route('**/*',async route=>{
 const pathname=new URL(route.request().url()).pathname;
 const body=files.get(pathname);
 if(!body)return route.abort();
 const type=pathname.endsWith('.js')?'text/javascript':pathname.endsWith('.css')?'text/css':pathname.endsWith('.svg')?'image/svg+xml':'text/html';
 return route.fulfill({status:200,contentType:type,body});
});
// Slow only the replay animation for the camera; filtering and results are unchanged.
await context.addInitScript(()=>{const interval=window.setInterval;window.setInterval=(fn,ms,...args)=>interval(fn,ms===550?1300:ms===450?650:ms,...args);});
const page=await context.newPage();
page.setDefaultTimeout(8000);
const origin=performance.now();
const video=page.video();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const cameraCSS=`
[data-action="arrange"],[data-action="present"]{display:none!important}
body{overflow:hidden!important}
.single-demo.incident-screen.presentation-mode main{padding-top:20px!important}
.single-demo .incident-layout.single-screen{margin-top:22px!important;max-width:1400px!important}
.single-demo .comparison-note{max-width:1400px!important;padding-top:15px!important}
.single-demo .trajectory-event{padding:11px 0!important}
.single-demo .trajectory-toolbar{padding:13px 25px!important}
.single-demo .comparison-window .chat-stream{min-height:0!important;padding:8px 27px!important}
.single-demo .comparison-window .chat-message{min-height:83px!important;padding:13px 0!important}
.single-demo .comparison-window .chat-body p{font-size:17px!important;line-height:1.6!important}
.single-demo .event-field>p{font-size:15px!important}
.single-demo .event-field>span{font-size:13px!important}
.single-demo .event-heading>strong{font-size:16px!important}
.single-demo .event-field .redacted-token{font-size:12px!important}
.single-demo .event-fields{gap:7px!important}
.single-demo .event-heading{margin-bottom:8px!important}
.single-demo .trajectory-stream{padding-bottom:10px!important}
.presentation-mode main{padding-top:22px!important;padding-bottom:18px!important}
.presentation-mode h1{font-size:40px!important}
.presentation-mode .page-heading{margin-bottom:0!important}
.presentation-mode .pipeline{margin:18px 0!important;padding:14px 18px!important}
.presentation-mode .learning-stats{margin:18px 0!important;padding:20px!important}
.presentation-mode .patterns-content{padding:14px 24px!important}
.presentation-mode .pattern-row{padding:14px 0!important}
.presentation-mode .training-body{padding:22px!important}
.presentation-mode .learning-layout,.presentation-mode .memory-layout{margin-top:18px!important}
.presentation-mode .document-body{padding:25px!important}
.presentation-mode .footer{margin-top:14px!important}
.settings-modal{width:1160px!important;max-height:860px!important}
.modal-backdrop{padding-bottom:100px!important}
.rule-editors textarea{font-size:17px!important;line-height:1.65!important;height:310px!important}
.rule-help p,.modal-footer span{font-size:14px!important}
.video-focus{outline:3px solid #4776ff!important;outline-offset:6px;box-shadow:0 0 0 10px #4776ff15!important;transition:outline-color .4s}
`;
async function loadApp(){await page.goto('http://demo.local/?present&view=chat');await page.locator('.comparison-window').waitFor();await page.addStyleTag({content:cameraCSS});}
async function wait(ms){await new Promise(r=>setTimeout(r,Math.max(0,ms)));}
async function focus(selector){await page.locator('.video-focus').evaluateAll(es=>es.forEach(e=>e.classList.remove('video-focus')));await page.locator(selector).first().evaluate(e=>e.classList.add('video-focus'));}
async function holdScene(scene,actions=[]){
 scene.start=(performance.now()-origin)/1000;
 console.log('Recording',scene.id,scene.duration+'s');
 const start=performance.now();
 for(const [seconds,fn] of actions){await wait(start+seconds*1000-performance.now());await fn();}
 await wait(start+scene.duration*1000-performance.now());
 await page.screenshot({path:path.join(root,'assets',scene.id+'.png')});
 scene.end=(performance.now()-origin)/1000;
 if(!['intro','outro'].includes(scene.id)){
  const tabs=await page.locator('.presentation-nav [data-page]').allTextContents();
  if(tabs.join('|')!=='Incident chat|Agent trajectory|Clean memory|Learning signals')throw Error('Inconsistent navigation tabs');
  scene.ui={tabs,background:await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor)};
 }
}
try{
 await page.goto('http://demo.local/title.html');
 await holdScene(scenes[0]);
 await loadApp();
 await holdScene(scenes[1],[[.8,()=>page.getByRole('button',{name:'Replay incident',exact:true}).click()],[6,()=>focus('.chat-message:nth-child(5)')],[10,()=>focus('.chat-message:nth-child(6)')]]);
 await page.getByRole('button',{name:'Memory rules',exact:true}).click();
 await holdScene(scenes[2],[[.8,()=>focus('#rule-company')],[4.6,()=>focus('#rule-employee')]]);
 await page.getByRole('button',{name:'Close rules',exact:true}).click();
 await page.locator('.presentation-nav [data-page="trajectory"]').click();
 await page.getByRole('button',{name:'Replay redaction',exact:true}).click();
 await holdScene(scenes[3],[[8,()=>focus('.trajectory-event:nth-child(4)')],[11,()=>focus('.trajectory-event:nth-child(5)')]]);
 const redactions=await page.locator('.trajectory-window .redacted-token').count();
 if(redactions!==5)throw Error('Expected five redacted spans; got '+redactions);
 await page.locator('.presentation-nav [data-page="memory"]').click();
 await page.locator('.document').waitFor();
 if(!(await page.locator('.document').innerText()).includes('INC-284'))throw Error('Current incident missing from demo memory');
 await holdScene(scenes[4],[[1,()=>focus('.step-list')]]);
 await page.locator('.presentation-nav [data-page="learning"]').click();
 await page.locator('.learning-stats').waitFor();
 await holdScene(scenes[5],[[1,()=>focus('.pattern-row:first-child')],[6,()=>focus('.pattern-row:nth-of-type(3)')],[9,()=>focus('.dataset-box')]]);
 await page.locator('[data-action="settings"]').first().dispatchEvent('click');
 await page.locator('#rule-employee').waitFor();
 await holdScene(scenes[6],[[.8,()=>page.getByRole('button',{name:'Turn employee training off',exact:true}).click()],[1.3,()=>focus('#rule-employee')],[4,()=>page.getByRole('button',{name:'Apply rules',exact:true}).click()],[4.5,()=>focus('.learning-stats>div:nth-child(3)')]]);
 const count=await page.locator('.learning-stats>div:nth-child(3)>strong').innerText();
 if(!count.startsWith('0'))throw Error('Training consent change not reflected');
 await page.goto('http://demo.local/title.html');
 await page.locator('.kicker').evaluate(e=>e.textContent='Use the context now. Choose what survives.');
 await page.locator('p').evaluate(e=>e.innerHTML='Local rule filtering works.<br>Jev, GBrain dispatch and training are simulated.');
 await page.locator('.chips').evaluate(e=>e.innerHTML='<span>Full context</span><span>Selective memory</span><span>Permissioned learning</span>');
 await holdScene(scenes[7]);
 if(errors.length)throw Error(errors.join('; '));
 await fs.writeFile(path.join(root,'recording-timing.json'),JSON.stringify({scenes,errors,redactions},null,2));
 await context.close();
 await video.saveAs(path.join(root,'assets','screen-recording.webm'));
 console.log('Captured successfully');
}finally{await browser.close();}
