import { chromium } from '/Users/devanshagarwal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const view of ['chat','trajectory']) {
 await page.goto('http://127.0.0.1:4320/?present&view='+view);
 await page.locator('.comparison-window').waitFor();
 await page.screenshot({path:`presentation/video/assets/inspect-${view}.png`});
 console.log(JSON.stringify({view,errors,card:await page.locator('.comparison-window').boundingBox(),bodyHeight:await page.locator('body').evaluate(e=>e.scrollHeight)}));
}
await browser.close();
