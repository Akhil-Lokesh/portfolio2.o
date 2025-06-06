// Theme types
export type Theme = 'light' | 'dark';

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
}

// Skill types
export interface Skill {
  name: string;
  category: string;
  level: number; // 1-5
  description?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  color: string;
}

// Contact types
export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  location: string;
  availability: string;
}

// Animation types
export interface SpringConfig {
  damping: number;
  stiffness: number;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
