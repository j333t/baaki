/* ---------------------------------------------------------------
   Optional. Only needed if you want a link to show a preview card in
   WhatsApp, Slack, Discord, iMessage and the rest, instead of a bare
   blue URL.

   Why this cannot live in baaki.html
   ---------------------------------
   Everything after "#" is never sent to a server. That is exactly why
   nothing about a goal can leak - and exactly why a crawler cannot see
   one either. Crawlers also do not run scripts, so no amount of
   JavaScript will change a preview. The only way a preview bot can
   learn the goal is for the goal to travel in the query string, and
   for something to be listening.

   What this does, and what it deliberately does not
   -------------------------------------------------
   Does:  rewrites og:title and og:description per link, so a chat
          thread shows "Board exam - 171 days left - 12 Mar 2027"
          instead of a URL. Serves a live SVG badge at /img for
          READMEs, Notion pages and anywhere else an <img> is allowed.
   Does not: store anything, set a cookie, or need an account. It reads
          the query string of the request it was handed and forgets it.

   The image stays static by default
   ---------------------------------
   Chat apps will not render an SVG as og:image, so a per-link *image*
   needs a rasteriser. That is a wasm build step, and it is optional -
   see RASTERISER below. The per-link *text* is the bulk of the value
   and needs none of it: "Wedding - 212 days" in the title line is
   already the difference between a link people click and a link people
   scroll past.

   A card is a snapshot, not a clock
   ---------------------------------
   Previews are fetched once per URL and cached on the platform's own
   CDN, often for weeks. So this only ever states what survives being
   days out of date: whole days, or "today"/"tomorrow", never a running
   time - and always with the target date beside the number, so a stale
   card quietly corrects itself.

   Deploy on Cloudflare (free tier is far more than enough):

     npm create cloudflare@latest baaki-og -- --type=hello-world
     # replace src/index.js with this file (the .mjs here is only so
     # node can check it in place - Cloudflare wants modules syntax and
     # this repo is commonjs), then in wrangler.toml:
     #   [vars]
     #   ORIGIN = "https://<you>.github.io/baaki"
     npx wrangler deploy
     # finally, route baaki.j33t.pro/* at the worker, and set
     #   var OG_HOST = 'https://baaki.j33t.pro';
     # in baaki.html so Share starts handing out "?b=" links.

   Until OG_HOST is set, none of this is reachable and Share keeps
   giving out the private "#" form. Nothing half-deployed changes what
   anybody already has.
--------------------------------------------------------------- */

const TAGLINE = 'Count anything down. Send it to anyone. No account, ever.';
const DAY = 864e5;

/* ---------- the link grammar, the half of it a card needs ----
   Deliberately not the whole parser from baaki.html. A card states a
   name, a number of days and a date; window starts, done stamps and
   sub-day precision change none of those. Keeping this small is what
   stops it drifting out of step with the real one. */
