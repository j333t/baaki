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
| The unit rides on the digits as a superscript (`8ʰ:30ᵐ`, `427ᵈ`) | A word beside the number ("hours · today") asked you to read English to know what a colon pair meant. A letter on the digit it belongs to doesn't. Sized well past the browser's cramped default `<sup>` so it survives being read from across a room - the whole reason this exists in the first place. Tuned twice: the first `vertical-align` sat the letter at the digit's mid-height, reading as misplaced rather than as a superscript, before it moved up to sit properly on the shoulder. The colon between groups stayed - it's how a clock is written. Done and arrived keep a plain word beside their checkmark or star; neither is a count with a digit to attach a letter to. |
| A leading zero group drops rather than idling on screen | The last sixty seconds used to read `0m 08s`. Once a group has gone to zero it has nothing left to say, so it's just `08s` - same rule going the other way past a missed deadline. |

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
| A hue control, per device, per goal | Everything else in the ramp encodes distance and is not negotiable. Which end of the spectrum it sits at is not information, so it belongs to whoever is looking at the screen - and each goal gets its own, spaced from every other by the golden angle, so a board with several on it tells them apart by colour too. `H`/`Alt+H`/the Settings row all act on whichever goal is currently focused. |
| Hue rotates through HSL, not `hue-rotate` | The CSS filter's matrix skews saturation and would quietly undo the work the ramps do. |
| Overdue is never hue-shifted | Urgency is over. Turning a hue there would be inventing a signal that is not there. |
| Arrived turns a full circle, slowly | That state is terminal — no distance left to encode — so the colour is free to be purely celebratory. Everywhere else the drift stays under the threshold of noticing. |
| Done is three colours | A delivery three weeks late looked exactly like one three weeks early. Early keeps the arrival colour, on time is quieter, late fades to the overdue grey. |

## Goals

| Feature | Why it exists |
|---|---|
| ★ Goal lives in the URL fragment | The whole product. No server, no accounts, and sharing is just sharing a link. A deadline has no state — it is target minus now — so there is nothing to store. |
| ★ Three kinds: deadline, event (`*`), and since (`^`) | Not everything you count toward is a threat, and not everything worth watching has an end. A deadline heats up and runs over; something good glows, arrives, and stops; since counts up from a start, forever. |
| Events never count up | "3 days since Diwali" is not a thing anyone wants. Arrival is terminal - that's what the third kind, since, is for instead. |
| A timed goal carries its own timezone (`@Asia/Kolkata`) | A shared "6pm" used to land on a different instant for everyone who opened it, silently reinterpreted in whichever zone their own device happened to be in. Stamped on automatically, no picker, no UI - the creating device already knows its own zone. A bare date (no time) carries none on purpose: "end of day" is supposed to mean the reader's day, not the sender's. |
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
| Done says exactly how early or how late, beside the checkmark | "completed 14 Nov" is a fact with the interesting part removed. A coarse word tried first ("on time" for anything up to a day ahead) was still a fact with the interesting part removed - "3 hr early" was rounding itself down to a word that undersold it. The exact delta is what a viewer cannot derive from the clock, so that's what's there now. |
| Colour still uses three coarse tiers | Early / on time / late as a colour needs to read at a glance, which a precise number does not do well. The word beside the checkmark went precise; the colour stayed a three-way split on purpose - they're answering different questions. |
| Zero-hour celebration needs no server | Every clock already agrees on when the deadline arrives. That shared agreement is the one free sync channel in an offline tool. |
| Done writes a stamp into a fresh link | Early and late can't be derived by a viewer, so a human carries the news. One paste is the price of no server. |
| `!edit` hides Done from viewers | Not security — the file is on their machine. Tidiness: no button that does nothing. |
| Confetti is hand-rolled | A library would be 10× the whole file. |
| The number itself pops | An overlay word collided with the hero that already said "early". Less is more. |

## Since

