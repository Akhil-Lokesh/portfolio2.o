import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Don't render header on homepage/hub
  if (location.pathname === '/') {
    return null;
  }

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with ink splash effect on hover */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="focus-ring rounded-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.5, opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />
            <Logo size="md" animated={true} />
          </motion.div>
          
          {/* Hub link with creative animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="relative font-garet text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 focus-ring rounded-full px-4 py-2 overflow-hidden flex items-center"
            >
              <motion.span
                className="absolute inset-0 bg-white/5 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                ← Hub
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
