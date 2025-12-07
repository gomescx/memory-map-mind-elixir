import { describe, it, expect } from 'vitest';
import { serializeMap, deserializeMap, generateStableId } from '../../../src/services/storage/serializer';

const mockNode = {
  id: 'root_123',
  topic: 'Root',
  children: [],
  extended: { plan: {} },
};

describe('serializer', () => {
  it('serializes and deserializes a map', () => {
    const json = serializeMap(mockNode);
    const envelope = deserializeMap(json);
    expect(envelope.version).toBe('1.0.0');
    expect(envelope.root.topic).toBe('Root');
  });

  it('throws on invalid JSON', () => {
    expect(() => deserializeMap('not-json')).toThrow('Invalid JSON format');
  });

  it('throws on missing fields', () => {
    const badJson = JSON.stringify({ foo: 'bar' });
    expect(() => deserializeMap(badJson)).toThrow('Missing required fields (version, root)');
  });

  it('generates stable IDs', () => {
    const id = generateStableId('My Node');
    expect(id.startsWith('my_node_')).toBe(true);
  });
});
