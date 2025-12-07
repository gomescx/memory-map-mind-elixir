/**
 * Plan panel keyboard shortcuts
 * Handles hotkey to open/close panel without breaking existing mind-elixir shortcuts
 */

import { useEffect } from 'react';
import { useAppStore } from '@state/store';

/** Hotkey to toggle plan panel (Ctrl+P or Cmd+P) */
export const PLAN_PANEL_HOTKEY = 'p';
export const PLAN_PANEL_MODIFIER = 'ctrlKey'; // Use ctrlKey for Ctrl (Windows/Linux) or Cmd (Mac)

/**
 * Hook to register plan panel hotkey
 * Uses Ctrl+P (Windows/Linux) or Cmd+P (Mac)
 */
export function usePlanPanelHotkey() {
  const { isPanelOpen, selectedNodeId, setIsPanelOpen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+P (Windows/Linux) or Cmd+P (Mac)
      const isModifierPressed = e.ctrlKey || e.metaKey;

      if (isModifierPressed && e.key.toLowerCase() === PLAN_PANEL_HOTKEY) {
        e.preventDefault(); // Prevent browser print dialog
        e.stopPropagation(); // Don't interfere with mind-elixir

        // Only toggle panel if a node is selected
        if (selectedNodeId) {
          setIsPanelOpen(!isPanelOpen);
        }
      }

      // ESC to close panel
      if (e.key === 'Escape' && isPanelOpen) {
        e.stopPropagation();
        setIsPanelOpen(false);
      }
    };

    // Capture phase to intercept before mind-elixir handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isPanelOpen, selectedNodeId, setIsPanelOpen]);
}

/**
 * Button component to manually open plan panel
 */
export interface PlanPanelToggleButtonProps {
  className?: string;
}

export function PlanPanelToggleButton({ className }: PlanPanelToggleButtonProps) {
  const { selectedNodeId, setIsPanelOpen } = useAppStore();

  const handleClick = () => {
    if (selectedNodeId) {
      setIsPanelOpen(true);
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={!selectedNodeId}
      title={`Edit planning attributes (${
        navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'
      }+P)`}
    >
      📋 Plan
    </button>
  );
}
