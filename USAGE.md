# Baaki — how to use it, and how to generate one

**Baaki** is a countdown board. The whole state lives in the URL fragment, so a link
*is* the board. There is no server, no account, and nothing to call.

Open: <https://j333t.github.io/baaki/>

---

## For an LLM or a script

To hand someone a countdown, build a URL and give it to them. That is the entire API.

```
https://j333t.github.io/baaki/#<goal>[+<goal>...][+!edit]
```

### Grammar

```
goal      := name "~" [ start "@" zone "~" ] target [ "@" zone ] [ kind ] [ "!" done [ "@" zone ] ]
name      := percent-encoded text, no "+" or "~" left raw
target    := YYYY-MM-DD
           | YYYY-MM-DDTHH:MM
           | YYYY-MM-DDTHH:MM:SS
start     := same shapes as target - present only on a window goal
done      := same shapes as target
zone      := percent-encoded IANA zone, e.g. Asia%2FKolkata - only ever present
             alongside a real time, never on a bare date
kind      := "*"                     goal is something good, not a deadline
           | "^"                     goal counts up from target, forever (since)
           | "#w" | "#m" | "#y"      goal recurs weekly / monthly / yearly
           (a window goal carries no kind marker - the "start ~" before
            target is itself the tell, and a window is never combined
            with one of the above)
"!edit"   := a standalone token; shows the Done button
```

### The rules that matter

1. **A bare date (no time) is local to whoever opens it, on purpose.** `2027-03-31`
   means "end of that day, wherever you are" - there is deliberately no timezone on a
   bare date.
2. **A timed date carries a zone.** `2026-09-02T18:00@Asia%2FKolkata` is a fixed
   instant, not a wall-clock hour - it lands at the same moment everywhere, converted
   for whoever opens it. Leave the zone off and a timed date is read as the opener's
   own local time instead.
3. **A bare date means the end of that day - unless it's already past.** `2027-03-31`
   is 23:59:59 on the 31st. A bare date already in the past on a plain goal (no `*`,
   `^`, or `#`) is read as a since instead: it means the *start* of that day, and
   counts up from there rather than being an error.
4. **The first goal is the big one.** Order is focus; there is no separate field.
5. **Percent-encode names.** Spaces become `%20`. A literal `+` or `~` inside a name
   must be encoded (`%2B`, `%7E`) or it will split the goal.
6. **Leave `!edit` off** when you are giving the link to someone else. With it, they
   see a Done button; without it, they just see the board.
7. **Five kinds, one goal shape.** A `*` goal counts down, celebrates on arrival, and
   stops. A `^` goal only ever counts *up*, forever, from `target`. A `#w`/`#m`/`#y`
   goal behaves like a plain deadline but rolls its own target forward, one cycle at a
   time, the first time it is both done and past due. A window goal (`start ~ target`)
   counts down to `start` like something good, then the instant `start` arrives it
   switches to counting down to `target` like a deadline - no Done button until that
   switch has happened. A plain goal counts down and then keeps counting up past zero,
   in grey, until marked done.

### Examples

One deadline:
```
https://j333t.github.io/baaki/#Metro%20Phase%202~2027-11-03
```

A deadline with a time, plus a festival, plus a milestone:
```
https://j333t.github.io/baaki/#Tender%20closes~2026-10-15T17:00+Diwali~2026-11-08*+Trials~2026-12-01
```

Something that was delivered nineteen days late:
```
https://j333t.github.io/baaki/#Tender~2026-08-01!2026-08-20
```

Something running since a fixed start, counting up, not down:
```
https://j333t.github.io/baaki/#Sober~2026-01-01^
```

Rent, due on the 1st of every month, until it's deleted:
```
https://j333t.github.io/baaki/#Rent~2026-10-01#m
```

An exam that opens at 10am and closes at noon - one link, right view either side of
the start:
```
https://j333t.github.io/baaki/#Exam~2026-10-12T10:00~2026-10-12T12:00
```

A meeting at a fixed instant, readable correctly in any timezone:
```
https://j333t.github.io/baaki/#Standup~2026-09-10T18:00@Asia%2FKolkata
```

An empty board, for someone to fill in themselves:
```
https://j333t.github.io/baaki/
```

### What not to do

- Don't invent query parameters. There are none; everything is in the fragment.
- Don't send more than about seven goals. Past that the board stops being glanceable,
  and it will say so.
- Don't put an offset or a `Z` in a target (no `+05:30`, no trailing `Z`). Use the
  separate `@zone` suffix instead — an IANA name, percent-encoded, and only on a timed
  target, never a bare date.
- Don't try to set colours, fonts or sound in the link. Those are per-device settings
  and deliberately cannot travel — a link you send must not restyle someone's screen.

---

## For a person

**Add a goal:** press <kbd>G</kbd>. Pick a day from the calendar, or type
`friday 6pm`, `in 3 weeks`, `31 mar 2027`, `end of year`. `10m` is ten minutes;
months need `mo`.

**Leave it somewhere you pass.** A pinned tab shows `D-427 · Metro Phase 2` in the
title. <kbd>F</kbd> turns any spare laptop into a wall board. <kbd>W</kbd> stops the
screen sleeping.

**Send it.** <kbd>S</kbd> copies the board you are looking at. <kbd>Q</kbd> draws a QR
code, so somebody across a room can point a phone at it and get the same board.

**Mark it done.** <kbd>D</kbd>. You get early, on time, or late — each looks different
and says how far off it was. The clock cannot know you finished, which is why the
button exists.

### Keys

| | |
|---|---|
| <kbd>←</kbd> <kbd>→</kbd> <kbd>Tab</kbd> | move between goals |
| <kbd>1</kbd>–<kbd>9</kbd> | jump to one |
| <kbd>G</kbd> | goals |
| <kbd>S</kbd> | share |
| <kbd>Q</kbd> | a code to scan |
| <kbd>D</kbd> | mark done |
| <kbd>F</kbd> | fullscreen |
| <kbd>W</kbd> | keep the screen awake |
| <kbd>M</kbd> | sound |
| <kbd>T</kbd> | dark / light / black / white |
| <kbd>Y</kbd> | typeface |
| <kbd>H</kbd> | shift the hue (<kbd>Shift</kbd>+<kbd>H</kbd> back) |
| <kbd>+</kbd> <kbd>−</kbd> <kbd>0</kbd> | size of the number |
| <kbd>?</kbd> | everything, including these |

Anything under <kbd>?</kbd> is kept on your device and never travels in a link.
