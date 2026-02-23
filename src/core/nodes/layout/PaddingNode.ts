/**
 * PaddingNode - 内边距容器节点
 * 用于在子节点周围添加内边距调整子节点的位置和大小
 * 按照 Flutter 的原理严格实现约束处理
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class PaddingNode extends RenderNode {
  public padding: number = 0;
  public paddingTop: number = 0;
  public paddingBottom: number = 0;
  public paddingLeft: number = 0;
  public paddingRight: number = 0;

  constructor() {
    super();
  }

  private getEffectivePadding() {
    return {
      top: this.paddingTop || this.padding,
      bottom: this.paddingBottom || this.padding,
      left: this.paddingLeft || this.padding,
      right: this.paddingRight || this.padding,
    };
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    const padding = this.getEffectivePadding();
    const totalPaddingX = padding.left + padding.right;
    const totalPaddingY = padding.top + padding.bottom;

    // === 计算子项的约束 ===
    // 关键：正确处理 Infinity 值
    const childMaxWidth =
      constraints.maxWidth === Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : Math.max(0, constraints.maxWidth - totalPaddingX);

    const childMaxHeight =
      constraints.maxHeight === Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : Math.max(0, constraints.maxHeight - totalPaddingY);

    // === 布局子节点 ===
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout({
        minWidth: 0,
        maxWidth: childMaxWidth,
        minHeight: 0,
        maxHeight: childMaxHeight,
      });

      // 在内边距区域内放置子节点
      child.setPosition(padding.left, padding.top);
    }

    // === 计算 Padding 容器的最终尺寸 ===
    let contentWidth = 0;
    let contentHeight = 0;
    if (this.children.length > 0) {
      contentWidth = this.children[0].width;
      contentHeight = this.children[0].height;
    }

    const totalWidth = contentWidth + totalPaddingX;
    const totalHeight = contentHeight + totalPaddingY;

    // 优先用 preferredWidth/preferredHeight，否则用计算值
    const width = this._preferredWidth ?? totalWidth;
    const height = this._preferredHeight ?? totalHeight;

    // 严格应用约束
    const finalWidth = Math.max(
      constraints.minWidth,
      Math.min(constraints.maxWidth === Number.POSITIVE_INFINITY ? width : constraints.maxWidth, width)
    );

    const finalHeight = Math.max(
      constraints.minHeight,
      Math.min(constraints.maxHeight === Number.POSITIVE_INFINITY ? height : constraints.maxHeight, height)
    );

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: PaintingContext): void {
    // Padding 容器本身不绘制内容
  }
}
