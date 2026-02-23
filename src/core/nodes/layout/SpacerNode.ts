/**
 * Spacer - Flex 布局中的空白间隔
 * 相当于 Flutter 的 Spacer，本质是一个没有子节点的 Expanded
 * 用于在 Row/Column 中创建弹性空白
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class SpacerNode extends RenderNode {
  constructor() {
    super();
    this.flex = 1; // 默认 flex = 1
  }

  performLayout(constraints: BoxConstraints): Size {
    return {
      width: constraints.maxWidth,
      height: constraints.maxHeight,
    };
  }

  paintSelf(ctx: PaintingContext): void {
    // Spacer 不绘制任何内容
  }
}
