import { ShapeNode } from './base/ShapeNode';
import type { PaintingContext } from '../backend/PaintingContext';

export class ArrowNode extends ShapeNode {
  // 覆盖默认尺寸
  protected getDefaultWidth(): number {
    return 120;
  }
  protected getDefaultHeight(): number {
    return 60;
  }

  paintSelf(ctx: PaintingContext): void {
    const w = this.width;
    const h = this.height;
    const headW = Math.min(w * 0.35, h * 1.2);
    const bodyW = Math.max(0, w - headW);

    ctx.save();
    ctx.beginPath();
    // Start at top-left of body
    ctx.moveTo(0, h * 0.25);
    ctx.lineTo(bodyW, h * 0.25);
    ctx.lineTo(bodyW, 0);
    // arrow tip
    ctx.lineTo(w, h * 0.5);
    ctx.lineTo(bodyW, h);
    ctx.lineTo(bodyW, h * 0.75);
    ctx.lineTo(0, h * 0.75);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
