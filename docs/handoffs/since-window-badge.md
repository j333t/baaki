# Since / Window / Badge — design discussion, parked mid-way

Started because the shipped 2.0.0 "Since" (fixed-start counter) felt off — a separate
button + quick-chip screen for something that's really just "a date, picked in the past."
Discussion opened up two more threads (a start+end kind, and the growth-loop badge).
Since, Recurring, and Window are all built now (2026-09) — see `docs/features.md`.
Only the badge/growth-loop section remains genuinely open. Read this cold, no prior
chat needed.

## Locked

**1. Since stops being a manual kind-picker — built, tests passing (2026-09).**
No more `kSince` button, no more separate quick-chip screen. Same calendar as Deadline,
just stop disabling past dates. If the date the person picks or types is already in the
past *at creation time*, the `since` flag is set automatically — no manual step.

Why this is safe, not a loss of meaning: overdue (grey, "you missed it", still has a
Done button) and since (warm, "this just runs", no Done button) look identical in the
maths (`now - target`) but mean opposite things. The distinction survives because
*overdue only ever happens by time passing* — a future deadline that expired unmet.
Nobody creates a goal wanting it to instantly read "already blown it," so a past pick
at creation time can safely and always mean since. Never mixed up with overdue.

Birthday example: fits cleanly as an ordinary Since. It counts *up*, forever, no
target — that's the whole point of the kind, not a bug ("count down to what?" — nothing,
it doesn't count down). Not scope creep; Since already generalized Baaki past
"future deadlines only" the day it shipped.

**2. Recurring — green-lit, small version.**
Hand-rolled patterns only: weekly-on-day, monthly-on-date, yearly-on-date. Explicitly
**not** full RRULE (BYSETPOS/EXDATE/COUNT etc. — way more surface than this tool needs,
and `FREQ=WEEKLY;BYDAY=MO` breaks the plain-English voice `parseWhen` already has).
Becomes one of the kinds. Ready to build whenever.

**3. Timezone auto-stamp — no further action.**
Already shipped in 2.0.0: creating device stamps its own zone on the link automatically,
no picker, no toggle. Confirmed: no UI option wanted, keep default-on. Settled.

**4. Window / session kind — fully agreed and fully designed, ready to build.**
Start *and* end, both can be future — e.g. "exam 10am–noon," "boarding opens–gate
closes." Concrete real case, not hypothetical.

Why one kind instead of two ordinary goals (which was the first pushback — two
separate Deadline/Event goals already cover "two moments"): the win is **one preset,
shareable link**. Someone defines start+end well ahead of time, sends *one* link to a
team, and whoever opens it on the day gets the right view automatically — no
coordinating two links, no manual phase-switching.

**Mid-window behaviour, resolved:** leading up to `start`, it renders exactly like a
Something Good goal counting down to `start`. The instant `now >= start`, it switches
*instantly* to rendering like a Deadline counting down to `end`. One number at a time,
never two competing — nothing new to build for the rendering itself, both render paths
already exist; the only new logic is the phase check that picks which target/style
applies.

**Done button, resolved (2026-09):** hidden for the entire pre-`start` phase — it's
rendering as Something Good there, and Something Good never shows Done, not "not yet."
Once `now >= start` the phase flips to Deadline-style counting to `end`, and only then
does Done follow the ordinary deadline rule (shown when not done, not locked, in edit
mode). No new Done logic to write — the existing `el.done.hidden` check
(`baaki.html:1390`) already keys off `g.event`; a window goal just needs to report as
event-like before `start` and deadline-like from `start` on, same branch, no new flag.

Scored 2026-09 in `docs/backlog.md` → Next up: passes all four rubric tests, queued
to build. Design is done; nothing left open here except the actual code.

**Wasted if:** nobody actually presets and shares one of these links ahead of an event
in practice — i.e. real usage turns out to always be "I open it myself right when the
thing starts," in which case two ordinary goals already did the job and the one-link
saving never shows up. Checkable by watching real usage after shipping it, not upfront.

**5. Link storage — scoped, settled.**
Two dates are stored **only** for kinds that genuinely need two (Window). Every other
kind — Deadline, Something Good, Since, Recurring — stays single-date, exactly as
today, zero extra bytes. Explicitly rejected: don't generalize a second-date slot onto
ordinary goals "since we need it for Window anyway" — needing it for one kind doesn't
justify spending it on kinds that don't.

Consequence: the growth-loop fill-bar's need for a "start/created-at" reference point
on an *ordinary* Deadline/Something-good goal (see badge section below) is **not**
solved by this and remains fully open — to be designed specifically as part of the
badge, not smuggled in as a side effect of Window's storage.

**6. Bare dates already store no time, no timezone — verified in code, already true.**
Asked whether the link only pays for a time-of-day when one was actually picked.
Confirmed by reading `fmtLocal`/`goalToken` (baaki.html ~L595-653): `fmtLocal(d, false)`
emits just `YYYY-MM-DD`; `timed = !isEod(g.target)` decides whether a time (and the
`@timezone` suffix) is written at all. A goal set to "end of day" carries neither.
Nothing to change — already the behaviour, already shipped.

