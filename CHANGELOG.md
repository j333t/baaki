# Changelog

Reasons, not diffs. If a line doesn't say *why*, it isn't finished.

Versions are set in `baaki.html` (`VERSION`), `desktop/src-tauri/tauri.conf.json` and `package.json`.

---

## How updates reach people

Three audiences, three mechanisms, because a file you emailed cannot be recalled.

| Copy | How it updates |
|---|---|
| **Hosted link** | Service worker fetches the new version in the background; next open is current. Bump `CACHE` in `sw.js` on every release or the old one sticks. |
| **Downloaded file** | Cannot be reached. When online it checks a 200-byte `version.json` and shows a quiet dot with a link. Never nags, never blocks, silent offline. |
| **Desktop wrapper** | Rebuilt and re-released through GitHub Actions on a tag. Unsigned, so first run shows an OS warning. |

Anything that changes the **link format** is a breaking change and needs a major version, because old links must keep working forever. That is the one promise this tool cannot break.

---

## 1.9.0 — unreleased

Two asks that turned out to be the same size of change: colour and
sharing both needed to stop being one board-wide thing.

### Every goal gets its own colour
- **A random hue lands on a goal the first time it's painted**, not on the board as a whole - the first attempt at this only rolled the dice once, for a board's first goal, which meant every goal after it still shared one colour. That undersold the actual ask: goals should be tellable apart by colour, not just by name.
- **New hues are spaced by the golden angle**, not drawn independently at random - three goals added back to back land as genuinely different colours (pink, then blue, then green), not three numbers that happen to average out different but can still collide.
- **`H`, `Alt+H`, and the Settings hue row now act on whichever goal is focused**, not a single board-wide value - there no longer is one, so a control that changes "the hue" has to mean *this* goal's hue.
- Colours nobody's goal uses any more are dropped from storage when the goal list changes, the same instinct as the history log's cap.

### Share a goal before it's yours
- **A "Share" button sits in the Goals form now, beside Add goal.** Add goal always did two things at once - save it to your board *and* start counting it there - with no way to get a link without also keeping the goal. Share reads the form exactly like Add goal does, builds the same link, and copies it without ever touching your own board.

---

## 1.8.0 — unreleased

Live-site testing found the next layer down: things 1.7.0 got right in
principle but not quite in execution, plus a couple of new asks.

### The unit, actually reading as a superscript
- **Positioned properly.** `vertical-align` was tuned too low, so the letter sat at the digit's mid-height instead of hanging off its top-right like a real superscript - "somewhere in the middle," not attached to anything. Fixed.
- **The colon is back.** `8h 30m` briefly replaced `8:30` with a space; a space is not how anyone writes a clock. It's `8h:30m` now - the colon stays, each side just carries its own letter.
- **A zeroed-out leading group drops instead of idling at "0".** The last sixty seconds used to read `0m 08s`; there is nothing left to say about the minutes once they have run out, so it is just `08s` now. Same rule for the overdue mirror.

### Done says exactly how far off it was
- **"On time" is gone.** It used to cover anything finished up to a full day ahead of the deadline, which is not what "on time" means to someone who beat it by three hours. The exact delta - `29 days early`, `3 hr early`, `11 days late`, or `to the minute` for a genuine bullseye - sits beside the checkmark instead. The tick mark itself is untouched; only the word beside it changed.
- The tag line under Done is empty now rather than repeating the same delta a second time - it was already redundant with the word beside the checkmark and the date in the line below.

### The calendar
- **The year grid starts on the current year**, not on an arbitrary mod-12 boundary that could land mostly in the past - browsing from 2026 used to open on 2016-2027, ten of those twelve years already disabled before Prev was ever pressed.

### Small things
- **A board's first goal picks a random hue**, instead of every fresh board starting on the same default. Only the first: adding a second goal to a board somebody is already looking at leaves the colour alone.
- **Unnamed goals get a short number instead of the word "Goal" every time** - three unnamed goals used to be three things called "Goal". The smallest number nobody else on the board is using now, so they're actually told apart.
- **Share stays unfolded twice as long** before it folds itself away - 8 seconds now, not 4.
- **The About panel gives E. Sreedharan his own line**, credited plainly as the inspiration, instead of being introduced mid-sentence next to the meaning of बाकी. Both ideas got shorter in the process.

