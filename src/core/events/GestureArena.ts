/**
 * GestureArena - 手势竞技场
 * 用于管理多个手势识别器之间的竞争关系，确保只有一个识别器能够成功识别手势
 */

export interface GestureArenaMember {
  acceptGesture(pointer: number): void;
  rejectGesture(pointer: number): void;
}

// 手势竞技场的入口
class GestureArenaEntry {
  constructor(
    private arena: GestureArenaManager,
    public pointer: number,
    public member: GestureArenaMember
  ) {}

  resolve(disposition: 'accepted' | 'rejected') {
    this.arena.resolve(this.pointer, this.member, disposition);
  }
}

class _GestureArena {
  members: GestureArenaMember[] = [];
  isOpen = true;
}

export class GestureArenaManager {
  private _arenas = new Map<number, _GestureArena>();

  // 添加一个成员到指定 pointer 的竞技场，如果没有则创建一个新的竞技场
  add(pointer: number, member: GestureArenaMember): GestureArenaEntry {
    if (!this._arenas.has(pointer)) this._arenas.set(pointer, new _GestureArena());
    this._arenas.get(pointer)!.members.push(member);
    return new GestureArenaEntry(this, pointer, member);
  }

  // 关闭指定 pointer 的竞技场，表示不再接受新的成员加入
  close(pointer: number) {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    arena.isOpen = false;
    this._tryResolve(pointer, arena);
  }

  // 兜底函数，尝试解析竞技场的结果，如果只有一个成员则接受它，如果没有成员则删除竞技场
  sweep(pointer: number) {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    if (arena.members.length >= 1) {
      // 接收第一个成员，拒绝其他后续成员
      arena.members[0].acceptGesture(pointer);
      for (let i = 1; i < arena.members.length; i++) arena.members[i].rejectGesture(pointer);
    }
    this._arenas.delete(pointer);
  }

  // 成员调用 resolve 来表明自己的态度，如果接受则拒绝其他成员，如果拒绝则从竞技场中移除自己并尝试解析结果
  resolve(pointer: number, member: GestureArenaMember, disposition: 'accepted' | 'rejected') {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    if (disposition === 'rejected') {
      arena.members = arena.members.filter((m) => m !== member);
      member.rejectGesture(pointer);
      if (!arena.isOpen) this._tryResolve(pointer, arena);
    } else {
      for (const m of arena.members) {
        if (m !== member) m.rejectGesture(pointer);
      }
      member.acceptGesture(pointer);
      this._arenas.delete(pointer);
    }
  }

  // 尝试解析竞技场的结果，如果只有一个成员则接受它，如果没有成员则删除竞技场
  private _tryResolve(pointer: number, arena: _GestureArena) {
    if (arena.members.length === 1) {
      Promise.resolve().then(() => this.sweep(pointer));
    } else if (arena.members.length === 0) {
      this._arenas.delete(pointer);
    }
  }
}
