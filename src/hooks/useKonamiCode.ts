import { useState, useEffect } from 'react';
import { KONAMI_CODE, EASTER_EGG_TIMEOUTS } from '../utils/constants';

export const useKonamiCode = () => {
  const [isKonamiActivated, setIsKonamiActivated] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = [...prev, event.code];
        
        // Keep only the last 10 keys (length of Konami code)
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        // Check if the sequence matches the Konami code
        if (newSequence.length === KONAMI_CODE.length) {
          const isMatch = newSequence.every((key, index) => key === KONAMI_CODE[index]);
          
          if (isMatch) {
            setIsKonamiActivated(true);
            // Reset after configured timeout
            setTimeout(() => {
              setIsKonamiActivated(false);
              setKeySequence([]);
            }, EASTER_EGG_TIMEOUTS.konamiMode);
            return [];
          }
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Fixed dependency

  return { isKonamiActivated, keySequence };
};