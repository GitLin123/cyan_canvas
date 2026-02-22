import { ShapeNode } from './base/ShapeNode';
import { BoxConstraints, BoxConstraintsHelper } from '../types/container';
import { Size } from '../types/node';

export class RectNode extends ShapeNode {
  private _borderRadius: number = 0;
  private _opacity: number = 1;

  public get borderRadius() {
    return this._borderRadius;
  }
  public set borderRadius(v: number) {
    if (this._borderRadius === v) return;
    this._borderRadius = v;
    this.markNeedsPaint();
  }

  public get opacity() {
    return this._opacity;
  }
  public set opacity(v: number) {
    v = Math.max(0, Math.min(1, v));
    if (this._opacity === v) return;
    this._opacity = v;
    this.markNeedsPaint();
  }

  // 注意：RectNode 使用 _preferredWidth/_preferredHeight（继承自 RenderNode）
  // 而不是 ShapeNode 的 _prefWidth/_prefHeight
  // 需要覆盖 performLayout 以使用正确的属性
  public set preferredWidth(v: number | undefined) {
    this._preferredWidth = v;
    this.markNeedsLayout();
  }
  public set preferredHeight(v: number | undefined) {
    this._preferredHeight = v;
    this.markNeedsLayout();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    const prefWidth = this._preferredWidth ?? 100;
    const prefHeight = this._preferredHeight ?? 100;

    return { width: prefWidth, height: prefHeight };
  }

  private roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.max(0, Math.min(r, Math.min(w / 2, h / 2)));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha *= this._opacity;
    const w = this.width;
    const h = this.height;
    if (this._borderRadius > 0) {
      this.roundRectPath(ctx, 0, 0, w, h, this._borderRadius);
      ctx.fillStyle = this._color;
      ctx.fill();
    } else {
      ctx.fillStyle = this._color;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }
}
