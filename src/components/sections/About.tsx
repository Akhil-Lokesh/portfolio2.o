import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../interactive/MagneticButton';

const MotionLink = motion(Link);

const About: React.FC = () => {
  // Typewriter effect for roles
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const roles = [
      "Data Engineer",
      "ML Engineer",
      "Full-Stack Developer",
      "Data Analyst",
      "CS Engineer",
      "Vibe Coder (allegedly)"
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

  // Combined chronological timeline — education + experience interleaved.
  // Tailwind needs full literal class strings (purge-safe), so accents come from this map.
  const accentStyles: Record<string, { text: string; dot: string; hoverBorder: string; tag: string }> = {
    primary: {
      text: 'text-primary',
      dot: 'from-primary to-secondary',
      hoverBorder: 'hover:border-primary/20',
      tag: 'bg-primary/15 text-primary'
    },
    secondary: {
      text: 'text-secondary',
      dot: 'from-secondary to-accent',
      hoverBorder: 'hover:border-secondary/20',
      tag: 'bg-secondary/15 text-secondary'
    },
    accent: {
      text: 'text-accent',
      dot: 'from-accent to-primary',
      hoverBorder: 'hover:border-accent/20',
      tag: 'bg-accent/15 text-accent'
    }
  };
  const accentKeys = ['primary', 'secondary', 'accent'];

  const journey: Array<{
    kind: string;
    icon: string;
    period: string;
    duration: string;
    title: string;
    subtitle: string;
    org: string;
    detail: string;
    current?: boolean;
  }> = [
    {
      kind: 'Education',
      icon: '🎓',
      period: '2019 – 2023',
      duration: '4 Years',
      title: "Bachelor's in Technology",
      subtitle: 'Computer Science Engineering',
      org: 'Vasavi College Of Engineering',
      detail: 'Foundation in CS fundamentals, algorithms, and software development'
    },
    {
      kind: 'Experience',
      icon: '🌱',
      period: 'Sep 2021 – Jan 2022',
      duration: '5 Months',
      title: 'Data Analytics Intern',
      subtitle: 'Aviac Technologies',
      org: 'Hyderabad, India',
      detail: 'Analyzed agricultural datasets with Python and SQL, turning domain requirements into automated reporting systems'
    },
    {
      kind: 'Experience',
      icon: '📈',
      period: 'Jan 2022 – Dec 2023',
      duration: '2 Years',
      title: 'Data Analyst',
      subtitle: 'Aviac Technologies',
      org: 'Hyderabad, India',
      detail: 'Crop-health predictive models (scikit-learn/TensorFlow, 85% accuracy across 500+ samples) and hyperspectral disease-detection pipelines with SQL data management'
    },
    {
      kind: 'Education',
      icon: '📊',
      period: '2024 – 2026',
      duration: '2 Years',
      title: "Master's of Engineering",
      subtitle: 'Data Analytics',
      org: 'San Jose State University',
      detail: 'Advanced data science, machine learning, and analytics specialization',
      current: true
    }
  ];

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
                  From Hyderabad's tech scene to San Jose's innovation playground – I'm <strong>Gudapuri Akhil Kumar</strong>, 
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
                  <strong>Plot twist #2:</strong> I built this with AI in the loop. If I'm going to talk about
                  human-AI collaboration, I'd rather ship it than slide-deck it.
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
                <div className="text-2xl font-display font-bold text-primary">8</div>
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

        {/* My Journey - Education & Experience Timeline */}
        <motion.div
          variants={itemVariants}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                My Journey
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-sans">
              The academic and professional path that shaped how I build
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Desktop Timeline Layout */}
            <div className="hidden md:block">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent"></div>

              <div className="space-y-20">
                {journey.map((item, i) => {
                  const a = accentStyles[accentKeys[i % accentKeys.length]];
                  const cardLeft = i % 2 === 1;

                  const yearsBlock = (
                    <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                      <div className={`${a.text} font-display font-bold text-2xl mb-3`}>
                        {item.period}
                      </div>
                      <div className={`text-foreground/60 text-base font-mono flex items-center gap-3 ${cardLeft ? '' : 'justify-end'}`}>
                        <span>{item.duration}</span>
                        {item.current && (
                          <motion.span
                            className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Current
                          </motion.span>
                        )}
                      </div>
                    </div>
                  );

                  const cardBlock = (
                    <motion.div
                      className={`bg-surface/20 rounded-2xl p-8 border border-white/5 ${a.hoverBorder} transition-all duration-300 ${cardLeft ? 'text-right' : ''}`}
                      whileHover={{ y: -4 }}
                    >
                      <div className={`flex items-start gap-4 mb-4 ${cardLeft ? 'flex-row-reverse' : ''}`}>
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <span className={`inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-widest ${a.tag}`}>
                            {item.kind}
                          </span>
                          <h3 className="font-display font-bold text-foreground text-xl mb-1">
                            {item.title}
                          </h3>
                          <p className={`${a.text} font-medium text-lg`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground/70 font-sans text-base mb-3">
                        {item.org}
                      </p>
                      <div className="text-sm text-foreground/50 font-mono">
                        {item.detail}
                      </div>
                    </motion.div>
                  );

                  return (
                    <motion.div
                      key={`${item.title}-${item.period}`}
                      className="relative flex items-center"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-1/2 ${cardLeft ? 'pr-12' : 'pr-12 text-right'}`}>
                        {cardLeft ? cardBlock : yearsBlock}
                      </div>

                      <motion.div
                        className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r ${a.dot} rounded-full border-4 border-background shadow-lg`}
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.2 }}
                      />

                      <div className="w-1/2 pl-12">
                        {cardLeft ? yearsBlock : cardBlock}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Timeline Layout - Stacked Vertically */}
            <div className="md:hidden space-y-12">
              {journey.map((item, i) => {
                const a = accentStyles[accentKeys[i % accentKeys.length]];
                return (
                  <motion.div
                    key={`${item.title}-${item.period}-m`}
                    className="relative"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-6">
                      <div className="bg-surface/30 rounded-2xl p-6 border border-white/5 text-center">
                        <div className={`${a.text} font-display font-bold text-3xl mb-2`}>
                          {item.period}
                        </div>
                        <div className="text-foreground/60 text-lg font-mono flex items-center justify-center gap-3">
                          <span>{item.duration}</span>
                          {item.current && (
                            <motion.span
                              className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Current
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <motion.div
                        className={`bg-surface/20 rounded-2xl p-6 border border-white/5 ${a.hoverBorder} transition-all duration-300`}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <span className={`inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-widest ${a.tag}`}>
                              {item.kind}
                            </span>
                            <h3 className="font-display font-bold text-foreground text-lg mb-1">
                              {item.title}
                            </h3>
                            <p className={`${a.text} font-medium text-base`}>
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <p className="text-foreground/70 font-sans text-base mb-3">
                          {item.org}
                        </p>
                        <div className="text-sm text-foreground/50 font-mono">
                          {item.detail}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-24 pb-24"
        >
          <MagneticButton>
            <MotionLink
              to="/contact"
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
            </MotionLink>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;