import { Rect, Size} from "./types/node";
import { BoxConstraints } from "./types/container";
import { CyanEventHandlers, CyanKeyboardEvent } from "./types/events";

export abstract class RenderNode implements CyanEventHandlers {
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];

  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 400;
  protected _height: number = 300;

  public _isDirty: boolean = true;
  public _hasDirtyChild: boolean = true;
  public alpha: number = 1;
  public visible: boolean = true;
  public flex: number = 0;
  protected _localDirtyRects: Array<Rect> = [];

  // 事件系统
  public onClick?: (e: MouseEvent) => void;
  public onHover?: (e: MouseEvent) => void;
  public onMouseDown?: (e: MouseEvent) => void;
  public onMouseUp?: (e: MouseEvent) => void;
  public onMouseMove?: (e: MouseEvent) => void;
  public onMouseEnter?: (e: MouseEvent) => void;
  public onMouseLeave?: (e: MouseEvent) => void;
  public onWheel?: (e: WheelEvent) => void;
  public onContextMenu?: (e: MouseEvent) => void;
  public onKeyDown?: (e: CyanKeyboardEvent) => void;
  public onKeyUp?: (e: CyanKeyboardEvent) => void;
  public focusable: boolean = false; // 只有设为 true 的节点才能获焦

  public _isMouseOver: boolean = false;

  public get x() { return this._x; }
  public set x(v: number) { 
    if (this._x === v) return;
    this._addDirtyRect(this._x, this._y, this._width, this._height);
    this._x = v;
    this._addDirtyRect(this._x, this._y, this._width, this._height);
    this.markNeedsLayout(); 
  }

  public get y() { return this._y; }
  public set y(v: number) {
    if (this._y === v) return;
    this._addDirtyRect(this._x, this._y, this._width, this._height); // 旧位置
    this._y = v;
    this._addDirtyRect(this._x, this._y, this._width, this._height); // 新位置
    this.markNeedsLayout();
  }

  public get width() { return this._width; }
  public set width(v: number) {
     if (this._width === v) return; 
     this._addDirtyRect(this._x, this._y, this._width, this._height);
     this._width = v; 
      this._addDirtyRect(this._x, this._y, this._width, this._height);
     this.markNeedsLayout(); 
  }

  public get height() { return this._height; }
  public set height(v: number) { 
    if (this._height === v) return;
    this._addDirtyRect(this._x, this._y, this._width, this._height);
    this._height = v;
    this._addDirtyRect(this._x, this._y, this._width, this._height);
    this.markNeedsLayout(); }

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

  // 子类实现：返回首选尺寸（基类负责应用 constraints）
  abstract performLayout(constraints: BoxConstraints): Size;

  abstract paintSelf(ctx: CanvasRenderingContext2D): void;

  layout(constraints: BoxConstraints) {
    const preferred = this.performLayout(constraints);
    // clamp 到 constraints，确保子类无需重复实现 clamp / Stretch 行为
    const finalWidth = Math.max(constraints.minWidth ?? 0, Math.min(constraints.maxWidth ?? preferred.width, preferred.width));
    const finalHeight = Math.max(constraints.minHeight ?? 0, Math.min(constraints.maxHeight ?? preferred.height, preferred.height));
    this._width = finalWidth;
    this._height = finalHeight;
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

  private _addDirtyRect(x: number, y: number, w: number, h: number) {
    let globalX = x, globalY = y;
    let curr = this.parent;
    while (curr) {
      globalX += curr.x;
      globalY += curr.y;
      curr = curr.parent;
    }
    const root = this.getRoot();
    (root as any)._localDirtyRects.push({ x: globalX, y: globalY, width: w, height: h });  
  }

  private _calculateGlobalPosition(clientX: number, clientY: number) {
    
  }
}