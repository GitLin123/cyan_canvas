/**
 * AspectRatio 容器 - 维持纵横比
 * AspectRatioNode 是一个特殊的布局节点，用于根据指定的宽高比（aspectRatio）调整其尺寸。
 * 它会根据父级提供的约束条件，计算出一个满足宽高比要求的尺寸，并将其应用于自身和子节点。
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class AspectRatioNode extends RenderNode {
  public aspectRatio: number = 1.0; // 宽高比

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 根据宽度计算高度，或根据高度计算宽度
    let boxWidth = constraints.maxWidth;
    let boxHeight = constraints.maxHeight;

    if (this.aspectRatio > 0) {
      // 如果宽度受限，根据纵横比计算高度
      if (boxWidth < constraints.maxWidth) {
        boxHeight = boxWidth / this.aspectRatio;
      } else {
        // 否则根据高度计算宽度
        boxWidth = boxHeight * this.aspectRatio;
      }

      // 应用约束
      boxWidth = Math.max(
        constraints.minWidth,
        Math.min(constraints.maxWidth, boxWidth)
      );
      boxHeight = Math.max(
        constraints.minHeight,
        Math.min(constraints.maxHeight, boxHeight)
      );
    }

    // 如果有子节点，布局它
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout({
        minWidth: boxWidth,
        maxWidth: boxWidth,
        minHeight: boxHeight,
        maxHeight: boxHeight,
      });

      // 子节点填满 AspectRatio
      child.setPosition(0, 0);
    }

    return { width: boxWidth, height: boxHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // AspectRatio 容器本身不绘制任何东西
  }
}
