import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import TiltCard from '../interactive/TiltCard';

const MotionLink = motion(Link);

/** The homepage hero card. Shows the project Akhil is currently working on (Viraha),
 *  falling back to the `featured` project, then the first. */
const FeaturedProject: React.FC = () => {
  const current =
    projects.find((p) => p.id === 'viraha') ??
    projects.find((p) => p.featured) ??
    projects[0];

  return (
    <TiltCard className="text-left bg-surface/30 rounded-2xl border border-white/10 p-6 md:p-7 max-w-xl mx-auto">
      <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
        I'm working on
      </div>
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-2">
        {current.title}
      </h2>
      {current.hook && (
        <p className="text-foreground/75 font-sans text-sm leading-relaxed mb-4">
          {current.hook}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-5">
        {current.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <MotionLink
          to="/work"
          className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary/80 font-display font-medium text-sm"
          whileHover={{ x: 4 }}
        >
          Explore <span aria-hidden="true">→</span>
        </MotionLink>
        {current.githubUrl && (
          <a
            href={current.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground font-mono text-sm"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
        {current.liveUrl && (
          <a
            href={current.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground font-mono text-sm"
          >
            Live <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </TiltCard>
  );
};

export default FeaturedProject;
