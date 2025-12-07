// Save action for mind map
import { serializeMap } from '../../services/storage/serializer';
import { downloadBlob } from '../../services/storage/file-io';
import type { MindMapNode } from '../../core/types/node';

export function saveMap(root: MindMapNode): void {
  console.log('saveMap called with root:', root);
  try {
    const json = serializeMap(root);
    console.log('Serialized JSON length:', json.length);
    const rootLabel = root.topic || root.label || 'memorymap';
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const filename = `${rootLabel.replace(/[^a-zA-Z0-9-_]/g, '_')}-memorymap-${day}-${month}-${year}.json`;
    console.log('Filename:', filename);
    const blob = new Blob([json], { type: 'application/json' });
    console.log('Blob created, calling downloadBlob');
    downloadBlob(blob, filename);
    console.log('downloadBlob completed');
  } catch (error) {
    console.error('Error in saveMap:', error);
    throw new Error(`Failed to save map: ${error instanceof Error ? error.message : String(error)}`);
  }
}
