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

export abstract class RenderNode {
  // 层级属性
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];

  // 几何属性 (由 layout 过程填充)
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  // 渲染属性
  public isDirty: boolean = true;
  public alpha: number = 1;
  public visible: boolean = true;

  /**
   * 添加子节点
   */
  add(child: RenderNode) {
    child.parent = this;
    this.children.push(child);
    this.markNeedsLayout();
  }

  /**
   * 标记当前节点需要重新布局
   */
  markNeedsLayout() {
    this.isDirty = true;
    this.parent?.markNeedsLayout(); // 向上冒泡，通知引擎根节点
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
    ctx.translate(this.x, this.y);
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
}