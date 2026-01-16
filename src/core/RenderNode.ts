import { Rect } from "./types/node";

// 1. 定义布局约束
export interface BoxConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

// 2. 定义尺寸对象
export interface Size {
  width: number;
  height: number;
}

// 3. 定义对齐方式
export interface Alignment {
  x: number;
  y: number;
}

export abstract class RenderNode {
  // 层级属性
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];
  // 几何属性 (由 layout 过程填充)
  public _x: number = 0;
  public _y: number = 0;
  public width: number = 0;
  public height: number = 0;
  // 渲染属性
  public _isDirty: boolean = true;
  public alpha: number = 1;
  public visible: boolean = true;
  // 弹性伸缩属性
  public flex: number = 0;
  // 点击回调属性
  public onClick?: (e: MouseEvent) => void;
  // 本地脏矩形数组
  private _localDirtyRects: Array<Rect> = [];
  /**
   * 添加子节点
   */
  add(child: RenderNode) {
    child.parent = this;
    this.children.push(child);
    this.markNeedsLayout();
  }

  /**
   * 标记当前节点以及所有父节点是否需要重新绘制
  */
  markNeedsPaint() {
    if(this._isDirty) return;
    this._isDirty = true;
    const pos = this.getGlobalPosition();
    const myRect = { x: pos.x, y: pos.y, w: this.width, h: this.height };
    if(this.parent) {
      this.parent.reportDirtyRect(myRect);
      this.parent.markNeedsPaint();
    } else {
      this._localDirtyRects.push(myRect);
    }
  }

  /**
  * 接收子节点上报的脏矩形，并继续向上冒泡
  */
public reportDirtyRect(rect: Rect) {
  if (this.parent) {
    // 如果有父节点，继续往上传
    this.parent.reportDirtyRect(rect);
  } else {
    // 如果已经到达根节点，将矩形存入汇总队列
    this._localDirtyRects.push(rect);
  }
}

  // 提供给 Engine 调用的方法
  public consumeDirtyRects(): Array<Rect> {
    const rects = [...this._localDirtyRects];
    this._localDirtyRects = [];
    return rects;
}

  /**。
   * 标记当前节点需要重新布局
   */
  markNeedsLayout() {
    this.markNeedsPaint();
  }

  /**
   * 核心布局方法 (子类需实现)
   * 逻辑：根据父节点给的约束，计算自己的 size
   */
  abstract performLayout(constraints: BoxConstraints): Size;

  /**
   * 核心绘制方法 (子类需实现)
   * @param ctx Canvas 上下文
   */
  abstract paintSelf(ctx: CanvasRenderingContext2D): void;

  /**
   * 递归布局管线
   */
  layout(constraints: BoxConstraints) {
    const size = this.performLayout(constraints);
    this.width = size.width;
    this.height = size.height;
  }

  /**
   * 递归绘制管线
   */
  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    // 1. 应用当前节点的偏移
    ctx.translate(this._x, this._y);
    // 2. 应用透明度
    ctx.globalAlpha *= this.alpha;

    // 3. 绘制自身
    this.paintSelf(ctx);

    // 4. 递归绘制子节点
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  // 位置属性
  public get x() {
    return this._x;
  }
  public set x(value: number) {
    if(this._x === value) return;
    this._x = value;
    this.markNeedsLayout();
  }
  public get y() {
    return this._y;
  }
  public set y(value: number) {
    if(this._y === value) return;
    this._y = value;
    this.markNeedsLayout();
  }

  /**
   * 获取节点在全局画布的位置
   */ 
  getGlobalPosition() {
    let globalX = this._x;
    let globalY = this._y;
    let current = this.parent;
    while (current) {
      globalX += current._x;
      globalY += current._y;
      current = current.parent;
    }
    return { x: globalX, y: globalY };
  }

  /**
   * 将全局点击坐标转换为本节点的局部坐标
   */
  globalToLocal(globalX: number, globalY: number): { x: number, y: number } {
    const pos = this.getGlobalPosition();
    return {
        x: globalX - pos.x,
        y: globalY - pos.y
    };
  }

  /**
   * 命中测试：判定点击坐标是否在自己或子节点范围内
   * 这是递归过程，遵循“深度优先”原则，因为最上层的子节点应该先捕获事件
   */
  hitTest(localX: number, localY:number): RenderNode | null {
    if(!this.visible) return null;
    for(let i= this.children.length-1;i>=0;i--) {
      const child = this.children[i];
      const target = child.hitTest(localX - child.x, localY - child.y);
      if(target) return target;
    }
    // 检查点击是否在当前节点范围内
    if(localX >= 0 && localX <= this.width && localY >= 0 && localY <= this.height) {
      return this;
    }
    return null;
  }
}