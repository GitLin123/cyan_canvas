/**
 * useImplicitAnimation - 隐式动画 Hook
 * 对标 Flutter 的隐式动画
 *
 * 用途：
 * - 自动检测目标值的变化
 * - 自动创建并播放动画
 * - 返回实时的动画值供组件使用
 *
 * 例如：
 * const animatedValue = useImplicitAnimation(targetWidth, { duration: 300 });
 * // 当 targetWidth 改变时，自动创建从当前值到目标值的动画
 */

import { useEffect, useRef, useState } from 'react';
import { AnimationController } from './AnimationController';
import { Tween } from './Tween';
import { Curve } from './Curve';

export interface UseImplicitAnimationOptions {
  duration?: number; // 毫秒，默认 300
  curve?: Curve; // 缓动曲线
  onComplete?: () => void; // 动画完成回调
}

/**
 * 使用隐式动画的通用 Hook
 * @param targetValue - 目标值
 * @param options - 动画选项
 * @returns 当前的动画值
 */
export function useImplicitAnimation<T>(
  targetValue: T,
  options?: UseImplicitAnimationOptions
): T {
  const controllerRef = useRef<AnimationController | null>(null);
  const tweenRef = useRef<Tween<T> | null>(null);
  const [animatedValue, setAnimatedValue] = useState<T>(targetValue);
  const previousValueRef = useRef<T>(targetValue);

  const duration = options?.duration ?? 300;
  const curve = options?.curve;

  useEffect(() => {
    // 如果目标值没有改变，什么都不做
    if (previousValueRef.current === targetValue) {
      return;
    }

    // 初始化控制器
    if (!controllerRef.current) {
      controllerRef.current = new AnimationController({
        duration,
        curve,
      });

      // 监听动画值变化
      controllerRef.current.addListener((t: number) => {
        if (tweenRef.current) {
          const value = tweenRef.current.lerp(t);
          setAnimatedValue(value);
        }
      });

      // 监听动画完成
      controllerRef.current.addStatusListener((status) => {
        if (status === 'completed' && options?.onComplete) {
          options.onComplete();
        }
      });
    } else {
      // 先停止再更新持续时间，避免 "Cannot change duration while running" 错误
      controllerRef.current.reset();
      controllerRef.current.duration = duration;
    }

    // 创建新的 Tween（从当前值到目标值）
    tweenRef.current = new Tween(previousValueRef.current, targetValue);
    previousValueRef.current = targetValue;

    // 重置并播放动画
    controllerRef.current.reset();
    controllerRef.current.forward();

    // 清理函数
    return () => {
      // 不要在这里 dispose，因为组件卸载时可能还在动画中
    };
  }, [targetValue, duration, curve, options?.onComplete]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.dispose();
        controllerRef.current = null;
      }
    };
  }, []);

  return animatedValue;
}

/**
 * 使用隐式数值动画的 Hook
 * @param targetValue - 目标数值
 * @param options - 动画选项
 * @returns 当前的动画值
 */
export function useImplicitNumberAnimation(
  targetValue: number,
  options?: UseImplicitAnimationOptions
): number {
  return useImplicitAnimation<number>(targetValue, options);
}

/**
 * 使用隐式颜色动画的 Hook
 * @param targetColor - 目标颜色（如 "#ff0000"）
 * @param options - 动画选项
 * @returns 当前的动画颜色
 */
export function useImplicitColorAnimation(
  targetColor: string,
  options?: UseImplicitAnimationOptions
): string {
  // 对于颜色，需要使用 ColorTween
  const controllerRef = useRef<AnimationController | null>(null);
  const [animatedColor, setAnimatedColor] = useState<string>(targetColor);
  const previousColorRef = useRef<string>(targetColor);

  const duration = options?.duration ?? 300;
  const curve = options?.curve;

  useEffect(() => {
    if (previousColorRef.current === targetColor) {
      return;
    }

    if (!controllerRef.current) {
      controllerRef.current = new AnimationController({
        duration,
        curve,
      });

      controllerRef.current.addListener((t: number) => {
        const tween = new Tween(previousColorRef.current, targetColor);
        const value = tween.lerp(t);
        setAnimatedColor(value);
      });

      controllerRef.current.addStatusListener((status) => {
        if (status === 'completed' && options?.onComplete) {
          options.onComplete();
        }
      });
    } else {
      controllerRef.current.reset();
      controllerRef.current.duration = duration;
    }

    previousColorRef.current = targetColor;

    controllerRef.current.reset();
    controllerRef.current.forward();
  }, [targetColor, duration, curve, options?.onComplete]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.dispose();
        controllerRef.current = null;
      }
    };
  }, []);

  return animatedColor;
}
