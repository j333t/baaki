# Backlog — ideas, not commitments

Nothing here is built. Each line is scored against `rubric.md`.
A **fail** names the test it fails, so we know what would have to change.

---

## Next up (all four tests pass)

| Idea | Note |
|---|---|
| **Theme system** — five font directions (neutral, grotesk, serif, mono, display), pure black / pure white, drop-or-paste a theme file | The big one. Absorbs fonts, colours, motion and shareable customisation into a single primitive. Design settled: three colour anchors per mode, generated ramps, JSON to author and a compact string to travel. **Not before there are users** — it is polish for people who do not exist yet. |
| **Fonts via CDN with system fallback** | Typography degrades gracefully offline. The service worker should cache the font files on first online visit, so after one online open it's identical offline too. Falls out of the theme system; do them together. |
## Built

Kept for a moment so the reasoning is traceable, then they move to `features.md` and out of here.

**1.1.0** — update check · fullscreen · keep the screen awake · size of the number · TV default · rotation lock · tenths in the last ten minutes.
**1.2.0** — QR code · a sound at zero.

## Measured and rejected

**`z.` compressed fragment.** The note here used to say it "wins 58% at 12 goals". Measured properly,
on boards people actually have, `deflate-raw` + base64url gives:

| goals | long names | short names |
|---|---|---|
| 1 | **loses 10 chars** | loses 10 |
| 2 | **loses 13** | loses 13 |
| 3 | **loses 11** | loses 11 |
| 4 | **loses 2** | loses 11 |
| 5 | wins 6 (4%) | loses 10 |
| 8 | wins 32 (14%) | **loses 3** |

Base64 costs a third more than it saves until there is real repetition to find. With ordinary short
names — Ship, Launch, Beta — it loses at *every* count. It only wins on a board with five or more
long-named goals, and twelve goals is a project plan in disguise, which the snark line already says.
The rule was "only when it's actually shorter". It isn't. **Not built.**

## Per-device (point 15)

Cheap wins first.

| Idea | Score |
|---|---|
| **Gyroscope parallax on the gradient** | glance: pass. weight: pass. **fails "one primitive"** — a whole new input for a decorative effect. Fun though. Revisit if a theme wants it. |
| **Ambient light sensor → auto dark/light** | **fails cold open** — near-zero browser support, would need a fallback anyway. |
| **Android home-screen widget** | **fails weight** — needs a real store app. Out of scope until there's demand. |
| **Lock-screen / wallpaper generator** | **fails weight** (per-OS scripting) but it is the truest form of the Sreedharan idea — a number on a wall you don't even open. Worth revisiting as a separate tiny tool. |

## Sharing and distribution

| Idea | Score |
|---|---|
| **Link shortener on the worker** | **fails weight** — a short link is a pointer, so it needs the network. Fine as an explicitly online convenience, never the default. |
| **Export as PNG** | glance n/a. **fails "one primitive"** unless it reuses the existing canvas. Cheap if it does. |
| **`.ics` calendar export** | **fails one primitive.** Also: if it's in your calendar you don't need a board. |

## Rejected, with reasons

Kept so they stop resurfacing. One line left this table in 1.1.0 — "sound on zero" — because the
rejection was really about a board that makes noise *at* you, not about a sound you choose to switch
on yourself. It is in the per-device table now. A `fail` is a description of today, not a verdict.

| Idea | Why not |
|---|---|
| Per-goal notes / description | Fails glance. Text you must read is the opposite of this tool. |
| Sub-tasks, dependencies, Gantt | It's a board, not a project manager. Two different products. |
| Recurring countdowns | Ambiguous at every edge (what does "done" mean on a repeat?) and nobody asked. |
| Percentage complete / progress ring | A countdown knows time, not work. Any percentage would be a lie. |
| Multiple boards / folders | If you need folders you have too many goals, and there's a snark line for that. |
