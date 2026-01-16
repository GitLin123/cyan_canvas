// ContainerNode.ts
import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class ContainerNode extends RenderNode {
  constructor(public padding: number = 0, public color: string = 'transparent') {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    let contentWidth = 0;
    let contentHeight = 0;

    // 1. 扣除 Padding，计算给子节点的缩小版约束
    const innerConstraints: BoxConstraints = {
      minWidth: 0,
      maxWidth: Math.max(0, constraints.maxWidth - this.padding * 2),
      minHeight: 0,
      maxHeight: Math.max(0, constraints.maxHeight - this.padding * 2),
    };

    // 2. 布局唯一的子节点
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(innerConstraints); // 执行递归布局
      
      // 3. 设置子节点相对于我的偏移 (Parent Sets Position)
      child.x = this.padding;
      child.y = this.padding;

      contentWidth = child.width;
      contentHeight = child.height;
    }

    const idealWidth = contentWidth + this.padding * 2;
    const idealHeight = contentHeight + this.padding * 2;

    // 4. 返回包含 Padding 的总尺寸
    return {
      width: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, idealWidth)),
      height: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, idealHeight)),
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    if (this.color !== 'transparent') {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}