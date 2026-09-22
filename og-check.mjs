/* The worker can never be run by `node test.mjs` - it lives on
   Cloudflare, not in the page. So its pure half is exported and checked
   here, against a frozen clock, exactly like everything else.

   Run: npm run test:og

   What this cannot check is the deployment: the route, the origin
   binding, and whether a real crawler likes what comes back. That part
   is `live-check.mjs`'s job once OG_HOST is set. */

import { parseBoard, cardText, badgeSvg, inject, daysLeft } from './og-worker.mjs';
import { readFileSync } from 'fs';

const NOW = new Date('2026-09-22T10:00:00Z');
let pass = 0, fail = 0;
const ok = (name, got, want) => {
  const good = String(got) === String(want);
  good ? pass++ : fail++;
  console.log(`${good ? 'PASS' : 'FAIL'}  ${name}\n        got  ${JSON.stringify(got)}${good ? '' : `\n        want ${JSON.stringify(want)}`}`);
};

console.log('--- the half of the grammar a card needs ---');

let g = parseBoard('Board%20exam~2027-03-12');
ok('a name survives its encoding', g[0].name, 'Board exam');
ok('and the date is read whole', [g[0].y, g[0].mo, g[0].d].join('-'), '2027-3-12');

ok('a zone suffix changes no day count',
   parseBoard('Call~2027-03-12T18:00@Asia%2FKolkata')[0].d, 12);
ok('a window reports its end, which is the deadline half',
   parseBoard('Exam~2026-10-12T10:00~2026-10-12T12:00')[0].d, 12);
ok('a done stamp is noticed', parseBoard('Ship~2027-02-01!2027-01-28T10:30')[0].done, true);
ok('something good is still a date', parseBoard('Diwali~2027-11-03*')[0].mo, 11);
ok('a recurring marker does not end up in the date',
   parseBoard('Rent~2026-10-01#m')[0].d, 1);
ok('several goals, in order',
   parseBoard('A~2027-01-01+B~2027-02-02').map(x => x.name).join(','), 'A,B');
ok('a client that mangled the separator into a space is repaired',
   parseBoard('A~2027-01-01 B~2027-02-02').length, 2);
/* The trap: form-decoding turns "+" and "%20" both into spaces, after
   which a two-word goal reads as two goals. The raw value keeps them
   apart, which is why the fetch handler never touches searchParams. */
ok('a name with an encoded space is still one goal',
   parseBoard('Board%20exam~2027-03-12+Goa~2026-12-20').length, 2);
ok('and its name survives whole',
   parseBoard('Board%20exam~2027-03-12+Goa~2026-12-20')[0].name, 'Board exam');
ok('rubbish is skipped rather than thrown', parseBoard('not-a-goal+also~nope').length, 0);
ok('an empty board is empty, not an error', parseBoard('').length, 0);

console.log('\n--- what a chat thread actually shows ---');

const t = b => cardText(parseBoard(b), NOW);
ok('the number is in the title, where the eye lands',
   t('Board%20exam~2027-03-12').title, 'Board exam — 171 days');
ok('and the date sits beside it, so a stale card corrects itself',
   t('Board%20exam~2027-03-12').description.startsWith('12 Mar 2027.'), true);
ok('today is a word, not a zero', t('Talk~2026-09-22').title, 'Talk — Today');
ok('so is tomorrow', t('Talk~2026-09-23').title, 'Talk — Tomorrow');
ok('a date gone by counts up instead', t('Started~2026-09-12').title, 'Started — 10 days ago');
ok('finished is finished, whatever the date says',
   t('Ship~2026-08-01!2026-07-30T10:00').title, 'Ship — Done');
ok('the rest of the board is mentioned, not listed',
   t('A~2027-01-01+B~2027-02-02+C~2027-03-03').description.includes('and 2 more'), true);
ok('a link with no board still says what the tool is',
   t('').title, 'Baaki — a deadline in a link');

/* A preview is cached for days. Nothing in it may be finer than a day. */
const desc = t('Call~2027-03-12T18:30').description + t('Call~2027-03-12T18:30').title;
ok('no running time anywhere on the card', /\d+:\d\d/.test(desc), false);

console.log('\n--- the badge, the one thing that is live elsewhere ---');

const svg = badgeSvg(parseBoard('Launch~2027-03-31'), NOW);
ok('it is an svg', svg.startsWith('<svg'), true);
ok('it says the days', svg.includes('>190d<'), true);
ok('and names the goal', svg.includes('>Launch<'), true);
ok('a name with an angle bracket cannot break out',
   badgeSvg(parseBoard('%3Cscript%3E~2027-01-01'), NOW).includes('<script>'), false);
ok('it carries a title for a screen reader', svg.includes('<title>'), true);

console.log('\n--- rewriting the page it was handed ---');

const page = readFileSync('index.html', 'utf8');
ok('the static card is in the file to begin with',
   page.includes('<meta property="og:title" content="Baaki'), true);
const done = inject(page, cardText(parseBoard('Goa~2026-12-20'), NOW));
ok('the title is replaced, not added twice',
   (done.match(/property="og:title"/g) || []).length, 1);
ok('it now names the goal', done.includes('content="Goa — 89 days"'), true);
ok('the description went with it', done.includes('20 Dec 2026'), true);
ok('the tab title follows too', /<title>Goa — 89 days<\/title>/.test(done), true);
ok('the image tag is untouched, because it is still the static card',
   done.includes('https://baaki.j33t.pro/og.jpg'), true);
ok('a quote in a goal name cannot escape the attribute',
   inject(page, cardText(parseBoard('%22%3E%3Cb%3E~2027-01-01'), NOW)).includes('"><b>'), false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
