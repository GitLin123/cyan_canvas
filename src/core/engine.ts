import { Ticker } from './ticker'
import { RenderNode } from './RenderNode'
import { EventManager } from './events/index'

export interface EngineOptions {
  // 画布
  canvas?: HTMLCanvasElement
  containerId?: string
  width?: number
  height?: number
  // 设备像素比，默认使用窗口设备像素比
  pixelRatio?: number
}
export interface PerformanceMetrics {
  fps: number
  layoutTime: number
  paintTime: number
  totalFrameTime: number
  drawCalls: number
  dirtyRectsCount: number
}

export class CyanEngine {
  // 渲染上下文
  public ctx: CanvasRenderingContext2D
  // 画布
  public canvas: HTMLCanvasElement
  // 渲染树的根节点
  public root: RenderNode | null = null
  // 渲染循环
  public ticker: Ticker
  // 脏检查：是否需要重新渲染
  private _isDirty: boolean = true
  // 记录所有需要重绘的节点
  private _dirtyNodes: Set<RenderNode> = new Set()
  // 离屏渲染画布
  private _offscreenCanvas: HTMLCanvasElement
  // 离屏渲染上下文
  private _offscreenCtx: CanvasRenderingContext2D
  private _frameCount: number = 0
  private eventManager: EventManager

