/**
 * ScrollEventManager - 处理滚动事件的专门管理器
 * 负责监听滚轮和键盘事件，并将其转化为滚动操作
 */

import { RenderNode } from '../RenderNode';

export class ScrollEventManager {
  private readonly scrollSensitivity = {
    wheel: 1, // 滚轮灵敏度，值越小越灵敏
    keyboard: 15, // 键盘滚动像素数
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private getRoot: () => RenderNode | null,
    private markDirty: () => void
  ) {
    this.init();
  }

  private init() {
    this.setupWheelListener();
    this.setupKeyboardListener();
  }

  /**
   * 设置滚轮事件监听器
   */
  private setupWheelListener() {
    this.canvas.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();

      const root = this.getRoot();
      if (!root || !this.hasScrollMethod(root)) return;

      const scrollView = root as any;
      // 将 deltaY 缩放到合理范围：不同浏览器的 deltaY 值差异大
      const deltaY = e.deltaY * this.scrollSensitivity.wheel;
      scrollView.scroll(0, deltaY);

      this.markDirty();
    });
  }

  /**
   * 设置键盘滚动事件监听器
   */
  private setupKeyboardListener() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const root = this.getRoot();
      if (!root || !this.hasScrollMethod(root)) return;

      const scrollView = root as any;
      const scrollAmount = this.scrollSensitivity.keyboard;
      let handled = false;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          scrollView.scroll(0, -scrollAmount);
          handled = true;
          break;
        case 'ArrowDown':
          e.preventDefault();
          scrollView.scroll(0, scrollAmount);
          handled = true;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          scrollView.scroll(-scrollAmount, 0);
          handled = true;
          break;
        case 'ArrowRight':
          e.preventDefault();
          scrollView.scroll(scrollAmount, 0);
          handled = true;
          break;
        case ' ': // Space bar - Page Down
          e.preventDefault();
          scrollView.scroll(0, scrollAmount * 10);
          handled = true;
          break;
      }

      if (handled) {
        this.markDirty();
      }
    });
  }

  /**
   * 检查节点是否具有 scroll 方法
   */
  private hasScrollMethod(node: RenderNode): boolean {
    return typeof (node as any).scroll === 'function';
  }

  /**
   * 公开方法：修改滚动灵敏度
   */
  public setScrollSensitivity(wheel?: number, keyboard?: number) {
    if (wheel !== undefined) {
      this.scrollSensitivity.wheel = wheel;
    }
    if (keyboard !== undefined) {
      this.scrollSensitivity.keyboard = keyboard;
    }
  }

  /**
   * 公开方法：获取当前灵敏度设置
   */
  public getScrollSensitivity() {
    return { ...this.scrollSensitivity };
  }
}
