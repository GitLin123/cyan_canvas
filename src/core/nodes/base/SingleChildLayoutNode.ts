import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

/**
 * 单子节点布局基类
 * 为所有单子节点容器提供通用的约束处理和布局逻辑
 */
export abstract class SingleChildLayoutNode extends RenderNode {
  /**
   * 计算最终尺寸（应用约束）
   * 处理 Infinity 和边界情况
   */
  protected calculateFinalSize(
    constraints: BoxConstraints,
    preferredWidth?: number,
    preferredHeight?: number
  ): { width: number; height: number } {
    const width = preferredWidth ?? constraints.maxWidth;
    const height = preferredHeight ?? constraints.maxHeight;

    return {
      width: Math.max(
        constraints.minWidth,
        Math.min(
          constraints.maxWidth === Number.POSITIVE_INFINITY ? width : constraints.maxWidth,
          width
        )
      ),
      height: Math.max(
        constraints.minHeight,
        Math.min(
          constraints.maxHeight === Number.POSITIVE_INFINITY ? height : constraints.maxHeight,
          height
        )
      ),
    };
  }

  /**
   * 布局子节点并设置位置
   */
  protected layoutChild(
    child: RenderNode,
    constraints: BoxConstraints,
    x: number = 0,
    y: number = 0
  ): void {
    child.layout(constraints);
    child.setPosition(x, y);
  }

  /**
   * 创建宽松约束（让子节点自由选择尺寸）
   */
  protected createLooseConstraints(maxWidth: number, maxHeight: number): BoxConstraints {
    return {
      minWidth: 0,
      maxWidth,
      minHeight: 0,
      maxHeight,
    };
  }

  /**
   * 获取第一个子节点（如果存在）
   */
  protected get firstChild(): RenderNode | null {
    return this.children.length > 0 ? this.children[0] : null;
  }

  // 抽象方法 - 子类必须实现
  abstract performLayout(constraints: BoxConstraints): Size;
}