### Looked at, and left alone
- Showing months and years persistently in the calendar instead of behind a tap: more room only exists on a desktop-sized dialog, and phones are most of where this gets used. The current three-taps-to-anywhere zoom stays.
- Keeping two devices' clocks in sync to the second: this is a difference between the *devices'* clocks, not something a page in a browser can correct without calling out to a time server - which this file does not do, on purpose, offline included. A device more than a couple of seconds off its own NTP sync is the thing actually worth checking.

---

## 1.7.0 — unreleased

Two passes, because the first one shipped a real bug and a real
overcorrection alongside its fixes, and both got caught before either
went out the door.

### The bug behind "everything in the dialogs looks too big"
- **Four CSS rules were silently dropping their own font size.** `.quick button`, `.kind button`, `.opt button` and the main text `input` all wrote `font:… inherit` as a shorthand - and `inherit` cannot sit mid-shorthand next to explicit values, so the whole declaration was invalid and the browser threw it away. Each one fell back to the *root* 15px type scale instead of the dialog's calmer ~12px one. Not a scale that needed rethinking - a bug that had been making the preset chips, the Deadline/Something good toggle, and every "This screen" button render half again too large since the day they were written.
- **A second, quieter bug in the same family:** the free-text field's own value could fail to parse itself. A quick-pick preset like "in 5 min" writes a timestamp with real seconds on it into the field; re-submitting without retyping fed that straight back through the typed-text parser, which only knew how to strip `HH:MM` and left a dangling `:SS` nothing downstream could read - "I could not read that date," on a date this file had just written. The same gap affected re-saving an edit on any goal whose target carried seconds. Fixed at the parser, not by avoiding seconds.

### The Goals form, made to fit
- **The calendar is collapsed by default, not scrolled.** The first fix for "too much space" wrapped the quick row, the calendar and the typed field in their own scrolling strip, capped independently of the dialog - which solved "Add goal stays reachable" and immediately broke a harder rule: a scroll region inside another is not a fix, it's a second problem wearing the first one's clothes. The grid is a plain disclosure now - "Pick a day on the calendar," collapsed until pressed, opening on its own when editing a goal so the existing date is there to see. Collapsed, the whole form fits with room to spare, no scrolling of any kind, on a screen as small as 375×667.
- **A preset is a whole answer, not a half-filled form.** Clicking a quick-pick chip used to fill in the date and wait for a separate press of "Add goal." Now it adds the goal and closes the dialog in the same motion - name the goal first if it wants one, the field's current value rides along with the date.
- **Fifteen quick-pick presets, not six.** 5m/15m/30m/1h/2h for "starting right now", end of week/month/year and +3/+6 months for "sometime out there" - short labels, the full phrase on hover, no new parsing needed since `parseWhen` already understood every one of these. Deliberately not a chip per minute value (1, 2, 3, 5, 10…) - the typed field already covers an exact ask in two words.
- **Clear all, and clear completed**, above the goal list. Clear completed disables itself with nothing done to clear.

### The number carries its own unit now
- **The unit moved off the number's side and onto its digits.** "8:30 hours · today" made you read a caption to know what the digits meant; now it's `8ʰ 30ᵐ` - the hour group and the minute group each carry their own small superscript letter, sized to stay legible at a distance rather than shrunk to the browser's cramped default. Every counting rung gets this treatment: days (`427ᵈ`), the overdue mirror (`+8ʰ 00ᵐ`), the empty board's example (`118ᵈ`). Done and arrived keep a plain word beside the checkmark or star, since neither is a count with digits to attach a letter to.

### Share, unfolding instead of sitting there
- **The segmented family is hidden until Share is actually pressed.** A first pass made it permanently visible; unfolding on press and folding away a few seconds after the last touch turned out to be the actual point. Press Share, it copies the current goal exactly as before, and All *n* / a QR icon / Tool appear beside it, on their own.
- **An empty board shares the tool itself, instead of refusing.** Share used to just say "add a goal first." Now it falls back to the bare link - still a working share, still one press - with a QR code offered as the one extra segment.
- The bare-tool segment is called **Tool** now, not "No goal". The QR segment is an icon, matching the QR bar glyph, not the word "Code".

