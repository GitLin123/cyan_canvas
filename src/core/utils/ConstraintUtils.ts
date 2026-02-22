import { BoxConstraints } from '../types/container';

/**
 * 约束处理工具类
 */
export class ConstraintUtils {
  /**
   * 将值限制在 min 和 max 之间
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * 应用宽度约束
   */
  static applyWidth(value: number, constraints: BoxConstraints): number {
    return this.clamp(
      value,
      constraints.minWidth,
      constraints.maxWidth === Number.POSITIVE_INFINITY ? value : constraints.maxWidth
    );
  }

  /**
   * 应用高度约束
   */
  static applyHeight(value: number, constraints: BoxConstraints): number {
    return this.clamp(
      value,
      constraints.minHeight,
      constraints.maxHeight === Number.POSITIVE_INFINITY ? value : constraints.maxHeight
    );
  }

  /**
   * 收缩约束（减去 padding/margin）
   */
  static deflate(
    constraints: BoxConstraints,
    horizontal: number,
    vertical: number
  ): BoxConstraints {
    return {
      minWidth: Math.max(0, constraints.minWidth - horizontal),
      maxWidth: Math.max(0, constraints.maxWidth - horizontal),
      minHeight: Math.max(0, constraints.minHeight - vertical),
      maxHeight: Math.max(0, constraints.maxHeight - vertical),
    };
  }

  /**
   * 合并约束（取交集）
   */
  static merge(parent: BoxConstraints, child: BoxConstraints): BoxConstraints {
    return {
      minWidth: Math.max(parent.minWidth, child.minWidth),
      maxWidth: Math.min(parent.maxWidth, child.maxWidth),
      minHeight: Math.max(parent.minHeight, child.minHeight),
      maxHeight: Math.min(parent.maxHeight, child.maxHeight),
    };
  }
}
