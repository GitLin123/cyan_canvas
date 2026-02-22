/**
 * LimitedBox - 限制无约束尺寸节点
 * 相当于 Flutter 的 LimitedBox，仅在父约束为无界时限制子节点尺寸
 * 常用于 ListView 等无界滚动容器中
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class LimitedBoxNode extends RenderNode {
  private _maxLimitWidth: number = Infinity;
  private _maxLimitHeight: number = Infinity;

  public get maxLimitWidth() { return this._maxLimitWidth; }
  public set maxLimitWidth(v: number) { if (this._maxLimitWidth === v) return; this._maxLimitWidth = v; this.markNeedsLayout(); }

  public get maxLimitHeight() { return this._maxLimitHeight; }
  public set maxLimitHeight(v: number) { if (this._maxLimitHeight === v) return; this._maxLimitHeight = v; this.markNeedsLayout(); }

  performLayout(constraints: BoxConstraints): Size {
    // 仅在无界时应用限制
    const effectiveMaxWidth = constraints.maxWidth === Infinity
      ? Math.min(this._maxLimitWidth, constraints.maxWidth)
      : constraints.maxWidth;
    const effectiveMaxHeight = constraints.maxHeight === Infinity
      ? Math.min(this._maxLimitHeight, constraints.maxHeight)
      : constraints.maxHeight;

    const childConstraints: BoxConstraints = {
      minWidth: constraints.minWidth,
      maxWidth: effectiveMaxWidth,
      minHeight: constraints.minHeight,
      maxHeight: effectiveMaxHeight,
    };

    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(childConstraints);
      child.setPosition(0, 0);
      return { width: child.width, height: child.height };
    }

    return {
      width: Math.max(constraints.minWidth, Math.min(effectiveMaxWidth, 0)),
      height: Math.max(constraints.minHeight, Math.min(effectiveMaxHeight, 0)),
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // LimitedBox 本身不绘制
  }
}
