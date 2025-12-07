// Reset map action: removes all nodes except root
import type { MindMapNode } from '../../core/types/node';

export function resetMap(root: MindMapNode): MindMapNode {
  console.log('resetMap called with root:', root);
  const result = {
    ...root,
    children: [],
    topic: root.topic || 'Memory Map Action Planner',
  };
  console.log('resetMap result:', result);
  return result;
}
