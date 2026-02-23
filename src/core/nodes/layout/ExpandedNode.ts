/**
 * Expanded - Flex 布局中的弹性子项
 * 相当于 Flutter 的 Expanded，强制子节点填满 Flex 分配的空间
 * 必须作为 Row/Column/Flex 的子节点使用
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class ExpandedNode extends RenderNode {
  constructor() {
    super();
    this.flex = 1; // 默认 flex = 1
  }

  performLayout(constraints: BoxConstraints): Size {
    const width = constraints.maxWidth;
    const height = constraints.maxHeight;

    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(BoxConstraintsHelper.tight(width, height));
      child.setPosition(0, 0);
    }

    return { width, height };
  }

  paintSelf(ctx: PaintingContext): void {
    // Expanded 本身不绘制
  }
}
