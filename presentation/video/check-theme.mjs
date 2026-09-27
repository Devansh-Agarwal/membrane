import { chromium } from '/Users/devanshagarwal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const cameraCSS=(await fs.readFile('presentation/video/record.mjs','utf8')).match(/const cameraCSS=`([\s\S]*?)`;/)[1];
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results=[];
for(const view of ['chat','trajectory','memory','learning']){
 await page.goto('http://127.0.0.1:4320/?present&view='+view);
 await page.locator('.presentation-nav [data-page]').first().waitFor();
 await page.addStyleTag({content:cameraCSS});
 const result=await page.evaluate(()=>({tabs:[...document.querySelectorAll('.presentation-nav [data-page]')].map(e=>e.textContent),active:document.querySelector('.presentation-nav [aria-current="page"]')?.textContent,background:getComputedStyle(document.body).backgroundColor,headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,headingColor:getComputedStyle(document.querySelector('h1')).color}));
 if(result.tabs.join('|')!=='Incident chat|Agent trajectory|Clean memory|Learning signals'||result.background!=='rgb(238, 242, 247)')throw Error('Inconsistent theme or tabs');
 await page.screenshot({path:`presentation/video/assets/v2-check-${view}.png`});
 results.push({view,...result});
}
await page.locator('[data-action="settings"]').first().dispatchEvent('click');
await page.screenshot({path:'presentation/video/assets/v2-check-rules.png'});
console.log(JSON.stringify({results,errors},null,2));
await browser.close();
