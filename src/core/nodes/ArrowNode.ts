import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class ArrowNode extends RenderNode {
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
      width: this._prefWidth ?? 120,
      height: this._prefHeight ?? 60
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;
    const headW = Math.min(w * 0.35, h * 1.2);
    const bodyW = Math.max(0, w - headW);

    ctx.save();
    ctx.beginPath();
    // Start at top-left of body
    ctx.moveTo(0, h * 0.25);
    ctx.lineTo(bodyW, h * 0.25);
    ctx.lineTo(bodyW, 0);
    // arrow tip
    ctx.lineTo(w, h * 0.5);
    ctx.lineTo(bodyW, h);
    ctx.lineTo(bodyW, h * 0.75);
    ctx.lineTo(0, h * 0.75);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
