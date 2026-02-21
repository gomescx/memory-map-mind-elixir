/**
 * View toggle button component
 * Switches between mindmap and table views
 */

import React from 'react';
import { useAppStore } from '@state/store';
import './view-toggle.css';

export const ViewToggle: React.FC = () => {
  const { currentView, setCurrentView } = useAppStore();

  const handleToggle = () => {
    setCurrentView(currentView === 'mindmap' ? 'table' : 'mindmap');
  };

  return (
    <button
      className="view-toggle-button"
      onClick={handleToggle}
      aria-label={`Switch to ${currentView === 'mindmap' ? 'table' : 'mindmap'} view`}
    >
      {currentView === 'mindmap' ? '📊 Table View' : '🗺️ Mindmap View'}
    </button>
  );
};
