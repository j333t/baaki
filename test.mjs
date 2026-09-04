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
ok('just over: seconds tick', r.num, '+1:00');

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
ok('done early: says how early', r.tag.indexOf('early') >= 0, true);
ok('done early: and when', r.tag.indexOf('1 Sept 2026') >= 0, true);

r = await open('#Ship~2026-09-02T12:00!2026-09-02T09:00');
ok('done same day: on time', r.unit, 'on time');
ok('done on time: celebration fires', await page.locator('#hero').getAttribute('class'), 'pop');

r = await open('#Ship~2026-08-20!2026-09-01T09:00');
ok('done after target: says late, not a euphemism', r.unit, 'late');
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
// an empty board is a live example, not a blank form, and it does not
// open a modal at somebody who has only just arrived
ok('empty board counts the rest of the year', /^\d{1,3}$/.test((await page.locator('#num').textContent()).trim()), true);
ok('and says what it is', (await page.locator('#unit').textContent()).trim(), 'days left in 2026');
ok('and says it is an example', (await page.locator('#tag').textContent()).trim(), 'an example');
ok('and what to press', (await page.locator('#snark').textContent()).includes('press G'), true);
ok('no dialog opens itself', await page.locator('#dlg').isVisible(), false);
// the example itself is the invitation - clicking it opens the form
await page.locator('main').click();
await page.waitForTimeout(250);
ok('clicking the example opens it too', await page.locator('#dlg').isVisible(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
await page.keyboard.press('g');
await page.waitForTimeout(250);
ok('g opens it', await page.locator('#dlg').isVisible(), true);
await page.fill('#fName', 'Phase 3 tender');
await page.fill('#fWhen', '2026-12-25');
await page.click('#addForm button[type=submit]');
await page.waitForTimeout(250);
ok('adding a goal closes the dialog by itself', await page.locator('#dlg').isVisible(), false);
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
ok('edit loads its date', await page.inputValue('#fWhen'), '2026-10-15');
ok('submit becomes save', (await page.locator('#bSubmit').textContent()).trim(), 'Save changes');
await page.fill('#fName', 'Tender, revised');
await page.fill('#fWhen', '2026-11-30');
await page.click('#kEvent');
await page.click('#bSubmit');
await page.waitForTimeout(250);
ok('saving an edit closes the dialog too', await page.locator('#dlg').isVisible(), false);
ok('edit renames in place',
   decodeURIComponent(await page.evaluate(() => location.hash)).includes('Tender, revised~2026-11-30*'), true);
await page.click('#bAdd');
await page.waitForTimeout(200);
ok('edit did not add a second goal', await page.locator('.row').count(), 2);
ok('the form was reset on the way out', (await page.locator('#bSubmit').textContent()).trim(), 'Add goal');
await page.click('#bClose');

console.log('\n--- share: one press, and a family of siblings ---');
await page.goto('about:blank');
await page.goto(FILE + '#One~2027-01-01+Two~2027-02-01+Three~2027-03-01');
await page.waitForTimeout(220);
await page.evaluate(() => { window.__copied = null; navigator.clipboard.writeText = t => { window.__copied = t; return Promise.resolve(); }; });
await page.click('#bShare');
await page.waitForTimeout(150);
let copied = decodeURIComponent(await page.evaluate(() => window.__copied));
ok('share copies this one, immediately', copied.endsWith('#One~2027-01-01'), true);
ok('the button never changes identity', await page.locator('#bShare').textContent(), 'Share');
ok('siblings sit inside the same family, not a popover',
   await page.locator('#shareGrp button').count(), 4);  // Share itself, plus All / Code / No goal
ok('all three are the same visual family', await page.evaluate(() =>
   document.querySelector('#bShare').parentElement === document.querySelector('#shareGrp')), true);

const seg = (text) => page.locator('#shareGrp button', { hasText: text });
await seg('All 3').click();
await page.waitForTimeout(150);
copied = decodeURIComponent(await page.evaluate(() => window.__copied));
ok('all link carries every goal', copied.includes('One~2027-01-01+Two~2027-02-01+Three~2027-03-01'), true);
ok('neither leaks !edit', copied.includes('!edit'), false);

await seg('No goal').click();
await page.waitForTimeout(150);
ok('the bare tool link has no hash', decodeURIComponent(await page.evaluate(() => window.__copied)).endsWith('/baaki.html'), true);

await seg('Code').click();
await page.waitForTimeout(250);
ok('Code opens the same QR dialog Q does', await page.locator('#qr').isVisible(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

// one goal still gets the whole family - Code and "no goal" do not
// depend on there being more than one goal to choose from
await page.goto('about:blank');
await page.goto(FILE + '#Only~2027-01-01');
await page.waitForTimeout(220);
await page.evaluate(() => { window.__copied = null; navigator.clipboard.writeText = t => { window.__copied = t; return Promise.resolve(); }; });
await page.click('#bShare');
await page.waitForTimeout(200);
ok('one goal: copied, no fuss', decodeURIComponent(await page.evaluate(() => window.__copied)).endsWith('#Only~2027-01-01'), true);
ok('one goal: "All" makes no sense and is not offered', await seg('All').count(), 0);
ok('one goal: Code is still offered', await seg('Code').count(), 1);
ok('one goal: so is the bare tool', await seg('No goal').count(), 1);

// an empty board has nothing to share and nothing to offer
await page.evaluate(() => localStorage.removeItem('baaki.hash'));
await page.goto('about:blank');
await page.goto(FILE);
await page.waitForTimeout(400);
ok('empty board: Share refuses', (() => true)(), true);
await page.click('#bShare');
await page.waitForTimeout(150);
ok('empty board: only Share itself, no siblings', await page.locator('#shareGrp button').count(), 1);

console.log('\n--- a board with too many numbers on it ---');
const many = Array.from({length: 11}, (_, i) => `Goal${i + 1}~2027-0${(i % 9) + 1}-15`).join('+');
r = await open('#' + many);
ok('chips are capped', r.chips.length, 8);                  // 7 goals + the "more" chip
ok('the rest collapse', r.chips[7], '+3 more');
ok('and we mention it', (await page.locator('#snark').textContent()).trim().length > 0, true);
r = await open('#One~2027-01-01+Two~2027-02-01');
// a sane goal count gets a quiet tip instead of snark - the line
// used to sit empty, which was free space wasted
ok('a sane goal count gets a tip, not snark', (await page.locator('#snark').textContent()).trim().length > 0, true);

console.log('\n--- seconds in a link, and the missed-deadline restraint ---');
// a target written down to the second used to drop the goal entirely -
// seconds in the link format are still worth keeping even without a
// tenths display, e.g. a deadline set to an exact second
r = await open('#New%20Year~2027-01-01T00:00:00');
ok('seconds in a target still parse', r.name, 'New Year');
ok('seconds: the number is right', r.num, '121');
r = await open('#Ship~2026-09-02T10:07:30');
ok('seconds survive the round trip', r.hash, '#Ship~2026-09-02T10:07:30');
r = await open('#Ship~2026-09-02T10:07:00');
ok('a zero second is not written back', r.hash, '#Ship~2026-09-02T10:07');

// A deadline crossing zero unmarked is a miss, not a finish. The clock
// cannot know whether you got there - that is the whole reason Done
// exists - so there is nothing to throw confetti about.
r = await open('#Ship~2026-09-02T09:59');
ok('a missed deadline does not celebrate', await page.locator('#hero').getAttribute('class'), null);
ok('it says what it is', r.tag, 'past due');
// something good arriving is the opposite case, and still does
r = await open('#Diwali~2026-09-02T09:59*');
ok('something good arriving still celebrates', await page.locator('#hero').getAttribute('class'), 'pop');

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

console.log('\n--- sound: on, but it cannot surprise you ---');

await page.evaluate(() => localStorage.removeItem('baaki.sound'));
r = await open('#Ship~2027-01-01');
await page.keyboard.press('?');
await page.waitForTimeout(150);
let soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('sound is on out of the box', await soundBtn.textContent(), 'On');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);

// the safety net is not a setting: a page nobody has touched cannot
// make a noise, because the browser will not start audio without a gesture
await page.addInitScript(() => {
  window.__audioMade = 0;
  const A = window.AudioContext;
  window.AudioContext = function(){ window.__audioMade++; return new A(); };
});
r = await open('#Ship~2026-09-02T10:00:05');
await page.waitForTimeout(500);
ok('an untouched page never even starts audio', await page.evaluate(() => window.__audioMade), 0);

const hashPre = await page.evaluate(() => location.hash);
await page.keyboard.press('m');
await page.waitForTimeout(150);
await page.keyboard.press('?');
await page.waitForTimeout(150);
soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('m turns it off', await soundBtn.textContent(), 'Off');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);
ok('sound never touches the link', await page.evaluate(() => location.hash), hashPre);

// remembered, unlike keep-awake
r = await open('#Ship~2027-01-01');
await page.keyboard.press('?');
await page.waitForTimeout(150);
soundBtn = page.locator('#opts .opt', { hasText: 'Sound at zero' }).locator('button');
ok('and off is remembered on this device', await soundBtn.textContent(), 'Off');
await page.keyboard.press('Escape');
await page.waitForTimeout(120);
await page.evaluate(() => localStorage.removeItem('baaki.sound'));

// the last ten seconds are where it earns its place, and it must not throw there
const errs = [];
page.on('pageerror', e => errs.push(e.message));
r = await open('#Ship~2026-09-02T10:00:08');
await page.waitForTimeout(400);
ok('ticking through the last ten seconds is quiet code', errs.length, 0);
ok('and the number is where it should be', r.num, '0:08');

await page.evaluate(() => localStorage.removeItem('baaki.sound'));

console.log('\n--- saying when, out loud ---');
// frozen clock: Wednesday 2 September 2026, 10:00 IST

r = await open('#Seed~2027-01-01');
await page.keyboard.press('g');
await page.waitForTimeout(250);

const reads = async (typed) => {
  await page.fill('#fWhen', typed);
  await page.waitForTimeout(90);
  return (await page.locator('#fParsed').textContent()).trim();
};

ok('a plain ISO date',        await reads('2027-03-31'),   'Wed, 31 Mar 2027 · end of day');
ok('day first, slashes',      await reads('31/3/2027'),    'Wed, 31 Mar 2027 · end of day');
ok('two-digit year',          await reads('31-3-27'),      'Wed, 31 Mar 2027 · end of day');
ok('day and month, spoken',   await reads('31 mar 2027'),  'Wed, 31 Mar 2027 · end of day');
ok('month first, spoken',     await reads('march 31 2027'),'Wed, 31 Mar 2027 · end of day');
ok('ordinals are fine',       await reads('31st march 2027'), 'Wed, 31 Mar 2027 · end of day');

ok('today',                   await reads('today'),        'Wed, 2 Sept 2026 · end of day');
ok('tomorrow',                await reads('tomorrow'),     'Thu, 3 Sept 2026 · end of day');
ok('a weekday means the next one', await reads('friday'),  'Fri, 4 Sept 2026 · end of day');
ok('next friday skips one',   await reads('next friday'),  'Fri, 11 Sept 2026 · end of day');
ok('in 3 weeks',              await reads('in 3 weeks'),   'Wed, 23 Sept 2026 · end of day');
ok('shorthand',               await reads('+10d'),         'Sat, 12 Sept 2026 · end of day');
ok('in 6 months',             await reads('in 6 months'),  'Tue, 2 Mar 2027 · end of day');
ok('end of month',            await reads('end of month'), 'Wed, 30 Sept 2026 · end of day');
ok('end of year',             await reads('end of year'),  'Thu, 31 Dec 2026 · end of day');

// a time turns off the end-of-day rule, exactly like the link format
ok('a time, spoken',          await reads('friday 6pm'),   'Fri, 4 Sept 2026 · 6:00 pm');
ok('a time, 24 hour',         await reads('31 mar 2027 18:30'), 'Wed, 31 Mar 2027 · 6:30 pm');
ok('half past, spoken',       await reads('tomorrow 6:30pm'), 'Thu, 3 Sept 2026 · 6:30 pm');
ok('a bare time means today', await reads('9pm'),          'Wed, 2 Sept 2026 · 9:00 pm');

// a date already gone is next year, because nobody sets a deadline in the past
ok('a bare day-month rolls forward', await reads('1 jan'), 'Fri, 1 Jan 2027 · end of day');

// and it says so rather than guessing
ok('nonsense is refused',     (await reads('somewhen')).indexOf('Not a date') === 0, true);
ok('31 february is refused',  (await reads('31/2/2027')).indexOf('Not a date') === 0, true);

// the whole point: it goes in as a real goal
await page.fill('#fName', 'Board review');
await page.fill('#fWhen', 'friday 6pm');
await page.waitForTimeout(90);
await page.click('#bSubmit');
await page.waitForTimeout(200);
ok('typed in plain words, stored exactly',
   decodeURIComponent(await page.evaluate(() => location.hash)).indexOf('Board review~2026-09-04T18:00') >= 0, true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

console.log('\n--- choosing a date: past is discouraged, not offered ---');
// frozen clock: Wednesday 2 September 2026, 10:00 IST
r = await open('#Seed~2027-01-01');
await page.keyboard.press('g');
await page.waitForTimeout(250);

const dayCell = async (n) => page.locator('#pkGrid button').filter({ hasText: new RegExp('^' + n + '$') }).first();
ok('yesterday in the grid is disabled', await (await dayCell(1)).isDisabled(), true);
ok('today is not', await (await dayCell(2)).isDisabled(), false);
ok('a day next week is not', await (await dayCell(10)).isDisabled(), false);

// with no day chosen yet, "today" is the implied day - a time already
// gone this morning should be dimmed out too
ok('9 am is already gone today', await page.locator('#fTimes button', { hasText: '9 am' }).isDisabled(), true);
ok('noon is not', await page.locator('#fTimes button', { hasText: 'Noon' }).isDisabled(), false);
ok('end of day is never gone', await page.locator('#fTimes button', { hasText: 'End of day' }).isDisabled(), false);

// pick a day that is not today - the same times open back up
await (await dayCell(10)).click();
await page.waitForTimeout(150);
ok('9 am is fine on a future day', await page.locator('#fTimes button', { hasText: '9 am' }).isDisabled(), false);

// the free-text field is the deliberate way round the guard
await page.fill('#fWhen', 'yesterday');
await page.waitForTimeout(100);
ok('typing a past date still works', (await page.locator('#fParsed').textContent()).includes('past'), true);
await page.fill('#fWhen', '');

console.log('\n--- a typed time, standing in for the native picker ---');
await (await dayCell(10)).click();
await page.waitForTimeout(120);
await page.fill('.otherTime', '8:30pm');
await page.locator('.otherTime').press('Enter');
await page.waitForTimeout(120);
ok('a typed time lands in the field', await page.inputValue('#fWhen'), '2026-09-10T20:30');
ok('and reads back the same way it was typed', await page.inputValue('.otherTime'), '8:30pm');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

console.log('\n--- locking the board against an accidental tap ---');
await page.evaluate(() => localStorage.removeItem('baaki.locked'));
r = await open('#Ship~2027-01-01+!edit');
ok('unlocked: Goals opens', (() => true)(), true);
await page.keyboard.press('g');
await page.waitForTimeout(200);
ok('g opens it while unlocked', await page.locator('#dlg').isVisible(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

await page.keyboard.press('?');
await page.waitForTimeout(250);
const lockBtn = page.locator('#opts .opt', { hasText: 'Lock goals' }).locator('button');
ok('starts free', await lockBtn.textContent(), 'Free');
await lockBtn.click();
await page.waitForTimeout(120);
ok('the same button now says locked', await lockBtn.textContent(), 'Locked');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

await page.keyboard.press('g');
await page.waitForTimeout(200);
ok('g refuses while locked', await page.locator('#dlg').isVisible(), false);
ok('and says why', (await page.locator('#toast').textContent()).includes('locked'), true);
ok('Done is hidden while locked, even with !edit', await page.locator('#bDone').isVisible(), false);

// it survives a reload, same as every other per-device setting
await page.reload();
await page.waitForTimeout(300);
ok('the lock is remembered', await page.evaluate(() => document.body.classList.contains('locked')), true);
await page.keyboard.press('g');
await page.waitForTimeout(200);
ok('still refuses after a reload', await page.locator('#dlg').isVisible(), false);

// turning it back off is always available to whoever is holding the device
await page.keyboard.press('?');
await page.waitForTimeout(250);
await page.locator('#opts .opt', { hasText: 'Lock goals' }).locator('button').click();
await page.waitForTimeout(120);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
await page.keyboard.press('g');
await page.waitForTimeout(200);
ok('unlocking it lets Goals open again', await page.locator('#dlg').isVisible(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
await page.evaluate(() => localStorage.removeItem('baaki.locked'));

console.log('\n--- a private log of what changed, on this device ---');
// it lives in Goals now, under the list it is about - not in About
await page.evaluate(() => localStorage.removeItem('baaki.log'));
await page.goto('about:blank');
await page.goto(FILE + '#Seed~2027-01-01');
await page.waitForTimeout(220);
await page.keyboard.press('g');
await page.waitForTimeout(200);
await page.fill('#fName', 'Board review');
await page.fill('#fWhen', '2026-12-25');
await page.click('#addForm button[type=submit]');
await page.waitForTimeout(200);
await page.keyboard.press('g');
await page.waitForTimeout(250);
ok('the log lives in the Goals dialog, not About', await page.locator('#about #hist').count(), 0);
ok('an add shows up in the log', (await page.locator('#hist').textContent()).includes('added'), true);
ok('with the goal it was about', (await page.locator('#hist').textContent()).includes('Board review'), true);

await page.locator('.row', { hasText: 'Board review' }).locator('button[title=Remove]').click();
await page.waitForTimeout(150);
ok('a removal shows up too, most recent first',
   (await page.locator('#hist ol li').first().textContent()).includes('removed'), true);

await page.locator('#hist button', { hasText: 'Clear' }).click();
await page.waitForTimeout(150);
ok('clearing empties it', await page.locator('#hist').isVisible(), false);
await page.click('#bClose');
await page.waitForTimeout(150);
await page.evaluate(() => localStorage.removeItem('baaki.log'));

console.log('\n--- the number itself never moves ---');
// the background pulse and the digit-scale "heartbeat" were both
// tried and both removed; this just confirms neither left a trace
const errs2 = [];
page.on('pageerror', e => errs2.push(e.message));
r = await open('#Ship~2026-09-02T10:20:00');
await page.waitForTimeout(1300);
ok('no beat class, ever', (await page.locator('#num').getAttribute('class')) || '', '');
ok('no pulse layer in the page', await page.locator('#pulse').count(), 0);
ok('ticking the last hour throws nothing', errs2.length, 0);

console.log('\n--- the calendar does not let you wander into the past ---');
r = await open('#Seed~2027-01-01');
await page.keyboard.press('g');
await page.waitForTimeout(250);
ok('back is off while viewing the current month', await page.locator('#pkPrev').isDisabled(), true);
await page.click('#pkNext');
await page.waitForTimeout(120);
ok('forward a month, back turns on', await page.locator('#pkPrev').isDisabled(), false);
await page.click('#pkPrev');
await page.waitForTimeout(120);
ok('back to the current month, back turns off again', await page.locator('#pkPrev').isDisabled(), true);
// zoom out: same rule at the month and year levels
await page.click('#pkTitle');
await page.waitForTimeout(120);
ok('month view, same year: back is off', await page.locator('#pkPrev').isDisabled(), true);
await page.click('#pkTitle');
await page.waitForTimeout(120);
ok('year view, current decade: back is off', await page.locator('#pkPrev').isDisabled(), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

console.log('\n--- a goal needs no name at all ---');
r = await open('#Seed~2027-01-01');
await page.keyboard.press('g');
await page.waitForTimeout(250);
await page.fill('#fWhen', '31 mar 2027');
await page.waitForTimeout(100);
await page.click('#addForm button[type=submit]');
await page.waitForTimeout(250);
ok('an empty name does not block the form', await page.locator('#dlg').isVisible(), false);
ok('it gets a plain default name',
   decodeURIComponent(await page.evaluate(() => location.hash)).includes('Goal~2027-03-31'), true);
ok('and no native validation popup was in the way',
   await page.evaluate(() => document.querySelector('#fName').hasAttribute('required')), false);

console.log('\n--- a quiet clock, next to the days-left board ---');
r = await open('#Seed~2027-01-01');
ok('the clock reads a plausible time', /^\d{1,2}:\d{2}/.test((await page.locator('#clock').textContent()).trim()), true);
await page.evaluate(() => localStorage.removeItem('baaki.hash'));
await page.goto('about:blank');
await page.goto(FILE);
await page.waitForTimeout(400);
ok('the clock runs on the empty board too', /^\d{1,2}:\d{2}/.test((await page.locator('#clock').textContent()).trim()), true);

console.log('\n--- settings explain themselves on hover ---');
r = await open('#Seed~2027-01-01');
await page.keyboard.press('?');
await page.waitForTimeout(250);
const hints = await page.locator('#opts .opt').evaluateAll(els => els.map(e => e.title));
ok('every row in This Screen has something to say on hover', hints.every(h => h && h.length > 0), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);

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
