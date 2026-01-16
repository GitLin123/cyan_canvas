import { RenderNode, BoxConstraints, Size } from '../RenderNode';
import { MainAxisAlignment, CrossAxisAlignment } from '../types/container';
export class ColumnNode extends RenderNode {
  constructor(
    public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start,
    public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Start
    ) {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 1. 计算所有 Flex 节点个数
    const totalFlexNodes = this.children.reduce((sum, child) => sum + (child.flex || 0), 0);

    // 1. 第一次遍历：布局固定节点，计算已用高度
    let fixedHeight = 0;
    let maxWidth = 0;
    this.children.forEach(child => {
      if (!child.flex) {
        child.layout(constraints);
        fixedHeight += child.height;
        maxWidth = Math.max(maxWidth, child.width);
      }
    });
    
    // 2. 计算剩余空间分配给 Flex 节点
    const remainingSpace = Math.max(0, constraints.maxHeight - fixedHeight);
    const flexUnit = totalFlexNodes > 0 ? remainingSpace / totalFlexNodes : 0;
    
    // 3. 第二次遍历：布局节点并计算坐标
    let currentY = 0;
    // 如果没有 Flex 且是对齐模式，计算起始 Y
    if (totalFlexNodes === 0) {
      if (this.mainAxisAlignment === MainAxisAlignment.Center) currentY = remainingSpace / 2;
      if (this.mainAxisAlignment === MainAxisAlignment.End) currentY = remainingSpace;
    }

    const gap = (totalFlexNodes === 0 && this.mainAxisAlignment === MainAxisAlignment.SpaceBetween && this.children.length > 1) 
                ? remainingSpace / (this.children.length - 1) : 0;

    // 4. 应用节点坐标
    this.children.forEach(child => {
      let minW = 0;
      let maxW = constraints.maxWidth;
      if(this.crossAxisAlignment === CrossAxisAlignment.Stretch) {
        minW = maxW;
      }

      if (child.flex) {
        const childH = child.flex * flexUnit;
        child.layout({
          minWidth: minW,
          maxWidth: maxW,
          minHeight: childH,
          maxHeight: childH 
        });
      } else {
        if(this.crossAxisAlignment === CrossAxisAlignment.Stretch) {
          child.layout({
            ...constraints,
            minWidth: minW,
            maxWidth: maxW
          });
        }
      }
      child.y = currentY;
      if(this.crossAxisAlignment === CrossAxisAlignment.Start) {
        child.x = 0;
      } else if(this.crossAxisAlignment === CrossAxisAlignment.Center) {
        child.x = (maxW - child.width) / 2;
      } else if(this.crossAxisAlignment === CrossAxisAlignment.End) {
        child.x = maxW - child.width;
      }
      currentY += child.height + gap;
      maxWidth = Math.max(maxWidth, child.width);
    });

    return { width: maxWidth, height: constraints.maxHeight };

  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Column 本身通常不画东西
  }
}