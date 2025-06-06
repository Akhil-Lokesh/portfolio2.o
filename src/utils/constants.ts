// Animation constants
export const ANIMATION_DURATIONS = {
  fast: 0.3,
  medium: 0.6,
  slow: 0.8,
  cursor: 0.2,
  page: 1.2
} as const;

export const SPRING_CONFIGS = {
  cursor: { damping: 25, stiffness: 300 },
  default: { damping: 20, stiffness: 400 },
  slow: { damping: 30, stiffness: 200 }
} as const;

// Color constants (for JS usage)
export const COLORS = {
  primary: '#0047FF',
  secondary: '#00CFFD', 
  accent: '#7000FF',
  background: '#091d3d',
  surface: '#111827',
  foreground: '#F4F7FF',
  success: '#00C875',
  warning: '#FFCB47',
  error: '#FF5151'
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Easter egg constants
export const EASTER_EGG_TIMEOUTS = {
  konamiMode: 5000,
  rocketMode: 10000,
  sleepMode: 30000,
  messageDisplay: 3000
} as const;

// Skills and tech stacks
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