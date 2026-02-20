import { RenderNode } from '../RenderNode';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';
import { MainAxisAlignment, CrossAxisAlignment } from '../types/container';

export class ColumnNode extends RenderNode {
  public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start;
  public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Start;

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 使用受约束限制的有效容器尺寸（优先使用 this.width/height，但不超过 constraints）
    const containerHeight = Math.min(
      this.height ?? constraints.maxHeight,
      constraints.maxHeight
    );
    const containerWidth = Math.min(
      this.width ?? constraints.maxWidth,
      constraints.maxWidth
    );

    // 1) 统计 flex 并先给非 flex 子项做 layout，收集尺寸
    const totalFlexNodes = this.children.reduce((s, c) => s + (c.flex || 0), 0);
    let usedHeight = 0;
    let maxWidth = 0;
    this.children.forEach((child) => {
      if (!child.flex) {
        child.layout({
          minWidth: constraints.minWidth,
          maxWidth: containerWidth,
          minHeight: constraints.minHeight,
          maxHeight: containerHeight,
        });
        usedHeight += child.height;
        maxWidth = Math.max(maxWidth, child.width);
      }
    });

    // 2) 分配给 flex 子项高度并 layout
    const remaining = Math.max(0, containerHeight - usedHeight);
    const flexUnit = totalFlexNodes > 0 ? remaining / totalFlexNodes : 0;
    this.children.forEach((child) => {
      if (child.flex) {
        const alloc = Math.max(0, Math.floor((child.flex || 0) * flexUnit));
        child.layout({
          minWidth: constraints.minWidth,
          maxWidth: containerWidth,
          minHeight: alloc,
          maxHeight: alloc,
        });
        usedHeight += child.height;
        maxWidth = Math.max(maxWidth, child.width);
      }
    });

    // 3) 根据 mainAxisAlignment 计算起始偏移和间隙
    const childCount = this.children.length;
    let offsetY = 0;
    let gap = 0;
    switch (this.mainAxisAlignment) {
      case MainAxisAlignment.End:
        offsetY = containerHeight - usedHeight;
        break;
      case MainAxisAlignment.Center:
        offsetY = Math.max(0, Math.floor((containerHeight - usedHeight) / 2));
        break;
      case MainAxisAlignment.SpaceBetween:
        gap =
          childCount > 1
            ? (containerHeight - usedHeight) / (childCount - 1)
            : 0;
        offsetY = 0;
        break;
      case MainAxisAlignment.Start:
      default:
        offsetY = 0;
    }

    // 4) 把子节点放置到计算好的位置，同时处理 crossAxisAlignment（水平对齐）
    this.children.forEach((child) => {
      // 水平对齐与 stretch 处理
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          child.x = Math.floor((containerWidth - child.width) / 2);
          break;
        case CrossAxisAlignment.End:
          child.x = Math.floor(containerWidth - child.width);
          break;
        case CrossAxisAlignment.Stretch:
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

    // 让 Column 占满容器宽度，避免只根据子项宽度收缩
    return { width: containerWidth, height: containerHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {}
}
