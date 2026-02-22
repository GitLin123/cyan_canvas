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
    // 子项布局用的交叉轴约束：无界时传原始约束，让子项报告自然宽度
    const childMaxWidth = containerWidth > 0 ? containerWidth : constraints.maxWidth;

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
          maxWidth: childMaxWidth,
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
          maxWidth: childMaxWidth,
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
    const crossWidth = containerWidth > 0 ? containerWidth : maxChildWidth;
    this.children.forEach((child) => {
      let cx = 0;
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          cx = Math.max(0, Math.floor((crossWidth - child.width) / 2));
          break;
        case CrossAxisAlignment.End:
          cx = Math.max(0, Math.floor(crossWidth - child.width));
          break;
        case CrossAxisAlignment.Stretch:
          child.layout({
            minWidth: crossWidth,
            maxWidth: crossWidth,
            minHeight: child.height,
            maxHeight: child.height,
          });
          break;
      }

      child.setPosition(cx, Math.floor(offsetY));
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

}
