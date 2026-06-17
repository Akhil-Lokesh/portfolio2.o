import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCommands, filterCommands, Command } from './command-registry';

interface CommandPaletteProps {
  onTriggerMatrix: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onTriggerMatrix }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo(
    () => getCommands({ navigate, triggerMatrix: onTriggerMatrix }),
    [navigate, onTriggerMatrix]
  );
  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    restoreFocusRef.current?.focus?.();
  }, []);

  const run = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return;
      close();
      cmd.perform();
    },
    [close]
  );

  // Global open shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) restoreFocusRef.current = document.activeElement as HTMLElement;
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input when opening
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Reset the active index as the query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg bg-surface/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type a command or search…"
              aria-label="Search commands"
              className="w-full bg-transparent px-5 py-4 text-foreground placeholder-foreground/40 outline-none font-sans border-b border-white/10"
            />
            <ul className="max-h-72 overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-5 py-3 text-sm text-foreground/50 font-sans">No matching commands.</li>
              )}
              {results.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => run(cmd)}
                    className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-left transition-colors ${
                      i === activeIndex ? 'bg-primary/15 text-foreground' : 'text-foreground/80 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-sans text-sm">{cmd.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">{cmd.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
