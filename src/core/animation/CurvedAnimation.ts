/**
 * CurvedAnimation - 为另一个动画应用曲线变换
 * 对标 Flutter 的 CurvedAnimation
 *
 * 用途：
 * - 为已有的 Animation 应用缓动曲线
 * - 支持正向和反向使用不同的曲线
 * - 实现动画的组合和嵌套
 */

import { Animation, AnimationStatus, AnimationListener, AnimationStatusListener } from './Animation';
import { Curve, Linear } from './Curve';

export class CurvedAnimation extends Animation {
  private _parentAnimation: Animation;
  private _curve: Curve;
  private _reverseCurve: Curve | null;

  private _parentListener: AnimationListener;
  private _parentStatusListener: AnimationStatusListener;

  /**
   * 创建一个应用曲线的动画
   * @param parent - 父动画
   * @param curve - 前向时使用的曲线
   * @param reverseCurve - 反向时使用的曲线（可选，默认与 curve 相同）
   */
  constructor(parent: Animation, curve: Curve, reverseCurve?: Curve) {
    super();
    this._parentAnimation = parent;
    this._curve = curve;
    this._reverseCurve = reverseCurve ?? null;

    // 监听父动画的值变化
    this._parentListener = (value: number) => {
      this._updateValue();
    };
    this._parentAnimation.addListener(this._parentListener);

    // 监听父动画的状态变化
    this._parentStatusListener = (status: AnimationStatus) => {
      (this as any).status = status;
    };
    this._parentAnimation.addStatusListener(this._parentStatusListener);

    // 初始化值
    this._updateValue();
  }

  /**
   * 根据父动画值和曲线计算新值
   */
  private _updateValue(): void {
    const parentValue = this._parentAnimation.value;
    const parentStatus = this._parentAnimation.status;

    // 根据方向选择曲线
    const curve = this._shouldUseReverseCurve() ? (this._reverseCurve || this._curve) : this._curve;

    // 应用曲线变换
    const newValue = curve.transform(parentValue);

    // 更新值（通过 setter）
    (this as any).value = newValue;
  }

  /**
   * 判断是否应该使用反向曲线
   */
  private _shouldUseReverseCurve(): boolean {
    if (!this._reverseCurve) return false;
    const status = this._parentAnimation.status;
    return status === AnimationStatus.Reverse;
  }

  /**
   * 获取父动画
   */
  public get parent(): Animation {
    return this._parentAnimation;
  }

  /**
   * 销毁动画，移除监听器
   */
  override dispose(): void {
    this._parentAnimation.removeListener(this._parentListener);
    this._parentAnimation.removeStatusListener(this._parentStatusListener);
    super.dispose();
  }
}
