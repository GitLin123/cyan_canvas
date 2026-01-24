import { RenderNode } from '../../RenderNode';

export abstract class Widget {
  // Widget 只是配置单，不存储状态
}

// 对应有底层渲染节点的 Widget
export abstract class RenderObjectWidget extends Widget {
  abstract createRenderNode(): RenderNode;
  abstract updateRenderNode(node: RenderNode): void;
}


export abstract class StatelessWidget extends Widget {
  abstract build(): Widget;
}