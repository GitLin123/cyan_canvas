/**
 * SizedBox 容器 - 指定固定大小，可选单个子节点
 * 相当于 Flutter 的 SizedBox
 * 如果指定了显式的 width/height，则给子项严格的约束；否则让子项自然扩展。
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class SizedBoxNode extends RenderNode {
  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // === 确定 SizedBox 的最终尺寸 ===
    // 优先用显式的 preferredWidth/preferredHeight，否则占满约束范围
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

    // === 布局子项 ===
    if (this.children.length > 0) {
      const child = this.children[0];

      // 关键：如果显式指定了尺寸，给子项 tight 约束强制其适应
      // 否则给宽松约束让子项自由选择
      const childConstraints =
        this._preferredWidth !== undefined && this._preferredHeight !== undefined
          ? BoxConstraintsHelper.tight(finalWidth, finalHeight) // 显式指定尺寸 -> tight 约束
          : {
              minWidth: 0,
              maxWidth: finalWidth,
              minHeight: 0,
              maxHeight: finalHeight,
            }; // 未指定尺寸 -> 宽松约束

      child.layout(childConstraints);

      // 子节点放在左上角
      child.setPosition(0, 0);
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: PaintingContext): void {
    // SizedBox 容器本身不绘制任何东西
  }
}
