import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const FILE = 'file:///D:/claude%20playground/countdown/baaki.html';
const TZ = 'Asia/Kolkata';
const NOW = '2026-09-02T10:00:00.000+05:30';   // fixed "now" for every case

let pass = 0, fail = 0;
const ok = (name, got, want) => {
  const good = String(got) === String(want);
  good ? pass++ : fail++;
  console.log(`${good ? 'PASS' : 'FAIL'}  ${name}\n        got  ${JSON.stringify(got)}${good ? '' : `\n        want ${JSON.stringify(want)}`}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ timezoneId: TZ, locale: 'en-IN', colorScheme: 'dark', viewport: { width: 1100, height: 700 } });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date(NOW));

async function open(hash) {
  await page.goto('about:blank');          // force a real load, not a hash-only jump
  await page.goto(FILE + hash);
  await page.waitForTimeout(220);
  return {
    name:  (await page.locator('#name').textContent()).trim(),
    num:   (await page.locator('#num').textContent()).trim(),
    unit:  (await page.locator('#unit').textContent()).trim(),
    sub:   (await page.locator('#sub').textContent()).trim(),
    tag:   (await page.locator('#tag').textContent()).trim(),
    title: await page.title(),
    g1:    await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--g1').trim()),
    g2:    await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--g2').trim()),
    chips: await page.locator('.chip').allTextContents(),
    doneVisible: await page.locator('#bDone').isVisible(),
    hash:  await page.evaluate(() => location.hash),
  };
}

console.log('--- the ladder ---');

// 1. far out: years
let r = await open('#Metro%20Phase%202~2027-11-03');
ok('far: number is calendar days', r.num, '427');
ok('far: unit', r.unit, 'days');
ok('far: human span shown', r.sub.includes('1 yr 2 mo'), true);
ok('far: date shown', r.sub.includes('3 Nov 2027'), true);
ok('far: dark under a dark OS', parseInt(r.g2.slice(1),16) < 0x404040, true);
ok('far: tab title', r.title, 'D-427 · Metro Phase 2');
const farG2 = r.g2;

// 2. inside a month
r = await open('#Beta~2026-09-20');
ok('20 days: number', r.num, '18');
ok('under a month: no span, hero already says it', r.sub, '20 Sept 2026');
const nearG2 = r.g2;
ok('gradient warms as it nears', farG2 !== nearG2, true);

// 3. tomorrow -> still days
r = await open('#Ship~2026-09-03');
ok('tomorrow: number', r.num, '1');
ok('tomorrow: singular unit', r.unit, 'day');

// 4. the target day itself, more than an hour left -> H:MM
r = await open('#Ship~2026-09-02T18:30');
ok('today 8.5h out: H:MM', r.num, '8:30');
ok('today: unit', r.unit, 'hours · today');
ok('today: title', r.title, '8:30 · Ship');

// 4b. bare date on the target day = end of that day
r = await open('#Ship~2026-09-02');
ok('today, no time given: H:MM to midnight', r.num, '13:59');

// 5. last hour -> M:SS
r = await open('#Ship~2026-09-02T10:40');
ok('40 min out: M:SS', r.num, '40:00');
ok('last hour: unit', r.unit, 'minutes');

// 5b. boundary: exactly over an hour stays on H:MM
r = await open('#Ship~2026-09-02T11:01');
ok('61 min out: still H:MM', r.num, '1:01');

// 6. overdue - the ladder mirrors, so the ramp is smooth both ways
r = await open('#Ship~2026-08-27');
ok('over by days: number', r.num, '+6');
ok('over by days: unit', r.unit, 'days over');
ok('over by days: tag', r.tag, 'past due');
ok('over by days: grey gradient', r.g2, '#37373e');

r = await open('#Ship~2026-09-02T02:00');
ok('over by hours: +H:MM', r.num, '+8:00');
ok('over by hours: unit', r.unit, 'hours over');
ok('over by hours: still grey', r.g2, '#37373e');

r = await open('#Ship~2026-09-02T09:20');
ok('over by minutes: +M:SS', r.num, '+40:00');
ok('over by minutes: unit', r.unit, 'minutes over');

r = await open('#Ship~2026-09-02T09:59');
ok('just over: seconds tick, now with tenths', r.num, '+1:00.0');

console.log('\n--- something good, not a deadline ---');

const deadlineHue = (await open('#Diwali~2027-11-03')).g2;
r = await open('#Diwali~2027-11-03*');
ok('event counts down the same', r.num, '427');
ok('event gradient differs from a deadline', r.g2 !== deadlineHue, true);
ok('event is starred in the name', r.name.startsWith('★'), true);

r = await open('#Diwali~2026-08-27*');
ok('event does not run over, it arrives', r.num, '★');
ok('arrived: unit', r.unit, 'here');
ok('arrived: tag', r.tag, 'it is here');
ok('arrived: celebrates', await page.locator('#hero').getAttribute('class'), 'pop');
ok('arrived: never greys out', r.g2 !== '#37373e', true);
ok('arrived: no Done button to press', r.doneVisible, false);

r = await open('#Diwali~2027-11-03*+!edit');
ok('event round-trips the star through the link',
   decodeURIComponent(await page.evaluate(() => location.hash)), '#Diwali~2027-11-03*+!edit');

console.log('\n--- done + celebration tiers ---');

r = await open('#Ship~2026-09-30!2026-09-01T14:00');
ok('done early: check mark', r.num, '✓');
ok('done early: tier word', r.unit, 'early');
ok('done early: celebration fires', await page.locator('#hero').getAttribute('class'), 'pop');
ok('done early: completed date', /^completed 1 Sept 2026/.test(r.tag), true);

r = await open('#Ship~2026-09-02T12:00!2026-09-02T09:00');
ok('done same day: on time', r.unit, 'on time');
ok('done on time: celebration fires', await page.locator('#hero').getAttribute('class'), 'pop');

r = await open('#Ship~2026-08-20!2026-09-01T09:00');
ok('done after target: delivered', r.unit, 'delivered');
ok('done late: celebration fires', await page.locator('#hero').getAttribute('class'), 'pop');

console.log('\n--- multiple goals ---');

r = await open('#Launch~2027-03-31+Beta~2026-11-15+Hiring~2026-10-01');
ok('big one is first in link', r.num, '210');
ok('two chips shown', r.chips.length, 2);
ok('chip 1 label', r.chips[0], 'Beta74d');
ok('chip 2 label', r.chips[1], 'Hiring29d');

await page.locator('.chip').nth(1).click();
await page.waitForTimeout(200);
ok('click promotes to big', (await page.locator('#num').textContent()).trim(), '29');
ok('link rewrites to match the view', decodeURIComponent(await page.evaluate(() => location.hash)).startsWith('#Hiring~2026-10-01'), true);

console.log('\n--- edit flag ---');
r = await open('#Launch~2027-03-31');
ok('viewer link: no Done button', r.doneVisible, false);
r = await open('#Launch~2027-03-31+!edit');
ok('creator link: Done button shows', r.doneVisible, true);

console.log('\n--- share strips !edit ---');
await page.goto(FILE + '#Launch~2027-03-31+!edit');
await page.waitForTimeout(200);
const shareLink = await page.evaluate(() => {
  let copied = null;
  navigator.clipboard.writeText = t => { copied = t; return Promise.resolve(); };
  document.querySelector('#bShare').click();
  return copied;
});
ok('share link drops !edit', shareLink && !shareLink.includes('!edit'), true);
ok('share link keeps the goal', shareLink && shareLink.includes('Launch~2027-03-31'), true);

console.log('\n--- names with awkward characters ---');
r = await open('#' + encodeURIComponent('Q3 "big+bet" ~ 50%!').replace(/[~!*'()]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase()) + '~2026-12-01');
ok('round-trips a name with + ~ ! %', r.title, 'D-90 · Q3 "big+bet" ~ 50%!');

console.log('\n--- offline ---');
await ctx.setOffline(true);
r = await open('#Launch~2027-03-31');
ok('works with the network off', r.num, '210');
await ctx.setOffline(false);

console.log('\n--- pressing Done for real ---');
await page.goto('about:blank');
await page.goto(FILE + '#Ship~2026-09-30+!edit');
await page.waitForTimeout(220);
const doneLink = await page.evaluate(() => {
  let copied = null;
  navigator.clipboard.writeText = t => { copied = t; return Promise.resolve(); };
  document.querySelector('#bDone').click();
  return copied;
});
await page.waitForTimeout(150);
ok('press Done: hero becomes a tick', (await page.locator('#num').textContent()).trim(), '✓');
ok('press Done: tier is early', (await page.locator('#unit').textContent()).trim(), 'early');
ok('press Done: celebration fires', await page.locator('#hero').getAttribute('class'), 'pop');
ok('press Done: button disappears', await page.locator('#bDone').isVisible(), false);
ok('press Done: link carries the stamp',
   /Ship~2026-09-30!2026-09-02T10:00/.test(decodeURIComponent(doneLink || '')), true);
ok('press Done: shared link drops !edit', doneLink && !doneLink.includes('!edit'), true);
ok('press Done: own url updated too',
   /!2026-09-02T10:00/.test(decodeURIComponent(await page.evaluate(() => location.hash))), true);

console.log('\n--- adding a goal by hand ---');
await page.evaluate(() => localStorage.removeItem('baaki.hash'));
await page.goto('about:blank');
await page.goto(FILE);                       // no hash, no saved goals
await page.waitForTimeout(600);
ok('empty state opens the dialog', await page.locator('#dlg').isVisible(), true);
await page.fill('#fName', 'Phase 3 tender');
await page.fill('#fDate', '2026-12-25');
await page.click('#addForm button[type=submit]');
await page.waitForTimeout(200);
await page.click('#bClose');
await page.waitForTimeout(150);
ok('added goal shows', (await page.locator('#num').textContent()).trim(), '114');
ok('added goal lands in the link',
   decodeURIComponent(await page.evaluate(() => location.hash)).includes('Phase 3 tender~2026-12-25'), true);
ok('creator keeps the Done button', await page.locator('#bDone').isVisible(), true);
await page.reload();
await page.waitForTimeout(250);
ok('survives a reload', (await page.locator('#num').textContent()).trim(), '114');

console.log('\n--- junk input ---');
await page.evaluate(() => localStorage.removeItem('baaki.hash'));
r = await open('#not-a-goal+~~~+Real~2026-10-01+Broken~99-99-99');
ok('junk tokens dropped, the good one kept', r.num, '29');
ok('junk leaves no stray chips', r.chips.length, 0);
ok('junk is scrubbed from the link',
   decodeURIComponent(await page.evaluate(() => location.hash)), '#Real~2026-10-01');

console.log('\n--- keyboard and swipe ---');
await page.goto('about:blank');
await page.goto(FILE + '#One~2027-01-01+Two~2027-02-01+Three~2027-03-01');
await page.waitForTimeout(220);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(150);
ok('right arrow moves to the next goal', (await page.locator('#name').textContent()).trim(), 'Two');
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(150);
ok('left arrow comes back', (await page.locator('#name').textContent()).trim(), 'One');
await page.keyboard.press('Tab');
await page.waitForTimeout(150);
ok('tab moves forward too', (await page.locator('#name').textContent()).trim(), 'Two');
ok('arrows are exact inverses', (await page.locator('#name').textContent()).trim(), 'Two');
await page.keyboard.press('3');
await page.waitForTimeout(150);
ok('number keys jump to the nth', (await page.locator('#name').textContent()).trim(), 'One');
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(150);
ok('and the ring is still in order', (await page.locator('#name').textContent()).trim(), 'Three');
await page.keyboard.press('t');
await page.waitForTimeout(150);
ok('t flips the theme', await page.evaluate(() => document.documentElement.dataset.theme), 'light');
await page.keyboard.press('t');
await page.keyboard.press('g');
await page.waitForTimeout(200);
ok('g opens goals', await page.locator('#dlg').isVisible(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
ok('escape closes it', await page.locator('#dlg').isVisible(), false);
await page.keyboard.press('?');
await page.waitForTimeout(200);
ok('? opens about', await page.locator('#about').isVisible(), true);
ok('about credits Sreedharan',
   (await page.locator('#about').textContent()).includes('Sreedharan'), true);
ok('about shows the Devanagari', (await page.locator('#about .dev').textContent()).trim(), 'बाकी');
await page.keyboard.press('Escape');

console.log('\n--- the goals dialog ---');
await page.goto('about:blank');
await page.goto(FILE + '#Tender~2026-10-15+Trials~2026-12-01');
await page.waitForTimeout(220);
await page.click('#bAdd');
await page.waitForTimeout(200);
const box = await page.locator('#dlg').boundingBox();
const vp = page.viewportSize();
ok('dialog is horizontally centred',
   Math.abs((box.x + box.width / 2) - vp.width / 2) < 4, true);
ok('dialog is vertically centred',
   Math.abs((box.y + box.height / 2) - vp.height / 2) < 4, true);

await page.mouse.click(20, 20);                     // click the backdrop
await page.waitForTimeout(200);
ok('clicking outside closes it', await page.locator('#dlg').isVisible(), false);

await page.click('#bAdd');
await page.waitForTimeout(200);
await page.locator('.row').first().locator('button[title=Edit]').click();
await page.waitForTimeout(150);
ok('edit loads the goal into the form', await page.inputValue('#fName'), 'Tender');
ok('edit loads its date', await page.inputValue('#fDate'), '2026-10-15');
ok('submit becomes save', (await page.locator('#bSubmit').textContent()).trim(), 'Save changes');
await page.fill('#fName', 'Tender, revised');
await page.fill('#fDate', '2026-11-30');
await page.click('#kEvent');
await page.click('#bSubmit');
await page.waitForTimeout(200);
ok('edit renames in place',
   decodeURIComponent(await page.evaluate(() => location.hash)).includes('Tender, revised~2026-11-30*'), true);
ok('edit did not add a second goal', await page.locator('.row').count(), 2);
ok('form resets after saving', (await page.locator('#bSubmit').textContent()).trim(), 'Add goal');
await page.click('#bClose');

console.log('\n--- share one, or all ---');
await page.goto('about:blank');
await page.goto(FILE + '#One~2027-01-01+Two~2027-02-01+Three~2027-03-01');
await page.waitForTimeout(220);
await page.evaluate(() => { window.__copied = null; navigator.clipboard.writeText = t => { window.__copied = t; return Promise.resolve(); }; });
await page.click('#bShare');
await page.waitForTimeout(150);
ok('share offers a choice', await page.locator('#shOne').isVisible(), true);
ok('the choice names the count', (await page.locator('#shAll').textContent()).trim(), 'All 3');
await page.click('#shOne');
await page.waitForTimeout(150);
let copied = decodeURIComponent(await page.evaluate(() => window.__copied));
ok('this-one link carries only the big goal', copied.endsWith('#One~2027-01-01'), true);
await page.click('#bShare');
await page.waitForTimeout(150);
await page.click('#shAll');
await page.waitForTimeout(150);
copied = decodeURIComponent(await page.evaluate(() => window.__copied));
ok('all link carries every goal', copied.includes('One~2027-01-01+Two~2027-02-01+Three~2027-03-01'), true);
ok('neither leaks !edit', copied.includes('!edit'), false);

console.log('\n--- a board with too many numbers on it ---');
const many = Array.from({length: 11}, (_, i) => `Goal${i + 1}~2027-0${(i % 9) + 1}-15`).join('+');
r = await open('#' + many);
ok('chips are capped', r.chips.length, 8);                  // 7 goals + the "more" chip
ok('the rest collapse', r.chips[7], '+3 more');
ok('and we mention it', (await page.locator('#snark').textContent()).trim().length > 0, true);
r = await open('#One~2027-01-01+Two~2027-02-01');
ok('no snark for a sane number of goals', (await page.locator('#snark').textContent()).trim(), '');

console.log('\n--- the last ten minutes: tenths ---');
// a target written down to the second used to drop the goal entirely
r = await open('#New%20Year~2027-01-01T00:00:00');
ok('seconds in a target still parse', r.name, 'New Year');
ok('seconds: the number is right', r.num, '121');
r = await open('#Ship~2026-09-02T10:07:30');
ok('seconds land on the tenths rung', r.num, '7:30.0');
ok('seconds survive the round trip', r.hash, '#Ship~2026-09-02T10:07:30');
r = await open('#Ship~2026-09-02T10:07:00');
ok('a zero second is not written back', r.hash, '#Ship~2026-09-02T10:07');


// the rung opens under ten minutes and not a moment sooner
r = await open('#Ship~2026-09-02T10:11');
ok('11 min out: still whole seconds', r.num, '11:00');
r = await open('#Ship~2026-09-02T10:09');
ok('9 min out: tenths appear', r.num, '9:00.0');
ok('9 min out: unit unchanged', r.unit, 'minutes');
ok('the tenths are their own dim element', await page.locator('#num .dec').textContent(), '.0');
ok('the seconds stay the number you read', await page.locator('#num span').first().textContent(), '9:00');

// the tab and the favicon must not flicker ten times a second
ok('title stays on whole seconds', r.title, '9:00 · Ship');

// chips never carry tenths - seven of them at 10 Hz is a slot machine
r = await open('#Metro~2027-11-03+Ship~2026-09-02T10:09');
ok('chips stay coarse', r.chips[0].includes('9:00.'), false);
ok('chips still tick in seconds', r.chips[0].includes('9:00'), true);

// mirrored, the same way the rest of the ladder is
r = await open('#Ship~2026-09-02T09:55');
ok('5 min over: tenths mirror', r.num, '+5:00.0');
ok('5 min over: unit', r.unit, 'minutes over');
r = await open('#Ship~2026-09-02T09:49');
ok('11 min over: back to whole seconds', r.num, '+11:00');

// the zero-hour celebration used to live entirely inside the old rung
r = await open('#Ship~2026-09-02T09:59');
ok('1 min over: still celebrates at zero', await page.locator('#hero').getAttribute('class'), 'pop');

// a request for less motion turns the rung off rather than slowing it down
{
  const calm = await browser.newContext({ timezoneId: TZ, locale: 'en-IN', colorScheme: 'dark',
    reducedMotion: 'reduce', viewport: { width: 1100, height: 700 } });
  const cp = await calm.newPage();
  await cp.clock.setFixedTime(new Date(NOW));
  await cp.goto(FILE + '#Ship~2026-09-02T10:09');
  await cp.waitForTimeout(220);
  ok('reduced motion: no tenths at all', (await cp.locator('#num').textContent()).trim(), '9:00');
  await calm.close();
}

console.log('\n--- this screen: per-device, never in the link ---');

r = await open('#Ship~2027-01-01');
const hashBefore = r.hash;
const subBefore = await page.evaluate(() => getComputedStyle(document.querySelector('#sub')).fontSize);
const heroK = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--hero-k').trim());

await page.keyboard.press('+');
await page.keyboard.press('+');
await page.waitForTimeout(80);
ok('+ grows the number', await heroK(), '1.45');
ok('it scales the hero only', await page.evaluate(() => getComputedStyle(document.querySelector('#sub')).fontSize), subBefore);
ok('size never touches the link', await page.evaluate(() => location.hash), hashBefore);

await page.keyboard.press('-');
await page.waitForTimeout(80);
ok('- shrinks it back a step', await heroK(), '1.2');

// it is about this screen, so it has to survive a reload
r = await open('#Ship~2027-01-01');
ok('size is remembered on this device', await heroK(), '1.2');

await page.keyboard.press('0');
await page.waitForTimeout(80);
ok('0 puts it back', await heroK(), '1');

// the panel
await page.keyboard.press('?');
await page.waitForTimeout(150);
const labels = await page.locator('#opts .lbl').allTextContents();
ok('the panel offers a size control', labels.includes('Size of the number'), true);
ok('fullscreen is offered where it works', labels.includes('Fullscreen'), true);
ok('rotation lock stays hidden until it could work', labels.includes('Lock rotation'), false);
ok('nothing shouts about an update by default', await page.locator('#upd').isVisible(), false);
await page.keyboard.press('Escape');
await page.waitForTimeout(120);

// a wall board is a big screen with nothing to point at
{
  const tv = await browser.newContext({ timezoneId: TZ, locale: 'en-IN', colorScheme: 'dark',
    viewport: { width: 1920, height: 1080 }, hasTouch: true, isMobile: false });
  const tp = await tv.newPage();
  await tp.clock.setFixedTime(new Date(NOW));
  await tp.goto(FILE + '#Ship~2027-01-01');
  await tp.waitForTimeout(220);
  const k = await tp.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--hero-k').trim());
  ok('a big screen with no mouse starts bigger', Number(k) > 1, true);
  await tv.close();
}

console.log('\n--- update check: quiet, or silent ---');

// a downloaded file has no other way to learn it is old
await page.route('**/version.json', route =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ version: '9.9.9', url: 'https://example.com/' }) }));
r = await open('#Ship~2027-01-01');
await page.waitForTimeout(500);
ok('a newer version puts a dot on "?"', await page.locator('#bAbout').evaluate(b => b.classList.contains('dot')), true);
await page.keyboard.press('?');
await page.waitForTimeout(150);
ok('and one line inside the panel', (await page.locator('#upd').textContent()).includes('9.9.9'), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(120);
await page.unroute('**/version.json');

// the same version is not news
await page.route('**/version.json', route =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ version: '1.1.0' }) }));
r = await open('#Ship~2027-01-01');
await page.waitForTimeout(500);
ok('the current version says nothing', await page.locator('#bAbout').evaluate(b => b.classList.contains('dot')), false);
await page.unroute('**/version.json');

// and a host that will not answer must never be visible
await page.route('**/version.json', route => route.abort());
r = await open('#Ship~2027-01-01');
await page.waitForTimeout(500);
ok('a dead host is silent', await page.locator('#bAbout').evaluate(b => b.classList.contains('dot')), false);
ok('and the board is unharmed', r.num, '121');
await page.unroute('**/version.json');

// leave the device clean, or every screenshot below inherits a size
await page.evaluate(() => localStorage.removeItem('baaki.size'));

console.log('\n--- a code to scan ---');

r = await open('#Ship~2027-01-01');
ok('nothing on screen until asked', await page.locator('#qr').isVisible(), false);
await page.keyboard.press('q');
await page.waitForTimeout(200);
ok('q draws one', await page.locator('#qr').isVisible(), true);

const qr = await page.evaluate(() => {
  const cv = document.querySelector('#qrCv');
  const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  let dark = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i] < 128) dark++;
  return { side: cv.width, dark };
});
ok('it is a real grid, not an empty box', qr.dark > 100, true);
ok('a short link picks a small version', (qr.side - 8 - 17) / 4 <= 5, true);
ok('always dark on light, whatever the theme', qr.dark < qr.side * qr.side, true);

// it carries what you are looking at, and never the Done button
r = await open('#Ship~2027-01-01+Later~2027-06-01+!edit');
await page.keyboard.press('q');
await page.waitForTimeout(200);
ok('the code mentions how many goals it carries', (await page.locator('#qrNote').textContent()).includes('2'), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(120);
ok('Esc closes it', await page.locator('#qr').isVisible(), false);

// a board too big for a code says so rather than drawing something unscannable
r = await open('#' + Array.from({length: 14}, (_, i) => encodeURIComponent(`A rather long milestone name ${i + 1}`) + `~2027-0${(i % 9) + 1}-15`).join('+'));
await page.keyboard.press('q');
await page.waitForTimeout(200);
ok('too long: it says so', (await page.locator('#qrNote').textContent()).includes('too long'), true);
ok('too long: and draws nothing', await page.evaluate(() => document.querySelector('#qrCv').width <= 1), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(120);

console.log('\n--- sound: off until you ask ---');

await page.evaluate(() => localStorage.removeItem('baaki.sound'));
r = await open('#Ship~2027-01-01');
await page.keyboard.press('?');
await page.waitForTimeout(150);
let soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('a board is silent until somebody switches it on', await soundBtn.textContent(), 'Off');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);

const hashPre = await page.evaluate(() => location.hash);
await page.keyboard.press('m');
await page.waitForTimeout(150);
await page.keyboard.press('?');
await page.waitForTimeout(150);
soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('m turns it on', await soundBtn.textContent(), 'On');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);
ok('sound never touches the link', await page.evaluate(() => location.hash), hashPre);

// unlike keep-awake, this one is a preference and is remembered
r = await open('#Ship~2027-01-01');
await page.keyboard.press('?');
await page.waitForTimeout(150);
soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('and it is remembered on this device', await soundBtn.textContent(), 'On');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);

// the last ten seconds are where it earns its place, and it must not throw there
const errs = [];
page.on('pageerror', e => errs.push(e.message));
r = await open('#Ship~2026-09-02T10:00:08');
await page.waitForTimeout(400);
ok('ticking through the last ten seconds is quiet code', errs.length, 0);
ok('and the number is where it should be', r.num, '0:08.0');

await page.evaluate(() => localStorage.removeItem('baaki.sound'));

console.log('\n--- screenshots ---');
const shots = [
  ['far-dark',   '#Metro%20Phase%202~2027-11-03', 'dark'],
  ['near-dark',  '#Launch%20day~2026-09-14',      'dark'],
  ['today-dark', '#Ship~2026-09-02T18:30',        'dark'],
  ['over-dark',  '#Ship~2026-09-02T02:00',        'dark'],
  ['event-dark', '#Diwali~2026-11-08*',           'dark'],
  ['multi-dark', '#Metro%20Phase%202~2027-11-03+Tender~2026-10-15+Trials~2026-12-01+Handover~2027-06-30', 'dark'],
  ['crowded-dark', '#' + Array.from({length: 11}, (_, i) => `Goal ${i + 1}~2027-0${(i % 9) + 1}-15`).map(encodeURIComponent).join('+'), 'dark'],
  ['far-light',  '#Metro%20Phase%202~2027-11-03', 'light'],
  ['event-light','#Diwali~2026-11-08*',           'light'],
  ['multi-light','#Metro%20Phase%202~2027-11-03+Tender~2026-10-15+Trials~2026-12-01+Handover~2027-06-30', 'light'],
];
for (const [name, hash, theme] of shots) {
  await page.goto('about:blank');
  await page.goto(FILE + hash);
  await page.evaluate(t => { localStorage.setItem('baaki.theme', t); document.documentElement.dataset.theme = t; }, theme);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `shots/${name}.png` });
}
// mobile
const m = await ctx.newPage();
await m.clock.setFixedTime(new Date(NOW));
await m.setViewportSize({ width: 390, height: 780 });
await m.goto(FILE + '#Metro%20Phase%202~2027-11-03+Tender~2026-10-15+Trials~2026-12-01');
await m.waitForTimeout(300);
await m.screenshot({ path: 'shots/mobile-dark.png' });

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