| Feature | Why it exists |
|---|---|
| ★ Counts up from a fixed start, forever | A deadline and an event are both about reaching a point. Not everything worth watching has one - "142 days sober," "6 years married" are running totals, not countdowns, and deserved the same one-number treatment rather than living outside this tool entirely. |
| Same ladder, same superscript units, same dropped-zero rule | The arithmetic for "how long since" and "how long since it was due" (the overdue mirror) is identical - only the meaning differs, so since reuses the days/H:MM/M:SS ladder and its superscripts rather than inventing a second system. |
| Static, warm colour - not grey, not cooling | Overdue is grey on purpose: urgency that's over is a fact, not an alarm. Since was never urgent to begin with, so it takes something good's arrived colour instead - a state to be glad about, ongoing. |
| No Done button | Nothing to complete - it doesn't stop, on purpose. |
| The calendar hides itself for this kind | It only ever offers days from today forward, which is backwards for picking a start already in the past. Rather than a calendar that quietly can't help, since leans on quick presets and typing instead. |
| A mirrored quick-pick row: yesterday, a week ago, a month ago... | The forward kinds have presets for "starting soon" and "sometime out there." Since needed the same one-tap coverage pointed the other way. |
| `N unit ago` joins the typed vocabulary | Mirrors "in N unit" going forward - the same short words, the other direction. |
| A quick-picked bare day starts at midnight, not 11:59pm | A deadline's bare day means "by the end of it." A since start means the opposite: "since it began." Same underlying parser, the one default that had to flip. |

## Interface

| Feature | Why it exists |
|---|---|
| Bottom bar fades to 28% | Constantly visible, never a distraction. It comes back on hover, so it's discoverable without being present. |
| Dark/light toggle, `t` | Something always on screen must suit the room it's in. |
| Keyboard map (arrows, digits, g/s/d/t/?) | It's a wall board — you should be able to drive it without aiming a mouse. |
| Swipe on touch | Same idea, thumbs. |
| Share always copies immediately, no menu first | Press it, the board you're looking at is on the clipboard. |
| The rarer share moves unfold beside Share, then fold away on their own | All *n*, a QR icon, and Tool sat there permanently at first - always visible whether wanted or not. Now they only appear once Share is actually pressed, and fold back up 8 seconds after the last touch (doubled from the first pass, which folded before most people finished reading it). Still one connected pill, one hairline between segments, `#bShare` never changing identity - just not permanent furniture. |
| The QR code is a Share segment, not a separate bar icon | It is fundamentally a way of sharing. `Q` still opens it directly, and the segment itself is the same glyph as the QR bar icon, not the word "Code". |
| The bare-tool share segment is "Tool" | "No goal" described what it lacked, not what it was for. |
| An empty board shares the tool, not a refusal | Share used to just say "add a goal first." An empty board is still a working example - the tool itself is worth handing over, with the QR segment offered alongside it. |
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
| A name is optional | It carried `required`, so the browser's own popup fired before this file's code ever ran and the actual error was unreachable. Gone now. |
| An unnamed goal gets the smallest free number, not the word "Goal" | Three unnamed goals used to all be called "Goal" - short, but not identifiable. A number nobody else on the board is using is just as short and actually tells them apart. |
| Adding or editing a goal closes the dialog | It used to stay open, quietly inviting a second goal, then a third. One action, one result. |
| The calendar's back arrow stops at today's period | Every day before today was already disabled, but "back" could still walk you into a month or a whole decade with nothing but disabled cells in it. |
| The year grid starts on the current year | It used to snap to an absolute mod-12 boundary - 2016-2027 from 2026, ten of those years already in the past and disabled before Prev was ever needed. Nothing before now is selectable anyway, so the first window may as well start where it becomes useful. |
| Every goal picks its own random hue, the first time it's painted | Every fresh board used to start on the same default colour. First cut only rolled it once, for a board's first goal, which meant everything after it still shared a colour - the actual ask was that goals be tellable apart, so now each one gets its own, spaced from every hue already handed out rather than drawn independently. |
| A "Share" button in the Goals form, beside Add goal | Add goal always did two things at once: save it to your board, and start it counting there. A goal you're only handing off to someone else does not need to live on your board too - Share builds the same link Add goal would, and copies it without touching S.goals. |
| Lock goals | Not a permission system — there's no server, so permission would be theatre. A guard against your own thumb on a kiosk or a wall display, switched back off by anyone, any time, on their own device. |
| A private, per-device change log, in Goals | The link tells you what a goal *is*, not what happened to it. Lives under the list it's about now, not buried in a settings panel. Every add, edit, removal and Done gets a line, with a Clear button beside it. Never leaves the browser. |
| Clear all, and clear completed, above the goal list | Removing goals one at a time was the only option once there were several to retire at once - after a launch, after a season of deadlines. Clear completed disables itself when there is nothing done to clear. |
| Fifteen quick-pick presets, not six | 5m/15m/30m/1h/2h cover "start a timer right now"; end of week/month/year and +3/+6 months cover "sometime out there" - both ends of the range in one tap, short labels with the full phrase on hover. Deliberately not one chip per minute value someone might type (1, 2, 3, 5, 10...) - nobody needs both "1 min" and "2 min" as separate taps, and the typed field already covers an exact ask in two words. |
| Pressing a preset adds the goal and closes the dialog | A preset is a whole answer, not a suggestion to keep editing. Name the goal first if it wants one - the field's current value rides along with the date either way. |
| The calendar is a disclosure, closed by default | A scroll region nested inside the dialog's own was tried first and rejected - it kept Add goal in reach but at the cost of a second, less obvious scrollbar. Collapsed, the grid costs nothing until "Pick a day on the calendar" is actually pressed; it opens itself when editing a goal, since seeing the existing date in context is the point there. |
| Tips rotate lazily on their own, and only through what's actually true | Picked once per load used to mean static for the whole visit; now they cross-fade every 25-35 seconds, only while a tip is what's showing. Each one also carries a check - no fullscreen tip without the API, no "press 1-9" tip with a single goal - and every tip is written to make sense to someone who has never pressed a key on this board, not just to someone who already knows it. |
| Every setting explains itself on hover, and looks it | A plain-language `title` on each row under "This screen" - what it does, not just its name - now paired with a dotted underline and a help cursor, so the row visibly invites a hover instead of hiding it. |
| Help text can be turned off | On by default. Once the panel is familiar, the reminder line under it is just a line of text nobody rereads. |
| Alt+H jumps to a random hue, `H` still steps it | `H` is a dial, five degrees at a time. Alt+H is a reroll - anywhere on the wheel in one press, with a matching Random button in Settings for anyone not on a keyboard. |
| A quiet clock, always on, with seconds and the timezone | Goal or none. The authentic Sreedharan pairing is a station clock next to a days-left board, and it says "this is live" now that the number itself never moves. Seconds and the zone name turn it from decoration into something you'd actually set a watch by. |
| Dialog closes on outside click | Every other dialog on earth does. |
| About panel with the Sreedharan story | The origin is the best thing about this tool and it was invisible. Also where the keyboard map lives, so the main screen stays clean. |
| The About text says less | Three paragraphs of "why one number" were one idea repeated three ways. Cut down once already; still read as three unrelated facts run together the second time. |
| Sreedharan gets his own line, credited as the inspiration | He was introduced mid-sentence, next to the meaning of बाकी, which read as a name dropped in at random rather than the source of the whole idea. "Inspired by E. Sreedharan" is now its own sentence, and बाकी's meaning is its own line after it. |

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
| Lock goals | Stops Goals and Done opening by accident - a kiosk, a wall display. Not a permission system; anyone can turn it back off, on their own device, any time. |

