/**
 * Tween - 值插值器
 * 用于在两个值之间进行线性插值
 */

import type { Animatable } from '../types/animation';

export type { Animatable };

/**
 * 数值 Tween
 */
export class Tween<T = number> implements Animatable<T> {
  constructor(
    public begin: T,
    public end: T
  ) {}

  /**
   * 根据动画值进行插值
   */
  public evaluate(animation: { value: number }): T {
    return this.lerp(animation.value);
  }

  /**
   * 线性插值
   */
  public lerp(t: number): T {
    if (this.begin === this.end) {
      return this.begin;
    }

    if (typeof this.begin === 'number' && typeof this.end === 'number') {
      return (this.begin + (this.end - this.begin) * t) as T;
    }

    if (typeof this.begin === 'string' && typeof this.end === 'string') {
      // 颜色字符串插值 (简单实现)
      return this.begin as T;
    }

    return this.begin;
  }

  /**
   * 链接另一个 Animatable
   */
  public chain(parent: Animatable<number>): Animatable<T> {
    return new ChainingAnimatable(this, parent);
  }
}

/**
 * 颜色 Tween
 */
export class ColorTween extends Tween<string> {
  constructor(begin: string, end: string) {
    super(begin, end);
  }

  override lerp(t: number): string {
    const c1 = this.hexToRgb(this.begin);
    const c2 = this.hexToRgb(this.end);

    if (!c1 || !c2) return this.begin;

    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);

    return `rgb(${r}, ${g}, ${b})`;
  }

  private hexToRgb(hex: string): [number, number, number] | null {
    // 移除 # 符号
    const h = hex.replace('#', '').substring(0, 6);
    return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
  }
}

/**
 * 链接 Animatable
 */
export class ChainingAnimatable<T> implements Animatable<T> {
  constructor(
    private tween: Animatable<T>,
    private parent: Animatable<number>
  ) {}

  evaluate(animation: { value: number }): T {
    const parentValue = this.parent.evaluate(animation);
    return this.tween.evaluate({ value: parentValue });
  }

  chain(parent: Animatable<number>): Animatable<T> {
    return new ChainingAnimatable(this, parent);
  }
}

/**
 * 对象 Tween - 用于动画化对象属性
 */
export class ObjectTween<T extends Record<string, number>> extends Tween<T> {
  constructor(begin: T, end: T) {
    super(begin, end);
  }

  override lerp(t: number): T {
    const result = {} as T;
    for (const key in this.begin) {
      const beginValue = this.begin[key] as number;
      const endValue = this.end[key] as number;
      (result as Record<string, number>)[key] = beginValue + (endValue - beginValue) * t;
    }
    return result;
  }
}
