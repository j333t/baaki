# Baaki · बाकी

*What's remaining.*

**[Open it](https://j333t.github.io/baaki/)** · [how to use it](USAGE.md) · [download](https://github.com/j333t/baaki/releases/latest)

One number, big, in the spirit of E. Sreedharan's site boards on the Delhi Metro — a board in every office showing the days left, that everyone walked past.

A date you keep *not* looking at is a date you miss. Put one number where you already look, and you stop needing to be reminded.

**The goal lives in the link.** Send the link, and the countdown goes with it. No server, no accounts, no sync — because a deadline has no state. It is just *target date minus now*.

```
baaki.html#Metro%20Phase%202~2027-11-03
```

---

## The two ways to run it

| | What it is | Gets you |
|---|---|---|
| **baaki.html** | One file, 118 KB, no install | Every OS, every phone, works with the wifi off. Pin the tab — the title reads `D-427 · Metro Phase 2` even when you're not looking. |
| **desktop wrapper** | A small app around the same file | Floats above your other windows, starts with the machine, comes back where you left it. Desktop only. |

Start with the file. Add the wrapper for whoever wants a window that won't get buried.

---

## The link format

```
#Name~TARGET[*][!DONE]  +  Name~TARGET  +  !edit
```

- `~` splits name from date, `+` splits goals.
- Date is `2027-11-03` or `2027-11-03T18:30`, always local. **A bare date means the end of that day.**
- `*` marks **something good** rather than a deadline.
- `!edit` shows the Done button. Your own link keeps it; **Share** strips it, so viewers don't get a button that does nothing. Tidiness, not security — the file is on their machine.
- First goal is the big one. Move focus and the link rewrites to match. **The link you copy is always the view you're looking at.**

```
baaki.html#Launch~2027-03-31+Diwali~2026-11-08*+Trials~2026-12-01
```

---

## What it shows, and when

**Show a unit only when you'd make a decision in that unit.**

| Time left | Big | Ticks |
|---|---|---|
| More than a day | `427` days, with `1 yr 2 mo · 3 Nov 2027` under it | once a day |
| The target day | `8:30` hours : minutes | once a minute |
| The last hour | `40:00` minutes : seconds | once a second |
| First hour over | `+40:00` grey | once a second |
| First day over | `+8:30` grey | once a minute |
| After that | `+6` days over | once a day |

It only ever gets finer, never coarser. Seconds appear in the last hour and nowhere else — that's the only hour where a second changes what you do. A tenths-of-a-second rung lived here for a few versions and was removed: it read as clutter competing with the one number this tool exists to make readable at a glance, not as urgency.

**Two kinds of goal.** A **deadline** cools from indigo to hot red as it nears, then greys out and keeps counting once you've missed it. **Something good** (`*`) climbs from violet to hot pink, celebrates when it arrives, and *stops* — because "3 days since Diwali" is not a thing anyone wants. The two hues are far enough apart to tell at a glance from across a room.

**A missed deadline does not celebrate.** Crossing zero unmarked is a *miss* — the clock can't know whether you finished, which is the whole reason the Done button exists. It goes grey and says "past due". Press Done and you get one of three: early, on time, or late, each its own colour, each saying **how** early or late.

**Colour carries the distance.** It drifts so slowly you never catch it moving, but one glance tells you where you stand before you read the number. The angle drifts too, ±10° over 90 seconds — alive, never distracting.

Days are **calendar days**. No workday or holiday rules: those need a country-specific calendar that rots every year, and this file is meant to never need maintenance.

---

## Keys

`← →` or `Tab` cycle goals · `1`–`9` jump · `G` goals · `S` share · `Q` a code to scan · `D` done · `T` surface · `Y` typeface · `F` fullscreen · `W` keep the screen awake · `M` sound · `H` shift the hue · `+` `−` `0` size of the number · `?` about · `Esc` close. Swipe left/right on touch.

Full guide, including how to generate a board link from a script or an LLM: **[USAGE.md](USAGE.md)**.

---

## Choosing when

**A calendar you tap.** The title zooms out — days → months → years — so any date, however far away, is three taps. A quick row above it for the answers you usually want; a small text field for a time that isn't one of the presets, e.g. `8:30pm` — no native spinner widget.

**A date already gone is disabled in the grid, not just dim.** This tool only ever counts forward, so a stray tap shouldn't be able to create a deadline in the past. It's still there for context — a calendar with holes in it looks broken — it just doesn't respond.

**Typing is the deliberate way round that.** It steers the calendar rather than living beside it, and it *will* accept a past date if you mean it:

```
friday 6pm        31 mar 2027       in 3 weeks
tomorrow          yesterday         +10d
31/3/27           march 31          10m   ← ten minutes; months need "mo"
```

It says back what it understood — *Fri, 4 Sept 2026 · 6:00 pm* — so nothing is a guess, and refuses rather than inventing: `31/2/2027` is not a date. A bare date means the end of that day, so typing and pasting a link agree.

---

## Sharing it

`S` copies the goal you're looking at, straight to the clipboard, immediately — no menu in the way for the common case. Beside it sits a small family of related moves, all one connected pill rather than separate buttons scattered around: **All *n*** copies every goal as one link; **Code** draws a QR of this link; **No goal** hands someone the bare tool with nothing on it. They only appear when relevant — one goal, and "All" doesn't show.

## Getting it off the wall

`Q` opens the same QR code directly, for muscle memory — it's also one of Share's segments above. A board on a projector is useless until the link is in somebody's hand, and nobody types a URL off a screen.

It's always dark on light, in both themes — a code is not decoration, it either scans or it wastes someone's time. It covers about 270 characters, which is a board with six or seven goals on it; past that it says the board is too long rather than drawing something a camera can't read.

The encoder is checked by a **real decoder**, not by eye: `npm run test:qr` renders each version and reads it back with `jsqr`. That's not ceremony — codes for versions 1 to 6 looked perfect while every code from version 7 up was unreadable, and nothing but a decoder would have told you.

---

## This screen

Things about the screen you're standing at, not about the goal — so **none of them travel in the link**. Sharing a board must never reach across and change somebody else's display. They live under `?`, in a panel called *This screen*.

| | |
|---|---|
| **Fullscreen** (`F`) | One key turns any old laptop into a wall board. |
| **Keep the screen awake** (`W`) | For a phone propped on a desk. Deliberately **not** remembered between visits — a setting that outlives the sitting is how a battery dies next week and nobody knows why. |
| **Size of the number** (`+` `−` `0`) | Scales the hero only; the supporting lines stay put. Remembered per device. A big screen with nothing to point at is a wall, not a desk, so it starts bigger there on its own. |
| **Sound** (`M`) | Ten ticks and a chime for the last ten seconds. **On by default, and safe to be:** a page nobody has touched never makes a sound, so a link someone sent you can't go off in a meeting. Once you've clicked or typed on it, you're using it. |
| **Hue** (`H`, `Shift+H` back) | Everything else about the colour encodes distance and isn't negotiable. Which end of the spectrum it sits at isn't information, so it's yours, in 5° steps. **Auto colour change** turns the slow wander on. |
| **Surface** (`T`) | Dark, light, **pure black**, **pure white**. The flat ones move the colour off the background and into the number — most of an OLED panel switched off, and the distance signal intact. |
| **Typeface** (`Y`) | Neutral, grotesk, serif, mono, display. All from fonts your machine already has: a webfont would be a network dependency in a file whose whole promise is that it needs nothing. |
| **Lock rotation** | Phones. The browser API only works fullscreen or installed, so the control only appears when it can actually do something — a dead toggle is worse than no toggle. |
| **Lock goals** | Not a permission system — there's no server, so permission would be theatre. A guard against your own thumb on a kiosk or a wall display: Goals won't open and Done won't fire until you switch it back off, which you can do any time, on your own device. |

Anything switched on is **lit in the bottom bar**, and that's where you switch it off. Keep-awake only appears there while it's actually holding the screen open. Hover any row above for a plain-language line on what it does.

A private, per-device **change log** — what got added, edited, removed, or marked done, and when — lives in the Goals dialog, under the list it's about. It never leaves the browser and never rides in a link; it exists because the link tells you what a goal *is*, not what happened to it.

---

## Done, and the three celebrations

A countdown cannot know you finished — it only knows time passed. So there's a **Done** button. Press it early and you get the big celebration; on time, the full one; late, a quiet one.

Two ways it reaches other people:

1. **The deadline itself.** Every clock already agrees on when 3 Nov 2027 arrives, so at zero every open copy celebrates at the same moment. Free, offline, no server. That shared agreement is the only free sync channel an offline tool has.
2. **Pressing Done.** Early and late can't be derived by a viewer, so a human carries the news — press it and a link with the moment baked in lands on your clipboard. One paste is the price of no server.

**Optional: make Done travel by itself when online.** `sync-worker.js` is ~25 lines on Cloudflare's free tier, storing nothing but a hash and a timestamp. Put its URL in `SYNC_URL` near the top of `baaki.html` and the paste step goes away when there's a connection. Offline, the link still carries it.

---

## Hosting it (optional — this is what makes a *link* work offline)

Push this folder to a GitHub repo and turn on Pages.

- The link works for anyone, no download.
- `sw.js` caches it on first open, so it works with the network off from then on. **Bump `CACHE` in `sw.js` on every release** or the old copy sticks.
- On a phone, **Add to Home Screen** gives a full-screen icon with no browser bars.

### Telling old copies they're old

A file you emailed cannot be recalled, so `version.json` sits next to the page — about 200 bytes:

```json
{ "version": "1.1.0", "url": "https://j333t.github.io/baaki/" }
```

Every copy checks it once per open, **only when online**, and only ever puts a quiet dot on the `?` button with one line inside the panel. It never nags, never blocks, and says nothing at all when offline or when the host doesn't answer. `UPDATE_URLS` near the top of `baaki.html` lists two candidates, tried in order — a host that won't send CORS headers is silently useless to a file opened from a disk.

Analytics: put a GA4 id in `GA_ID`. Online only. It counts *opens of the hosted link* — not downloaded files, not whether anyone kept using it. For a team of ten that's close to noise.

---

## Building the desktop wrappers

Each platform must be compiled on that platform. `.github/workflows/build.yml` does all four on GitHub's machines when you push a tag, then publishes them to a **GitHub Release** — the path that needs nothing installed locally.

The release step matters on its own: a workflow artifact expires after 90 days and needs a GitHub login to reach, so a build that only ever becomes an artifact is a build nobody can have.

```bash
git tag v1.3.0 && git push origin v1.3.0
```

```bash
cd desktop && npx tauri build     # this OS only
```

- **Windows needs the Windows SDK**, separate from Visual Studio itself. Without it: `LNK1181: cannot open input file kernel32.lib`. Tick **Desktop development with C++** in the VS Installer (a few GB), or just use CI.
- **Run it from PowerShell, not Git Bash.** Git Bash puts its own `link` (coreutils) ahead of MSVC's `link.exe` and fails with a confusing `extra operand` error.
- **Unsigned builds get warned about.** macOS: right-click → Open, once. Windows SmartScreen: More info → Run anyway.
- **Phones can't have a floating window.** Android and iOS cap out at the home-screen icon, which the HTML already gives you.

The wrapper injects its own drag strip and pin/close buttons, so `baaki.html` is never modified and behaves identically in a browser.

---

## Tests

```bash
npm install && npx playwright install chromium --only-shell
npm test          # 222 checks in a real browser, frozen clock
npm run test:qr   #   9 codes rendered and read back with a real decoder
npm run test:live #   8 checks against the hosted copy, including offline
```

`test.mjs` runs against a frozen clock: every rung of the ladder in both directions and its boundaries, both goal kinds, pressing Done for real, editing and adding goals, keyboard navigation, the past-date guard in the calendar, locking and unlocking the board, the on-device history log, dialog centring and outside-click, chip capping and snark, link round-tripping with `+ ~ ! %` in names, junk hashes, the per-device controls staying out of the link, the update check in all three states (newer / same / dead host), reduced motion, the QR dialog refusing a board that's too long, and the whole thing with the network off. Screenshots land in `shots/`.

`qr-check.mjs` is separate because it needs `jsqr` to decode what the page drew. The product file has no dependencies and never will; the test harness is allowed one.

---

## Working on it

Read `CLAUDE.md` first — three invariants, break any and it stops being Baaki.
Every idea goes through `docs/rubric.md` before it gets built. `docs/features.md` records *why* each feature exists; `docs/backlog.md` and `docs/easter-eggs.md` hold what's next and what's deliberately not.

---

Free, and always will be. If it's useful, go read about [E. Sreedharan](https://en.wikipedia.org/wiki/E._Sreedharan) — he's worth the ten minutes.
