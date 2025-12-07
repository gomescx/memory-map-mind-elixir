// Serializer for mind map with version envelope and stable IDs
import type { MindMapNode } from '../../core/types/node';

export interface MemoryMapEnvelope {
  version: string;
  root: MindMapNode;
}

const SCHEMA_VERSION = '1.0.0';

export function serializeMap(root: MindMapNode): string {
  const envelope: MemoryMapEnvelope = {
    version: SCHEMA_VERSION,
    root,
  };
  return JSON.stringify(envelope, null, 2);
}

export function deserializeMap(json: string): MemoryMapEnvelope {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error('Invalid JSON format');
  }
  if (!parsed.version || !parsed.root) {
    throw new Error('Missing required fields (version, root)');
  }
  return parsed;
}

export function generateStableId(label: string): string {
  // Simple stable ID: label + timestamp
  return `${label.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
}
