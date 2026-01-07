// RectNode.ts
import { RenderNode, BoxConstraints, Size } from './RenderNode';

export class RectNode extends RenderNode {
  constructor(public color: string = 'red') {
    super();
  }

  // 实现布局逻辑
  performLayout(constraints: BoxConstraints): Size {
    // 简单逻辑：如果有父节点给的具体约束则使用，否则默认 100x100
    const width = constraints.maxWidth !== Infinity ? constraints.maxWidth : 100;
    const height = constraints.maxHeight !== Infinity ? constraints.maxHeight : 100;
    
    // 如果有子节点，需要在这里调用子节点的 layout
    this.children.forEach(child => {
      child.layout({ ...constraints, maxWidth: width, maxHeight: height });
    });

    return { width, height };
  }

  // 实现绘制逻辑
  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}