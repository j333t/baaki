/* Draws og.png - the picture WhatsApp, Slack and Discord show instead
   of a bare blue URL.

   Run: node og-card.mjs

   Why a script and not a stored image: every colour in Baaki is
   generated from a ramp, never pasted as a hex. So this loads the real
   page, asks it what 365 days out looks like, and paints the card with
   the answer. Nudge the ramp and re-run, and the card follows.

   Why 365: funky numbers get attention, meaningful ones get understood.
   "365" is the only number that reads as a duration without thinking -
   people already own the phrase. The card is a snapshot, not a clock,
   and a snapshot's job is to be understood in one second.

   1200x630 is the size every platform crops from. JPEG, not PNG: the
   card is one long smooth gradient, which is the worst case PNG has
   and the best case JPEG has - 285 KB became 40. WhatsApp starts
   skipping images somewhere around 300 KB, so the margin matters. */

import { chromium } from 'playwright';
import { readFileSync, statSync, writeFileSync } from 'fs';

const FILE = 'file://' + process.cwd().replace(/\\/g, '/').replace(/ /g, '%20') + '/baaki.html';
const OUT = 'og.jpg';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, colorScheme: 'dark' });

/* Ask the real page what a year out looks like, rather than guessing. */
const probe = await ctx.newPage();
const year = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);
await probe.goto(FILE + '#Anything~' + year);
await probe.waitForTimeout(400);
const ramp = await probe.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  return { g1: cs.getPropertyValue('--g1').trim(), g2: cs.getPropertyValue('--g2').trim() };
});
await probe.close();

const card = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:linear-gradient(155deg, ${ramp.g1}, ${ramp.g2});
  font-family:"Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,sans-serif;
  color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.mark{font-size:44px;font-weight:500;opacity:.92;display:flex;align-items:center;gap:14px}
.mark .rom{font-weight:400;opacity:.5}
.num{font-size:300px;font-weight:200;line-height:.92;letter-spacing:-.02em;
  display:flex;align-items:flex-start}
.num sup{font-size:.26em;font-weight:400;opacity:.45;margin-top:.55em;margin-left:.04em}
.tag{font-size:31px;font-weight:500;opacity:.66;margin-top:22px}
</style></head><body>
  <div class="mark"><span>बाकी</span><span class="rom">Baaki</span></div>
  <div class="num">365<sup>d</sup></div>
  <div class="tag">A deadline in a link. No account. Works offline.</div>
</body></html>`;

const page = await ctx.newPage();
await page.setContent(card);
await page.waitForTimeout(250);
await page.screenshot({ path: OUT, type: 'jpeg', quality: 92 });
await browser.close();

const kb = statSync(OUT).size / 1024;
console.log(`${OUT}  ${kb.toFixed(1)} KB  ramp ${ramp.g1} -> ${ramp.g2}`);
if (kb > 300) { console.error('too heavy - WhatsApp skips images over ~300 KB'); process.exit(1); }
