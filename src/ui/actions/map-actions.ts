// Unified map actions for save, load, reset
// These work directly with mind-elixir instance for reliability

import { serializeMap, deserializeMap } from '../../services/storage/serializer';

/**
 * Save the current mind map to a JSON file
 * Uses simple blob URL download that works in most browsers
 */
export function saveMapToFile(mindElixir: any): void {
  if (!mindElixir) {
    throw new Error('Mind map not initialized');
  }

  const data = mindElixir.getData();
  console.log('getData result:', data);
  
  if (!data || !data.nodeData) {
    throw new Error('No map data available');
  }

  const json = serializeMap(data.nodeData);
  const rootLabel = data.nodeData.topic || 'memorymap';
  const date = new Date();
  const filename = `${rootLabel.replace(/[^a-zA-Z0-9-_]/g, '_')}-memorymap-${date.toISOString().slice(0, 10)}.json`;

  // Create blob and trigger download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  
  // Cleanup after a delay
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  console.log('Download triggered for:', filename);
}

/**
 * Load a mind map from a JSON file via file picker
 */
export async function loadMapFromFile(mindElixir: any): Promise<void> {
  if (!mindElixir) {
    throw new Error('Mind map not initialized');
  }

  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        document.body.removeChild(input);
        reject(new Error('No file selected'));
        return;
      }

      try {
        const text = await file.text();
        console.log('File content length:', text.length);
        
        const envelope = deserializeMap(text);
        console.log('Deserialized envelope:', envelope);
        
        // Refresh mind-elixir with the loaded data
        mindElixir.refresh({ nodeData: envelope.root, linkData: {} });
        mindElixir.toCenter();
        
        document.body.removeChild(input);
        resolve();
      } catch (error) {
        document.body.removeChild(input);
        reject(error);
      }
    };

    input.oncancel = () => {
      document.body.removeChild(input);
      reject(new Error('File selection cancelled'));
    };

    document.body.appendChild(input);
    input.click();
  });
}

/**
 * Reset the mind map to just the root node
 */
export function resetMapToRoot(mindElixir: any): void {
  if (!mindElixir) {
    throw new Error('Mind map not initialized');
  }

  const data = mindElixir.getData();
  console.log('Current data before reset:', data);
  
  if (!data || !data.nodeData) {
    throw new Error('No map data available');
  }

  // Create a new root with no children
  const newRoot = {
    id: data.nodeData.id || 'root',
    topic: data.nodeData.topic || 'Memory Map Action Planner',
    root: true,
    children: [],
  };

  console.log('New root after reset:', newRoot);
  
  // Use init() instead of refresh() for a clean reset
  mindElixir.refresh({ nodeData: newRoot, linkData: {} });
  mindElixir.toCenter();
  
  console.log('Map reset complete');
}
