/**
 * 企业级性能监控系统
 * 支持实时监控、历史数据、性能分析、可视化
 */

export enum MonitorLevel {
  Off = 'off',
  Basic = 'basic', // 基础指标：FPS、内存
  Standard = 'standard', // 标准指标：+ 布局、绘制、事件
  Detailed = 'detailed', // 详细指标：+ 脏节点、脏区域、热点分析
}

export interface FrameMetrics {
  timestamp: number;
  fps: number;
  frameTime: number;
  layoutTime: number;
  paintTime: number;
  compositeTime: number;
  eventTime: number;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  dirtyNodeCount: number;
  dirtyRegionCount: number;
  nodeCount: number;
}

export interface PerformanceReport {
  duration: number;
  frameCount: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  fpsStability: number; // 0-100，越高越稳定
  avgFrameTime: number;
  maxFrameTime: number;
  avgLayoutTime: number;
  avgPaintTime: number;
  avgCompositeTime: number;
  avgEventTime: number;
  memoryPeak: number;
  memoryAvg: number;
  hotspots: Array<{
    name: string;
    time: number;
    percentage: number;
  }>;
}

export interface MonitorConfig {
  level: MonitorLevel;
  maxHistoryFrames: number;
  enableAlert: boolean;
  alertThresholds: {
    fps: number;
    frameTime: number;
    memory: number;
  };
  enableAutoReport: boolean;
  autoReportInterval: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: MonitorConfig;
  private frameMetrics: FrameMetrics[] = [];
  private isMonitoring: boolean = false;
  private startTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fpsBuffer: number[] = [];
  private alerts: Array<{ time: number; message: string; level: string }> = [];
  private hotspots: Map<string, number> = new Map();
  private warmupFrames: number = 0; // 预热帧数

