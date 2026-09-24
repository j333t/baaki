# Baaki — working notes

**बाकी** — Hindi for *what's remaining*. A deadline board you can send with one link.
One number, big, on a wall. Inspired by E. Sreedharan's site boards on the Delhi Metro.

## The three invariants

Break any of these and it stops being Baaki. Everything else is negotiable.

1. **One file.** `baaki.html` runs from a double-click, with no server, no install, no build step and no network. If a change needs a bundler, the change is wrong.
2. **The link carries the goal.** State lives in the URL fragment, never on a server. Sending a link sends the countdown. A feature that needs an account is a different product.
3. **Glanceable.** One number, readable in one second, from across a room. Everything else earns its place or hides behind a key.

## Before you add anything

Run it through `docs/rubric.md`. Four tests, all must pass. If you skip this, the file grows to 400 KB and nobody uses it — which is the only way this thing dies.

Log what you built and *why* in `docs/features.md`. The why is the part that matters; in a year the code will be obvious and the reason will not.

## Layout

```
baaki.html          the product. everything is in here.
index.html          3-line redirect, hosting entry point only
sw.js               offline cache for the hosted copy
manifest.webmanifest  add-to-home-screen
sync-worker.js      optional Cloudflare worker for online "Done"
og-worker.mjs       optional Cloudflare worker for chat-app preview cards
og-card.mjs         draws og.jpg from the real page's own colour ramp
og.jpg              the static preview card. generated - `npm run build:card`
desktop/            Tauri wrapper. wraps baaki.html unmodified.
test.mjs            340 browser checks, frozen clock
USAGE.md            the link grammar, written for a script or an LLM to follow
qr-check.mjs        renders each QR version and reads it back with a real decoder
og-check.mjs        the worker's pure half, frozen clock. `npm run test:og`
live-check.mjs      the hosted copy: redirect, service worker, offline, update path
version.json        200 bytes, so an emailed copy can learn it is old
docs/               rubric, feature ledger, backlog, easter eggs
docs/turn-on-previews.md  plain-language runbook for deploying og-worker.mjs
```

`desktop/dist/index.html` is a generated copy of `baaki.html`. Never edit it.

## Rules of the house

- **Vanilla, ES5-flavoured JS.** No framework, no transpiler, no dependency. It has to run off a USB stick in 2031.
- **The wrapper never edits the page.** Desktop-only chrome is injected from `main.rs`. If you find yourself adding `if (isTauri)` to `baaki.html`, stop.
- **Every colour is generated, not stored.** Ramps interpolate between anchors. Do not paste 36 hex values anywhere.
- **A ramp colour is a background until it clears a contrast floor.** The ramps were drawn
  to sit *behind* white text, so their dark end is allowed to be nearly black. Black and
  white surfaces paint the number with them instead, and both ends have to be pushed into
  a legible band first - on perceived brightness, not a channel average, because green
  reads far brighter than blue at the same number. And any render path that returns early
  must still call `setAccent`: unset accents fall back to `currentColor`, which on those
  two surfaces is `transparent`, and the digits vanish rather than dim.
- **Arrival motion is the one exception to "the number never moves", and only while it
  ends.** The front door counts in from 365 once, on first paint. A scale animation
  (1.4.0) and a background pulse (1.5.0) were removed for breaking that rule; both were
  permanent and tied to urgency. Anything that loses the "ends and does not return"
  property belongs with them.
- **Animate off the frame's timestamp, never `Date.now()`.** A wall clock held still - a
  machine waking from sleep, or `page.clock.setFixedTime` in the suite - leaves a
  `Date.now()` loop stuck on its first frame forever.
- **Plain words, always.** Say what happened: "Link to Baaki copied", not "Empty board
  link copied"; "Read about him", not "Worth ten minutes". If a string sounds like it was
  enjoyed while being written, rewrite it.
