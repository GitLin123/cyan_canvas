/**
 * Center 容器 - 在中心放置单个子节点
 * 相当于 Flutter 的 Center
 * 如果指定了尺寸，在该尺寸范围内居中子节点；否则占满父容器并居中。
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';

export class CenterNode extends RenderNode {
  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // === 确定 Center 的最终尺寸 ===
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

      // 在中心放置
      child.setPosition(
        Math.max(0, (finalWidth - child.width) / 2),
        Math.max(0, (finalHeight - child.height) / 2)
      );
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Center 容器本身不绘制内容
  }
}
