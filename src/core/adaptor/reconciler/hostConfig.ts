import { COMPONENT_MAP } from './nodes';
import { TextNode } from '../../nodes/TextNode';
import { RenderNode } from '../../nodes/base/RenderNode';
import { CyanEngine } from '../../Engine';

const SKIP_PROPS = new Set(['children', 'width', 'height', 'x', 'y']);

function applyProps(instance: RenderNode, props: Record<string, any>, oldProps?: Record<string, any>) {
  // 先清理在新 props 中被移除的属性（尤其是事件处理器）
  if (oldProps) {
    for (const key in oldProps) {
      if (SKIP_PROPS.has(key) || key === 'children') continue;
      if (!(key in props) || props[key] === undefined) {
        (instance as any)[key] = undefined;
      }
    }
  }

  for (const key in props) {
    if (SKIP_PROPS.has(key) || props[key] === undefined) continue;
    // 函数类型的 props（事件处理器）总是更新，因为它们不触发 markNeedsLayout
    // 其他类型的 props 只在值真正变化时才更新
    if (typeof props[key] === 'function' || !oldProps || oldProps[key] !== props[key]) {
      (instance as any)[key] = props[key];
    }
  }
}

function applyLayoutProps(instance: RenderNode, props: Record<string, any>, oldProps?: Record<string, any>) {
  if (props.width !== oldProps?.width) {
    instance.preferredWidth = props.width;
  }
  if (props.height !== oldProps?.height) {
    instance.preferredHeight = props.height;
  }
  if (props.x !== oldProps?.x) {
    instance.offsetX = props.x;
  }
  if (props.y !== oldProps?.y) {
    instance.offsetY = props.y;
  }
}

export const hostConfig = {
  clearContainer(container: CyanEngine) {
    container.root = null;
  },

  createInstance(type: string, props: Record<string, any>): RenderNode {
    const NodeClass = COMPONENT_MAP[type];
    if (!NodeClass) throw new Error(`Unknown component: ${type}`);
    const instance: RenderNode = new NodeClass();
    applyLayoutProps(instance, props);
    applyProps(instance, props);
    return instance;
  },

  appendInitialChild(parent: RenderNode, child: RenderNode) {
    parent.add(child);
  },

  finalizeInitialChildren() {
    return false;
  },

  getRootHostContext() {
    return {};
  },
  getChildHostContext(parentContext: any) {
    return parentContext;
  },
  getPublicInstance(instance: RenderNode) {
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

  commitTextUpdate(textInstance: TextNode, _oldText: string, newText: string) {
    textInstance.text = newText;
  },

  prepareUpdate(_instance: RenderNode, _type: string, oldProps: any, newProps: any) {
    // 快速路径：如果 props 对象相同，直接返回 false
    if (oldProps === newProps) return false;
    const keys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
    for (const key of keys) {
      if (key === 'children') continue;
      if (oldProps?.[key] !== newProps?.[key]) return true;
    }
    return false;
  },

  commitUpdate(instance: RenderNode, _payload: any, _type: string, oldProps: any, newProps: Record<string, any>) {
    applyLayoutProps(instance, newProps, oldProps);
    applyProps(instance, newProps, oldProps);
  },

  // Tree mutations
  appendChild(parent: RenderNode, child: RenderNode) {
    parent.add(child);
  },

  appendChildToContainer(container: CyanEngine, child: RenderNode) {
    container.root = child;
  },

  insertBefore(parent: RenderNode, child: RenderNode, before: RenderNode) {
    parent.insertBefore(child, before);
  },

  insertInContainerBefore(container: CyanEngine, child: RenderNode, before: RenderNode) {
    if (container.root) {
      container.root.insertBefore(child, before);
    }
  },

  removeChild(parent: RenderNode, child: RenderNode) {
    parent.remove(child);
  },

  removeChildFromContainer(container: CyanEngine, child: RenderNode) {
    if (container.root === child) {
      container.root = null;
    }
  },

  supportsMutation: true,
  getCurrentEventPriority() {
    return 0b0000000000000000000000000000010;
  },
  detachDir() {},
  detachDeletedInstance() {},
  requestPostPaintCallback() {},
  maySyncFlush() {},
};
