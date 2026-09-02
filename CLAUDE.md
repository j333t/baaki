# Baaki — working notes

**बाकी** — Hindi for *what's remaining*. A deadline board you can email.
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
desktop/            Tauri wrapper. wraps baaki.html unmodified.
test.mjs            152 browser checks, frozen clock
qr-check.mjs        renders each QR version and reads it back with a real decoder
version.json        200 bytes, so an emailed copy can learn it is old
docs/               rubric, feature ledger, backlog, easter eggs
```

`desktop/dist/index.html` is a generated copy of `baaki.html`. Never edit it.

## Rules of the house

- **Vanilla, ES5-flavoured JS.** No framework, no transpiler, no dependency. It has to run off a USB stick in 2031.
- **The wrapper never edits the page.** Desktop-only chrome is injected from `main.rs`. If you find yourself adding `if (isTauri)` to `baaki.html`, stop.
- **Every colour is generated, not stored.** Ramps interpolate between anchors. Do not paste 36 hex values anywhere.
- **Tests are the spec.** `node test.mjs` uses a frozen clock and a real browser. Add a case for anything with a date boundary in it — that is where every bug so far has lived.
- **Dates are local, always.** `new Date('2027-01-01')` parses as UTC and is a trap. Use `parseLocal`.
- **Per-device settings never touch the link.** Size, fullscreen, keep-awake, rotation: `localStorage` or nothing. If a setting can ride in a shared link it can change somebody else's screen, and that is a different product.
- **Only the hero may repaint on a frame.** The tenths run on `requestAnimationFrame`; the gradient, chips, tab title and favicon stay on the one-second beat. A title that flickers ten times a second is unreadable and wakes the OS.
- **Never trust a QR by eye.** Run `npm run test:qr`. Versions 1–6 looked perfect while every code from v7 up was unreadable; only a decoder catches that.
- **Anything that makes noise is off until asked**, per device, never in the link. A shared board must not be able to make a sound in a room it was not invited into.
- **No magic colour assertions in tests.** Compare behaviour (deadline vs event) rather than an interpolated hex, or the test breaks every time a ramp is nudged.

## The link format

```
#Name~TARGET[*][!DONE] + Name~TARGET + !edit
```

`~` name/date · `+` between goals · `*` something good rather than a deadline ·
`!DONE` completion stamp · `!edit` shows the Done button.

First goal is the big one. Focus **rotates** the list — never promote-to-front, or "previous" stops being the inverse of "next".

## Things deliberately not done

- No accounts, no login, no backend for the core loop.
- No plugin API. Themes are data; that is the whole extension surface.
- No bundled webfonts by default — CDN with a system fallback, so offline still works.
- No workday/holiday counting. It needs a country calendar that rots every year.
- No compressed (`z.`) fragment. Measured: base64 costs more than deflate saves until a board has five or more long-named goals, and it loses at every count with ordinary short names. Numbers are in `backlog.md`.
