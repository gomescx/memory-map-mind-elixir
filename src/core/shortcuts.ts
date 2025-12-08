/**
 * Default Mind-Elixir Keyboard Shortcuts
 * 
 * This module documents and preserves the default keyboard shortcuts from mind-elixir-core.
 * These shortcuts must remain intact to maintain backward compatibility and user familiarity.
 * 
 * Mind-elixir keyboard handling is managed internally; this module serves as:
 * 1. A reference for developers to understand default behavior
 * 2. A checklist to verify no regressions occur when adding new features
 * 3. A guide for documenting the shortcuts to end users
 * 
 * IMPORTANT: Do not modify the `keypress: true` setting in App.tsx initialization.
 * Do not add global keydown listeners that interfere with these shortcuts.
 */

/**
 * Default Mind-Elixir Shortcuts (keypress: true)
 * 
 * All shortcuts are case-insensitive unless noted.
 * Ctrl = Cmd on macOS
 */
export const DEFAULT_MIND_ELIXIR_SHORTCUTS = {
  // Node Creation
  'Tab': {
    description: 'Add child node to selected node',
    action: 'addChild',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'Enter': {
    description: 'Add sibling node after selected node',
    action: 'insertSibling',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'Delete': {
    description: 'Delete selected node(s)',
    action: 'removeNodes',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },

  // Navigation
  'ArrowUp': {
    description: 'Move focus up in the tree or navigate up if expanded',
    action: 'navigate',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'ArrowDown': {
    description: 'Move focus down in the tree or navigate down if expanded',
    action: 'navigate',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'ArrowLeft': {
    description: 'Collapse node or move to parent',
    action: 'navigate',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'ArrowRight': {
    description: 'Expand node or move to first child',
    action: 'navigate',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },

  // Editing
  'F2': {
    description: 'Edit selected node topic/text',
    action: 'beginEdit',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'Escape': {
    description: 'Cancel edit or deselect all nodes',
    action: 'cancel',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },

  // Undo/Redo
  'Ctrl+Z': {
    description: 'Undo last action',
    action: 'undo',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+Z',
    compatibility: 'core',
  },
  'Cmd+Z': {
    description: 'Undo last action (macOS)',
    action: 'undo',
    platforms: ['macOS'],
    compatibility: 'core',
  },
  'Ctrl+Y': {
    description: 'Redo last action',
    action: 'redo',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+Shift+Z',
    compatibility: 'core',
  },
  'Cmd+Shift+Z': {
    description: 'Redo last action (macOS)',
    action: 'redo',
    platforms: ['macOS'],
    compatibility: 'core',
  },

  // Expansion
  'Space': {
    description: 'Toggle expand/collapse of selected node',
    action: 'expandNode',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },

  // Node Reordering (if supported)
  'Alt+Up': {
    description: 'Move node up in sibling order',
    action: 'moveUpNode',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },
  'Alt+Down': {
    description: 'Move node down in sibling order',
    action: 'moveDownNode',
    platforms: ['Windows', 'Linux', 'macOS'],
    compatibility: 'core',
  },

  // Selection
  'Ctrl+A': {
    description: 'Select all nodes (platform-dependent)',
    action: 'selectAll',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+A',
    compatibility: 'core',
  },

  // Zoom (if handleWheel: true)
  'Ctrl+Plus': {
    description: 'Zoom in',
    action: 'zoom',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+Plus',
    compatibility: 'core',
  },
  'Ctrl+Minus': {
    description: 'Zoom out',
    action: 'zoom',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+Minus',
    compatibility: 'core',
  },
} as const;

/**
 * New shortcuts added by Memory Map features
 * These should NOT conflict with DEFAULT_MIND_ELIXIR_SHORTCUTS
 */
export const CUSTOM_SHORTCUTS = {
  'Ctrl+S': {
    description: 'Save map to JSON file',
    action: 'saveMap',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+S',
    compatibility: 'custom',
  },
  'Ctrl+O': {
    description: 'Load map from JSON file',
    action: 'loadMap',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+O',
    compatibility: 'custom',
  },
  'Ctrl+E': {
    description: 'Export map to CSV and HTML',
    action: 'exportMap',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+E',
    compatibility: 'custom',
  },
  'Ctrl+P': {
    description: 'Toggle planning attribute panel',
    action: 'togglePlanPanel',
    platforms: ['Windows', 'Linux'],
    macShortcut: 'Cmd+P',
    compatibility: 'custom',
  },
} as const;

/**
 * Keyboard shortcut compatibility checks
 * Used to verify no regressions occur when modifying keyboard handling
 */
export interface KeyboardShortcutTest {
  shortcut: string;
  expectedAction: string;
  testDescription: string;
  expectedBehavior: string;
}

/**
 * Regression test checklist for keyboard shortcuts
 * Run these tests manually or via Playwright to verify:
 * - Default mind-elixir shortcuts remain functional
 * - Custom shortcuts work as intended
 * - No conflicts or unexpected side effects
 */
export const KEYBOARD_SHORTCUT_REGRESSION_TESTS: KeyboardShortcutTest[] = [
  {
    shortcut: 'Tab',
    expectedAction: 'addChild',
    testDescription: 'Add child to selected node',
    expectedBehavior: 'New child node appears indented under selected node',
  },
  {
    shortcut: 'Enter',
    expectedAction: 'insertSibling',
    testDescription: 'Add sibling after selected node',
    expectedBehavior: 'New sibling node appears at same level after selected node',
  },
  {
    shortcut: 'Delete',
    expectedAction: 'removeNodes',
    testDescription: 'Delete selected node',
    expectedBehavior: 'Selected node is removed; if children exist, behavior depends on mind-elixir config',
  },
  {
    shortcut: 'ArrowUp',
    expectedAction: 'navigate',
    testDescription: 'Navigate up',
    expectedBehavior: 'Selection moves to parent or previous sibling',
  },
  {
    shortcut: 'ArrowDown',
    expectedAction: 'navigate',
    testDescription: 'Navigate down',
    expectedBehavior: 'Selection moves to next sibling or first child',
  },
  {
    shortcut: 'Space',
    expectedAction: 'expandNode',
    testDescription: 'Toggle expand/collapse',
    expectedBehavior: 'Node children become visible or hidden',
  },
  {
    shortcut: 'Ctrl+Z (Cmd+Z)',
    expectedAction: 'undo',
    testDescription: 'Undo last action',
    expectedBehavior: 'Previous state is restored (if allowUndo: true)',
  },
  {
    shortcut: 'Alt+Up',
    expectedAction: 'moveUpNode',
    testDescription: 'Move node up in sibling order',
    expectedBehavior: 'Node swaps position with sibling above it',
  },
  {
    shortcut: 'Alt+Down',
    expectedAction: 'moveDownNode',
    testDescription: 'Move node down in sibling order',
    expectedBehavior: 'Node swaps position with sibling below it',
  },
  {
    shortcut: 'Ctrl+S (Cmd+S)',
    expectedAction: 'saveMap',
    testDescription: 'Save map to file',
    expectedBehavior: 'JSON file download triggered with current map data',
  },
  {
    shortcut: 'Ctrl+O (Cmd+O)',
    expectedAction: 'loadMap',
    testDescription: 'Load map from file',
    expectedBehavior: 'File picker opens; selected file replaces current map',
  },
  {
    shortcut: 'Ctrl+E (Cmd+E)',
    expectedAction: 'exportMap',
    testDescription: 'Export to CSV and HTML',
    expectedBehavior: 'Both CSV and HTML table files are downloaded',
  },
  {
    shortcut: 'Ctrl+P (Cmd+P)',
    expectedAction: 'togglePlanPanel',
    testDescription: 'Toggle planning panel',
    expectedBehavior: 'Planning attributes side panel opens/closes if node is selected',
  },
];

/**
 * Verify no shortcut conflicts exist
 * Compares DEFAULT_MIND_ELIXIR_SHORTCUTS with CUSTOM_SHORTCUTS
 */
export function verifyShortcutConflicts(): { hasConflicts: boolean; conflicts: string[] } {
  const defaultKeys = Object.keys(DEFAULT_MIND_ELIXIR_SHORTCUTS);
  const customKeys = Object.keys(CUSTOM_SHORTCUTS);
  const conflicts = defaultKeys.filter(key => customKeys.includes(key));

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Document all active shortcuts for UI display
 */
export function getAllActiveShortcuts() {
  return {
    ...DEFAULT_MIND_ELIXIR_SHORTCUTS,
    ...CUSTOM_SHORTCUTS,
  };
}

/**
 * Get platform-specific shortcut representation
 */
export function getPlatformShortcut(
  baseShortcut: string,
  platform: 'Windows' | 'Linux' | 'macOS' = detectPlatform()
): string {
  if (platform === 'macOS') {
    return baseShortcut
      .replace('Ctrl', 'Cmd')
      .replace('Alt', 'Opt');
  }
  return baseShortcut;
}

/**
 * Detect current platform
 */
function detectPlatform(): 'Windows' | 'Linux' | 'macOS' {
  if (typeof navigator === 'undefined') return 'Windows';
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('linux')) return 'Linux';
  return 'Windows';
}
