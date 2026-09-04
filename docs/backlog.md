# Backlog — ideas, not commitments

Nothing here is built. Each line is scored against `rubric.md`.
A **fail** names the test it fails, so we know what would have to change.

---

## Next up (all four tests pass)

Nothing queued right now. The theme system was the last big item here; it shipped in
1.4.0. **Fonts via CDN with system fallback** was filed alongside it and never built —
1.4.0 committed instead to "no webfont, ever" (`CLAUDE.md`), so a CDN font would now
break a house rule rather than extend one. Moved below, not built, for that reason.

## Built

Kept for a moment so the reasoning is traceable, then they move to `features.md` and out of here.

**1.1.0** — update check · fullscreen · keep the screen awake · size of the number · TV default · rotation lock · tenths in the last ten minutes.
**1.2.0** — QR code · a sound at zero.
**1.3.0** — plain-words date field · hue control · three-tier Done colour · Done delta · live empty board · share-this-one-first · About panel legibility, and six behaviour bugs.
**1.4.0** — viewport-derived geometric scale · theme system (4 surfaces, 5 faces) · tactile calendar · heartbeat rhythm · burn-in wander · rebuilt tool bar with live indicators · USAGE.md.
**1.5.0** — a tamer scale for dialog content · a typed time field, replacing the native picker · past dates disabled in the calendar · lock goals · a private on-device change log · rotating idle tips · share simplified to one job · the number's own bounce replaced with a synced background pulse.
**1.6.0** — a correction pass on 1.5.0: tenths removed outright, the background pulse removed outright, both dialogs back to a single column, buttons floored to a real tap target regardless of a dialog's content scale, share rebuilt as a segmented family instead of text links, the QR icon folded into it, the calendar's back arrow stops at today, an optional name field, tips that rotate on their own, hover explanations on every setting, and a quiet always-on clock.

## Deliberately not built

**Fonts via CDN.** Was filed as the natural next step after the theme system. It
conflicts with a rule 1.4.0 adopted while building that system: no webfont, ever, five
system-stack faces only. A file whose whole promise is that it needs nothing should
not open a network connection to look like itself. Revisit only if that rule itself is
ever revisited.

## Deliberately not built, from the theme design

**A theme that travels in the link.** The original sketch had a compact theme string in
the fragment. It is not built, and the reason is a rule the rest of the file already
follows: sending somebody a date must not restyle their screen. Hue, size, sound,
surface and typeface are all per device for the same reason. If this is ever revisited
it needs to be opt-in on the *receiving* side, which is a different feature.

## Asked for, not built yet

| Idea | Note |
|---|---|
| **Choose the sound** | A short list of tones rather than the one built in, per device. Cheap, and the kind of thing somebody fiddles with once and then loves. The settings surface it belongs in now exists. |
| **Weight budget** | 118 KB. 1.6.0 came in lighter than 1.5.0 - the first round where removing something (tenths, the pulse) outweighed everything added. Worth noting as proof the ceiling question still matters, not as a reason to stop asking it. |

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
| Tenths of a second in the last ten minutes | Built in 1.1.0, removed in 1.6.0. Read as clutter competing with the one number this tool exists to make readable at a glance, not as urgency. If it comes back it needs a genuinely different execution, not a smaller font. |
| A pulsing glow (background or number) tied to the countdown | Tried twice - as a scale animation on the digits in 1.4.0, as a background radial glow in 1.5.0 - and removed both times. The digit version disturbed the one thing that has to stay still to be read at a glance; the glow version still didn't read as organic. The number does not move. Nothing has replaced either attempt. |
