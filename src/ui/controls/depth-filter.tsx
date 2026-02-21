/**
 * Depth filter dropdown component
 * Filters table view by node depth level
 */

import React from 'react';
import { useAppStore } from '@state/store';
import './depth-filter.css';

export const DepthFilter: React.FC = () => {
  const { depthFilter, setDepthFilter } = useAppStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'all') {
      setDepthFilter(undefined);
    } else {
      setDepthFilter(parseInt(value, 10));
    }
  };

  const currentValue = depthFilter === undefined ? 'all' : String(depthFilter);

  return (
    <div className="depth-filter">
      <label htmlFor="depth-select">Filter by Depth:</label>
      <select
        id="depth-select"
        value={currentValue}
        onChange={handleChange}
        className="depth-select"
      >
        <option value="all">All</option>
        <option value="0">Depth 0</option>
        <option value="1">Depth 1</option>
        <option value="2">Depth 2</option>
        <option value="3">Depth 3</option>
        <option value="4">Depth 4</option>
      </select>
    </div>
  );
};
