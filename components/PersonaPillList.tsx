import React, { useState } from 'react';

export interface PersonaPillListProps {
  items?: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const PersonaPillList: React.FC<PersonaPillListProps> = ({
  items = [],
  onChange,
  placeholder,
}) => {
  const [input, setInput] = useState('');

  const add = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  return (
    <div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{ background: '#f0f0f0', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ fontSize: 11, color: '#3a3d5b', fontWeight: 600 }}>{item}</span>
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          style={{ flex: 1, background: '#f8f8fc', border: '1px solid #eeeeee', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#3a3d5b', fontFamily: 'inherit' }}
        />
        <button
          onClick={add}
          style={{ padding: '5px 10px', background: '#6a24ff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
        >
          +
        </button>
      </div>
    </div>
  );
};
