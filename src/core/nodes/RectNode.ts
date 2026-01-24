import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class RectNode extends RenderNode {
  private _color: string = 'white';

  public get color() { return this._color; }
  public set color(value: string) {
    if (this._color === value) return;
    this._color = value;
    // color changed -> mark dirty for repaint
    this.markNeedsPaint();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 布局时优先使用 props 传入的 width/height
    return {
      width: this.width || 100,
      height: this.height || 100
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}