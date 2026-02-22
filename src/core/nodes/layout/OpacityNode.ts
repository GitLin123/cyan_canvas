/**
 * Opacity - 透明度控制节点
 * 相当于 Flutter 的 Opacity，对子树应用透明度
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class OpacityNode extends RenderNode {
  private _opacity: number = 1;

  public get opacity() { return this._opacity; }
  public set opacity(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    if (this._opacity === clamped) return;
    this._opacity = clamped;
    this.markNeedsPaint();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout({
        minWidth: constraints.minWidth,
        maxWidth: constraints.maxWidth,
        minHeight: constraints.minHeight,
        maxHeight: constraints.maxHeight,
      });
      child.setPosition(0, 0);
      return { width: child.width, height: child.height };
    }
    return { width: constraints.minWidth, height: constraints.minHeight };
  }

  paint(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || this.alpha <= 0) return;
    if (this._opacity <= 0) return;

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);
    ctx.globalAlpha *= this._opacity;

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Opacity 本身不绘制
  }
}
