/**
 * Transitions - 转场效果组件
 * 提供常用的转场效果：FadeTransition、ScaleTransition、SlideTransition
 */

import React from 'react';
import { Animation } from './Animation';
import { AnimatedBuilder } from './AnimatedBuilder';
import { Container } from '../adaptor/reconciler/components';
import { ContainerProps } from '../types/node';

/**
 * FadeTransition - 淡入淡出转场
 *
 * 根据动画值改变透明度
 */
export const FadeTransition = React.forwardRef<
  any,
  Omit<ContainerProps, 'opacity'> & {
    animation: Animation;
    children?: React.ReactNode;
  }
>(({ animation, children, ...props }, ref) => (
  <AnimatedBuilder
    animation={animation}
    builder={(value) => (
      <Container ref={ref} opacity={value} {...props}>
        {children}
      </Container>
    )}
  />
));

FadeTransition.displayName = 'FadeTransition';

/**
 * ScaleTransition - 缩放转场
 *
 * 根据动画值改变大小
 * begin 和 end 参数控制缩放的范围（默认 0.0 到 1.0）
 */
export const ScaleTransition = React.forwardRef<
  any,
  Omit<ContainerProps, 'width' | 'height'> & {
    animation: Animation;
    begin?: number; // 起始缩放比例，默认 0
    end?: number; // 结束缩放比例，默认 1
    baseWidth: number; // 基础宽度
    baseHeight: number; // 基础高度
    children?: React.ReactNode;
  }
>(({ animation, begin = 0, end = 1, baseWidth, baseHeight, children, ...props }, ref) => (
  <AnimatedBuilder
    animation={animation}
    builder={(value) => {
      const scale = begin + (end - begin) * value;
      return (
        <Container
          ref={ref}
          width={baseWidth * scale}
          height={baseHeight * scale}
          {...props}
        >
          {children}
        </Container>
      );
    }}
  />
));

ScaleTransition.displayName = 'ScaleTransition';

/**
 * SlideTransition - 滑动转场
 *
 * 根据动画值改变位置
 */
export const SlideTransition = React.forwardRef<
  any,
  Omit<ContainerProps, 'x' | 'y'> & {
    animation: Animation;
    beginOffset?: { x: number; y: number }; // 起始偏移量，默认 { x: 0, y: 0 }
    endOffset?: { x: number; y: number }; // 结束偏移量，默认 { x: 0, y: 0 }
    children?: React.ReactNode;
  }
>(
  (
    {
      animation,
      beginOffset = { x: 0, y: 0 },
      endOffset = { x: 0, y: 0 },
      children,
      ...props
    },
    ref
  ) => (
    <AnimatedBuilder
      animation={animation}
      builder={(value) => {
        const x = beginOffset.x + (endOffset.x - beginOffset.x) * value;
        const y = beginOffset.y + (endOffset.y - beginOffset.y) * value;
        return (
          <Container ref={ref} x={x} y={y} {...props}>
            {children}
          </Container>
        );
      }}
    />
  )
);

SlideTransition.displayName = 'SlideTransition';

/**
 * ColorTransition - 颜色转场
 *
 * 根据动画值改变颜色
 */
export const ColorTransition = React.forwardRef<
  any,
  Omit<ContainerProps, 'color'> & {
    animation: Animation;
    beginColor: string;
    endColor: string;
    children?: React.ReactNode;
  }
>(({ animation, beginColor, endColor, children, ...props }, ref) => {
  const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace('#', '').substring(0, 6);
    return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
  };

  return (
    <AnimatedBuilder
      animation={animation}
      builder={(value) => {
        const [r1, g1, b1] = hexToRgb(beginColor);
        const [r2, g2, b2] = hexToRgb(endColor);

        const r = Math.round(r1 + (r2 - r1) * value);
        const g = Math.round(g1 + (g2 - g1) * value);
        const b = Math.round(b1 + (b2 - b1) * value);

        const color = `rgb(${r}, ${g}, ${b})`;

        return (
          <Container ref={ref} color={color} {...props}>
            {children}
          </Container>
        );
      }}
    />
  );
});

ColorTransition.displayName = 'ColorTransition';