  private constructor() {
    this.config = {
      level: MonitorLevel.Off,
      maxHistoryFrames: 300, // 5 秒 @ 60 FPS
      enableAlert: true,
      alertThresholds: {
        fps: 50,
        frameTime: 20,
        memory: 100, // MB
      },
      enableAutoReport: false,
      autoReportInterval: 10000, // 10 秒
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 启动监控
   */
  start(level: MonitorLevel = MonitorLevel.Standard) {
    if (this.isMonitoring) return;

    this.config.level = level;
    this.isMonitoring = true;
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.frameMetrics = [];
    this.fpsBuffer = [];
    this.hotspots.clear();
    this.alerts = [];
    this.warmupFrames = 60; // 预热 60 帧（约 1 秒）

    console.log(`%c[Cyan Monitor] Started with level: ${level}`, 'color: #4ecdc4; font-weight: bold;');
    this._printHelp();
  }

  /**
   * 停止监控
   */
  stop() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    const report = this.getReport();
    console.log('%c[Cyan Monitor] Stopped', 'color: #ff6b6b; font-weight: bold;');
    this._printReport(report);
  }

  /**
   * 记录帧数据
   */
  recordFrame(metrics: Partial<FrameMetrics>) {
    if (!this.isMonitoring || this.config.level === MonitorLevel.Off) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const frame: FrameMetrics = {
      timestamp: now,
      fps: frameTime > 0 ? 1000 / frameTime : 0,
      frameTime,
      layoutTime: metrics.layoutTime || 0,
      paintTime: metrics.paintTime || 0,
      compositeTime: metrics.compositeTime || 0,
      eventTime: metrics.eventTime || 0,
      memory: this._getMemoryInfo(),
      dirtyNodeCount: metrics.dirtyNodeCount || 0,
      dirtyRegionCount: metrics.dirtyRegionCount || 0,
      nodeCount: metrics.nodeCount || 0,
    };

    this.frameMetrics.push(frame);
    this.fpsBuffer.push(frame.fps);

    // 保持历史数据大小
    if (this.frameMetrics.length > this.config.maxHistoryFrames) {
      this.frameMetrics.shift();
      this.fpsBuffer.shift();
    }

    this.frameCount++;

    // 预热期间不检查告警
    if (this.warmupFrames > 0) {
      this.warmupFrames--;
    } else {
      // 检查告警
      if (this.config.enableAlert) {
        this._checkAlerts(frame);
      }
    }

    // 更新热点
    if (this.config.level === MonitorLevel.Detailed) {
      this._updateHotspots(frame);
    }
  }

  /**
   * 获取性能报告
   */
  getReport(): PerformanceReport {
    if (this.frameMetrics.length === 0) {
      return this._getEmptyReport();
    }

    const duration = performance.now() - this.startTime;
    const frames = this.frameMetrics;

    const fps = frames.map((f) => f.fps);
    const avgFps = fps.reduce((a, b) => a + b, 0) / fps.length;
    const minFps = Math.min(...fps);
    const maxFps = Math.max(...fps);
    const fpsVariance = this._calculateVariance(fps);
    const fpsStability = Math.max(0, 100 - fpsVariance);

    const frameTimes = frames.map((f) => f.frameTime);
    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const maxFrameTime = Math.max(...frameTimes);

    const layoutTimes = frames.map((f) => f.layoutTime);
    const avgLayoutTime = layoutTimes.reduce((a, b) => a + b, 0) / layoutTimes.length;

    const paintTimes = frames.map((f) => f.paintTime);
    const avgPaintTime = paintTimes.reduce((a, b) => a + b, 0) / paintTimes.length;

    const compositeTimes = frames.map((f) => f.compositeTime);
    const avgCompositeTime = compositeTimes.reduce((a, b) => a + b, 0) / compositeTimes.length;

    const eventTimes = frames.map((f) => f.eventTime);
    const avgEventTime = eventTimes.reduce((a, b) => a + b, 0) / eventTimes.length;

    const memories = frames.map((f) => f.memory.usedJSHeapSize / 1024 / 1024);
    const memoryPeak = Math.max(...memories);
    const memoryAvg = memories.reduce((a, b) => a + b, 0) / memories.length;

    const hotspots = this._getHotspots(avgFrameTime);
    const report = {
      duration,
      frameCount: this.frameCount,
      avgFps: Math.round(avgFps * 100) / 100,
      minFps: Math.round(minFps * 100) / 100,
      maxFps: Math.round(maxFps * 100) / 100,
      fpsStability: Math.round(fpsStability),
      avgFrameTime: Math.round(avgFrameTime * 100) / 100,
      maxFrameTime: Math.round(maxFrameTime * 100) / 100,
      avgLayoutTime: Math.round(avgLayoutTime * 100) / 100,
      avgPaintTime: Math.round(avgPaintTime * 100) / 100,
      avgCompositeTime: Math.round(avgCompositeTime * 100) / 100,
      avgEventTime: Math.round(avgEventTime * 100) / 100,
      memoryPeak: Math.round(memoryPeak * 100) / 100,
      memoryAvg: Math.round(memoryAvg * 100) / 100,
      hotspots,
    };
    console.table(report);
    return report;
  }

  /**
   * 获取实时指标
   */
  getMetrics(): Partial<FrameMetrics> {
    if (this.frameMetrics.length === 0) {
      return {};
    }
    return this.frameMetrics[this.frameMetrics.length - 1];
  }

  /**
   * 获取历史数据
   */
  getHistory(count: number = 60): FrameMetrics[] {
    return this.frameMetrics.slice(-count);
  }

  /**
   * 获取告警列表
   */
  getAlerts() {
    return this.alerts;
  }

  /**
   * 清空数据
   */
  clear() {
    this.frameMetrics = [];
    this.fpsBuffer = [];
    this.alerts = [];
    this.hotspots.clear();
    this.frameCount = 0;
  }

  /**
   * 设置配置
   */
  setConfig(config: Partial<MonitorConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取配置
   */
  getConfig(): MonitorConfig {
    return this.config;
  }

  /**
   * 导出数据为 JSON
   */
  exportJSON(): string {
    return JSON.stringify(
      {
        config: this.config,
        report: this.getReport(),
        history: this.frameMetrics,
        alerts: this.alerts,
      },
      null,
      2
    );
  }

  /**
   * 导出数据为 CSV
   */
  exportCSV(): string {
    const headers = [
      'timestamp',
      'fps',
      'frameTime',
      'layoutTime',
      'paintTime',
      'compositeTime',
      'eventTime',
      'memory',
      'dirtyNodes',
      'dirtyRegions',
    ];
    const rows = this.frameMetrics.map((f) => [
      f.timestamp,
      f.fps.toFixed(2),
      f.frameTime.toFixed(2),
      f.layoutTime.toFixed(2),
      f.paintTime.toFixed(2),
      f.compositeTime.toFixed(2),
      f.eventTime.toFixed(2),
      (f.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      f.dirtyNodeCount,
      f.dirtyRegionCount,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  // ==================== Private Methods ====================

  private _getMemoryInfo() {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory?.usedJSHeapSize || 0,
      totalJSHeapSize: memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
    };
  }

  private _calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private _checkAlerts(frame: FrameMetrics) {
    const { fps, frameTime, memory } = this.config.alertThresholds;

    if (frame.fps < fps) {
      this._addAlert(`FPS dropped to ${frame.fps.toFixed(1)}`, 'warning');
    }

    if (frame.frameTime > frameTime) {
      this._addAlert(`Frame time exceeded ${frameTime}ms (${frame.frameTime.toFixed(1)}ms)`, 'warning');
    }

    const memoryMB = frame.memory.usedJSHeapSize / 1024 / 1024;
    if (memoryMB > memory) {
      this._addAlert(`Memory exceeded ${memory}MB (${memoryMB.toFixed(1)}MB)`, 'warning');
    }
  }

  private _addAlert(message: string, level: string = 'info') {
    this.alerts.push({
      time: performance.now(),
      message,
      level,
    });

    // 保持告警列表大小
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    console.warn(`%c[Cyan Monitor] ${message}`, 'color: #ff6b6b;');
  }

  private _updateHotspots(frame: FrameMetrics) {
    if (frame.layoutTime > 0) {
      this.hotspots.set('layout', (this.hotspots.get('layout') || 0) + frame.layoutTime);
    }
    if (frame.paintTime > 0) {
      this.hotspots.set('paint', (this.hotspots.get('paint') || 0) + frame.paintTime);
    }
    if (frame.compositeTime > 0) {
      this.hotspots.set('composite', (this.hotspots.get('composite') || 0) + frame.compositeTime);
    }
    if (frame.eventTime > 0) {
      this.hotspots.set('event', (this.hotspots.get('event') || 0) + frame.eventTime);
    }
  }

  private _getHotspots(totalTime: number): Array<{ name: string; time: number; percentage: number }> {
    const result: Array<{ name: string; time: number; percentage: number }> = [];

    for (const [name, time] of this.hotspots.entries()) {
      result.push({
        name,
        time: Math.round(time * 100) / 100,
        percentage: Math.round((time / (totalTime * this.frameCount)) * 10000) / 100,
      });
    }

    return result.sort((a, b) => b.time - a.time);
  }

  private _getEmptyReport(): PerformanceReport {
    return {
      duration: 0,
      frameCount: 0,
      avgFps: 0,
      minFps: 0,
      maxFps: 0,
      fpsStability: 0,
      avgFrameTime: 0,
      maxFrameTime: 0,
      avgLayoutTime: 0,
      avgPaintTime: 0,
      avgCompositeTime: 0,
      avgEventTime: 0,
      memoryPeak: 0,
      memoryAvg: 0,
      hotspots: [],
    };
  }

  private _printHelp() {
    console.log(
      `
%c╔════════════════════════════════════════════════════════════╗
║          Cyan Canvas Performance Monitor                    ║
╚════════════════════════════════════════════════════════════╝

📊 Available Commands:

  cyan.monitor.getReport()        - Get performance report
  cyan.monitor.getMetrics()       - Get current frame metrics
  cyan.monitor.getHistory(60)     - Get last N frames
  cyan.monitor.getAlerts()        - Get alert list
  cyan.monitor.stop()             - Stop monitoring
  cyan.monitor.clear()            - Clear data
  cyan.monitor.exportJSON()       - Export as JSON
  cyan.monitor.exportCSV()        - Export as CSV
  cyan.monitor.setConfig({...})   - Update config

⚙️  Monitor Levels:

  'basic'     - FPS, Memory
  'standard'  - + Layout, Paint, Event time
  'detailed'  - + Dirty nodes, Hotspot analysis

📈 Example:

  cyan.monitor.setConfig({
    level: 'detailed',
    enableAlert: true,
    alertThresholds: { fps: 50, frameTime: 20, memory: 100 }
  })

`,
      'color: #4ecdc4; font-weight: bold;'
    );
  }

  private _printReport(report: PerformanceReport) {
    const duration = (report.duration / 1000).toFixed(2);
    const fpsColor = report.avgFps >= 55 ? '#4ecdc4' : report.avgFps >= 45 ? '#f9ca24' : '#ff6b6b';

    console.log(
      `
%c╔════════════════════════════════════════════════════════════╗
║                  Performance Report                         ║
╚════════════════════════════════════════════════════════════╝

⏱️  Duration: ${duration}s | Frames: ${report.frameCount}

📊 FPS:
   Average: %c${report.avgFps}%c | Min: ${report.minFps} | Max: ${report.maxFps}
   Stability: %c${report.fpsStability}%c%

⏰ Frame Time:
   Average: ${report.avgFrameTime}ms | Max: ${report.maxFrameTime}ms

🎨 Rendering:
   Layout:    ${report.avgLayoutTime}ms
   Paint:     ${report.avgPaintTime}ms
   Composite: ${report.avgCompositeTime}ms
   Event:     ${report.avgEventTime}ms

💾 Memory:
   Peak: ${report.memoryPeak}MB | Average: ${report.memoryAvg}MB

🔥 Hotspots:
${report.hotspots.map((h) => `   ${h.name.padEnd(10)} ${h.time.toFixed(2)}ms (${h.percentage}%)`).join('\n')}

`,
      'color: #4ecdc4; font-weight: bold;',
      fpsColor,
      'color: #4ecdc4;',
      report.fpsStability >= 80 ? '#4ecdc4' : '#f9ca24',
      'color: #4ecdc4;'
    );
  }
}

// 导出单例
export const Monitor = PerformanceMonitor.getInstance();

// 全局 API
if (typeof window !== 'undefined') {
  (window as any).cyan = (window as any).cyan || {};
  (window as any).cyan.monitor = Monitor;
}
