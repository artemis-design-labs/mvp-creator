import React, { useState } from 'react';

export interface ArrayEditorProps {
  label?: string;
  items?: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export const ArrayEditor: React.FC<ArrayEditorProps> = ({
  label = '',
  items = [],
  onChange,
  placeholder,
  helperText,
}) => {
  const [input, setInput] = useState('');

  const add = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  return (
    <div style={{ marginBottom: label ? 20 : 0 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 6 }}>
          {label}
        </label>
      )}
      {helperText && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{helperText}</div>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
        />
        <button
          onClick={add}
          style={{ padding: '8px 16px', background: '#334155', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
        >
          Add
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 6 }}
        >
          <span style={{ flex: 1, fontSize: 14 }}>{item}</span>
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
