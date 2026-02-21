import { RenderNode } from '../RenderNode';
import { BoxConstraints, BoxFit, ImageRepeat, Alignment, BlendMode, ColorFilter } from '../types/container';
import { Size } from '../types/node';

export class ImageNode extends RenderNode {
  private _src: string = '';
  private _image: HTMLImageElement | null = null;
  private _isLoaded: boolean = false;
  private _boxFit: BoxFit = BoxFit.Contain;
  private _opacity: number = 1;
  private _repeat: ImageRepeat = ImageRepeat.NoRepeat;
  private _alignment: Alignment = Alignment.Center;
  private _blendMode: BlendMode = BlendMode.Normal;
  private _colorFilter: ColorFilter | null = null;
  private _gaplessPlayback: boolean = false;
  private _filterQuality: 'low' | 'medium' | 'high' = 'medium';
  private _semanticLabel: string = '';
  private _matchTextDirection: boolean = false;

  constructor(src?: string) {
    super();
    if (src) this.src = src;
  }

  public get src() {
    return this._src;
  }
  public set src(v: string) {
    if (this._src === v) return;
    this._src = v;
    this._isLoaded = false;
    this.loadImage(v);
  }

  public get boxFit() {
    return this._boxFit;
  }
  public set boxFit(v: BoxFit) {
    if (this._boxFit === v) return;
    this._boxFit = v;
    this.markNeedsLayout();
  }

  public set opacity(v: number) {
    if (this._opacity === v) return;
    this._opacity = Math.max(0, Math.min(1, v));
    this.markNeedsPaint();
  }

  public set repeat(v: ImageRepeat) {
    if (this._repeat === v) return;
    this._repeat = v;
    this.markNeedsPaint();
  }

  public set alignment(v: Alignment) {
    if (this._alignment === v) return;
    this._alignment = v;
    this.markNeedsPaint();
  }

  public set blendMode(v: BlendMode) {
    if (this._blendMode === v) return;
    this._blendMode = v;
    this.markNeedsPaint();
  }

  public set colorFilter(v: ColorFilter | null) {
    this._colorFilter = v;
    this.markNeedsPaint();
  }

  public set gaplessPlayback(v: boolean) {
    this._gaplessPlayback = v;
  }

  public set filterQuality(v: 'low' | 'medium' | 'high') {
    if (this._filterQuality === v) return;
    this._filterQuality = v;
    this.markNeedsPaint();
  }

  public set semanticLabel(v: string) {
    this._semanticLabel = v;
  }

  public set matchTextDirection(v: boolean) {
    this._matchTextDirection = v;
  }

  private loadImage(src: string) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this._image = img;
      this._isLoaded = true;
      this.markNeedsLayout();
      this.markNeedsPaint();
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
  }

  /**
   * 根据 BoxFit 计算最终的绘制尺寸和位置
   */
  private calculateFitSize(
    imgWidth: number,
    imgHeight: number,
    containerWidth: number,
    containerHeight: number
  ): { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } {
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = containerWidth / containerHeight;

    let drawWidth = containerWidth;
    let drawHeight = containerHeight;
    let offsetX = 0;
    let offsetY = 0;

    switch (this._boxFit) {
      case BoxFit.Fill:
        // 拉伸填满（可能变形）
        drawWidth = containerWidth;
        drawHeight = containerHeight;
        break;

      case BoxFit.Contain:
        // 保持宽高比，完全显示（可能有空白）
        if (imgRatio > containerRatio) {
          drawWidth = containerWidth;
          drawHeight = containerWidth / imgRatio;
        } else {
          drawHeight = containerHeight;
          drawWidth = containerHeight * imgRatio;
        }
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = (containerHeight - drawHeight) / 2;
        break;

      case BoxFit.Cover:
        // 保持宽高比，填满容器（可能裁剪）
        if (imgRatio > containerRatio) {
          drawHeight = containerHeight;
          drawWidth = containerHeight * imgRatio;
        } else {
          drawWidth = containerWidth;
          drawHeight = containerWidth / imgRatio;
        }
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = (containerHeight - drawHeight) / 2;
        break;

      case BoxFit.FitWidth:
        // 宽度填满
        drawWidth = containerWidth;
        drawHeight = containerWidth / imgRatio;
        offsetY = (containerHeight - drawHeight) / 2;
        break;

      case BoxFit.FitHeight:
        // 高度填满
        drawHeight = containerHeight;
        drawWidth = containerHeight * imgRatio;
        offsetX = (containerWidth - drawWidth) / 2;
        break;

      case BoxFit.ScaleDown:
        // 如果图片小，显示原尺寸；否则缩放至 contain
        if (imgWidth <= containerWidth && imgHeight <= containerHeight) {
          drawWidth = imgWidth;
          drawHeight = imgHeight;
        } else {
          if (imgRatio > containerRatio) {
            drawWidth = containerWidth;
            drawHeight = containerWidth / imgRatio;
          } else {
            drawHeight = containerHeight;
            drawWidth = containerHeight * imgRatio;
          }
        }
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = (containerHeight - drawHeight) / 2;
        break;
    }

    return { drawWidth, drawHeight, offsetX, offsetY };
  }

  performLayout(constraints: BoxConstraints): Size {
    // 使用显式设置的尺寸或约束
    let width = this.width || (this._isLoaded ? this._image!.width : 100);
    let height = this.height || (this._isLoaded ? this._image!.height : 100);

    // 应用约束限制
    width = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, width));
    height = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, height));

    return { width, height };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = this._opacity;

    if (this._isLoaded && this._image) {
      const { drawWidth, drawHeight, offsetX, offsetY } = this.calculateFitSize(
        this._image.width,
        this._image.height,
        this.width,
        this.height
      );

      ctx.drawImage(this._image, 0, 0, this._image.width, this._image.height, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // 加载中的占位图
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

    ctx.globalAlpha = 1;
  }
}
