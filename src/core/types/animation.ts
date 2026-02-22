/**
 * 动画系统类型定义
 */

import type { Animation } from '../animation/Animation';

// ==================
// Animation 相关类型
// ==================

export type AnimationListener = (value: number) => void;
export type AnimationStatusListener = (status: AnimationStatus) => void;

export enum AnimationStatus {
  Dismissed = 'dismissed',
  Forward = 'forward',
  Reverse = 'reverse',
  Completed = 'completed',
}

// ==================
// Curve 相关类型
// ==================

export interface Curve {
  /**
   * 将时间值 [0, 1] 转换为曲线值 [0, 1]
   */
  transform(t: number): number;
}

// ==================
// Tween 相关类型
// ==================

export interface Animatable<T> {
  evaluate(animation: { value: number }): T;
  chain(parent: Animatable<number>): Animatable<T>;
}

// ==================
// Hook 相关类型
// ==================

export interface UseAnimationOptions {
  duration?: number;
  reverseDuration?: number;
  curve?: Curve;
  autoStart?: boolean;
}

export interface UseImplicitAnimationOptions {
  duration?: number;
  curve?: Curve;
  onComplete?: () => void;
}

// ==================
// 组件相关类型
// ==================

export interface AnimatedBuilderProps {
  animation: Animation;
  builder: (animationValue: number) => React.ReactNode;
  child?: React.ReactNode;
}
