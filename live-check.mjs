// The things file:// cannot prove: the redirect, the service worker,
// offline-after-one-visit, and that version.json is reachable from the
// page. Needs the network and a deployed site; not part of npm test.
import { chromium } from 'playwright';
import fs from 'fs';
import jsQR from 'jsqr';

const URL = 'https://baaki.j33t.pro/';
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
ok('the number is right on the real host', (await page.locator('#num').textContent()).trim(), '427d');
ok('the tab title', await page.title(), 'D-427 · Metro Phase 2');

/* The preview card, which is the one thing about a link that people
   who have not clicked will ever see. A crawler fetches the root and
   stops there - it never follows the redirect - so the tags have to be
   on index.html, and the image has to actually be reachable at the
   absolute URL they name. Both are easy to get wrong and impossible to
   notice from a browser. */
const root = await (await fetch(URL)).text();
ok('the root page carries a card at all', /property="og:image"/.test(root), true);
const card = (/property="og:image" content="([^"]+)"/.exec(root) || [])[1];
ok('and names it absolutely, because a crawler resolves nothing',
   /^https:\/\//.test(card || ''), true);
const img = await fetch(card);
ok('the image is really there', img.status, 200);
ok('and is a format a chat app will draw', (img.headers.get('content-type') || '').includes('image/'), true);
const bytes = +(img.headers.get('content-length') || 0);
ok('and is light enough that WhatsApp will not skip it', bytes > 0 && bytes < 300000, true);

/* The query form only matters once the worker is up. Until then it
   still has to load the board - it is the same page either way. */
await page.goto(URL + '?b=Metro%20Phase%202~2027-11-03');
await page.waitForTimeout(1200);
ok('a ?b= link lands on the right board', (await page.locator('#num').textContent()).trim(), '427d');
ok('and puts the private form back in the address bar',
   await page.evaluate(() => location.search), '');

await page.goto(URL + '#Metro%20Phase%202~2027-11-03');
await page.waitForTimeout(1200);

// the service worker, which only exists on a real origin
await page.waitForTimeout(1500);
ok('service worker registers', await page.evaluate(() => navigator.serviceWorker.controller !== null || navigator.serviceWorker.getRegistrations().then(r => r.length > 0)), true);

// version.json is reachable from the page, which is the whole update path
const check = await page.evaluate(() =>
  fetch('https://baaki.j33t.pro/version.json', { cache: 'no-store' }).then(r => r.json()).catch(e => ({ err: String(e) })));
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
/* The root, not /baaki.html. index.html forwards the fragment
   untouched, so it is the same board in a shorter link - and it is the
   page carrying the preview card, which the file name is not. Shorter
   also means fewer modules, and the code has a version budget. */
ok('the code scans back to the live board', decoded && decoded.data,
   shot.href.replace('/baaki.html', '/'));
ok('and carries the root, not the file name',
   (decoded && decoded.data || '').includes('baaki.html'), false);
ok('and a hosted link needs a small code', (shot.w / 6 - 8 - 17) / 4 <= 4, true);

// offline, after one visit — the reason sw.js exists at all
await ctx.setOffline(true);
await page.goto('about:blank');
await page.goto(URL + '#Metro%20Phase%202~2027-11-03');
await page.waitForTimeout(1000);
ok('it still opens with the network off', (await page.locator('#num').textContent()).trim(), '427d');
await ctx.setOffline(false);

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
