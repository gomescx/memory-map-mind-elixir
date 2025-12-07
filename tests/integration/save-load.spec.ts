import { describe, it, expect } from 'vitest';
import { serializeMap, deserializeMap } from '../../src/services/storage/serializer';

describe('save and load mind map with planning attributes', () => {
  it('serializes and deserializes a map with planning attributes', () => {
    // Simulate a map with planning attributes
    const node = {
      id: 'root_1',
      topic: 'Root',
      children: [
        {
          id: 'child_1',
          topic: 'Child',
          children: [],
          extended: { plan: { status: 'in-progress', due: '2025-12-31' } },
        },
      ],
      extended: { plan: { status: 'new' } },
    };
    const json = serializeMap(node);
    const loaded = deserializeMap(json);
    expect(loaded.root.children[0].extended.plan.status).toBe('in-progress');
    expect(loaded.root.extended.plan.status).toBe('new');
  });
});
