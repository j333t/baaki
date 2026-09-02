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
