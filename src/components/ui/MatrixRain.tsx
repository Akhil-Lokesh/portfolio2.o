import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatrixRainProps {
  isActive: boolean;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ isActive }) => {
  const [columns, setColumns] = useState<Array<{ id: number; chars: string[]; speed: number }>>([]);
  
  // Tech stack characters that will rain down
  const techChars = [
    'Python', 'React', 'JS', 'TS', 'SQL', 'AWS', 'ML', 'AI', 
    '🐍', '⚛️', '🔷', '🟨', '☁️', '🤖', '📊', '🚀',
    'Pandas', 'PyTorch', 'Node', 'Kafka', 'Docker', 'MongoDB'
  ];

  useEffect(() => {
    if (!isActive) {
      setColumns([]);
      return;
    }

    const createColumn = (id: number) => ({
      id,
      chars: Array(25).fill(0).map(() => 
        techChars[Math.floor(Math.random() * techChars.length)]
      ),
      speed: Math.random() * 2 + 3 // 3-5 seconds for more dramatic effect
    });

    // Create columns
    const newColumns = Array(20).fill(0).map((_, i) => createColumn(i));
    setColumns(newColumns);

    // Update columns periodically
    const interval = setInterval(() => {
      setColumns(prev => prev.map(col => ({
        ...col,
        chars: col.chars.map(() => 
          techChars[Math.floor(Math.random() * techChars.length)]
        )
      })));
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {columns.map((column, index) => (
        <motion.div
          key={column.id}
          className="absolute top-0 flex flex-col items-center"
          style={{
            left: `${(index * 100) / columns.length}%`,
            width: '6%',
          }}
          initial={{ y: -200 }}
          animate={{ y: window.innerHeight + 200 }}
          transition={{
            duration: column.speed,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.2
          }}
        >
          {column.chars.map((char, charIndex) => (
            <motion.div
              key={charIndex}
              className="text-primary font-mono text-sm mb-1 drop-shadow-lg"
              initial={{ opacity: 0.9 }}
              animate={{ 
                opacity: [0.9, 0.3, 0.9],
                color: ["#0047FF", "#00CFFD", "#0047FF"]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: charIndex * 0.08
              }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      ))}
      
      {/* Achievement Toast Notification */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 bg-surface/95 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-2xl max-w-sm"
        initial={{ opacity: 0, x: 400, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex items-start gap-3">
          <motion.div 
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.div>
          <div className="flex-1">
            <div className="text-xs font-mono text-primary uppercase tracking-wider mb-1">
              Easter Egg Discovered
            </div>
            <div className="text-sm text-foreground font-display font-bold mb-1">
              Achievement Unlocked: Konami Coder!
            </div>
            <p className="text-xs text-foreground/70 font-sans leading-relaxed">
              You've unlocked the legendary tech skills matrix!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MatrixRain;