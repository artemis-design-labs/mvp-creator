import { getIndex, setIndex, getProject, setProject, deleteProject } from '../_lib.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const project = await getProject(id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    return res.json(project);
  }

  if (req.method === 'PUT') {
    const existing = await getProject(id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const updates = req.body;
    const merged = {
      ...existing,
      ...updates,
      id,
      archived: updates.archived !== undefined ? updates.archived : (existing.archived || false),
      lastUpdated: new Date().toISOString(),
      hypothesis: {
        ...(existing.hypothesis || {}),
        ...(updates.hypothesis || {}),
        segments: updates.hypothesis?.segments ?? existing.hypothesis?.segments ?? [],
      },
      advantage: { ...existing.advantage, ...updates.advantage },
      clickTest: { ...existing.clickTest, ...updates.clickTest },
      blueprint: {
        ...existing.blueprint,
        ...updates.blueprint,
        milestones: updates.blueprint?.milestones ?? existing.blueprint?.milestones ?? [],
        blockers: updates.blueprint?.blockers ?? existing.blueprint?.blockers ?? [],
      },
      principles: updates.principles ?? existing.principles,
      tags: updates.tags ?? existing.tags,
      categories: updates.categories ?? existing.categories ?? [],
      journey: {
        ...(existing.journey || { persona: '', goal: '', stages: [] }),
        ...(updates.journey || {}),
        stages: updates.journey?.stages ?? existing.journey?.stages ?? [],
      },
      empathyMap: { ...(existing.empathyMap || {}), ...(updates.empathyMap || {}) },
      persona: { ...(existing.persona || {}), ...(updates.persona || {}) },
      figma: { ...(existing.figma || {}), ...(updates.figma || {}) },
      competitors: updates.competitors ?? existing.competitors ?? [],
      competitiveAnalysis: { ...(existing.competitiveAnalysis || {}), ...(updates.competitiveAnalysis || {}) },
      importanceMatrix: {
        ...(existing.importanceMatrix || {}),
        ...(updates.importanceMatrix || {}),
        items: updates.importanceMatrix?.items ?? existing.importanceMatrix?.items ?? [],
      },
      userFlow: {
        ...(existing.userFlow || {}),
        ...(updates.userFlow || {}),
        steps: updates.userFlow?.steps ?? existing.userFlow?.steps ?? [],
      },
      experienceMap: {
        ...(existing.experienceMap || {}),
        ...(updates.experienceMap || {}),
        phases: updates.experienceMap?.phases ?? existing.experienceMap?.phases ?? [],
      },
      serviceBlueprint: {
        ...(existing.serviceBlueprint || {}),
        ...(updates.serviceBlueprint || {}),
        steps: updates.serviceBlueprint?.steps ?? existing.serviceBlueprint?.steps ?? [],
      },
      storyboard: {
        ...(existing.storyboard || {}),
        ...(updates.storyboard || {}),
        frames: updates.storyboard?.frames ?? existing.storyboard?.frames ?? [],
      },
      informationArchitecture: {
        ...(existing.informationArchitecture || {}),
        ...(updates.informationArchitecture || {}),
        nodes: updates.informationArchitecture?.nodes ?? existing.informationArchitecture?.nodes ?? [],
      },
      insights: {
        ...(existing.insights || {}),
        ...(updates.insights || {}),
        metrics: updates.insights?.metrics ?? existing.insights?.metrics ?? [],
      },
    };

    await setProject(merged);
    return res.json(merged);
  }

  if (req.method === 'DELETE') {
    const existing = await getProject(id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await deleteProject(id);
    const index = await getIndex();
    index.projectIds = index.projectIds.filter(pid => pid !== id);
    if (index.selectedId === id) {
      index.selectedId = index.projectIds[0] ?? null;
    }
    await setIndex(index);
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
