import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextAreaField, ArrayEditor, PersonaBulletList, PersonaPillList, JourneyStageCard } from './components';
import { EMOTIONS, FLOW_STEP_TYPES, FLOW_SYSTEM_STATES } from './components/constants';

// --- CONFIGURATION & CONSTANTS ---

const APP_VERSION = '2.0.0-click-framework';
const uuid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// The Click Framework Sections
const SECTIONS = {
  hypothesis: { name: 'Foundation Hypothesis', icon: '🏗️', desc: 'Universal Problem, Segments, Solution, & The Hook' },
  advantage: { name: 'Unfair Advantage', icon: '⚡', desc: 'Capability, Motivation, & Insight' },
  principles: { name: 'Principles', icon: '🧭', desc: 'Decision Guardrails (Boring > Exciting)' },
  clickTest: { name: 'The Click Test', icon: '🧪', desc: 'Riskiest Assumption & Validation' },
  blueprint: { name: 'Blueprint', icon: '🗺️', desc: 'Execution Plan & Timeline' },
  journey: { name: 'Journey Map', icon: '🚶', desc: 'User journey from Awareness to Value' },
  empathyMap: { name: 'Empathy Map', icon: '🧠', desc: 'What the customer Says, Thinks, Does & Feels' },
  persona: { name: 'User Persona', icon: '👤', desc: 'Who the customer is — goals, behaviors & frustrations' },
  competitors: { name: 'Competitors', icon: '⚔️', desc: 'Competitive landscape, feature comparison & positioning map' },
  importanceMatrix: { name: 'Importance-Solution Matrix', icon: '🎯', desc: 'Map problems by importance vs. how well current solutions address them' },
  userFlow: { name: 'User Flow', icon: '🔀', desc: 'Map the end-to-end user journey through decisions, system states, and edge cases' },
  experienceMap: { name: 'Experience Map', icon: '🌐', desc: 'Full customer experience across all channels and touchpoints' },
  serviceBlueprint: { name: 'Service Blueprint', icon: '📐', desc: 'Frontstage, backstage, and support processes aligned to the customer journey' },
  storyboard: { name: 'Storyboard', icon: '🎬', desc: 'Scene-by-scene narrative of how the customer experiences the product' },
  informationArchitecture: { name: 'Information Architecture', icon: '🌲', desc: 'Structural hierarchy of screens, sections, and navigation' },
  insights: { name: 'Insights & Metrics', icon: '📊', desc: 'North star metric, AARRR funnel, and measurable targets' },
  figma: { name: 'Figma', icon: '🎨', desc: 'Generate product wireframes in Figma' },
  sources: { name: 'Sources', icon: '📎', desc: 'Reference materials' }
};

const COMPETITOR_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899'];

const STATUSES = ['draft', 'hypothesis-set', 'testing', 'validated', 'killed'];

// --- DATA STRUCTURES ---

const createProject = (name = 'Untitled Idea') => ({
  id: uuid(),
  name,
  status: 'draft',
  lastUpdated: new Date().toISOString(),
  tags: [],
  categories: [],
  
  // Part 1: The Foundation Hypothesis
  hypothesis: {
    problem: '',      // Universal problem affecting all segments
    segments: [],     // [{ id, name, description, painPoint, resolution }]
    solution: '',     // Universal solution that addresses the problem
    hook: '',         // Why will they care *now*? (One-liner)
    antiCustomer: ''  // Who is this NOT for?
  },

  // Part 2: Unfair Advantage (Why YOU?)
  advantage: {
    capability: '', // Can we do it? (Tech/Asset)
    motivation: '', // Do we care? (Why this matters to us)
    insight: '' // What do we know that others don't?
  },

  // Part 3: Principles (Guardrails)
  principles: [
    'Boring > Exciting', // Default Click principle
    'Outcome > Output'
  ],

  // Part 4: The Click Test
  clickTest: {
    riskiestAssumption: '', // What needs to be true?
    testMethod: '', // How will we test it? (e.g. Sales Deck, LOI)
    successMetric: '' // Specific number (e.g. 3 Signed LOIs)
  },

  // Part 5: Blueprint (Delivery)
  blueprint: {
    milestones: [],
    blockers: [],
    timelineNotes: ''
  },

  sources: [],
  ingestionLog: [],
  empathyMap: {
    says: [],
    thinks: [],
    does: [],
    feels: [],
    pains: [],
    gains: []
  },
  persona: {
    name: '',
    role: '',
    age: '',
    location: '',
    quote: '',
    bio: '',
    goals: [],
    frustrations: [],
    behaviors: [],
    tools: [],
    motivations: [],
    personality: [],
    photoUrl: '',
    photoCredit: null
  },
  archived: false,
  figma: {
    fileUrl: '',
    fileId: '',
    generationStatus: 'idle'
  },
  competitors: [],
  competitiveAnalysis: {
    positioningAxes: { xLabel: 'Feature Breadth', yLabel: 'Price Point' },
    yourPositioning: { x: 0, y: 0 },
    generatedAt: ''
  },
  importanceMatrix: {
    items: [],
    generatedAt: ''
  },
  userFlow: {
    persona: '',
    goal: '',
    entryPoint: '',
    exitPoint: '',
    steps: [],
    generatedAt: ''
  },
  experienceMap: {
    overview: '',
    phases: []
  },
  serviceBlueprint: {
    overview: '',
    steps: []
  },
  storyboard: {
    scenario: '',
    persona: '',
    frames: []
  },
  informationArchitecture: {
    overview: '',
    nodes: []
  },
  insights: {
    northStar: '',
    metrics: []
  }
});

const createSeedProject = () => {
  const p = createProject('AI Ops for Law Firms');
  p.status = 'hypothesis-set';
  p.tags = ['service', 'legal-tech', 'b2b'];
  p.hypothesis = {
    problem: 'Law firms waste enormous billable hours on manual document work that erodes margins and burns out staff — and existing AI solutions are rejected because they require sending sensitive client data to the cloud.',
    segments: [
      {
        id: uuid(),
        name: 'Mid-sized Law Firm (10–50 partners)',
        description: 'Established independent firms with enough volume to feel the pain but without Big Law\'s dedicated IT staff.',
        painPoint: 'Paralegals spend 40% of billable hours purely categorizing PDFs — eroding partner margins and causing burnout with no clear fix that satisfies data security requirements.',
        resolution: 'Local-only LLM agents automate their specific document workflow on-premise, cutting discovery costs by 50% without client data ever leaving the building.'
      },
      {
        id: uuid(),
        name: 'Managing Partner',
        description: 'Decision-maker focused on firm profitability, client retention, and competitive positioning.',
        painPoint: 'Watching margins shrink as associates and paralegals bill hours for work that competitors will soon automate — but can\'t justify cloud AI due to bar association and client confidentiality obligations.',
        resolution: 'A packaged audit + deployment service with a clear ROI case: no recurring SaaS fees, no cloud exposure, and a signed NDA before any work begins.'
      }
    ],
    solution: 'A "Secure-First" AI audit and implementation service — we deploy local-only LLM agents on the firm\'s own servers to automate their specific document workflow, with no cloud dependency and no monthly fees.',
    hook: 'Cut discovery costs by 50% without your data ever leaving the building.',
    antiCustomer: 'Solo practitioners (too small to see ROI) or Big Law (too much internal red tape for external vendors).'
  };
  p.advantage = {
    capability: 'We have a library of pre-configured "Local Llama" deployment scripts validated on standard legal hardware.',
    motivation: 'We hate subscription fatigue. We want to sell ownership, not rent.',
    insight: 'Law firms don\'t hate AI; they hate the cloud. They will pay a premium for "air-gapped" modernization.'
  };
  p.principles = [
    'Security > Speed',
    'Integrate with Outlook, don\'t replace it',
    'No monthly recurring fees for the client'
  ];
  p.clickTest = {
    riskiestAssumption: 'Firms will trust an external vendor to install software on their local servers.',
    testMethod: 'Sales Deck pitch to 5 targeted Managing Partners.',
    successMetric: '2 Signed Letters of Intent (LOI) for paid audits.'
  };
  return p;
};

// --- UTILITIES ---

const setNestedValue = (obj, path, value) => {
  const n = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let cur = n;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
  return n;
};

const generateMarkdown = (p) => {
  if (!p) return '';
  const segments = p.hypothesis?.segments || [];
  const segmentsText = segments.map((s, i) =>
    `### Segment ${i + 1}: ${s.name}\n**Who:** ${s.description}\n**Pain Point:** ${s.painPoint}\n**Resolution:** ${s.resolution}`
  ).join('\n\n');
  return `# ${p.name}
**Status:** ${p.status} | **Hook:** ${p.hypothesis?.hook}

## 1. Foundation Hypothesis
**Universal Problem:** ${p.hypothesis?.problem}

${segmentsText}

**Universal Solution:** ${p.hypothesis?.solution}
**Anti-Customer:** ${p.hypothesis?.antiCustomer}

## 2. Unfair Advantage
**Capability:** ${p.advantage?.capability}
**Motivation:** ${p.advantage?.motivation}
**Insight:** ${p.advantage?.insight}

## 3. Principles
${(p.principles || []).map(x => `- ${x}`).join('\n')}

## 4. The Click Test
**Riskiest Assumption:** ${p.clickTest?.riskiestAssumption}
**Test Method:** ${p.clickTest?.testMethod}
**Success Metric:** ${p.clickTest?.successMetric}
`;
};

const createSegment = () => ({
  id: uuid(),
  name: '',
  type: 'primary' as 'primary' | 'secondary',
  description: '',
  painPoint: '',
  resolution: '',
});

// --- JOURNEY MAP ---

const createFlowStep = () => ({
  id: uuid(),
  label: 'New Step',
  type: 'user-action',
  description: '',
  systemState: '',
  branches: [],
  friction: '',
  navContext: '',
  errorPath: '',
});

const createStage = (name = 'New Stage') => ({
  id: uuid(),
  name,
  steps: [],
  emotion: 'neutral',
  painPoints: [],
  opportunities: [],
});