### Small things, each reported once and fixed once
- **Confetti no longer hangs at the centre for a beat before it bursts.** The slowest third of the original speed spread barely moved in the first few frames; the floor is higher now and the burst reads as instant.
- **The clock shows seconds and the timezone name.** Still one `setInterval`, still no sub-second loop - it was already re-rendering every second, it just wasn't using it.
- **Alt+H jumps to a random hue**; `H` still steps it five degrees at a time. A matching Random button sits next to Reset in Settings.
- **`kbd` reads as a code wrap now, not a key-cap.** A plain monospace tint, no border, no hover state - different enough from a real button on sight, and nothing pretending to be pressable.
- **Tips only show what's actually true right now**, and are written to stand alone. No fullscreen tip without the API, no "press 1-9" tip with one goal on the board; every remaining one says "press X" explicitly instead of assuming the reader already knows the board.
- **Every row under "This screen" has a dotted underline and a help cursor** on hover, so the tooltip that was already there is now visibly there.
- **The help-text line under Settings can be turned off.** On by default; a familiar panel doesn't need the reminder reread every time.
- **The About panel says less.** Three paragraphs of "why one number" are one now - the Sreedharan story and बाकी's meaning both survive, the rest didn't earn its length.

### Under it
- 224 browser checks. Several were rewritten rather than added: the unit moving onto the number changed what almost every ladder-rung assertion should expect, so those got updated in place instead of piling a second check on top of the old one.
- 112.8 KB → 125.0 KB. Real surface added (nine more presets, the share-fold state machine, the calendar disclosure, superscript rendering) outweighed what was trimmed (the About text, the screenshot-capture tail in `test.mjs`).
- Screenshots stayed part of verification this round - the first one taken caught the `inherit` bug above, which no amount of reading the CSS had. A later one caught the nested-scroll regression before it shipped.

---

## 1.6.0 — unreleased

A second correction pass on top of the first one. Several 1.5.0 ideas
were right in principle and wrong in execution; this round fixes the
execution, and one idea (a moving glow behind the number) turns out
not to have earned its place at all.

### Removed outright
- **The tenths-of-a-second rung is gone.** `7:30.0` in the last ten minutes read as clutter, not urgency - a smaller, dimmer digit competing with the one number this whole tool exists to make readable at a glance. Back to plain `M:SS`, ticking once a second, the way it worked before it ever grew a decimal. The `requestAnimationFrame` fast path, the decimal-splitting renderer, and the whole "fine" rung are deleted, not just hidden - about a kilobyte lighter for it.
- **The background pulse is gone too.** It replaced last round's number-scale "heartbeat" on the theory that the glow belonged behind the digits, not in them. It still didn't read as organic, and the fix for "this looks bad" was to remove it, not to keep tuning it. The number itself has never moved and still doesn't; nothing has replaced the pulse.

### Layout, properly this time
- **Both dialogs are a single column again.** The two-column layout from last round looked considered on a slide but left a slab of dead air under whichever side was shorter, in both the About panel and the Goals form - and it did that in exactly the cases that mattered, since the two sides were never the same length. One column never has that problem.
- **Buttons have a real floor.** `--h`, the height every `.b` button uses, is now a single root-level variable instead of being recomputed per-button from whatever scale was locally in effect - so a dialog's tamer *content* scale (type, spacing) no longer drags its *buttons* down with it. Close and Add goal are back to a normal size. Calendar cells and the month-nav arrows get their own smaller floor, since a seven-column grid has less room to work with than a lone CTA.
- **`kbd` no longer looks like a button.** It shared a background colour with `button.b`'s hover state, so a row of keyboard shortcuts read as a row of little pressed buttons. It's an inset key-cap now - a border and a shadow, no fill - and the keys grid is capped to its own content width instead of stretching across the whole panel.
- **The Devanagari watermark ties to the type scale** instead of a bare `1.6rem` sitting outside it - one fewer stray number in a file that was accumulating them.

### Choosing a date
- **The calendar cannot wander into the past.** Every day before today was already disabled; the "back" arrow could still walk you into a month, a year, or a whole decade with nothing but disabled cells in it. Back now stops exactly at the period holding today, at every zoom level. Typing a date is still the deliberate way round the guard - "yesterday" still works there, on purpose.
- **The name field is genuinely optional.** It carried `required`, so the browser's own "please fill out this field" popup fired before this file's code ever ran - the actual, nicer error was unreachable. `required` is gone, and so is the block: a blank name becomes "Goal" rather than an error.

