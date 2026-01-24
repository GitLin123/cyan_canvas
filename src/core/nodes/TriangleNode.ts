import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class TriangleNode extends RenderNode {
  private _color: string = 'white';
  private _prefWidth?: number;
  private _prefHeight?: number;

  public get color() { return this._color; }
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
      height: this._prefHeight ?? 100
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;
    ctx.save();
    ctx.beginPath();
    // Upward pointing isosceles triangle
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
