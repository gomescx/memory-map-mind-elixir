// Reset map action: removes all nodes except root
import type { MindMapNode } from '../../core/types/node';

export function resetMap(root: MindMapNode): MindMapNode {
  return {
    ...root,
    children: [],
    topic: root.topic || 'Memory Map Action Planner',
  };
}
