# Every feature, and why it exists

The *why* is the point. In a year the code will be obvious and the reason will not.
One row per feature. New rows go at the bottom of their section.

Legend: **★** = load-bearing, removing it changes what Baaki is.

---

## The number

| Feature | Why it exists |
|---|---|
| ★ One big number | Sreedharan's boards had one number. Two numbers is a dashboard, and nobody walks past a dashboard. |
| ★ Calendar days as the hero unit | "428 days" hits harder than "1.2 years". Days are the unit a project actually feels. |
| ★ The ladder: days → H:MM → M:SS | Show a unit only when you'd make a decision in it. Seconds appear in the last hour and nowhere else, because that is the only hour a second changes anything. |
| Ladder only ever gets finer | A unit that appears and disappears makes you re-read the screen. One-way is legible. |
| Switch at local midnight, not at the target's clock time | "It's today" is a human fact, not an arithmetic one. Bare dates mean end-of-day so the day you're given is the day you get. |
| Mirrored overdue ladder (`+M:SS` → `+H:MM` → `+N days`) | The ramp was smooth going down and fell off a cliff going up. Being late is information too, and it deserves the same resolution. |
| Tenths in the last ten minutes | The one rung that is not a decision unit. The ramp went flat at the end — `3:00` and `0:03` ticked with the same texture — so the closing minutes felt no different from the opening ones. Now it visibly accelerates into zero. |
| The tenths are small and dim | So the seconds stay the number you read. A decimal at full weight makes you re-read the screen, which is the opposite of a glance. |
| Reduced motion removes the rung entirely | Slowing a 10 Hz digit down would just look broken. Someone who asked for less motion should get the plain seconds, not a compromise. |
| The tab and the favicon stay on whole seconds | A title changing ten times a second is unreadable, and it wakes the OS for nothing. |
| Chips never carry tenths | Seven of them ticking at 10 Hz is a slot machine, not a board. |
| Human span underneath (`1 yr 2 mo`) | 427 is motivating but not plannable. The second line makes it plannable without stealing the glance. |
| Span hidden under a month | It would just repeat the hero number. Redundancy is noise. |
| Tab title shows `D-427 · Name` | The cheapest "always visible" there is. Works on every OS, costs nothing, needs no install. |
| Favicon draws the number | Same reason, for people who keep the tab pinned and narrow. |

## Colour

| Feature | Why it exists |
|---|---|
| ★ Gradient encodes distance | You know where you stand before you read the number. Colour is the pre-attentive channel; the digits are the confirmation. |
| Log interpolation between anchors | Linear made the last month feel identical to the first year. Time pressure isn't linear, so the colour shouldn't be. |
| Continuous day value, not integer days | Makes the drift genuinely imperceptible instead of a daily jump. |
| Ramps generated from anchors, never stored | Storing 36 hex values makes themes miserable to author and too fat for a URL. Three anchors is fun to pick and fits in a link. |
| Very slow gradient angle drift | The screen is alive without ever catching your eye. ±10° over 90 seconds is below the noticing threshold. |
| Overdue goes desaturated grey | Urgency is over; what's left is a fact, not an alarm. Red forever is just noise you learn to ignore. |
| Something good is violet → hot pink | Gold was muddy, and close enough to the deadline's red to be confusable from across a room. The two kinds of goal have to be one glance apart. |
| A hue control, per device | Everything else in the ramp encodes distance and is not negotiable. Which end of the spectrum it sits at is not information, so it belongs to whoever is looking at the screen. |
| Hue rotates through HSL, not `hue-rotate` | The CSS filter's matrix skews saturation and would quietly undo the work the ramps do. |
| Overdue is never hue-shifted | Urgency is over. Turning a hue there would be inventing a signal that is not there. |
| Arrived turns a full circle, slowly | That state is terminal — no distance left to encode — so the colour is free to be purely celebratory. Everywhere else the drift stays under the threshold of noticing. |
| Done is three colours | A delivery three weeks late looked exactly like one three weeks early. Early keeps the arrival colour, on time is quieter, late fades to the overdue grey. |

