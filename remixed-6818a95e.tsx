import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// --- CONFIGURATION & CONSTANTS ---

const APP_VERSION = '2.0.0-click-framework';
const uuid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// The Click Framework Sections
const SECTIONS = {
  hypothesis: { name: 'Foundation Hypothesis', icon: '🏗️', desc: 'Customer, Problem, Solution, & The Hook' },
  advantage: { name: 'Unfair Advantage', icon: '⚡', desc: 'Capability, Motivation, & Insight' },
  principles: { name: 'Principles', icon: '🧭', desc: 'Decision Guardrails (Boring > Exciting)' },
  clickTest: { name: 'The Click Test', icon: '🧪', desc: 'Riskiest Assumption & Validation' },
  blueprint: { name: 'Blueprint', icon: '🗺️', desc: 'Execution Plan & Timeline' },
  sources: { name: 'Sources', icon: '📎', desc: 'Reference materials' }
};

const STATUSES = ['draft', 'hypothesis-set', 'testing', 'validated', 'killed'];

// --- DATA STRUCTURES ---

const createProject = (name = 'Untitled Idea') => ({
  id: uuid(),
  name,
  status: 'draft',
  lastUpdated: new Date().toISOString(),
  tags: [],
  
  // Part 1: The Foundation Hypothesis
  hypothesis: {
    customer: '', // Who is this for? (Specific)
    problem: '', // What pain are they in?
    solution: '', // What is the specific offering?
    hook: '', // Why will they care *now*? (One-liner)
    antiCustomer: '' // Who is this NOT for?
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
  ingestionLog: []
});

const createSeedProject = () => {
  const p = createProject('AI Ops for Law Firms');
  p.status = 'hypothesis-set';
  p.tags = ['service', 'legal-tech', 'b2b'];
  p.hypothesis = {
    customer: 'Mid-sized independent law firms (10-50 partners) who are drowning in document discovery but fear "Big Tech" solutions.',
    problem: 'Paralegals spend 40% of billable hours purely categorizing PDFs, eroding margins and causing burnout.',
    solution: 'A "Secure-First" AI audit and implementation service. We don\'t build apps; we deploy local-only LLM agents to automate their specific document workflow.',
    hook: 'Cut discovery costs by 50% without your data ever leaving the building.',
    antiCustomer: 'Solo practitioners (too small) or Big Law (too much red tape).'
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
  return `# ${p.name}
**Status:** ${p.status} | **Hook:** ${p.hypothesis?.hook}

## 1. Foundation Hypothesis
**The Customer:** ${p.hypothesis?.customer}
**The Problem:** ${p.hypothesis?.problem}
**The Solution:** ${p.hypothesis?.solution}
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

// --- COMPONENTS ---

const TextAreaField = ({ label, value, onChange, placeholder, helperText, rows=3 }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 6 }}>
      {label}
    </label>
    {helperText && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontStyle: 'italic' }}>{helperText}</div>}
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
    />
  </div>
);

const ArrayEditor = ({ label, items = [], onChange, placeholder, helperText }) => {
  const [input, setInput] = useState('');
  const add = () => { if (input.trim()) { onChange([...items, input.trim()]); setInput(''); } };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 6 }}>{label}</label>
      {helperText && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{helperText}</div>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} 
        />
        <button onClick={add} style={{ padding: '8px 16px', background: '#334155', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 6 }}>
          <span style={{ flex: 1, fontSize: 14 }}>{item}</span>
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
      ))}
    </div>
  );
};

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
  
  const selectedProject = projects.find(p => p.id === selectedId);

  // Initialize with persistent storage
  useEffect(() => {
    const load = async () => {
      const fallback = () => {
        const seed = createSeedProject();
        setProjects([seed]);
        setSelectedId(seed.id);
        setIsLoading(false);
      };
      if (!window.storage) { fallback(); return; }
      try {
        const result = await Promise.race([
          window.storage.get('click-framework-data'),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
        ]);
        if (result && result.value) {
          const data = JSON.parse(result.value);
          setProjects(data.projects || []);
          setSelectedId(data.selectedId || data.projects?.[0]?.id || null);
        } else {
          fallback(); return;
        }
      } catch (err) {
        console.log('Storage load failed:', err);
        fallback(); return;
      }
      setIsLoading(false);
    };
    load();
  }, []);

  // Persistence
  useEffect(() => {
    if (isLoading || !projects.length) return;
    const save = async () => {
      try {
        await window.storage.set('click-framework-data', JSON.stringify({
          version: APP_VERSION, projects, selectedId, savedAt: new Date().toISOString()
        }));
      } catch (err) { console.log('Could not persist:', err); }
    };
    const t = setTimeout(save, 500);
    return () => clearTimeout(t);
  }, [projects, selectedId, isLoading]);

  const updateProject = (updates) => {
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
  };

  const updateNested = (section, field, value) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      return { ...p, [section]: { ...p[section], [field]: value }, lastUpdated: new Date().toISOString() };
    }));
  };

  const deleteProject = () => {
    if (!selectedProject) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
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
    "customer": "Specific target customer segment with detail",
    "problem": "The specific pain they experience today",
    "solution": "The specific offering or transformation",
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
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
        customer: parsed.hypothesis?.customer || '',
        problem: parsed.hypothesis?.problem || '',
        solution: parsed.hypothesis?.solution || '',
        hook: parsed.hypothesis?.hook || '',
        antiCustomer: parsed.hypothesis?.antiCustomer || ''
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
      
      setProjects(prev => [newProject, ...prev]);
      setSelectedId(newProject.id);
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
          <button onClick={() => { const p = createProject(); setProjects(prev => [p, ...prev]); setSelectedId(p.id); }} style={{ padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            + {!sidebarCollapsed && 'New Blank Project'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {projects.map(p => (
            <div 
              key={p.id} 
              onClick={() => { setSelectedId(p.id); setConfirmDelete(false); }}
              style={{ 
                padding: 10, marginBottom: 4, borderRadius: 6, cursor: 'pointer',
                background: p.id === selectedId ? '#eff6ff' : 'transparent',
                border: p.id === selectedId ? '1px solid #bfdbfe' : '1px solid transparent'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: p.id === selectedId ? '#1e3a8a' : '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name || 'Untitled'}
              </div>
              {!sidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 10, padding: '2px 6px', background: p.status === 'validated' ? '#dcfce7' : p.status === 'killed' ? '#fee2e2' : '#fef3c7', borderRadius: 10, color: p.status === 'validated' ? '#166534' : p.status === 'killed' ? '#dc2626' : '#92400e' }}>{p.status}</span>
                  {(p.tags || []).slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '2px 6px', background: '#dbeafe', borderRadius: 10, color: '#1e40af' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {projects.length === 0 && !sidebarCollapsed && (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No projects yet</div>
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
                <button onClick={deleteProject} style={{ padding: '6px 12px', background: confirmDelete ? '#dc2626' : '#fee2e2', color: confirmDelete ? 'white' : '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  {confirmDelete ? 'Confirm Delete?' : 'Delete'}
                </button>
                {confirmDelete && <button onClick={() => setConfirmDelete(false)} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancel</button>}
              </div>
            </div>
            {selectedProject.hypothesis?.hook && (
              <div style={{ fontSize: 14, color: '#4f46e5', fontWeight: 500, fontStyle: 'italic' }}>
                "{selectedProject.hypothesis.hook}"
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              {(selectedProject.tags || []).map((tag, idx) => (
                <span key={idx} style={{ fontSize: 11, padding: '3px 8px', background: '#dbeafe', borderRadius: 10, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {tag}
                  <button onClick={() => updateProject({ tags: (selectedProject.tags || []).filter((_, i) => i !== idx) })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#3b82f6', padding: 0 }}>✕</button>
                </span>
              ))}
              <input type="text" placeholder="+ tag" onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { updateProject({ tags: [...(selectedProject.tags || []), e.target.value.trim()] }); e.target.value = ''; } }} style={{ padding: '3px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, width: 60 }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ padding: '0 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 4, overflowX: 'auto' }}>
            {Object.entries(SECTIONS).map(([key, config]) => (
              <button 
                key={key}
                onClick={() => setActiveSection(key)}
                style={{ 
                  padding: '12px 12px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: activeSection === key ? 600 : 500, whiteSpace: 'nowrap',
                  color: activeSection === key ? '#4f46e5' : '#64748b',
                  borderBottom: activeSection === key ? '2px solid #4f46e5' : '2px solid transparent'
                }}
              >
                <span style={{ marginRight: 6 }}>{config.icon}</span>
                {config.name}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 32, maxWidth: 800, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 24 }}>{SECTIONS[activeSection]?.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{SECTIONS[activeSection]?.name}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{SECTIONS[activeSection]?.desc}</div>
              </div>
            </div>

            {activeSection === 'hypothesis' && (
              <>
                <TextAreaField 
                  label="The Customer" 
                  helperText="Be specific. Who is this for? (e.g. 'Mid-sized dental practices', not 'Small businesses')"
                  value={selectedProject.hypothesis?.customer} 
                  onChange={v => updateNested('hypothesis', 'customer', v)} 
                />
                <TextAreaField 
                  label="The Problem" 
                  helperText="What pain are they actually in? What is broken today?"
                  value={selectedProject.hypothesis?.problem} 
                  onChange={v => updateNested('hypothesis', 'problem', v)} 
                />
                <TextAreaField 
                  label="The Solution" 
                  helperText="What is the specific offering/transformation?"
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
          </div>
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

      {/* AI Modal */}
      {showAIGenerate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={e => { if (e.target === e.currentTarget && !aiGenerating) setShowAIGenerate(false); }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 28, width: '90%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✨</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>AI Foundation Sprint</h2>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Describe your idea. AI will structure a full Click Framework sprint.</p>
              </div>
            </div>

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
              <button onClick={() => { setShowAIGenerate(false); setAiIdea(''); setAiProjectType('product'); setAiError(''); }} disabled={aiGenerating} style={{ padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, color: '#374151', opacity: aiGenerating ? 0.5 : 1 }}>Cancel</button>
              <button onClick={generateWithAI} disabled={!aiIdea.trim() || aiGenerating} style={{ padding: '10px 24px', background: !aiIdea.trim() || aiGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: 'white', border: 'none', borderRadius: 8, cursor: !aiIdea.trim() || aiGenerating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                {aiGenerating ? 'Generating...' : '✨ Run Sprint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}