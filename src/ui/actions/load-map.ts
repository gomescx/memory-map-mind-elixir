// Load action for mind map
import { deserializeMap, MemoryMapEnvelope } from '../../services/storage/serializer';
import { openFilePicker } from '../../services/storage/file-io';

export async function loadMap(): Promise<MemoryMapEnvelope> {
  try {
    const result = await openFilePicker({ accept: '.json' });
    const fileResult = Array.isArray(result) ? result[0] : result;
    return deserializeMap(fileResult.content);
  } catch (error) {
    throw new Error(`Failed to load map: ${error instanceof Error ? error.message : String(error)}`);
  }
}
