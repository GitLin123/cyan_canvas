/**
 * StackNode负责将子节点堆叠在一起。它的尺寸可以显式指定，也可以由最大的子节点确定。
 * StackNode 不会对其子节点进行任何位置调整，默认将它们放在左上角。可以通过 Align 来定位子节点。
 */
import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class StackNode extends RenderNode {
  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // Stack 的尺寸可显式指定，或由最大的子节点确定
    const stackWidth = this._preferredWidth ?? constraints.maxWidth;
    const stackHeight = this._preferredHeight ?? constraints.maxHeight;

    const stackConstraints: BoxConstraints = {
      minWidth: 0,
      maxWidth: stackWidth,
      minHeight: 0,
      maxHeight: stackHeight,
    };

    // 布局所有子节点，将它们堆叠在一起
    // 默认放在左上角，可通过 Positioned 或 Align 来定位
    let maxWidth = 0;
    let maxHeight = 0;

    this.children.forEach((child) => {
      child.layout(stackConstraints);

      // 默认放在左上角
      if (child.x === undefined || child.x === null) {
        child.x = 0;
      }
      if (child.y === undefined || child.y === null) {
        child.y = 0;
      }

      maxWidth = Math.max(maxWidth, child.x + child.width);
      maxHeight = Math.max(maxHeight, child.y + child.height);
    });

    // 计算 Stack 的最终尺寸
    const finalWidth =
      this._preferredWidth !== undefined
        ? this._preferredWidth
        : Math.max(constraints.minWidth, Math.min(constraints.maxWidth, maxWidth));
    const finalHeight =
      this._preferredHeight !== undefined
        ? this._preferredHeight
        : Math.max(constraints.minHeight, Math.min(constraints.maxHeight, maxHeight));

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Stack 容器本身不绘制任何东西
  }
}
