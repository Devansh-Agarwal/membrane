import { chromium } from '/Users/devanshagarwal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
try {
  await page.goto('http://127.0.0.1:4320/?present&view=chat');
  await page.getByRole('region',{name:'Team conversation',exact:true}).waitFor();
  await page.screenshot({path:'presentation/ui/01-team-chat.jpg'});
  await page.getByRole('button',{name:'Agent trajectory',exact:true}).click();
  await page.getByRole('region',{name:'Redacted agent trajectory',exact:true}).waitFor();
  await page.screenshot({path:'presentation/ui/02-redacted-trajectory.jpg'});
} finally { await browser.close(); }