- **The scale comes off `--room`, not the raw viewport.** `vmin`/`vmax` know nothing about
  the bar, the notch, or mobile browser chrome that collapses on scroll. `--room` is the
  viewport minus the furniture, in `dvh` — never `vh`, which on a phone measures a
  viewport the browser is not currently using.
- **`--bar-h` and `body`'s bottom padding are the same fact stated twice.** The bar is
  fixed; without the padding the board centres over the full height and its bottom sits
  under the buttons. Change one and you must change the other.
- **Layout breakpoints are on *height*.** Every responsive convention keys on width,
  because most pages are columns of text. This is one enormous number, and what kills it
  is running out of vertical room — a rotated phone and a short desktop window fail
  identically, and no width query catches either. Board mode is `max-height:520px`.
- **The bar is one row. Always.** It wrapped once, which silently doubled its height and
  put the toast on top of the buttons. On a small screen the answer is *fewer buttons*,
  not smaller ones — anything that is set once and left belongs under `?`.
- **Done never moves under a thumb.** It is the only control that changes something you
  cannot casually undo. Anything that reflows the bar must reflow around it.
- **Ask what the input is, never what the device is.** `coarse()` is the one question;
  a touchscreen laptop and a phone want the same bar. A tip telling you to press F on a
  device with no F is a bug.
- **CSS cannot count digits, so it is told.** `--hero-em` is written from JS when the hero
  changes - "3", "171" and "8h:30m" are three very different widths at one font-size.
  Written on change only, never on the beat.
- **No fixed pixel measurements.** Everything comes off `--u` and `--ft`, which come off the viewport, and every step is a power of phi (spacing) or 1.25 (type). A raw `px` in a new rule is a bug unless it is a hairline.
- **Dialog content gets its own scale - buttons do not.** `.dlg` re-declares `--u`/`--f0`/`--f1`/`--f2` with much gentler clamps than root, for text and spacing only. `--h` (button height) is a single root-level variable, deliberately not re-declared in `.dlg`, so a calmer content scale can never drag a button down to an untappable size. Calendar cells and nav arrows get their own smaller floor instead, via `max(Npx, calc(var(--u)*k))` using the dialog's local `--u` - denser grid, smaller floor, still scaled to content rather than jumping to room-scale.
- **Both dialogs are single-column, on purpose.** Two columns were tried twice (1.4.0, 1.5.0 tuning) and looked considered on paper but left dead space under whichever side was shorter, every time. Do not reintroduce a grid split without a real fix for that.
- **No webfonts, ever.** Five faces, all system stacks. The file must look like itself on a plane.
- **A preview is a snapshot, not a clock.** Chat apps fetch a card once per URL and cache
  it on their own CDN for weeks. Anything on it must survive being days out of date:
  whole days, or "Today"/"Tomorrow", never a running time, and always the target date
  beside the number so a stale card corrects itself. Anything finer is a lie by the time
  it is seen.
- **`OG_HOST` and `SYNC_URL` are both empty and both mean "not deployed".** A feature
  whose endpoint is not up must change nothing: Share keeps giving out the private link,
  and the preview setting is not even drawn. A switch for something that is not running
  teaches people the wrong thing about what this tool does.
