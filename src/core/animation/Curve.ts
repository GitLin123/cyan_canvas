/**
 * Curve - 缓动曲线接口
 * 用于将线性的 [0, 1] 时间映射到非线性的动画值
 * 对标 Flutter 的 Curve
 */

export interface Curve {
  /**
   * 将时间值 [0, 1] 转换为曲线值 [0, 1]
   * @param t - 时间值，范围 [0, 1]
   * @returns 曲线值，范围通常为 [0, 1]
   */
  transform(t: number): number;
}

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
 */
export class Cubic implements Curve {
  constructor(
    private a: number,
    private b: number,
    private c: number,
    private d: number
  ) {}

  transform(t: number): number {
    return this.cubicBezier(t, this.a, this.b, this.c, this.d);
  }

  private cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    // 使用牛顿法求解三次贝塞尔曲线
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    // B(t) = (1-t)^3 * P0 + 3 * (1-t)^2 * t * P1 + 3 * (1-t) * t^2 * P2 + t^3 * P3
    const result = mt2 * mt * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t2 * t * p3;
    return Math.max(0, Math.min(1, result));
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
