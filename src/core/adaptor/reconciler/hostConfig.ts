import { COMPONENT_MAP } from './nodes';
import { TextNode } from '../../nodes/TextNode';
import { RenderNode } from '../../RenderNode';
import { CyanEngine } from '../../Engine';

const SKIP_PROPS = new Set(['children', 'width', 'height', 'x', 'y']);

function applyProps(instance: RenderNode, props: Record<string, any>) {
  for (const key in props) {
    if (SKIP_PROPS.has(key) || props[key] === undefined) continue;
    (instance as any)[key] = props[key];
  }
}

function applyLayoutProps(instance: RenderNode, props: Record<string, any>) {
  if (props.width !== undefined) instance.preferredWidth = props.width;
  if (props.height !== undefined) instance.preferredHeight = props.height;
  if (props.x !== undefined) instance.offsetX = props.x;
  if (props.y !== undefined) instance.offsetY = props.y;
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

  finalizeInitialChildren() { return false; },

  getRootHostContext() { return {}; },
  getChildHostContext(parentContext: any) { return parentContext; },
  getPublicInstance(instance: RenderNode) { return instance; },
  prepareForCommit() { return null; },
  resetAfterCommit() {},
  shouldSetTextContent() { return false; },

  createTextInstance(text: string) {
    return new TextNode(text);
  },

  commitTextUpdate(textInstance: TextNode, _oldText: string, newText: string) {
    textInstance.text = newText;
  },

  prepareUpdate() { return true; },

  commitUpdate(instance: RenderNode, _payload: any, _type: string, _oldProps: any, newProps: Record<string, any>) {
    applyLayoutProps(instance, newProps);
    applyProps(instance, newProps);
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
  requestPostPaintCallback() {},
  maySyncFlush() {},
};