### Share, rebuilt as one family instead of one button
- Last round's fix - Share always copies immediately, no menu - was right and stays. What was wrong was moving the rarer moves (every goal, the bare tool) into the Goals dialog, disconnected from the button that shares things. They're back next to Share, but not as a popover: **a single segmented pill**, Share plus its siblings, with a hairline between each - one visual family, growing as the goal count allows, never replacing or hiding the button itself.
- **The QR code is one of Share's segments now**, not a separate icon in the tool strip. `Q` still opens it directly for muscle memory; the standalone bar icon is gone.

### A few things that had gone quiet or missing
- **A private change log now lives in the Goals dialog**, under the list it's about, instead of buried in About's settings panel - a better place for something that's fundamentally about what happened to your goals.
- **Tips rotate lazily on their own** now, roughly every 25-35 seconds with a soft cross-fade, instead of being picked once and left static for the whole visit.
- **Every row under "This screen" explains itself on hover** - a plain-language `title` tooltip, so what "Auto colour change" or "Lock rotation" actually does isn't a guess.
- **A quiet clock sits under the tag line**, always on, goal or none. A station clock next to a days-left board is the original Sreedharan pairing, and it's the plainest way left to say "this is live" now that the number itself never moves.

### Under it
- 222 browser checks, up from 211 (several tests for removed features were deleted rather than papered over).
- **119 KB → 118 KB.** The first time a round has come in *lighter* - what tenths and the pulse cost turned out to be more than everything added this round put together.
- Stopped taking and reviewing screenshots as part of verification this round, per direct feedback that it wasn't earning its cost; leaned on the 222 assertions and worked-through CSS math instead.

---

## 1.5.0 — unreleased

A correction pass. Most of 1.4.0's new surface was too much at once -
this round is mostly about pulling it back to something that reads
calm on first look, plus two features that were asked for directly.

### The panels were overwhelming, and now they are not
- **Dialog content gets its own, tamer scale** - `--u`/`--f0`/`--f1`/`--f2` are re-declared on `.dlg`, near-fixed rather than the hero's dramatic viewport sweep. About and Goals were reusing type and spacing meant to be read across a room; scoped down, they read like a normal, calm app screen instead of a billboard. The panel's own outer size, rounding and shadow are untouched - only what is *inside* got smaller.
- **A styled scrollbar.** Everything else on this screen was designed; the one the OS drew by default was the last unstyled thing in the file.

### Choosing a date, properly
- **The native `<input type=time>` is gone.** Its spinner chrome was the one control on the page that still looked like 2013. In its place, a small text field that reads back exactly what it parses - "8:30pm" in, "8:30pm" back - built on the same idea as the main field.
- **A date already gone is disabled in the calendar, not just dim.** This tool only ever counts forward; a stray tap should not be able to create a deadline in the past. The grid still shows those days for context - a calendar with holes in it looks broken - it just does not respond. Typing one in in the free-text field still works: that is the deliberate way round the guard, not an accident of one.
- **Time chips for today respect the clock too** - 9 am is dimmed out at 10 am, Noon is not.
- **"yesterday" parses now.** It was the one obvious word missing, and the past-date escape hatch is not a real escape hatch if the word for the most common past date does not work.

### Two things that were asked for directly
- **Lock goals**, under `?` → This screen. Not a permission system - there is no server, so permission would be theatre - but a guard against your own thumb on a kiosk or a wall display. Goals will not open, Done will not fire, until it is switched back off, which anyone can do, any time, on their own device.
- **A private change log**, same place. Not a sync channel - it never leaves the browser, never rides in a link - but a link only tells you what a goal *is*, not what happened to it. Every add, edit, removal and Done gets a line, on this device, with a Clear button next to it.

