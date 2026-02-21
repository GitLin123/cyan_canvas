import { Rect, Size } from './types/node';
import { BoxConstraints, BoxConstraintsHelper } from './types/container';
import { CyanEventHandlers, CyanKeyboardEvent } from './types/events';

export abstract class RenderNode implements CyanEventHandlers {
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];

  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 400;
  protected _height: number = 300;

  // 首选尺寸（来自 React props）
  protected _preferredWidth?: number;
  protected _preferredHeight?: number;

  // 已移除基于脏矩形的状态，改为由引擎统一控制全量重绘
  public alpha: number = 1;
  public visible: boolean = true;
  public flex: number = 0;

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

  public get x() {
    return this._x;
  }
  public set x(v: number) {
    if (this._x === v) return;
    this._x = v;
    this.markNeedsLayout();
  }

  public get y() {
    return this._y;
  }
  public set y(v: number) {
    if (this._y === v) return;
    this._y = v;
    this.markNeedsLayout();
  }

  public get width() {
    // 返回布局后的实际宽度，如果没有布局过就返回  preferred 或默认值
    return this._width > 0 ? this._width : (this._preferredWidth ?? 100);
  }
  public set width(v: number) {
    if (this._width === v) return;
    this._width = v;
    this.markNeedsLayout();
  }

  public get height() {
    // 返回布局后的实际高度，如果没有布局过就返回  preferred 或默认值
    return this._height > 0 ? this._height : (this._preferredHeight ?? 100);
  }
  public set height(v: number) {
    if (this._height === v) return;
    this._height = v;
    this.markNeedsLayout();
  }

  public get preferredWidth() {
    return this._preferredWidth;
  }
  public set preferredWidth(v: number | undefined) {
    if (this._preferredWidth === v) return;
    this._preferredWidth = v;
    this.markNeedsLayout();
  }

  public get preferredHeight() {
    return this._preferredHeight;
  }
  public set preferredHeight(v: number | undefined) {
    if (this._preferredHeight === v) return;
    this._preferredHeight = v;
    this.markNeedsLayout();
  }

  add(child: RenderNode) {
    child.parent = this;
    this.children.push(child);
    this.markNeedsLayout();
  }

  markNeedsPaint() {
    const root = this.getRoot();
    const engine = (root as any).engine || (this as any).engine;
    if (engine && typeof engine.markNeedsPaint === 'function') {
      engine.markNeedsPaint(this);
    }
  }

  private getRoot(): RenderNode {
    let curr: RenderNode = this;
    while (curr.parent) curr = curr.parent;
    return curr;
  }

  markNeedsLayout() {
    this.markNeedsPaint();
  }

  // 子类实现：返回首选尺寸（基类负责应用 constraints）
  abstract performLayout(constraints: BoxConstraints): Size;

  abstract paintSelf(ctx: CanvasRenderingContext2D): void;

  layout(constraints: BoxConstraints) {
    // 验证约束有效性
    if (!BoxConstraintsHelper.isValid(constraints)) {
      console.error(`[RenderNode.layout] Invalid constraints: ${JSON.stringify(constraints)}`);
      // 降级处理：使用宽松约束
      constraints = BoxConstraintsHelper.loose(constraints.maxWidth || 800, constraints.maxHeight || 600);
    }

    // 获取子类计算的首选尺寸
    const preferred = this.performLayout(constraints);

    // 严格 clamp 到约束范围内
    // 注意：必须同时满足 min 和 max 约束
    const finalWidth = Math.max(
      constraints.minWidth,
      Math.min(
        constraints.maxWidth === Number.POSITIVE_INFINITY ? (preferred.width ?? 100) : constraints.maxWidth,
        preferred.width ?? 100
      )
    );

    const finalHeight = Math.max(
      constraints.minHeight,
      Math.min(
        constraints.maxHeight === Number.POSITIVE_INFINITY ? (preferred.height ?? 100) : constraints.maxHeight,
        preferred.height ?? 100
      )
    );

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
    // 已移除脏矩形系统，统一由引擎进行全量重绘
    return [{ x: this._x, y: this._y, width: this._width, height: this._height }];
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
      children: this.children.map((child) => child.toJSON()),
    };
  }

  private _addDirtyRect(x: number, y: number, w: number, h: number) {
    // 不再使用局部脏矩形记录
  }

  private _calculateGlobalPosition(clientX: number, clientY: number) {}
}
