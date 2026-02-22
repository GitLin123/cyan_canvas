/**
 * AnimatedBuilder - 动画构建器
 *
 * 用途：
 * - 在动画值变化时重建子组件
 * - 提供更细粒度的动画控制
 * - 用于创建自定义动画效果
 */

import React, { useEffect, useState } from 'react';
import type { AnimationListener, AnimatedBuilderProps } from '../types/animation';

export type { AnimatedBuilderProps };

/**
 * AnimatedBuilder - 监听动画值变化并重建
 *
 * 例子：
 * <AnimatedBuilder
 *   animation={controller}
 *   builder={(value) => (
 *     <Rect width={100 * value} height={100 * value} color="#ff0000" />
 *   )}
 * />
 */
export const AnimatedBuilder: React.FC<AnimatedBuilderProps> = ({ animation, builder, child }) => {
  const [value, setValue] = useState(animation.value);

  useEffect(() => {
    // 监听动画值变化
    const listener: AnimationListener = (newValue: number) => {
      setValue(newValue);
    };

    animation.addListener(listener);

    return () => {
      animation.removeListener(listener);
    };
  }, [animation]);

  return (
    <>
      {builder(value)}
      {child}
    </>
  );
};

AnimatedBuilder.displayName = 'AnimatedBuilder';
