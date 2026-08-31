export const EMOTIONS = [
  { value: 'frustrated',   label: '😤 Frustrated',   color: '#fecaca' },
  { value: 'curious',      label: '🤔 Curious',       color: '#fde68a' },
  { value: 'neutral',      label: '😐 Neutral',       color: '#e2e8f0' },
  { value: 'hopeful',      label: '🙂 Hopeful',       color: '#bbf7d0' },
  { value: 'happy',        label: '😊 Happy',         color: '#86efac' },
  { value: 'excited',      label: '🤩 Excited',       color: '#a5b4fc' },
  { value: 'disappointed', label: '😞 Disappointed',  color: '#fca5a5' },
];

export const FLOW_STEP_TYPES = [
  { value: 'user-action',    label: 'User Action',    color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'system-action',  label: 'System Action',  color: '#1d4ed8', bg: '#eff6ff' },
  { value: 'user-decision',  label: 'User Decision',  color: '#b45309', bg: '#fffbeb' },
  { value: 'system-decision',label: 'System Decision',color: '#0f766e', bg: '#f0fdfa' },
];

export const FLOW_SYSTEM_STATES = ['', 'idle', 'loading', 'success', 'error', 'empty'] as const;
export type FlowSystemState = typeof FLOW_SYSTEM_STATES[number];
