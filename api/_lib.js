import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';

const DATA_KEY = 'mvp:data';

export async function getData() {
  const data = await kv.get(DATA_KEY);
  return data ?? { projects: [], selectedId: null };
}

export async function setData(data) {
  await kv.set(DATA_KEY, data);
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
