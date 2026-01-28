import { RenderNode } from '../RenderNode';
import { CyanInputEventType } from '../types/events';

export class EventManager {
  private lastHoveredNode: RenderNode | null = null;

  private readonly handlerMap: Record<string, keyof RenderNode> = {
    'click': 'onClick',
    'mousedown': 'onMouseDown',
    'mouseup': 'onMouseUp',
    'mousemove': 'onMouseMove',
    'wheel': 'onWheel',
    'contextmenu': 'onContextMenu'
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private getRoot: () => RenderNode | null
  ) {
    this.init();
  }

  private init() {
    // 自动绑定所有定义的事件
    Object.keys(this.handlerMap).forEach((type) => {
      this.canvas.addEventListener(type, ((e: MouseEvent | WheelEvent) => {
        const root = this.getRoot();
        if (!root) return;

        const { x, y } = this.calculateLogicalPosition(e.clientX, e.clientY);
        const target = root.hitTest(x - root.x, y - root.y);

        this.dispatchEvent(target, type as CyanInputEventType, e);
      }) as EventListener);
    });
  }

  private calculateLogicalPosition(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const style = window.getComputedStyle(this.canvas);

    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;

    // 逻辑尺寸计算
    const pr = window.devicePixelRatio || 1;
    const logicalCanvasWidth = this.canvas.width / pr;
    const logicalCanvasHeight = this.canvas.height / pr;

    const contentWidth = rect.width - borderLeft - paddingLeft - (parseFloat(style.borderRightWidth) || 0) - (parseFloat(style.paddingRight) || 0);
    const contentHeight = rect.height - borderTop - paddingTop - (parseFloat(style.borderBottomWidth) || 0) - (parseFloat(style.paddingBottom) || 0);

    const scaleX = contentWidth > 0 ? logicalCanvasWidth / contentWidth : 1;
    const scaleY = contentHeight > 0 ? logicalCanvasHeight / contentHeight : 1;

    return {
      x: (clientX - rect.left - borderLeft - paddingLeft) * scaleX,
      y: (clientY - rect.top - borderTop - paddingTop) * scaleY,
    };
  }

  private dispatchEvent(target: RenderNode | null, type: CyanInputEventType, e: any) {
    if (type === 'mousemove') {
      this.handleHoverState(target, e);
    }

    // 阻止右键菜单默认行为
    if (type === 'contextmenu') {
      e.preventDefault();
    }

    if (!target) return;

    const handlerName = this.handlerMap[type];
    if (handlerName) {
      const handler = target[handlerName] as Function;
      if (typeof handler === 'function') {
        handler.call(target, e);
      }
    }
  }

  private handleHoverState(currentTarget: RenderNode | null, e: MouseEvent) {
    if (this.lastHoveredNode !== currentTarget) {
      if (this.lastHoveredNode) {
        this.lastHoveredNode._isMouseOver = false;
        this.lastHoveredNode.onMouseLeave?.(e);
      }
      if (currentTarget) {
        currentTarget._isMouseOver = true;
        currentTarget.onMouseEnter?.(e);
      }
      this.lastHoveredNode = currentTarget;
    }
  }
}