  private _showDashBoard: boolean = true
  private _metrics: PerformanceMetrics = {
    fps: 0,
    layoutTime: 0,
    paintTime: 0,
    totalFrameTime: 0,
    drawCalls: 0,
    dirtyRectsCount: 0,
  }
  private _lastStatsUpdate: number = 0
  private _drawCallCounter: number = 0

  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options)
    this.ctx = this.canvas.getContext('2d', { alpha: false })!
    // 创建离屏渲染画布
    this._offscreenCanvas = document.createElement('canvas')
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!

    this.resize()

    window.addEventListener('resize', () => {
      this.resize()
    })

    this.ticker = new Ticker()

    this.eventManager = new EventManager(
      this.canvas,
      () => this.root // 使用闭包确保总是能获取到最新的 root
    )
    this.setupCanvas(options.pixelRatio || window.devicePixelRatio)
    this.initPipeline()
  }

  private _resolveCanvas(options: EngineOptions): HTMLCanvasElement {
    if (options.canvas) {
      return options.canvas
    }
    const canvas = document.createElement('canvas')
    canvas.width = options.width || 800
    canvas.height = options.height || 600

    // 挂载逻辑
    const container = options.containerId
      ? document.getElementById(options.containerId)
      : document.body

    if (container) {
      container.appendChild(canvas)
    }
    return canvas
  }

  /**
   * 处理画布大小调整
   * 当浏览器缩放时，必须同步更新物理像素尺寸
   */
  public resize() {
    const pr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight

    // 物理像素大小
    this.canvas.width = width * pr
    this.canvas.height = height * pr
    this._offscreenCanvas.width = width * pr
    this._offscreenCanvas.height = height * pr

    // CSS 像素大小
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    // 标记全局脏，下一帧强制全屏重绘
    this._isDirty = true
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((elapsed, delta) => {
      // 只有在需要更新时才执行重绘，节省能耗
      if (this.root && (this.root._isDirty || this.root._hasDirtyChild)) {
        if (!(this.root as any).engine) (this.root as any).engine = this
        this._frameCount++
        this.runPipeline(delta)
        this.resetDirtyStatus()
      }
    })
  }

  /**
   * 递归重置标记
   */
  private resetDirtyStatus() {
    // 原有的 resetDirtyStatus 改为安全递归，跳过 null/undefined 节点
    const safeReset = (node: any) => {
      if (!node) return
      node._isDirty = false
      node._hasDirtyChild = false
      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) => safeReset(child))
      }
    }
    safeReset(this.root)
  }

  /**
   * @param pixelRatio 设备像素比
   */
  private setupCanvas(pixelRatio: number) {
    const { width, height } = this.canvas.getBoundingClientRect()
    const fullWeight = width * pixelRatio
    const fullHeight = height * pixelRatio
    ;[this.canvas, this._offscreenCanvas].forEach((canvas) => {
      canvas.width = fullWeight
      canvas.height = fullHeight
    })
    this.ctx.scale(pixelRatio, pixelRatio)
    this._offscreenCtx.scale(pixelRatio, pixelRatio)
  }

  /**
   * 核心管线：Update -> Layout -> Paint
   */
  private runPipeline(delta: number) {
    if (!this.root) return

    // 1. 获取基础参数
    const rect = this.canvas.getBoundingClientRect()
    const pr = window.devicePixelRatio || 1

    // ==========================================
    // 第一步：执行布局 (Layout)
    // 布局可能会改变节点的 x, y，从而产生新的脏矩形
    // ==========================================
    this.root.layout({
      maxWidth: rect.width,
      minWidth: 0,
      maxHeight: rect.height,
      minHeight: 0,
    })

    // ==========================================
    // 第二步：收集所有脏矩形 (Consume)
    // 此时拿到的 rects 包含了 React 修改 + Layout 修正
    // ==========================================
    let dirtyRects = this.root.consumeDirtyRects()

    // 如果没有脏区域且引擎不是全局脏，则跳过重绘
    if (dirtyRects.length === 0 && !this._isDirty) return

    // 如果是全局脏（如 Resize 后），脏矩形设为全屏
    if (this._isDirty) {
      dirtyRects = [{ x: 0, y: 0, width: rect.width, height: rect.height }]
    }

    // ==========================================
    // 第三步：离屏绘制 (Paint to Offscreen)
    // ==========================================
    const offCtx = this._offscreenCtx
    offCtx.save()

    // 关键：离屏画布使用物理像素坐标系
    offCtx.setTransform(pr, 0, 0, pr, 0, 0)

    dirtyRects.forEach((r) => {
      // 在离屏画布上擦除旧内容（逻辑坐标，因为有 setTransform）
      offCtx.clearRect(r.x, r.y, r.width, r.height)
    })

    // 剪裁绘制区域，只绘制脏矩形部分以提升性能
    offCtx.beginPath()
    dirtyRects.forEach((r) => offCtx.rect(r.x, r.y, r.width, r.height))
    offCtx.clip()

    // 执行渲染树绘制
    this.root.paint(offCtx)
    offCtx.restore()
    // ==========================================
    // 第四步：同步到主屏幕 (Composite)
    // ==========================================
    this.ctx.save()
    // 注意：主屏幕 ctx 不要设置 setTransform，直接操作物理像素最稳
    dirtyRects.forEach((r) => {
      // 逻辑坐标转物理坐标
      const sx = r.x * pr
      const sy = r.y * pr

      const sw = r.width * pr
      const sh = r.height * pr

      if (sw > 0 && sh > 0) {
        // 擦除主屏幕
        this.ctx.clearRect(sx, sy, sw, sh)
        // 从离屏拷贝对应区域
        this.ctx.drawImage(
          this._offscreenCanvas,
          sx,
          sy,
          sw,
          sh, // Source
          sx,
          sy,
          sw,
          sh // Destination
        )
      }
    })
    this.ctx.restore()
    console.log('Dirty Rects Count:', dirtyRects.length)

    if (this._showDashBoard) {
      this._renderDashBoard()
      this._renderDirtyRectsDebug(dirtyRects)
    }
    // 状态重置
    this._isDirty = false
    this._frameCount++
  }
  /**
   * 当状态改变时，通知引擎需要刷新
   */
  public markNeedsPaint(node: RenderNode) {
    this._isDirty = true
  }

  private _renderDirtyRectsDebug(rects: Array<any>) {
    this.ctx.save()
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    this.ctx.lineWidth = 1
    rects.forEach((r) => this.ctx.strokeRect(r.x, r.y, r.width, r.height))
    this.ctx.restore()
  }

  private _renderDashBoard() {
    const ctx = this.ctx
    const metrics = this._metrics
    const pr = window.devicePixelRatio || 1

    ctx.save()
    // 关键：重置所有变换，直接使用物理像素坐标绘制 UI
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // 1. 绘制背景板 (放在右上角)
    const width = 180 * pr
    const height = 100 * pr
    const padding = 10 * pr
    const x = this.canvas.width - width - padding
    const y = padding

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(x, y, width, height)

    // 2. 绘制文字
    ctx.fillStyle = '#00ff00'
    ctx.font = `${12 * pr}px monospace`
    const textX = x + 10 * pr
    let textY = y + 20 * pr
    const step = 16 * pr

    ctx.fillText(`FPS: ${this.ticker.getFPS()}`, textX, textY)
    ctx.fillText(
      `Layout: ${metrics.layoutTime.toFixed(2)}ms`,
      textX,
      (textY += step)
    )
    ctx.fillText(
      `Paint: ${metrics.paintTime.toFixed(2)}ms`,
      textX,
      (textY += step)
    )
    ctx.fillText(
      `DirtyRects: ${metrics.dirtyRectsCount}`,
      textX,
      (textY += step)
    )
    ctx.fillText(
      `Resolution: ${this.canvas.width}x${this.canvas.height}`,
      textX,
      (textY += step)
    )

    ctx.restore()
  }

  public start() {
    console.log('[Engine] Ticker starting...')
    this.ticker.start()

    // 强制触发一次首帧检查
    if (this.root) {
      this.markNeedsPaint(this.root)
    }
  }

  public stop() {
    this.ticker.stop()
  }
}
