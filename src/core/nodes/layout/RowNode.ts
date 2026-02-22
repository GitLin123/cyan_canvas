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
      let cy = 0;
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          cy = Math.max(0, Math.floor((containerHeight - child.height) / 2));
          break;
        case CrossAxisAlignment.End:
          cy = Math.max(0, Math.floor(containerHeight - child.height));
          break;
        case CrossAxisAlignment.Stretch:
          child.layout({
            minWidth: child.width,
            maxWidth: child.width,
            minHeight: containerHeight,
            maxHeight: containerHeight,
          });
          break;
      }

      child.setPosition(Math.floor(offsetX), cy);
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

}
