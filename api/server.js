import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = 3003;

const app = express();
app.use(cors());
app.use(express.json());

// SSE clients
const sseClients = new Set();

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { projects: [], selectedId: null };
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  // Broadcast change to all SSE clients
  const msg = `data: ${JSON.stringify({ type: 'data-changed' })}\n\n`;
  for (const res of sseClients) {
    res.write(msg);
  }
};

const blankProject = (overrides = {}) => ({
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
  insights: overrides.insights || { northStar: '', metrics: [] }
});

// SSE endpoint — browser subscribes here for live updates
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(': connected\n\n');
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

// GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json(readData());
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req, res) => {
  const data = readData();
  const project = data.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
});

// POST /api/projects — create (accepts full project data or just {name})
app.post('/api/projects', (req, res) => {
  const data = readData();
  const project = blankProject(req.body);
  // Ensure the id from body is used only if it doesn't conflict
  if (req.body.id && !data.projects.find(p => p.id === req.body.id)) {
    project.id = req.body.id;
  }
  data.projects.unshift(project);
  if (!data.selectedId) data.selectedId = project.id;
  writeData(data);
  res.status(201).json(project);
});

// PUT /api/projects/:id — update (deep merge on hypothesis/advantage/clickTest/blueprint)
app.put('/api/projects/:id', (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const existing = data.projects[idx];
  const updates = req.body;

  // Deep merge nested objects
  const merged = {
    ...existing,
    ...updates,
    id: req.params.id,
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
      milestones: updates.blueprint?.milestones ?? existing.blueprint.milestones,
      blockers: updates.blueprint?.blockers ?? existing.blueprint.blockers,
    },
    principles: updates.principles ?? existing.principles,
    tags: updates.tags ?? existing.tags,
    categories: updates.categories ?? existing.categories ?? [],
    journey: {
      ...(existing.journey || { persona: '', goal: '', stages: [] }),
      ...(updates.journey || {}),
      stages: updates.journey?.stages ?? existing.journey?.stages ?? [],
    },
    empathyMap: {
      ...(existing.empathyMap || { says: [], thinks: [], does: [], feels: [], pains: [], gains: [] }),
      ...(updates.empathyMap || {}),
    },
    persona: {
      ...(existing.persona || { name: '', role: '', age: '', location: '', quote: '', bio: '', goals: [], frustrations: [], behaviors: [], tools: [], motivations: [], personality: [], photoUrl: '', photoCredit: null }),
      ...(updates.persona || {}),
    },
    figma: {
      ...(existing.figma || { fileUrl: '', fileId: '', generationStatus: 'idle' }),
      ...(updates.figma || {}),
    },
    competitors: updates.competitors ?? existing.competitors ?? [],
    competitiveAnalysis: {
      ...(existing.competitiveAnalysis || { positioningAxes: { xLabel: 'Feature Breadth', yLabel: 'Price Point' }, yourPositioning: { x: 0, y: 0 }, generatedAt: '' }),
      ...(updates.competitiveAnalysis || {}),
    },
    importanceMatrix: {
      ...(existing.importanceMatrix || { items: [], generatedAt: '' }),
      ...(updates.importanceMatrix || {}),
      items: updates.importanceMatrix?.items ?? existing.importanceMatrix?.items ?? [],
    },
    userFlow: {
      ...(existing.userFlow || { persona: '', goal: '', entryPoint: '', exitPoint: '', steps: [], generatedAt: '' }),
      ...(updates.userFlow || {}),
      steps: updates.userFlow?.steps ?? existing.userFlow?.steps ?? [],
    },
    experienceMap: {
      ...(existing.experienceMap || { overview: '', phases: [] }),
      ...(updates.experienceMap || {}),
      phases: updates.experienceMap?.phases ?? existing.experienceMap?.phases ?? [],
    },
    serviceBlueprint: {
      ...(existing.serviceBlueprint || { overview: '', steps: [] }),
      ...(updates.serviceBlueprint || {}),
      steps: updates.serviceBlueprint?.steps ?? existing.serviceBlueprint?.steps ?? [],
    },
    storyboard: {
      ...(existing.storyboard || { scenario: '', persona: '', frames: [] }),
      ...(updates.storyboard || {}),
      frames: updates.storyboard?.frames ?? existing.storyboard?.frames ?? [],
    },
    informationArchitecture: {
      ...(existing.informationArchitecture || { overview: '', nodes: [] }),
      ...(updates.informationArchitecture || {}),
      nodes: updates.informationArchitecture?.nodes ?? existing.informationArchitecture?.nodes ?? [],
    },
    insights: {
      ...(existing.insights || { northStar: '', metrics: [] }),
      ...(updates.insights || {}),
      metrics: updates.insights?.metrics ?? existing.insights?.metrics ?? [],
    },
  };

  data.projects[idx] = merged;
  writeData(data);
  res.json(merged);
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.projects.splice(idx, 1);
  if (data.selectedId === req.params.id) {
    data.selectedId = data.projects[0]?.id || null;
  }
  writeData(data);
  res.json({ ok: true });
});

// POST /api/generate — proxy to Claude (avoids CORS from browser)
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MVP Creator API running on http://localhost:${PORT}`);
});
