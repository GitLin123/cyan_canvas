import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';
import { MainAxisAlignment, CrossAxisAlignment } from '../../types/container';

/**
 * Wrap 容器 - 自动换行布局
 * 相当于 Flutter 的 Wrap
 */
export class WrapNode extends RenderNode {
  public direction: 'horizontal' | 'vertical' = 'horizontal'; // 主轴方向
  public spacing: number = 0; // 主轴方向上的间距
  public runSpacing: number = 0; // 辅轴方向上的间距
  public mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.Start;
  public crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.Start;

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    if (this.direction === 'horizontal') {
      return this.performHorizontalLayout(constraints);
    } else {
      return this.performVerticalLayout(constraints);
    }
  }

  private performHorizontalLayout(constraints: BoxConstraints): Size {
    const containerWidth = this._preferredWidth ?? constraints.maxWidth;

    // 先布局所有子节点以获取其尺寸
    this.children.forEach((child) => {
      child.layout({
        minWidth: 0,
        maxWidth: containerWidth,
        minHeight: 0,
        maxHeight: constraints.maxHeight,
      });
    });

    // 将子节点分行
    const runs: RenderNode[][] = [];
    let currentRun: RenderNode[] = [];
    let currentRunWidth = 0;

    this.children.forEach((child) => {
      const childWidth = child.width + (currentRun.length > 0 ? this.spacing : 0);

      if (currentRunWidth + childWidth <= containerWidth || currentRun.length === 0) {
        currentRun.push(child);
        currentRunWidth += childWidth;
      } else {
        // 开始新行
        if (currentRun.length > 0) {
          runs.push(currentRun);
        }
        currentRun = [child];
        currentRunWidth = child.width;
      }
    });

    if (currentRun.length > 0) {
      runs.push(currentRun);
    }

    // 定位子节点
    let totalHeight = 0;
    const runHeights: number[] = [];

    runs.forEach((run, runIndex) => {
      const runHeight = Math.max(...run.map((c) => c.height), 0);
      runHeights.push(runHeight);
      totalHeight += runHeight + (runIndex > 0 ? this.runSpacing : 0);
    });

    let currentY = 0;
    runs.forEach((run, runIndex) => {
      const runHeight = runHeights[runIndex];

      // 根据 mainAxisAlignment 计算水平位置
      let usedWidth = run.reduce((sum, child, idx) => {
        return sum + child.width + (idx > 0 ? this.spacing : 0);
      }, 0);

      let currentX = 0;
      switch (this.mainAxisAlignment) {
        case MainAxisAlignment.End:
          currentX = containerWidth - usedWidth;
          break;
        case MainAxisAlignment.Center:
          currentX = (containerWidth - usedWidth) / 2;
          break;
        case MainAxisAlignment.SpaceBetween:
          if (run.length > 1) {
            const gap = (containerWidth - usedWidth + this.spacing * (run.length - 1)) / (run.length - 1);
            run.forEach((child, idx) => {
              let cy = currentY;
              if (this.crossAxisAlignment === CrossAxisAlignment.Center) {
                cy = Math.floor(currentY + (runHeight - child.height) / 2);
              } else if (this.crossAxisAlignment === CrossAxisAlignment.End) {
                cy = currentY + runHeight - child.height;
              }
              child.setPosition(currentX, cy);
              currentX += child.width + gap;
            });
            return;
          }
          currentX = 0;
          break;
        case MainAxisAlignment.Start:
        default:
          currentX = 0;
      }

      run.forEach((child) => {
        let cy = currentY;
        if (this.crossAxisAlignment === CrossAxisAlignment.Center) {
          cy = Math.floor(currentY + (runHeight - child.height) / 2);
        } else if (this.crossAxisAlignment === CrossAxisAlignment.End) {
          cy = currentY + runHeight - child.height;
        }
        child.setPosition(Math.floor(currentX), cy);
        currentX += child.width + this.spacing;
      });

      currentY += runHeight + this.runSpacing;
    });

    const finalWidth = this._preferredWidth ?? Math.min(constraints.maxWidth, containerWidth);
    const finalHeight = this._preferredHeight ?? Math.min(constraints.maxHeight, totalHeight);

    return { width: finalWidth, height: finalHeight };
  }

  private performVerticalLayout(constraints: BoxConstraints): Size {
    const containerHeight = this._preferredHeight ?? constraints.maxHeight;

    // 先布局所有子节点
    this.children.forEach((child) => {
      child.layout({
        minWidth: 0,
        maxWidth: constraints.maxWidth,
        minHeight: 0,
        maxHeight: containerHeight,
      });
    });

    // 将子节点分列
    const runs: RenderNode[][] = [];
    let currentRun: RenderNode[] = [];
    let currentRunHeight = 0;

    this.children.forEach((child) => {
      const childHeight = child.height + (currentRun.length > 0 ? this.spacing : 0);

      if (currentRunHeight + childHeight <= containerHeight || currentRun.length === 0) {
        currentRun.push(child);
        currentRunHeight += childHeight;
      } else {
        if (currentRun.length > 0) {
          runs.push(currentRun);
        }
        currentRun = [child];
        currentRunHeight = child.height;
      }
    });

    if (currentRun.length > 0) {
      runs.push(currentRun);
    }

    // 定位子节点
    let totalWidth = 0;
    const runWidths: number[] = [];

    runs.forEach((run, runIndex) => {
      const runWidth = Math.max(...run.map((c) => c.width), 0);
      runWidths.push(runWidth);
      totalWidth += runWidth + (runIndex > 0 ? this.runSpacing : 0);
    });

    let currentX = 0;
    runs.forEach((run, runIndex) => {
      const runWidth = runWidths[runIndex];

      let usedHeight = run.reduce((sum, child, idx) => {
        return sum + child.height + (idx > 0 ? this.spacing : 0);
      }, 0);

      let currentY = 0;
      switch (this.mainAxisAlignment) {
        case MainAxisAlignment.End:
          currentY = containerHeight - usedHeight;
          break;
        case MainAxisAlignment.Center:
          currentY = (containerHeight - usedHeight) / 2;
          break;
        case MainAxisAlignment.SpaceBetween:
          if (run.length > 1) {
            const gap = (containerHeight - usedHeight + this.spacing * (run.length - 1)) / (run.length - 1);
            run.forEach((child) => {
              let cx = currentX;
              if (this.crossAxisAlignment === CrossAxisAlignment.Center) {
                cx = Math.floor(currentX + (runWidth - child.width) / 2);
              } else if (this.crossAxisAlignment === CrossAxisAlignment.End) {
                cx = currentX + runWidth - child.width;
              }
              child.setPosition(cx, currentY);
              currentY += child.height + gap;
            });
            return;
          }
          currentY = 0;
          break;
        case MainAxisAlignment.Start:
        default:
          currentY = 0;
      }

      run.forEach((child) => {
        let cx = currentX;
        if (this.crossAxisAlignment === CrossAxisAlignment.Center) {
          cx = Math.floor(currentX + (runWidth - child.width) / 2);
        } else if (this.crossAxisAlignment === CrossAxisAlignment.End) {
          cx = currentX + runWidth - child.width;
        }
        child.setPosition(cx, Math.floor(currentY));
        currentY += child.height + this.spacing;
      });

      currentX += runWidth + this.runSpacing;
    });

    const finalWidth = this._preferredWidth ?? Math.min(constraints.maxWidth, totalWidth);
    const finalHeight = this._preferredHeight ?? Math.min(constraints.maxHeight, containerHeight);

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Wrap 容器本身不绘制任何东西
  }
}
