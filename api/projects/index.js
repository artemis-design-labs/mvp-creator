import { getData, setData, blankProject } from '../_lib.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await getData();
    return res.json(data);
  }

  if (req.method === 'POST') {
    const data = await getData();
    const project = blankProject(req.body);
    if (req.body.id && !data.projects.find(p => p.id === req.body.id)) {
      project.id = req.body.id;
    }
    data.projects.unshift(project);
    if (!data.selectedId) data.selectedId = project.id;
    await setData(data);
    return res.status(201).json(project);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
