import { RenderNode, BoxConstraints, Size } from '../RenderNode';
import { MainAxisAlignment, CrossAxisAlignment} from '../types/container';
export class RowNode extends RenderNode {
  constructor(
    public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start,
    public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Center) {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 使用受约束限制的有效容器尺寸（优先使用 this.width/height，但不超过 constraints）
    const containerWidth = Math.min(this.width ?? constraints.maxWidth, constraints.maxWidth);
    const containerHeight = Math.min(this.height ?? constraints.maxHeight, constraints.maxHeight);

    // 1) 统计 flex 并先给非 flex 子项做 layout，收集尺寸
    const totalFlexNodes = this.children.reduce((s, c) => s + (c.flex || 0), 0);
    let usedWidth = 0;
    let maxHeight = 0;
    this.children.forEach(child => {
      if (!child.flex) {
        child.layout({
          minWidth: constraints.minWidth,
          maxWidth: containerWidth,
          minHeight: constraints.minHeight,
          maxHeight: containerHeight
        });
        usedWidth += child.width;
        maxHeight = Math.max(maxHeight, child.height);
      }
    });

    // 2) 分配给 flex 子项宽度并 layout
    const remaining = Math.max(0, containerWidth - usedWidth);
    const flexUnit = totalFlexNodes > 0 ? remaining / totalFlexNodes : 0;
    this.children.forEach(child => {
      if (child.flex) {
        const alloc = Math.max(0, Math.floor((child.flex || 0) * flexUnit));
        child.layout({
          minWidth: alloc,
          maxWidth: alloc,
          minHeight: constraints.minHeight,
          maxHeight: containerHeight
        });
        usedWidth += child.width;
        maxHeight = Math.max(maxHeight, child.height);
      }
    });

    // 3) 根据 mainAxisAlignment 计算起始偏移和间隙
    const childCount = this.children.length;
    let offsetX = 0;
    let gap = 0;
    switch (this.mainAxisAlignment) {
      case MainAxisAlignment.End:
        offsetX = Math.max(0, containerWidth - usedWidth);
        break;
      case MainAxisAlignment.Center:
        offsetX = Math.max(0, Math.floor((containerWidth - usedWidth) / 2));
        break;
      case MainAxisAlignment.SpaceBetween:
        gap = childCount > 1 ? (containerWidth - usedWidth) / (childCount - 1) : 0;
        offsetX = 0;
        break;
      case MainAxisAlignment.Start:
      default:
        offsetX = 0;
    }

    // 4) 放置子节点并处理交叉轴对齐
    this.children.forEach(child => {
      // 水平主轴位置
      child.x = Math.floor(offsetX);

      // 垂直对齐
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.Center:
          child.y = Math.floor((containerHeight - child.height) / 2);
          break;
        case CrossAxisAlignment.End:
          child.y = Math.floor(containerHeight - child.height);
          break;
        case CrossAxisAlignment.Stretch:
          child.layout({
            minWidth: child.width,
            maxWidth: child.width,
            minHeight: containerHeight,
            maxHeight: containerHeight
          });
          child.y = 0;
          break;
        case CrossAxisAlignment.Start:
        default:
          child.y = 0;
      }

      offsetX += child.width + gap;
    });

    return { width: containerWidth, height: containerHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Column 本身通常不画东西
  }
}