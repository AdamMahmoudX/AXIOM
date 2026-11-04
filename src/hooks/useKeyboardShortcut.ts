import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcut = (options: KeyboardShortcutOptions) => {
  const { key, ctrl = false, shift = false, alt = false, callback, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if all required modifiers are pressed
      const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      // Check if the key matches (case-insensitive)
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        callback();
      }
    },
    [key, ctrl, shift, alt, callback]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

// Specific hook for AXIOMX login shortcut (Ctrl + S)
export const useAxiomXLoginShortcut = (callback: () => void, enabled = true) => {
  useKeyboardShortcut({
    key: 's',
    ctrl: true,
    shift: false,
    callback,
    enabled,
  });
};

export default useKeyboardShortcut;