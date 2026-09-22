# Turning on link previews

Right now a Baaki link shows the **same card** everywhere you paste it — 365, the name,
the tagline. That already works and needs nothing from you.

This page is how you make the card say the *actual goal*: "Board exam — 171 days"
instead of the generic one. About 20 minutes. You need a free Cloudflare account.

If you never do this, nothing breaks. Every link keeps showing the static card.

---

## What you are actually turning on

A tiny program sits in front of the site. When WhatsApp (or Slack, or Discord) fetches a
link to draw its preview, the program reads the goal out of the link and writes it into
the preview's title. Then it gets out of the way.

It stores nothing. No database, no account, no cookie. It reads the link it was handed
and forgets it.

**The one thing to be clear-eyed about:** after this, the goal's *name* passes through
your server on the way to being drawn. Not stored — but it does pass through, and the
rendered card sits on WhatsApp's servers afterwards. A goal called "Divorce hearing"
would go through that path. Anyone can switch it off per device under **? → This screen
→ Link previews**, and their links go back to carrying nothing readable.

---

## Step 1 — Get a Cloudflare account

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up. Free is fine —
this uses a rounding error of the free tier.

## Step 2 — Move the domain's DNS to Cloudflare

Your domain is `j33t.pro`. Cloudflare needs to be the thing answering for it.

1. In Cloudflare, click **Add a site**, type `j33t.pro`, pick the **Free** plan.
2. It will scan your existing DNS records and show you a list. Check that
   `baaki` is in there pointing at GitHub. If it isn't, add it — same value your
   current DNS host has.
3. Cloudflare gives you **two nameservers**. Copy them.
4. Go to wherever you bought `j33t.pro` and replace the nameservers there with those two.
5. Wait. Usually minutes, sometimes a few hours. Cloudflare emails you when it's live.

**Nothing changes for visitors during this.** The site keeps working the whole time.

## Step 3 — Put the program up

Open a terminal in the `countdown` folder and run these one at a time:

```bash
npm create cloudflare@latest baaki-og -- --type=hello-world
```

Answer its questions: no to TypeScript, no to git, **yes** to deploy. It will open a
browser to log you in.

Then:

```bash
cd baaki-og
```

Now two file edits:

1. **Replace `src/index.js`** with the contents of `og-worker.mjs` from the countdown
   folder. Delete everything in `src/index.js` first, then paste.

2. **Open `wrangler.toml`** and add these two lines at the bottom:

   ```toml
   [vars]
   ORIGIN = "https://j333t.github.io/baaki"
   ```

Then push it up:

```bash
npx wrangler deploy
```

## Step 4 — Point the domain at it

Back in the Cloudflare dashboard:

1. Open your worker (**Workers & Pages** → `baaki-og`).
2. **Settings** → **Domains & Routes** → **Add** → **Route**.
3. Route: `baaki.j33t.pro/*`
4. Zone: `j33t.pro`
5. Save.

## Step 5 — Flip the switch in Baaki

Open `baaki.html`, find this line near the top (search for `OG_HOST`):

```js
var OG_HOST  = '';
```

Change it to:

```js
var OG_HOST  = 'https://baaki.j33t.pro';
```

Then bump the cache so people get the new version — open `sw.js`, find
`const CACHE = 'baaki-v13'`, make it `v14`.

Commit and push. GitHub Pages publishes in a minute or two.

## Step 6 — Check it actually worked

1. Open Baaki, add a goal, press **S** to copy the link.
2. The link should now start with `https://baaki.j33t.pro/?b=` — if it still has a `#`,
   the `OG_HOST` edit didn't land or the browser is showing a cached copy. Hard-refresh.
3. Paste that link into **[opengraph.xyz](https://www.opengraph.xyz)** and press enter.
   You should see your goal's name and the days remaining in the title.
4. Paste it into a WhatsApp chat with yourself. Give it a few seconds to draw.

If the preview shows the generic "Baaki — a deadline in a link" instead of your goal,
the route in Step 4 isn't catching. Check it says `/*` on the end.

---

## What you get afterwards

**Previews with the real goal in them**, in WhatsApp, Slack, Discord, iMessage,
Telegram, LinkedIn — anywhere that draws a link preview.

**A live badge** you can drop in a README, a Notion page, or an email:

```markdown
![](https://baaki.j33t.pro/img?b=Launch~2027-03-31)
```

That one re-draws every time the page loads, so it's genuinely a countdown and not a
picture of one.

---

## Two things this does *not* do

**The picture stays the same.** The *words* of the preview change per link; the image is
still the 365 card. Making the image per-link needs a graphics library compiled into the
worker — real work, small payoff, and the title line is where the eye lands anyway. It's
logged in `backlog.md` if you ever want it.

**The preview is a snapshot, not a clock.** WhatsApp fetches a preview once and keeps the
result for weeks. Whoever opens the chat later sees the number as it was when the link
was first sent. That's why the card only ever says whole days and always prints the
target date next to the number — a stale card corrects itself.

---

## Undoing it

Set `OG_HOST` back to `''` and push. Everything goes back to private `#` links and the
static card, immediately. The worker can sit there doing nothing, or you can delete it.
