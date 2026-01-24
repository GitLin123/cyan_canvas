import { RectNode } from '../../nodes/RectNode';
import { ColumnNode } from '../../nodes/ColumnNode';
import {Widget, RenderObjectWidget } from "./widget";
import { TriangleNode } from '../../nodes/TriangleNode';
import { ArrowNode } from '../../nodes/ArrowNode';
import { CircleNode } from '../../nodes/CircleNode';
export class Rect extends RenderObjectWidget {
  constructor(private props: { width?: number; height?: number; color?: string }) {
    super();
  }
  createRenderNode() { return new RectNode(); }
  updateRenderNode(node: any) {
    Object.assign(node, this.props);
  }
}

export class Column extends RenderObjectWidget {
  constructor(private props: any, public children: Widget[]) {
    super();
  }
  createRenderNode() { return new ColumnNode(); }
  updateRenderNode(node: any) {
    Object.assign(node, this.props);
  }
}

export class Triangle extends RenderObjectWidget {
  constructor(private props: { width?: number; height?: number; color?: string }) {
    super();
  }
  createRenderNode() { return new TriangleNode(); }
  updateRenderNode(node: any) {
    Object.assign(node, this.props);
  }
}

export class Arrow extends RenderObjectWidget {
  constructor(private props: { width?: number; height?: number; color?: string }) {
    super();
  }
  createRenderNode() { return new ArrowNode(); }
  updateRenderNode(node: any) {
    Object.assign(node, this.props);
  }
}

export class Circle extends RenderObjectWidget {
  constructor(private props: { width?: number; height?: number; color?: string }) {
    super();
  }
  createRenderNode() { return new CircleNode(); }
  updateRenderNode(node: any) {
    Object.assign(node, this.props);
  }
}