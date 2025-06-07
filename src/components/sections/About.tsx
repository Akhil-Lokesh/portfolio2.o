import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  // Typewriter effect for roles
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const roles = [
      "Son", 
      "Student", 
      "Friend", 
      "Brother", 
      "CS Engineer", 
      "Data Analyst", 
      "Frontend Engineer", 
      "Prompt Engineer", 
      "Vibe Coder"
    ];
    
    const currentRole = roles[currentRoleIndex];
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentRole.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      } else {
        setCurrentText(currentRole.substring(0, currentText.length + 1));
        if (currentText === currentRole) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 md:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mt-6 mb-14">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Me
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-bitter">
            The story behind the solutions
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column - Story */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="prose prose-lg prose-invert">
              <h2 className="text-2xl font-display font-semibold mb-6 text-foreground">
                I solve problems with code, coffee, and occasionally brilliant insights.
              </h2>
              
              <div className="space-y-6">
                <p className="text-foreground/85 font-sans leading-relaxed text-lg">
                  <strong>Plot twist:</strong> I traded samosas for Silicon Valley dreams, and it's been quite the algorithm. 
                  From Hyderabad's tech scene to San Jose's innovation playground – I'm <strong>Gudapari Akhil Kumar</strong>, 
                  currently collecting my second degree (Data Analytics at SJSU) while building systems that turn chaos into clarity. 
                  The 8,000-mile journey from my Computer Science Engineering degree (Vasavi College, 2019-2023) to Silicon Valley 
                  wasn't just about changing zip codes. It was about evolving from someone who builds things that work to someone 
                  who builds things that matter.
                </p>

                <p className="text-foreground/85 font-sans leading-relaxed">
                  <strong>What I've learned:</strong> Raw computing power without context is just expensive electricity. 
                  The real magic happens when algorithms meet human psychology, when backend complexity creates frontend simplicity, 
                  and when data reveals stories that change decisions.
                </p>

                <p className="text-foreground/85 font-sans leading-relaxed">
                  <strong>Current mission:</strong> Proving that the best solutions come from understanding both the technical "how" 
                  and the human "why." Also, finding decent biryani in the Bay Area (still working on that one).
                </p>

                <p className="text-foreground/85 font-sans leading-relaxed">
                  <strong>Plot twist #2:</strong> I worked with AI to write this. Because if you're going to talk about 
                  human-AI collaboration, might as well walk the walk, right?
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Professional Identity */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Role Cycling */}
            <div className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-white/5">
              <h3 className="text-sm font-display font-medium text-foreground/60 mb-4 uppercase tracking-wider">
                I AM A
              </h3>
              <div className="h-16 flex items-center justify-center">
                <motion.span 
                  className="text-2xl md:text-3xl font-display font-bold text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text"
                  key={currentText}
                >
                  {currentText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-secondary"
                  >
                    |
                  </motion.span>
                </motion.span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center bg-surface/30 rounded-xl p-4 border border-white/5"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-display font-bold text-primary">3+</div>
                <div className="text-sm text-foreground/70">Major Projects</div>
              </motion.div>
              <motion.div 
                className="text-center bg-surface/30 rounded-xl p-4 border border-white/5"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-display font-bold text-secondary">20+</div>
                <div className="text-sm text-foreground/70">Technologies</div>
              </motion.div>
            </div>

            {/* Currently */}
            <motion.div 
              className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-6 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-display font-semibold mb-2 text-foreground">
                Currently
              </h3>
              <p className="text-foreground/80 font-sans">
                Open to discussing new projects and opportunities. 
                Always interested in challenging technical problems that 
                require creative solutions.
              </p>
            </motion.div>

            {/* My Reality Checks */}
            <motion.div 
              className="bg-surface/50 rounded-2xl p-6 border border-white/5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-display font-semibold mb-3 text-foreground">
                My Reality Checks
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start">
                  <span className="text-primary mr-2">→</span>
                  <span>Code for the 3 AM debugging session version of yourself</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  <span>Assumptions make great bugs - validate everything</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">→</span>
                  <span>If you didn't test it, it doesn't work (even if it seems to)</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Education Journey - Standalone Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Education Journey
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-sans">
              The academic foundation that shaped my technical expertise
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Desktop Timeline Layout */}
            <div className="hidden md:block">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent"></div>
              
              <div className="space-y-24">
                {/* Bachelor's Degree */}
                <motion.div 
                  className="relative flex items-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Left Side - Years */}
                  <div className="w-1/2 pr-12 text-right">
                    <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="text-primary font-display font-bold text-2xl mb-3">
                        2019 - 2023
                      </div>
                      <div className="text-foreground/60 text-base font-mono">
                        4 Years
                      </div>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-background shadow-lg"
                    whileHover={{ scale: 1.3 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Right Side - Education Details */}
                  <div className="w-1/2 pl-12">
                    <motion.div 
                      className="bg-surface/20 rounded-2xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-3xl">🎓</span>
                        <div>
                          <h3 className="font-display font-bold text-foreground text-xl mb-2">
                            Bachelor's in Technology
                          </h3>
                          <p className="text-primary font-medium text-lg">
                            Computer Science Engineering
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground/70 font-sans text-base mb-3">
                        Vasavi College Of Engineering
                      </p>
                      <div className="text-sm text-foreground/50 font-mono">
                        Foundation in CS fundamentals, algorithms, and software development
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Master's Degree */}
                <motion.div 
                  className="relative flex items-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Left Side - Education Details */}
                  <div className="w-1/2 pr-12 text-right">
                    <motion.div 
                      className="bg-surface/20 rounded-2xl p-8 border border-white/5 hover:border-secondary/20 transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start gap-4 mb-4 justify-end">
                        <div className="text-right">
                          <h3 className="font-display font-bold text-foreground text-xl mb-2">
                            Master's of Engineering
                          </h3>
                          <p className="text-accent font-medium text-lg">
                            Data Analytics
                          </p>
                        </div>
                        <span className="text-3xl">📊</span>
                      </div>
                      <p className="text-foreground/70 font-sans text-base mb-3">
                        San Jose State University
                      </p>
                      <div className="text-sm text-foreground/50 font-mono">
                        Advanced data science, machine learning, and analytics specialization
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Center Dot */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-secondary to-accent rounded-full border-4 border-background shadow-lg"
                    whileHover={{ scale: 1.3 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Right Side - Years */}
                  <div className="w-1/2 pl-12">
                    <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="text-secondary font-display font-bold text-2xl mb-3">
                        2024 - 2026
                      </div>
                      <div className="text-foreground/60 text-base font-mono flex items-center gap-3">
                        <span>2 Years</span>
                        <motion.span 
                          className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Current
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Timeline Layout - Stacked Vertically */}
            <div className="md:hidden space-y-12">
              {/* Bachelor's Degree - Mobile */}
              <motion.div 
                className="relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="space-y-6">
                  {/* Years Card */}
                  <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 text-center">
                    <div className="text-primary font-display font-bold text-3xl mb-2">
                      2019 - 2023
                    </div>
                    <div className="text-foreground/60 text-lg font-mono">
                      4 Years
                    </div>
                  </div>
                  
                  {/* Education Details Card */}
                  <motion.div 
                    className="bg-surface/20 rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl">🎓</span>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-lg mb-2">
                          Bachelor's in Technology
                        </h3>
                        <p className="text-primary font-medium text-base">
                          Computer Science Engineering
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/70 font-sans text-base mb-3">
                      Vasavi College Of Engineering
                    </p>
                    <div className="text-sm text-foreground/50 font-mono">
                      Foundation in CS fundamentals, algorithms, and software development
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Master's Degree - Mobile */}
              <motion.div 
                className="relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="space-y-6">
                  {/* Years Card */}
                  <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 text-center">
                    <div className="text-secondary font-display font-bold text-3xl mb-2">
                      2024 - 2026
                    </div>
                    <div className="text-foreground/60 text-lg font-mono flex items-center justify-center gap-3">
                      <span>2 Years</span>
                      <motion.span 
                        className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Current
                      </motion.span>
                    </div>
                  </div>
                  
                  {/* Education Details Card */}
                  <motion.div 
                    className="bg-surface/20 rounded-2xl p-6 border border-white/5 hover:border-secondary/20 transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl">📊</span>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-lg mb-2">
                          Master's of Engineering
                        </h3>
                        <p className="text-accent font-medium text-base">
                          Data Analytics
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/70 font-sans text-base mb-3">
                      San Jose State University
                    </p>
                    <div className="text-sm text-foreground/50 font-mono">
                      Advanced data science, machine learning, and analytics specialization
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-24 pb-24"
        >
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's build something together
            <motion.span 
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;