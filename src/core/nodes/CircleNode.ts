import { ShapeNode } from './base/ShapeNode';
import type { PaintingContext } from '../backend/PaintingContext';

export class CircleNode extends ShapeNode {
  paintSelf(ctx: PaintingContext): void {
    const w = this.width;
    const h = this.height;
    const r = Math.min(w, h) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this._color;
    ctx.fill();
    ctx.restore();
  }
}
