import { CyanEngine } from '../../Engine';
import { Widget, RenderObjectWidget, StatelessWidget } from './widget';

export function runApp(app: Widget, engine: CyanEngine) {
  const rootNode = instantiateWidget(app);
  engine.root = rootNode;
  engine.markNeedsPaint(rootNode);
}

function instantiateWidget(widget: Widget): any {
  if (widget instanceof StatelessWidget) {
    // 递归调用 build 拿到真正的渲染描述
    return instantiateWidget(widget.build());
  } else if (widget instanceof RenderObjectWidget) {
    const node = widget.createRenderNode();
    widget.updateRenderNode(node);

    // 如果有 children，递归创建
    if ((widget as any).children) {
      (widget as any).children.forEach((childWidget: Widget) => {
        const childNode = instantiateWidget(childWidget);
        if (childNode) node.add(childNode);
      });
    }
    return node;
  }
}