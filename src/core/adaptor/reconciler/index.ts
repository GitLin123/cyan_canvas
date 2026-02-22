import ReactReconciler from 'react-reconciler';
import { hostConfig } from './hostConfig';

const CyanReconciler = ReactReconciler(hostConfig as any);

export const CyanRenderer = {
  render(element: React.ReactNode, engine: any) {
    // 不再要求预先存在 engine.root，直接以 engine 作为 containerInfo 创建容器并更新树
    if (!engine._reactContainer) {
      engine._reactContainer = CyanReconciler.createContainer(
        engine,
        0,
        null,
        false,
        null,
        '',
        (error) => console.error('React Error:', error),
        (error) => console.error('React Error:', error),
        (error) => console.error('React Error:', error),
        () => {}
      );
    }

    CyanReconciler.updateContainer(element, engine._reactContainer, null, () => {
      // 触发一次同步布局/绘制以保证首帧显示
      if (engine && typeof engine.markNeedsPaint === 'function') {
        try {
          engine.markNeedsPaint();
        } catch (e) {
          /* ignore */
        }
      }
      if (engine && typeof engine.start === 'function') {
        try {
          engine.start();
        } catch (e) {
          /* ignore */
        }
      }
    });
  },

  // 卸载：把 fiber 树卸载（置空），并清理容器引用
  unmount(engine: any) {
    try {
      if (engine && engine._reactContainer) {
        CyanReconciler.updateContainer(null, engine._reactContainer, null, () => {});
        engine._reactContainer = null;
      }
    } catch (e) {
      console.error('[CyanRenderer] unmount error', e);
    }
  },
};
