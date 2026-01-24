// ContainerNode.ts
import { RenderNode, BoxConstraints, Size } from '../RenderNode';

export class ContainerNode extends RenderNode {
  constructor(public padding: number = 0, public color: string = 'transparent') {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 优先使用自身声明的宽高，否则使用父级约束
    const containerWidth = this.width || constraints.maxWidth;
    const containerHeight = this.height || constraints.maxHeight;

    let contentWidth = 0;
    let contentHeight = 0;

    // 1. 扣除 Padding，计算给子节点的缩小版约束
    const innerConstraints: BoxConstraints = {
      minWidth: 0,
      maxWidth: Math.max(0, containerWidth - this.padding * 2),
      minHeight: 0,
      maxHeight: Math.max(0, containerHeight - this.padding * 2),
    };

    // 2. 布局唯一的子节点（若存在）
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

    // 4. 最终尺寸：如果节点显式指定了宽高则优先使用，否则在约束内使用理想尺寸
    const finalWidth = this.width !== undefined && this.width !== null
      ? this.width
      : Math.max(constraints.minWidth, Math.min(constraints.maxWidth, idealWidth));
    const finalHeight = this.height !== undefined && this.height !== null
      ? this.height
      : Math.max(constraints.minHeight, Math.min(constraints.maxHeight, idealHeight));

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // 绘制背景色（如果设置）
    if (this.color && this.color !== 'transparent') {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}