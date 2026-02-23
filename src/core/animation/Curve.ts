/**
 * Curve - 缓动曲线实现
 * 用于将线性的 [0, 1] 时间映射到非线性的动画值
 */

import type { Curve } from '../types/animation';

export type { Curve };

/**
 * 线性曲线 - 无缓动
 */
export class Linear implements Curve {
  transform(t: number): number {
    return t;
  }
}

/**
 * 缓入 - 开始缓慢
 */
export class EaseIn implements Curve {
  constructor(private curve: Curve = new Cubic(0.42, 0, 1, 1)) {}

  transform(t: number): number {
    return this.curve.transform(t);
  }
}

/**
 * 缓出 - 结束缓慢
 */
export class EaseOut implements Curve {
  constructor(private curve: Curve = new Cubic(0, 0, 0.58, 1)) {}

  transform(t: number): number {
    return this.curve.transform(t);
  }
}

/**
 * 缓入缓出 - 开始和结束缓慢
 */
export class EaseInOut implements Curve {
  constructor(private curve: Curve = new Cubic(0.42, 0, 0.58, 1)) {}

  transform(t: number): number {
    return this.curve.transform(t);
  }
}

/**
 * 三次贝塞尔曲线
 * 参数 (x1, y1, x2, y2) 定义两个控制点，P0=(0,0) P3=(1,1) 固定
 * 与 CSS cubic-bezier() 和 Flutter Cubic 语义一致
 */
export class Cubic implements Curve {
  constructor(
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number
  ) {}

  transform(t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // 用牛顿法 + 二分法从 X 维度求解参数 u，使 bezierX(u) = t
    const u = this._solveCurveX(t);
    // 用 u 算 Y 维度的值
    return this._bezierY(u);
  }

  // X(u) = 3*(1-u)^2*u*x1 + 3*(1-u)*u^2*x2 + u^3
  private _bezierX(u: number): number {
    return ((1 - u) * (1 - u) * 3 * this.x1 + (1 - u) * 3 * this.x2 * u + u * u) * u;
  }

  // Y(u) = 3*(1-u)^2*u*y1 + 3*(1-u)*u^2*y2 + u^3
  private _bezierY(u: number): number {
    return ((1 - u) * (1 - u) * 3 * this.y1 + (1 - u) * 3 * this.y2 * u + u * u) * u;
  }

  // dX/du
  private _bezierXDerivative(u: number): number {
    return 3 * (1 - u) * (1 - u) * this.x1 + 6 * (1 - u) * u * (this.x2 - this.x1) + 3 * u * u * (1 - this.x2);
  }

  private _solveCurveX(x: number): number {
    // 牛顿迭代
    let u = x;
    for (let i = 0; i < 8; i++) {
      const dx = this._bezierX(u) - x;
      if (Math.abs(dx) < 1e-6) return u;
      const d = this._bezierXDerivative(u);
      if (Math.abs(d) < 1e-6) break;
      u -= dx / d;
    }
    // 牛顿法未收敛，退回二分法
    let lo = 0, hi = 1;
    u = x;
    for (let i = 0; i < 20; i++) {
      const dx = this._bezierX(u) - x;
      if (Math.abs(dx) < 1e-6) return u;
      if (dx > 0) hi = u; else lo = u;
      u = (lo + hi) / 2;
    }
    return u;
  }
}

/**
 * 弹性曲线 - 在终点处弹动
 */
export class ElasticOut implements Curve {
  constructor(private period: number = 0.4) {}

  transform(t: number): number {
    if (t === 0 || t === 1) return t;
    const s = (this.period / (2 * Math.PI)) * Math.asin(1);
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / this.period) + 1;
  }
}

/**
 * 回弹曲线 - 在起点处回弹
 */
export class BounceOut implements Curve {
  transform(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    } else {
      t -= 2.625 / 2.75;
      return 7.5625 * t * t + 0.984375;
    }
  }
}

/**
 * 快速开始，缓慢结束
 */
export class FastOutSlowIn implements Curve {
  constructor(private curve: Curve = new Cubic(0.4, 0, 0.2, 1)) {}

  transform(t: number): number {
    return this.curve.transform(t);
  }
}
