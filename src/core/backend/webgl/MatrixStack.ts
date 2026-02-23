/**
 * 3x3 仿射矩阵栈
 * 模拟 Canvas 2D 的 save/restore + translate/rotate/scale
 * 矩阵格式 (列主序 Float32Array[9]):
 *   [a, b, 0, c, d, 0, tx, ty, 1]
 * 对应:
 *   | a  c  tx |
 *   | b  d  ty |
 *   | 0  0  1  |
 */
export class MatrixStack {
  private _stack: Float32Array[] = [];
  private _current: Float32Array;

  constructor() {
    this._current = MatrixStack.identity();
  }

  static identity(): Float32Array {
    const m = new Float32Array(9);
    m[0] = 1; m[4] = 1; m[8] = 1;
    return m;
  }

  get current(): Float32Array {
    return this._current;
  }

  /** 重置为单位矩阵并清空栈 */
  reset(): void {
    this._stack.length = 0;
    this._current = MatrixStack.identity();
  }

  save(): void {
    this._stack.push(new Float32Array(this._current));
  }

  restore(): void {
    if (this._stack.length > 0) {
      this._current = this._stack.pop()!;
    }
  }

  /** 右乘平移矩阵 */
  translate(x: number, y: number): void {
    const m = this._current;
    m[6] += m[0] * x + m[3] * y;
    m[7] += m[1] * x + m[4] * y;
  }

  /** 右乘旋转矩阵 */
  rotate(angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const m = this._current;
    const a0 = m[0], a1 = m[1], a3 = m[3], a4 = m[4];
    m[0] = a0 * c + a3 * s;
    m[1] = a1 * c + a4 * s;
    m[3] = a0 * -s + a3 * c;
    m[4] = a1 * -s + a4 * c;
  }

  /** 右乘缩放矩阵 */
  scale(sx: number, sy: number): void {
    const m = this._current;
    m[0] *= sx; m[1] *= sx;
    m[3] *= sy; m[4] *= sy;
  }

  /** 设置为绝对变换 */
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    const m = this._current;
    m[0] = a; m[1] = b;
    m[3] = c; m[4] = d;
    m[6] = e; m[7] = f;
    m[2] = 0; m[5] = 0; m[8] = 1;
  }

  /** 将本地坐标点变换到世界坐标 */
  transformPoint(x: number, y: number): [number, number] {
    const m = this._current;
    return [
      m[0] * x + m[3] * y + m[6],
      m[1] * x + m[4] * y + m[7],
    ];
  }

  /** 转换为 4x4 列主序矩阵（供 WebGL uniform 使用） */
  toMat4(out: Float32Array): Float32Array {
    const m = this._current;
    out[0] = m[0]; out[1] = m[1]; out[2] = 0; out[3] = 0;
    out[4] = m[3]; out[5] = m[4]; out[6] = 0; out[7] = 0;
    out[8] = 0;    out[9] = 0;    out[10] = 1; out[11] = 0;
    out[12] = m[6]; out[13] = m[7]; out[14] = 0; out[15] = 1;
    return out;
  }
}
