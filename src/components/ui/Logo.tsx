import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

type MessageState = {
  message: string;
  currentIndex: number;
  displayedText: string;
  isTyping: boolean;
};

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '',
  animated = true 
}) => {
  // Messages to cycle through
  const messages = [
    "Hello!",
    "Whatsup?",
    "I like doing this lets start again!"
  ];
  
  // State for message and typing
  const [messageState, setMessageState] = useState<MessageState>({
    message: "ak.",
    currentIndex: 0,
    displayedText: "ak.",
    isTyping: false
  });
  const [clickCount, setClickCount] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  
  const messageIndexRef = useRef(0);
  const typingSpeedRef = useRef(70); // ms per character
  
  // Handle logo click with evolution
  const handleLogoClick = () => {
    if (messageState.isTyping) return;
    
    // Increment click count
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Evolution messages based on click count
    let evolutionMessage = "";
    if (newClickCount === 5) {
      evolutionMessage = "ak.exe";
    } else if (newClickCount === 10) {
      evolutionMessage = "ak.jpg"; // corrupted file joke
    } else if (newClickCount === 20) {
      evolutionMessage = "ak.gif"; // with sparkle animation
    } else if (newClickCount === 50) {
      evolutionMessage = "Achievement Unlocked! 🏆";
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    
    // Use evolution message or regular cycling
    let targetMessage: string;
    if (evolutionMessage) {
      targetMessage = evolutionMessage;
    } else {
      // Get next message index for regular cycling
      const nextIndex = (messageIndexRef.current + 1) % messages.length;
      messageIndexRef.current = nextIndex;
      targetMessage = messages[nextIndex];
    }
    
    // Start typing animation with the target message
    setMessageState(prev => ({
      ...prev,
      message: targetMessage,
      currentIndex: 0,
      displayedText: "",
      isTyping: true
    }));
  };
  
  // Effect for typing characters one by one
  useEffect(() => {
    if (!messageState.isTyping) return;
    
    // If we've typed the complete message
    if (messageState.currentIndex >= messageState.message.length) {
      // Typing is complete
      setMessageState(prev => ({
        ...prev,
        isTyping: false
      }));
      return;
    }
    
    // Type the next character
    const typingTimer = setTimeout(() => {
      setMessageState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        displayedText: prev.message.substring(0, prev.currentIndex + 1)
      }));
    }, typingSpeedRef.current);
    
    return () => clearTimeout(typingTimer);
  }, [messageState.isTyping, messageState.currentIndex, messageState.message]);
  
  // Effect for resetting to logo after message is complete
  useEffect(() => {
    // Only set reset timer when a message is fully displayed and it's not the logo
    if (!messageState.isTyping && 
        messageState.displayedText !== "ak." && 
        messageState.displayedText.length > 0) {
      
      const resetTimer = setTimeout(() => {
        // Start backspace effect
        startBackspaceEffect();
      }, 3000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [messageState.isTyping, messageState.displayedText]);
  
  // Function to handle backspace effect
  const startBackspaceEffect = () => {
    // Set to backspace mode but don't change the message content yet
    setMessageState(prev => ({
      ...prev,
      isTyping: true,
      // We'll keep the current message until backspacing is complete
    }));
    
    // Start backspace animation
    const backspaceInterval = setInterval(() => {
      setMessageState(prev => {
        // If text is empty, clear the interval and prepare for typing the logo
        if (prev.displayedText.length === 0) {
          clearInterval(backspaceInterval);
          
          // Start typing the logo after a tiny delay
          setTimeout(() => {
            setMessageState({
              message: "ak.",
              currentIndex: 0,
              displayedText: "",
              isTyping: true
            });
          }, 200);
          
          return {
            ...prev,
            isTyping: false // Temporarily pause typing indicator
          };
        }
        
        // Otherwise, remove one character
        return {
          ...prev,
          displayedText: prev.displayedText.substring(0, prev.displayedText.length - 1)
        };
      });
    }, 50); // Backspace speed - faster than typing
  };
    
  // Determine text size based on logo size
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };
  
  const textSize = textSizes[size];
  
  const logoVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.div
        className={`inline-flex items-center justify-center ${className}`}
        variants={animated ? logoVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <div 
          className={`${textSize} font-black tracking-tighter font-sans text-foreground cursor-pointer relative`}
          onClick={handleLogoClick}
        >
          {messageState.displayedText}
          {messageState.isTyping && (
            <span className="inline-block w-[0.5em] h-[1.1em] bg-foreground animate-pulse ml-1"></span>
          )}
          
          {/* Sparkle effect for ak.gif */}
          {messageState.displayedText === "ak.gif" && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 shadow-2xl border border-white/20"
          >
            <div className="text-center text-white">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-display font-bold mb-1">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">Logo Master</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Logo;
