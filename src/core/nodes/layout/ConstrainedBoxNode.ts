/**
 * ConstrainedBox - 额外约束节点
 * 相当于 Flutter 的 ConstrainedBox，对子节点施加额外的 BoxConstraints
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class ConstrainedBoxNode extends RenderNode {
  private _minWidth: number = 0;
  private _maxWidth: number = Infinity;
  private _minHeight: number = 0;
  private _maxHeight: number = Infinity;

  public get constraintMinWidth() { return this._minWidth; }
  public set constraintMinWidth(v: number) { if (this._minWidth === v) return; this._minWidth = v; this.markNeedsLayout(); }

  public get constraintMaxWidth() { return this._maxWidth; }
  public set constraintMaxWidth(v: number) { if (this._maxWidth === v) return; this._maxWidth = v; this.markNeedsLayout(); }

  public get constraintMinHeight() { return this._minHeight; }
  public set constraintMinHeight(v: number) { if (this._minHeight === v) return; this._minHeight = v; this.markNeedsLayout(); }

  public get constraintMaxHeight() { return this._maxHeight; }
  public set constraintMaxHeight(v: number) { if (this._maxHeight === v) return; this._maxHeight = v; this.markNeedsLayout(); }

  performLayout(constraints: BoxConstraints): Size {
    // 合并父约束和自身额外约束
    const effectiveConstraints: BoxConstraints = {
      minWidth: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, this._minWidth)),
      maxWidth: Math.min(constraints.maxWidth, Math.max(constraints.minWidth, this._maxWidth)),
      minHeight: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, this._minHeight)),
      maxHeight: Math.min(constraints.maxHeight, Math.max(constraints.minHeight, this._maxHeight)),
    };

    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(effectiveConstraints);
      child.setPosition(0, 0);
      return { width: child.width, height: child.height };
    }

    return {
      width: Math.max(effectiveConstraints.minWidth, Math.min(effectiveConstraints.maxWidth, 0)),
      height: Math.max(effectiveConstraints.minHeight, Math.min(effectiveConstraints.maxHeight, 0)),
    };
  }

  paintSelf(ctx: PaintingContext): void {
    // ConstrainedBox 本身不绘制
  }
}
