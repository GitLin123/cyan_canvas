/**
 * Animation - 基础动画值类
 * 表示一个随时间变化的值，范围在 [0, 1] 之间
 */

export type AnimationListener = (value: number) => void;
export type AnimationStatusListener = (status: AnimationStatus) => void;

export enum AnimationStatus {
  Dismissed = 'dismissed', // 动画完成或未开始
  Forward = 'forward', // 动画正在向前播放
  Reverse = 'reverse', // 动画正在反向播放
  Completed = 'completed', // 动画已完成前向播放
}

export class Animation {
  private _value: number = 0;
  private _status: AnimationStatus = AnimationStatus.Dismissed;
  private _listeners: AnimationListener[] = [];
  private _statusListeners: AnimationStatusListener[] = [];

  /**
   * 获取当前动画值 [0, 1]
   */
  public get value(): number {
    return this._value;
  }

  /**
   * 设置动画值
   */
  protected set value(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    if (this._value === clamped) return;
    this._value = clamped;
    this._notifyListeners();
  }

  /**
   * 获取动画状态
   */
  public get status(): AnimationStatus {
    return this._status;
  }

  /**
   * 设置动画状态
   */
  protected set status(s: AnimationStatus) {
    if (this._status === s) return;
    this._status = s;
    this._notifyStatusListeners();
  }

  /**
   * 添加动画值监听器
   */
  public addListener(listener: AnimationListener): void {
    if (!this._listeners.includes(listener)) {
      this._listeners.push(listener);
    }
  }

  /**
   * 移除动画值监听器
   */
  public removeListener(listener: AnimationListener): void {
    const index = this._listeners.indexOf(listener);
    if (index >= 0) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * 添加动画状态监听器
   */
  public addStatusListener(listener: AnimationStatusListener): void {
    if (!this._statusListeners.includes(listener)) {
      this._statusListeners.push(listener);
    }
  }

  /**
   * 移除动画状态监听器
   */
  public removeStatusListener(listener: AnimationStatusListener): void {
    const index = this._statusListeners.indexOf(listener);
    if (index >= 0) {
      this._statusListeners.splice(index, 1);
    }
  }

  /**
   * 通知所有值监听器
   */
  protected _notifyListeners(): void {
    for (const listener of this._listeners) {
      listener(this._value);
    }
  }

  /**
   * 通知所有状态监听器
   */
  protected _notifyStatusListeners(): void {
    for (const listener of this._statusListeners) {
      listener(this._status);
    }
  }

  /**
   * 清空所有监听器
   */
  public dispose(): void {
    this._listeners.length = 0;
    this._statusListeners.length = 0;
  }
}
