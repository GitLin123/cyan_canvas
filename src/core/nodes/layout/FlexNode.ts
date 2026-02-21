/**
 * Flex 容器 - 灵活的布局容器（基类）
 * 相当于 Flutter 的 Flex，是 Row 和 Column 的基类
 * FlexNode 负责根据主轴方向（direction）和对齐方式（mainAxisAlignment、crossAxisAlignment）来布局子节点。
 * 它会先根据子节点的 flex 属性分配剩余空间，然后根据对齐方式计算子节点的位置。
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, Direction } from '../../types/container';
import { Size } from '../../types/node';
import { MainAxisAlignment, CrossAxisAlignment } from '../../types/container';

export class FlexNode extends RenderNode {
  public direction: Direction = Direction.horizontal; // 主轴方向
  public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start;
  public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Start;
  public mainAxisSize: 'min' | 'max' = 'max'; // 主轴是否填满

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (this.direction === Direction.horizontal) {
      return this.performHorizontalLayout(constraints);
    } else {
      return this.performVerticalLayout(constraints);
    }
  }

  private performHorizontalLayout(constraints: BoxConstraints): Size {
    const containerWidth =
      this.width > 0
        ? Math.min(this.width, constraints.maxWidth)
        : constraints.maxWidth;

    const containerHeight =
      this.height > 0
        ? Math.min(this.height, constraints.maxHeight)
        : constraints.maxHeight;

    // 1) 统计 flex 并先给非 flex 子项做 layout
    const totalFlexNodes = this.children.reduce((s, c) => s + (c.flex || 0), 0);
    let usedWidth = 0;
    let maxHeight = 0;
    this.children.forEach((child) => {
      if (!child.flex) {
        child.layout({
          minWidth: constraints.minWidth,
          maxWidth: containerWidth,
          minHeight: constraints.minHeight,
          maxHeight: containerHeight,
        });
        usedWidth += child.width;
        maxHeight = Math.max(maxHeight, child.height);
      }
    });

    // 2) 分配给 flex 子项宽度并 layout
    const remaining = Math.max(0, containerWidth - usedWidth);
    const flexUnit = totalFlexNodes > 0 ? remaining / totalFlexNodes : 0;
    this.children.forEach((child) => {
      if (child.flex) {
        const alloc = Math.max(0, Math.floor((child.flex || 0) * flexUnit));
        child.layout({
          minWidth: alloc,
          maxWidth: alloc,
          minHeight: constraints.minHeight,
          maxHeight: containerHeight,
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
        gap =
          childCount > 1 ? (containerWidth - usedWidth) / (childCount - 1) : 0;
        offsetX = 0;
        break;
      case MainAxisAlignment.Start:
      default:
        offsetX = 0;
    }

    // 4) 放置子节点并处理交叉轴对齐
    this.children.forEach((child) => {
      child.x = Math.floor(offsetX);

      // 垂直对齐
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.End:
          child.y = Math.floor(containerHeight - child.height);
          break;
        case CrossAxisAlignment.Center:
          child.y = Math.floor((containerHeight - child.height) / 2);
          break;
        case CrossAxisAlignment.Stretch:
          child.height = containerHeight;
          child.y = 0;
          break;
        case CrossAxisAlignment.Start:
        default:
          child.y = 0;
      }

      offsetX += child.width + gap;
    });

    const finalWidth = this.width > 0 ? this.width : containerWidth;
    const finalHeight = this.height > 0 ? this.height : maxHeight;

    return { width: finalWidth, height: finalHeight };
  }

  private performVerticalLayout(constraints: BoxConstraints): Size {
    const containerHeight = Math.min(
      this.height ?? constraints.maxHeight,
      constraints.maxHeight
    );
    const containerWidth = Math.min(
      this.width ?? constraints.maxWidth,
      constraints.maxWidth
    );

    // 1) 统计 flex 并先给非 flex 子项做 layout
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

    // 4) 放置子节点并处理交叉轴对齐
    this.children.forEach((child) => {
      child.y = Math.floor(offsetY);

      // 水平对齐
      switch (this.crossAxisAlignment) {
        case CrossAxisAlignment.End:
          child.x = Math.floor(containerWidth - child.width);
          break;
        case CrossAxisAlignment.Center:
          child.x = Math.floor((containerWidth - child.width) / 2);
          break;
        case CrossAxisAlignment.Stretch:
          child.width = containerWidth;
          child.x = 0;
          break;
        case CrossAxisAlignment.Start:
        default:
          child.x = 0;
      }

      offsetY += child.height + gap;
    });

    const finalWidth = this.width > 0 ? this.width : maxWidth;
    const finalHeight = this.height > 0 ? this.height : containerHeight;

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Flex 容器本身不绘制任何东西
  }
}