## Open — the living badge / growth loop (least settled, discussion paused here)

Not a static image. A live value, rendered wherever someone embeds it — GitHub README,
terminal, handed to a script, an AI agent reaching for it and creating one on the fly.
"We deliver the logic and the data," not a picture.

**Fill-bar visual, if built:** fills *down* for a Deadline (draining, urgency), fills
*up* for Something Good (building toward it, feels wholesome). Agreed, not built.

**Architecture direction (proposed, not locked):** a stateless helper shaped like the
existing optional `sync-worker.js` — takes the *existing* shareable link, decodes state
from the fragment, computes the current value, returns it. Stores nothing of its own,
so the link stays the only source of truth even though a server is involved for this
one optional feature. Keeps invariant 2 intact.

**Resolved:**
- **Which goal a badge shows:** whatever is *currently focused* on the source link —
  not a goal frozen at the moment someone hit "get badge." Verified this is trivial to
  build: `rotate()` (baaki.html ~L1387) reorders `S.goals` and calls `commit(true)`,
  which rewrites the URL hash on every rotation — so "current focus" already just means
  "goal[0] in the link," the same rule the main page itself uses ("first goal is the
  big one"). A stateless badge server decodes the same link fresh on every request and
  reads goal[0] — no separate per-device state to replicate, nothing new to invent.
- **Delivery mechanism is not either/or — it's at least two separate, first-class
  offerings, and they shouldn't be conflated:**
  1. **A rendered image** (SVG/PNG) — for drop-in embeds like a README, where nothing
     but a picture can appear. Only ever as fresh as its last fetch; that's an inherent
     limit of images, not a design choice, and it doesn't need discussing further.
  2. **A pure payload / data-only share** — hands over the goal's data and nothing
     rendered at all. The receiving side (a script, a webpage, an AI agent) owns 100%
     of the display decision — ticking, static, a bar, whatever they build. This is
     its own deliberate offering, not a fallback for "places that can run JS." Whether
     something ticks on screen is entirely the consumer's call, unrelated to which of
     these two modes they picked.
- Where it's surfaced in the UI — likely two options inside the existing Share dialog
  ("get an image" / "get the data"), not fully decided.

**Resolved — what the payload contains:**
Raw fields for every kind (deadline's target, window's start+end, since's flag,
recurring's pattern, name, done — whatever that goal actually is, not just the simple
deadline case), **plus** the computed current rung as structured data — `{value, unit}`
(e.g. `{value:12, unit:"d"}`), never a glued-together string or HTML.

Reasoning that settled it: the only part worth handing over as "logic" is the hard
part — picking which rung applies (days vs hours vs minutes vs seconds), the overdue
mirror flipping sign, Since counting up instead of down. Real duplicated effort if
every consumer had to re-derive Baaki's own thresholds. The final sentence — language,
punctuation, units as words vs superscript letters, any HTML — is presentation, and
that stays the consumer's call entirely, same as "depends on the user how they want
to display it." Raw-only would have made everyone reimplement the hard part; a full
formatted string would have taken away a decision that isn't ours to make.

**Resolved — image mode's visual shape, in principle:** shape follows size, not one
visual forever. The fill-bar only ever solved the favicon case (digits are illegible
at 16×16); a README-width badge has room, so plain digits are fine there — same as
the "simple, obvious, direct" alternative that was asked for. Two renderers, same
structured payload underneath, chosen by the size/shape being requested. Not fully
specified (exact breakpoints, whether other sizes exist) — parked, see below.

**Parked, not abandoned.** No confirmed place this would actually be embedded yet —
"not sure where the badge can be used, or how it will look" is the reason for parking,
not a rejection. Moved to `docs/backlog.md` under "Sharing and distribution" with a
pointer back to this file. Revisit when a real embed context shows up (someone
actually wants it in a specific README/tool/agent), not on a schedule.

**Wasted if:** revisited without a concrete embed context in hand — i.e. building
before there's an actual place it goes, rather than starting from one. Checkable
immediately, not after a month: is there a specific place this would ship to, or not.

## Where to resume

**Since is built and tested** (2026-09) — no button, calendar allows any date, a past
pick on the Deadline kind sets `since` automatically. `test.mjs`: 250 passed, 0 failed.

**Recurring is built and tested** (2026-09) — three hand-rolled patterns, no RRULE.
Done marks that cycle only and rolls forward once its own due moment arrives, not the
moment you press Done; a miss sits overdue like any other deadline and never
self-advances. `test.mjs`: 259 passed, 0 failed.

**Window is built and tested** (2026-09) — no marker character, a second `~` before
the target is the tell; counts to `start` like something good, then to `target` like
a deadline the instant `start` arrives; Done follows whichever phase is current.
`test.mjs`: 280 passed, 0 failed.

**Badge** is parked in `docs/backlog.md`, not this file's problem anymore unless a
real embed context shows up and it gets pulled back out. It is the only thing left
open in this file.
