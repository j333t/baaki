# Backlog — ideas, not commitments

Nothing here is built. Each line is scored against `rubric.md`.
A **fail** names the test it fails, so we know what would have to change.

---

## Next up (all four tests pass)

| Idea | Note |
|---|---|
| **Theme system** — five font directions (neutral, grotesk, serif, mono, display), pure black / pure white, drop-or-paste a theme file | The big one. Absorbs fonts, colours, motion and shareable customisation into a single primitive. Design settled: three colour anchors per mode, generated ramps, JSON to author and a compact string to travel. |
| **Fonts via CDN with system fallback** | Typography degrades gracefully offline. The service worker should cache the font files on first online visit, so after one online open it's identical offline too. |
| **`z.` compressed fragment** | `CompressionStream('deflate-raw')`, zero dependency. Only when it's actually shorter — measured, it *loses* below ~200 chars and wins 58% at 12 goals. |
| **Update check** | A version constant plus a 200-byte `version.json`. Downloaded files can't be reached any other way. Must fail silently offline. |

## Per-device (point 15)

Cheap wins first.

| Idea | Score |
|---|---|
| **Keep screen awake** (Wake Lock API) | pass ×4. Obvious for a board left on a spare monitor or a phone on a desk. Needs a visible toggle so nobody's battery dies by surprise. |
| **Size the number: `+` / `−` / reset** | pass ×4. Scales *only* the hero, not the supporting text — that's the whole point. Persists per device, not in the link, because it's about the screen you're at. |
| **TV / large-screen mode** | pass ×4, falls out of the above. Auto-pick a bigger step when the viewport is huge and no pointer is present. |
| **Rotation lock on mobile** | pass ×3, cold open **needs work** — Screen Orientation API only works in fullscreen/installed mode, so it must appear *only* when it can actually work. |
| **Fullscreen / kiosk button** | pass ×4. One keypress to turn any old laptop into a wall board. Probably the highest value item in this table. |
| **Gyroscope parallax on the gradient** | glance: pass. weight: pass. **fails "one primitive"** — a whole new input for a decorative effect. Fun though. Revisit if a theme wants it. |
| **Ambient light sensor → auto dark/light** | **fails cold open** — near-zero browser support, would need a fallback anyway. |
| **Android home-screen widget** | **fails weight** — needs a real store app. Out of scope until there's demand. |
| **Lock-screen / wallpaper generator** | **fails weight** (per-OS scripting) but it is the truest form of the Sreedharan idea — a number on a wall you don't even open. Worth revisiting as a separate tiny tool. |

## Sharing and distribution

| Idea | Score |
|---|---|
| **Link shortener on the worker** | **fails weight** — a short link is a pointer, so it needs the network. Fine as an explicitly online convenience, never the default. |
| **QR code for the current link** | pass ×4, ~1 KB with a tiny generator. Genuinely useful for putting a board on a phone from a projected screen. |
| **Export as PNG** | glance n/a. **fails "one primitive"** unless it reuses the existing canvas. Cheap if it does. |
| **`.ics` calendar export** | **fails one primitive.** Also: if it's in your calendar you don't need a board. |

## Rejected, with reasons

Kept so they stop resurfacing.

| Idea | Why not |
|---|---|
| Per-goal notes / description | Fails glance. Text you must read is the opposite of this tool. |
| Sub-tasks, dependencies, Gantt | It's a board, not a project manager. Two different products. |
| Recurring countdowns | Ambiguous at every edge (what does "done" mean on a repeat?) and nobody asked. |
| Sound on zero | Fails "never a distraction". A board is silent. |
| Percentage complete / progress ring | A countdown knows time, not work. Any percentage would be a lie. |
| Multiple boards / folders | If you need folders you have too many goals, and there's a snark line for that. |
