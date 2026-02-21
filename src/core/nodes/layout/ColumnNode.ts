import { RenderNode } from '../../RenderNode';
import {
  BoxConstraints,
  BoxConstraintsHelper,
  MainAxisAlignment,
  CrossAxisAlignment,
  MainAxisSize,
} from '../../types/container';
import { Size } from '../../types/node';

export class ColumnNode extends RenderNode {
  public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start;
  public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Start;
  public mainAxisSize: MainAxisSize = MainAxisSize.Max;
  public scrollOffsetY: number = 0; // 纵向滚动偏移
  public scrollOffsetX: number = 0; // 横向滚动偏移（以防万一）

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // === 第1步: 确定容器宽度 ===
    // 优先使用 preferredWidth，否则从约束确定
    const containerWidth =
      this._preferredWidth ??
      (constraints.maxWidth === Number.POSITIVE_INFINITY ? constraints.minWidth : constraints.maxWidth);

    // === 第2步: 布局所有非 flex 子項（用無界高度約束獲取自然高度）===
    const totalFlexNodes = this.children.reduce((s, c) => s + (c.flex || 0), 0);
    const nonFlexChildren: { child: RenderNode; height: number }[] = [];
    let usedHeight = 0;
    let maxChildWidth = 0;

    this.children.forEach((child) => {
      if (!child.flex) {
        // 宽度约束：必须适应容器宽
        // 高度约束：无界，让子项报告自然高度
        child.layout({
          minWidth: 0,
          maxWidth: containerWidth,
          minHeight: 0,
          maxHeight: Number.POSITIVE_INFINITY,
        });
        nonFlexChildren.push({ child, height: child.height });
        usedHeight += child.height;
        maxChildWidth = Math.max(maxChildWidth, child.width);
      }
    });

    // === 第3步: 确定 flex 分配空间 ===
    // 优先使用 preferredHeight，否则从约束确定
    const containerHeight =
      this._preferredHeight ??
      (constraints.maxHeight === Number.POSITIVE_INFINITY
        ? 0 // 如果无界，暂设为 0，flex 不分配额外空间
        : constraints.maxHeight);

    const availableHeight = Math.max(0, containerHeight > 0 ? containerHeight - usedHeight : usedHeight);

    const flexUnit = totalFlexNodes > 0 ? availableHeight / totalFlexNodes : 0;

    // === 第4步: 布局 flex 子项 ===
    this.children.forEach((child) => {
      if (child.flex) {
        const flexAlloc = Math.max(0, Math.floor((child.flex || 0) * flexUnit));
        child.layout({
          minWidth: 0,
          maxWidth: containerWidth,
          minHeight: flexAlloc,
          maxHeight: flexAlloc,
        });
        usedHeight += child.height;
        maxChildWidth = Math.max(maxChildWidth, child.width);
      }
    });

    // === 第5步: 确定容器最终高度 ===
    let finalHeight = usedHeight;
    if (this.mainAxisSize === MainAxisSize.Max && containerHeight > 0) {
      finalHeight = containerHeight;
    }
    finalHeight = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, finalHeight));

    // === 第6步: 放置子项（根据对齐模式计算位置） ===
    const childCount = this.children.length;
    let offsetY = 0;
    let gap = 0;

    switch (this.mainAxisAlignment) {
      case MainAxisAlignment.End:
        offsetY = Math.max(0, finalHeight - usedHeight);
        break;
      case MainAxisAlignment.Center:
        offsetY = Math.max(0, Math.floor((finalHeight - usedHeight) / 2));
        break;
      case MainAxisAlignment.SpaceBetween:
        gap = childCount > 1 ? (finalHeight - usedHeight) / (childCount - 1) : 0;
        offsetY = 0;
        break;
      case MainAxisAlignment.SpaceAround:
        // 子项周围均等空间（边缘空间是中间空间的一半）
        if (childCount > 0) {
          const totalGap = finalHeight - usedHeight;
          gap = totalGap / childCount;
          offsetY = gap / 2;
        } else {
          offsetY = 0;
        }
        break;
      case MainAxisAlignment.SpaceEvenly:
        // 全部均等空间（包括边缘）
        if (childCount > 0) {
          gap = (finalHeight - usedHeight) / (childCount + 1);
          offsetY = gap;
        } else {
          offsetY = 0;
        }
        break;
      case MainAxisAlignment.Start:
      default:
        offsetY = 0;
    }

    // === 第7步: 处理交叉轴对齐（宽度） ===
    this.children.forEach((child) => {
      // 水平对齐
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          child.x = Math.max(0, Math.floor((containerWidth - child.width) / 2));
          break;
        case CrossAxisAlignment.End:
          child.x = Math.max(0, Math.floor(containerWidth - child.width));
          break;
        case CrossAxisAlignment.Stretch:
          // 拉伸：重新布局为容器宽
          child.layout({
            minWidth: containerWidth,
            maxWidth: containerWidth,
            minHeight: child.height,
            maxHeight: child.height,
          });
          child.x = 0;
          break;
        case CrossAxisAlignment.Start:
        default:
          child.x = 0;
      }

      child.y = Math.floor(offsetY);
      offsetY += child.height + gap;
    });

    // === 第8步: 返回容器最终尺寸 ===
    // 宽度：优先使用 preferredWidth，否则自适应子项宽度
    const resultWidth = this._preferredWidth ?? Math.max(maxChildWidth, constraints.minWidth);
    return {
      width: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, resultWidth)),
      height: finalHeight,
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Column 本身不绘制内容
  }

  // 重写 paint 以实现边界裁剪和滚动
  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x, this._y);

    // === 设置裁剪区域为 Column 的边界 ===
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
    // 计算实际可滚动的高度
    let totalContentHeight = 0;
    this.children.forEach((child) => {
      totalContentHeight = Math.max(totalContentHeight, child.y + child.height);
    });

    // 限制向下滚动
    const maxScrollY = Math.max(0, totalContentHeight - this.height);
    this.scrollOffsetY = Math.max(0, Math.min(this.scrollOffsetY + deltaY, maxScrollY));

    // 计算实际可滚动的宽度
    let totalContentWidth = 0;
    this.children.forEach((child) => {
      totalContentWidth = Math.max(totalContentWidth, child.x + child.width);
    });

    // 限制向右滚动
    const maxScrollX = Math.max(0, totalContentWidth - this.width);
    this.scrollOffsetX = Math.max(0, Math.min(this.scrollOffsetX + deltaX, maxScrollX));

    this.markNeedsPaint();
  }

  /**
   * 获取滚动范围信息
   */
  public getScrollExtent(): { x: number; y: number; maxX: number; maxY: number } {
    let totalContentHeight = 0;
    let totalContentWidth = 0;
    this.children.forEach((child) => {
      totalContentHeight = Math.max(totalContentHeight, child.y + child.height);
      totalContentWidth = Math.max(totalContentWidth, child.x + child.width);
    });

    return {
      x: this.scrollOffsetX,
      y: this.scrollOffsetY,
      maxX: Math.max(0, totalContentWidth - this.width),
      maxY: Math.max(0, totalContentHeight - this.height),
    };
  }
}
