import { ShapeNode } from './base/ShapeNode';
import type { PaintingContext } from '../backend/PaintingContext';

export class TriangleNode extends ShapeNode {
  paintSelf(ctx: PaintingContext): void {
    const w = this.width;
    const h = this.height;
    ctx.save();
    ctx.beginPath();
    // Upward pointing isosceles triangle
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
