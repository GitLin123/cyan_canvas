import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Stack,
  Container,
  Column,
  Row,
  Padding,
  Text,
  Center,
  GestureDetector,
  Positioned,
  SingleChildScrollView,
} from '../core/adaptor/reconciler/components'
import { FontWeight, MainAxisAlignment } from '../core/types/container'
import { useWindowSize } from '../core/adaptor/reconciler'

type NoteGroup = 'Idea' | 'Task' | 'Bug' | 'Memo'

type StickyNote = {
  id: number
  text: string
  x: number
  y: number
  color: string
  group: NoteGroup
}

const STORAGE_KEY = 'cyan-sticky-board-v1'
const HEADER_H = 98
const NOTE_W = 176
const NOTE_H = 136

const PALETTE = ['#FFF59D', '#FFCCBC', '#C8E6C9', '#B3E5FC', '#E1BEE7', '#FFE082']
const GROUPS: NoteGroup[] = ['Idea', 'Task', 'Bug', 'Memo']
const PRESET_TEXTS = [
  '优化手势命中路径',
  '补齐单测覆盖',
  '实现键盘快捷键',
  '修复滚动边界问题',
  '评估 WebGL 回退策略',
  '清理 demo 代码',
]

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const defaultNotes = (): StickyNote[] => [
  { id: 1, text: '拖拽我移动位置', x: 24, y: 24, color: '#FFF59D', group: 'Idea' },
  { id: 2, text: '点击便签会置顶', x: 220, y: 38, color: '#B3E5FC', group: 'Task' },
  { id: 3, text: '右上角工具栏操作选中项', x: 88, y: 208, color: '#FFCCBC', group: 'Memo' },
  { id: 4, text: '支持保存 / 恢复布局', x: 286, y: 214, color: '#C8E6C9', group: 'Bug' },
]

const loadNotes = (): StickyNote[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultNotes()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultNotes()

    return parsed
      .filter((n) => n && typeof n.id === 'number' && typeof n.x === 'number' && typeof n.y === 'number')
      .map((n) => ({
        id: n.id,
        text: typeof n.text === 'string' ? n.text : 'Untitled',
        x: n.x,
        y: n.y,
        color: typeof n.color === 'string' ? n.color : PALETTE[0],
        group: GROUPS.includes(n.group) ? n.group : 'Memo',
      }))
  } catch {
    return defaultNotes()
  }
}

