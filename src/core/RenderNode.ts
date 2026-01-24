import { Rect } from "./types/node";

export interface BoxConstraints { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number; }
export interface Size { width: number; height: number; }

export abstract class RenderNode {
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];

  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 0;
  protected _height: number = 0;

  public _isDirty: boolean = true;
  public _hasDirtyChild: boolean = true;
  public alpha: number = 1;
  public visible: boolean = true;
  public flex: number = 0;
  public onClick?: (e: MouseEvent) => void;
  private _localDirtyRects: Array<Rect> = [];

  public get x() { return this._x; }
  public set x(v: number) { if (this._x === v) return; this._x = v; this.markNeedsLayout(); }

  public get y() { return this._y; }
  public set y(v: number) { if (this._y === v) return; this._y = v; this.markNeedsLayout(); }

  public get width() { return this._width; }
  public set width(v: number) { if (this._width === v) return; this._width = v; this.markNeedsLayout(); }

  public get height() { return this._height; }
  public set height(v: number) { if (this._height === v) return; this._height = v; this.markNeedsLayout(); }

  add(child: RenderNode) {
    child.parent = this;
    this.children.push(child);
    this.markNeedsLayout();
  }

  markNeedsPaint() {
    if (this._isDirty) return;
    this._isDirty = true;
    let curr: RenderNode | null = this.parent;
    while (curr) {
      if (curr._hasDirtyChild) break;
      curr._hasDirtyChild = true;
      curr = curr.parent;
    }
    const root = this.getRoot();
    if ((root as any).engine) (root as any).engine.markNeedsPaint(this);
  }

  private getRoot(): RenderNode {
    let curr: RenderNode = this;
    while (curr.parent) curr = curr.parent;
    return curr;
  }

  markNeedsLayout() { this.markNeedsPaint(); }

  abstract performLayout(constraints: BoxConstraints): Size;
  abstract paintSelf(ctx: CanvasRenderingContext2D): void;

  layout(constraints: BoxConstraints) {
    const size = this.performLayout(constraints);
    this._width = size.width;
    this._height = size.height;
  }

  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this._x, this._y);
    this.paintSelf(ctx);
    for (const child of this.children) child.paint(ctx);
    ctx.restore();
    this._hasDirtyChild = false;
    this._isDirty = false;
  }

  hitTest(localX: number, localY: number): RenderNode | null {
    if (!this.visible) return null;
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      const target = child.hitTest(localX - child.x, localY - child.y);
      if (target) return target;
    }
    if (localX >= 0 && localX <= this.width && localY >= 0 && localY <= this.height) return this;
    return null;
  }

  public consumeDirtyRects(): Array<Rect> {

    const rects = [...this._localDirtyRects];

    this._localDirtyRects = [];

    return rects;

  }


  public toJSON(): any {
    return {
      type: this.constructor.name, // 节点类型，如 RectNode, ColumnNode
      props: {
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height,
        // 这里可以扩展更多属性，或者通过一个专门的 getSerializableProps 方法获取
      },
      children: this.children.map(child => child.toJSON())
    };
  }
}