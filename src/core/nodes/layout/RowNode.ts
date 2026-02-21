import { RenderNode } from '../../RenderNode';
import {
  BoxConstraints,
  BoxConstraintsHelper,
  MainAxisAlignment,
  CrossAxisAlignment,
  MainAxisSize,
} from '../../types/container';
import { Size } from '../../types/node';

export class RowNode extends RenderNode {
  public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start;
  public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Center;
  public mainAxisSize: MainAxisSize = MainAxisSize.Max;
  public scrollOffsetX: number = 0; // 水平滚动偏移
  public scrollOffsetY: number = 0; // 垂直滚动偏移（以防万一）

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // === 第1步: 确定容器高度 ===
    // 优先使用 preferredHeight，否则从约束确定
    const containerHeight =
      this._preferredHeight ??
      (constraints.maxHeight === Number.POSITIVE_INFINITY ? constraints.minHeight : constraints.maxHeight);

    // === 第1.5步: 确定容器宽度（用于 flex 分配基准） ===
    // 优先使用 preferredWidth，否则从约束确定
    const containerWidth =
      this._preferredWidth ??
      (constraints.maxWidth === Number.POSITIVE_INFINITY
        ? 0 // 如果无界，暂设为 0，flex 不额外分配
        : constraints.maxWidth);

    // === 第2步: 布局所有非 flex 子项（用无界宽度约束获取自然宽度）===
    const totalFlexNodes = this.children.reduce((s, c) => s + (c.flex || 0), 0);
    let usedWidth = 0;
    let maxChildHeight = 0;

    this.children.forEach((child) => {
      if (!child.flex) {
        // 宽度约束：无界，让子项报告自然宽度
        // 高度约束：必须适应容器高
        child.layout({
          minWidth: 0,
          maxWidth: Number.POSITIVE_INFINITY,
          minHeight: 0,
          maxHeight: containerHeight,
        });
        usedWidth += child.width;
        maxChildHeight = Math.max(maxChildHeight, child.height);
      }
    });

    // === 第3步: 计算 flex 分配 ===
    // 使用 containerWidth 而不是 constraints.maxWidth
    const availableWidth = Math.max(0, containerWidth > 0 ? containerWidth - usedWidth : usedWidth);

    const flexUnit = totalFlexNodes > 0 ? availableWidth / totalFlexNodes : 0;

    // === 第4步: 布局 flex 子项 ===
    this.children.forEach((child) => {
      if (child.flex) {
        const flexAlloc = Math.max(0, Math.floor((child.flex || 0) * flexUnit));
        child.layout({
          minWidth: flexAlloc,
          maxWidth: flexAlloc,
          minHeight: 0,
          maxHeight: containerHeight,
        });
        usedWidth += child.width;
        maxChildHeight = Math.max(maxChildHeight, child.height);
      }
    });

    // === 第5步: 确定容器最终宽度 ===
    let finalWidth = usedWidth;
    if (this.mainAxisSize === MainAxisSize.Max && containerWidth > 0) {
      finalWidth = containerWidth;
    }
    finalWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, finalWidth));

    // === 第6步: 放置子项（根据对齐模式计算位置） ===
    const childCount = this.children.length;
    let offsetX = 0;
    let gap = 0;

    switch (this.mainAxisAlignment) {
      case MainAxisAlignment.End:
        offsetX = Math.max(0, finalWidth - usedWidth);
        break;
      case MainAxisAlignment.Center:
        offsetX = Math.max(0, Math.floor((finalWidth - usedWidth) / 2));
        break;
      case MainAxisAlignment.SpaceBetween:
        gap = childCount > 1 ? (finalWidth - usedWidth) / (childCount - 1) : 0;
        offsetX = 0;
        break;
      case MainAxisAlignment.SpaceAround:
        // 子项周围均等空间（边缘空间是中间空间的一半）
        if (childCount > 0) {
          const totalGap = finalWidth - usedWidth;
          gap = totalGap / childCount;
          offsetX = gap / 2;
        } else {
          offsetX = 0;
        }
        break;
      case MainAxisAlignment.SpaceEvenly:
        // 全部均等空间（包括边缘）
        if (childCount > 0) {
          gap = (finalWidth - usedWidth) / (childCount + 1);
          offsetX = gap;
        } else {
          offsetX = 0;
        }
        break;
      case MainAxisAlignment.Start:
      default:
        offsetX = 0;
    }

    // === 第7步: 处理交叉轴对齐（高度） ===
    this.children.forEach((child) => {
      // 垂直对齐
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          child.y = Math.max(0, Math.floor((containerHeight - child.height) / 2));
          break;
        case CrossAxisAlignment.End:
          child.y = Math.max(0, Math.floor(containerHeight - child.height));
          break;
        case CrossAxisAlignment.Stretch:
          // 拉伸：重新布局为容器高
          child.layout({
            minWidth: child.width,
            maxWidth: child.width,
            minHeight: containerHeight,
            maxHeight: containerHeight,
          });
          child.y = 0;
          break;
        case CrossAxisAlignment.Start:
        default:
          child.y = 0;
      }

      child.x = Math.floor(offsetX);
      offsetX += child.width + gap;
    });

    // === 第8步: 返回容器最终尺寸 ===
    // 高度：优先使用 preferredHeight，否则自适应子项高度
    const resultHeight = this._preferredHeight ?? Math.max(maxChildHeight, constraints.minHeight);
    return {
      width: finalWidth,
      height: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, resultHeight)),
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Row 本身不绘制内容
  }

  // 重写 paint 以实现边界裁剪和滚动
  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x, this._y);

    // === 设置裁剪区域为 Row 的边界 ===
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    // === 应用滚动偏移 ===
    ctx.translate(-this.scrollOffsetX, -this.scrollOffsetY);

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  /**
   * 执行滚动操作
   * @param deltaX 水平滚动增量（正数向右，负数向左）
   * @param deltaY 垂直滚动增量（正数向下，负数向上）
   */
  public scroll(deltaX: number, deltaY: number): void {
    // 计算实际可滚动的宽度
    let totalContentWidth = 0;
    this.children.forEach((child) => {
      totalContentWidth = Math.max(totalContentWidth, child.x + child.width);
    });

    // 限制向右滚动
    const maxScrollX = Math.max(0, totalContentWidth - this.width);
    this.scrollOffsetX = Math.max(0, Math.min(this.scrollOffsetX + deltaX, maxScrollX));

    // 计算实际可滚动的高度
    let totalContentHeight = 0;
    this.children.forEach((child) => {
      totalContentHeight = Math.max(totalContentHeight, child.y + child.height);
    });

    // 限制向下滚动
    const maxScrollY = Math.max(0, totalContentHeight - this.height);
    this.scrollOffsetY = Math.max(0, Math.min(this.scrollOffsetY + deltaY, maxScrollY));

    this.markNeedsPaint();
  }

  /**
   * 获取滚动范围信息
   */
  public getScrollExtent(): { x: number; y: number; maxX: number; maxY: number } {
    let totalContentWidth = 0;
    let totalContentHeight = 0;
    this.children.forEach((child) => {
      totalContentWidth = Math.max(totalContentWidth, child.x + child.width);
      totalContentHeight = Math.max(totalContentHeight, child.y + child.height);
    });

    return {
      x: this.scrollOffsetX,
      y: this.scrollOffsetY,
      maxX: Math.max(0, totalContentWidth - this.width),
      maxY: Math.max(0, totalContentHeight - this.height),
    };
  }
}
