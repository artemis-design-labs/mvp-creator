import { kv } from '@vercel/kv';

const DATA_KEY = 'mvp:data';

// One-time migration endpoint. POST your local api/data.json here to seed KV.
// Set SEED_SECRET in Vercel env vars and pass it as the x-seed-secret header.
// The endpoint refuses to overwrite existing data unless ?force=true is passed.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.SEED_SECRET;
  if (secret && req.headers['x-seed-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized — set x-seed-secret header' });
  }

  const body = req.body;
  if (!body?.projects || !Array.isArray(body.projects)) {
    return res.status(400).json({ error: 'Expected { projects: [...] }' });
  }

  const force = req.query.force === 'true';
  if (!force) {
    const existing = await kv.get(DATA_KEY);
    if (existing?.projects?.length) {
      return res.status(409).json({
        error: 'KV already has data. Pass ?force=true to overwrite.',
        existingCount: existing.projects.length,
      });
    }
  }

  await kv.set(DATA_KEY, body);
  res.json({ ok: true, seeded: body.projects.length });
}
