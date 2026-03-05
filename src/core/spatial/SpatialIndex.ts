import { RenderNode } from '../nodes/base/RenderNode';
import { RTree, type AABB } from './RTree';
import { HitTestResult, HitTestEntry } from '../events/HitTestResult';
import { SPATIAL_INDEX } from '../types/constants';

export class SpatialIndex {
  private _tree = new RTree();
  private _ready = false;
  private _hitTestCache = new Map<string, HitTestResult>();
  private _cacheVersion = 0;
  private _paintOrder = new Map<RenderNode, number>();
  private _paintSeq = 0;

  rebuild(root: RenderNode) {
    root.updateWorldBounds();
    const entries: { node: RenderNode; bbox: AABB }[] = [];
    this._paintOrder.clear();
    this._paintSeq = 0;
    this._collect(root, entries);
    this._tree.build(entries);
    this._ready = true;
    this._invalidateCache();
  }

  private _invalidateCache() {
    this._cacheVersion++;
    if (this._hitTestCache.size > SPATIAL_INDEX.HIT_TEST_CACHE_SIZE) {
      this._hitTestCache.clear();
    }
  }

  private _collect(node: RenderNode, out: { node: RenderNode; bbox: AABB }[]) {
    if (!node.visible) return;
    this._paintOrder.set(node, this._paintSeq++);
    out.push({
      node,
      bbox: {
        minX: node._worldX,
        minY: node._worldY,
        maxX: node._worldX + node.width,
        maxY: node._worldY + node.height,
      },
    });
    for (const child of node.children) this._collect(child, out);
  }

  private _sortCandidates(candidates: RenderNode[]): RenderNode[] {
    return candidates.sort((a, b) => {
      const ao = this._paintOrder.get(a) ?? -1;
      const bo = this._paintOrder.get(b) ?? -1;
      if (ao !== bo) return bo - ao;
      return b.depth - a.depth;
    });
  }

  private _resolveHitPath(candidates: RenderNode[], x: number, y: number): HitTestResult {
    for (const candidate of candidates) {
      const probe = new HitTestResult();
      const localX = x - candidate._worldX;
      const localY = y - candidate._worldY;

      // 候选先经过真实 hitTest，过滤仅 bbox 命中但实际不命中的节点
      if (!candidate.hitTest(probe, localX, localY) || probe.path.length === 0) {
        continue;
      }

      const result = new HitTestResult();
      for (const entry of probe.path) {
        result.add(new HitTestEntry(entry.target, entry.localX, entry.localY));
      }

      // 补齐 candidate 以上的父链（probe 只包含 candidate 子树内路径）
      let parent = candidate.parent;
      while (parent) {
        result.add(new HitTestEntry(parent, x - parent._worldX, y - parent._worldY));
        parent = parent.parent;
      }

      return result;
    }

    return new HitTestResult();
  }

  hitTest(x: number, y: number): HitTestResult {
    const cacheKey = `${this._cacheVersion}:${x}:${y}`;
    const cached = this._hitTestCache.get(cacheKey);
    if (cached) return cached;

    const result = new HitTestResult();
    if (!this._ready) return result;

    const candidates = this._tree.query(x, y);
    if (candidates.length === 0) return result;

    const sortedCandidates = this._sortCandidates(candidates);
    const resolved = this._resolveHitPath(sortedCandidates, x, y);
    for (const entry of resolved.path) {
      result.add(entry);
    }

    this._hitTestCache.set(cacheKey, result);
    return result;
  }

  /** 区域查询：返回与给定 AABB 相交的所有节点 */
  queryRegion(region: AABB): RenderNode[] {
    if (!this._ready) return [];
    return this._tree.queryRegion(region);
  }

  hitTestFirst(x: number, y: number): RenderNode | null {
    const result = this.hitTest(x, y);
    return result.path.length > 0 ? result.path[0].target : null;
  }
}
