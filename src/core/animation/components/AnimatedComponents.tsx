/**
 * AnimatedComponents - 隐式动画组件
 * 对标 Flutter 的 AnimatedContainer、AnimatedOpacity、AnimatedPositioned
 *
 * 这些组件会自动监听 prop 的变化并执行动画
 */

import React from 'react';
import { Container, Rect, Stack } from '../adaptor/reconciler/components';
import { useImplicitNumberAnimation, useImplicitColorAnimation, UseImplicitAnimationOptions } from './useImplicitAnimation';
import { ContainerProps } from '../types/node';

/**
 * AnimatedContainer - 自动动画化容器属性
 *
 * 支持动画化的属性：
 * - width
 * - height
 * - color (背景颜色)
 * - borderRadius
 * - opacity
 * - x, y (位置)
 *
 * 当这些属性发生变化时，会自动执行平滑动画
 */
export const AnimatedContainer = React.forwardRef<
  any,
  Omit<ContainerProps, 'width' | 'height' | 'color' | 'borderRadius' | 'opacity'> & {
    width?: number;
    height?: number;
    color?: string;
    borderRadius?: number;
    opacity?: number;
    animationDuration?: number;
    animationCurve?: any; // Curve 类型
    onAnimationComplete?: () => void;
    children?: React.ReactNode;
  }
>((props, ref) => {
  const {
    width = 100,
    height = 100,
    color = '#fff',
    borderRadius = 0,
    opacity = 1,
    animationDuration = 300,
    animationCurve,
    onAnimationComplete,
    children,
    ...restProps
  } = props;

  // 使用隐式动画跟踪各个属性
  const animatedWidth = useImplicitNumberAnimation(width, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedHeight = useImplicitNumberAnimation(height, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedColor = useImplicitColorAnimation(color, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedBorderRadius = useImplicitNumberAnimation(borderRadius, {
    duration: animationDuration,
    curve: animationCurve,
    onComplete: onAnimationComplete,
  });

  const animatedOpacity = useImplicitNumberAnimation(opacity, {
    duration: animationDuration,
    curve: animationCurve,
  });

  return (
    <Container
      ref={ref}
      width={animatedWidth}
      height={animatedHeight}
      color={animatedColor}
      borderRadius={animatedBorderRadius}
      opacity={animatedOpacity}
      {...restProps}
    >
      {children}
    </Container>
  );
});

AnimatedContainer.displayName = 'AnimatedContainer';

/**
 * AnimatedOpacity - 自动动画化透明度
 *
 * 当 opacity prop 发生变化时，会自动执行平滑的透明度动画
 */
export const AnimatedOpacity = React.forwardRef<
  any,
  Omit<ContainerProps, 'opacity'> & {
    opacity?: number;
    animationDuration?: number;
    animationCurve?: any;
    onAnimationComplete?: () => void;
    children?: React.ReactNode;
  }
>((props, ref) => {
  const {
    opacity = 1,
    animationDuration = 300,
    animationCurve,
    onAnimationComplete,
    children,
    ...restProps
  } = props;

  const animatedOpacity = useImplicitNumberAnimation(opacity, {
    duration: animationDuration,
    curve: animationCurve,
    onComplete: onAnimationComplete,
  });

  return (
    <Container ref={ref} opacity={animatedOpacity} {...restProps}>
      {children}
    </Container>
  );
});

AnimatedOpacity.displayName = 'AnimatedOpacity';

/**
 * AnimatedPositioned - 自动动画化位置
 *
 * 当 x, y, width, height 属性发生变化时，会自动执行平滑的移动和缩放动画
 * 通常与 Stack 组件一起使用
 */
export const AnimatedPositioned = React.forwardRef<
  any,
  Omit<ContainerProps, 'x' | 'y' | 'width' | 'height'> & {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    animationDuration?: number;
    animationCurve?: any;
    onAnimationComplete?: () => void;
    children?: React.ReactNode;
  }
>((props, ref) => {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    animationDuration = 300,
    animationCurve,
    onAnimationComplete,
    children,
    ...restProps
  } = props;

  const animatedX = useImplicitNumberAnimation(x, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedY = useImplicitNumberAnimation(y, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedWidth = useImplicitNumberAnimation(width, {
    duration: animationDuration,
    curve: animationCurve,
  });

  const animatedHeight = useImplicitNumberAnimation(height, {
    duration: animationDuration,
    curve: animationCurve,
    onComplete: onAnimationComplete,
  });

  return (
    <Container
      ref={ref}
      x={animatedX}
      y={animatedY}
      width={animatedWidth}
      height={animatedHeight}
      {...restProps}
    >
      {children}
    </Container>
  );
});

AnimatedPositioned.displayName = 'AnimatedPositioned';