export function parseBoard(b) {
  if (!b) return [];
  const out = [];
  for (const tok of String(b).replace(/^#/, '').replace(/ /g, '+').split('+')) {
    if (!tok || tok.indexOf('~') === -1) continue;
    const i = tok.indexOf('~');
    let name;
    try { name = decodeURIComponent(tok.slice(0, i)).trim(); } catch { name = tok.slice(0, i); }
    let rest = tok.slice(i + 1);

    const bang = rest.indexOf('!');
    const done = bang !== -1;
    if (done) rest = rest.slice(0, bang);

    /* a window carries start~end; only the end is a deadline */
    const w = rest.indexOf('~');
    if (w !== -1) rest = rest.slice(w + 1);

    let event = false, since = false;
    if (rest.endsWith('*')) { event = true; rest = rest.slice(0, -1); }
    else if (rest.endsWith('^')) { since = true; rest = rest.slice(0, -1); }
    else if (rest.length > 1 && rest.charAt(rest.length - 2) === '#' && 'wmy'.includes(rest.slice(-1))) {
      rest = rest.slice(0, -2);
    }
    rest = rest.split('@')[0];                       /* the zone changes no day count */

    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(rest);
    if (!m) continue;
    out.push({
      name: name || 'Goal',
      y: +m[1], mo: +m[2], d: +m[3],
      utc: Date.UTC(+m[1], +m[2] - 1, +m[3]),
      event, since, done
    });
  }
  return out;
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateLabel = g => `${g.d} ${MON[g.mo - 1]} ${g.y}`;

/* Whole days only. A card that says "3h 12m" is lying by the time
   anybody sees it; a card that says "171 days" is at worst a little
   out, and the date beside it says by how much. */
export function daysLeft(g, now) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((g.utc - today) / DAY);
}

export function cardText(goals, now = new Date()) {
  if (!goals.length) {
    return { title: 'Baaki — a deadline in a link', description: TAGLINE };
  }
  const g = goals[0], n = daysLeft(g, now);
  const when =
    g.done ? 'Done' :
    n === 0 ? 'Today' :
    n === 1 ? 'Tomorrow' :
    n > 0 ? `${n} days` :
    n === -1 ? 'Yesterday' :
    `${-n} days ago`;

  const rest = goals.length - 1;
  const also = rest ? ` · and ${rest} more on the board` : '';
  return {
    title: `${g.name} — ${when}`,
    description: `${dateLabel(g)}${also}. ${TAGLINE}`
  };
}

/* ---------- the badge ---------------------------------------
   The one output that is genuinely live inside somebody else's page:
   an <img> is re-fetched, so a README or a Notion page shows today's
   number rather than the number on the day it was pasted. SVG is fine
   here - it is an ordinary image tag, not a crawler. */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function badgeSvg(goals, now = new Date()) {
  const g = goals[0];
  const label = g ? g.name : 'Baaki';
  const value = g ? (g.done ? 'done' : (() => {
    const n = daysLeft(g, now);
    return n === 0 ? 'today' : n === 1 ? 'tomorrow' : n > 0 ? `${n}d` : `${-n}d ago`;
  })()) : '—';

  /* No webfont, same as the page itself, so the widths are an estimate
     rather than a measurement. 6.6px per character at 12px is close
     enough for a pill and never clips. */
  const lw = Math.round(label.length * 6.6) + 16;
  const vw = Math.round(value.length * 6.9) + 18;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + vw}" height="24" role="img" aria-label="${esc(label)}: ${esc(value)}">
<title>${esc(label)}: ${esc(value)}</title>
<rect width="${lw + vw}" height="24" rx="6" fill="#0a1530"/>
<rect x="${lw}" width="${vw}" height="24" rx="6" fill="#193a72"/>
<rect x="${lw}" width="8" height="24" fill="#193a72"/>
<g font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="12" fill="#e8ecf6">
<text x="${lw / 2}" y="16" text-anchor="middle" opacity=".78">${esc(label)}</text>
<text x="${lw + vw / 2}" y="16" text-anchor="middle" font-weight="600">${esc(value)}</text>
</g>
</svg>`;
}

/* ---------- putting the tags into the page ------------------
   Replace rather than append: the static card is already in the HTML,
   and two og:title tags is undefined behaviour that every platform
   resolves differently. */
export function inject(html, { title, description }) {
  return html
    .replace(/<meta property="og:title"[^>]*>/i,
             `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/i,
             `<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta name="twitter:title"[^>]*>/i, '')
    .replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
}

/* RASTERISER (optional, and a build step)
   ---------------------------------------
   To make the *image* per-link as well, add @resvg/resvg-wasm to the
   worker, render an SVG of the card, and serve it from /card.png -
   then rewrite og:image to point at it with the same ?b=. Chat apps
   will not accept the SVG directly, which is the only reason this is
   not already here. The text above needs none of it and is most of
   the win, so it ships first and alone. */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = (env && env.ORIGIN) || '';
    /* Not searchParams.get: that applies form-decoding, which turns
       "+" into a space - and turns the "%20" inside "Board%20exam"
       into one too. Once both are spaces nothing can tell the
       separator from the name, and every goal with a space in it
       splits in half. The raw value keeps them distinct. */
    const raw = /[?&]b=([^&]*)/.exec(url.search);
    const b = raw ? raw[1] : '';

    if (url.pathname === '/img' || url.pathname === '/img.svg') {
      return new Response(badgeSvg(parseBoard(b)), {
        headers: {
          'content-type': 'image/svg+xml; charset=utf-8',
          /* Short, because the whole point is that it counts down.
             Long enough that a popular README is not a traffic bill. */
          'cache-control': 'public, max-age=1800',
          'access-control-allow-origin': '*'
        }
      });
    }

    const upstream = await fetch(origin + url.pathname + (url.pathname.endsWith('/') ? '' : ''), request);

    /* Only an HTML page carrying a board gets rewritten. Everything
       else - the icons, the manifest, version.json - goes straight
       through untouched. */
    const type = upstream.headers.get('content-type') || '';
    if (!b || !type.includes('text/html')) return upstream;

    const html = inject(await upstream.text(), cardText(parseBoard(b)));
    const headers = new Headers(upstream.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'public, max-age=600');
    return new Response(html, { status: upstream.status, headers });
  }
};