## Goals

| Feature | Why it exists |
|---|---|
| ★ Goal lives in the URL fragment | The whole product. No server, no accounts, and sharing is just sharing a link. A deadline has no state — it is target minus now — so there is nothing to store. |
| ★ Two kinds: deadline and event (`*`) | Not everything you count toward is a threat. A deadline heats up and runs over; something good glows, arrives, and stops. Same mechanism, opposite feeling. |
| Events never count up | "3 days since Diwali" is not a thing anyone wants. Arrival is terminal. |
| First goal is the big one | Focus needs no separate storage. Order *is* focus. |
| Focus **rotates** the list | Promote-to-front scrambles the order, and then "previous" can't undo "next". Rotation keeps the ring intact. |
| The link rewrites as you navigate | The link you copy is the view you are looking at. No mental translation. |
| Chips capped at 7, rest collapse | Past that the board stops being glanceable, which is the only thing it's for. |
| Snark at 10+ goals | Fifteen countdowns is a project plan wearing a countdown's clothes. We don't block it. We mention it. |
| Junk tokens dropped, address normalised | A half-broken link should still show what it can, and the next Share should hand over something clean. |
| A target may carry seconds | It used to fail the regex, and the goal disappeared entirely rather than degrading. Zero seconds are still left out when the link is rewritten, so ordinary links stay short. |

## Done

| Feature | Why it exists |
|---|---|
| ★ A Done button exists at all | A countdown cannot know you finished — it only knows time passed. Without a press there is no "early", only "not yet". |
| A missed deadline does **not** celebrate | Zero on an unmarked deadline is a miss. Confetti there was celebrating exactly the case the Done button exists to distinguish. One low note, and grey. |
| Something good has no Done button | Nothing to complete. It arrives, and that is the end of it. |
| Done says how early or how late | "completed 14 Nov" is a fact with the interesting part removed. The delta is the only part a viewer cannot derive from the clock. |
| Three tiers: early / on time / late | Early is the whole point of the Sreedharan story. Flattening them to "done" throws away the only interesting bit. |
| Zero-hour celebration needs no server | Every clock already agrees on when the deadline arrives. That shared agreement is the one free sync channel in an offline tool. |
| Done writes a stamp into a fresh link | Early and late can't be derived by a viewer, so a human carries the news. One paste is the price of no server. |
| `!edit` hides Done from viewers | Not security — the file is on their machine. Tidiness: no button that does nothing. |
| Confetti is hand-rolled | A library would be 10× the whole file. |
| The number itself pops | An overlay word collided with the hero that already said "early". Less is more. |

## Interface

