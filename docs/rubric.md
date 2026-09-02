# The rubric

Baaki dies by bloat, not by lack of features. Every idea is charming in isolation;
twenty charming ideas is a control panel. This is the gate.

**A feature ships only if it passes all four tests.** Not three.

| # | Test | Fails if |
|---|---|---|
| 1 | **Glance** | You have to *read* it. If it can't be understood in one second from across a room, it doesn't belong on the main screen. |
| 2 | **Cold open** | It needs setup. Someone who was just sent a link must get full value with zero configuration. Anything requiring a choice hides behind a key or a dialog. |
| 3 | **Weight** | It costs more than ~2 KB, or needs the network to work. The file must stay emailable and fully functional offline. |
| 4 | **One primitive** | It introduces a new concept. Extend `goal`, `kind`, `theme`, or the link format. A genuinely new concept must kill an old one. |

**Tiebreak, when all four pass and it still feels wrong:** *would Sreedharan have put it on the board?* He had one number and a wall. That is the taste anchor.

## How to score an idea

Write it as one line, then mark each test `pass` / `fail` / `needs work`. Anything with a
`fail` goes to `backlog.md` with the failing test named — not deleted, because constraints
change and a `fail` on weight today can be a `pass` after a refactor.

Example:

> **Per-goal notes field** — glance: **fail** (text you must read). cold open: pass.
> weight: pass. one primitive: pass. → *backlog, fails glance.*

> **Overdue ladder** — glance: pass. cold open: pass. weight: pass (~400 b).
> one primitive: pass (extends the existing ladder). → **build.**

## Where features go when they pass

1. Build it.
2. Add a case to `test.mjs`, especially if a date boundary is involved.
3. Log it in `features.md` with **why it exists**, not what it does.
4. Add a line to `CHANGELOG.md` with the reason, not the diff.

## Standing "no" list

Ideas that are permanently out, so they stop coming back:

- **Accounts / login / cloud sync of goals.** Kills invariant 2.
- **A plugin or extension API.** Themes-as-data is the extension surface. Anything more is a framework.
- **Notifications and reminders.** This is a board, not a nag. A board you walk past works because it never interrupts.
- **Editing someone else's shared goal.** There is no server; "permission" would be theatre.
- **Progress bars / percentage complete.** A countdown knows time, not work done. A percentage would be a lie.
