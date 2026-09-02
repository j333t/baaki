# Baaki · बाकी

*What's remaining.*

A deadline board you can email. One number, big, in the spirit of E. Sreedharan's site boards on the Delhi Metro — a board in every office showing the days left, that everyone walked past.

**The goal lives in the link.** Send the link, and the countdown goes with it. No server, no accounts, no sync — because a deadline has no state. It is just *target date minus now*.

```
baaki.html#Metro%20Phase%202~2027-11-03
```

---

## The two ways to run it

| | What it is | Gets you |
|---|---|---|
| **baaki.html** | One file, 40 KB, no install | Every OS, every phone, works with the wifi off. Pin the tab — the title reads `D-427 · Metro Phase 2` even when you're not looking. |
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

It only ever gets finer, never coarser. Seconds appear in the last hour and nowhere else — that's the only hour where a second changes what you do.

**Two kinds of goal.** A **deadline** cools from indigo to hot red as it nears, then greys out and keeps counting once you've missed it. **Something good** (`*`) warms from violet to gold, celebrates when it arrives, and *stops* — because "3 days since Diwali" is not a thing anyone wants.

**Colour carries the distance.** It drifts so slowly you never catch it moving, but one glance tells you where you stand before you read the number. The angle drifts too, ±10° over 90 seconds — alive, never distracting.

Days are **calendar days**. No workday or holiday rules: those need a country-specific calendar that rots every year, and this file is meant to never need maintenance.

---

## Keys

`← →` or `Tab` cycle goals · `1`–`9` jump · `G` goals · `S` share · `D` done · `T` light/dark · `?` about · `Esc` close. Swipe left/right on touch.

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
- `sw.js` caches it on first open, so it works with the network off from then on.
- On a phone, **Add to Home Screen** gives a full-screen icon with no browser bars.

Analytics: put a GA4 id in `GA_ID`. Online only. It counts *opens of the hosted link* — not downloaded files, not whether anyone kept using it. For a team of ten that's close to noise.

---

## Building the desktop wrappers

Each platform must be compiled on that platform. `.github/workflows/build.yml` does all four on GitHub's machines when you push a tag — the path that needs nothing installed locally.

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
npm install && npx playwright install chromium --only-shell && node test.mjs
```

103 checks in a real browser against a frozen clock: every rung of the ladder in both directions and its boundaries, both goal kinds, pressing Done for real, editing and adding goals, keyboard navigation, share-one-vs-all, dialog centring and outside-click, chip capping and snark, link round-tripping with `+ ~ ! %` in names, junk hashes, and the whole thing with the network off. Screenshots land in `shots/`.

---

## Working on it

Read `CLAUDE.md` first — three invariants, break any and it stops being Baaki.
Every idea goes through `docs/rubric.md` before it gets built. `docs/features.md` records *why* each feature exists; `docs/backlog.md` and `docs/easter-eggs.md` hold what's next and what's deliberately not.

---

Free, and always will be. If it's useful, go read about [E. Sreedharan](https://en.wikipedia.org/wiki/E._Sreedharan) — he's worth the ten minutes.
