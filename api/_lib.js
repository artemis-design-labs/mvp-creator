import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';

const INDEX_KEY = 'mvp:index'; // { projectIds: string[], selectedId: string|null }

export async function getIndex() {
  return (await kv.get(INDEX_KEY)) ?? { projectIds: [], selectedId: null };
}

export async function setIndex(index) {
  await kv.set(INDEX_KEY, index);
}

export async function getProject(id) {
  return kv.get(`mvp:project:${id}`);
}

export async function setProject(project) {
  await kv.set(`mvp:project:${project.id}`, project);
}

export async function deleteProject(id) {
  await kv.del(`mvp:project:${id}`);
}

export async function getData() {
  const index = await getIndex();
  const projects = (await Promise.all(index.projectIds.map(id => getProject(id)))).filter(Boolean);
  return { projects, selectedId: index.selectedId };
}

export async function setData(data) {
  const { projects, selectedId } = data;
  await Promise.all(projects.map(p => setProject(p)));
  await setIndex({ projectIds: projects.map(p => p.id), selectedId: selectedId ?? null });
}

export function blankProject(overrides = {}) {
  return {
    id: randomUUID(),
    name: overrides.name || 'Untitled Idea',
    status: overrides.status || 'draft',
    archived: overrides.archived || false,
    lastUpdated: new Date().toISOString(),
    tags: overrides.tags || [],
    categories: overrides.categories || [],
    hypothesis: { problem: '', segments: [], solution: '', hook: '', antiCustomer: '', ...overrides.hypothesis },
    advantage: { capability: '', motivation: '', insight: '', ...overrides.advantage },
    principles: overrides.principles || ['Boring > Exciting', 'Outcome > Output'],
    clickTest: { riskiestAssumption: '', testMethod: '', successMetric: '', ...overrides.clickTest },
    blueprint: { milestones: [], blockers: [], timelineNotes: '', ...overrides.blueprint },
    sources: overrides.sources || [],
    ingestionLog: overrides.ingestionLog || [],
    journey: overrides.journey || { persona: '', goal: '', stages: [] },
    empathyMap: overrides.empathyMap || { says: [], thinks: [], does: [], feels: [], pains: [], gains: [] },
    persona: overrides.persona || { name: '', role: '', age: '', location: '', quote: '', bio: '', goals: [], frustrations: [], behaviors: [], tools: [], motivations: [], personality: [] },
    figma: overrides.figma || { fileUrl: '', fileId: '', generationStatus: 'idle' },
    competitors: overrides.competitors || [],
    competitiveAnalysis: overrides.competitiveAnalysis || { positioningAxes: { xLabel: 'Feature Breadth', yLabel: 'Price Point' }, yourPositioning: { x: 0, y: 0 }, generatedAt: '' },
    importanceMatrix: overrides.importanceMatrix || { items: [], generatedAt: '' },
    userFlow: overrides.userFlow || { persona: '', goal: '', entryPoint: '', exitPoint: '', steps: [], generatedAt: '' },
    experienceMap: overrides.experienceMap || { overview: '', phases: [] },
    serviceBlueprint: overrides.serviceBlueprint || { overview: '', steps: [] },
    storyboard: overrides.storyboard || { scenario: '', persona: '', frames: [] },
    informationArchitecture: overrides.informationArchitecture || { overview: '', nodes: [] },
    insights: overrides.insights || { northStar: '', metrics: [] },
  };
}
