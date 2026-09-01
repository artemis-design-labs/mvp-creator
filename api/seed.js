import { kv } from '@vercel/kv';

const INDEX_KEY = 'mvp:index';

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
    const existing = await kv.get(INDEX_KEY);
    if (existing?.projectIds?.length) {
      return res.status(409).json({
        error: 'KV already has data. Pass ?force=true to overwrite.',
        existingCount: existing.projectIds.length,
      });
    }
  }

  const { projects, selectedId } = body;

  // Store each project individually to stay within Upstash request size limits
  await Promise.all(projects.map(p => kv.set(`mvp:project:${p.id}`, p)));
  await kv.set(INDEX_KEY, {
    projectIds: projects.map(p => p.id),
    selectedId: selectedId ?? projects[0]?.id ?? null,
  });

  res.json({ ok: true, seeded: projects.length });
}
