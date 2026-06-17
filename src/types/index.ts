// Navigation types
export interface NavigationSection {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  icon?: string;
  path: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  keyFeatures: string[];
  technicalChallenge: string;
  technologies: string[];
  githubUrl: string;
  year: number;
  hook?: string;        // one-line, craft-aimed punch line (added during voice pass)
  liveUrl?: string;     // optional live demo
  image?: string;       // optional screenshot path under public/
  featured?: boolean;   // marks the homepage hero project
}

// Skill types
export interface Skill {
  name: string;
  category: string;
  level?: number; // 1-5
  description?: string;
  icon?: string;
}

export interface TechDomain {
  name: string;
  label: string;
  skills: Skill[];
  color: string;
  description: string;
  icon: string;
}

// Time-based easter egg features
export interface TimeBasedFeatures {
  isLateNight: boolean;
  isFridayAfternoon: boolean;
  isProgrammerDay: boolean;
  timeMessage: string | null;
}