| Feature | Why it exists |
|---|---|
| Bottom bar fades to 28% | Constantly visible, never a distraction. It comes back on hover, so it's discoverable without being present. |
| Dark/light toggle, `t` | Something always on screen must suit the room it's in. |
| Keyboard map (arrows, digits, g/s/d/t/?) | It's a wall board — you should be able to drive it without aiming a mouse. |
| Swipe on touch | Same idea, thumbs. |
| Share is one button, one job | Press it, the board you're looking at is on the clipboard. It used to morph into a choice by replacing itself with two other buttons, which read as broken, not as a menu. |
| Copy-all and the bare tool link live in Goals | The rarer moves belong next to the list they act on, as quiet text links, not competing with the Share button for attention. |
| Edit goals in place | Obvious in hindsight. Retyping a goal to fix a typo is the kind of thing that makes people stop using a tool. |
| A calendar you tap, that zooms out | Choosing a date is not the same act as reciting one. Days → months → years puts any date three taps away, however far off. |
| Typing still works, and steers the calendar | Fast for "friday", useless for "some Tuesday in March". Both doors, one room — the calendar is the truth and typing writes to it. |
| `10m` is minutes, `mo` is months | It is what it means to anyone who has ever set a timer. Minutes and hours count from now, because "in 10 minutes" has an exact meaning. |
| A date already gone is disabled in the grid | This tool only ever counts forward. It stays visible for context — a calendar with holes looks broken — but a stray tap cannot select it. |
| Typing a past date still works | The deliberate way round the guard, not an accident of one. "yesterday" is recognised, same as "tomorrow". |
| A typed time replaces the native picker | `<input type=time>` was the one control that still looked like 2013. A small text field reads back exactly what it parses — "8:30pm" in, "8:30pm" back. |
| It says back what it understood | A parser that guesses silently is worse than no parser. It shows "Fri, 4 Sept 2026 · 6:00 pm", and refuses `31/2` rather than inventing a date. |
| The calendar is still one click away | Typing wins for "friday"; a month grid wins for "some Tuesday in March". The picker sits invisibly on its own icon, which is the only way to open it that every browser agrees on. |
| The empty board counts the rest of the year | A dash and "set a goal" is a form with its fields missing. This is a working demonstration, and it is true — which a placeholder never is. |
| Nothing opens a dialog at you on arrival | The board says what to press and the button is visible. A modal on arrival is a small hostility. |
| Sound is on, but a page nobody touched is silent | Written down as a rule, not left to browser autoplay policy. A link on a second monitor cannot go off in a meeting; once you have clicked, you are using it. |
| Adding or editing a goal closes the dialog | It used to stay open, quietly inviting a second goal, then a third. One action, one result. |
| Lock goals | Not a permission system — there's no server, so permission would be theatre. A guard against your own thumb on a kiosk or a wall display, switched back off by anyone, any time, on their own device. |
| A private, per-device change log | The link tells you what a goal *is*, not what happened to it. Every add, edit, removal and Done gets a line, with a Clear button beside it. Never leaves the browser. |
| Quiet, rotating tips fill the idle line | One to nine goals used to leave that line blank. Picked once per load, same restraint as the ten-goals-or-more snark it sits beside. |
| Dialog closes on outside click | Every other dialog on earth does. |
| About panel with the Sreedharan story | The origin is the best thing about this tool and it was invisible. Also where the keyboard map lives, so the main screen stays clean. |

## This screen

Per-device, never in the link. Sharing a board must never reach across and change somebody else's display — that is invariant 2 read backwards.

| Feature | Why it exists |
|---|---|
| Fullscreen, on a key and a button | One keypress turns any old laptop into a wall board. It is the cheapest possible version of the whole idea. |
| Keep the screen awake | A board is useless the moment the phone sleeps. |
| Keep-awake is **not** remembered | A setting that outlives the sitting is how somebody's battery dies next week and they never work out why. This is a this-sitting decision, like fullscreen. |
| Size of the number scales the hero only | The point is one number readable from further away. Zooming the whole page would move the supporting lines too, and they were already the right size. |
| Size is remembered, per device | It is about the screen you are at, not the goal. Two people opening the same link should each keep their own. |
| A big screen with no pointer starts bigger | That is a wall, not a desk. "TV mode" is not a mode; it is a better default. |
| Rotation lock appears only when it could work | The browser API needs fullscreen or an installed app. A toggle that silently does nothing is worse than no toggle. |
| All of it lives under `?` | The main screen keeps one number on it. Anything requiring a choice hides behind a key, which is the second rubric test. |
| A sound at zero, off by default | The old blanket "no sound" was protecting against a board that makes noise *at* you. A sound you deliberately switch on for the last ten seconds of a launch is the opposite of that. |
| Sound is remembered, keep-awake is not | Different risks. Sound goes wrong as noise in the wrong room, and only inside the last ten seconds of a deadline. Keep-awake goes wrong as a flat battery next Tuesday, whether or not you are looking. |

## The look of it

Themes are data, and this is the whole extension surface. All of it per device.

