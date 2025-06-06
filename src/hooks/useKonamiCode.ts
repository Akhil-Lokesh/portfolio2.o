import { useState, useEffect } from 'react';

export const useKonamiCode = () => {
  const [isKonamiActivated, setIsKonamiActivated] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  
  // The famous Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = [...prev, event.code];
        
        // Keep only the last 10 keys (length of Konami code)
        if (newSequence.length > konamiCode.length) {
          newSequence.shift();
        }
        
        // Check if the sequence matches the Konami code
        if (newSequence.length === konamiCode.length) {
          const isMatch = newSequence.every((key, index) => key === konamiCode[index]);
          
          if (isMatch) {
            setIsKonamiActivated(true);
            // Reset after 5 seconds
            setTimeout(() => {
              setIsKonamiActivated(false);
              setKeySequence([]);
            }, 5000);
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
  }, []);

  return { isKonamiActivated, keySequence };
};