// --- MAIN APP ---

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeSection, setActiveSection] = useState('hypothesis');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AI State
  const [aiIdea, setAiIdea] = useState('');
  const [aiProjectType, setAiProjectType] = useState('product');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [journeyGenerating, setJourneyGenerating] = useState(false);
  const [journeyError, setJourneyError] = useState('');
  const [empathyGenerating, setEmpathyGenerating] = useState(false);
  const [empathyError, setEmpathyError] = useState('');
  const [personaGenerating, setPersonaGenerating] = useState(false);
  const [personaError, setPersonaError] = useState('');
  const [photoFetching, setPhotoFetching] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [pickerPhotos, setPickerPhotos] = useState<any[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerPage, setPickerPage] = useState(1);

  // Competitor state
  const [competitorGenerating, setCompetitorGenerating] = useState(false);
  const [competitorError, setCompetitorError] = useState('');
  const [analysisGenerating, setAnalysisGenerating] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [competitorView, setCompetitorView] = useState<'table' | 'map'>('table');
  const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null);
  const [competitorSort, setCompetitorSort] = useState<'relevance' | 'name' | 'added'>('relevance');
  const [scoringRelevance, setScoringRelevance] = useState(false);

  // Importance-Solution Matrix state
  const [matrixGenerating, setMatrixGenerating] = useState(false);
  const [matrixError, setMatrixError] = useState('');
  const [editingMatrixItemId, setEditingMatrixItemId] = useState<string | null>(null);

  // User Flow state
  const [userFlowGenerating, setUserFlowGenerating] = useState(false);
  const [userFlowError, setUserFlowError] = useState('');
  const [editingFlowStepId, setEditingFlowStepId] = useState<string | null>(null);

  // Experience Map state
  const [experienceMapGenerating, setExperienceMapGenerating] = useState(false);
  const [experienceMapError, setExperienceMapError] = useState('');

  // Service Blueprint state
  const [serviceBlueprintGenerating, setServiceBlueprintGenerating] = useState(false);
  const [serviceBlueprintError, setServiceBlueprintError] = useState('');

  // Storyboard state
  const [storyboardGenerating, setStoryboardGenerating] = useState(false);
  const [storyboardError, setStoryboardError] = useState('');

  // Information Architecture state
  const [iaGenerating, setIaGenerating] = useState(false);
  const [iaError, setIaError] = useState('');

  // Insights & Metrics state
  const [insightsGenerating, setInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState('');

  // Archive
  const [showArchived, setShowArchived] = useState(false);

  // Category State
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [catInput, setCatInput] = useState('');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  // Tracks unsaved local changes so SSE refetches don't race-overwrite them
  const dirtyRef = React.useRef(false);
  // Tells the persist effect to skip when the change came from an SSE refetch (breaks infinite loop)
  const fromSSERef = React.useRef(false);

  // All categories across all projects, sorted
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => (p.categories || []).forEach((c: string) => set.add(c)));
    return Array.from(set).sort();
  }, [projects]);

  // Projects grouped by category for the sidebar
  const archivedProjects = useMemo(() => projects.filter(p => p.archived), [projects]);

  const groupedProjects = useMemo(() => {
    const groups = {};
    projects.filter(p => !p.archived).forEach(p => {
      const cats = p.categories?.length ? p.categories : ['__uncategorized__'];
      cats.forEach(c => {
        if (!groups[c]) groups[c] = [];
        groups[c].push(p);
      });
    });
    // Sort: named categories alphabetically, uncategorized last
    const keys = Object.keys(groups).sort((a, b) => {
      if (a === '__uncategorized__') return 1;
      if (b === '__uncategorized__') return -1;
      return a.localeCompare(b);
    });
    return keys.map(key => ({ key, label: key === '__uncategorized__' ? 'Uncategorized' : key, projects: groups[key] }));
  }, [projects]);

  const toggleCategory = (key) => {
    setCollapsedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // MD Import State
  const [modalTab, setModalTab] = useState('generate'); // 'generate' | 'import'
  const [mdFileName, setMdFileName] = useState('');
  const [mdContent, setMdContent] = useState('');
  const [mdParsing, setMdParsing] = useState(false);
  const [mdParseError, setMdParseError] = useState('');
  const [mdParsed, setMdParsed] = useState(null); // preview data
  const [mdCreating, setMdCreating] = useState(false);
  
  const selectedProject = projects.find(p => p.id === selectedId);

  // Load projects from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.projects && data.projects.length) {
          setProjects(data.projects);
          setSelectedId(data.selectedId || data.projects[0].id);
        } else {
          setProjects([]);
          setSelectedId(null);
        }
      } catch (err) {
        console.log('API unavailable, starting empty:', err);
        setProjects([]);
        setSelectedId(null);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  // SSE — live updates when MCP (or another client) modifies data.
  // Skips refetch when there are unsaved local changes (dirtyRef) to prevent
  // race conditions where SSE from a previous PUT wipes out local edits.
  useEffect(() => {
    const es = new EventSource('/api/events');
    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'data-changed' && !dirtyRef.current) {
          fromSSERef.current = true;
          fetch('/api/projects').then(r => r.json()).then(data => {
            setProjects(data.projects || []);
            setSelectedId(prev =>
              data.projects?.find((p: any) => p.id === prev)
                ? prev
                : data.projects?.[0]?.id || null
            );
          });
        }
      } catch {}
    };
    return () => es.close();
  }, []);

  // Persist the currently selected project to API on change (debounced).
  // Skips when the projects change came from an SSE refetch to break the
  // SSE → setProjects → persist → SSE infinite loop.
  useEffect(() => {
    if (isLoading || !selectedProject) return;
    if (fromSSERef.current) {
      fromSSERef.current = false;
      return;
    }
    const t = setTimeout(async () => {
      try {
        await fetch(`/api/projects/${selectedProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedProject)
        });
        dirtyRef.current = false;
      } catch (err) { console.log('Could not persist:', err); }
    }, 500);
    return () => clearTimeout(t);
  }, [projects, isLoading]);

  const updateProject = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
  };

  const updateNested = (section, field, value) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      return { ...p, [section]: { ...p[section], [field]: value }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateJourney = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.journey || { persona: '', goal: '', stages: [] };
      return { ...p, journey: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateUserFlow = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.userFlow || { persona: '', goal: '', entryPoint: '', exitPoint: '', steps: [], generatedAt: '' };
      return { ...p, userFlow: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateEmpathyMap = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.empathyMap || { says: [], thinks: [], does: [], feels: [], pains: [], gains: [] };
      return { ...p, empathyMap: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const generateEmpathyMap = async () => {
    if (!selectedProject) return;
    setEmpathyGenerating(true);
    setEmpathyError('');
    const h = selectedProject.hypothesis || {};
    const prompt = `You are an expert UX researcher specializing in Empathy Mapping.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}

Generate a realistic, specific empathy map for the target customer. Be concrete — use direct quotes and specific behaviors, not generic platitudes.

Return ONLY valid JSON with no markdown, no code fences:
{
  "says": ["Direct quote or statement the customer says out loud (4-5 items)"],
  "thinks": ["Internal thought the customer has but may not voice (4-5 items)"],
  "does": ["Observable action or behavior (4-5 items)"],
  "feels": ["Emotional state or feeling (4-5 items)"],
  "pains": ["Frustration, fear, or obstacle (3-4 items)"],
  "gains": ["Goal, desire, or measure of success (3-4 items)"]
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateEmpathyMap({
        says: parsed.says || [],
        thinks: parsed.thinks || [],
        does: parsed.does || [],
        feels: parsed.feels || [],
        pains: parsed.pains || [],
        gains: parsed.gains || [],
      });
    } catch (e: any) {
      setEmpathyError(e.message || 'Failed to generate empathy map. Try again.');
    } finally {
      setEmpathyGenerating(false);
    }
  };

  const updatePersona = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.persona || { name: '', role: '', age: '', location: '', quote: '', bio: '', goals: [], frustrations: [], behaviors: [], tools: [], motivations: [], personality: [] };
      return { ...p, persona: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateFigma = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.figma || { fileUrl: '', fileId: '', generationStatus: 'idle' };
      return { ...p, figma: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateCompetitors = (competitors) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p =>
      p.id !== selectedId ? p : { ...p, competitors, lastUpdated: new Date().toISOString() }
    ));
  };

  const updateCompetitiveAnalysis = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.competitiveAnalysis || { positioningAxes: { xLabel: 'Feature Breadth', yLabel: 'Price Point' }, yourPositioning: { x: 0, y: 0 }, generatedAt: '' };
      return { ...p, competitiveAnalysis: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateImportanceMatrix = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.importanceMatrix || { items: [], generatedAt: '' };
      return { ...p, importanceMatrix: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateExperienceMap = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.experienceMap || { overview: '', phases: [] };
      return { ...p, experienceMap: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateServiceBlueprint = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.serviceBlueprint || { overview: '', steps: [] };
      return { ...p, serviceBlueprint: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateStoryboard = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.storyboard || { scenario: '', persona: '', frames: [] };
      return { ...p, storyboard: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateInformationArchitecture = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.informationArchitecture || { overview: '', nodes: [] };
      return { ...p, informationArchitecture: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const updateInsights = (updates) => {
    dirtyRef.current = true;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const current = p.insights || { northStar: '', metrics: [] };
      return { ...p, insights: { ...current, ...updates }, lastUpdated: new Date().toISOString() };
    }));
  };

  const generateExperienceMap = async () => {
    if (!selectedProject) return;
    setExperienceMapGenerating(true);
    setExperienceMapError('');
    const h = selectedProject.hypothesis || {};
    const persona = selectedProject.persona || {};
    const prompt = `You are a senior UX strategist. Generate a detailed Experience Map for this product.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || persona.name || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}

An experience map covers the FULL customer experience — before, during, and after using the product — across all channels and touchpoints (not just the product itself).

Return ONLY valid JSON with no markdown, no code fences:
{
  "overview": "1-2 sentence summary of the overall experience arc",
  "phases": [
    {
      "id": "phase-1",
      "name": "Phase name (e.g. Discovery, Onboarding, Active Use, Renewal)",
      "channel": "Primary channel (e.g. Social Media, Email, In-App, Word of Mouth)",
      "touchpoints": ["Specific touchpoint 1", "Specific touchpoint 2", "Specific touchpoint 3"],
      "experience": "What the customer experiences in this phase (2-3 sentences)",
      "emotion": "Primary emotional state (e.g. Curious, Frustrated, Relieved, Delighted)",
      "insights": "Key design insight or opportunity for this phase"
    }
  ]
}

Generate 5-7 phases covering the full arc from initial awareness to loyal advocacy.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateExperienceMap({ overview: parsed.overview || '', phases: parsed.phases || [] });
    } catch (e: any) {
      setExperienceMapError(e.message || 'Failed to generate experience map. Try again.');
    } finally {
      setExperienceMapGenerating(false);
    }
  };

  const generateServiceBlueprint = async () => {
    if (!selectedProject) return;
    setServiceBlueprintGenerating(true);
    setServiceBlueprintError('');
    const h = selectedProject.hypothesis || {};
    const journey = selectedProject.journey || {};
    const prompt = `You are a service design expert. Generate a Service Blueprint for this product.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
${journey.stages?.length ? `USER JOURNEY STAGES: ${journey.stages.map(s => s.name).join(', ')}` : ''}

A service blueprint maps customer actions across four swim lanes: Customer Actions, Frontstage (visible service interactions), Backstage (invisible staff/system processes), and Support Processes (infrastructure, tools, partners).

Return ONLY valid JSON with no markdown, no code fences:
{
  "overview": "1-2 sentence description of the service delivery model",
  "steps": [
    {
      "id": "step-1",
      "name": "Step name (matches a key moment in the customer journey)",
      "customerAction": "What the customer does or experiences",
      "frontstage": "Visible service interaction or touchpoint the customer sees",
      "backstage": "Behind-the-scenes process or system action supporting this step",
      "support": "Infrastructure, third-party tool, or partner enabling this step",
      "evidence": "Physical or digital artifact the customer encounters (e.g. confirmation email, receipt)"
    }
  ]
}

Generate 6-8 steps covering the core service delivery from first contact to post-service follow-up.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateServiceBlueprint({ overview: parsed.overview || '', steps: parsed.steps || [] });
    } catch (e: any) {
      setServiceBlueprintError(e.message || 'Failed to generate service blueprint. Try again.');
    } finally {
      setServiceBlueprintGenerating(false);
    }
  };

  const generateStoryboard = async () => {
    if (!selectedProject) return;
    setStoryboardGenerating(true);
    setStoryboardError('');
    const h = selectedProject.hypothesis || {};
    const persona = selectedProject.persona || {};
    const prompt = `You are a product storyteller and UX designer. Generate a storyboard for this product.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PERSONA: ${persona.name || 'Not defined'}${persona.role ? ` — ${persona.role}` : ''}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}

A storyboard is a visual narrative — a sequence of 6-8 panels that shows how the customer discovers, tries, and gets value from the product. Each panel is like a frame of a comic strip.

Return ONLY valid JSON with no markdown, no code fences:
{
  "scenario": "1-2 sentence setup — who is the character, what situation are they in?",
  "persona": "Name and one-line description of the character in this storyboard",
  "frames": [
    {
      "id": "frame-1",
      "panel": 1,
      "description": "What is happening in this scene? (2-3 sentences describing the visual)",
      "dialogue": "What does the character say or think? (Keep it short — max 20 words)",
      "emotion": "Character's emotional state in this panel (one word or short phrase)"
    }
  ]
}

Generate 6-8 frames. Start with the problem moment, move through discovery and first use, end with value realized.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2500, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateStoryboard({ scenario: parsed.scenario || '', persona: parsed.persona || '', frames: parsed.frames || [] });
    } catch (e: any) {
      setStoryboardError(e.message || 'Failed to generate storyboard. Try again.');
    } finally {
      setStoryboardGenerating(false);
    }
  };

  const generateInformationArchitecture = async () => {
    if (!selectedProject) return;
    setIaGenerating(true);
    setIaError('');
    const h = selectedProject.hypothesis || {};
    const userFlow = selectedProject.userFlow || {};
    const prompt = `You are an information architect. Generate an Information Architecture for this product.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
${userFlow.steps?.length ? `KEY FLOWS: ${userFlow.steps.map(s => s.label).join(', ')}` : ''}

An IA chart maps the structural hierarchy of the product — global navigation, sections, sub-sections, and pages — showing how content and features are organised and labelled.

Return ONLY valid JSON with no markdown, no code fences:
{
  "overview": "1-2 sentence description of the overall IA strategy (e.g. task-based nav vs. content-based)",
  "nodes": [
    {
      "id": "node-1",
      "label": "Section or page name",
      "level": 0,
      "parentId": null,
      "description": "What lives here and why"
    }
  ]
}

Level 0 = top-level navigation (max 5-7 items). Level 1 = sections within a top-level item. Level 2 = pages or subsections. Use parentId to link children to their parent node id. Generate a complete, realistic IA with 15-25 nodes total.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateInformationArchitecture({ overview: parsed.overview || '', nodes: parsed.nodes || [] });
    } catch (e: any) {
      setIaError(e.message || 'Failed to generate information architecture. Try again.');
    } finally {
      setIaGenerating(false);
    }
  };

  const generateInsights = async () => {
    if (!selectedProject) return;
    setInsightsGenerating(true);
    setInsightsError('');
    const h = selectedProject.hypothesis || {};
    const clickTest = selectedProject.clickTest || {};
    const prompt = `You are a product analytics expert. Generate an Insights & Metrics framework for this product.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}
SUCCESS METRIC (from click test): ${clickTest.successMetric || 'Not defined'}

Generate a north star metric and a set of product metrics across the AARRR funnel (Acquisition, Activation, Retention, Revenue, Referral) plus product quality metrics.

Return ONLY valid JSON with no markdown, no code fences:
{
  "northStar": "The single metric that best captures the core value delivered to customers (e.g. 'Artifacts generated per active user per week')",
  "metrics": [
    {
      "id": "metric-1",
      "category": "Acquisition | Activation | Retention | Revenue | Referral | Quality",
      "name": "Metric name",
      "description": "What this measures and why it matters",
      "target": "Specific target value or threshold (e.g. '40% of signups within 7 days')",
      "measurement": "How to measure it (e.g. 'Count of users who complete X event in Mixpanel')"
    }
  ]
}

Generate 10-14 metrics, with at least 1-2 per AARRR category and 2-3 quality metrics.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updateInsights({ northStar: parsed.northStar || '', metrics: parsed.metrics || [] });
    } catch (e: any) {
      setInsightsError(e.message || 'Failed to generate insights. Try again.');
    } finally {
      setInsightsGenerating(false);
    }
  };

  const suggestMatrixItems = async () => {
    if (!selectedProject) return;
    setMatrixGenerating(true);
    setMatrixError('');
    const h = selectedProject.hypothesis || {};
    const adv = selectedProject.advantage || {};
    const prompt = `You are a product strategy expert. Given this product concept, identify 6-8 distinct customer problems or jobs-to-be-done. For each, assign two scores:
- importance: 0.0–1.0 (how critical is solving this to the customer's success?)
- solutionEffectiveness: 0.0–1.0 (how well do existing solutions on the market currently address it?)

PRODUCT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not specified'}
PROBLEM: ${h.problem || 'Not specified'}
SOLUTION: ${h.solution || 'Not specified'}
INSIGHT: ${adv.insight || 'Not specified'}

Rules:
- Make scores realistic and spread across all four quadrants where appropriate.
- Labels should be concrete (3–6 words), not generic.
- Return ONLY valid JSON, no markdown, no code fences.

[
  {
    "label": "Short problem label",
    "description": "One sentence explaining the problem in the customer's context",
    "importance": 0.85,
    "solutionEffectiveness": 0.2
  }
]`;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      const text = data.content[0].text;
      const parsed = JSON.parse(text.match(/\[[\s\S]*\]/)[0]);
      const newItems = parsed.map(item => ({
        id: uuid(),
        label: item.label || '',
        description: item.description || '',
        importance: Math.max(0, Math.min(1, Number(item.importance) || 0.5)),
        solutionEffectiveness: Math.max(0, Math.min(1, Number(item.solutionEffectiveness) || 0.5))
      }));
      const existing = selectedProject.importanceMatrix?.items || [];
      updateImportanceMatrix({ items: [...existing, ...newItems], generatedAt: new Date().toISOString() });
    } catch (e: any) {
      setMatrixError(e.message || 'Generation failed');
    } finally {
      setMatrixGenerating(false);
    }
  };

  const generatePersona = async () => {
    if (!selectedProject) return;
    setPersonaGenerating(true);
    setPersonaError('');
    const h = selectedProject.hypothesis || {};
    const prompt = `You are an expert UX researcher specializing in User Persona creation.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}

Create a single, specific, realistic primary user persona for this product. Make them feel like a real person — concrete details, not archetypes.

Return ONLY valid JSON with no markdown, no code fences:
{
  "name": "Full name (realistic first and last)",
  "role": "Job title and company type (e.g. 'Senior Product Manager at a Series B SaaS company')",
  "age": "Age (e.g. '34')",
  "location": "City, Country",
  "quote": "A single direct quote that captures their core frustration or desire in their own voice",
  "bio": "2–3 sentence bio that brings them to life — background, current situation, what drives them",
  "goals": ["3–4 specific goals they are trying to achieve"],
  "frustrations": ["3–4 concrete frustrations they experience today"],
  "behaviors": ["3–4 observable daily behaviors relevant to this product"],
  "tools": ["4–6 tools they currently use (specific product names)"],
  "motivations": ["3–4 intrinsic or extrinsic motivations that drive their decisions"],
  "personality": ["3–5 personality trait words (e.g. Analytical, Introvert, Detail-oriented)"]
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      updatePersona(parsed);
    } catch (e: any) {
      setPersonaError(e.message || 'Failed to generate persona. Try again.');
    } finally {
      setPersonaGenerating(false);
    }
  };

  const suggestCompetitors = async () => {
    if (!selectedProject) return;
    setCompetitorGenerating(true);
    setCompetitorError('');
    const h = selectedProject.hypothesis || {};
    const adv = selectedProject.advantage || {};
    const existing = (selectedProject.competitors || []).map(c => c.name).filter(Boolean);

    const prompt = `You are an expert competitive analyst and market researcher.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}
COMPETITIVE INSIGHT: ${adv.insight || 'Not defined'}
${existing.length > 0 ? `ALREADY IDENTIFIED (do NOT repeat): ${existing.join(', ')}` : ''}

Identify 3–5 real, relevant competitors. Include direct competitors (same solution space), indirect competitors (different approach, same problem), and substitute solutions (what target customers do today instead).

For positioning, choose the two most useful axes to differentiate these players. Use -1 to 1 for each axis where -1 = the low/niche end and 1 = the high/broad end. Also position the project itself.

Return ONLY valid JSON with no markdown or code fences:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "example.com",
      "description": "1–2 sentence description of what they do and their positioning",
      "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "targetMarket": "Specific description of who they primarily serve",
      "painPoints": ["Pain point they address 1", "Pain point 2", "Pain point 3"],
      "pricing": "e.g. Freemium · $X/mo Pro / Enterprise / Open source",
      "positioning": { "x": 0.3, "y": 0.6 }
    }
  ],
  "positioningAxes": {
    "xLabel": "Most useful X dimension (e.g. Feature Breadth, AI Depth, Automation Level)",
    "yLabel": "Most useful Y dimension (e.g. Price Point, Enterprise Focus, Technical Depth)"
  },
  "yourPositioning": { "x": 0.0, "y": 0.5 }
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const newCompetitors = (parsed.competitors || []).map(c => ({
        id: uuid(),
        name: c.name || '',
        website: c.website || '',
        description: c.description || '',
        features: c.features || [],
        targetMarket: c.targetMarket || '',
        painPoints: c.painPoints || [],
        pricing: c.pricing || '',
        positioning: c.positioning || { x: 0, y: 0 }
      }));

      updateCompetitors([...(selectedProject.competitors || []), ...newCompetitors]);
      updateCompetitiveAnalysis({
        positioningAxes: parsed.positioningAxes || { xLabel: 'Feature Breadth', yLabel: 'Price Point' },
        yourPositioning: parsed.yourPositioning || { x: 0, y: 0 },
        generatedAt: new Date().toISOString()
      });
    } catch (e: any) {
      setCompetitorError(e.message || 'Failed to suggest competitors. Try again.');
    } finally {
      setCompetitorGenerating(false);
    }
  };

  const scoreRelevance = async () => {
    if (!selectedProject) return;
    const competitors = selectedProject.competitors || [];
    if (competitors.length === 0) { setCompetitorError('Add at least one competitor before scoring relevance.'); return; }
    setScoringRelevance(true);
    setCompetitorError('');
    const h = selectedProject.hypothesis || {};
    const adv = selectedProject.advantage || {};

    const competitorData = competitors.map(c =>
      `- ${c.name} (${c.website || 'no website'}): ${c.description}\n  Features: ${(c.features || []).join(', ')}\n  Target: ${c.targetMarket}\n  Pricing: ${c.pricing || 'unknown'}\n  Pain Points: ${(c.painPoints || []).join('; ')}`
    ).join('\n\n');

    const prompt = `You are an expert competitive strategist.

PROJECT: ${selectedProject.name}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
ADVANTAGE: ${adv.insight || 'Not defined'}

COMPETITORS:
${competitorData}

Task: Score how RELEVANT each competitor is to THIS project — i.e. how directly it competes for the same customers solving the same core problem. Weigh overlap in problem space, target customer, and solution approach. A direct competitor chasing the same buyers with a similar solution scores high (80-100); an adjacent or substitute solution scores medium (40-70); a loosely related player scores low (0-40).

Return ONLY valid JSON with no markdown:
{
  "competitors": [
    { "name": "Exact competitor name matching input", "relevance": 87, "reason": "One concise sentence on why it is or isn't relevant to this project." }
  ]
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Request failed (${response.status})`);
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.competitors?.length) {
        const updated = competitors.map(comp => {
          const match = parsed.competitors.find(c => c.name.toLowerCase().trim() === comp.name.toLowerCase().trim());
          if (!match) return comp;
          const score = Math.max(0, Math.min(100, Math.round(Number(match.relevance) || 0)));
          return { ...comp, relevance: score, relevanceReason: match.reason || '' };
        });
        updateCompetitors(updated);
        setCompetitorSort('relevance');
      } else {
        setCompetitorError('No relevance scores returned. Try again.');
      }
    } catch (e: any) {
      setCompetitorError(e.message || 'Failed to score relevance. Try again.');
    } finally {
      setScoringRelevance(false);
    }
  };

  const generateCompetitiveAnalysis = async () => {
    if (!selectedProject) return;
    const competitors = selectedProject.competitors || [];
    if (competitors.length === 0) { setAnalysisError('Add at least one competitor before generating analysis.'); return; }
    setAnalysisGenerating(true);
    setAnalysisError('');
    const h = selectedProject.hypothesis || {};
    const adv = selectedProject.advantage || {};
    const ca = selectedProject.competitiveAnalysis || {};
    const axes = ca.positioningAxes || { xLabel: 'Feature Breadth', yLabel: 'Price Point' };

    const competitorData = competitors.map(c =>
      `- ${c.name} (${c.website || 'no website'}): ${c.description}\n  Features: ${(c.features || []).join(', ')}\n  Target: ${c.targetMarket}\n  Pricing: ${c.pricing || 'unknown'}\n  Pain Points: ${(c.painPoints || []).join('; ')}`
    ).join('\n\n');

    const prompt = `You are an expert competitive strategist.

PROJECT: ${selectedProject.name}
SOLUTION: ${h.solution || 'Not defined'}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
ADVANTAGE: ${adv.insight || 'Not defined'}

COMPETITORS:
${competitorData}

CURRENT AXES: X = "${axes.xLabel}" | Y = "${axes.yLabel}"
(Scale: -1 = low/niche end, 1 = high/broad end)

Task: Precisely position each competitor AND the project on the best two axes for this landscape. If the current axes are ideal, keep them. If clearer axes would better differentiate these players, update them.

Return ONLY valid JSON with no markdown:
{
  "positioningAxes": { "xLabel": "Best X axis label", "yLabel": "Best Y axis label" },
  "yourPositioning": { "x": 0.1, "y": -0.3 },
  "competitors": [
    { "name": "Exact competitor name matching input", "positioning": { "x": 0.7, "y": 0.4 } }
  ]
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);

      updateCompetitiveAnalysis({
        positioningAxes: parsed.positioningAxes || axes,
        yourPositioning: parsed.yourPositioning || { x: 0, y: 0 },
        generatedAt: new Date().toISOString()
      });

      if (parsed.competitors?.length) {
        const updated = competitors.map(comp => {
          const match = parsed.competitors.find(c => c.name.toLowerCase().trim() === comp.name.toLowerCase().trim());
          return match ? { ...comp, positioning: match.positioning } : comp;
        });
        updateCompetitors(updated);
      }
    } catch (e: any) {
      setAnalysisError(e.message || 'Failed to generate analysis. Try again.');
    } finally {
      setAnalysisGenerating(false);
    }
  };

  const buildPhotoQuery = (role: string) => {
    if (!role) return 'professional portrait';
    const trimmed = role.replace(/\b(at|for|in|@)\b.*$/i, '').trim();
    const words = trimmed.split(/\s+/).slice(0, 3).join(' ');
    return `${words} professional portrait`;
  };

  const searchPickerPhotos = async (page = 1) => {
    if (!selectedProject) return;
    const pr = selectedProject.persona || {};
    const query = buildPhotoQuery(pr.role || '');
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    setPickerLoading(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&page=${page}&orientation=squarish&content_filter=high&client_id=${key}`
      );
      if (!res.ok) throw new Error('Unsplash request failed');
      const data = await res.json();
      setPickerPhotos(data.results || []);
      setPickerPage(page);
    } catch (e: any) {
      setPersonaError('Could not fetch photos. Check your Unsplash key.');
    } finally {
      setPickerLoading(false);
    }
  };

  const openPhotoPicker = async () => {
    setShowPhotoPicker(true);
    setPickerPhotos([]);
    await searchPickerPhotos(1);
  };

  const selectPhoto = (photo: any) => {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    fetch(`${photo.links.download_location}&client_id=${key}`);
    updatePersona({
      photoUrl: photo.urls.regular,
      photoCredit: { name: photo.user.name, url: photo.user.links.html }
    });
    setShowPhotoPicker(false);
  };

  const deleteProject = async () => {
    if (!selectedProject) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      await fetch(`/api/projects/${selectedId}`, { method: 'DELETE' });
    } catch (err) { console.log('Delete failed:', err); }
    setProjects(prev => prev.filter(p => p.id !== selectedId));
    setSelectedId(projects.find(p => p.id !== selectedId)?.id || null);
    setConfirmDelete(false);
  };

  const generateWithAI = async () => {
    if (!aiIdea.trim()) return;
    setAiGenerating(true);
    setAiError('');

    const typeContext = aiProjectType === 'product'
      ? 'This is a PRODUCT — a software application, platform, or tool that users interact with directly. Focus on features, UX, technical architecture, integrations, and product-market fit.'
      : 'This is a SERVICE — a professional service, agency offering, consultancy, or managed solution delivered by people. Focus on service deliverables, client experience, engagement models, pricing structures, team capabilities, and client outcomes rather than software features.';
    
    const prompt = `You are an expert product strategist using Jake Knapp's "Click" framework (Foundation Sprint).
      
PROJECT TYPE: ${aiProjectType.toUpperCase()}
${typeContext}

USER IDEA: "${aiIdea}"

Generate a Foundation Sprint structure. Be specific and actionable — no generic filler.

Return ONLY valid JSON with no markdown, no code fences, no explanation:
{
  "name": "Short Project Name (3-5 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "hypothesis": {
    "problem": "Jake Knapp 3-part formula: [Target User] + [Root Bottleneck] → [Quantifiable Consequence]. Rules: use roles not names, compress friction into one structural defect, make consequences explicit and measurable (e.g. overselling, data leaks, revenue blindness). Aim for ~200 chars — specific enough for a sprint brief.",
    "segments": [
      {
        "name": "Segment name (e.g. 'Freelance Designer')",
        "type": "primary",
        "description": "Who they are — role, context, scale",
        "painPoint": "How the universal problem manifests in their specific scenario",
        "resolution": "How the universal solution directly fixes their specific pain"
      }
    ],
    "solution": "The universal solution — the specific offering or transformation that addresses the problem",
    "hook": "One-liner: why they will care NOW",
    "antiCustomer": "Who this is explicitly NOT for"
  },
  "advantage": {
    "capability": "What tech, assets, or skills make this possible",
    "motivation": "Why this matters beyond money",
    "insight": "What we know that competitors miss"
  },
  "principles": ["Guardrail 1 > Alternative 1", "Guardrail 2 > Alternative 2", "Guardrail 3 > Alternative 3"],
  "clickTest": {
    "riskiestAssumption": "The one thing that if false kills the idea",
    "testMethod": "How to validate before building (e.g. Sales Deck, Fake Door, LOI)",
    "successMetric": "Specific number that proves it works (e.g. 3 Signed LOIs)"
  },
  "blueprint": {
    "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
    "blockers": ["Blocker 1"],
    "timelineNotes": "Overall timeline context"
  }
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      
      let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        let openBraces = (cleaned.match(/{/g) || []).length;
        let closeBraces = (cleaned.match(/}/g) || []).length;
        let openBrackets = (cleaned.match(/\[/g) || []).length;
        let closeBrackets = (cleaned.match(/\]/g) || []).length;
        cleaned = cleaned.replace(/,\s*$/, '').replace(/,\s*"[^"]*$/, '').replace(/:\s*"[^"]*$/, ': ""');
        const quoteCount = (cleaned.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) cleaned += '"';
        openBrackets = (cleaned.match(/\[/g) || []).length;
        closeBrackets = (cleaned.match(/\]/g) || []).length;
        openBraces = (cleaned.match(/{/g) || []).length;
        closeBraces = (cleaned.match(/}/g) || []).length;
        for (let i = 0; i < openBrackets - closeBrackets; i++) cleaned += ']';
        for (let i = 0; i < openBraces - closeBraces; i++) cleaned += '}';
        try {
          parsed = JSON.parse(cleaned);
        } catch (e2) {
          throw new Error('AI returned incomplete data. Please try again.');
        }
      }

      const newProject = createProject(parsed.name || 'AI Generated Sprint');
      newProject.tags = parsed.tags || [aiProjectType];
      newProject.status = 'hypothesis-set';
      newProject.hypothesis = {
        problem: parsed.hypothesis?.problem || '',
        segments: (parsed.hypothesis?.segments || []).map(s => ({
          id: uuid(),
          name: s.name || '',
          description: s.description || '',
          painPoint: s.painPoint || '',
          resolution: s.resolution || '',
        })),
        solution: parsed.hypothesis?.solution || '',
        hook: parsed.hypothesis?.hook || '',
        antiCustomer: parsed.hypothesis?.antiCustomer || '',
      };
      newProject.advantage = {
        capability: parsed.advantage?.capability || '',
        motivation: parsed.advantage?.motivation || '',
        insight: parsed.advantage?.insight || ''
      };
      newProject.principles = parsed.principles || ['Boring > Exciting'];
      newProject.clickTest = {
        riskiestAssumption: parsed.clickTest?.riskiestAssumption || '',
        testMethod: parsed.clickTest?.testMethod || '',
        successMetric: parsed.clickTest?.successMetric || ''
      };
      newProject.blueprint = {
        milestones: parsed.blueprint?.milestones || [],
        blockers: parsed.blueprint?.blockers || [],
        timelineNotes: parsed.blueprint?.timelineNotes || ''
      };
      newProject.sources = [{
        id: uuid(), type: 'ai-generated', title: 'AI Vision Input',
        content: aiIdea, addedAt: new Date().toISOString()
      }];
      
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });
        const savedProject = await res.json();
        setProjects(prev => [savedProject, ...prev]);
        setSelectedId(savedProject.id);
      } catch {
        setProjects(prev => [newProject, ...prev]);
        setSelectedId(newProject.id);
      }
      setActiveSection('hypothesis');
      setShowAIGenerate(false);
      setAiIdea('');
      setAiProjectType('product');
    } catch (e) {
      console.error('AI Generation Error:', e);
      setAiError(e.message || 'Failed to generate. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const generateJourney = async () => {
    if (!selectedProject) return;
    setJourneyGenerating(true);
    setJourneyError('');
    const h = selectedProject.hypothesis || {};
    const prompt = `You are an expert UX researcher specializing in User Journey Mapping.

PROJECT: ${selectedProject.name}
CUSTOMER SEGMENTS: ${(h.segments || []).map(s => `${s.name}: ${s.description}`).join(' | ') || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}
HOOK: ${h.hook || 'Not defined'}

Generate a realistic, specific user journey map for the target customer — from initial awareness of the problem through their first meaningful success with the solution. Be specific to this product, not generic.

Return ONLY valid JSON with no markdown, no code fences:
{
  "persona": "Specific persona name and role (e.g. 'Sarah, Managing Partner at a 25-person law firm')",
  "goal": "What they are ultimately trying to accomplish",
  "stages": [
    {
      "name": "Stage name",
      "steps": ["Specific action or touchpoint"],
      "emotion": "one of exactly: frustrated | curious | neutral | hopeful | happy | excited | disappointed",
      "painPoints": ["Specific barrier or frustration at this stage"],
      "opportunities": ["Specific design or product opportunity to improve this stage"]
    }
  ]
}

Generate 5–7 stages covering the full arc from Awareness to Value Realized.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const stages = (parsed.stages || []).map(s => ({
        id: uuid(),
        name: s.name || 'Stage',
        steps: s.steps || [],
        emotion: s.emotion || 'neutral',
        painPoints: s.painPoints || [],
        opportunities: s.opportunities || [],
      }));
      updateJourney({ persona: parsed.persona || '', goal: parsed.goal || '', stages });
    } catch (e: any) {
      setJourneyError(e.message || 'Failed to generate journey. Try again.');
    } finally {
      setJourneyGenerating(false);
    }
  };

  const generateUserFlow = async () => {
    if (!selectedProject) return;
    setUserFlowGenerating(true);
    setUserFlowError('');
    const h = selectedProject.hypothesis || {};
    const uf = selectedProject.userFlow || {};
    const pr = selectedProject.persona || {};
    const personaContext = pr.name ? `${pr.name}, ${pr.role}` : ((h.segments || []).map(s => s.name).join(', ') || 'Not defined');
    const prompt = `You are an expert UX designer applying the following user flow principles:
1. Anchor flows in the specific user persona and mental model — not generic UI steps.
2. Distinguish node types: user-action, system-action, user-decision, system-decision.
3. Explicitly map system states (idle, loading, success, error, empty) and error recovery paths.
4. Track friction (pain/cognitive load) per step and navigation context within the IA.
5. Decision nodes must include branching paths.

PROJECT: ${selectedProject.name}
PERSONA: ${personaContext}
GOAL: ${uf.goal || h.solution || 'Not defined'}
PROBLEM: ${h.problem || 'Not defined'}
SOLUTION: ${h.solution || 'Not defined'}

Generate a realistic, end-to-end user flow for this persona. Cover the happy path AND at least one key error/recovery branch. Be specific to this product.

Return ONLY valid JSON with no markdown:
{
  "persona": "Specific persona name and role",
  "goal": "The user's core goal in this flow",
  "entryPoint": "What triggers entry into this flow (event or location)",
  "exitPoint": "What marks successful completion",
  "steps": [
    {
      "label": "Short step name",
      "type": "user-action | system-action | user-decision | system-decision",
      "description": "What happens in detail",
      "systemState": "idle | loading | success | error | empty (or empty string if N/A)",
      "branches": [{"condition": "if X", "outcome": "go to Y"}, ...],
      "friction": "Pain or cognitive load at this step (or empty string)",
      "navContext": "Where in the IA this occurs (e.g. 'Dashboard > Value Hunter tab')",
      "errorPath": "Recovery path if systemState is error (or empty string)"
    }
  ]
}

Generate 8–12 steps covering the full flow arc.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const steps = (parsed.steps || []).map(s => ({
        id: uuid(),
        label: s.label || 'Step',
        type: s.type || 'user-action',
        description: s.description || '',
        systemState: s.systemState || '',
        branches: s.branches || [],
        friction: s.friction || '',
        navContext: s.navContext || '',
        errorPath: s.errorPath || '',
      }));
      updateUserFlow({
        persona: parsed.persona || '',
        goal: parsed.goal || '',
        entryPoint: parsed.entryPoint || '',
        exitPoint: parsed.exitPoint || '',
        steps,
        generatedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setUserFlowError(e.message || 'Failed to generate user flow. Try again.');
    } finally {
      setUserFlowGenerating(false);
    }
  };

  const resetModal = () => {
    setModalTab('generate');
    setAiIdea('');
    setAiProjectType('product');
    setAiError('');
    setMdFileName('');
    setMdContent('');
    setMdParseError('');
    setMdParsed(null);
  };

  const handleMdFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMdFileName(file.name);
    setMdParsed(null);
    setMdParseError('');
    const reader = new FileReader();
    reader.onload = (ev) => setMdContent(ev.target?.result as string || '');
    reader.readAsText(file);
  };

  const parseMarkdown = async () => {
    if (!mdContent.trim()) return;
    setMdParsing(true);
    setMdParseError('');
    setMdParsed(null);

    const prompt = `You are an expert product strategist using the Click Framework (Foundation Sprint).

Parse the following markdown document and extract as much relevant information as possible into Click Framework fields. The document may be a PRD, a previous Click Framework export, pitch deck notes, meeting notes, or any project document — handle any format.

For fields you cannot determine from the document, use empty strings or empty arrays. Infer a short project name from the document title or subject matter.

DOCUMENT:
${mdContent.slice(0, 12000)}

Return ONLY valid JSON with no markdown, no code fences, no explanation:
{
  "name": "Short Project Name (3-5 words)",
  "tags": ["tag1", "tag2"],
  "hypothesis": {
    "customer": "Specific target customer segment",
    "problem": "The specific pain they experience",
    "solution": "The specific offering or transformation",
    "hook": "One-liner: why they will care NOW",
    "antiCustomer": "Who this is explicitly NOT for"
  },
  "advantage": {
    "capability": "What tech, assets, or skills make this possible",
    "motivation": "Why this matters beyond money",
    "insight": "What we know that competitors miss"
  },
  "principles": ["Guardrail 1", "Guardrail 2"],
  "clickTest": {
    "riskiestAssumption": "The one thing that if false kills the idea",
    "testMethod": "How to validate before building",
    "successMetric": "Specific number that proves it works"
  },
  "blueprint": {
    "milestones": ["Milestone 1", "Milestone 2"],
    "blockers": ["Blocker 1"],
    "timelineNotes": "Overall timeline context"
  }
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setMdParsed(parsed);
    } catch (e: any) {
      setMdParseError(e.message || 'Failed to parse the file. Try again.');
    } finally {
      setMdParsing(false);
    }
  };

  const createFromMd = async () => {
    if (!mdParsed) return;
    setMdCreating(true);
    const newProject = createProject(mdParsed.name || 'Imported Project');
    newProject.tags = mdParsed.tags || [];
    newProject.status = 'draft';
    newProject.hypothesis = {
      problem: mdParsed.hypothesis?.problem || '',
      segments: mdParsed.hypothesis?.segments || [],
      solution: mdParsed.hypothesis?.solution || '',
      hook: mdParsed.hypothesis?.hook || '',
      antiCustomer: mdParsed.hypothesis?.antiCustomer || mdParsed.hypothesis?.customer || ''
    };
    newProject.advantage = {
      capability: mdParsed.advantage?.capability || '',
      motivation: mdParsed.advantage?.motivation || '',
      insight: mdParsed.advantage?.insight || ''
    };
    newProject.principles = mdParsed.principles?.length ? mdParsed.principles : ['Boring > Exciting'];
    newProject.clickTest = {
      riskiestAssumption: mdParsed.clickTest?.riskiestAssumption || '',
      testMethod: mdParsed.clickTest?.testMethod || '',
      successMetric: mdParsed.clickTest?.successMetric || ''
    };
    newProject.blueprint = {
      milestones: mdParsed.blueprint?.milestones || [],
      blockers: mdParsed.blueprint?.blockers || [],
      timelineNotes: mdParsed.blueprint?.timelineNotes || ''
    };
    newProject.sources = [{
      id: uuid(), type: 'md-import', title: mdFileName || 'Imported MD',
      content: mdContent.slice(0, 2000), addedAt: new Date().toISOString()
    }];

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      const saved = await res.json();
      setProjects(prev => [saved, ...prev]);
      setSelectedId(saved.id);
    } catch {
      setProjects(prev => [newProject, ...prev]);
      setSelectedId(newProject.id);
    }
    setActiveSection('hypothesis');
    setShowAIGenerate(false);
    resetModal();
    setMdCreating(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧪</div>
          <div style={{ fontSize: 14, color: '#64748b' }}>Loading Click Framework...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f1f5f9' }}>
      
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 60 : 260, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', transition: 'width 0.2s' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}>
          {!sidebarCollapsed && <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Click Framework</div>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>{sidebarCollapsed ? '»' : '«'}</button>
        </div>
        
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => setShowAIGenerate(true)} style={{ padding: '10px', background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
            <span>✨</span> {!sidebarCollapsed && 'AI Foundation Sprint'}
          </button>
          <button onClick={async () => {
            try {
              const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Untitled Idea' })
              });
              const p = await res.json();
              setProjects(prev => [p, ...prev]);
              setSelectedId(p.id);
            } catch {
              const p = createProject();
              setProjects(prev => [p, ...prev]);
              setSelectedId(p.id);
            }
          }} style={{ padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            + {!sidebarCollapsed && 'New Blank Project'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? 4 : 8 }}>
          {projects.length === 0 && !sidebarCollapsed && (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No projects yet</div>
          )}
          {groupedProjects.map(({ key, label, projects: groupProjects }) => (
            <div key={key} style={{ marginBottom: sidebarCollapsed ? 0 : 4 }}>
              {/* Category header */}
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleCategory(key)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 6px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 10, color: '#94a3b8', transition: 'transform 0.15s', display: 'inline-block', transform: collapsedCategories[key] ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: key === '__uncategorized__' ? '#94a3b8' : '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                  <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{groupProjects.length}</span>
                </button>
              )}
              {/* Projects in this category */}
              {!collapsedCategories[key] && groupProjects.map(p => (
                <div
                  key={`${key}-${p.id}`}
                  onClick={() => { setSelectedId(p.id); setConfirmDelete(false); }}
                  style={{
                    padding: sidebarCollapsed ? '8px 0' : '8px 8px 8px 18px', marginBottom: 2, borderRadius: 6, cursor: 'pointer',
                    background: p.id === selectedId ? '#eff6ff' : 'transparent',
                    border: p.id === selectedId ? '1px solid #bfdbfe' : '1px solid transparent',
                    display: sidebarCollapsed ? 'flex' : 'block', justifyContent: 'center'
                  }}
                >
                  {sidebarCollapsed ? (
                    <div title={p.name || 'Untitled'} style={{ width: 8, height: 8, borderRadius: '50%', background: p.id === selectedId ? '#3b82f6' : '#cbd5e1' }} />
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, fontSize: 13, color: p.id === selectedId ? '#1e3a8a' : '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name || 'Untitled'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                        <span style={{ fontSize: 10, padding: '1px 6px', background: p.status === 'validated' ? '#dcfce7' : p.status === 'killed' ? '#fee2e2' : '#fef3c7', borderRadius: 10, color: p.status === 'validated' ? '#166534' : p.status === 'killed' ? '#dc2626' : '#92400e' }}>{p.status}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Archived section */}
          {!sidebarCollapsed && archivedProjects.length > 0 && (
            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 4 }}>
              <button
                onClick={() => setShowArchived(v => !v)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 10, color: '#94a3b8', transition: 'transform 0.15s', display: 'inline-block', transform: showArchived ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>Archived</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{archivedProjects.length}</span>
              </button>
              {showArchived && archivedProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedId(p.id); setConfirmDelete(false); }}
                  style={{
                    padding: '8px 8px 8px 24px', marginBottom: 2, borderRadius: 6, cursor: 'pointer',
                    background: p.id === selectedId ? '#f1f5f9' : 'transparent',
                    border: p.id === selectedId ? '1px solid #e2e8f0' : '1px solid transparent',
                    opacity: 0.65
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📦 {p.name || 'Untitled'}
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{p.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {selectedProject ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <input 
                value={selectedProject.name} 
                onChange={e => updateProject({ name: e.target.value })}
                style={{ fontSize: 20, fontWeight: 700, border: 'none', outline: 'none', flex: 1, color: '#0f172a', minWidth: 0 }}
              />
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <select value={selectedProject.status} onChange={e => updateProject({ status: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => {
                  const blob = new Blob([generateMarkdown(selectedProject)], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `${selectedProject.name}.md`; a.click();
                  URL.revokeObjectURL(url);
                }} style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Export MD</button>
                <button
                  onClick={() => updateProject({ archived: !selectedProject.archived })}
                  title={selectedProject.archived ? 'Unarchive project' : 'Archive project'}
                  style={{ padding: '6px 12px', background: selectedProject.archived ? '#f0fdf4' : '#f8fafc', color: selectedProject.archived ? '#16a34a' : '#64748b', border: `1px solid ${selectedProject.archived ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                >
                  {selectedProject.archived ? '📤 Unarchive' : '📦 Archive'}
                </button>
                <button onClick={deleteProject} style={{ padding: '6px 12px', background: confirmDelete ? '#dc2626' : '#fee2e2', color: confirmDelete ? 'white' : '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  {confirmDelete ? 'Confirm Delete?' : 'Delete'}
                </button>
                {confirmDelete && <button onClick={() => setConfirmDelete(false)} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancel</button>}
              </div>
            </div>
            {selectedProject.archived && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                <span>📦</span>
                <span>This project is archived.</span>
                <button onClick={() => updateProject({ archived: false })} style={{ marginLeft: 4, padding: '2px 10px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 12, color: '#334155' }}>Unarchive</button>
              </div>
            )}
            {selectedProject.hypothesis?.hook && (
              <div style={{ fontSize: 14, color: '#4f46e5', fontWeight: 500, fontStyle: 'italic' }}>
                "{selectedProject.hypothesis.hook}"
              </div>
            )}
            {/* Tags row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {(selectedProject.tags || []).map((tag, idx) => (
                <span key={idx} style={{ fontSize: 11, padding: '3px 8px', background: '#dbeafe', borderRadius: 10, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {tag}
                  <button onClick={() => updateProject({ tags: (selectedProject.tags || []).filter((_, i) => i !== idx) })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#3b82f6', padding: 0 }}>✕</button>
                </span>
              ))}
              <input type="text" placeholder="+ tag" onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { updateProject({ tags: [...(selectedProject.tags || []), (e.target as HTMLInputElement).value.trim()] }); (e.target as HTMLInputElement).value = ''; } }} style={{ padding: '3px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, width: 60 }} />
            </div>

            {/* Categories row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>in:</span>
              {(selectedProject.categories || []).map((cat, idx) => (
                <span key={idx} style={{ fontSize: 11, padding: '3px 8px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {cat}
                  <button onClick={() => updateProject({ categories: (selectedProject.categories || []).filter((_, i) => i !== idx) })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#16a34a', padding: 0 }}>✕</button>
                </span>
              ))}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={catInput}
                  placeholder="+ category"
                  onChange={e => { setCatInput(e.target.value); setCatDropdownOpen(true); }}
                  onFocus={() => setCatDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setCatDropdownOpen(false), 150)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && catInput.trim()) {
                      const val = catInput.trim();
                      if (!(selectedProject.categories || []).includes(val)) {
                        updateProject({ categories: [...(selectedProject.categories || []), val] });
                      }
                      setCatInput('');
                      setCatDropdownOpen(false);
                    }
                  }}
                  style={{ padding: '3px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, width: 90 }}
                />
                {catDropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 160, maxHeight: 180, overflowY: 'auto', marginTop: 2 }}>
                    {allCategories
                      .filter(c => c.toLowerCase().includes(catInput.toLowerCase()) && !(selectedProject.categories || []).includes(c))
                      .map(c => (
                        <button
                          key={c}
                          onMouseDown={() => {
                            updateProject({ categories: [...(selectedProject.categories || []), c] });
                            setCatInput('');
                            setCatDropdownOpen(false);
                          }}
                          style={{ display: 'block', width: '100%', padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, color: '#334155' }}
                        >
                          {c}
                        </button>
                      ))
                    }
                    {catInput.trim() && !allCategories.includes(catInput.trim()) && (
                      <button
                        onMouseDown={() => {
                          const val = catInput.trim();
                          if (!(selectedProject.categories || []).includes(val)) {
                            updateProject({ categories: [...(selectedProject.categories || []), val] });
                          }
                          setCatInput('');
                          setCatDropdownOpen(false);
                        }}
                        style={{ display: 'block', width: '100%', padding: '7px 12px', background: '#f8fafc', border: 'none', borderTop: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', fontSize: 12, color: '#4f46e5', fontWeight: 600 }}
                      >
                        + Create "{catInput.trim()}"
                      </button>
                    )}
                    {allCategories.filter(c => c.toLowerCase().includes(catInput.toLowerCase()) && !(selectedProject.categories || []).includes(c)).length === 0 && !catInput.trim() && (
                      <div style={{ padding: '8px 12px', fontSize: 11, color: '#94a3b8' }}>Type to create a category</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section nav + Form Area */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* Vertical section nav */}
            <div style={{ width: 210, borderRight: '1px solid #e2e8f0', background: 'white', overflowY: 'auto', flexShrink: 0, paddingTop: 8, paddingBottom: 8 }}>
              {Object.entries(SECTIONS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                    padding: '9px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderLeft: `3px solid ${activeSection === key ? '#4f46e5' : 'transparent'}`,
                    background: activeSection === key ? '#f5f3ff' : 'transparent',
                    color: activeSection === key ? '#4f46e5' : '#64748b',
                    fontSize: 13, fontWeight: activeSection === key ? 600 : 400,
                    boxSizing: 'border-box' as const,
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{config.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{config.name}</span>
                </button>
              ))}
            </div>

            {/* Form Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 32, boxSizing: 'border-box' as const }}>

            {activeSection === 'hypothesis' && (
              <>
                <TextAreaField
                  label="Universal Problem"
                  helperText="Jake Knapp's Click Framework: [Target User] + [Root Bottleneck] → [Quantifiable Consequence]. Use roles, not names. Compress scattered friction into one structural defect. Make consequences explicit and measurable. Ultra-tight (~140 chars) for pitches; Balanced (~200 chars) for decks; Action-oriented (~260 chars) for sprint briefs and PRDs."
                  value={selectedProject.hypothesis?.problem}
                  onChange={v => updateNested('hypothesis', 'problem', v)}
                />

                {/* Customer Segments */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Customer Segments</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Break the universal problem into each segment's specific scenario — then show how the solution resolves it for them.</div>
                    </div>
                    <button
                      onClick={() => {
                        const seg = createSegment();
                        const updated = { ...selectedProject.hypothesis, segments: [...(selectedProject.hypothesis?.segments || []), seg] };
                        updateProject({ hypothesis: updated });
                      }}
                      style={{ padding: '6px 14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      + Add Segment
                    </button>
                  </div>

                  {(selectedProject.hypothesis?.segments || []).length === 0 && (
                    <div style={{ padding: '20px 16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      No segments yet — click "+ Add Segment" to define who you're serving.
                    </div>
                  )}

                  {(selectedProject.hypothesis?.segments || []).map((seg, idx) => {
                    const updateSeg = (field, val) => {
                      const segs = [...(selectedProject.hypothesis?.segments || [])];
                      segs[idx] = { ...segs[idx], [field]: val };
                      updateProject({ hypothesis: { ...selectedProject.hypothesis, segments: segs } });
                    };
                    const removeSeg = () => {
                      const segs = (selectedProject.hypothesis?.segments || []).filter((_, i) => i !== idx);
                      updateProject({ hypothesis: { ...selectedProject.hypothesis, segments: segs } });
                    };
                    return (
                      <div key={seg.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
                        <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 22, height: 22, background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                          <input
                            value={seg.name}
                            onChange={e => updateSeg('name', e.target.value)}
                            placeholder="Segment name (e.g. 'Freelance Designer')"
                            style={{ flex: 1, fontSize: 13, fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', color: '#0f172a' }}
                          />
                          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 6, padding: 2, gap: 2, flexShrink: 0 }}>
                            {(['primary', 'secondary'] as const).map(t => (
                              <button
                                key={t}
                                onClick={() => updateSeg('type', t)}
                                style={{
                                  padding: '3px 10px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                  background: (seg.type || 'primary') === t ? (t === 'primary' ? '#0f172a' : '#64748b') : 'transparent',
                                  color: (seg.type || 'primary') === t ? 'white' : '#64748b',
                                  transition: 'all 0.15s',
                                }}
                              >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                            ))}
                          </div>
                          <button onClick={removeSeg} style={{ padding: '3px 10px', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#dc2626' }}>Remove</button>
                        </div>
                        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Who they are</div>
                            <textarea
                              value={seg.description}
                              onChange={e => updateSeg('description', e.target.value)}
                              placeholder="Role, context, scale — be specific."
                              rows={3}
                              style={{ width: '100%', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 10px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pain Point</div>
                            <textarea
                              value={seg.painPoint}
                              onChange={e => updateSeg('painPoint', e.target.value)}
                              placeholder="How does the universal problem show up in their world?"
                              rows={3}
                              style={{ width: '100%', fontSize: 13, border: '1px solid #fecaca', borderRadius: 6, padding: '8px 10px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolution</div>
                            <textarea
                              value={seg.resolution}
                              onChange={e => updateSeg('resolution', e.target.value)}
                              placeholder="How does the universal solution specifically fix their pain?"
                              rows={3}
                              style={{ width: '100%', fontSize: 13, border: '1px solid #a7f3d0', borderRadius: 6, padding: '8px 10px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <TextAreaField
                  label="Universal Solution"
                  helperText="What is the single offering or transformation that resolves the universal problem for all segments?"
                  value={selectedProject.hypothesis?.solution}
                  onChange={v => updateNested('hypothesis', 'solution', v)}
                />
                <TextAreaField
                  label="The Hook (One-Liner)"
                  helperText="Why will they care NOW? What is the urgent benefit?"
                  value={selectedProject.hypothesis?.hook}
                  onChange={v => updateNested('hypothesis', 'hook', v)}
                  rows={2}
                />
                <TextAreaField
                  label="The Anti-Customer"
                  helperText="Who are we explicitly NOT serving?"
                  value={selectedProject.hypothesis?.antiCustomer}
                  onChange={v => updateNested('hypothesis', 'antiCustomer', v)}
                  rows={2}
                />
              </>
            )}

            {activeSection === 'advantage' && (
              <>
                <TextAreaField 
                  label="Capability (Can we?)" 
                  helperText="Do we have the tech, assets, or skills to pull this off?"
                  value={selectedProject.advantage?.capability} 
                  onChange={v => updateNested('advantage', 'capability', v)} 
                />
                <TextAreaField 
                  label="Motivation (Do we care?)" 
                  helperText="Why does this matter to us beyond just money?"
                  value={selectedProject.advantage?.motivation} 
                  onChange={v => updateNested('advantage', 'motivation', v)} 
                />
                <TextAreaField 
                  label="Insight (What do we know?)" 
                  helperText="What secret about this industry do we know that competitors miss?"
                  value={selectedProject.advantage?.insight} 
                  onChange={v => updateNested('advantage', 'insight', v)} 
                />
              </>
            )}

            {activeSection === 'principles' && (
              <ArrayEditor 
                label="Project Principles" 
                helperText="Set guardrails to prevent scope creep. Use the format: 'This > That' (e.g. 'Boring > Exciting')."
                items={selectedProject.principles}
                onChange={v => updateProject({ principles: v })}
                placeholder="Add a principle..."
              />
            )}

            {activeSection === 'clickTest' && (
              <>
                <TextAreaField 
                  label="Riskiest Assumption" 
                  helperText="What is the one thing that, if false, kills the whole business?"
                  value={selectedProject.clickTest?.riskiestAssumption} 
                  onChange={v => updateNested('clickTest', 'riskiestAssumption', v)} 
                />
                <TextAreaField 
                  label="The Test Method" 
                  helperText="How will you validate this *before* building the product? (e.g. Sales Deck, Fake Door)"
                  value={selectedProject.clickTest?.testMethod} 
                  onChange={v => updateNested('clickTest', 'testMethod', v)} 
                />
                <TextAreaField 
                  label="Success Metric" 
                  helperText="What specific number proves it works? (e.g. 3 Signed LOIs)"
                  value={selectedProject.clickTest?.successMetric} 
                  onChange={v => updateNested('clickTest', 'successMetric', v)} 
                />
              </>
            )}

            {activeSection === 'blueprint' && (
              <>
                <ArrayEditor 
                  label="Execution Milestones" 
                  items={selectedProject.blueprint?.milestones || []}
                  onChange={v => updateNested('blueprint', 'milestones', v)}
                  placeholder="Add a milestone..."
                  helperText="Key checkpoints on the path to launch"
                />
                <ArrayEditor 
                  label="Blockers" 
                  items={selectedProject.blueprint?.blockers || []}
                  onChange={v => updateNested('blueprint', 'blockers', v)}
                  placeholder="Add a blocker..."
                  helperText="What's in the way right now?"
                />
                <TextAreaField 
                  label="Timeline Notes" 
                  helperText="Overall timing context and constraints"
                  value={selectedProject.blueprint?.timelineNotes || ''} 
                  onChange={v => updateNested('blueprint', 'timelineNotes', v)} 
                />
              </>
            )}

            {activeSection === 'journey' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
                  <TextAreaField
                    label="Persona"
                    helperText="Who is taking this journey?"
                    value={selectedProject.journey?.persona || ''}
                    onChange={v => updateJourney({ persona: v })}
                    rows={2}
                  />
                  <TextAreaField
                    label="User Goal"
                    helperText="What are they ultimately trying to accomplish?"
                    value={selectedProject.journey?.goal || ''}
                    onChange={v => updateJourney({ goal: v })}
                    rows={2}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
                    Journey Stages <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({(selectedProject.journey?.stages || []).length} stages)</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={generateJourney}
                      disabled={journeyGenerating}
                      style={{ padding: '8px 16px', background: journeyGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: journeyGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      {journeyGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                    <button
                      onClick={() => updateJourney({ stages: [...(selectedProject.journey?.stages || []), createStage()] })}
                      style={{ padding: '8px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                    >
                      + Add Stage
                    </button>
                  </div>
                </div>

                {journeyError && (
                  <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{journeyError}</div>
                )}

                {journeyGenerating && (
                  <div style={{ padding: 24, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Mapping the user journey...</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Generating stages, emotions, pain points, and opportunities</div>
                  </div>
                )}

                {(selectedProject.journey?.stages || []).length === 0 && !journeyGenerating && (
                  <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                    No stages yet. Click "Generate with AI" to auto-map the journey from your hypothesis, or add stages manually.
                  </div>
                )}

                {(selectedProject.journey?.stages || []).map((stage, idx, arr) => (
                  <JourneyStageCard
                    key={stage.id}
                    stage={stage}
                    index={idx}
                    total={arr.length}
                    onChange={updated => {
                      const stages = [...(selectedProject.journey?.stages || [])];
                      stages[idx] = updated;
                      updateJourney({ stages });
                    }}
                    onRemove={() => updateJourney({ stages: (selectedProject.journey?.stages || []).filter((_, i) => i !== idx) })}
                    onMoveUp={() => {
                      if (idx === 0) return;
                      const stages = [...(selectedProject.journey?.stages || [])];
                      [stages[idx - 1], stages[idx]] = [stages[idx], stages[idx - 1]];
                      updateJourney({ stages });
                    }}
                    onMoveDown={() => {
                      const stages = [...(selectedProject.journey?.stages || [])];
                      if (idx >= stages.length - 1) return;
                      [stages[idx], stages[idx + 1]] = [stages[idx + 1], stages[idx]];
                      updateJourney({ stages });
                    }}
                  />
                ))}
              </div>
            )}

            {activeSection === 'empathyMap' && (() => {
              const em = selectedProject.empathyMap || { says: [], thinks: [], does: [], feels: [], pains: [], gains: [] };
              const quadrants = [
                { key: 'says',   label: 'Says',   color: '#dbeafe', border: '#93c5fd', text: '#1e40af', placeholder: 'What they say out loud...' },
                { key: 'thinks', label: 'Thinks', color: '#ede9fe', border: '#c4b5fd', text: '#5b21b6', placeholder: 'What they think but may not voice...' },
                { key: 'does',   label: 'Does',   color: '#dcfce7', border: '#86efac', text: '#166534', placeholder: 'Observable action or behavior...' },
                { key: 'feels',  label: 'Feels',  color: '#fef3c7', border: '#fcd34d', text: '#92400e', placeholder: 'Emotional state or feeling...' },
              ];
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={generateEmpathyMap}
                        disabled={empathyGenerating}
                        style={{ padding: '8px 16px', background: empathyGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: empathyGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                      >
                        {empathyGenerating ? 'Generating...' : '✨ Generate with AI'}
                      </button>
                    </div>
                  </div>

                  {empathyError && (
                    <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{empathyError}</div>
                  )}

                  {empathyGenerating && (
                    <div style={{ padding: 24, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🧠</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Mapping customer empathy...</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Generating Says, Thinks, Does, Feels, Pains & Gains</div>
                    </div>
                  )}

                  {/* 2×2 quadrant grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    {quadrants.map(q => (
                      <div key={q.key} style={{ background: q.color, border: `1px solid ${q.border}`, borderRadius: 8, padding: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: q.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{q.label}</div>
                        <ArrayEditor
                          label=""
                          items={em[q.key] || []}
                          onChange={v => updateEmpathyMap({ [q.key]: v })}
                          placeholder={q.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pains & Gains row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Pains</div>
                      <ArrayEditor
                        label=""
                        items={em.pains || []}
                        onChange={v => updateEmpathyMap({ pains: v })}
                        placeholder="Frustration, fear, or obstacle..."
                      />
                    </div>
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Gains</div>
                      <ArrayEditor
                        label=""
                        items={em.gains || []}
                        onChange={v => updateEmpathyMap({ gains: v })}
                        placeholder="Goal, desire, or measure of success..."
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeSection === 'persona' && (() => {
              const pr = selectedProject.persona || { name: '', role: '', age: '', location: '', quote: '', bio: '', goals: [], frustrations: [], behaviors: [], tools: [], motivations: [], personality: [] };
              const NAVY = '#1d2254';
              const PURPLE = '#6a24ff';
              const DARK = '#3a3d5b';
              const LABEL = '#a3a3a3';
              const initials = pr.name ? pr.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : '?';
              const card: React.CSSProperties = { background: 'white', borderRadius: 15, padding: 22, boxSizing: 'border-box' };
              const heading: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 14, letterSpacing: '-0.01em' };
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                    <button
                      onClick={generatePersona}
                      disabled={personaGenerating}
                      style={{ padding: '8px 16px', background: personaGenerating ? '#94a3b8' : `linear-gradient(135deg, ${PURPLE}, #8b4cf6)`, color: 'white', border: 'none', borderRadius: 8, cursor: personaGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      {personaGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>

                  {personaError && (
                    <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{personaError}</div>
                  )}

                  {personaGenerating && (
                    <div style={{ padding: 24, background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>Building your persona...</div>
                    </div>
                  )}

                  {/* Figma persona card — dark navy container */}
                  <div style={{ background: NAVY, borderRadius: 28, padding: 28, display: 'flex', gap: 22, boxSizing: 'border-box' }}>

                    {/* LEFT COLUMN */}
                    <div style={{ width: '31%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>

                      {/* Profile card */}
                      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                        {/* Avatar / photo */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          {pr.photoUrl ? (
                            <img
                              src={pr.photoUrl}
                              alt={pr.name || 'Persona'}
                              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${PURPLE}35`, display: 'block' }}
                            />
                          ) : (
                            <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${PURPLE}18`, border: `3px solid ${PURPLE}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: PURPLE }}>
                              {initials}
                            </div>
                          )}
                        </div>
                        {/* Photo controls */}
                        <button
                          onClick={openPhotoPicker}
                          style={{ fontSize: 11, fontWeight: 600, color: PURPLE, background: 'none', border: `1px solid ${PURPLE}40`, borderRadius: 20, padding: '3px 12px', cursor: 'pointer' }}
                        >
                          {pr.photoUrl ? '↻ Change photo' : '📷 Find photo'}
                        </button>
                        {pr.photoCredit && (
                          <a href={pr.photoCredit.url + '?utm_source=mvp_creator&utm_medium=referral'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: '#aaa', textDecoration: 'none' }}>
                            Photo by {pr.photoCredit.name} / Unsplash
                          </a>
                        )}
                        <input
                          value={pr.name}
                          onChange={e => updatePersona({ name: e.target.value })}
                          placeholder="Full Name"
                          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `2px solid ${PURPLE}30`, outline: 'none', padding: '2px 0', fontSize: 16, fontWeight: 800, color: PURPLE, textAlign: 'center', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {[
                            { label: 'Age',        field: 'age',      placeholder: 'e.g. 34' },
                            { label: 'Occupation', field: 'role',     placeholder: 'e.g. Senior PM' },
                            { label: 'Location',   field: 'location', placeholder: 'e.g. New York' },
                          ].map(row => (
                            <div key={row.field} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: LABEL, textTransform: 'uppercase', letterSpacing: '0.08em', width: 66, flexShrink: 0 }}>{row.label}</span>
                              <input
                                value={pr[row.field] || ''}
                                onChange={e => updatePersona({ [row.field]: e.target.value })}
                                placeholder={row.placeholder}
                                style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #eee', outline: 'none', padding: '2px 0', fontSize: 12, color: DARK, fontFamily: 'inherit' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quote card */}
                      <div style={{ ...card, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 34, color: PURPLE, lineHeight: 1, flexShrink: 0, marginTop: -2, fontWeight: 900 }}>"</span>
                        <textarea
                          value={pr.quote}
                          onChange={e => updatePersona({ quote: e.target.value })}
                          placeholder="A quote that captures their voice..."
                          rows={3}
                          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: DARK, lineHeight: 1.7, resize: 'none', fontFamily: 'inherit', fontStyle: 'italic', padding: 0, width: '100%' }}
                        />
                      </div>

                      {/* Personality card */}
                      <div style={card}>
                        <div style={heading}>Personality</div>
                        <PersonaPillList items={pr.personality || []} onChange={v => updatePersona({ personality: v })} placeholder="e.g. Analytical..." />
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>

                      {/* Bio card */}
                      <div style={card}>
                        <div style={heading}>Bio</div>
                        <textarea
                          value={pr.bio}
                          onChange={e => updatePersona({ bio: e.target.value })}
                          placeholder="2–3 sentences that bring this person to life..."
                          rows={3}
                          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #eee', outline: 'none', fontSize: 13, color: DARK, lineHeight: 1.7, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', padding: '0 0 8px 0' }}
                        />
                      </div>

                      {/* Core Needs + Frustrations */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div style={card}>
                          <div style={heading}>Core Needs</div>
                          <PersonaBulletList items={pr.goals || []} onChange={v => updatePersona({ goals: v })} placeholder="Add a core need..." />
                        </div>
                        <div style={card}>
                          <div style={heading}>Frustrations</div>
                          <PersonaBulletList items={pr.frustrations || []} onChange={v => updatePersona({ frustrations: v })} placeholder="Add a frustration..." />
                        </div>
                      </div>

                      {/* Tools + Motivations */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div style={card}>
                          <div style={heading}>Tools They Use</div>
                          <PersonaPillList items={pr.tools || []} onChange={v => updatePersona({ tools: v })} placeholder="e.g. Notion, Figma..." />
                        </div>
                        <div style={card}>
                          <div style={heading}>Motivations</div>
                          <PersonaBulletList items={pr.motivations || []} onChange={v => updatePersona({ motivations: v })} placeholder="Add a motivation..." />
                        </div>
                      </div>

                      {/* Behaviors — only shown if populated */}
                      {(pr.behaviors || []).length > 0 && (
                        <div style={card}>
                          <div style={heading}>Behaviors</div>
                          <PersonaBulletList items={pr.behaviors || []} onChange={v => updatePersona({ behaviors: v })} placeholder="Add a behavior..." />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeSection === 'competitors' && (() => {
              const competitors = selectedProject.competitors || [];
              const ca = selectedProject.competitiveAnalysis || { positioningAxes: { xLabel: 'Feature Breadth', yLabel: 'Price Point' }, yourPositioning: { x: 0, y: 0 }, generatedAt: '' };
              const axes = ca.positioningAxes || { xLabel: 'Feature Breadth', yLabel: 'Price Point' };

              const relevanceOf = (c: any) => typeof c.relevance === 'number' ? c.relevance : -1;
              const anyScored = competitors.some((c: any) => typeof c.relevance === 'number');
              const sortedCompetitors = [...competitors].sort((a: any, b: any) => {
                if (competitorSort === 'name') return (a.name || '').localeCompare(b.name || '');
                if (competitorSort === 'added') return 0;
                return relevanceOf(b) - relevanceOf(a);
              });
              const relevanceColor = (n: number) => n >= 75
                ? { bg: '#dcfce7', fg: '#166534' }
                : n >= 45
                ? { bg: '#fef9c3', fg: '#854d0e' }
                : { bg: '#f1f5f9', fg: '#475569' };

              return (
                <div>
                  {/* Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {competitors.length > 0
                        ? `${competitors.length} competitor${competitors.length !== 1 ? 's' : ''} · ${ca.generatedAt ? 'Analysis updated ' + new Date(ca.generatedAt).toLocaleDateString() : 'Analysis not generated'}`
                        : 'No competitors yet'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {competitors.length > 1 && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                          Sort
                          <select
                            value={competitorSort}
                            onChange={e => setCompetitorSort(e.target.value as 'relevance' | 'name' | 'added')}
                            style={{ padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, background: 'white', cursor: 'pointer', color: '#334155' }}
                          >
                            <option value="relevance">Relevance (high → low)</option>
                            <option value="name">Name (A–Z)</option>
                            <option value="added">Default (order added)</option>
                          </select>
                        </label>
                      )}
                      {competitors.length > 0 && (
                        <button
                          onClick={scoreRelevance}
                          disabled={scoringRelevance || competitorGenerating}
                          title="Use AI to score how relevant each competitor is to this project"
                          style={{ padding: '8px 14px', background: scoringRelevance ? '#94a3b8' : '#0f766e', color: 'white', border: 'none', borderRadius: 6, cursor: scoringRelevance ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                        >
                          {scoringRelevance ? '⏳ Scoring...' : '🎯 Score Relevance'}
                        </button>
                      )}
                      <button
                        onClick={suggestCompetitors}
                        disabled={competitorGenerating}
                        style={{ padding: '8px 16px', background: competitorGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: competitorGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                      >
                        {competitorGenerating ? '⏳ Suggesting...' : '✨ Suggest with AI'}
                      </button>
                      <button
                        onClick={() => {
                          const blank = { id: uuid(), name: '', website: '', description: '', features: [], targetMarket: '', painPoints: [], pricing: '', positioning: { x: 0, y: 0 } };
                          updateCompetitors([...competitors, blank]);
                          setEditingCompetitorId(blank.id);
                        }}
                        style={{ padding: '8px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                      >
                        + Add Manually
                      </button>
                    </div>
                  </div>

                  {competitorError && (
                    <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{competitorError}</div>
                  )}

                  {competitorGenerating && (
                    <div style={{ padding: 24, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>⚔️</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Scanning the competitive landscape...</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Identifying competitors, features, target markets, and positioning</div>
                    </div>
                  )}

                  {competitors.length === 0 && !competitorGenerating && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1', marginBottom: 16 }}>
                      No competitors added yet. Click "Suggest with AI" to auto-identify from your hypothesis, or add them manually.
                    </div>
                  )}

                  {/* Competitor cards */}
                  {sortedCompetitors.map((comp) => {
                    const isEditing = editingCompetitorId === comp.id;
                    const origIdx = competitors.findIndex((c: any) => c.id === comp.id);
                    const chipColor = COMPETITOR_COLORS[(origIdx < 0 ? 0 : origIdx) % COMPETITOR_COLORS.length];
                    return (
                      <div key={comp.id} style={{ background: 'white', border: `1px solid ${isEditing ? '#c4b5fd' : '#e2e8f0'}`, borderRadius: 10, padding: 20, marginBottom: 12 }}>
                        {isEditing ? (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Name</label>
                                <input value={comp.name} onChange={e => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, name: e.target.value } : c))} placeholder="Competitor name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
                              </div>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Website</label>
                                <input value={comp.website || ''} onChange={e => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, website: e.target.value } : c))} placeholder="example.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
                              </div>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Description</label>
                              <textarea value={comp.description || ''} onChange={e => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, description: e.target.value } : c))} placeholder="What they do and how they're positioned..." rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Key Features</div>
                                <ArrayEditor label="" items={comp.features || []} onChange={v => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, features: v } : c))} placeholder="Add a feature..." />
                              </div>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Pain Points Addressed</div>
                                <ArrayEditor label="" items={comp.painPoints || []} onChange={v => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, painPoints: v } : c))} placeholder="Add a pain point..." />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Target Market</label>
                                <textarea value={comp.targetMarket || ''} onChange={e => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, targetMarket: e.target.value } : c))} rows={2} placeholder="Who they primarily serve..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
                              </div>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Pricing Model</label>
                                <input value={comp.pricing || ''} onChange={e => updateCompetitors(competitors.map(c => c.id === comp.id ? { ...c, pricing: e.target.value } : c))} placeholder="e.g. Freemium / $29/mo / Enterprise" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <button onClick={() => updateCompetitors(competitors.filter(c => c.id !== comp.id))} style={{ padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>
                              <button onClick={() => setEditingCompetitorId(null)} style={{ padding: '6px 18px', background: '#334155', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Done</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: chipColor, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{comp.name || 'Unnamed Competitor'}</div>
                                  {comp.website && <div style={{ fontSize: 11, color: '#94a3b8' }}>{comp.website}</div>}
                                </div>
                                {comp.pricing && <span style={{ fontSize: 11, padding: '2px 8px', background: '#f1f5f9', borderRadius: 10, color: '#475569', marginLeft: 4 }}>{comp.pricing}</span>}
                                {typeof comp.relevance === 'number' && (() => {
                                  const rc = relevanceColor(comp.relevance);
                                  return (
                                    <span title={comp.relevanceReason || 'AI-scored relevance to this project'} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', background: rc.bg, color: rc.fg, borderRadius: 10, marginLeft: 4, whiteSpace: 'nowrap' }}>
                                      {comp.relevance} · relevance
                                    </span>
                                  );
                                })()}
                              </div>
                              <button onClick={() => setEditingCompetitorId(comp.id)} style={{ padding: '4px 12px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#64748b' }}>Edit</button>
                            </div>
                            {comp.description && <p style={{ fontSize: 13, color: '#475569', margin: '0 0 12px', lineHeight: 1.5 }}>{comp.description}</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Key Features</div>
                                {(comp.features || []).slice(0, 4).map((f, i) => <div key={i} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>• {f}</div>)}
                                {!(comp.features || []).length && <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>None added</div>}
                              </div>
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Target Market</div>
                                <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{comp.targetMarket || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not defined</span>}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Pain Points</div>
                                {(comp.painPoints || []).slice(0, 3).map((p, i) => <div key={i} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>• {p}</div>)}
                                {!(comp.painPoints || []).length && <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>None added</div>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Analysis section */}
                  {competitors.length > 0 && (
                    <div style={{ marginTop: 32, borderTop: '2px solid #e2e8f0', paddingTop: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Competitive Analysis</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            onClick={generateCompetitiveAnalysis}
                            disabled={analysisGenerating}
                            style={{ padding: '8px 14px', background: analysisGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: analysisGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                          >
                            {analysisGenerating ? '⏳ Analyzing...' : '✨ Generate Analysis'}
                          </button>
                          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                            {(['table', 'map'] as const).map(v => (
                              <button key={v} onClick={() => setCompetitorView(v)} style={{ padding: '6px 14px', background: competitorView === v ? '#334155' : 'white', color: competitorView === v ? 'white' : '#64748b', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                {v === 'table' ? '≡ Table' : '◎ 2×2 Map'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {analysisError && (
                        <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{analysisError}</div>
                      )}

                      {analysisGenerating && (
                        <div style={{ padding: 24, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Running competitive analysis...</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Analyzing positioning, differentiators, and market gaps</div>
                        </div>
                      )}

                      {/* Comparison Table */}
                      {competitorView === 'table' && !analysisGenerating && (
                        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 680 }}>
                            <thead>
                              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                {['Competitor', 'Key Features', 'Target Market', 'Pain Points', 'Pricing'].map(h => (
                                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ background: '#faf5ff', borderBottom: '1px solid #ede9fe' }}>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', flexShrink: 0 }} />
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: 13, color: '#4f46e5' }}>{selectedProject.name}</div>
                                      <div style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700 }}>YOU</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top', fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{(selectedProject.advantage?.capability || '—').slice(0, 140)}</td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top', fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{(selectedProject.hypothesis?.customer || '—').slice(0, 100)}</td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top', fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{(selectedProject.hypothesis?.problem || '—').slice(0, 120)}</td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top' }}><span style={{ fontSize: 11, padding: '2px 8px', background: '#ede9fe', borderRadius: 10, color: '#5b21b6' }}>TBD</span></td>
                              </tr>
                              {competitors.map((comp, idx) => (
                                <tr key={comp.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length], flexShrink: 0 }} />
                                      <div>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{comp.name || '—'}</div>
                                        {comp.website && <div style={{ fontSize: 10, color: '#94a3b8' }}>{comp.website}</div>}
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                    {(comp.features || []).slice(0, 4).map((f, i) => <div key={i} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>• {f}</div>)}
                                    {!(comp.features || []).length && <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'top', fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{comp.targetMarket || '—'}</td>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                    {(comp.painPoints || []).slice(0, 3).map((p, i) => <div key={i} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>• {p}</div>)}
                                    {!(comp.painPoints || []).length && <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>}
                                  </td>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                    {comp.pricing ? <span style={{ fontSize: 11, padding: '2px 8px', background: '#f1f5f9', borderRadius: 10, color: '#475569' }}>{comp.pricing}</span> : <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 2×2 Positioning Map */}
                      {competitorView === 'map' && !analysisGenerating && (
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            <div>
                              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>X-Axis (horizontal)</label>
                              <input value={axes.xLabel || ''} onChange={e => updateCompetitiveAnalysis({ positioningAxes: { ...axes, xLabel: e.target.value } })} placeholder="e.g. Feature Breadth" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>← low / niche · · · high / broad →</div>
                            </div>
                            <div>
                              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Y-Axis (vertical)</label>
                              <input value={axes.yLabel || ''} onChange={e => updateCompetitiveAnalysis({ positioningAxes: { ...axes, yLabel: e.target.value } })} placeholder="e.g. Price Point" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }} />
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>↑ high · · · ↓ low</div>
                            </div>
                          </div>

                          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                            <svg viewBox="0 0 520 520" width="100%" style={{ display: 'block' }}>
                              <rect x="40" y="20" width="220" height="220" fill="#fef3c7" opacity="0.5" rx="4" />
                              <rect x="260" y="20" width="220" height="220" fill="#dcfce7" opacity="0.5" rx="4" />
                              <rect x="40" y="240" width="220" height="240" fill="#fee2e2" opacity="0.5" rx="4" />
                              <rect x="260" y="240" width="220" height="240" fill="#dbeafe" opacity="0.5" rx="4" />
                              <line x1="40" y1="240" x2="486" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="260" y1="14" x2="260" y2="462" stroke="#94a3b8" strokeWidth="1.5" />
                              <polygon points="486,237 494,240 486,243" fill="#94a3b8" />
                              <polygon points="257,14 260,6 263,14" fill="#94a3b8" />
                              <text x="267" y="510" textAnchor="middle" fontSize="12" fill="#475569" fontFamily="-apple-system,sans-serif">{axes.xLabel || 'X Axis'}</text>
                              <text x="14" y="240" textAnchor="middle" fontSize="12" fill="#475569" fontFamily="-apple-system,sans-serif" transform="rotate(-90 14 240)">{axes.yLabel || 'Y Axis'}</text>
                              <text x="44" y="254" fontSize="10" fill="#94a3b8" fontFamily="-apple-system,sans-serif">← low</text>
                              <text x="448" y="254" fontSize="10" fill="#94a3b8" fontFamily="-apple-system,sans-serif">high →</text>
                              <text x="264" y="32" fontSize="10" fill="#94a3b8" fontFamily="-apple-system,sans-serif">high</text>
                              <text x="264" y="456" fontSize="10" fill="#94a3b8" fontFamily="-apple-system,sans-serif">low</text>
                              {(() => {
                                const yx = 260 + (ca.yourPositioning?.x || 0) * 220;
                                const yy = 240 - (ca.yourPositioning?.y || 0) * 220;
                                return (
                                  <g>
                                    <circle cx={yx} cy={yy} r="18" fill="#4f46e5" opacity="0.9" />
                                    <text x={yx} y={yy + 1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="white" fontFamily="-apple-system,sans-serif" fontWeight="700">YOU</text>
                                    <text x={yx} y={yy + 32} textAnchor="middle" fontSize="10" fill="#4f46e5" fontFamily="-apple-system,sans-serif" fontWeight="600">{(selectedProject.name || '').slice(0, 16)}</text>
                                  </g>
                                );
                              })()}
                              {competitors.map((comp, idx) => {
                                const cx = 260 + (comp.positioning?.x || 0) * 220;
                                const cy = 240 - (comp.positioning?.y || 0) * 220;
                                const color = COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length];
                                return (
                                  <g key={comp.id}>
                                    <circle cx={cx} cy={cy} r="13" fill={color} opacity="0.85" />
                                    <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="white" fontFamily="-apple-system,sans-serif" fontWeight="700">{idx + 1}</text>
                                    <text x={cx} y={cy + 26} textAnchor="middle" fontSize="10" fill="#334155" fontFamily="-apple-system,sans-serif">{(comp.name || 'Unknown').slice(0, 14)}</text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#4f46e5' }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{selectedProject.name} (You)</span>
                            </div>
                            {competitors.map((comp, idx) => (
                              <div key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ fontSize: 8, color: 'white', fontWeight: 700 }}>{idx + 1}</span>
                                </div>
                                <span style={{ fontSize: 12, color: '#334155' }}>{comp.name}</span>
                              </div>
                            ))}
                          </div>

                          {!ca.generatedAt && (
                            <div style={{ marginTop: 14, padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
                              💡 All competitors are placed at (0, 0) by default. Click "Generate Analysis" to auto-position them based on your project data.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {activeSection === 'importanceMatrix' && (() => {
              const matrixData = selectedProject.importanceMatrix || { items: [], generatedAt: '' };
              const items = matrixData.items || [];

              const getQuadrant = (item) => {
                const hi = item.importance >= 0.5;
                const hs = item.solutionEffectiveness >= 0.5;
                if (hi && !hs) return { label: 'Critical Gap', color: '#ef4444', bg: '#fef2f2' };
                if (hi && hs)  return { label: 'Strength', color: '#22c55e', bg: '#f0fdf4' };
                if (!hi && !hs) return { label: 'Low Priority', color: '#94a3b8', bg: '#f8fafc' };
                return { label: 'Overkill', color: '#f97316', bg: '#fff7ed' };
              };

              const SVG_W = 880, SVG_H = 500;
              const PAD = { left: 56, right: 24, top: 24, bottom: 52 };
              const plotW = SVG_W - PAD.left - PAD.right;
              const plotH = SVG_H - PAD.top - PAD.bottom;
              const cx = PAD.left + plotW / 2;
              const cy = PAD.top + plotH / 2;
              const toSvg = (item) => ({
                x: PAD.left + item.solutionEffectiveness * plotW,
                y: PAD.top + (1 - item.importance) * plotH
              });

              return (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Importance-Solution Matrix</h2>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Plot problems by how important they are to your customer vs. how well existing solutions address them.</p>
                  </div>

                  {/* Top controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{items.length} problem{items.length !== 1 ? 's' : ''}</span>
                    <button
                      onClick={suggestMatrixItems}
                      disabled={matrixGenerating}
                      style={{ padding: '8px 16px', background: matrixGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: matrixGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      {matrixGenerating ? '⏳ Suggesting...' : '✨ Suggest with AI'}
                    </button>
                    <button
                      onClick={() => {
                        const blank = { id: uuid(), label: '', description: '', importance: 0.5, solutionEffectiveness: 0.5 };
                        updateImportanceMatrix({ items: [...items, blank] });
                        setEditingMatrixItemId(blank.id);
                      }}
                      style={{ padding: '8px 14px', background: 'white', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      + Add Manually
                    </button>
                    {items.length > 0 && (
                      <button
                        onClick={() => updateImportanceMatrix({ items: [], generatedAt: '' })}
                        style={{ marginLeft: 'auto', padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {matrixError && (
                    <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{matrixError}</div>
                  )}
                  {matrixGenerating && (
                    <div style={{ padding: 16, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#3b82f6', marginBottom: 16 }}>
                      Analyzing your product context and generating problem scores…
                    </div>
                  )}

                  {items.length === 0 && !matrixGenerating && (
                    <div style={{ padding: 32, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No problems mapped yet</div>
                      <div style={{ fontSize: 13 }}>Use AI to suggest problems, or add them manually.</div>
                    </div>
                  )}

                  {items.length > 0 && (
                    <div>
                      {/* Top: full-width 2×2 SVG map */}
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>Positioning Map</div>
                        <svg width={SVG_W} height={SVG_H} style={{ display: 'block', width: '100%', height: 'auto' }} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
                          {/* Quadrant backgrounds */}
                          <rect x={PAD.left} y={PAD.top} width={plotW/2} height={plotH/2} fill="#fef2f2" rx={4} />
                          <rect x={cx} y={PAD.top} width={plotW/2} height={plotH/2} fill="#f0fdf4" rx={4} />
                          <rect x={PAD.left} y={cy} width={plotW/2} height={plotH/2} fill="#f8fafc" rx={4} />
                          <rect x={cx} y={cy} width={plotW/2} height={plotH/2} fill="#fff7ed" rx={4} />

                          {/* Quadrant border */}
                          <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="none" stroke="#e2e8f0" strokeWidth={1} rx={4} />

                          {/* Divider lines */}
                          <line x1={cx} y1={PAD.top} x2={cx} y2={PAD.top + plotH} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5,4" />
                          <line x1={PAD.left} y1={cy} x2={PAD.left + plotW} y2={cy} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5,4" />

                          {/* Quadrant labels */}
                          <text x={PAD.left + 10} y={PAD.top + 20} fontSize={12} fontWeight={700} fill="#ef4444" fontFamily="Inter, sans-serif">Critical Gap</text>
                          <text x={cx + 10} y={PAD.top + 20} fontSize={12} fontWeight={700} fill="#22c55e" fontFamily="Inter, sans-serif">Strength</text>
                          <text x={PAD.left + 10} y={cy + 20} fontSize={12} fontWeight={700} fill="#94a3b8" fontFamily="Inter, sans-serif">Low Priority</text>
                          <text x={cx + 10} y={cy + 20} fontSize={12} fontWeight={700} fill="#f97316" fontFamily="Inter, sans-serif">Overkill</text>

                          {/* Quadrant sub-labels */}
                          <text x={PAD.left + 10} y={PAD.top + 36} fontSize={10} fill="#ef4444" opacity={0.7} fontFamily="Inter, sans-serif">High value, underserved</text>
                          <text x={cx + 10} y={PAD.top + 36} fontSize={10} fill="#22c55e" opacity={0.7} fontFamily="Inter, sans-serif">Well addressed</text>
                          <text x={PAD.left + 10} y={cy + 36} fontSize={10} fill="#94a3b8" opacity={0.7} fontFamily="Inter, sans-serif">Deprioritize</text>
                          <text x={cx + 10} y={cy + 36} fontSize={10} fill="#f97316" opacity={0.7} fontFamily="Inter, sans-serif">Solutions exceed need</text>

                          {/* Axis labels */}
                          <text x={SVG_W / 2} y={SVG_H - 8} fontSize={11} textAnchor="middle" fill="#64748b" fontWeight={600} fontFamily="Inter, sans-serif">← Less Effective · Solution Effectiveness · More Effective →</text>
                          <text x={14} y={SVG_H / 2} fontSize={11} textAnchor="middle" fill="#64748b" fontWeight={600} fontFamily="Inter, sans-serif" transform={`rotate(-90, 14, ${SVG_H/2})`}>← Low · Importance · High →</text>

                          {/* Item dots */}
                          {items.map((item, idx) => {
                            const pos = toSvg(item);
                            const q = getQuadrant(item);
                            return (
                              <g key={item.id} style={{ cursor: 'pointer' }} onClick={() => setEditingMatrixItemId(item.id)}>
                                <circle cx={pos.x} cy={pos.y} r={15} fill={q.color} opacity={0.9} />
                                <text x={pos.x} y={pos.y + 5} fontSize={11} textAnchor="middle" fill="white" fontWeight={700} fontFamily="Inter, sans-serif">{idx + 1}</text>
                                {item.label && (
                                  <text x={pos.x + 19} y={pos.y + 5} fontSize={10} fill="#334155" fontFamily="Inter, sans-serif" style={{ pointerEvents: 'none' }}>{item.label.length > 22 ? item.label.slice(0,22) + '…' : item.label}</text>
                                )}
                              </g>
                            );
                          })}
                        </svg>

                        {/* Legend */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                          {[{ label: 'Critical Gap', color: '#ef4444' }, { label: 'Strength', color: '#22c55e' }, { label: 'Low Priority', color: '#94a3b8' }, { label: 'Overkill', color: '#f97316' }].map(q => (
                            <div key={q.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 10, height: 10, borderRadius: 2, background: q.color }} />
                              <span style={{ fontSize: 12, color: '#475569' }}>{q.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom: cards in 2-column grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {items.map((item, idx) => {
                          const q = getQuadrant(item);
                          const isEditing = editingMatrixItemId === item.id;
                          return (
                            <div key={item.id} style={{ background: 'white', border: `1px solid ${isEditing ? '#6366f1' : '#e2e8f0'}`, borderRadius: 10, padding: 14 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isEditing ? 12 : 6 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>{idx + 1}</span>
                                </div>
                                {isEditing ? (
                                  <input
                                    value={item.label}
                                    onChange={e => updateImportanceMatrix({ items: items.map(i => i.id === item.id ? { ...i, label: e.target.value } : i) })}
                                    placeholder="Problem label (3–6 words)"
                                    style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                                    autoFocus
                                  />
                                ) : (
                                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{item.label || 'Untitled problem'}</span>
                                )}
                                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: q.bg, color: q.color, flexShrink: 0 }}>{q.label}</span>
                              </div>

                              {isEditing && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                  <textarea
                                    value={item.description}
                                    onChange={e => updateImportanceMatrix({ items: items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i) })}
                                    placeholder="One sentence describing this problem…"
                                    rows={2}
                                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
                                  />
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                                      Importance <span style={{ color: '#4f46e5', fontWeight: 700 }}>{Math.round(item.importance * 100)}</span>
                                    </label>
                                    <input type="range" min={0} max={100} value={Math.round(item.importance * 100)}
                                      onChange={e => updateImportanceMatrix({ items: items.map(i => i.id === item.id ? { ...i, importance: Number(e.target.value) / 100 } : i) })}
                                      style={{ width: '100%', accentColor: '#4f46e5', marginTop: 4 }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                                      Solution Effectiveness <span style={{ color: '#4f46e5', fontWeight: 700 }}>{Math.round(item.solutionEffectiveness * 100)}</span>
                                    </label>
                                    <input type="range" min={0} max={100} value={Math.round(item.solutionEffectiveness * 100)}
                                      onChange={e => updateImportanceMatrix({ items: items.map(i => i.id === item.id ? { ...i, solutionEffectiveness: Number(e.target.value) / 100 } : i) })}
                                      style={{ width: '100%', accentColor: '#4f46e5', marginTop: 4 }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => setEditingMatrixItemId(null)} style={{ padding: '6px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Done</button>
                                    <button onClick={() => updateImportanceMatrix({ items: items.filter(i => i.id !== item.id) })} style={{ padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>
                                  </div>
                                </div>
                              )}

                              {!isEditing && (
                                <div>
                                  {item.description && <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>{item.description}</p>}
                                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94a3b8' }}>
                                    <span>Importance: <strong style={{ color: '#334155' }}>{Math.round(item.importance * 100)}</strong></span>
                                    <span>Solution: <strong style={{ color: '#334155' }}>{Math.round(item.solutionEffectiveness * 100)}</strong></span>
                                  </div>
                                  <button
                                    onClick={() => setEditingMatrixItemId(item.id)}
                                    style={{ marginTop: 8, padding: '4px 10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 11 }}
                                  >Edit</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeSection === 'userFlow' && (() => {
              const uf = selectedProject.userFlow || { persona: '', goal: '', entryPoint: '', exitPoint: '', steps: [], generatedAt: '' };
              const steps = uf.steps || [];

              const typeInfo = (type) => FLOW_STEP_TYPES.find(t => t.value === type) || FLOW_STEP_TYPES[0];

              const stateColor = (s) => {
                if (s === 'loading') return { bg: '#dbeafe', text: '#1d4ed8' };
                if (s === 'success') return { bg: '#dcfce7', text: '#166534' };
                if (s === 'error')   return { bg: '#fee2e2', text: '#dc2626' };
                if (s === 'empty')   return { bg: '#f1f5f9', text: '#475569' };
                if (s === 'idle')    return { bg: '#f0fdf4', text: '#15803d' };
                return null;
              };

              return (
                <div>
                  {/* Header actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {uf.generatedAt ? `Last generated ${new Date(uf.generatedAt).toLocaleDateString()}` : 'No flow generated yet'}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => updateUserFlow({ steps: [...steps, createFlowStep()] })}
                        style={{ padding: '8px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#334155' }}
                      >
                        + Add Step
                      </button>
                      <button
                        onClick={generateUserFlow}
                        disabled={userFlowGenerating}
                        style={{ padding: '8px 16px', background: userFlowGenerating ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: 6, cursor: userFlowGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
                      >
                        {userFlowGenerating ? 'Generating...' : '✨ Generate with AI'}
                      </button>
                    </div>
                  </div>

                  {userFlowError && (
                    <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{userFlowError}</div>
                  )}

                  {userFlowGenerating && (
                    <div style={{ padding: 24, background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🔀</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>Mapping the user flow...</div>
                      <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 4 }}>Identifying steps, decisions, system states, and error paths</div>
                    </div>
                  )}

                  {/* Flow metadata */}
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Persona</label>
                      <input
                        value={uf.persona || ''}
                        onChange={e => updateUserFlow({ persona: e.target.value })}
                        placeholder="Who is taking this flow?"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goal</label>
                      <input
                        value={uf.goal || ''}
                        onChange={e => updateUserFlow({ goal: e.target.value })}
                        placeholder="What are they trying to accomplish?"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#10b981', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>→ Entry Point</label>
                      <input
                        value={uf.entryPoint || ''}
                        onChange={e => updateUserFlow({ entryPoint: e.target.value })}
                        placeholder="What triggers this flow?"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const, background: '#f0fdf4' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Exit Point</label>
                      <input
                        value={uf.exitPoint || ''}
                        onChange={e => updateUserFlow({ exitPoint: e.target.value })}
                        placeholder="What marks success?"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd6fe', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' as const, background: '#faf5ff' }}
                      />
                    </div>
                  </div>

                  {/* Steps count legend */}
                  {steps.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
                      {FLOW_STEP_TYPES.map(t => {
                        const count = steps.filter(s => s.type === t.value).length;
                        if (!count) return null;
                        return (
                          <span key={t.value} style={{ padding: '3px 10px', background: t.bg, color: t.color, borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                            {t.label}: {count}
                          </span>
                        );
                      })}
                      {steps.filter(s => s.systemState === 'error').length > 0 && (
                        <span style={{ padding: '3px 10px', background: '#fee2e2', color: '#dc2626', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                          Error paths: {steps.filter(s => s.systemState === 'error').length}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Empty state */}
                  {steps.length === 0 && !userFlowGenerating && (
                    <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      No steps yet. Click "Generate with AI" to map the full flow, or add steps manually.
                    </div>
                  )}

                  {/* Flow steps */}
                  {steps.map((step, idx) => {
                    const ti = typeInfo(step.type);
                    const sc = stateColor(step.systemState);
                    const isEditing = editingFlowStepId === step.id;
                    const isDecision = step.type === 'user-decision' || step.type === 'system-decision';
                    return (
                      <div key={step.id} style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                        {/* Left rail */}
                        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: 32, flexShrink: 0 }}>
                          <div style={{ width: 28, height: 28, borderRadius: isDecision ? 4 : '50%', background: ti.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0, transform: isDecision ? 'rotate(45deg)' : 'none' }}>
                            <span style={{ transform: isDecision ? 'rotate(-45deg)' : 'none' }}>{idx + 1}</span>
                          </div>
                          {idx < steps.length - 1 && (
                            <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 12 }} />
                          )}
                        </div>

                        {/* Step card */}
                        <div style={{ flex: 1, marginLeft: 12, marginBottom: 8, background: 'white', border: `1px solid ${isEditing ? ti.color : '#e2e8f0'}`, borderRadius: 8, overflow: 'hidden' }}>
                          {/* Card header */}
                          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: isEditing ? ti.bg : 'white', borderBottom: isEditing ? `1px solid ${ti.color}30` : 'none' }}>
                            <span style={{ padding: '2px 8px', background: ti.bg, color: ti.color, borderRadius: 10, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' as const }}>{ti.label}</span>
                            {sc && <span style={{ padding: '2px 8px', background: sc.bg, color: sc.text, borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{step.systemState}</span>}
                            {isEditing ? (
                              <input
                                value={step.label}
                                onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, label: e.target.value } : s) })}
                                style={{ flex: 1, fontSize: 13, fontWeight: 600, border: 'none', outline: 'none', background: 'transparent', color: '#0f172a' }}
                                autoFocus
                              />
                            ) : (
                              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{step.label}</span>
                            )}
                            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                              <button onClick={() => setEditingFlowStepId(isEditing ? null : step.id)} style={{ padding: '3px 8px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#475569' }}>
                                {isEditing ? 'Done' : 'Edit'}
                              </button>
                              <button onClick={() => updateUserFlow({ steps: steps.filter(s => s.id !== step.id) })} style={{ padding: '3px 8px', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#dc2626' }}>✕</button>
                            </div>
                          </div>

                          {/* Card body */}
                          {isEditing ? (
                            <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</label>
                                <select
                                  value={step.type}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, type: e.target.value } : s) })}
                                  style={{ padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 12, width: '100%' }}
                                >
                                  {FLOW_STEP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                                <textarea
                                  value={step.description}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s) })}
                                  rows={2}
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 12, resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>System State</label>
                                <select
                                  value={step.systemState}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, systemState: e.target.value } : s) })}
                                  style={{ padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 12, width: '100%' }}
                                >
                                  {FLOW_SYSTEM_STATES.map(st => <option key={st} value={st}>{st || '— none —'}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nav Context</label>
                                <input
                                  value={step.navContext}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, navContext: e.target.value } : s) })}
                                  placeholder="e.g. Dashboard > Token Sync"
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 12, boxSizing: 'border-box' as const }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#b45309', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Friction</label>
                                <input
                                  value={step.friction}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, friction: e.target.value } : s) })}
                                  placeholder="Pain or cognitive load..."
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #fde68a', borderRadius: 5, fontSize: 12, boxSizing: 'border-box' as const, background: '#fffbeb' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Error Path</label>
                                <input
                                  value={step.errorPath}
                                  onChange={e => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, errorPath: e.target.value } : s) })}
                                  placeholder="Recovery route if error..."
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #fecaca', borderRadius: 5, fontSize: 12, boxSizing: 'border-box' as const, background: '#fef2f2' }}
                                />
                              </div>
                              {(isDecision) && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Branches</label>
                                  {(step.branches || []).map((br, bi) => (
                                    <div key={bi} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                      <input
                                        value={br.condition}
                                        onChange={e => {
                                          const b = [...(step.branches || [])];
                                          b[bi] = { ...b[bi], condition: e.target.value };
                                          updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, branches: b } : s) });
                                        }}
                                        placeholder="If condition..."
                                        style={{ flex: 1, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 11, boxSizing: 'border-box' as const }}
                                      />
                                      <input
                                        value={br.outcome}
                                        onChange={e => {
                                          const b = [...(step.branches || [])];
                                          b[bi] = { ...b[bi], outcome: e.target.value };
                                          updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, branches: b } : s) });
                                        }}
                                        placeholder="→ outcome"
                                        style={{ flex: 1, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 5, fontSize: 11, boxSizing: 'border-box' as const }}
                                      />
                                      <button
                                        onClick={() => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, branches: (s.branches || []).filter((_, i) => i !== bi) } : s) })}
                                        style={{ padding: '5px 8px', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#dc2626' }}
                                      >✕</button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => updateUserFlow({ steps: steps.map(s => s.id === step.id ? { ...s, branches: [...(s.branches || []), { condition: '', outcome: '' }] } : s) })}
                                    style={{ padding: '4px 10px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#475569' }}
                                  >+ Add Branch</button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ padding: '10px 14px' }}>
                              {step.description && <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, marginBottom: 6 }}>{step.description}</div>}
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                                {step.navContext && (
                                  <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>📍 {step.navContext}</span>
                                )}
                                {step.friction && (
                                  <span style={{ fontSize: 11, color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: 4 }}>⚡ {step.friction}</span>
                                )}
                                {step.errorPath && (
                                  <span style={{ fontSize: 11, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: 4 }}>↩ {step.errorPath}</span>
                                )}
                              </div>
                              {(step.branches || []).length > 0 && (
                                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                                  {step.branches.map((br, bi) => (
                                    <div key={bi} style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>
                                      <span style={{ color: '#64748b' }}>{br.condition}</span>
                                      {br.outcome && <> <span style={{ color: '#94a3b8' }}>→</span> <span style={{ color: '#0f172a', fontWeight: 500 }}>{br.outcome}</span></>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {steps.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                      <button
                        onClick={() => updateUserFlow({ steps: [...steps, createFlowStep()] })}
                        style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500 }}
                      >
                        + Add Step
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeSection === 'experienceMap' && (() => {
              const em = selectedProject.experienceMap || { overview: '', phases: [] };
              const EMOTION_COLORS = { Curious: '#818cf8', Frustrated: '#f87171', Hopeful: '#34d399', Delighted: '#fbbf24', Relieved: '#60a5fa', Anxious: '#fb923c', Confident: '#a3e635', Neutral: '#94a3b8' };
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>Experience Phases <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({em.phases.length} phases)</span></div>
                    <button onClick={generateExperienceMap} disabled={experienceMapGenerating} style={{ padding: '8px 16px', background: experienceMapGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: experienceMapGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {experienceMapGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  {em.overview && <div style={{ padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, fontSize: 13, color: '#0369a1', marginBottom: 16 }}>{em.overview}</div>}
                  {experienceMapError && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{experienceMapError}</div>}
                  {experienceMapGenerating && <div style={{ padding: 24, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>🌐</div><div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Mapping the full customer experience...</div></div>}
                  {em.phases.length === 0 && !experienceMapGenerating ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>No phases yet. Click "Generate with AI" to map the full experience arc, or add phases manually.</div>
                  ) : em.phases.map((phase, idx) => (
                    <div key={phase.id || idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                        <input value={phase.name || ''} onChange={e => { const phases = [...em.phases]; phases[idx] = { ...phase, name: e.target.value }; updateExperienceMap({ phases }); }} style={{ flex: 1, fontWeight: 600, fontSize: 14, border: 'none', background: 'transparent', color: '#1e293b', outline: 'none' }} placeholder="Phase name" />
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: (EMOTION_COLORS[phase.emotion] || '#94a3b8') + '22', color: EMOTION_COLORS[phase.emotion] || '#64748b', fontWeight: 600 }}>{phase.emotion || 'Neutral'}</span>
                        <button onClick={() => { const phases = em.phases.filter((_, i) => i !== idx); updateExperienceMap({ phases }); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
                      </div>
                      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Channel</div>
                          <input value={phase.channel || ''} onChange={e => { const phases = [...em.phases]; phases[idx] = { ...phase, channel: e.target.value }; updateExperienceMap({ phases }); }} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxSizing: 'border-box' }} placeholder="e.g. Social Media, In-App, Email" />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Emotion</div>
                          <input value={phase.emotion || ''} onChange={e => { const phases = [...em.phases]; phases[idx] = { ...phase, emotion: e.target.value }; updateExperienceMap({ phases }); }} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxSizing: 'border-box' }} placeholder="e.g. Curious, Frustrated, Delighted" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Touchpoints</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                            {(phase.touchpoints || []).map((tp, ti) => (
                              <span key={ti} style={{ fontSize: 11, padding: '3px 8px', background: '#f1f5f9', borderRadius: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                                {tp}
                                <button onClick={() => { const phases = [...em.phases]; phases[idx] = { ...phase, touchpoints: phase.touchpoints.filter((_, i) => i !== ti) }; updateExperienceMap({ phases }); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1 }}>×</button>
                              </span>
                            ))}
                            <input onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { const phases = [...em.phases]; phases[idx] = { ...phase, touchpoints: [...(phase.touchpoints || []), e.currentTarget.value.trim()] }; updateExperienceMap({ phases }); e.currentTarget.value = ''; } }} style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: '3px 8px', fontSize: 11, outline: 'none', minWidth: 120 }} placeholder="Add touchpoint, press Enter" />
                          </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Experience</div>
                          <textarea value={phase.experience || ''} onChange={e => { const phases = [...em.phases]; phases[idx] = { ...phase, experience: e.target.value }; updateExperienceMap({ phases }); }} rows={2} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }} placeholder="What does the customer experience in this phase?" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>💡 Insight / Opportunity</div>
                          <textarea value={phase.insights || ''} onChange={e => { const phases = [...em.phases]; phases[idx] = { ...phase, insights: e.target.value }; updateExperienceMap({ phases }); }} rows={2} style={{ width: '100%', padding: '6px 8px', border: '1px solid #bae6fd', borderRadius: 6, fontSize: 12, resize: 'vertical', background: '#f0f9ff', boxSizing: 'border-box' }} placeholder="Key design insight or opportunity for this phase" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {em.phases.length > 0 && (
                    <button onClick={() => updateExperienceMap({ phases: [...em.phases, { id: uuid(), name: '', channel: '', touchpoints: [], experience: '', emotion: '', insights: '' }] })} style={{ width: '100%', padding: 10, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 8 }}>+ Add Phase</button>
                  )}
                </div>
              );
            })()}

            {activeSection === 'serviceBlueprint' && (() => {
              const sb = selectedProject.serviceBlueprint || { overview: '', steps: [] };
              const LANES = [
                { key: 'evidence', label: 'Physical Evidence', color: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
                { key: 'customerAction', label: 'Customer Actions', color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
                { key: 'frontstage', label: 'Frontstage (Visible)', color: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' },
                { key: 'backstage', label: 'Backstage (Invisible)', color: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
                { key: 'support', label: 'Support Processes', color: '#f8fafc', border: '#e2e8f0', text: '#475569' },
              ];
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>Service Steps <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({sb.steps.length} steps)</span></div>
                    <button onClick={generateServiceBlueprint} disabled={serviceBlueprintGenerating} style={{ padding: '8px 16px', background: serviceBlueprintGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: serviceBlueprintGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {serviceBlueprintGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  {sb.overview && <div style={{ padding: 12, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, fontSize: 13, color: '#7e22ce', marginBottom: 16 }}>{sb.overview}</div>}
                  {serviceBlueprintError && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{serviceBlueprintError}</div>}
                  {serviceBlueprintGenerating && <div style={{ padding: 24, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>📐</div><div style={{ fontSize: 13, fontWeight: 600, color: '#7e22ce' }}>Mapping frontstage and backstage processes...</div></div>}
                  {sb.steps.length === 0 && !serviceBlueprintGenerating ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>No steps yet. Click "Generate with AI" to map your service blueprint, or add steps manually.</div>
                  ) : sb.steps.map((step, idx) => (
                    <div key={step.id || idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#7e22ce', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                        <input value={step.name || ''} onChange={e => { const steps = [...sb.steps]; steps[idx] = { ...step, name: e.target.value }; updateServiceBlueprint({ steps }); }} style={{ flex: 1, fontWeight: 600, fontSize: 14, border: 'none', background: 'transparent', color: '#1e293b', outline: 'none' }} placeholder="Step name" />
                        <button onClick={() => { const steps = sb.steps.filter((_, i) => i !== idx); updateServiceBlueprint({ steps }); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: 0 }}>✕</button>
                      </div>
                      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {LANES.map(lane => (
                          <div key={lane.key} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <div style={{ width: 140, fontSize: 10, fontWeight: 700, color: lane.text, textTransform: 'uppercase', letterSpacing: 0.5, padding: '6px 0', flexShrink: 0 }}>{lane.label}</div>
                            <textarea value={step[lane.key] || ''} onChange={e => { const steps = [...sb.steps]; steps[idx] = { ...step, [lane.key]: e.target.value }; updateServiceBlueprint({ steps }); }} rows={2} style={{ flex: 1, padding: '6px 8px', border: `1px solid ${lane.border}`, borderRadius: 6, fontSize: 12, resize: 'vertical', background: lane.color, boxSizing: 'border-box' }} placeholder={`${lane.label}...`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {sb.steps.length > 0 && (
                    <button onClick={() => updateServiceBlueprint({ steps: [...sb.steps, { id: uuid(), name: '', customerAction: '', frontstage: '', backstage: '', support: '', evidence: '' }] })} style={{ width: '100%', padding: 10, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 8 }}>+ Add Step</button>
                  )}
                </div>
              );
            })()}

            {activeSection === 'storyboard' && (() => {
              const sb = selectedProject.storyboard || { scenario: '', persona: '', frames: [] };
              const EMOTION_ICONS = { Frustrated: '😤', Curious: '🤔', Hopeful: '🙏', Excited: '😄', Relieved: '😌', Happy: '😊', Anxious: '😰', Confused: '😕', Delighted: '🤩' };
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>Storyboard Frames <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({sb.frames.length} frames)</span></div>
                    <button onClick={generateStoryboard} disabled={storyboardGenerating} style={{ padding: '8px 16px', background: storyboardGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: storyboardGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {storyboardGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Persona</div>
                      <input value={sb.persona || ''} onChange={e => updateStoryboard({ persona: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} placeholder="Character name and role" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Scenario</div>
                      <input value={sb.scenario || ''} onChange={e => updateStoryboard({ scenario: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} placeholder="Context setup for the storyboard" />
                    </div>
                  </div>
                  {storyboardError && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{storyboardError}</div>}
                  {storyboardGenerating && <div style={{ padding: 24, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>🎬</div><div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>Writing the story...</div></div>}
                  {sb.frames.length === 0 && !storyboardGenerating ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>No frames yet. Click "Generate with AI" to write the storyboard, or add frames manually.</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {sb.frames.map((frame, idx) => (
                        <div key={frame.id || idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ background: '#1e293b', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Panel {frame.panel || idx + 1}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 16 }}>{EMOTION_ICONS[frame.emotion] || '😐'}</span>
                              <button onClick={() => { const frames = sb.frames.filter((_, i) => i !== idx); updateStoryboard({ frames }); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
                            </div>
                          </div>
                          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', minHeight: 80, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <textarea value={frame.description || ''} onChange={e => { const frames = [...sb.frames]; frames[idx] = { ...frame, description: e.target.value }; updateStoryboard({ frames }); }} rows={3} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 12, color: '#475569', resize: 'none', outline: 'none', textAlign: 'center', fontStyle: 'italic' }} placeholder="Describe the scene visually..." />
                          </div>
                          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <input value={frame.dialogue || ''} onChange={e => { const frames = [...sb.frames]; frames[idx] = { ...frame, dialogue: e.target.value }; updateStoryboard({ frames }); }} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontStyle: 'italic' }} placeholder='"What the character says or thinks..."' />
                            <input value={frame.emotion || ''} onChange={e => { const frames = [...sb.frames]; frames[idx] = { ...frame, emotion: e.target.value }; updateStoryboard({ frames }); }} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, color: '#64748b' }} placeholder="Emotion (e.g. Frustrated, Hopeful)" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateStoryboard({ frames: [...sb.frames, { id: uuid(), panel: sb.frames.length + 1, description: '', dialogue: '', emotion: '' }] })} style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 10, cursor: 'pointer', fontSize: 13, color: '#94a3b8', fontWeight: 500, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+ Add Frame</button>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeSection === 'informationArchitecture' && (() => {
              const ia = selectedProject.informationArchitecture || { overview: '', nodes: [] };
              const LEVEL_STYLES = [
                { bg: '#1e293b', text: 'white', indent: 0, fontSize: 13, fontWeight: 700 },
                { bg: '#f0f9ff', text: '#0369a1', indent: 16, fontSize: 13, fontWeight: 600 },
                { bg: '#fafafa', text: '#475569', indent: 32, fontSize: 12, fontWeight: 400 },
              ];
              const rootNodes = ia.nodes.filter(n => !n.parentId);
              const childrenOf = (id) => ia.nodes.filter(n => n.parentId === id);
              const renderNode = (node, depth = 0) => {
                const style = LEVEL_STYLES[Math.min(depth, 2)];
                const kids = childrenOf(node.id);
                return (
                  <div key={node.id}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', marginLeft: style.indent, background: style.bg, borderRadius: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: depth === 0 ? '#94a3b8' : '#94a3b8', marginTop: 2, flexShrink: 0 }}>{'—'.repeat(depth) || '▣'}</span>
                      <div style={{ flex: 1 }}>
                        <input value={node.label || ''} onChange={e => { const nodes = ia.nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n); updateInformationArchitecture({ nodes }); }} style={{ background: 'transparent', border: 'none', outline: 'none', color: style.text, fontWeight: style.fontWeight, fontSize: style.fontSize, width: '100%' }} placeholder="Section or page name" />
                        {node.description && <div style={{ fontSize: 11, color: depth === 0 ? '#94a3b8' : '#94a3b8', marginTop: 2 }}>{node.description}</div>}
                      </div>
                      <button onClick={() => { const nodes = ia.nodes.filter(n => n.id !== node.id && n.parentId !== node.id); updateInformationArchitecture({ nodes }); }} style={{ background: 'none', border: 'none', color: depth === 0 ? '#64748b' : '#94a3b8', cursor: 'pointer', fontSize: 13, padding: 0, flexShrink: 0 }}>✕</button>
                    </div>
                    {kids.map(child => renderNode(child, depth + 1))}
                    {depth < 2 && (
                      <button onClick={() => { const newNode = { id: uuid(), label: '', level: depth + 1, parentId: node.id, description: '' }; updateInformationArchitecture({ nodes: [...ia.nodes, newNode] }); }} style={{ marginLeft: style.indent + 16, marginBottom: 4, padding: '4px 10px', background: 'none', border: '1px dashed #cbd5e1', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#94a3b8' }}>+ Add child</button>
                    )}
                  </div>
                );
              };
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>IA Structure <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({ia.nodes.length} nodes)</span></div>
                    <button onClick={generateInformationArchitecture} disabled={iaGenerating} style={{ padding: '8px 16px', background: iaGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: iaGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {iaGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  {ia.overview && <div style={{ padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 13, color: '#15803d', marginBottom: 16 }}>{ia.overview}</div>}
                  {iaError && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{iaError}</div>}
                  {iaGenerating && <div style={{ padding: 24, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>🌲</div><div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Mapping the information architecture...</div></div>}
                  {ia.nodes.length === 0 && !iaGenerating ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>No structure yet. Click "Generate with AI" to map the IA, or add sections manually.</div>
                  ) : (
                    <div style={{ fontFamily: 'monospace' }}>
                      {rootNodes.map(node => renderNode(node, 0))}
                    </div>
                  )}
                  <button onClick={() => { const newNode = { id: uuid(), label: '', level: 0, parentId: null, description: '' }; updateInformationArchitecture({ nodes: [...ia.nodes, newNode] }); }} style={{ width: '100%', padding: 10, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 12 }}>+ Add Top-Level Section</button>
                </div>
              );
            })()}

            {activeSection === 'insights' && (() => {
              const ins = selectedProject.insights || { northStar: '', metrics: [] };
              const CATEGORY_COLORS = { Acquisition: '#3b82f6', Activation: '#8b5cf6', Retention: '#f59e0b', Revenue: '#10b981', Referral: '#ec4899', Quality: '#64748b' };
              const grouped = ins.metrics.reduce((acc, m) => { const cat = m.category || 'Other'; if (!acc[cat]) acc[cat] = []; acc[cat].push(m); return acc; }, {});
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>Metrics <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>({ins.metrics.length} metrics)</span></div>
                    <button onClick={generateInsights} disabled={insightsGenerating} style={{ padding: '8px 16px', background: insightsGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 6, cursor: insightsGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {insightsGenerating ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>⭐ North Star Metric</div>
                    <input value={ins.northStar || ''} onChange={e => updateInsights({ northStar: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '2px solid #4f46e5', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#1e293b', boxSizing: 'border-box' }} placeholder="The single metric that best captures the core value delivered to customers" />
                  </div>
                  {insightsError && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{insightsError}</div>}
                  {insightsGenerating && <div style={{ padding: 24, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 8 }}>📊</div><div style={{ fontSize: 13, fontWeight: 600, color: '#7e22ce' }}>Building your metrics framework...</div></div>}
                  {ins.metrics.length === 0 && !insightsGenerating ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>No metrics yet. Click "Generate with AI" to build the AARRR framework, or add metrics manually.</div>
                  ) : (
                    Object.entries(grouped).map(([cat, metrics]: [string, any[]]) => (
                      <div key={cat} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[cat] || '#94a3b8', flexShrink: 0 }} />
                          <div style={{ fontSize: 12, fontWeight: 700, color: CATEGORY_COLORS[cat] || '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                        </div>
                        {metrics.map((metric, idx) => {
                          const globalIdx = ins.metrics.findIndex(m => m.id === metric.id);
                          return (
                            <div key={metric.id || idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <input value={metric.name || ''} onChange={e => { const metrics = [...ins.metrics]; metrics[globalIdx] = { ...metric, name: e.target.value }; updateInsights({ metrics }); }} style={{ fontWeight: 600, fontSize: 13, border: 'none', outline: 'none', color: '#1e293b', flex: 1 }} placeholder="Metric name" />
                                <button onClick={() => { const metrics = ins.metrics.filter((_, i) => i !== globalIdx); updateInsights({ metrics }); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
                              </div>
                              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{metric.description}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>Target</div>
                                  <input value={metric.target || ''} onChange={e => { const metrics = [...ins.metrics]; metrics[globalIdx] = { ...metric, target: e.target.value }; updateInsights({ metrics }); }} style={{ width: '100%', padding: '4px 6px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, boxSizing: 'border-box' }} placeholder="e.g. 40% in 7 days" />
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>How to Measure</div>
                                  <input value={metric.measurement || ''} onChange={e => { const metrics = [...ins.metrics]; metrics[globalIdx] = { ...metric, measurement: e.target.value }; updateInsights({ metrics }); }} style={{ width: '100%', padding: '4px 6px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, boxSizing: 'border-box' }} placeholder="e.g. Mixpanel event count" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  {ins.metrics.length > 0 && (
                    <button onClick={() => updateInsights({ metrics: [...ins.metrics, { id: uuid(), category: 'Activation', name: '', description: '', target: '', measurement: '' }] })} style={{ width: '100%', padding: 10, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500 }}>+ Add Metric</button>
                  )}
                </div>
              );
            })()}

            {activeSection === 'figma' && (() => {
              const fg = selectedProject.figma || { fileUrl: '', fileId: '', generationStatus: 'idle' };
              const NAVY = '#1d2254';
              const PURPLE = '#6a24ff';

              const parseFileId = (url: string) => {
                const m = url.match(/figma\.com\/(?:design|file|proto)\/([a-zA-Z0-9]+)/);
                return m ? m[1] : '';
              };

              const handleUrlChange = (url: string) => {
                const fileId = parseFileId(url);
                updateFigma({ fileUrl: url, fileId });
              };

              const journeyStages = (selectedProject.journey?.stages || []).map((s: any) => s.name).filter(Boolean);
              const defaultScreens = [
                'Landing page — hero, value prop, CTA',
                'Sign up / Onboarding flow',
                'Prototype upload screen',
                'Target user / Persona builder',
                'Live test dashboard',
                'Feedback review and synthesis',
                'Retest / Iteration screen'
              ];
              const screens = journeyStages.length >= 3
                ? journeyStages.map((name: string) => `${name} screen`)
                : defaultScreens;

              const isConnected = !!fg.fileId;
              const isRequested = fg.generationStatus === 'requested';

              return (
                <div>
                  {/* Header */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 6 }}>Figma Wireframe Generator</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      Connect a Figma file, then ask Claude to generate product wireframes using this project's data.
                    </div>
                  </div>

                  {/* Step 1 — Connect file */}
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: isConnected ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isConnected ? '#16a34a' : '#94a3b8', flexShrink: 0 }}>
                        {isConnected ? '✓' : '1'}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Connect a Figma file</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                      Open a Figma file, copy the URL from your browser, and paste it here. The file should be one you have edit access to.
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input
                        value={fg.fileUrl}
                        onChange={e => handleUrlChange(e.target.value)}
                        placeholder="https://www.figma.com/design/..."
                        style={{ flex: 1, padding: '10px 14px', border: `1px solid ${isConnected ? '#86efac' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13, color: NAVY, outline: 'none', background: isConnected ? '#f0fdf4' : 'white' }}
                      />
                    </div>
                    {isConnected && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✓ File connected</span>
                        <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, color: '#475569' }}>ID: {fg.fileId}</code>
                      </div>
                    )}
                  </div>

                  {/* Step 2 — Screens to generate */}
                  <div style={{ background: 'white', border: `1px solid ${isConnected ? '#e2e8f0' : '#f1f5f9'}`, borderRadius: 12, padding: 24, marginBottom: 16, opacity: isConnected ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>2</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Screens to generate</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                      {journeyStages.length >= 3 ? 'Derived from your Journey Map stages.' : 'Default wireframe set — add Journey Map stages to customise.'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {screens.map((screen: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, width: 20, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: '#334155' }}>{screen}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3 — Generate */}
                  <div style={{ background: 'white', border: `1px solid ${isConnected ? '#e2e8f0' : '#f1f5f9'}`, borderRadius: 12, padding: 24, opacity: isConnected ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>3</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Generate wireframes</div>
                    </div>

                    {!isRequested ? (
                      <>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                          Claude will read your Hypothesis, Journey Map, and Persona data, then generate annotated wireframe screens directly into the connected Figma file.
                        </div>
                        <button
                          disabled={!isConnected}
                          onClick={() => updateFigma({ generationStatus: 'requested' })}
                          style={{ padding: '10px 20px', background: isConnected ? `linear-gradient(135deg, ${PURPLE}, #8b4cf6)` : '#e2e8f0', color: isConnected ? 'white' : '#94a3b8', border: 'none', borderRadius: 8, cursor: isConnected ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700 }}
                        >
                          🎨 Request Wireframe Generation
                        </button>
                      </>
                    ) : (
                      <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 10, padding: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 8 }}>Generation queued</div>
                        <div style={{ fontSize: 13, color: '#4c1d95', lineHeight: 1.6, marginBottom: 16 }}>
                          In your Claude Code session, say: <strong>"Generate Figma wireframes for {selectedProject.name}"</strong> — Claude will read this project's data and build the screens in your connected file.
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <code style={{ fontSize: 11, background: 'white', border: '1px solid #ddd6fe', padding: '6px 10px', borderRadius: 6, color: '#4c1d95', flex: 1 }}>
                            File ID: {fg.fileId}
                          </code>
                          <button
                            onClick={() => updateFigma({ generationStatus: 'idle' })}
                            style={{ padding: '6px 12px', background: 'none', border: '1px solid #c4b5fd', borderRadius: 6, color: PURPLE, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {activeSection === 'sources' && (
              <div>
                {(selectedProject.sources || []).length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    No sources yet. Sources are added automatically when you use AI Generation.
                  </div>
                ) : (
                  (selectedProject.sources || []).map((source, idx) => (
                    <div key={source.id} style={{ padding: 12, background: 'white', borderRadius: 6, marginBottom: 8, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{source.title}</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', background: '#dbeafe', borderRadius: 10, color: '#1e40af' }}>{source.type}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'pre-wrap' }}>{source.content}</div>
                    </div>
                  ))
                )}
              </div>
            )}
            </div>{/* end Form Area */}
          </div>{/* end Section nav + Form Area split */}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧪</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No project selected</div>
            <div style={{ fontSize: 13 }}>Create a Foundation Sprint or select one from the sidebar</div>
          </div>
        </div>
      )}

      {/* Photo Picker Modal */}
      {showPhotoPicker && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}
          onClick={e => { if (e.target === e.currentTarget) setShowPhotoPicker(false); }}
        >
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '90%', maxWidth: 560, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1d2254' }}>Choose a photo</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 2 }}>
                  Results for "{buildPhotoQuery(selectedProject?.persona?.role || '')}"
                </div>
              </div>
              <button onClick={() => setShowPhotoPicker(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            {pickerLoading ? (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                Loading photos...
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                  {pickerPhotos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => selectPhoto(photo)}
                      style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                      title={`Photo by ${photo.user.name}`}
                    >
                      <img
                        src={photo.urls.small}
                        alt={photo.alt_description || ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a href="https://unsplash.com?utm_source=mvp_creator&utm_medium=referral" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'none' }}>
                    Photos from Unsplash
                  </a>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {pickerPage > 1 && (
                      <button onClick={() => searchPickerPhotos(pickerPage - 1)} style={{ padding: '6px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#475569' }}>
                        ← Prev
                      </button>
                    )}
                    <button onClick={() => searchPickerPhotos(pickerPage + 1)} style={{ padding: '6px 14px', background: '#1d2254', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      See more →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIGenerate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={e => { if (e.target === e.currentTarget && !aiGenerating && !mdParsing && !mdCreating) { setShowAIGenerate(false); resetModal(); } }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 28, width: '90%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setModalTab('generate')}
                style={{ flex: 1, padding: '10px 16px', background: modalTab === 'generate' ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : 'white', color: modalTab === 'generate' ? 'white' : '#64748b', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderRight: '1px solid #e2e8f0' }}
              >
                ✨ Generate from Idea
              </button>
              <button
                onClick={() => setModalTab('import')}
                style={{ flex: 1, padding: '10px 16px', background: modalTab === 'import' ? '#0f172a' : 'white', color: modalTab === 'import' ? 'white' : '#64748b', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                📄 Import from MD
              </button>
            </div>

            {modalTab === 'generate' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✨</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>AI Foundation Sprint</h2>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Describe your idea. AI will structure a full Click Framework sprint.</p>
              </div>
            </div>
            )}

            {/* Generate from Idea tab */}
            {modalTab === 'generate' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Project Type <span style={{ color: '#dc2626' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #d1d5db' }}>
                    <button onClick={() => setAiProjectType('product')} disabled={aiGenerating} style={{ flex: 1, padding: '12px 16px', background: aiProjectType === 'product' ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : 'white', color: aiProjectType === 'product' ? 'white' : '#374151', border: 'none', cursor: aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRight: '1px solid #d1d5db' }}>
                      <span style={{ fontSize: 18 }}>📦</span>
                      <div style={{ textAlign: 'left' }}>
                        <div>Product</div>
                        <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.8 }}>Software, app, or platform</div>
                      </div>
                    </button>
                    <button onClick={() => setAiProjectType('service')} disabled={aiGenerating} style={{ flex: 1, padding: '12px 16px', background: aiProjectType === 'service' ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'white', color: aiProjectType === 'service' ? 'white' : '#374151', border: 'none', cursor: aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>🤝</span>
                      <div style={{ textAlign: 'left' }}>
                        <div>Service</div>
                        <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.8 }}>Agency, consulting, or offering</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Your Idea <span style={{ color: '#dc2626' }}>*</span></label>
                  <textarea
                    value={aiIdea}
                    onChange={e => setAiIdea(e.target.value)}
                    disabled={aiGenerating}
                    placeholder={aiProjectType === 'product'
                      ? "Describe the product you want to build...\n\nExample: \"An AI-powered design system manager that helps enterprise teams maintain consistency across products. It connects to Figma, detects component drift, and auto-generates documentation.\""
                      : "Describe the service you want to offer...\n\nExample: \"A fractional design ops consultancy that helps Series A-C startups build and scale their design infrastructure. We audit existing design systems, implement governance frameworks, and train internal teams.\""
                    }
                    rows={7}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{aiIdea.length} characters</div>
                </div>

                {aiError && (
                  <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{aiError}</div>
                )}

                {aiGenerating && (
                  <div style={{ padding: 16, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }}>🧠</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Running Foundation Sprint...</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>AI is generating Hypothesis, Advantage, Principles, and Click Test</div>
                    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setShowAIGenerate(false); resetModal(); }} disabled={aiGenerating} style={{ padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, color: '#374151', opacity: aiGenerating ? 0.5 : 1 }}>Cancel</button>
                  <button onClick={generateWithAI} disabled={!aiIdea.trim() || aiGenerating} style={{ padding: '10px 24px', background: !aiIdea.trim() || aiGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 8, cursor: !aiIdea.trim() || aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                    {aiGenerating ? 'Generating...' : '✨ Run Sprint'}
                  </button>
                </div>
              </>
            )}

            {/* Import from MD tab */}
            {modalTab === 'import' && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: '0 0 16px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    Upload any markdown file — a previous Click Framework export, a PRD, pitch notes, or anything else. Claude will extract and map the content into a new project.
                  </p>

                  {/* Drop zone / file selector */}
                  {!mdFileName ? (
                    <label style={{ display: 'block', width: '100%', padding: '32px 20px', border: '2px dashed #cbd5e1', borderRadius: 10, background: '#f8fafc', cursor: 'pointer', textAlign: 'center', color: '#64748b', fontSize: 13, boxSizing: 'border-box' }}>
                      <input type="file" accept=".md,.markdown,.txt" onChange={handleMdFileSelect} style={{ display: 'none' }} />
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                      <div style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>Click to select a file</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>.md, .markdown, or .txt</div>
                    </label>
                  ) : (
                    <div style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 24 }}>📄</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mdFileName}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{(mdContent.length / 1024).toFixed(1)} KB</div>
                      </div>
                      <label style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}>
                        <input type="file" accept=".md,.markdown,.txt" onChange={handleMdFileSelect} style={{ display: 'none' }} />
                        Change
                      </label>
                    </div>
                  )}
                </div>

                {/* Parse loading */}
                {mdParsing && (
                  <div style={{ padding: 16, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }}>🔍</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>Parsing document...</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Claude is extracting Click Framework fields from your file</div>
                    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                  </div>
                )}

                {/* Parse error */}
                {mdParseError && (
                  <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, marginBottom: 16 }}>{mdParseError}</div>
                )}

                {/* Preview card */}
                {mdParsed && !mdParsing && (
                  <div style={{ marginBottom: 20, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>✅</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#166534' }}>Ready to import</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 10 }}>{mdParsed.name || 'Imported Project'}</div>
                      {mdParsed.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {mdParsed.tags.map((t, i) => (
                            <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#dbeafe', borderRadius: 10, color: '#1e40af' }}>{t}</span>
                          ))}
                        </div>
                      )}
                      {[
                        { label: 'Customer', value: mdParsed.hypothesis?.customer },
                        { label: 'Problem', value: mdParsed.hypothesis?.problem },
                        { label: 'Hook', value: mdParsed.hypothesis?.hook },
                        { label: 'Riskiest Assumption', value: mdParsed.clickTest?.riskiestAssumption },
                      ].filter(r => r.value).map(row => (
                        <div key={row.label} style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label} </span>
                          <span style={{ fontSize: 13, color: '#334155' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setShowAIGenerate(false); resetModal(); }} disabled={mdParsing || mdCreating} style={{ padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: (mdParsing || mdCreating) ? 'not-allowed' : 'pointer', fontSize: 13, color: '#374151', opacity: (mdParsing || mdCreating) ? 0.5 : 1 }}>Cancel</button>
                  {!mdParsed ? (
                    <button onClick={parseMarkdown} disabled={!mdContent || mdParsing} style={{ padding: '10px 24px', background: !mdContent || mdParsing ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: 8, cursor: !mdContent || mdParsing ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {mdParsing ? 'Parsing...' : '🔍 Parse File'}
                    </button>
                  ) : (
                    <button onClick={createFromMd} disabled={mdCreating} style={{ padding: '10px 24px', background: mdCreating ? '#94a3b8' : '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: mdCreating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {mdCreating ? 'Creating...' : '✅ Create Project'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}