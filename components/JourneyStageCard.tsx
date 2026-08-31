import React from 'react';
import { ArrayEditor } from './ArrayEditor';
import { EMOTIONS } from './constants';

export interface Stage {
  id: string;
  name: string;
  steps: string[];
  emotion: string;
  painPoints: string[];
  opportunities: string[];
}

export interface JourneyStageCardProps {
  stage: Stage;
  index: number;
  total: number;
  onChange: (stage: Stage) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const JourneyStageCard: React.FC<JourneyStageCardProps> = ({
  stage,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const emotion = EMOTIONS.find(e => e.value === stage.emotion) || EMOTIONS[2];

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {index + 1}
        </div>
        <input
          value={stage.name}
          onChange={e => onChange({ ...stage, name: e.target.value })}
          style={{ flex: 1, fontSize: 14, fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', color: '#0f172a' }}
          placeholder="Stage name..."
        />
        <select
          value={stage.emotion}
          onChange={e => onChange({ ...stage, emotion: e.target.value })}
          style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 20, background: emotion.color, cursor: 'pointer' }}
        >
          {EMOTIONS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            style={{ padding: '4px 8px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 4, cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, fontSize: 12 }}
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={{ padding: '4px 8px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 4, cursor: index === total - 1 ? 'not-allowed' : 'pointer', opacity: index === total - 1 ? 0.3 : 1, fontSize: 12 }}
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            style={{ padding: '4px 10px', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#dc2626' }}
          >
            Remove
          </button>
        </div>
      </div>
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps / Actions</div>
          <ArrayEditor items={stage.steps} onChange={v => onChange({ ...stage, steps: v })} placeholder="Add a step..." />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pain Points</div>
          <ArrayEditor items={stage.painPoints} onChange={v => onChange({ ...stage, painPoints: v })} placeholder="Add a pain point..." />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Opportunities</div>
          <ArrayEditor items={stage.opportunities} onChange={v => onChange({ ...stage, opportunities: v })} placeholder="Add an opportunity..." />
        </div>
      </div>
    </div>
  );
};
