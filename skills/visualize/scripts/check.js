#!/usr/bin/env node
// Headless sanity check for a generated visualization.
// Usage: node check.js <file.html> [--dark]
// Reports JS/console errors and horizontal overflow, and writes <file>.png (and <file>.mobile.png).
const path = require('path');
const file = process.argv[2];
if (!file) { console.error('usage: node check.js <file.html> [--dark]'); process.exit(2); }

let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  try { ({ chromium } = require('playwright-core')); }
  catch {
    console.log('SKIP: Playwright not installed — no headless check. Review the JS by hand, or run:');
    console.log('      npm i -g playwright && npx playwright install chromium');
    process.exit(0);
  }
}

(async () => {
  const abs = path.resolve(file);
  const url = 'file://' + abs;
  const scheme = process.argv.includes('--dark') ? 'dark' : 'light';
  let browser;
  try { browser = await chromium.launch(); }
  catch (e) { console.log('SKIP: could not launch Chromium (' + e.message.split('\n')[0] + ')'); process.exit(0); }
  const problems = [];
  const shots = [];
  for (const [label, viewport] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, colorScheme: scheme });
    page.on('pageerror', e => problems.push(`[${label}] JS error: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') problems.push(`[${label}] console.error: ${m.text()}`); });
    page.on('requestfailed', r => problems.push(`[${label}] failed to load: ${r.url()}`));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(1500); // let autoplay / layout settle
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${label}] horizontal overflow of ${overflow}px (page scrolls sideways)`);
    const empty = await page.evaluate(() => [...document.querySelectorAll('svg,canvas')]
      .filter(el => el.getBoundingClientRect().height > 40 && (el.tagName === 'canvas' ? false : el.childElementCount === 0)).length);
    if (empty) problems.push(`[${label}] ${empty} visible <svg> element(s) are empty`);
    const out = abs.replace(/\.html?$/i, '') + (label === 'mobile' ? '.mobile.png' : '.png');
    await page.screenshot({ path: out, fullPage: true });
    shots.push(out);
    await page.close();
  }
  await browser.close();
  console.log('Screenshots: ' + shots.join(', '));
  if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log('OK: no JS errors, no horizontal overflow.');
})();
