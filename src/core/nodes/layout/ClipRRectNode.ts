/**
 * ClipRRect - 圆角矩形裁剪节点
 * 相当于 Flutter 的 ClipRRect，对子树应用圆角矩形裁剪
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class ClipRRectNode extends RenderNode {
  private _borderRadius: number = 0;

  public get borderRadius() { return this._borderRadius; }
  public set borderRadius(v: number) {
    if (this._borderRadius === v) return;
    this._borderRadius = v;
    this.markNeedsPaint();
  }

  performLayout(constraints: BoxConstraints): Size {
    const width = this._preferredWidth ?? constraints.maxWidth;
    const height = this._preferredHeight ?? constraints.maxHeight;

    const finalWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, width));
    const finalHeight = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, height));

    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout({
        minWidth: 0,
        maxWidth: finalWidth,
        minHeight: 0,
        maxHeight: finalHeight,
      });
      child.setPosition(0, 0);
    }

    return { width: finalWidth, height: finalHeight };
  }

  paint(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    // 应用圆角矩形裁剪
    ctx.beginPath();
    if (this._borderRadius > 0 && ctx.roundRect) {
      ctx.roundRect(0, 0, this.width, this.height, this._borderRadius);
    } else if (this._borderRadius > 0) {
      // fallback: 手动绘制圆角矩形
      const r = this._borderRadius;
      const w = this.width;
      const h = this.height;
      ctx.moveTo(r, 0);
      ctx.arcTo(w, 0, w, h, r);
      ctx.arcTo(w, h, 0, h, r);
      ctx.arcTo(0, h, 0, 0, r);
      ctx.arcTo(0, 0, w, 0, r);
    } else {
      ctx.rect(0, 0, this.width, this.height);
    }
    ctx.clip();

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // ClipRRect 本身不绘制
  }
}
