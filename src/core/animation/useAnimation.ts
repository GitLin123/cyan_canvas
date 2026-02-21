/**
 * useAnimation - React Hook for animation
 * 简化在 React 中使用动画的方式
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimationController } from './AnimationController';
import { Curve } from './Curve';
import { Tween, Animatable, ColorTween } from './Tween';

export interface UseAnimationOptions {
  duration?: number;
  reverseDuration?: number;
  curve?: Curve;
  autoStart?: boolean;
}

/**
 * 使用动画的 Hook
 * @param options 动画选项
 * @returns { controller, value }
 */
export function useAnimation(options?: UseAnimationOptions) {
  const controllerRef = useRef<AnimationController | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!controllerRef.current) {
      controllerRef.current = new AnimationController({
        duration: options?.duration,
        reverseDuration: options?.reverseDuration,
        curve: options?.curve,
      });

      // 监听动画值变化
      controllerRef.current.addListener((v) => {
        setValue(v);
      });

      // 自动开始
      if (options?.autoStart !== false) {
        controllerRef.current.forward();
      }
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.dispose();
        controllerRef.current = null;
      }
    };
  }, []);

  return {
    controller: controllerRef.current!,
    value,
  };
}

/**
 * 使用补间动画的 Hook
 * @param begin 起始值
 * @param end 结束值
 * @param options 动画选项
 * @returns { controller, animatedValue }
 */
export function useTweenAnimation<T>(begin: T, end: T, options?: UseAnimationOptions & { tween?: Tween<T> }) {
  const { controller, value } = useAnimation(options);
  const tweenRef = useRef<Tween<T>>(options?.tween ?? new Tween(begin, end));

  const animatedValue = tweenRef.current.lerp(value);

  return {
    controller,
    animatedValue,
    value, // 原始的 [0, 1] 值
  };
}

/**
 * 使用数值动画的 Hook
 * @param begin 起始数值
 * @param end 结束数值
 * @param options 动画选项
 * @returns { controller, animatedValue }
 */
export function useNumberAnimation(begin: number, end: number, options?: UseAnimationOptions) {
  const { controller, animatedValue } = useTweenAnimation(begin, end, { ...options });

  return {
    controller,
    animatedValue: animatedValue as number,
  };
}

/**
 * 使用颜色动画的 Hook
 * @param beginColor 起始颜色 (如 "#ff0000")
 * @param endColor 结束颜色
 * @param options 动画选项
 * @returns { controller, animatedColor }
 */
export function useColorAnimation(beginColor: string, endColor: string, options?: UseAnimationOptions) {
  const { controller, animatedValue } = useTweenAnimation(beginColor, endColor, {
    ...options,
    tween: new ColorTween(beginColor, endColor),
  });

  return {
    controller,
    animatedColor: animatedValue as string,
  };
}
