import { RenderNode } from '../RenderNode';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';

export class CircleNode extends RenderNode {
  private _color: string = 'white';
  private _prefWidth?: number;
  private _prefHeight?: number;

  public get color() {
    return this._color;
  }
  public set color(v: string) {
    if (this._color === v) return;
    this._color = v;
    this.markNeedsPaint();
  }

  public set preferredWidth(v: number | undefined) {
    if (this._prefWidth === v) return;
    this._prefWidth = v;
    this.markNeedsLayout();
  }
  public set preferredHeight(v: number | undefined) {
    if (this._prefHeight === v) return;
    this._prefHeight = v;
    this.markNeedsLayout();
  }

  performLayout(constraints: BoxConstraints): Size {
    return {
      width: this._prefWidth ?? 100,
      height: this._prefHeight ?? 100,
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;
    const r = Math.min(w, h) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
