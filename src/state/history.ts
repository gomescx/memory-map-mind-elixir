/**
 * History and Keyboard Handler Layer
 * 
 * This module manages keyboard event handling for undo/redo shortcuts:
 * - Ctrl+Z (Windows/Linux) or Cmd+Z (macOS) → undo
 * - Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (macOS) → redo
 */

import { useEffect } from 'react';

/**
 * Hook to manage undo/redo keyboard shortcuts
 * Handles:
 * - Ctrl+Z (Windows/Linux) or Cmd+Z (macOS) → undo
 * - Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (macOS) → redo
 */
export function useUndoRedoShortcuts(
  undo: () => void,
  redo: () => void
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (macOS)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        undo();
        return;
      }

      // Redo: Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (macOS)
      if ((e.ctrlKey && e.key === 'y') || (e.metaKey && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        redo();
        return;
      }
    };

    // Use capture phase to intercept before mind-elixir handlers if needed
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [undo, redo]);
}