- **Nothing about the look travels in the link.** Surface, typeface, hue, size, sound: `localStorage` or nothing. Sending somebody a date must not restyle their screen.
- **Tests are the spec.** `node test.mjs` uses a frozen clock and a real browser. Add a case for anything with a date boundary in it — that is where every bug so far has lived.
- **Dates are local, always.** `new Date('2027-01-01')` parses as UTC and is a trap. Use `parseLocal`.
- **Per-device settings never touch the link.** Size, fullscreen, keep-awake, rotation: `localStorage` or nothing. If a setting can ride in a shared link it can change somebody else's screen, and that is a different product.
- **Everything runs on the one-second beat.** `render()` fires from a plain `setInterval`, once a second - no `requestAnimationFrame` fast path any more (that existed only for the tenths rung, removed in 1.6.0). Don't reintroduce a sub-second render loop without a real reason; the last one added complexity a feature it served no longer exists to justify.
- **Never trust a QR by eye.** Run `npm run test:qr`. Versions 1–6 looked perfect while every code from v7 up was unreadable; only a decoder catches that.
- **Nothing makes a sound until the page has been touched.** Sound is on by default and that is only safe because of this rule; it is enforced in `beep()`, not left to browser autoplay policy. Per device, never in the link.
- **Confetti is for finishing, never for the clock running out.** A deadline crossing zero unmarked is a miss. Only Done, and something good arriving, may celebrate.
- **The number itself never moves.** It is the one thing on screen that has to stay still to be read at a glance. Two different "urgency" effects were tried against this rule and both were removed: a scale animation on the digits (1.4.0), and a background glow pulsing behind them (1.5.0). Any future idea in this direction should go in sound, or nowhere, not in a transform or opacity tied to `#num` or its container. See `docs/backlog.md` → Rejected, with reasons.
- **A script that fails partway saves nothing.** `_edit.py`'s `Doc.rep()` calls `sys.exit()` on a mismatch, which skips `Doc.done()` - every edit already applied in that run, in memory, is lost, even the ones that printed "ok". Always check for the `--- N edits ---` trailer, not just the "ok" lines, before trusting a run landed.
- **The fast path repaints everything when the rung changes**, or the colour and the tag land a second after the number does.
- **Watch out for `display` beating `[hidden]`.** `button.b` and `.hist` both did this before being caught - a class rule that sets `display` on an element also toggled via `.hidden` silently wins over the browser's own `[hidden]{display:none}`. Any new class like that needs `[hidden]{display:none}` written in beside it, and a test that actually checks `isVisible()` after hiding it, not just after showing it.
- **A media query does not outrank a later plain rule.** Equal specificity, later wins. Scope
  responsive overrides with an ID. This has now caught two people twice: `#dots` was
  declared `display:none` *after* the board-mode query that sets it to `flex`, so the
  pager never appeared. Written `body #dots{display:flex}`, order stops mattering.
- **No magic colour assertions in tests.** Compare behaviour (deadline vs event) rather than an interpolated hex, or the test breaks every time a ramp is nudged.

## The link format

```
#Name~TARGET[*][!DONE] + Name~TARGET + !edit
?b=Name~TARGET+Name~TARGET          the same thing, where a crawler can read it
```

`~` name/date · `+` between goals · `*` something good rather than a deadline ·
`!DONE` completion stamp · `!edit` shows the Done button.

The two-date kind is called **Scheduled** on screen and `window` in the code - deliberately,
and the two are not going to be reconciled. The link format never names the kind at all (a
second `~` is the whole tell), so renaming the label cost nothing and renaming `winStart`
through the parser, `effGoal` and every render path would cost a lot for no reader.

First goal is the big one. Focus **rotates** the list — never promote-to-front, or "previous" stops being the inverse of "next".

`?b=` holds exactly what would follow the `#`. One grammar, one parser. A `?b=` link
rewrites itself to the `#` form on arrival — it is for sending, not for keeping. **Never
read it with `URLSearchParams`**: form-decoding turns `+` into a space *and* the `%20`
inside `Board%20exam` into one too, after which every goal with a space in its name
splits in two. Read the raw query, both in the page and in the worker.

## Things deliberately not done

- No accounts, no login, no backend for the core loop.
- No plugin API. Themes are data; that is the whole extension surface.
- No bundled webfonts by default — CDN with a system fallback, so offline still works.
- No workday/holiday counting. It needs a country calendar that rots every year.
- No per-link card *image* yet. The worker rewrites the preview's title and description,
  which is most of the value and needs no build step. A per-link image needs a wasm
  rasteriser because chat apps refuse SVG as `og:image` — marked in `og-worker.mjs`, not
  blocking anything.
- No compressed (`z.`) fragment. Measured: base64 costs more than deflate saves until a board has five or more long-named goals, and it loses at every count with ordinary short names. Numbers are in `backlog.md`.
