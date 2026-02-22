/**
 * 动画系统导出
 * 对标 Flutter 的动画系统
 */

// ==================
// 基础动画类
// ==================

// Animation 和相关类型
export { Animation, AnimationStatus } from './Animation';
export type { AnimationListener, AnimationStatusListener } from './Animation';

// Curve - 缓动曲线
export { Linear, EaseIn, EaseOut, EaseInOut, Cubic, ElasticOut, BounceOut, FastOutSlowIn } from './Curve';
export type { Curve } from './Curve';

// Curves - 预定义曲线
export { Curves } from './Curves';

// Tween - 值插值
export { Tween, ColorTween, ObjectTween, ChainingAnimatable } from './Tween';
export type { Animatable } from './Tween';

// AnimationController - 动画控制器
export { AnimationController } from './AnimationController';

// ==================
// 第一阶段：组合动画
// ==================

// CurvedAnimation - 应用曲线的动画
export { CurvedAnimation } from './CurvedAnimation';

// Interval - 时间间隔曲线
export { Interval } from './Interval';

// CompositeAnimation - 序列和交错动画
export { SequenceAnimation, StaggerAnimation } from './CompositeAnimation';

// ==================
// 第二阶段：隐式动画
// ==================

// useImplicitAnimation - 隐式动画 Hooks
export { useImplicitAnimation, useImplicitNumberAnimation, useImplicitColorAnimation } from './useImplicitAnimation';
export type { UseImplicitAnimationOptions } from './useImplicitAnimation';

// AnimatedComponents - 隐式动画组件
export { AnimatedContainer, AnimatedOpacity, AnimatedPositioned } from './components/AnimatedComponents';

// ==================
// 第三阶段：高级动画
// ==================

// AnimatedBuilder - 动画构建器
export { AnimatedBuilder } from './AnimatedBuilder';
export type { AnimatedBuilderProps } from './AnimatedBuilder';

// useCompositeAnimation - 组合动画 Hooks
export { useSequenceAnimation, useStaggerAnimation } from './useCompositeAnimation';

// Transitions - 转场效果
export { FadeTransition, ScaleTransition, SlideTransition, ColorTransition } from './components/Transitions';

// ==================
// 显式动画 Hooks（现有）
// ==================

// React Hooks
export { useAnimation, useTweenAnimation, useNumberAnimation, useColorAnimation } from './useAnimation';
export type { UseAnimationOptions } from './useAnimation';
