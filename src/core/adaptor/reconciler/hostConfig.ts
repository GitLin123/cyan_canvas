import { COMPONENT_MAP } from './nodes';
import { TextNode } from '../../nodes/TextNode';

export const hostConfig: any = {
  clearContainer(container: any) {
    if (container && container.children) {
      container.children = [];
      if (container.markNeedsPaint) container.markNeedsPaint();
    }
  },

  createInstance(type: string, props: any) {
    const NodeClass = COMPONENT_MAP[type];
    if (!NodeClass) throw new Error(`Unknown component: ${type}`);
    const instance = new NodeClass();
    // 过滤掉 children，只同步数据属性
    const { children, ...restProps } = props;
    Object.assign(instance, restProps);
    return instance;
  },

  appendInitialChild(parent: any, child: any) {
    if (parent.add) parent.add(child);
  },

  finalizeInitialChildren() { return false; },

  // 上下文环境
  getRootHostContext() { return {}; },
  getChildHostContext(parentContext: any) { return parentContext; },
  getPublicInstance(instance: any) { return instance; },
  prepareForCommit() { return null; },
  resetAfterCommit() { },
  shouldSetTextContent() { return false; },
  createTextInstance(text: string) {
    return new TextNode(text);
  }, 
  
  commitTextUpdate(textInstance: any, oldText: string, newText: string) {
    textInstance.text = newText;
  },

  // 更新逻辑
  prepareUpdate() { return true; },
  commitUpdate(instance: any, updatePayload: any, type: string, oldProps: any, newProps: any) {
    console.log('React 提交更新:', instance.constructor.name);
    console.log('实例 props:', { x: instance.x, y: instance.y, color: instance.color });

    const { children, ...restProps } = newProps;
    Object.assign(instance, restProps);
    console.log('更新后 props:', { x: instance.x, y: instance.y, color: instance.color });

    const engine = (window as any).__CYAN_ENGINE__;
    if (engine) {
      engine.markNeedsPaint(instance);
    } else {
      console.log('找不到 engine，无法触发重绘');
    }
  },

  // 树变更
  appendChild(parent: any, child: any) {
    if (parent.add) parent.add(child);
  },
  appendChildToContainer(container: any, child: any) {
    // 首次挂载：如果容器还没有 root，就把 child 设为 root（兼容 container 为 engine 的情况）
    if (container.root === undefined || container.root === null) {
      container.root = child;
      child.parent = null;
      child._isDirty = true;
      if (container.engine) {
        container.engine.root = child;
        container.engine.markNeedsPaint(child);
      }
      return;
    }
    if (container.add) container.add(child);
  },
  removeChild(parent: any, child: any) {
    if (parent.remove) parent.remove(child);
  },

  supportsMutation: true,
  getCurrentEventPriority() { return 0b0000000000000000000000000000010; },
  detachDir() { },
  requestPostPaintCallback() { },
  maySyncFlush() { },
};