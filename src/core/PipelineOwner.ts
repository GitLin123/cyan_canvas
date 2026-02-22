import type { RenderNode } from './RenderNode';

export class PipelineOwner {
  private _nodesNeedingLayout: RenderNode[] = [];
  private _nodesNeedingPaint: RenderNode[] = [];
  private _onNeedsVisualUpdate: () => void;

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
  }

  get needsLayout(): boolean {
    return this._nodesNeedingLayout.length > 0;
  }

  get needsPaint(): boolean {
    return this._nodesNeedingPaint.length > 0;
  }

  flushLayout() {
    // Sort by depth (parents first) to avoid redundant layouts
    this._nodesNeedingLayout.sort((a, b) => a.depth - b.depth);
    while (this._nodesNeedingLayout.length > 0) {
      const node = this._nodesNeedingLayout.shift()!;
      if (node.needsLayout) {
        node.layoutWithoutResize();
      }
    }
  }

  flushPaint() {
    this._nodesNeedingPaint.length = 0;
  }
}
