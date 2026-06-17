import { fuzzyMatch } from './fuzzyMatch';

export type CommandGroup = 'Navigate' | 'Actions' | 'Fun';

export interface CommandContext {
  navigate: (path: string) => void;
  triggerMatrix: () => void;
}

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  hint?: string;
  /** Extra text included in fuzzy matching but not displayed. */
  keywords?: string;
  perform: () => void;
}

const EMAIL = 'akgudapuri@gmail.com';
const GITHUB = 'https://github.com/Akhil-Lokesh';
const LINKEDIN = 'https://www.linkedin.com/in/akhilgudapuri/';

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getCommands(ctx: CommandContext): Command[] {
  return [
    { id: 'nav-home', label: 'Go to Home', group: 'Navigate', keywords: 'hub start', perform: () => ctx.navigate('/') },
    { id: 'nav-about', label: 'Go to About', group: 'Navigate', keywords: 'bio story', perform: () => ctx.navigate('/about') },
    { id: 'nav-work', label: 'Go to Work', group: 'Navigate', keywords: 'projects portfolio', perform: () => ctx.navigate('/work') },
    { id: 'nav-skills', label: 'Go to Skills', group: 'Navigate', keywords: 'tech stack', perform: () => ctx.navigate('/skills') },
    { id: 'nav-contact', label: 'Go to Contact', group: 'Navigate', keywords: 'email reach hire', perform: () => ctx.navigate('/contact') },
    { id: 'action-resume', label: 'Download résumé', group: 'Actions', keywords: 'cv pdf', perform: () => openExternal('/resume.pdf') },
    { id: 'action-email', label: 'Copy email address', group: 'Actions', keywords: 'contact mail', perform: () => { if (navigator.clipboard) navigator.clipboard.writeText(EMAIL); } },
    { id: 'action-github', label: 'Open GitHub', group: 'Actions', keywords: 'code repos', perform: () => openExternal(GITHUB) },
    { id: 'action-linkedin', label: 'Open LinkedIn', group: 'Actions', keywords: 'profile network', perform: () => openExternal(LINKEDIN) },
    { id: 'fun-matrix', label: 'Enter the Matrix', group: 'Fun', keywords: 'rain easter egg konami', perform: () => ctx.triggerMatrix() },
  ];
}

/** Returns commands whose label/keywords fuzzy-match the query, ranked best-first. Empty query keeps original order. */
export function filterCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands;
  return commands
    .map((cmd) => ({ cmd, score: fuzzyMatch(query, `${cmd.label} ${cmd.keywords ?? ''}`) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.cmd);
}
