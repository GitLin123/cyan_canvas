import { RenderNode } from '../RenderNode';
import { RTree, AABB } from './RTree';
import { HitTestResult, HitTestEntry } from '../events/HitTestResult';

export class SpatialIndex {
  private _tree = new RTree();
  private _ready = false;

  rebuild(root: RenderNode) {
    root.updateWorldBounds();
    const entries: { node: RenderNode; bbox: AABB }[] = [];
    this._collect(root, entries);
    this._tree.build(entries);
    this._ready = true;
  }

  private _collect(node: RenderNode, out: { node: RenderNode; bbox: AABB }[]) {
    if (!node.visible) return;
    out.push({
      node,
      bbox: {
        minX: node._worldX,
        minY: node._worldY,
        maxX: node._worldX + node.width,
        maxY: node._worldY + node.height,
      },
    });
    for (const child of node.children) this._collect(child, out);
  }

  hitTest(x: number, y: number): HitTestResult {
    const result = new HitTestResult();
    if (!this._ready) return result;

    const candidates = this._tree.query(x, y);
    if (candidates.length === 0) return result;

    // 按深度降序（最深节点优先）
    candidates.sort((a, b) => b.depth - a.depth);

    // 取最深节点，沿 parent chain 构建命中路径
    const deepest = candidates[0];
    const path: RenderNode[] = [];
    let cur: RenderNode | null = deepest;
    while (cur) {
      path.push(cur);
      cur = cur.parent;
    }

    // path 已经是从叶到根，逐个添加并计算局部坐标
    for (const node of path) {
      const localX = x - node._worldX;
      const localY = y - node._worldY;
      result.add(new HitTestEntry(node, localX, localY));
    }

    return result;
  }

  hitTestFirst(x: number, y: number): RenderNode | null {
    if (!this._ready) return null;
    const candidates = this._tree.query(x, y);
    if (candidates.length === 0) return null;
    // 返回最深节点
    let deepest = candidates[0];
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].depth > deepest.depth) deepest = candidates[i];
    }
    return deepest;
  }
}