### The rest
- **Adding or editing a goal closes the dialog immediately.** It used to stay open, quietly inviting a second goal, then a third. The rarer moves - copy every goal, hand someone the bare tool with nothing on it - moved into the Goals dialog itself, as small text links next to the list they act on.
- **Share is one button with one job**: press it, the board you are looking at is on the clipboard. It used to turn into a choice - "this one, or all?" - by literally replacing itself with two other buttons, which read as the Share button breaking rather than a menu opening.
- **The number itself no longer moves.** A scale animation ("heartbeat") on the digits was disturbing the one thing on this screen that has to stay perfectly still to be read at a glance, and it ran on its own timer, so its beat drifted from the second it was supposed to represent. A soft glow behind the number does the pulsing now - triggered explicitly on the same tick that updates the digits, so it can never be out of sync with what it is echoing, and it is gated off entirely under reduced motion.
- **A handful of quiet, rotating tips** fill the line under the board that used to sit empty for anyone with one to nine goals - "type friday 6pm instead of clicking through a calendar," that kind of thing. Picked once per load, same restraint as the existing 10-goals-or-more snark.
- **A regression from 1.4.0, found and fixed**: the empty board's "click anywhere to add a goal" behaviour was written, tested as passing in that round's transcript, and never actually saved - the script that carried it hit a later, unrelated failure and exited before writing the file, silently discarding several edits that had already printed as done. Restored here, and the tooling that caused it is now checked more carefully.
- **Another instance of the `[hidden]` bug**: a `display:flex` rule on `.hist` was overriding the browser's own hidden-element behaviour, the same way a bar button did two versions ago. Same fix, same lesson: any class that sets `display` on an element also toggled via `.hidden` needs an explicit `[hidden]{display:none}` beside it.

### Under it
- 219 browser checks, up from 185.
- 107 KB → 119 KB. Three real features this round (lock, log, tips) against a scale correction that should have made the file feel smaller than it is.

---

## 1.4.0 — unreleased

The release where the design became a system rather than a pile of
pixel values, and the theme system finally landed.

### Measurements come off the screen now
- **One unit, and everything is a power of phi from it.** `--u` is a clamped function of `vmin` and `vmax`, and every space in the file is `.382`, `.618`, `1`, `1.618`, `2.618` or `4.236` of it. Type is a major third from a base derived the same way. A phone and a television were getting the same *pixels*; now they get the same *design*.
- **Panels grow with the type, which grows with the screen.** The About panel was narrow because it was capped at 440 fixed pixels. It is now sized in ems, and on any landscape screen with room it runs in **two columns** — story on the left, keys and settings on the right — taking the screen's own shape instead of ignoring it.

### The theme system
- **Four surfaces**: dark, light, and **pure black** and **pure white**. The flat modes move the colour off the background and into the number itself, so on OLED most of the panel is switched off and the distance signal still works — it has only changed which surface it lives on.
- **Five typefaces**: neutral, grotesk, serif, mono, display, each with its own hero weight and tracking. **No webfont**, deliberately: a file whose whole promise is that it needs nothing should not open a network connection to look like itself.
- `T` cycles surfaces, `Y` cycles faces, both per device.
- **Themes deliberately do not travel in the link.** A theme string was in the original design, and it is the one part not built: sending somebody a date must not restyle their screen. That is the same rule that keeps hue, size and sound out of the link.

### Choosing a date
- **A real calendar you tap**, because choosing a date is not the same act as reciting one. The title zooms out — days to months to years — so any date at all is three taps however far away it is. Quick row above it for the answers people usually want, time chips below.
- **Typing still works** and now steers the calendar rather than living beside it. `10m` is ten minutes, not ten months; months need `mo`. Minutes and hours count from now rather than landing at end of day, because "in 10 minutes" has an exact meaning.
- **It tells you when you have picked something already gone** — "already gone, so it will open as overdue" — rather than silently accepting it or refusing. Sometimes logging a missed deadline is exactly the point.

### Rhythm
- **The number beats like a heart** inside the last hour: two quick thumps and a long relaxation, the rhythm you already know, and the period shortens all the way to zero. Nothing above an hour, because a board four hundred days out has nothing to be tense about.
- **The ticks got the same shape** — a thump and an answering thump, climbing in pitch as it runs out.
- **Reduced motion turns the beat off** rather than speeding it up. The blanket rule that crushes every animation to `.01ms` turns an *infinite* animation into a strobe; that needed its own exception.
- **The whole board wanders a few pixels** over several minutes, on two coprime periods so the path never repeats. This thing is meant to be left on a screen for weeks and nothing should sit in the same pixels that long.

