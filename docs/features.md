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

## Distribution

| Feature | Why it exists |
|---|---|
| Service worker | Makes the *hosted* link work offline after one online visit. The downloaded file never needed it. |
| Web manifest | Add-to-home-screen on phones is the closest thing to a floating window that mobile allows. |
| `index.html` redirect | Keeps `baaki.html` the single source of truth while still giving hosting a proper entry point. |
| Desktop wrapper (Tauri) | The three things a browser tab cannot do: float above other windows, start with the machine, remember where it was. |
| Wrapper injects its own chrome | So `baaki.html` stays one portable file with no idea it's ever inside an app. |
| GA4 off by default | It only counts opens of a hosted link. Worth having, not worth pretending it measures use. |
