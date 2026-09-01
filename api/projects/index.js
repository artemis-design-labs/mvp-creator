import { getIndex, setIndex, getProject, setProject, blankProject } from '../_lib.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { kv } = await import('@vercel/kv');
    const index = await getIndex();
    const projects = (await Promise.all(index.projectIds.map(id => getProject(id)))).filter(Boolean);
    return res.json({ projects, selectedId: index.selectedId });
  }

  if (req.method === 'POST') {
    const index = await getIndex();
    const project = blankProject(req.body);
    if (req.body.id && !index.projectIds.includes(req.body.id)) {
      project.id = req.body.id;
    }
    await setProject(project);
    index.projectIds.unshift(project.id);
    if (!index.selectedId) index.selectedId = project.id;
    await setIndex(index);
    return res.status(201).json(project);
  }

  if (req.method === 'PATCH') {
    // Update selectedId only
    const { selectedId } = req.body;
    const index = await getIndex();
    index.selectedId = selectedId;
    await setIndex(index);
    return res.json({ ok: true, selectedId });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
