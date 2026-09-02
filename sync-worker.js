/* ---------------------------------------------------------------
   Optional. Only needed if you want "Done" to reach other people
   without pasting a link.

   A file cannot talk to another file. This is the smallest thing
   that lets them: a key-value store that remembers, for one goal,
   the moment it was marked done. Nothing else. No accounts, no
   goal names, no user data - just a hash and a timestamp.

   Deploy on Cloudflare (free tier is far more than enough):

     npm create cloudflare@latest countdown-sync -- --type=hello-world
     # replace src/index.js with this file
     npx wrangler kv namespace create DONE
     # put the returned id into wrangler.toml as:
     #   [[kv_namespaces]]
     #   binding = "DONE"
     #   id = "<the id>"
     npx wrangler deploy

   Then put the deployed URL into countdown.html:
     var SYNC_URL = 'https://countdown-sync.<you>.workers.dev';

   Offline it does nothing and the page carries on. The link still
   carries the done stamp, so the offline path never stops working.
--------------------------------------------------------------- */

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
};
const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', ...CORS } });

const KEY_OK = /^[a-z0-9]{1,16}$/;                       // the page sends a short base-36 hash
const STAMP_OK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;      // local time, no seconds

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (request.method === 'GET') {
      const k = new URL(request.url).searchParams.get('k') || '';
      if (!KEY_OK.test(k)) return json({});
      const done = await env.DONE.get('g:' + k);
      return json(done ? { done } : {});
    }

    if (request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
      const { k, done } = body || {};
      if (!KEY_OK.test(k || '') || !STAMP_OK.test(done || '')) return json({ error: 'bad input' }, 400);

      // First press wins. Someone re-opening an old link cannot rewrite history.
      const existing = await env.DONE.get('g:' + k);
      if (existing) return json({ done: existing });

      await env.DONE.put('g:' + k, done, { expirationTtl: 60 * 60 * 24 * 365 * 2 });
      return json({ done });
    }

    return json({ error: 'method' }, 405);
  },
};