| Feature | Why it exists |
|---|---|
| Every measurement comes off the screen | One unit from `vmin`/`vmax`, everything else a power of phi from it. A phone and a television were getting the same pixels instead of the same design. |
| Panels are sized in ems, not pixels | So they grow with the type, which grows with the screen. A 4K monitor should get a bigger panel, not the same one further away. |
| Two columns where there is room | The About panel and the goal form both outgrew one column. A dialog should take the screen's shape, not ignore it. |
| Pure black and pure white surfaces | The colour moves off the background and into the number. On OLED that is most of the panel switched off, and the ramp still works — it has only changed which surface it lives on. |
| Five typefaces, no webfont | A file whose whole promise is that it needs nothing must not open a network connection to look like itself. System stacks only. |
| Themes do **not** travel in the link | Sending somebody a date must not restyle their screen. Same rule as hue, size and sound. It is the one piece of the original theme design deliberately not built. |
| A glow behind the number pulses under an hour | The number itself never moves - it is the one thing on screen that has to stay still to be read at a glance. The pulse is triggered explicitly from the same tick that updates the digits, so it can never drift out of sync the way a free-running scale animation once did. |
| Dialog content gets its own, tamer scale | About and Goals were reusing the hero's dramatic viewport sweep and read as oversized and dense at once. Scoped to `.dlg`, near-fixed rather than swept, so panels read like a normal app screen. Only the outer panel size still scales with the screen. |
| A styled scrollbar | The one thing left on this screen the OS was still drawing by default. |
| The whole board wanders a few pixels | It is meant to be left on for weeks. Nothing should sit in the same pixels that long. Two coprime periods, so the path never repeats. |
| One height for every button in the bar | It read as scattered because nothing shared a measurement. |
| Anything switched on is lit in the bar | A setting you cannot see is a setting you forget you left on — and that is also the place to turn it off. |
| Keep-awake appears in the bar only while on | It is the only time you would go looking for it. |

## Distribution

| Feature | Why it exists |
|---|---|
| Service worker | Makes the *hosted* link work offline after one online visit. The downloaded file never needed it. |
| Web manifest | Add-to-home-screen on phones is the closest thing to a floating window that mobile allows. |
| `index.html` redirect | Keeps `baaki.html` the single source of truth while still giving hosting a proper entry point. |
| Desktop wrapper (Tauri) | The three things a browser tab cannot do: float above other windows, start with the machine, remember where it was. |
| Wrapper injects its own chrome | So `baaki.html` stays one portable file with no idea it's ever inside an app. |
| GA4 off by default | It only counts opens of a hosted link. Worth having, not worth pretending it measures use. |
| Update check against a 200-byte `version.json` | A file you emailed cannot be recalled. This is the only channel a downloaded copy has, and it costs a fifth of a kilobyte. |
| It is a dot, not a banner | The board is something you walk past. Anything that interrupts that has already broken it. Silent offline, silent when the host does not answer. |
| A QR code on `Q` | A board on a projector is useless until the link is in somebody's hand, and nobody types a URL off a wall. This is the only path from a screen to a pocket. |
| The code is always dark on light | It is not decoration. A themed code that half-scans has cost somebody more time than it saved. |
| It refuses rather than degrades | Past about 270 characters it says the board is too long instead of drawing something a camera cannot read. A code that does not scan is worse than no code. |
| The panel says what a code is for | Somebody has to be told once. Copy and Download sit next to it; the download is drawn at twelve pixels a module for printing. |
| Share can hand over the tool alone | Sometimes you want to give somebody Baaki, not your deadline. |
| `USAGE.md` states the grammar | A link *is* the API. Writing the grammar down means a script or a model can generate a board without guessing, which is the cheapest distribution there is. |
| The encoder is checked by a real decoder | `npm run test:qr` reads its own output back with `jsqr`. Eyeballing a QR tells you nothing — v1 to v6 looked perfect while every code from v7 up was unreadable. |
| Two candidate URLs, tried in order | A host that will not send CORS headers is invisible to a file opened from a disk, and you find that out only in the field. |
