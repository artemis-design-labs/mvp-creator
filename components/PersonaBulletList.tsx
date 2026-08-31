import React, { useState } from 'react';

export interface PersonaBulletListProps {
  items?: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const PersonaBulletList: React.FC<PersonaBulletListProps> = ({
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
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
          <span style={{ color: '#6a24ff', fontSize: 16, fontWeight: 900, lineHeight: '1.6', flexShrink: 0 }}>•</span>
          <span style={{ flex: 1, fontSize: 13, color: '#3a3d5b', lineHeight: 1.6 }}>{item}</span>
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '2px', flexShrink: 0, marginTop: 2 }}
          >
            ✕
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: items.length > 0 ? 10 : 0 }}>
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
