import { RectNode } from '../../nodes/RectNode'
import { ColumnNode } from '../../nodes/ColumnNode'
import { Widget, RenderObjectWidget } from './widget'
import { TriangleNode } from '../../nodes/TriangleNode'
import { ArrowNode } from '../../nodes/ArrowNode'
import { CircleNode } from '../../nodes/CircleNode'
import { TextNode } from '../../nodes/TextNode'
import { ImageNode } from '../../nodes/ImageNodes'

export class Rect extends RenderObjectWidget {
  constructor(
    private props: { width?: number; height?: number; color?: string }
  ) {
    super()
  }
  createRenderNode() {
    return new RectNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Column extends RenderObjectWidget {
  constructor(
    private props: any,
    public children: Widget[]
  ) {
    super()
  }
  createRenderNode() {
    return new ColumnNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Triangle extends RenderObjectWidget {
  constructor(
    private props: { width?: number; height?: number; color?: string }
  ) {
    super()
  }
  createRenderNode() {
    return new TriangleNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Arrow extends RenderObjectWidget {
  constructor(
    private props: { width?: number; height?: number; color?: string }
  ) {
    super()
  }
  createRenderNode() {
    return new ArrowNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Circle extends RenderObjectWidget {
  constructor(
    private props: { width?: number; height?: number; color?: string }
  ) {
    super()
  }
  createRenderNode() {
    return new CircleNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Text extends RenderObjectWidget {
  constructor(
    private props: { text?: string; fontSize?: number; color?: string }
  ) {
    super()
  }
  createRenderNode() {
    return new TextNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}

export class Image extends RenderObjectWidget {
  constructor(private props: { src: string; width?: number; height?: number }) {
    super()
  }
  createRenderNode() {
    return new ImageNode()
  }
  updateRenderNode(node: any) {
    Object.assign(node, this.props)
  }
}
