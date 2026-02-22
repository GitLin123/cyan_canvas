/**
 * Center 容器 - 在中心放置单个子节点
 * 相当于 Flutter 的 Center
 * 如果指定了尺寸，在该尺寸范围内居中子节点；否则占满父容器并居中。
 */

import { SingleChildLayoutNode } from '../base/SingleChildLayoutNode';
import { BoxConstraints, BoxConstraintsHelper } from '../../types/container';
import { Size } from '../../types/node';

export class CenterNode extends SingleChildLayoutNode {
  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // 使用基类方法计算最终尺寸
    const { width: finalWidth, height: finalHeight } = this.calculateFinalSize(
      constraints,
      this._preferredWidth,
      this._preferredHeight
    );

    // 布局子节点
    const child = this.firstChild;
    if (child) {
      // 使用基类方法创建宽松约束
      const childConstraints = this.createLooseConstraints(finalWidth, finalHeight);
      child.layout(childConstraints);

      // 在中心放置
      const dx = (finalWidth - child.width) / 2;
      const dy = (finalHeight - child.height) / 2;
      child.setPosition(Math.max(0, dx), Math.max(0, dy));
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(_ctx: CanvasRenderingContext2D): void {
    // Center 容器本身不绘制内容
  }
}
