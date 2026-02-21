/**
 * 动画系统导出
 * 对标 Flutter 的动画系统
 */

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

// React Hooks
export { useAnimation, useTweenAnimation, useNumberAnimation, useColorAnimation } from './useAnimation';
export type { UseAnimationOptions } from './useAnimation';
