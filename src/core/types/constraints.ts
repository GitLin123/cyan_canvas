/**
 * 约束系统类型定义
 */

// 约束类型（支持 Infinity）
export interface BoxConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

// 约束工具类
export class BoxConstraintsHelper {
  // 创建紧约束（min === max）
  static tight(width: number, height: number): BoxConstraints {
    return { minWidth: width, maxWidth: width, minHeight: height, maxHeight: height };
  }

  // 创建松约束（min = 0）
  static loose(maxWidth: number, maxHeight: number): BoxConstraints {
    return { minWidth: 0, maxWidth, minHeight: 0, maxHeight };
  }

  // 创建无界约束（主要用于测量）
  static unbounded(): BoxConstraints {
    return {
      minWidth: 0,
      maxWidth: Number.POSITIVE_INFINITY,
      minHeight: 0,
      maxHeight: Number.POSITIVE_INFINITY,
    };
  }

  // 限制约束范围（确保 min <= max）
  static constrain(
    constraints: BoxConstraints,
    minW: number,
    maxW: number,
    minH: number,
    maxH: number
  ): BoxConstraints {
    return {
      minWidth: Math.min(maxW, Math.max(minW, constraints.minWidth)),
      maxWidth: Math.max(minW, Math.min(maxW, constraints.maxWidth)),
      minHeight: Math.min(maxH, Math.max(minH, constraints.minHeight)),
      maxHeight: Math.max(minH, Math.min(maxH, constraints.maxHeight)),
    };
  }

  // 判断约束是否有效
  static isValid(constraints: BoxConstraints): boolean {
    return (
      constraints.minWidth <= constraints.maxWidth &&
      constraints.minHeight <= constraints.maxHeight &&
      constraints.minWidth >= 0 &&
      constraints.minHeight >= 0
    );
  }
}