## The look of it

Themes are data, and this is the whole extension surface. All of it per device.

| Feature | Why it exists |
|---|---|
| Every measurement comes off the screen | One unit from `vmin`/`vmax`, everything else a power of phi from it. A phone and a television were getting the same pixels instead of the same design. |
| Panels are sized in ems, not pixels | So they grow with the type, which grows with the screen. A 4K monitor should get a bigger panel, not the same one further away. |
| One column, always | Two side by side looked considered on paper. It left a slab of dead air under whichever side was shorter, in both the About panel and the Goals form - and the two sides were never the same length. |
| Pure black and pure white surfaces | The colour moves off the background and into the number. On OLED that is most of the panel switched off, and the ramp still works — it has only changed which surface it lives on. |
| Five typefaces, no webfont | A file whose whole promise is that it needs nothing must not open a network connection to look like itself. System stacks only. |
| Themes do **not** travel in the link | Sending somebody a date must not restyle their screen. Same rule as hue, size and sound. It is the one piece of the original theme design deliberately not built. |
| No moving glow, no moving digits | A pulsing background was tried, on the theory that urgency belonged behind the number rather than in it. Removed anyway - it still didn't read as organic, and tuning it further wasn't the fix. The number has never moved and nothing has replaced the pulse. |
| Dialog content gets its own, tamer scale — buttons do not | `.dlg` re-declares a gentler `--u`/`--f0`/`--f1`/`--f2` for text and spacing. `--h`, the height every button uses, stays a single root-level variable instead, so a dialog's calmer content scale can never drag its buttons down to an untappable size. |
| Calendar cells and nav arrows get their own floor | Denser than a lone CTA, so they float on a smaller minimum, scaled from the dialog's own content unit rather than jumping to room-scale. |
| `kbd` reads as a code wrap, not a key-cap | Tried as an inset-bordered key-cap first, close enough to a button's shape to still be mistaken for one. A plain monospace tint with no border and no hover state reads as text about a key, not as something to press. |
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
