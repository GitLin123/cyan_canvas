import React, { useState } from 'react'
import {
  Column,
  Row,
  Rect,
  Text,
  Container,
  Padding,
  Center,
  GestureDetector,
  Listener,
  SingleChildScrollView,
} from '../core/adaptor/reconciler/components'
import { MainAxisAlignment, CrossAxisAlignment, FontWeight } from '../core/types/container'

const GestureDemo = () => {
  const [log, setLog] = useState<string[]>(['等待交互...'])
  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 8))

  const [tapCount, setTapCount] = useState(0)
  const [tapColor, setTapColor] = useState('#4CAF50')
  const [panPos, setPanPos] = useState({ x: 0, y: 0 })
  const [panColor, setPanColor] = useState('#2196F3')
  const [longPressColor, setLongPressColor] = useState('#FF9800')
  const [listenerColor, setListenerColor] = useState('#9C27B0')

  return (
    <SingleChildScrollView width={window.innerWidth} height={window.innerHeight}>
      <Column width={window.innerWidth}>
        {/* 标题 */}
        <Padding padding={16}>
          <Container width={window.innerWidth - 32} color="#1a1a2e" padding={16} borderRadius={10}>
            <Text text="🎯 手势系统测试" fontSize={24} fontWeight={FontWeight.W700} color="#ffffff" />
          </Container>
        </Padding>

        {/* Tap 测试 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 32}>
            <Text text="Tap 点击测试" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
            <Padding padding={8}>
              <GestureDetector
                onTap={() => {
                  setTapCount(c => c + 1)
                  setTapColor(tapColor === '#4CAF50' ? '#8BC34A' : '#4CAF50')
                  addLog(`onTap 触发 (第${tapCount + 1}次)`)
                }}
                onTapDown={() => {
                  setTapColor('#388E3C')
                  addLog('onTapDown 按下')
                }}
                onTapUp={() => addLog('onTapUp 抬起')}
              >
                <Container width={window.innerWidth - 64} height={80} color={tapColor} borderRadius={8} padding={16}>
                  <Center>
                    <Text text={`点击我！已点击 ${tapCount} 次`} fontSize={18} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </GestureDetector>
            </Padding>
          </Column>
        </Padding>

        {/* Pan 拖拽测试 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 32}>
            <Text text="Pan 拖拽测试" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
            <Padding padding={8}>
              <GestureDetector
                onPanStart={() => {
                  setPanColor('#1565C0')
                  addLog('onPanStart 开始拖拽')
                }}
                onPanUpdate={(dx: number, dy: number) => {
                  setPanPos(p => ({ x: p.x + dx, y: p.y + dy }))
                }}
                onPanEnd={() => {
                  setPanColor('#2196F3')
                  addLog(`onPanEnd 结束 偏移(${panPos.x.toFixed(0)},${panPos.y.toFixed(0)})`)
                }}
              >
                <Container width={window.innerWidth - 64} height={80} color={panColor} borderRadius={8} padding={16}>
                  <Center>
                    <Text
                      text={`拖拽我！偏移: (${panPos.x.toFixed(0)}, ${panPos.y.toFixed(0)})`}
                      fontSize={18} color="#fff" fontWeight={FontWeight.W600}
                    />
                  </Center>
                </Container>
              </GestureDetector>
            </Padding>
          </Column>
        </Padding>

        {/* LongPress 长按测试 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 32}>
            <Text text="LongPress 长按测试 (500ms)" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
            <Padding padding={8}>
              <GestureDetector
                onLongPress={() => {
                  setLongPressColor(c => c === '#FF9800' ? '#F44336' : '#FF9800')
                  addLog('onLongPress 长按触发！')
                }}
              >
                <Container width={window.innerWidth - 64} height={80} color={longPressColor} borderRadius={8} padding={16}>
                  <Center>
                    <Text text="长按我 500ms" fontSize={18} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </GestureDetector>
            </Padding>
          </Column>
        </Padding>

        {/* Listener 原始指针事件测试 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 32}>
            <Text text="Listener 原始指针事件" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
            <Padding padding={8}>
              <Listener
                onPointerDown={() => {
                  setListenerColor('#7B1FA2')
                  addLog('Listener: pointerDown')
                }}
                onPointerMove={() => setListenerColor('#AB47BC')}
                onPointerUp={() => {
                  setListenerColor('#9C27B0')
                  addLog('Listener: pointerUp')
                }}
              >
                <Container width={window.innerWidth - 64} height={80} color={listenerColor} borderRadius={8} padding={16}>
                  <Center>
                    <Text text="原始指针事件监听" fontSize={18} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </Listener>
            </Padding>
          </Column>
        </Padding>

        {/* Tap + Pan 竞争测试 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 32}>
            <Text text="竞技场测试: Tap + Pan 竞争" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
            <Padding padding={8}>
              <GestureDetector
                onTap={() => addLog('竞争: Tap 胜出！(短点击)')}
                onPanStart={() => addLog('竞争: Pan 胜出！(拖拽)')}
                onPanUpdate={(dx: number, dy: number) => {}}
                onPanEnd={() => addLog('竞争: Pan 结束')}
              >
                <Container width={window.innerWidth - 64} height={80} color="#607D8B" borderRadius={8} padding={16}>
                  <Center>
                    <Text text="短点击=Tap / 拖拽=Pan" fontSize={18} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </GestureDetector>
            </Padding>
          </Column>
        </Padding>

        {/* 事件日志 */}
        <Padding padding={16}>
          <Container width={window.innerWidth - 32} color="#263238" padding={16} borderRadius={8}>
            <Column width={window.innerWidth - 64}>
              <Text text="事件日志:" fontSize={14} fontWeight={FontWeight.W600} color="#80CBC4" />
              {log.map((msg, i) => (
                <Text key={i} text={`  ${msg}`} fontSize={13} color={i === 0 ? '#fff' : '#78909C'} />
              ))}
            </Column>
          </Container>
        </Padding>
      </Column>
    </SingleChildScrollView>
  )
}

export default GestureDemo
