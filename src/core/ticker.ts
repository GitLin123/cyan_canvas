/**
 * 渲染循环类，用于管理循环回调的注册与执行
*/
type TickerCallback = (elapsed: number, delta: number) => void;
export class Ticker {
  private _lastTime: number = 0;
  private _startTime: number = 0;
  private _active: boolean = false;
  private _callbacks: Set<TickerCallback> = new Set();
  private _rafId: number | null = null;

  // --- FPS 统计相关变量 ---
  private _fps: number = 0;
  private _frameCount: number = 0;
  private _lastFpsUpdateTime: number = 0;

  /**
   * 获取当前实时 FPS (每 500ms 更新一次)
   */
  public getFPS(): number {
    return this._fps;
  }

  add(callback: TickerCallback) {
    this._callbacks.add(callback);
  }

  remove(callback: TickerCallback) {
    this._callbacks.delete(callback);
  }

  start() {
    if (this._active) return;
    this._active = true;
    this._startTime = performance.now();
    this._lastTime = this._startTime;
    this._lastFpsUpdateTime = this._startTime; // 初始化统计时间
    this._tick();
  }

  stop() {
    this._active = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  private _tick = () => {
    if (!this._active) return;
    
    const currentTime = performance.now();
    const elapsed = currentTime - this._startTime;
    const delta = currentTime - this._lastTime;

    this._lastTime = currentTime;

    // FPS 统计
    this._frameCount++;
    // 每 500ms 计算一次平均值
    if (currentTime - this._lastFpsUpdateTime >= 500) {
      this._fps = Math.round(
        (this._frameCount * 1000) / (currentTime - this._lastFpsUpdateTime)
      );
      this._frameCount = 0;
      this._lastFpsUpdateTime = currentTime;
    }

    for (const callback of this._callbacks) {
      callback(elapsed, delta);
    }

    this._rafId = requestAnimationFrame(this._tick);
  };
}