import { RenderNode, BoxConstraints, Size } from '../RenderNode';
import { MainAxisAlignment, CrossAxisAlignment} from '../types/container';
export class RowNode extends RenderNode {
  constructor(
    public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start,
    public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Center) {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 1. 计算所有 Flex 节点个数
    const totalFlexNodes = this.children.reduce((sum, child) => sum + (child.flex || 0), 0);
    
    // 1. 第一次遍历：布局固定节点，计算已用宽度
    let fixedWidth = 0;
    let maxHeight = 0;
    this.children.forEach(child => {
      if (!child.flex) {
        child.layout(constraints);
        fixedWidth += child.width;
        maxHeight = Math.max(maxHeight, child.height);
      }
    });
  
    // 2. 计算剩余空间分配给 Flex 节点
    const remainingSpace = Math.max(0, constraints.maxWidth - fixedWidth);
    const flexUnit = totalFlexNodes > 0 ? remainingSpace / totalFlexNodes : 0;
  
    // 3. 第二次遍历：布局节点并计算坐标
    let currentX = 0;
    // 如果没有 Flex 且是对齐模式，计算起始 X
    if (totalFlexNodes === 0) {
      if (this.mainAxisAlignment === MainAxisAlignment.Center) currentX = remainingSpace / 2;
      if (this.mainAxisAlignment === MainAxisAlignment.End) currentX = remainingSpace;
    }
  
    // 计算节点之间的间距（没有flex节点时）
    const gap = (totalFlexNodes === 0 && this.mainAxisAlignment === MainAxisAlignment.SpaceBetween && this.children.length > 1) 
                ? remainingSpace / (this.children.length - 1) : 0;
  
    // 4. 应用节点坐标
    this.children.forEach(child => {
      // --- 1. 计算交叉轴(高度)约束 ---
      let minH = 0;
      let maxH = constraints.maxHeight;
      
      if (this.crossAxisAlignment === CrossAxisAlignment.Stretch) {
        minH = maxH; // 强制拉升
      }
    
      // --- 2. 计算主轴(宽度)约束并执行单次布局 ---
      if (child.flex) {
        // 弹性节点：同时锁定宽度和(如果是Stretch的话)高度
        const childW = child.flex * flexUnit;
        child.layout({ 
          minWidth: childW, 
          maxWidth: childW, 
          minHeight: minH, 
          maxHeight: maxH 
        });
      } else {
        // 固定节点：如果是 Stretch，需要重新布局以匹配高度
        if (this.crossAxisAlignment === CrossAxisAlignment.Stretch) {
            child.layout({ 
              ...constraints, 
              minHeight: minH, 
              maxHeight: maxH 
            });
        }
      }
    
      // --- 3. 设置位置 ---
      child.x = currentX;
      if(this.crossAxisAlignment === CrossAxisAlignment.Start || this.crossAxisAlignment === CrossAxisAlignment.Stretch) {
        child.y = 0;
      } else if(this.crossAxisAlignment === CrossAxisAlignment.Center) {
        child.y = (constraints.maxHeight - child.height) / 2;
      } else if(this.crossAxisAlignment === CrossAxisAlignment.End) {
        child.y = constraints.maxHeight - child.height;
      }
      
      currentX += child.width + gap;
      maxHeight = Math.max(maxHeight, child.height);
    });
  
    return { width: constraints.maxWidth, height: maxHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Column 本身通常不画东西
  }
}