import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class RectNode extends RenderNode {
  private _color:string;
  constructor(
    public el_color: string = 'red',
    public prefWidth: number = 100,
    public prefHeight: number = 100) {
    super();
    this._color = el_color;
  }

  public get color() {return this._color;}
  public set color(value: string) {
    if(this._color === value) return;
    this._color = value;
    this.markNeedsPaint();
  }


  // 实现布局逻辑
  performLayout(constraints: BoxConstraints): Size {
    // 在父级约束范围内，取自己的理想大小
    let width = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, this.prefWidth));
    let height = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, this.prefHeight));
    return { width, height };
  }

  // 实现绘制逻辑
  paintSelf(ctx: CanvasRenderingContext2D): void {
    
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}