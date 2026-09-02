// Decodes what the page actually draws, with a real QR reader.
// jsqr is a throwaway check that the encoder is correct - the product
// must never depend on it.
import { chromium } from 'playwright';
import jsQR from 'jsqr';

const FILE = 'file:///D:/claude%20playground/countdown/baaki.html';
const browser = await chromium.launch();
const page = await (await browser.newContext({ timezoneId: 'Asia/Kolkata' })).newPage();

const cases = [
  ['v4  one short goal',  '#Ship~2027-01-01'],
  ['v5  a real name',     '#Metro%20Phase%202%20handover~2027-11-03'],
  ['v6  three goals',     '#Metro%20Phase%202~2027-11-03+Tender%20close~2026-10-15+Trials%20begin~2026-12-01'],
  ['v7  four goals',      '#Metro%20Phase%202~2027-11-03+Tender%20close~2026-10-15+Trials%20begin~2026-12-01+Handover~2027-06-30'],
  ['v8  five goals',      '#Metro%20Phase%202~2027-11-03+Tender%20close~2026-10-15+Trials%20begin~2026-12-01+Handover%20to%20ops~2027-06-30+Diwali~2026-11-08*'],
  ['v9  six goals',       '#Metro%20Phase%202~2027-11-03+Tender%20close~2026-10-15+Trials%20begin~2026-12-01+Handover%20to%20ops~2027-06-30+Diwali~2026-11-08*+Board%20review~2027-02-10'],
  ['v10 seven goals',     '#' + Array.from({length:8},(_,i)=>encodeURIComponent(`Milestone ${i+1}`)+`~2027-0${i+1}-15`).join('+')],
  ['emoji in a name',     '#' + encodeURIComponent('Launch 🚀') + '~2027-03-31'],
];

let pass = 0, fail = 0;
for (const [name, hash] of cases) {
  await page.goto('about:blank');
  await page.goto(FILE + hash);
  await page.waitForTimeout(200);
  const want = await page.evaluate(() => location.href.split('#')[0] + location.hash);
  await page.keyboard.press('q');
  await page.waitForTimeout(250);

  // blow it up first: a decoder wants several pixels per module, and
  // that is what a phone camera sees anyway
  const shot = await page.evaluate(() => {
    const src = document.querySelector('#qrCv');
    if (src.width <= 1) return null;
    const k = 6, big = document.createElement('canvas');
    big.width = big.height = src.width * k;
    const x = big.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(src, 0, 0, big.width, big.height);
    const d = x.getImageData(0, 0, big.width, big.height);
    return { w: big.width, h: big.height, modules: src.width - 8, data: Array.from(d.data) };
  });
  if (!shot) { console.log(`FAIL  ${name}: nothing drawn`); fail++; continue; }

  const got = jsQR(Uint8ClampedArray.from(shot.data), shot.w, shot.h);
  const text = got && got.data;
  const good = text === want;
  good ? pass++ : fail++;
  console.log(`${good ? 'PASS' : 'FAIL'}  ${name}  -> version ${(shot.modules - 17) / 4}, ${shot.modules} modules`);
  if (!good) console.log(`        want ${want}\n        got  ${text}`);
  await page.keyboard.press('Escape');
}

// the honest failure when it will not fit
await page.goto('about:blank');
await page.goto(FILE + '#' + Array.from({length:14},(_,i)=>encodeURIComponent(`A rather long milestone name ${i+1}`)+`~2027-0${(i%9)+1}-15`).join('+'));
await page.waitForTimeout(200);
await page.keyboard.press('q');
await page.waitForTimeout(200);
const note = await page.locator('#qrNote').textContent();
const said = note.includes('too long');
said ? pass++ : fail++;
console.log(`${said ? 'PASS' : 'FAIL'}  too long: says so instead of drawing rubbish`);

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
