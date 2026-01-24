import { RowNode } from '../../nodes/RowNode';
import { RectNode } from '../../nodes/RectNode';
import { ColumnNode } from '../../nodes/ColumnNode';
import { ContainerNode } from "../../nodes/ContainerNode";

export const COMPONENT_MAP: Record<string, any> = {
  'cyan-row': RowNode,
  'cyan-rect': RectNode,
  'cyan-column': ColumnNode,
  'cyan-container': ContainerNode
};