const StickyBoard = () => {
  const { width: W, height: H } = useWindowSize()
  const boardH = Math.max(120, H - HEADER_H)

  const [notes, setNotes] = useState<StickyNote[]>(() => loadNotes())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [message, setMessage] = useState('拖拽便签即可布局，点击可置顶')
  const nextIdRef = useRef(100)

  useEffect(() => {
    const maxId = notes.reduce((m, n) => Math.max(m, n.id), 0)
    nextIdRef.current = Math.max(nextIdRef.current, maxId + 1)
  }, [notes])

  useEffect(() => {
    setNotes((prev) => prev.map((note) => ({
      ...note,
      x: clamp(note.x, 0, Math.max(0, W - NOTE_W)),
      y: clamp(note.y, 0, Math.max(0, boardH - NOTE_H)),
    })))
  }, [W, boardH])

  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId])

  const bringToFront = (id: number) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id)
      if (idx < 0 || idx === prev.length - 1) return prev
      const next = [...prev]
      const [target] = next.splice(idx, 1)
      next.push(target)
      return next
    })
  }

  const addNote = () => {
    const id = nextIdRef.current++
    const text = PRESET_TEXTS[id % PRESET_TEXTS.length]
    const x = clamp(Math.floor(W / 2 - NOTE_W / 2 + (id % 5) * 14 - 28), 0, Math.max(0, W - NOTE_W))
    const y = clamp(Math.floor(boardH / 2 - NOTE_H / 2 + (id % 4) * 12 - 24), 0, Math.max(0, boardH - NOTE_H))
    const color = PALETTE[id % PALETTE.length]
    const group = GROUPS[id % GROUPS.length]

    setNotes((prev) => [...prev, { id, text, x, y, color, group }])
    setSelectedId(id)
    setMessage(`已新增便签 #${id}`)
  }

  const removeSelected = () => {
    if (selectedId === null) return
    setNotes((prev) => prev.filter((n) => n.id !== selectedId))
    setSelectedId(null)
    setMessage('已删除选中便签')
  }

  const cycleSelectedColor = () => {
    if (selectedId === null) return
    setNotes((prev) => prev.map((n) => {
      if (n.id !== selectedId) return n
      const idx = PALETTE.indexOf(n.color)
      const nextColor = PALETTE[(idx + 1 + PALETTE.length) % PALETTE.length]
      return { ...n, color: nextColor }
    }))
    setMessage('已切换颜色')
  }

  const cycleSelectedGroup = () => {
    if (selectedId === null) return
    setNotes((prev) => prev.map((n) => {
      if (n.id !== selectedId) return n
      const idx = GROUPS.indexOf(n.group)
      const nextGroup = GROUPS[(idx + 1) % GROUPS.length]
      return { ...n, group: nextGroup }
    }))
    setMessage('已切换标签')
  }

  const saveLayout = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      setMessage('布局已保存到 localStorage')
    } catch {
      setMessage('保存失败（存储不可用）')
    }
  }

  const restoreLayout = () => {
    const restored = loadNotes()
    setNotes(restored)
    setSelectedId(restored.length > 0 ? restored[restored.length - 1].id : null)
    setMessage('已恢复保存布局')
  }

  const resetLayout = () => {
    const seed = defaultNotes()
    setNotes(seed)
    setSelectedId(seed[0]?.id ?? null)
    setMessage('已重置为默认布局')
  }

  return (
    <Stack width={W} height={H}>
      <Column width={W} height={H}>
        <Container width={W} height={HEADER_H} color="#15202b" border={0}>
          <Padding padding={10}>
            <Column width={W - 20}>
              <Column>
                <Text text="Sticky Board V1" fontSize={20} color="#ffffff" fontWeight={FontWeight.W700} />
                <Text text={message} fontSize={12} color="rgba(255,255,255,0.7)" />
              </Column>
              <Padding padding={4} />
              <SingleChildScrollView width={W - 20} height={34} direction="horizontal">
                <Row>
                  <GestureDetector onTap={addNote}>
                    <Container width={72} height={32} color="#2e7d32" borderRadius={6}>
                      <Center width={72} height={32}><Text text="+ Add" fontSize={13} color="#fff" fontWeight={FontWeight.W600} /></Center>
                    </Container>
                  </GestureDetector>
                  <Padding padding={4} />
                  <GestureDetector onTap={saveLayout}>
                    <Container width={72} height={32} color="#1976d2" borderRadius={6}>
                      <Center width={72} height={32}><Text text="Save" fontSize={13} color="#fff" fontWeight={FontWeight.W600} /></Center>
                    </Container>
                  </GestureDetector>
                  <Padding padding={4} />
                  <GestureDetector onTap={restoreLayout}>
                    <Container width={72} height={32} color="#6a1b9a" borderRadius={6}>
                      <Center width={72} height={32}><Text text="Load" fontSize={13} color="#fff" fontWeight={FontWeight.W600} /></Center>
                    </Container>
                  </GestureDetector>
                  <Padding padding={4} />
                  <GestureDetector onTap={resetLayout}>
                    <Container width={72} height={32} color="#455a64" borderRadius={6}>
                      <Center width={72} height={32}><Text text="Reset" fontSize={13} color="#fff" fontWeight={FontWeight.W600} /></Center>
                    </Container>
                  </GestureDetector>
                </Row>
              </SingleChildScrollView>
            </Column>
          </Padding>
        </Container>

        <Container width={W} height={boardH} color="#f7f2e8" />
      </Column>

      {notes.map((note) => {
        const isSelected = note.id === selectedId
        return (
          <Positioned key={note.id} left={note.x} top={note.y + HEADER_H}>
            <GestureDetector
              onTap={() => {
                setSelectedId(note.id)
                bringToFront(note.id)
              }}
              onPanStart={() => {
                setSelectedId(note.id)
                bringToFront(note.id)
              }}
              onPanUpdate={(dx, dy) => {
                setNotes((prev) => prev.map((n) => (
                  n.id !== note.id
                    ? n
                    : {
                      ...n,
                      x: clamp(n.x + dx, 0, Math.max(0, W - NOTE_W)),
                      y: clamp(n.y + dy, 0, Math.max(0, boardH - NOTE_H)),
                    }
                )))
              }}
            >
              <Container
                width={NOTE_W}
                height={NOTE_H}
                color={note.color}
                borderRadius={10}
                border={isSelected ? 3 : 1}
                borderColor={isSelected ? '#1a237e' : 'rgba(0,0,0,0.2)'}
              >
                <Padding padding={10}>
                  <Column width={NOTE_W - 20} height={NOTE_H - 20}>
                    <Row width={NOTE_W - 20} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                      <Text text={`#${note.id}`} fontSize={11} color="#37474f" fontWeight={FontWeight.W600} />
                      <Text text={note.group} fontSize={11} color="#263238" fontWeight={FontWeight.W700} />
                    </Row>
                    <Padding padding={6} />
                    <Text text={note.text} fontSize={16} color="#263238" fontWeight={FontWeight.W600} />
                    <Padding padding={6} />
                    <Text text="拖拽移动 / 点击置顶" fontSize={11} color="rgba(0,0,0,0.55)" />
                  </Column>
                </Padding>
              </Container>
            </GestureDetector>
          </Positioned>
        )
      })}

      <Positioned right={12} bottom={12}>
        <Container width={194} height={126} color="rgba(21,32,43,0.92)" borderRadius={10}>
          <Padding padding={10}>
            <Column width={174}>
              <Text
                text={selected ? `Selected #${selected.id}` : 'No Selection'}
                fontSize={13}
                color="#fff"
                fontWeight={FontWeight.W700}
              />
              <Padding padding={6} />
              <Row width={174} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                <GestureDetector onTap={cycleSelectedColor}>
                  <Container width={54} height={28} color="#ef6c00" borderRadius={6}>
                    <Center width={54} height={28}><Text text="Color" fontSize={11} color="#fff" fontWeight={FontWeight.W700} /></Center>
                  </Container>
                </GestureDetector>
                <GestureDetector onTap={cycleSelectedGroup}>
                  <Container width={54} height={28} color="#00838f" borderRadius={6}>
                    <Center width={54} height={28}><Text text="Tag" fontSize={11} color="#fff" fontWeight={FontWeight.W700} /></Center>
                  </Container>
                </GestureDetector>
                <GestureDetector onTap={removeSelected}>
                  <Container width={54} height={28} color="#c62828" borderRadius={6}>
                    <Center width={54} height={28}><Text text="Delete" fontSize={11} color="#fff" fontWeight={FontWeight.W700} /></Center>
                  </Container>
                </GestureDetector>
              </Row>
              <Padding padding={8} />
              <Text
                text={selected ? `x=${Math.round(selected.x)} y=${Math.round(selected.y)}` : '点击任意便签开始操作'}
                fontSize={11}
                color="rgba(255,255,255,0.8)"
              />
            </Column>
          </Padding>
        </Container>
      </Positioned>
    </Stack>
  )
}

export default StickyBoard
