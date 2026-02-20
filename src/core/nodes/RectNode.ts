import { RenderNode } from '../RenderNode'
import { BoxConstraints } from '../types/container'
import { Size } from '../types/node'

export class RectNode extends RenderNode {
  private _color: string = 'white'
  private _prefWidth?: number
  private _prefHeight?: number
  private _borderRadius: number = 0
  private _opacity: number = 1

  public get color() {
    return this._color
  }
  public set color(v: string) {
    if (this._color === v) return
    this._color = v
    this.markNeedsPaint()
  }

  public get borderRadius() {
    return this._borderRadius
  }
  public set borderRadius(v: number) {
    if (this._borderRadius === v) return
    this._borderRadius = v
    this.markNeedsPaint()
  }

  public get opacity() {
    return this._opacity
  }
  public set opacity(v: number) {
    v = Math.max(0, Math.min(1, v))
    if (this._opacity === v) return
    this._opacity = v
    this.markNeedsPaint()
  }

  public set preferredWidth(v: number | undefined) {
    if (this._prefWidth === v) return
    this._prefWidth = v
    this.markNeedsLayout()
  }
  public set preferredHeight(v: number | undefined) {
    if (this._prefHeight === v) return
    this._prefHeight = v
    this.markNeedsLayout()
  }

  // 返回首选尺寸；基类 RenderNode.layout 会根据 constraints 做 clamp
  performLayout(constraints: BoxConstraints): Size {
    return {
      width: this._prefWidth ?? 100,
      height: this._prefHeight ?? 100,
    }
  }

  private roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    const radius = Math.max(0, Math.min(r, Math.min(w / 2, h / 2)))
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + w, y, x + w, y + h, radius)
    ctx.arcTo(x + w, y + h, x, y + h, radius)
    ctx.arcTo(x, y + h, x, y, radius)
    ctx.arcTo(x, y, x + w, y, radius)
    ctx.closePath()
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = this._opacity
    const w = this.width
    const h = this.height
    if (this._borderRadius > 0) {
      this.roundRectPath(ctx, this._x, this._y, w, h, this._borderRadius)
      ctx.fillStyle = this._color
      ctx.fill()
    } else {
      ctx.fillStyle = this._color
      ctx.fillRect(this._x, this._y, w, h)
    }
    ctx.restore()
  }
}
