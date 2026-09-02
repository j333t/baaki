# Backlog — ideas, not commitments

Nothing here is built. Each line is scored against `rubric.md`.
A **fail** names the test it fails, so we know what would have to change.

---

## Next up (all four tests pass)

| Idea | Note |
|---|---|
| **Theme system** — five font directions (neutral, grotesk, serif, mono, display), pure black / pure white, drop-or-paste a theme file | The big one. Absorbs fonts, colours, motion and shareable customisation into a single primitive. Design settled: three colour anchors per mode, generated ramps, JSON to author and a compact string to travel. **Not before there are users** — it is polish for people who do not exist yet. |
| **Fonts via CDN with system fallback** | Typography degrades gracefully offline. The service worker should cache the font files on first online visit, so after one online open it's identical offline too. Falls out of the theme system; do them together. |
| **`z.` compressed fragment** | `CompressionStream('deflate-raw')`, zero dependency. Only when it's actually shorter — measured, it *loses* below ~200 chars and wins 58% at 12 goals. |

## Built in 1.1.0

Kept for a moment so the reasoning is traceable, then they move to `features.md` and out of here.

Update check · fullscreen · keep the screen awake · size of the number · TV default · rotation lock · tenths in the last ten minutes.

## Per-device (point 15)

Cheap wins first.

| Idea | Score |
|---|---|
| **A sound at zero, if you ask for it** | glance: n/a. cold open: **needs work** — it must be off until someone turns it on, per device, never in the link, or a shared board makes noise in a room it was not invited into. weight: pass (a few lines of WebAudio, no file to ship). one primitive: pass, it extends *this screen*. → **worth building, after the theme system.** Note the earlier "sound on zero" rejection was about a board that makes noise *at* you; a sound you deliberately switch on for the last ten seconds of a launch is a different thing, and the tenths rung is exactly the moment it would land. |
| **QR code for the current link** | pass ×4, ~1 KB with a tiny generator. Genuinely useful for getting a board onto a phone from a projected screen. Cheapest thing left in this file. |
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
