// The things file:// cannot prove: the redirect, the service worker,
// offline-after-one-visit, and that version.json is reachable from the
// page. Needs the network and a deployed site; not part of npm test.
import { chromium } from 'playwright';
import fs from 'fs';
import jsQR from 'jsqr';

const URL = 'https://j333t.github.io/baaki/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ timezoneId: 'Asia/Kolkata', locale: 'en-IN' });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date('2026-09-02T10:00:00.000+05:30'));

let pass = 0, fail = 0;
const ok = (n, got, want) => {
  const good = String(got) === String(want);
  good ? pass++ : fail++;
  console.log(`${good ? 'PASS' : 'FAIL'}  ${n}${good ? '' : `\n        got  ${got}\n        want ${want}`}`);
};

// the redirect, and the goal surviving it
await page.goto(URL + '#Metro%20Phase%202~2027-11-03');
await page.waitForTimeout(1200);
ok('index.html forwards and keeps the hash', page.url().includes('baaki.html#Metro'), true);
ok('the number is right on the real host', (await page.locator('#num').textContent()).trim(), '427');
ok('the tab title', await page.title(), 'D-427 · Metro Phase 2');

// the service worker, which only exists on a real origin
await page.waitForTimeout(1500);
ok('service worker registers', await page.evaluate(() => navigator.serviceWorker.controller !== null || navigator.serviceWorker.getRegistrations().then(r => r.length > 0)), true);

// version.json is reachable from the page, which is the whole update path
const check = await page.evaluate(() =>
  fetch('https://j333t.github.io/baaki/version.json', { cache: 'no-store' }).then(r => r.json()).catch(e => ({ err: String(e) })));
// checked against baaki.html's own VERSION rather than a hardcoded
// string, so this stops going stale every time we ship
const localVer = fs.readFileSync('baaki.html', 'utf8').match(/VERSION\s*=\s*'([^']+)'/)[1];
ok('version.json matches this release', check.version, localVer);

// a QR of a real https link, decoded for real
await page.keyboard.press('q');
await page.waitForTimeout(400);
const shot = await page.evaluate(() => {
  const src = document.querySelector('#qrCv');
  const k = 6, big = document.createElement('canvas');
  big.width = big.height = src.width * k;
  const x = big.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.drawImage(src, 0, 0, big.width, big.height);
  return { w: big.width, data: Array.from(x.getImageData(0, 0, big.width, big.height).data), href: location.href };
});
const decoded = jsQR(Uint8ClampedArray.from(shot.data), shot.w, shot.w);
ok('the code scans back to the live link', decoded && decoded.data, shot.href);
ok('and a hosted link needs a small code', (shot.w / 6 - 8 - 17) / 4 <= 4, true);

// offline, after one visit — the reason sw.js exists at all
await ctx.setOffline(true);
await page.goto('about:blank');
await page.goto(URL + '#Metro%20Phase%202~2027-11-03');
await page.waitForTimeout(1000);
ok('it still opens with the network off', (await page.locator('#num').textContent()).trim(), '427');
await ctx.setOffline(false);

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
