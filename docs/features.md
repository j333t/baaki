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
| Share offers "this one" or "all" | Sharing all five when you meant one is a small betrayal, and there was no way to say which. |
| Edit goals in place | Obvious in hindsight. Retyping a goal to fix a typo is the kind of thing that makes people stop using a tool. |
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
| The encoder is checked by a real decoder | `npm run test:qr` reads its own output back with `jsqr`. Eyeballing a QR tells you nothing — v1 to v6 looked perfect while every code from v7 up was unreadable. |
| Two candidate URLs, tried in order | A host that will not send CORS headers is invisible to a file opened from a disk, and you find that out only in the field. |
