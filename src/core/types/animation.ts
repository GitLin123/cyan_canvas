/**
 * 动画系统类型定义
 */

import type { Animation } from '../animation/Animation';

// ==================
// Animation 相关类型
// ==================
// 动画值监听器和状态监听器类型定义 区别是前者监听动画值变化，后者监听动画状态变化
export type AnimationListener = (value: number) => void; // 动画值变化监听器
export type AnimationStatusListener = (status: AnimationStatus) => void; // 动画状态变化监听器

export enum AnimationStatus {
  Dismissed = 'dismissed', // 动画未开始，值为 0
  Forward = 'forward', // 动画正在进行中，值在 (0, 1) 之间
  Reverse = 'reverse', // 动画正在反向进行中，值在 (0, 1) 之间
  Completed = 'completed', // 动画已完成，值为 1
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
