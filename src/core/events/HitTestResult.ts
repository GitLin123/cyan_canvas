import { RenderNode } from '../RenderNode';

export class HitTestEntry {
  constructor(
    public readonly target: RenderNode,
    public readonly localX: number,
    public readonly localY: number,
  ) {}
}

export class HitTestResult {
  public readonly path: HitTestEntry[] = [];

  add(entry: HitTestEntry) {
    this.path.push(entry);
  }

  get isNotEmpty(): boolean {
    return this.path.length > 0;
  }
}
