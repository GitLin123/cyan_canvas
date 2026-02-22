/**
 * AnimationController - 动画控制器
 * 用于控制动画的播放、停止、反向等操作
 */

import { Animation, AnimationStatus, AnimationListener, AnimationStatusListener } from './Animation';
import { Curve, Linear } from './Curve';

export class AnimationController extends Animation {
  private _duration: number = 0; // 毫秒
  private _reverseDuration: number | null = null;
  private _curve: Curve = new Linear();
  private _currentTime: number = 0; // 毫秒
  private _isRunning: boolean = false;
  private _animationFrameId: number | null = null;
  private _lastFrameTime: number = 0;

  constructor(options?: {
    duration?: number; // 毫秒
    reverseDuration?: number;
    value?: number;
    curve?: Curve;
  }) {
    super();
    this._duration = options?.duration ?? 300;
    this._reverseDuration = options?.reverseDuration ?? null;
    this._curve = options?.curve ?? new Linear();
    if (options?.value !== undefined) {
      (this as any).value = options.value;
    }
  }

  /**
   * 获取持续时间（毫秒）
   */
  public get duration(): number {
    return this._duration;
  }

  /**
   * 设置持续时间
   */
  public set duration(ms: number) {
    if (this._isRunning) {
      throw new Error('Cannot change duration while animation is running');
    }
    this._duration = ms;
  }

  /**
   * 获取当前所处的时间（毫秒）
   */
  public get currentTime(): number {
    return this._currentTime;
  }

  /**
   * 前向播放动画
   */
  public forward(from?: number): Promise<void> {
    if (from !== undefined) {
      this._currentTime = from;
      (this as any).value = this._evaluateCurve();
    }
    return this._play('forward');
  }

  /**
   * 反向播放动画
   */
  public reverse(from?: number): Promise<void> {
    if (from !== undefined) {
      this._currentTime = from;
      (this as any).value = this._evaluateCurve();
    }
    return this._play('reverse');
  }

  /**
   * 停止动画
   */
  public stop(canceled: boolean = false): void {
    if (!this._isRunning) return;

    this._isRunning = false;
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    if (!canceled) {
      // 完成状态
      if ((this as any).status === AnimationStatus.Forward) {
        (this as any).status = AnimationStatus.Completed;
      }
    }
  }

  /**
   * 重置动画到起始状态
   */
  public reset(): void {
    this.stop(true);
    this._currentTime = 0;
    (this as any).value = 0;
    (this as any).status = AnimationStatus.Dismissed;
  }

  /**
   * 重复播放动画
   */
  public repeat(count: number = 1): Promise<void> {
    let remaining = count;
    return new Promise((resolve) => {
      const loop = () => {
        this.forward().then(() => {
          remaining--;
          if (remaining > 0) {
            this.reset();
            loop();
          } else {
            resolve();
          }
        });
      };
      loop();
    });
  }

  /**
   * 往复动画
   */
  async oscillate(count: number = 1): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.forward();
      await this.reverse();
    }
  }

  /**
   * 私有：播放动画
   */
  private _play(direction: 'forward' | 'reverse'): Promise<void> {
    if (this._isRunning) return Promise.resolve();

    this._isRunning = true;
    (this as any).status = direction === 'forward' ? AnimationStatus.Forward : AnimationStatus.Reverse;

    return new Promise((resolve) => {
      this._lastFrameTime = performance.now();
      const animate = () => {
        const now = performance.now();
        const elapsed = now - this._lastFrameTime;
        this._lastFrameTime = now;

        if (direction === 'forward') {
          this._currentTime += elapsed;
          if (this._currentTime >= this._duration) {
            this._currentTime = this._duration;
            (this as any).value = 1;
            this._isRunning = false;
            (this as any).status = AnimationStatus.Completed;
            resolve();
            return;
          }
        } else {
          this._currentTime -= elapsed;
          if (this._currentTime <= 0) {
            this._currentTime = 0;
            (this as any).value = 0;
            this._isRunning = false;
            (this as any).status = AnimationStatus.Dismissed;
            resolve();
            return;
          }
        }

        (this as any).value = this._evaluateCurve();
        this._animationFrameId = requestAnimationFrame(animate);
      };

      this._animationFrameId = requestAnimationFrame(animate);
    });
  }

  /**
   * 计算曲线后的动画值
   */
  private _evaluateCurve(): number {
    const t = this._currentTime / this._duration;
    const clamped = Math.max(0, Math.min(1, t));
    return this._curve.transform(clamped);
  }

  /**
   * 销毁控制器，清理资源
   */
  override dispose(): void {
    this.stop(true);
    super.dispose();
  }
}
