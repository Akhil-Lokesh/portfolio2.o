import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import Reveal from '../interactive/Reveal';
import MagneticButton from '../interactive/MagneticButton';
import TiltCard from '../interactive/TiltCard';

const MotionLink = motion(Link);

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 md:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={projectVariants} className="text-center mt-6 mb-14">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Work
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-bitter">
            7 projects that solved real problems
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project) => (
            <motion.div key={project.id} variants={projectVariants}>
              <TiltCard className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                        {project.title}
                      </h3>
                      <span className="text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-foreground/80 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expand/Collapse Details */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => setSelectedProject(
                      selectedProject === project.id ? null : project.id
                    )}
                    className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-display font-medium"
                    whileHover={{ x: 5 }}
                  >
                    <span>{selectedProject === project.id ? 'Hide Details' : 'View Details'}</span>
                    <motion.span
                      animate={{ rotate: selectedProject === project.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                  
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>GitHub</span>
                      <span>↗</span>
                    </motion.a>
                  )}
                </div>

                {/* Detailed Content */}
                <AnimatePresence>
                  {selectedProject === project.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
                    >
                      <div className="space-y-6">
                        {/* Detailed Description */}
                        <div>
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Overview
                          </h4>
                          <p className="text-foreground/80 font-sans leading-relaxed">
                            {project.detailedDescription}
                          </p>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {project.keyFeatures.map((feature, index) => (
                              <motion.li
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 text-foreground/80"
                              >
                                <span className="text-secondary mt-1">→</span>
                                <span className="font-sans">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Technical Challenge */}
                        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border border-white/5">
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Technical Challenge
                          </h4>
                          <p className="text-foreground/80 font-sans leading-relaxed">
                            {project.technicalChallenge}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal className="text-center mt-16">
          <p className="text-foreground/60 font-sans mb-6">
            Interested in working together on the next challenge?
          </p>
          <MagneticButton>
            <MotionLink
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's discuss your project
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </MotionLink>
          </MagneticButton>
        </Reveal>
      </motion.div>
    </div>
  );
};

export default Work;