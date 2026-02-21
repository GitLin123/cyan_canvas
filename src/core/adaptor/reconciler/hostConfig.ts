import { COMPONENT_MAP } from './nodes';
import { TextNode } from '../../nodes/TextNode';

const setEngineRecursively = (node: any, engine: any) => {
  node.engine = engine;
  if (Array.isArray(node.children)) {
    node.children.forEach((child: any) => setEngineRecursively(child, engine));
  }
};

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
    const { children, width, height, ...restProps } = props;

    // 对于 width/height props，映射到 preferredWidth/preferredHeight
    // 这样让布局系统把它们作为"首选尺寸"而不是"强制尺寸"
    if (width !== undefined) {
      instance.preferredWidth = width;
    }
    if (height !== undefined) {
      instance.preferredHeight = height;
    }

    Object.assign(instance, restProps);
    return instance;
  },

  appendInitialChild(parent: any, child: any) {
    if (parent.add) parent.add(child);
  },

  finalizeInitialChildren() {
    return false;
  },

  // 上下文环境
  getRootHostContext() {
    return {};
  },
  getChildHostContext(parentContext: any) {
    return parentContext;
  },
  getPublicInstance(instance: any) {
    return instance;
  },
  prepareForCommit() {
    return null;
  },
  resetAfterCommit() {},
  shouldSetTextContent() {
    return false;
  },
  createTextInstance(text: string) {
    return new TextNode(text);
  },

  commitTextUpdate(textInstance: any, oldText: string, newText: string) {
    textInstance.text = newText;
  },

  // 更新逻辑
  prepareUpdate() {
    return true;
  },
  commitUpdate(instance: any, updatePayload: any, type: string, oldProps: any, newProps: any) {
    const { children, width, height, ...restProps } = newProps;

    // 对于 width/height props，映射到 preferredWidth/preferredHeight
    if (width !== undefined) {
      instance.preferredWidth = width;
    }
    if (height !== undefined) {
      instance.preferredHeight = height;
    }

    Object.assign(instance, restProps);

    const engine = (instance as any).engine;
    if (engine && typeof engine.markNeedsPaint === 'function') {
      engine.markNeedsPaint(instance);
    }
  },

  // 树变更
  appendChild(parent: any, child: any) {
    if (parent.add) parent.add(child);
    // 确保新增的子节点也能访问到引擎
    const engine = (parent as any).engine || (parent as any);
    (child as any).engine = engine;
    if (engine && typeof engine.markNeedsPaint === 'function') {
      engine.markNeedsPaint(child);
    }
  },
  appendChildToContainer(container: any, child: any) {
    // 容器就是引擎本身
    // 第一次挂载时，设置root
    if (container.root === undefined || container.root === null) {
      container.root = child;
      child.parent = null;

      // 绑定引擎引用，让节点树能回调到引擎
      setEngineRecursively(child, container);

      // 通知引擎全量重绘
      container.markNeedsPaint(child);
      return;
    }
    if (container.add) container.add(child);
  },

  removeChild(parent: any, child: any) {
    if (parent.remove) parent.remove(child);
  },

  supportsMutation: true,
  getCurrentEventPriority() {
    return 0b0000000000000000000000000000010;
  },
  detachDir() {},
  requestPostPaintCallback() {},
  maySyncFlush() {},
};
