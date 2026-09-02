# Easter eggs

**None of these are built.** This is a wish list plus the shape of the machine that would run them.

## The hook, first

Eggs should not be twenty `if` statements scattered through `render()`. One registry, one shape:

```js
EGGS.push({
  id:    'palindrome',
  when:  function(ctx){ return ctx.mode === 'days' && isPalindrome(String(ctx.days)); },
  then:  function(ctx){ ctx.flash('nice.'); },
  once:  'per-value'          // once | per-value | per-session | always
});
```

`ctx` is everything an egg could reasonably want, and nothing more:

| | |
|---|---|
| `days` `ms` `mode` | where the ladder is right now |
| `goal` | name, target, kind, done |
| `count` | how many goals on the board |
| `now` | local date |
| `theme` `dark` | what it looks like |
| `keys` | recent keystrokes, for combos |
| `visits` `streak` | how often this link gets opened |

And a small, deliberately boring action surface — eggs may **not** do anything a normal feature couldn't:

`ctx.flash(text)` · `ctx.confetti(palette, spec)` · `ctx.tint(c1, c2, seconds)` · `ctx.wobble()` · `ctx.swapUnit(word)` · `ctx.sound()` *(only ever on a real keypress, never on a timer)*

**Themes carry their own eggs.** A theme file can ship an `eggs: []` array. That's the extensibility — no plugin API, just data, same as everything else. Eggs from a link are sandboxed to that action surface and cannot run arbitrary code; a theme is data, and data that can execute is a security hole with a bow on it.

**Rule:** an egg may never change the number, block the view, or make a sound you didn't ask for. It's a wink, not an interruption.

---

## The list

### Numbers being numbers
- **Palindrome days** — 101, 202, 313. A quiet `nice.`
- **404 days left** — "days not found."
- **42 days** — the unit label changes to `days · the answer`.
- **1000, 500, 100, 10** — a single confetti puff on the round ones. Milestones you didn't ask for.
- **Repdigits** — 111, 222, 777. The number breathes once.
- **69 / 420** — the unit label goes `days · grow up`. Then never again that session.
- **The number equals today's date** — "spooky."
- **Prime days**, for a mono/terminal theme only — a tiny dot beside the number. Nerds will find it.
- **Fibonacci days** (…89, 144, 233, 377) — the gradient briefly does a golden-ratio angle.
- **13 days, on a Friday** — everything desaturates for two seconds, then recovers.

### Time being time
- **Opened at 00:00 exactly** — "you're up late. or early. either way."
- **11:11** — the colon holds its breath for a second.
- **The last 10 seconds** — the number gets very slightly bigger with each tick. Nothing else. Nobody who isn't watching will see it.
- **Opened on the anniversary of the goal's creation** — "one year of this."
- **New Year's Eve, and a goal lands at midnight** — the confetti gets a second barrel.
- **Opened during a leap second** — realistically unreachable, and that's the joke. Whoever hits it gets a permanent badge in `localStorage`.

### Behaviour
- **Opened the same link 100 times** — "you know it's still that many days, right?"
- **Opened every day for 30 days** — a small `बाकी` appears under the number. Stays.
- **Nine goals added in one sitting** — the snark line arrives one goal early, out of concern.
- **Marked Done more than a month early** — "showing off."
- **Marked Done in the last 60 seconds** — "cutting it fine."
- **A goal sits 100+ days overdue** — the grey very slowly warms back to a dull ember. It refuses to be forgotten.
- **Every goal on the board is done** — the whole background goes gold for ten seconds, once.
- **Deleted every goal** — "so that's it then?" for two seconds, then the empty state.

### Keys and gestures
- **The Konami code** — the gradient inverts for thirty seconds. Obviously.
- **Typing `sreedharan`** — the about panel opens on his section.
- **Typing `metro`** — the gradient becomes the Delhi Metro line colours, briefly.
- **Holding `b`** — बाकी fades in behind the number, watermark-sized, while held.
- **Shaking a phone** — the confetti of whatever tier the goal is at. Pure indulgence.
- **Pressing `t` ten times fast** — "make your mind up."

### Names
- **A goal named "the end" / "death" / "heat death of the universe"** — a special sombre theme, and the ladder refuses to show seconds.
- **A goal named after a person** — no. Deliberately no. Some things shouldn't be clever.
- **A goal named "birthday"** — auto-detects as an event even without the `*`, and says so once so it isn't spooky.
- **Emoji-only goal name** — the hero number adopts the emoji's dominant colour as its ramp anchor.
- **A goal named "baaki"** — recursion joke, to be determined.

### Rare and structural
- **Two goals with the exact same target** — a hairline connects their chips.
- **A goal set in the past at creation time** — "starting late. respect."
- **A goal more than 50 years out** — "optimistic." The gradient goes to near-black and stays.
- **Exactly 0 days, 0 hours, 0 minutes, 0 seconds on load** — the rarest one. Full celebration regardless of kind, plus `perfect timing`.

---

## Vetting

Eggs bypass the rubric's **glance** test by design — they're invisible until they aren't. They still must pass:

- **Weight** — the whole registry stays under 2 KB, or it's not worth it.
- **Never in the way** — no egg blocks, blinks, moves the number, or makes noise unprompted.
- **Discoverable by accident, not by hunting** — if it needs a wiki, it's a feature, not an egg.
- **Never on a shared link's first open** — a stranger's first impression should be the plain, serious thing.
