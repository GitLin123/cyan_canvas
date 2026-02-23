/**
 * Offstage - 隐藏但保留布局节点
 * 相当于 Flutter 的 Offstage，当 offstage=true 时隐藏子节点但仍参与布局
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class OffstageNode extends RenderNode {
  private _offstage: boolean = true;

  public get offstage() { return this._offstage; }
  public set offstage(v: boolean) {
    if (this._offstage === v) return;
    this._offstage = v;
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

  paint(ctx: PaintingContext): void {
    if (this._offstage) return; // 隐藏时不绘制

    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  paintSelf(ctx: PaintingContext): void {
    // Offstage 本身不绘制
  }
}
