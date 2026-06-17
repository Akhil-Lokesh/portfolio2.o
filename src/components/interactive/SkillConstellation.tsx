import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TechDomain } from '../../types';

interface SkillConstellationProps {
  domains: TechDomain[];
  selectedDomain: string | null;
  onSelectDomain: (name: string) => void;
}

interface PlacedSkill {
  key: string;
  name: string;
  x: number;
  y: number;
}
interface PlacedDomain {
  name: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  skills: PlacedSkill[];
}

const CENTER = 50;
const HUB_RADIUS = 33;
const SKILL_RADIUS = 12;

function placeDomains(domains: TechDomain[]): PlacedDomain[] {
  return domains.map((domain, i) => {
    const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
    const x = CENTER + HUB_RADIUS * Math.cos(angle);
    const y = CENTER + HUB_RADIUS * Math.sin(angle);
    const skills = domain.skills.map((skill, j) => {
      const sa = (j / domain.skills.length) * Math.PI * 2;
      return {
        key: `${domain.name}-${skill.name}`,
        name: skill.name,
        x: x + SKILL_RADIUS * Math.cos(sa),
        y: y + SKILL_RADIUS * Math.sin(sa),
      };
    });
    return { name: domain.name, label: domain.label, icon: domain.icon, x, y, skills };
  });
}

const SkillConstellation: React.FC<SkillConstellationProps> = ({ domains, selectedDomain, onSelectDomain }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const placed = placeDomains(domains);

  const isDimmed = (domainName: string) => {
    const active = hovered ?? selectedDomain;
    return active !== null && active !== domainName;
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-2xl select-none">
      {/* Connection lines */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {placed.map((domain) => (
          <g key={`lines-${domain.name}`} style={{ opacity: isDimmed(domain.name) ? 0.12 : 1, transition: 'opacity 0.3s' }}>
            <line x1={CENTER} y1={CENTER} x2={domain.x} y2={domain.y} stroke="rgba(244,247,255,0.12)" strokeWidth={0.25} />
            {domain.skills.map((skill) => (
              <line
                key={`line-${skill.key}`}
                x1={domain.x}
                y1={domain.y}
                x2={skill.x}
                y2={skill.y}
                stroke="rgba(0,207,253,0.18)"
                strokeWidth={0.2}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Center node */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center text-white font-display font-bold"
        style={{ left: `${CENTER}%`, top: `${CENTER}%`, width: 56, height: 56, fontSize: 12 }}
      >
        AK
      </div>

      {/* Domain hubs + skills */}
      {placed.map((domain) => (
        <div key={domain.name} style={{ opacity: isDimmed(domain.name) ? 0.2 : 1, transition: 'opacity 0.3s' }}>
          {domain.skills.map((skill) => (
            <motion.button
              key={skill.key}
              type="button"
              drag
              dragSnapToOrigin
              dragElastic={0.4}
              whileHover={{ scale: 1.25, zIndex: 20 }}
              onHoverStart={() => setHovered(domain.name)}
              onHoverEnd={() => setHovered(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface/80 border border-white/15 text-[10px] font-mono text-foreground/80 px-2 py-1 whitespace-nowrap hover:border-secondary/60 hover:text-foreground cursor-grab active:cursor-grabbing"
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
              title={skill.name}
            >
              {skill.name}
            </motion.button>
          ))}
          <motion.button
            type="button"
            drag
            dragSnapToOrigin
            dragElastic={0.3}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovered(domain.name)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => onSelectDomain(domain.name)}
            aria-pressed={selectedDomain === domain.name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg cursor-grab active:cursor-grabbing transition-colors ${
              selectedDomain === domain.name
                ? 'bg-primary/25 border border-primary/60'
                : 'bg-surface/90 border border-white/15 hover:border-white/30'
            }`}
            style={{ left: `${domain.x}%`, top: `${domain.y}%`, zIndex: 10 }}
          >
            <span className="text-lg">{domain.icon}</span>
            <span className="text-xs font-display font-semibold text-foreground whitespace-nowrap">{domain.label}</span>
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default SkillConstellation;
