// Easter egg constants
export const EASTER_EGG_TIMEOUTS = {
  konamiMode: 5000,
  rocketMode: 10000,
  sleepMode: 30000,
  messageDisplay: 3000
} as const;

// Skills and tech stacks (used by the Konami matrix rain effect)
export const TECH_SKILLS = [
  'Python', 'React', 'JS', 'TS', 'SQL', 'AWS', 'ML', 'AI',
  '🐍', '⚛️', '🔷', '🟨', '☁️', '🤖', '📊', '🚀',
  'Pandas', 'PyTorch', 'Node', 'Kafka', 'Docker', 'MongoDB'
] as const;

export const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
] as const;
