import type { RenderNode } from '../RenderNode';

export interface AABB {
  minX: number; minY: number; maxX: number; maxY: number;
}

interface LeafEntry {
  bbox: AABB;
  node: RenderNode;
}

interface RTreeNode {
  bbox: AABB;
  children: RTreeNode[] | null; // null = leaf level
  leaves: LeafEntry[] | null;   // non-null only at leaf level
}

const M = 16; // fan-out factor

function unionBBox(items: { bbox: AABB }[]): AABB {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const { bbox } of items) {
    if (bbox.minX < minX) minX = bbox.minX;
    if (bbox.minY < minY) minY = bbox.minY;
    if (bbox.maxX > maxX) maxX = bbox.maxX;
    if (bbox.maxY > maxY) maxY = bbox.maxY;
  }
  return { minX, minY, maxX, maxY };
}

function containsPoint(b: AABB, x: number, y: number) {
  return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
}

/** STR bulk-load: sort by x-center, slice into √N strips, sort each strip by y-center */
function buildSTR(entries: LeafEntry[]): RTreeNode {
  if (entries.length <= M) {
    return { bbox: unionBBox(entries), children: null, leaves: entries };
  }

  // sort by x-center
  entries.sort((a, b) => (a.bbox.minX + a.bbox.maxX) - (b.bbox.minX + b.bbox.maxX));
  const sliceCount = Math.ceil(Math.sqrt(entries.length / M));
  const sliceSize = Math.ceil(entries.length / sliceCount);

  const childNodes: RTreeNode[] = [];
  for (let i = 0; i < entries.length; i += sliceSize) {
    const slice = entries.slice(i, i + sliceSize);
    // sort slice by y-center
    slice.sort((a, b) => (a.bbox.minY + a.bbox.maxY) - (b.bbox.minY + b.bbox.maxY));
    for (let j = 0; j < slice.length; j += M) {
      const group = slice.slice(j, j + M);
      childNodes.push({ bbox: unionBBox(group), children: null, leaves: group });
    }
  }

  // recursively build upper levels
  return buildUpper(childNodes);
}

function buildUpper(nodes: RTreeNode[]): RTreeNode {
  if (nodes.length <= M) {
    return { bbox: unionBBox(nodes.map(n => ({ bbox: n.bbox }))), children: nodes, leaves: null };
  }
  nodes.sort((a, b) => (a.bbox.minX + a.bbox.maxX) - (b.bbox.minX + b.bbox.maxX));
  const sliceCount = Math.ceil(Math.sqrt(nodes.length / M));
  const sliceSize = Math.ceil(nodes.length / sliceCount);
  const parents: RTreeNode[] = [];
  for (let i = 0; i < nodes.length; i += sliceSize) {
    const slice = nodes.slice(i, i + sliceSize);
    slice.sort((a, b) => (a.bbox.minY + a.bbox.maxY) - (b.bbox.minY + b.bbox.maxY));
    for (let j = 0; j < slice.length; j += M) {
      const group = slice.slice(j, j + M);
      parents.push({ bbox: unionBBox(group.map(n => ({ bbox: n.bbox }))), children: group, leaves: null });
    }
  }
  return buildUpper(parents);
}

export class RTree {
  private _root: RTreeNode | null = null;

  build(entries: { node: RenderNode; bbox: AABB }[]) {
    if (entries.length === 0) { this._root = null; return; }
    this._root = buildSTR(entries);
  }

  query(x: number, y: number): RenderNode[] {
    const results: RenderNode[] = [];
    if (!this._root) return results;
    this._query(this._root, x, y, results);
    return results;
  }

  private _query(n: RTreeNode, x: number, y: number, out: RenderNode[]) {
    if (!containsPoint(n.bbox, x, y)) return;
    if (n.leaves) {
      for (const leaf of n.leaves) {
        if (containsPoint(leaf.bbox, x, y)) out.push(leaf.node);
      }
    } else if (n.children) {
      for (const child of n.children) {
        this._query(child, x, y, out);
      }
    }
  }
}