### Smaller, and mostly things that were wrong
- **The bottom bar is one measurement.** Everything is the same height, icons are square, and it is three groups instead of five loose buttons. It read as scattered because nothing shared a number.
- **Anything switched on is lit in that bar, and that is where you switch it off.** Sound, fullscreen, and keep-awake — which appears *only* while it is holding the screen open, since that is the only time you would look for it.
- **Sound has its own button** rather than being buried under `?`.
- **Auto colour change** — the old "hue drifts" — is off by default and says what it does. Hue steps by 5° rather than 15°.
- **The example board is clickable.** An example nobody can act on is a poster.
- **The QR panel says what a QR is for**, and has Copy link and Download — the download is drawn at twelve pixels a module with a real quiet zone, for printing.
- **Share offers "just the tool"**, a link with no goals on it, for handing somebody the thing rather than your deadline.
- **Done says three different things**, not one thing in three colours: on time needs one date, early and late need both, because the gap between them is the whole story. And late says *late*, not "delivered".
- **A CSS bug hid nothing.** `button.b{display:inline-flex}` silently overrode the browser's own `[hidden]{display:none}`, so the Done button stayed on screen when it was meant to be gone. Three tests caught it.
- **Tall panels open at the top.** `autofocus` on a button near the bottom scrolls a long panel to it.
- **`USAGE.md`** — a short guide, written so an LLM can generate a valid board link with no guessing: the grammar, the rules, worked examples, and the mistakes to avoid.
- The word "email" is gone. It is 2026.

### Under it
- 185 browser checks. **85 KB → 107 KB**, and that number now needs a plan rather than a note.

---

## 1.3.0 — unreleased

Mostly a bug release wearing a feature release's clothes. Several of
these were wrong from the first version and nobody had looked hard
enough at the screen.

### Wrong, now right
- **A missed deadline no longer throws confetti.** Crossing zero unmarked was firing the celebration — but the clock cannot know whether you finished, which is the entire reason the Done button exists. So zero on an unmarked deadline is a *miss*: it goes grey, says "past due", and sounds one low note. Something good arriving still celebrates, because arrival is the whole event.
- **Zero happens everywhere at once.** The number ticked at 10 Hz while the colour, the tag and the title waited for the next one-second render, so everything except the digits arrived up to a second late. The fast path now repaints the lot on the frame the rung changes.
- **Something good has no Done button.** There is nothing to complete; it arrives, and that is the end of it. The button was a button with no meaning.
- **Done is three colours, not one.** A delivery three weeks late looked exactly like one three weeks early. Early keeps the full arrival colour, on time is the same with the volume down, late fades most of the way to the grey overdue already uses. Generated by mixing, never stored.
- **Done says how early or how late.** "completed 14 Nov" is a fact with the interesting part removed. Now: "19 days late · 20 Aug 2026". That delta is the only part of Done a viewer cannot derive from the clock, so it is the part worth saying.
- **Share copies the one you are looking at, immediately.** It used to make you choose first. "Copy all 3 instead" is offered afterwards, as the alternative it always was. One goal gets no popover at all.

### Saying when
- **One field that takes what you would say out loud.** `friday 6pm`, `31 mar 2027`, `in 3 weeks`, `end of year`, `+10d`, `31/3/27`, `tomorrow 6:30pm`. Two native pickers was three interactions to say "friday".
- **It says back what it understood** — "Fri, 4 Sept 2026 · 6:00 pm" — so nothing is a guess, and it refuses rather than inventing: `31/2/2027` is not a date.
- A bare date still means the end of that day, so typing and pasting a link agree.
- The calendar is still one click away, sitting invisibly on top of its own icon, for the times you genuinely want to look at a month.

### Colour
- **Something good is violet to hot pink**, not violet to gold. The gold was muddy, and worse, it was close enough to the deadline's red to be confusable across a room. These two are not.
- **A hue control**, because which end of the spectrum the board sits at is taste, not information. Everything else in the ramp encodes distance and is not negotiable; this part is yours. `H` to turn it, `Shift+H` back. Per device, never in the link.
- **Hue drifts**, on by default: ±10° under the threshold of noticing, like the angle already does — and a full slow turn once something good has *arrived*, since that state is terminal and has no distance left to encode, so the colour is free to be purely celebratory.
- Rotation goes through HSL rather than a CSS `hue-rotate`, whose matrix skews saturation and would quietly undo the ramps. Overdue grey is left alone: turning a hue there would be inventing a signal.

