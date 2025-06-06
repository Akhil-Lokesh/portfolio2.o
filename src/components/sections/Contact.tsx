import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPriorityAlert, setShowPriorityAlert] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Easter egg: "hire me" detection
    if (name === 'message' && value.toLowerCase().includes('hire me')) {
      setShowPriorityAlert(true);
      setTimeout(() => setShowPriorityAlert(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 3000);
  };

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

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'akgudapuri@gmail.com',
      link: 'mailto:akgudapuri@gmail.com'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'linkedin.com/in/akhilgudapuri',
      link: 'https://www.linkedin.com/in/akhilgudapuri/'
    },
    {
      icon: '⚡',
      label: 'GitHub',
      value: 'github.com/Akhil-Lokesh',
      link: 'https://github.com/Akhil-Lokesh'
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Available across USA and India',
      link: null
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 md:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mt-6 mb-14">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contact Me
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-bitter">
            Let's build something together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">
                Ready to collaborate?
              </h2>
              <p className="text-foreground/80 font-sans leading-relaxed mb-6">
                I'm currently available for interesting problems and new opportunities. 
                Whether you need help with data science, machine learning, or full-stack development, 
                I'd love to hear about your project.
              </p>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Drop me a message and let's discuss how we can turn your complex challenges 
                into elegant solutions.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 bg-surface/20 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-2xl">{info.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-foreground/60 font-sans">{info.label}</div>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-foreground hover:text-primary transition-colors font-mono text-sm"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className="text-foreground font-mono text-sm">{info.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Availability Status */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-success/20 to-success/10 rounded-xl p-6 border border-success/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="font-display font-semibold text-foreground">Currently Available</span>
              </div>
              <p className="text-foreground/70 text-sm font-sans">
                Open to discussing new projects and opportunities. 
                Typical response time: within 24 hours.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-display font-medium text-foreground/80 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-surface/20 border border-white/10 rounded-xl text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors font-sans"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-display font-medium text-foreground/80 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-surface/20 border border-white/10 rounded-xl text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors font-sans"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-display font-medium text-foreground/80 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface/20 border border-white/10 rounded-xl text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors font-sans"
                  placeholder="Your company (optional)"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-display font-medium text-foreground/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-surface/20 border border-white/10 rounded-xl text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors resize-none font-sans"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {/* Priority Alert Easter Egg */}
              <AnimatePresence>
                {showPriorityAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="mb-4 p-3 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary">🚨</span>
                      <span className="font-display font-medium text-foreground">
                        Message priority: URGENT
                      </span>
                      <span className="text-primary">🚨</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting || submitted}
                className={`w-full py-4 rounded-xl font-display font-semibold transition-all duration-300 ${
                  submitted
                    ? 'bg-success text-white'
                    : isSubmitting
                    ? 'bg-surface/50 text-foreground/50'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl'
                }`}
                whileHover={!isSubmitting && !submitted ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting && !submitted ? { scale: 0.98 } : {}}
              >
                {submitted ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Message sent successfully!
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                )}
              </motion.button>
            </form>

            {/* Alternative Contact Methods */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <p className="text-foreground/60 text-sm font-sans mb-4">
                Prefer a more direct approach?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="mailto:akgudapuri@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface/20 rounded-full text-foreground/70 hover:text-foreground border border-white/5 hover:border-white/20 transition-all duration-300 text-sm font-mono"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📧</span>
                  Email directly
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/akhilgudapuri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface/20 rounded-full text-foreground/70 hover:text-foreground border border-white/5 hover:border-white/20 transition-all duration-300 text-sm font-mono"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>💼</span>
                  LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-white/5"
        >
          <h3 className="text-xl font-display font-bold mb-3 text-foreground">
            Ready to start building?
          </h3>
          <p className="text-foreground/70 font-sans mb-4">
            Whether you're stuck with data that doesn't make sense, need an app that actually works the way users expect, or just want to chat about turning a cool idea into reality—I'd love to help.
          </p>
          <p className="text-foreground/60 font-sans text-sm">
            Let's figure it out together.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;