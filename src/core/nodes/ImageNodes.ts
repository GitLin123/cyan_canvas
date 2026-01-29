import { RenderNode } from '../RenderNode';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';

export class ImageNode extends RenderNode {
  private _src: string = '';
  private _image: HTMLImageElement | null = null;
  private _isLoaded: boolean = false;

  constructor(src?: string) {
    super();
    if (src) this.src = src;
  }

  public get src() { return this._src; }
  public set src(v: string) {
    if (this._src === v) return;
    this._src = v;
    this._isLoaded = false;
    this.loadImage(v);
  }

  private loadImage(src: string) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this._image = img;
      this._isLoaded = true;
      // 图片加载成功后，必须通知引擎：布局可能变了，且必须重绘
      this.markNeedsLayout();
      this.markNeedsPaint();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
  }

  performLayout(constraints: BoxConstraints): Size {
    // 1. 如果用户手动设置了宽高，优先使用
    // 2. 如果没设置，但在图片加载后，使用图片的原始尺寸（但不超过约束）
    // 3. 否则，默认给个占位大小
    let width = this.width || (this._isLoaded ? this._image!.width : 100);
    let height = this.height || (this._isLoaded ? this._image!.height : 100);

    // 保持比例缩放逻辑（简单示例）
    if (width > constraints.maxWidth) {
      const ratio = constraints.maxWidth / width;
      width = constraints.maxWidth;
      height *= ratio;
    }

    return { width, height };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    if (this._isLoaded && this._image) {
      // 绘制图片
      ctx.drawImage(this._image, 0, 0, this.width, this.height);
    } else {
      // 图片加载中的占位图：画一个带斜线的灰色矩形
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.strokeStyle = '#bdbdbd';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, this.height);
      ctx.moveTo(this.width, 0);
      ctx.lineTo(0, this.height);
      ctx.stroke();
    }
  }
}