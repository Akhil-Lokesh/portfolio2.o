import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeBasedFeatures {
  isLateNight: boolean;
  isFridayAfternoon: boolean;
  isProgrammerDay: boolean;
  timeMessage: string | null;
}

interface SkillsProps {
  timeFeatures?: TimeBasedFeatures;
  konamiActive?: boolean;
}

interface Skill {
  name: string;
  category: string;
  description?: string;
  icon?: string;
}

interface TechDomain {
  name: string;
  label: string;
  skills: Skill[];
  color: string;
  description: string;
  icon: string;
}

const Skills: React.FC<SkillsProps> = ({ timeFeatures, konamiActive }) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domainClickCounts, setDomainClickCounts] = useState<{ [key: string]: number }>({});
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);

  const techDomains: TechDomain[] = [
    {
      name: 'data-science',
      label: 'Data Science & Analytics',
      icon: '📊',
      description: 'Extracting insights from complex data to drive business decisions',
      color: 'from-primary to-primary/60',
      skills: [
        { name: 'Python', category: 'data-science', description: 'Primary language for data analysis and ML', icon: '🐍' },
        { name: 'Pandas/NumPy', category: 'data-science', description: 'Data manipulation and numerical computing', icon: '🐼' },
        { name: 'PySpark', category: 'data-science', description: 'Big data processing and analytics', icon: '⚡' },
        { name: 'Tableau', category: 'data-science', description: 'Interactive data visualization', icon: '📈' },
        { name: 'Matplotlib/Seaborn', category: 'data-science', description: 'Statistical plotting and visualization', icon: '📊' }
      ]
    },
    {
      name: 'machine-learning',
      label: 'Machine Learning & AI',
      icon: '🤖',
      description: 'Building intelligent systems that learn and adapt from data',
      color: 'from-secondary to-secondary/60',
      skills: [
        { name: 'PyTorch', category: 'machine-learning', description: 'Deep learning and neural networks', icon: '🔥' },
        { name: 'Collaborative Filtering', category: 'machine-learning', description: 'Recommendation system algorithms', icon: '🎯' },
        { name: 'Data Preprocessing', category: 'machine-learning', description: 'Feature engineering and data preparation', icon: '🔧' },
        { name: 'Model Training', category: 'machine-learning', description: 'Training and optimizing ML models', icon: '⚙️' }
      ]
    },
    {
      name: 'web-development',
      label: 'Web Development',
      icon: '🌐',
      description: 'Creating modern, scalable web applications and user interfaces',
      color: 'from-accent to-accent/60',
      skills: [
        { name: 'React.js', category: 'web-development', description: 'Component-based frontend development', icon: '⚛️' },
        { name: 'TypeScript', category: 'web-development', description: 'Type-safe JavaScript development', icon: '🔷' },
        { name: 'JavaScript', category: 'web-development', description: 'Dynamic web interactions', icon: '🟨' },
        { name: 'Node.js', category: 'web-development', description: 'Server-side JavaScript runtime', icon: '🟢' },
        { name: 'Express', category: 'web-development', description: 'Web application framework', icon: '🚀' },
        { name: 'HTML/CSS', category: 'web-development', description: 'Web fundamentals and styling', icon: '🎨' },
        { name: 'Tailwind CSS', category: 'web-development', description: 'Utility-first CSS framework', icon: '💨' },
        // Friday afternoon easter egg
        ...(timeFeatures?.isFridayAfternoon ? [{ 
          name: 'Deploy on Friday', 
          category: 'web-development', 
          description: 'Expert level: Questionable decisions 😅', 
          icon: '🚨' 
        }] : [])
      ]
    },
    {
      name: 'database-systems',
      label: 'Database Systems',
      icon: '🗄️',
      description: 'Designing and managing data storage solutions at scale',
      color: 'from-primary to-secondary',
      skills: [
        { name: 'SQL', category: 'database-systems', description: 'Relational database queries and optimization', icon: '🗃️' },
        { name: 'MongoDB', category: 'database-systems', description: 'Document-based NoSQL database', icon: '🍃' },
        { name: 'PostgreSQL', category: 'database-systems', description: 'Advanced relational database', icon: '🐘' },
        { name: 'Apache Cassandra', category: 'database-systems', description: 'Distributed NoSQL for high-scale apps', icon: '💎' }
      ]
    },
    {
      name: 'cloud-infrastructure',
      label: 'Cloud & Infrastructure',
      icon: '☁️',
      description: 'Deploying and scaling applications in cloud environments',
      color: 'from-secondary to-accent',
      skills: [
        { name: 'AWS (EC2, EMR)', category: 'cloud-infrastructure', description: 'Cloud computing and big data services', icon: '🌩️' },
        { name: 'Docker/Kubernetes', category: 'cloud-infrastructure', description: 'Containerization and orchestration', icon: '📦' },
        { name: 'Apache Kafka', category: 'cloud-infrastructure', description: 'Real-time data streaming platform', icon: '🌊' },
        { name: 'Hadoop HDFS', category: 'cloud-infrastructure', description: 'Distributed file system', icon: '🗂️' }
      ]
    },
    {
      name: 'programming-languages',
      label: 'Programming Languages',
      icon: '⚡',
      description: 'Core programming languages for diverse application development',
      color: 'from-accent to-primary',
      skills: [
        { name: 'Python', category: 'programming-languages', description: 'Versatile language for data and backend', icon: '🐍' },
        { name: 'JavaScript', category: 'programming-languages', description: 'Full-stack web development', icon: '🟨' },
        { name: 'TypeScript', category: 'programming-languages', description: 'Type-safe application development', icon: '🔷' },
        { name: 'Java', category: 'programming-languages', description: 'Enterprise and system applications', icon: '☕' }
      ]
    }
  ];

  const handleDomainClick = (domainName: string) => {
    console.log('Domain clicked:', domainName, 'Current selected:', selectedDomain);
    
    const newCount = (domainClickCounts[domainName] || 0) + 1;
    setDomainClickCounts({ ...domainClickCounts, [domainName]: newCount });

    // Easter egg messages
    const easterEggs: { [key: string]: { count: number; message: string } } = {
      'data-science': { count: 3, message: "Error 404: Social life not found during data analysis 📊" },
      'machine-learning': { count: 5, message: "Warning: This human is becoming too dependent on algorithms 🤖" },
      'web-development': { count: 2, message: "Fun fact: 73.6% of statistics are made up 📈" }
    };

    const easterEgg = easterEggs[domainName];
    if (easterEgg && newCount === easterEgg.count) {
      setEasterEggMessage(easterEgg.message);
      setTimeout(() => setEasterEggMessage(null), 4000);
    }

    // Toggle domain expansion - only one can be open at a time
    const newSelectedDomain = selectedDomain === domainName ? null : domainName;
    console.log('Setting selected domain to:', newSelectedDomain);
    setSelectedDomain(newSelectedDomain);
  };

  const allSkills = techDomains.flatMap(domain => domain.skills);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 md:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mt-6 mb-14">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Skills
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-bitter">
            How I combine tech to create impact
          </p>
        </motion.div>

        {/* Easter Egg Message */}
        <AnimatePresence>
          {easterEggMessage && (
            <motion.div
              initial={{ opacity: 0, x: 400, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 bg-surface/95 backdrop-blur-md border border-accent/20 rounded-2xl p-4 shadow-2xl max-w-sm"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-accent uppercase tracking-wider mb-1">
                    Easter Egg Discovered
                  </div>
                  <p className="text-sm text-foreground font-display font-medium leading-relaxed">
                    {easterEggMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technology Domains Explorer */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-display font-semibold text-foreground/80 mb-4">
              Technology Domains
            </h3>
            <p className="text-foreground/60 font-sans text-sm">
              Explore the technologies I work with across different domains
            </p>
          </div>

          <div className="grid gap-6 items-start" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
            gridAutoFlow: 'row dense',
            gridAutoRows: 'min-content'
          }}>
            {techDomains.map((domain, index) => (
              <motion.div
                key={domain.name}
                variants={itemVariants}
                className={`relative bg-surface/20 border border-white/5 rounded-2xl transition-all duration-500 cursor-pointer ${
                  selectedDomain === domain.name ? 'border-white/20 shadow-lg' : 'hover:border-white/10 hover:scale-[1.01]'
                } ${konamiActive ? 'border-primary/50 shadow-primary/20 shadow-lg' : ''}`}
                onClick={(e) => {
                  // Prevent conflicts with arrow clicks
                  const target = e.target as Element;
                  const isArrowClick = target.closest('[data-arrow-click]');
                  
                  if (!isArrowClick) {
                    handleDomainClick(domain.name);
                  }
                }}
                whileHover={{ y: selectedDomain === domain.name ? 0 : -4 }}
                layout="position"
                transition={{ 
                  layout: { duration: 0.6, ease: "easeInOut" },
                  default: { duration: 0.3 }
                }}
                style={{
                  gridRowEnd: selectedDomain === domain.name ? 'span 2' : 'auto'
                }}
              >
                {/* Domain Header */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{domain.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-foreground text-lg">
                        {domain.label}
                        {konamiActive && (
                          <span className="ml-2 text-xs bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-full animate-pulse">
                            LEGENDARY
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${domain.color}`}></div>
                        <span className="text-sm text-foreground/60 font-mono">
                          {domain.skills.length} technologies
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground/70 font-sans leading-relaxed mb-4">
                    {domain.description}
                  </p>

                  {/* Preview Technologies (when not expanded) */}
                  {selectedDomain !== domain.name && (
                    <div className="flex flex-wrap gap-2">
                      {domain.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill.name}
                          className="text-xs px-3 py-1 bg-surface/30 text-foreground/80 rounded-full font-mono"
                        >
                          {skill.icon} {skill.name}
                        </span>
                      ))}
                      {domain.skills.length > 4 && (
                        <span className="text-xs px-3 py-1 bg-surface/30 text-foreground/60 rounded-full font-mono">
                          +{domain.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expand/Collapse Indicator */}
                  <div 
                    className="flex items-center justify-center mt-4 cursor-pointer py-2"
                    data-arrow-click="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDomainClick(domain.name);
                    }}
                  >
                    <motion.div
                      animate={{ rotate: selectedDomain === domain.name ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-foreground/60 hover:text-foreground text-lg px-4 py-2 rounded-lg hover:bg-surface/20 transition-all duration-200 border border-transparent hover:border-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ↓
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Skills */}
                <AnimatePresence>
                  {selectedDomain === domain.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-6 space-y-3">
                        {domain.skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skill.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: skillIndex * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-surface/10 rounded-xl hover:bg-surface/20 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-lg">{skill.icon}</span>
                            <div className="flex-1">
                              <h5 className="font-display font-medium text-foreground mb-1">
                                {skill.name}
                              </h5>
                              <p className="text-xs text-foreground/70 font-sans leading-relaxed">
                                {skill.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Overview */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-white/5">
            <div className="text-3xl font-display font-bold text-primary mb-2">
              {allSkills.length}
            </div>
            <div className="text-foreground/70 font-sans">Technologies</div>
          </div>
          <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-6 border border-white/5">
            <div className="text-3xl font-display font-bold text-secondary mb-2">
              {techDomains.length}
            </div>
            <div className="text-foreground/70 font-sans">Tech Domains</div>
          </div>
          <div className="text-center bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6 border border-white/5">
            <div className="text-3xl font-display font-bold text-accent mb-2">
              Multi
            </div>
            <div className="text-foreground/70 font-sans">Domain Expert</div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16"
        >
          <p className="text-foreground/60 font-sans mb-6">
            Ready to apply these diverse technologies to solve your challenges?
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's build something
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

export default Skills;