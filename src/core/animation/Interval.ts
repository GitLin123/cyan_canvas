/**
 * Interval - 时间间隔曲线
 * 对标 Flutter 的 Interval
 *
 * 用途：
 * - 将完整时间线的一部分映射为 [0, 1] 的动画区间
 * - 实现序列动画和交错动画的关键
 *
 * 例如：Interval(0.0, 0.5) 表示在前 50% 的时间内运行动画
 *      Interval(0.5, 1.0) 表示在后 50% 的时间内运行动画
 */

import { Curve } from './Curve';

export class Interval implements Curve {
  private _begin: number;
  private _end: number;
  private _curve: Curve;

  /**
   * 创建一个时间间隔曲线
   * @param begin - 开始时间 [0, 1]
   * @param end - 结束时间 [0, 1]
   * @param curve - 应用在间隔内的曲线（可选，默认线性）
   */
  constructor(begin: number, end: number, curve?: Curve) {
    if (begin < 0 || begin > 1) {
      throw new Error(`Interval begin must be between 0 and 1, got ${begin}`);
    }
    if (end < 0 || end > 1) {
      throw new Error(`Interval end must be between 0 and 1, got ${end}`);
    }
    if (begin >= end) {
      throw new Error(`Interval begin must be less than end, got begin=${begin}, end=${end}`);
    }

    this._begin = begin;
    this._end = end;
    this._curve = curve || { transform: (t: number) => t }; // 默认线性
  }

  /**
   * 将全局时间 t [0, 1] 映射到局部区间 [0, 1]
   * @param t - 全局时间 [0, 1]
   * @returns 局部动画值 [0, 1]
   */
  public transform(t: number): number {
    // 如果时间在间隔前，返回 0
    if (t < this._begin) {
      return 0;
    }

    // 如果时间在间隔后，返回 1
    if (t > this._end) {
      return 1;
    }

    // 将全局时间映射到局部 [0, 1]
    const localTime = (t - this._begin) / (this._end - this._begin);

    // 应用曲线变换
    return this._curve.transform(localTime);
  }

  /**
   * 获取间隔的开始时间
   */
  public get begin(): number {
    return this._begin;
  }

  /**
   * 获取间隔的结束时间
   */
  public get end(): number {
    return this._end;
  }

  /**
   * 获取间隔的持续时间
   */
  public get duration(): number {
    return this._end - this._begin;
  }
}