### The empty board
- **It counts the rest of the year.** A dash and the words "set a goal" is a form with its fields missing. The number everybody already has a feeling about is how much of the year is left, so the empty board shows that — a working demonstration rather than a placeholder, and true, which a placeholder never is.
- **No dialog opens itself at you** any more. The board says what to press and the button is right there.

### Sound
- **On by default**, which is safe because of a rule rather than a hope: **a page nobody has touched never makes a sound.** A link somebody sent you, left open on a second monitor, cannot go off in a meeting. Once you have clicked or typed on it, you are using it. That guarantee is written down rather than left to browser autoplay policy, which differs by browser and is disabled entirely in automation.

### The About panel
- Links are no longer default-browser blue on a dark background, which was genuinely unreadable. Tighter story, one heading style, and the dialog stops focusing a link in the middle of a sentence when it opens.

### Under it
- 185 browser checks, up from 152 — twenty of them on the date parser alone, against a frozen Wednesday.
- **69 KB → 85 KB.** The date parser and the hue machinery are most of it. This is now a big small file, and the theme system will have to be measured against that before it earns a line.

---

## 1.2.0 — unreleased

Two things that do something, and one that was measured and dropped.

### A code to scan
- **`Q` draws a QR of the board.** A board on a projector is useless until the link is in somebody's hand, and nobody types a URL off a wall. Byte mode, error correction L, versions 1 to 10 — about 270 characters, which is a board with six or seven goals on it. Past that it says so, rather than drawing something unscannable.
- **Always dark on light, in both themes.** A code is not decoration; it either scans or it wastes somebody's time.
- **Verified against a real decoder**, not by eye. `npm run test:qr` renders each version and reads it back with `jsqr`. That is how the encoder bug below was found, and it is the only way this could have been trusted.
- **Bug the decoder caught:** from version 7 there are alignment patterns sitting *on* the timing lines. The obvious "skip any module already reserved" test drops them, and every code from v7 up came out unreadable while v1–v6 looked perfect. Only the three corners holding a finder should be skipped.

### A sound at zero, if you ask for it
- **`M` turns on ten ticks and a chime.** Off until somebody switches it on, per device, never in the link — a board that makes a noise in a room it was not invited into is a different and much worse product, which is what the old blanket "no sound" rule was really protecting against.
- **This one *is* remembered**, unlike keep-awake. The risk it carries is noise in the wrong room, and that only happens inside the last ten seconds of a deadline. The risk keep-awake carries is a flat battery next Tuesday, which happens whether you are looking or not.
- It is also the thing the tenths rung was built for.

### Measured and not built
- **The `z.` compressed fragment loses.** Measured on real boards: it is *longer* for one to four goals with long names, and longer at every single count with ordinary short names like "Ship" or "Launch". It only starts winning at five long-named goals, and only by 4%. The backlog's own rule was "only when it's actually shorter" — so it is not built, and the numbers are in `backlog.md` so it stops coming back.

### Under it
- **The desktop build was broken and CI proved it.** `desktop/dist/index.html` is generated, so it is gitignored, so the folder is empty, so git never creates it on a fresh checkout and `sync-dist.mjs` had nothing to copy into. A machine that had ever run a local build would never have seen this. It now makes the directory.
- 152 browser checks plus 9 decoder checks, up from 137.
- **55 KB → 69 KB.** The QR encoder is about 10 KB of that and it is by far the most expensive thing in the file. It earns it by being the only way a board gets off a wall and into a pocket — but this is the last one that gets to cost that much.

---

## 1.1.0 — unreleased

Shipped 1.0.0 first, then this. The order mattered: until the thing is
hosted somewhere, invariant 2 is a claim rather than a feature — there
is no link for anyone to receive.

