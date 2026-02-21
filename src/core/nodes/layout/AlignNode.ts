/**
 * AlignNode - 对齐容器节点
 * 用于在容器内根据指定的对齐方式对齐单个子节点
 * 按照 Flutter 的原理严格实现约束处理
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper, Alignment } from '../../types/container';
import { Size } from '../../types/node';

export class AlignNode extends RenderNode {
  public alignment: Alignment = Alignment.Center;

  constructor() {
    super();
  }

  private calculateOffsets(
    containerWidth: number,
    containerHeight: number,
    childWidth: number,
    childHeight: number
  ): { x: number; y: number } {
    let x = 0;
    let y = 0;

    switch (this.alignment) {
      case Alignment.TopLeft:
        x = 0;
        y = 0;
        break;
      case Alignment.TopCenter:
        x = (containerWidth - childWidth) / 2;
        y = 0;
        break;
      case Alignment.TopRight:
        x = containerWidth - childWidth;
        y = 0;
        break;
      case Alignment.CenterLeft:
        x = 0;
        y = (containerHeight - childHeight) / 2;
        break;
      case Alignment.Center:
        x = (containerWidth - childWidth) / 2;
        y = (containerHeight - childHeight) / 2;
        break;
      case Alignment.CenterRight:
        x = containerWidth - childWidth;
        y = (containerHeight - childHeight) / 2;
        break;
      case Alignment.BottomLeft:
        x = 0;
        y = containerHeight - childHeight;
        break;
      case Alignment.BottomCenter:
        x = (containerWidth - childWidth) / 2;
        y = containerHeight - childHeight;
        break;
      case Alignment.BottomRight:
        x = containerWidth - childWidth;
        y = containerHeight - childHeight;
        break;
      default:
        x = (containerWidth - childWidth) / 2;
        y = (containerHeight - childHeight) / 2;
    }

    return { x: Math.max(0, x), y: Math.max(0, y) };
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // === 确定 Align 的最终尺寸 ===
    // 优先用 preferredWidth/preferredHeight，否则占满约束范围
    const width = this._preferredWidth ?? constraints.maxWidth;
    const height = this._preferredHeight ?? constraints.maxHeight;

    // 严格应用约束
    const finalWidth = Math.max(
      constraints.minWidth,
      Math.min(constraints.maxWidth === Number.POSITIVE_INFINITY ? width : constraints.maxWidth, width)
    );

    const finalHeight = Math.max(
      constraints.minHeight,
      Math.min(constraints.maxHeight === Number.POSITIVE_INFINITY ? height : constraints.maxHeight, height)
    );

    // === 布局子节点 ===
    if (this.children.length > 0) {
      const child = this.children[0];

      // 用宽松约束布局子节点，让其报告自然尺寸
      child.layout({
        minWidth: 0,
        maxWidth: finalWidth,
        minHeight: 0,
        maxHeight: finalHeight,
      });

      // 根据对齐方式计算位置
      const offsets = this.calculateOffsets(finalWidth, finalHeight, child.width, child.height);
      child.x = offsets.x;
      child.y = offsets.y;
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Align 容器本身不绘制内容
  }
}
