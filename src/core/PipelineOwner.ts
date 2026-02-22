import type { RenderNode } from './RenderNode';
import { DirtyRegionManager } from './DirtyRegionManager';

export class PipelineOwner {
  private _nodesNeedingLayout: RenderNode[] = [];
  private _nodesNeedingPaint: RenderNode[] = [];
  private _onNeedsVisualUpdate: () => void;
  public readonly dirtyRegionManager = new DirtyRegionManager();

  constructor(onNeedsVisualUpdate: () => void) {
    this._onNeedsVisualUpdate = onNeedsVisualUpdate;
  }

  requestVisualUpdate() {
    this._onNeedsVisualUpdate();
  }

  addNodeNeedingLayout(node: RenderNode) {
    this._nodesNeedingLayout.push(node);
  }

  addNodeNeedingPaint(node: RenderNode) {
    this._nodesNeedingPaint.push(node);
    // 记录节点当前 bounds 为脏区域（变化前的旧位置）
    this.dirtyRegionManager.addNodeBounds(
      node._worldX, node._worldY, node.width, node.height
    );
  }

  get needsLayout(): boolean {
    return this._nodesNeedingLayout.length > 0;
  }

  get needsPaint(): boolean {
    return this._nodesNeedingPaint.length > 0;
  }

  get dirtyNodeCount(): number {
    return this._nodesNeedingPaint.length;
  }

  /** 增量布局：只处理 relayout boundary 节点 */
  flushLayout() {
    // 按深度排序，确保父节点先布局
    this._nodesNeedingLayout.sort((a, b) => a.depth - b.depth);

    while (this._nodesNeedingLayout.length > 0) {
      const node = this._nodesNeedingLayout.shift()!;

      // 只处理仍需要布局的节点（可能已被父节点布局过）
      if (node.needsLayout) {
        node.layoutWithoutResize();
      }
    }
  }

  /** 收集脏节点的新 bounds（布局后），然后清空脏列表 */
  flushPaint() {
    // 布局完成后，节点的 worldX/worldY 已更新，记录新位置为脏区域
    for (const node of this._nodesNeedingPaint) {
      this.dirtyRegionManager.addNodeBounds(
        node._worldX, node._worldY, node.width, node.height
      );
    }
    this._nodesNeedingPaint.length = 0;
  }
}
