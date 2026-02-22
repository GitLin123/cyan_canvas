export interface GestureArenaMember {
  acceptGesture(pointer: number): void;
  rejectGesture(pointer: number): void;
}

class GestureArenaEntry {
  constructor(
    private arena: GestureArenaManager,
    public pointer: number,
    public member: GestureArenaMember,
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

  add(pointer: number, member: GestureArenaMember): GestureArenaEntry {
    if (!this._arenas.has(pointer)) this._arenas.set(pointer, new _GestureArena());
    this._arenas.get(pointer)!.members.push(member);
    return new GestureArenaEntry(this, pointer, member);
  }

  close(pointer: number) {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    arena.isOpen = false;
    this._tryResolve(pointer, arena);
  }

  sweep(pointer: number) {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    if (arena.members.length >= 1) {
      arena.members[0].acceptGesture(pointer);
      for (let i = 1; i < arena.members.length; i++) arena.members[i].rejectGesture(pointer);
    }
    this._arenas.delete(pointer);
  }

  resolve(pointer: number, member: GestureArenaMember, disposition: 'accepted' | 'rejected') {
    const arena = this._arenas.get(pointer);
    if (!arena) return;
    if (disposition === 'rejected') {
      arena.members = arena.members.filter(m => m !== member);
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

  private _tryResolve(pointer: number, arena: _GestureArena) {
    if (arena.members.length === 1) {
      Promise.resolve().then(() => this.sweep(pointer));
    } else if (arena.members.length === 0) {
      this._arenas.delete(pointer);
    }
  }
}
