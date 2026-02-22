/**
 * CompositeAnimation - 组合动画
 * 对标 Flutter 的组合动画系统
 *
 * 包含两个核心类：
 * - SequenceAnimation: 序列动画，多个动画依次执行
 * - StaggerAnimation: 交错动画，多个动画以错开的时间执行
 */

import { Animation, AnimationStatus } from './Animation';
import { AnimationController } from './AnimationController';
import { Interval } from './Interval';
import { Curve } from './Curve';

/**
 * 序列动画 - 多个动画按顺序依次播放
 *
 * 例如：三个动画，每个持续 200ms
 * - 动画1: 0-200ms
 * - 动画2: 200-400ms
 * - 动画3: 400-600ms
 * 总持续时间自动计算为 600ms
 */
export class SequenceAnimation {
  private _animations: Animation[] = [];
  private _intervals: Interval[] = [];
  private _controller: AnimationController;
  private _totalDuration: number = 0;

  /**
   * 创建序列动画
   * @param animations - 要序列执行的动画列表
   * @param options - 配置选项
   */
  constructor(
    animations: Array<{ animation: Animation; duration: number; curve?: Curve }>,
    options?: {
      startDelay?: number; // 开始前的延迟时间（毫秒）
    }
  ) {
    if (animations.length === 0) {
      throw new Error('SequenceAnimation requires at least one animation');
    }

    const startDelay = options?.startDelay ?? 0;
    let currentTime = startDelay;

    // 为每个动画创建 Interval
    for (const item of animations) {
      const duration = item.duration;
      const begin = currentTime;
      const end = currentTime + duration;

      // 标准化为 [0, 1]
      this._totalDuration = Math.max(this._totalDuration, end);
      currentTime = end;
    }

    // 创建总体动画控制器
    this._controller = new AnimationController({
      duration: this._totalDuration,
    });

    // 为每个动画配置 Interval
    currentTime = startDelay;
    for (const item of animations) {
      const duration = item.duration;
      const begin = currentTime / this._totalDuration;
      const end = (currentTime + duration) / this._totalDuration;

      const interval = new Interval(begin, end, item.curve);
      this._intervals.push(interval);
      this._animations.push(item.animation);

      currentTime += duration;
    }

    // 绑定控制器到各个动画
    this._controller.addListener((value: number) => {
      for (let i = 0; i < this._animations.length; i++) {
        const mappedValue = this._intervals[i].transform(value);
        (this._animations[i] as any).value = mappedValue;
      }
    });

    this._controller.addStatusListener((status: AnimationStatus) => {
      for (const anim of this._animations) {
        (anim as any).status = status;
      }
    });
  }

  /**
   * 播放序列动画
   */
  public play(): Promise<void> {
    return this._controller.forward();
  }

  /**
   * 暂停序列动画
   */
  public pause(): void {
    this._controller.stop();
  }

  /**
   * 重置序列动画
   */
  public reset(): void {
    this._controller.reset();
  }

  /**
   * 反向播放
   */
  public reverse(): Promise<void> {
    return this._controller.reverse();
  }

  /**
   * 获取指定索引的动画值
   */
  public getValue(index: number): number {
    if (index < 0 || index >= this._animations.length) {
      throw new Error(`Invalid animation index: ${index}`);
    }
    return this._animations[index].value;
  }

  /**
   * 获取总持续时间
   */
  public get duration(): number {
    return this._totalDuration;
  }

  /**
   * 获取控制器
   */
  public get controller(): AnimationController {
    return this._controller;
  }

  /**
   * 销毁序列动画
   */
  public dispose(): void {
    this._controller.dispose();
    for (const anim of this._animations) {
      anim.dispose();
    }
    this._animations = [];
    this._intervals = [];
  }
}

/**
 * 交错动画 - 多个动画以错开的时间开始执行
 *
 * 例如：三个动画，延迟分别为 0ms、100ms、200ms
 * - 动画1: 0-800ms
 * - 动画2: 100-900ms（延迟 100ms）
 * - 动画3: 200-1000ms（延迟 200ms）
 */
export class StaggerAnimation {
  private _animations: Animation[] = [];
  private _intervals: Interval[] = [];
  private _controller: AnimationController;
  private _totalDuration: number = 0;

  /**
   * 创建交错动画
   * @param animations - 要交错执行的动画列表
   * @param options - 配置选项
   */
  constructor(
    animations: Array<{ animation: Animation; duration: number; delay?: number; curve?: Curve }>,
    options?: {
      totalDuration?: number; // 指定总时长（ms），如果不指定则自动计算
    }
  ) {
    if (animations.length === 0) {
      throw new Error('StaggerAnimation requires at least one animation');
    }

    // 计算总时长
    let calculatedTotalDuration = 0;
    for (const item of animations) {
      const delay = item.delay ?? 0;
      const endTime = delay + item.duration;
      calculatedTotalDuration = Math.max(calculatedTotalDuration, endTime);
    }

    this._totalDuration = options?.totalDuration ?? calculatedTotalDuration;

    // 创建总体动画控制器
    this._controller = new AnimationController({
      duration: this._totalDuration,
    });

    // 为每个动画配置 Interval
    for (const item of animations) {
      const delay = item.delay ?? 0;
      const duration = item.duration;
      const begin = delay / this._totalDuration;
      const end = (delay + duration) / this._totalDuration;

      const interval = new Interval(begin, end, item.curve);
      this._intervals.push(interval);
      this._animations.push(item.animation);
    }

    // 绑定控制器到各个动画
    this._controller.addListener((value: number) => {
      for (let i = 0; i < this._animations.length; i++) {
        const mappedValue = this._intervals[i].transform(value);
        (this._animations[i] as any).value = mappedValue;
      }
    });

    this._controller.addStatusListener((status: AnimationStatus) => {
      for (const anim of this._animations) {
        (anim as any).status = status;
      }
    });
  }

  /**
   * 播放交错动画
   */
  public play(): Promise<void> {
    return this._controller.forward();
  }

  /**
   * 暂停交错动画
   */
  public pause(): void {
    this._controller.stop();
  }

  /**
   * 重置交错动画
   */
  public reset(): void {
    this._controller.reset();
  }

  /**
   * 反向播放
   */
  public reverse(): Promise<void> {
    return this._controller.reverse();
  }

  /**
   * 获取指定索引的动画
   */
  public getAnimation(index: number): Animation {
    if (index < 0 || index >= this._animations.length) {
      throw new Error(`Invalid animation index: ${index}`);
    }
    return this._animations[index];
  }

  /**
   * 获取指定索引的动画值
   */
  public getValue(index: number): number {
    return this.getAnimation(index).value;
  }

  /**
   * 获取总持续时间
   */
  public get duration(): number {
    return this._totalDuration;
  }

  /**
   * 获取控制器
   */
  public get controller(): AnimationController {
    return this._controller;
  }

  /**
   * 销毁交错动画
   */
  public dispose(): void {
    this._controller.dispose();
    for (const anim of this._animations) {
      anim.dispose();
    }
    this._animations = [];
    this._intervals = [];
  }
}
