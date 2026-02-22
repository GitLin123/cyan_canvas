/**
 * Curves - 预定义的缓动曲线集合
 */

import { Linear, EaseIn, EaseOut, EaseInOut, Cubic, ElasticOut, BounceOut, FastOutSlowIn, Curve } from './Curve';

export class Curves {
  // ==================
  // 基础曲线
  // ==================

  /** 线性 - 无缓动 */
  static linear: Curve = new Linear();

  // ==================
  // 缓出曲线（推荐用于打开/显示）
  // ==================

  /** 缓出 - 标准快速开始 */
  static easeOut: Curve = new EaseOut();

  /** 快速开始，缓慢结束 */
  static fastOutSlowIn: Curve = new FastOutSlowIn();

  /** 回弹效果 */
  static bounceOut: Curve = new BounceOut();

  /** 弹性效果 */
  static elasticOut: Curve = new ElasticOut();

  // ==================
  // 缓入曲线
  // ==================

  /** 缓入 - 开始缓慢 */
  static easeIn: Curve = new EaseIn();

  // ==================
  // 缓入缓出曲线（推荐用于持续时间较长的动画）
  // ==================

  /** 缓入缓出 - 标准平滑 */
  static easeInOut: Curve = new EaseInOut();

  // ==================
  // 自定义贝塞尔曲线
  // ==================

  /** 快速 - 快速加速和减速 */
  static get fast(): Curve {
    return new Cubic(0.4, 0.0, 0.2, 1.0);
  }

  /** 缓慢 - 缓慢加速和减速 */
  static get slow(): Curve {
    return new Cubic(0.4, 0.0, 0.6, 1.0);
  }

  /** 材料设计：标准（推荐用于微交互）*/
  static get decelerate(): Curve {
    return new Cubic(0.0, 0.0, 0.2, 1.0);
  }

  /** 材料设计：加速 */
  static get accelerate(): Curve {
    return new Cubic(0.4, 0.0, 1.0, 1.0);
  }

  /** CubicBezier - 自定义参数 */
  static cubicBezier(a: number, b: number, c: number, d: number): Curve {
    return new Cubic(a, b, c, d);
  }
}