### The number
- **Tenths in the last ten minutes**, mirrored for the first ten minutes over. The ramp went flat at the end: `3:00` and `0:03` ticked with the same texture, so the closing minutes felt identical to the opening ones. Now the board visibly accelerates into zero. The tenths are the one rung that is not a decision unit, and they are drawn small and dim to admit it — the seconds stay the number you read.
- **Reduced motion turns the rung off** rather than slowing it down. A digit flickering ten times a second is exactly what that setting is asking you not to do.
- **Only the hero repaints on a frame.** Chips, tab title and favicon stay on whole seconds. A tab title changing ten times a second is unreadable, and it keeps the OS awake for nothing.

### This screen
Four per-device controls, none of which travel in the link — sharing a board must never reach across and change somebody else's display.
- **Fullscreen** (`F`), and a button in the bar. One key turns any old laptop into a wall board; it was the highest-value line in the backlog and it is about fifteen lines of code.
- **Keep the screen awake** (`W`), for a phone propped on a desk. **Deliberately not remembered** — a setting that outlives the sitting is how a battery dies next week and nobody knows why.
- **Size of the number** (`+` `−` `0`), remembered per device. Scales the hero only; the supporting lines stay put, because the point is one number readable from further away, not a page that zooms. A big screen with no pointer starts bigger on its own, which is the whole of "TV mode".
- **Lock rotation**, which appears only when it could actually work — the browser API needs fullscreen or an installed app. A dead toggle is worse than no toggle.

### Under it
- **Update check.** A 200-byte `version.json`, once per open, online only. A quiet dot on `?` and one line in the panel; silent offline, silent when the host does not answer. Two candidate URLs tried in order, because a host that will not send CORS headers is invisible to a file opened from a disk.
- **A target written down to the second now parses.** It used to fail the regex and the goal simply vanished from the board. Zero seconds are still left out of the link, so ordinary links stay short.
- **The About panel scrolls** and the key map runs in two columns. It grew a section and ran off the bottom of the screen.
- 137 browser checks, up from 103.
- **40 KB → 55 KB.** Worth naming rather than hiding: a third bigger, for seven small things, and a good part of it is the comments explaining why. Still emailable, still one file. But the next feature that costs 15 KB has to argue for itself.

---

## 1.0.0 — unreleased

First working version.

**Renamed from Countdown to Baaki.** बाकी is Hindi for *what's remaining* — it is literally the number on the screen, it says itself in any accent, and it carries the Indian origin without borrowing a living man's name.

### The number
- **Mirrored overdue ladder** — `+M:SS` in the first hour, `+H:MM` in the first day, then `+N days`. The ramp was smooth going down and fell off a cliff going up; being late is information too.
- **Two goal kinds** — a deadline heats up and runs over, something good (`*`) glows, arrives and stops. Not everything you count toward is a threat, and an event that counts *up* afterwards is meaningless.
- **Gradient drifts** ±10° over 90 seconds. Alive without ever catching the eye.
- **Hero weight 200 → 300.** It read as thin at large sizes on Windows.

### Goals
- **Edit an existing goal.** Retyping a goal to fix a typo is how people quietly stop using a tool.
- **Focus rotates instead of promoting.** Pulling a goal to the front scrambled the order, so "previous" could not undo "next".
- **Chips cap at 7**, the rest collapse to `+n more`. Past that the board stops being glanceable, which is the only thing it is for.
- **Snark at 10+ goals**, picked at random from fifteen lines. Fifteen countdowns is a project plan in disguise. We don't block it; we mention it.

### Interface
- **Keyboard map** — arrows and Tab cycle, digits jump, `g` `s` `d` `t` `?`. It's a wall board; you shouldn't have to aim a mouse.
- **Swipe** left/right on touch.
- **Share offers "this one" or "all n".** Sharing five when you meant one is a small betrayal.
- **Dialog is centred and closes on an outside click.** It was doing neither.
- **About panel** with the Sreedharan story, बाकी, and the keyboard map — so the origin is visible and the main screen stays clean.

### Under it
- 103 browser checks against a frozen clock. Every date boundary is a test, because that is where every bug so far has lived.
- Optional Cloudflare worker for online "Done", off by default.
- Optional GA4, off by default, online only.
- Tauri desktop wrapper — **written but never compiled**, because the build machine has Visual Studio without the Windows SDK. Treat as unverified until CI builds it.
