/**
 * SizedBox 容器 - 指定固定大小，可选单个子节点
 * 相当于 Flutter 的 SizedBox
 * 如果指定了显式的 width/height，则给子项严格的约束；否则让子项自然扩展。
 */

import { SingleChildLayoutNode } from '../base/SingleChildLayoutNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class SizedBoxNode extends SingleChildLayoutNode {
  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // === 布局子项（先布局子项以获取自然尺寸） ===
    const hasChild = this.children.length > 0;

    // 未指定维度时：有子项则用约束上限（让子项决定），无子项则收缩为 0
    const targetWidth = this._preferredWidth ?? (hasChild ? constraints.maxWidth : 0);
    const targetHeight = this._preferredHeight ?? (hasChild ? constraints.maxHeight : 0);

    const finalWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, targetWidth));
    const finalHeight = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, targetHeight));

    if (hasChild) {
      const child = this.children[0];

      const childConstraints =
        this._preferredWidth !== undefined && this._preferredHeight !== undefined
          ? BoxConstraintsHelper.tight(finalWidth, finalHeight)
          : {
              minWidth: 0,
              maxWidth: finalWidth,
              minHeight: 0,
              maxHeight: finalHeight,
            };

      child.layout(childConstraints);
      child.setPosition(0, 0);

      // 未指定维度时，收缩到子项的实际尺寸
      const resultWidth = this._preferredWidth !== undefined
        ? finalWidth
        : Math.max(constraints.minWidth, Math.min(constraints.maxWidth, child.width));
      const resultHeight = this._preferredHeight !== undefined
        ? finalHeight
        : Math.max(constraints.minHeight, Math.min(constraints.maxHeight, child.height));

      return { width: resultWidth, height: resultHeight };
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: PaintingContext): void {
    // SizedBox 容器本身不绘制任何东西
  }
}
