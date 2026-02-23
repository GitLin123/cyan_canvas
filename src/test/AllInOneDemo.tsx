import React, { useState } from 'react'
import {
  Column, Row, Rect, Text, Container, Padding, Center,
  GestureDetector, Listener, SingleChildScrollView,
  Stack, Wrap, Flex, Align, SizedBox, AspectRatio,
  Expanded, Spacer, Positioned, Opacity, ClipRRect,
  Transform, ConstrainedBox, FractionallySizedBox,
  LimitedBox, FittedBox, OverflowBox, Offstage,
} from '../core/adaptor/reconciler/components'
import {
  MainAxisAlignment, CrossAxisAlignment, TextAlign,
  FontWeight, FontStyle, Alignment, BoxFit,
} from '../core/types/container'
import {
  useNumberAnimation, Curves, AnimationController,
  useSequenceAnimation,
  AnimatedContainer, Tween,
} from '../core/animation'

const W = window.innerWidth
const CARD_W = W - 48

// ==================== 通用组件 ====================
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Padding padding={12}>
    <Container width={CARD_W} color="#fff" padding={16} borderRadius={10} border={1} borderColor="#e0e0e0">
      <Column width={CARD_W - 32}>
        <Text text={title} fontSize={16} fontWeight={FontWeight.W600} color="#333" />
        <Padding padding={8} />
        {children}
      </Column>
    </Container>
  </Padding>
)

// ==================== Tab 按钮 ====================
const TABS = ['布局', '节点', '动画', '手势', '样式'] as const
type TabName = typeof TABS[number]

// ==================== 布局 Tab ====================
const LayoutTab = () => (
  <Column width={W}>
    {/* Column 对齐 */}
    <SectionCard title="Column 主轴对齐">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        {(['Start', 'Center', 'End'] as const).map(name => (
          <Column key={name} width={90}>
            <Text text={name} fontSize={11} color="#888" />
            <Container width={90} height={100} color="#f5f5f5" borderRadius={6} padding={4}>
              <Column mainAxisAlignment={MainAxisAlignment[name]} width={82} height={92}>
                <Rect width={40} height={20} color="#FF6B6B" borderRadius={3} />
                <Rect width={40} height={20} color="#4ECDC4" borderRadius={3} />
              </Column>
            </Container>
          </Column>
        ))}
      </Row>
    </SectionCard>

    {/* Row 对齐 */}
    <SectionCard title="Row SpaceEvenly">
      <Container width={CARD_W - 32} height={60} color="#f5f5f5" borderRadius={6} padding={4}>
        <Row mainAxisAlignment={MainAxisAlignment.SpaceEvenly} width={CARD_W - 40} height={52}>
          <Rect width={40} height={40} color="#FF6B6B" borderRadius={4} />
          <Rect width={40} height={40} color="#4ECDC4" borderRadius={4} />
          <Rect width={40} height={40} color="#45B7D1" borderRadius={4} />
        </Row>
      </Container>
    </SectionCard>

    {/* Stack */}
    <SectionCard title="Stack 层叠布局">
      <Stack width={CARD_W - 32} height={120}>
        <Rect width={CARD_W - 32} height={120} color="#f0f0f0" borderRadius={8} />
        <Positioned top={10} left={10}>
          <Rect width={50} height={50} color="#FF6B6B" borderRadius={8} />
        </Positioned>
        <Positioned top={10} right={10}>
          <Rect width={50} height={50} color="#4ECDC4" borderRadius={8} />
        </Positioned>
        <Positioned bottom={10} left={10}>
          <Rect width={50} height={50} color="#45B7D1" borderRadius={8} />
        </Positioned>
      </Stack>
    </SectionCard>

    {/* Wrap */}
    <SectionCard title="Wrap 流式布局">
      <Wrap width={CARD_W - 32} spacing={8} runSpacing={8}>
        {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#FF9800','#9C27B0'].map((c, i) => (
          <Rect key={i} width={70} height={40} color={c} borderRadius={6} />
        ))}
      </Wrap>
    </SectionCard>

    {/* Align */}
    <SectionCard title="Align 对齐定位">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        {[
          { label: 'TopLeft', align: Alignment.TopLeft },
          { label: 'Center', align: Alignment.Center },
          { label: 'BottomRight', align: Alignment.BottomRight },
        ].map(item => (
          <Column key={item.label}>
            <Text text={item.label} fontSize={10} color="#888" />
            <Container width={90} height={70} color="#f0f0f0" borderRadius={6}>
              <Align alignment={item.align} width={90} height={70}>
                <Rect width={30} height={30} color="#667eea" borderRadius={4} />
              </Align>
            </Container>
          </Column>
        ))}
      </Row>
    </SectionCard>

    <Padding padding={24} />
  </Column>
)
// ==================== 节点 Tab ====================
const NodesTab = () => (
  <Column width={W}>
    {/* Expanded */}
    <SectionCard title="Expanded 弹性填充 (1:2:1)">
      <Row width={CARD_W - 32} height={40}>
        <Expanded flex={1}><Rect width={100} height={40} color="#FF6B6B" borderRadius={4} /></Expanded>
        <Expanded flex={2}><Rect width={100} height={40} color="#4ECDC4" borderRadius={4} /></Expanded>
        <Expanded flex={1}><Rect width={100} height={40} color="#45B7D1" borderRadius={4} /></Expanded>
      </Row>
    </SectionCard>

    {/* Spacer */}
    <SectionCard title="Spacer 弹性空白">
      <Row width={CARD_W - 32} height={40}>
        <Rect width={60} height={40} color="#FF6B6B" borderRadius={4} />
        <Spacer />
        <Rect width={60} height={40} color="#4ECDC4" borderRadius={4} />
      </Row>
    </SectionCard>

    {/* Opacity */}
    <SectionCard title="Opacity 透明度 (1.0 / 0.5 / 0.2)">
      <Row width={CARD_W - 32} height={50} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Opacity opacity={1.0}><Rect width={60} height={50} color="#667eea" borderRadius={8} /></Opacity>
        <Opacity opacity={0.5}><Rect width={60} height={50} color="#667eea" borderRadius={8} /></Opacity>
        <Opacity opacity={0.2}><Rect width={60} height={50} color="#667eea" borderRadius={8} /></Opacity>
      </Row>
    </SectionCard>

    {/* ClipRRect */}
    <SectionCard title="ClipRRect 圆角裁剪">
      <Row width={CARD_W - 32} height={60} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <ClipRRect borderRadius={8}><Rect width={60} height={60} color="#e17055" /></ClipRRect>
        <ClipRRect borderRadius={20}><Rect width={60} height={60} color="#00b894" /></ClipRRect>
        <ClipRRect borderRadius={30}><Rect width={60} height={60} color="#0984e3" /></ClipRRect>
      </Row>
    </SectionCard>

    {/* Transform */}
    <SectionCard title="Transform 变换">
      <Row width={CARD_W - 32} height={60} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Transform scaleX={1.2} scaleY={1.2}><Rect width={50} height={50} color="#FF6B6B" borderRadius={4} /></Transform>
        <Transform rotation={0.3}><Rect width={50} height={50} color="#4ECDC4" borderRadius={4} /></Transform>
        <Transform translateX={20} translateY={-10}><Rect width={50} height={50} color="#45B7D1" borderRadius={4} /></Transform>
      </Row>
    </SectionCard>

    {/* Offstage */}
    <SectionCard title="Offstage 隐藏/显示">
      <Row width={CARD_W - 32} height={50}>
        <Offstage offstage={false}><Rect width={60} height={50} color="#00b894" borderRadius={8} /></Offstage>
        <Padding padding={8} />
        <Offstage offstage={true}><Rect width={60} height={50} color="#e17055" borderRadius={8} /></Offstage>
        <Text text="← 第二个被隐藏" fontSize={12} color="#888" />
      </Row>
    </SectionCard>

    <Padding padding={24} />
  </Column>
)
// ==================== 动画 Tab ====================

/** 缓动曲线预览 */
const CurvePreview = ({ name, curve }: { name: string; curve: any }) => {
  const { controller, animatedValue } = useNumberAnimation(0, 100, {
    duration: 1500, curve, autoStart: false,
  })
  const handleClick = async () => { controller.reset(); await controller.forward() }
  return (
    <Container width={100} height={100} color="#fff" padding={8} borderRadius={8} border={1} borderColor="#e0e0e0" onClick={handleClick}>
      <Column width={84} height={84} crossAxisAlignment={CrossAxisAlignment.Center}>
        <Rect width={80} height={4} color="#e0e0e0" borderRadius={2} />
        <Rect x={Math.max(0, animatedValue * 0.7)} y={-8} width={12} height={12} color="#FF6B6B" borderRadius={6} />
        <Padding padding={16} />
        <Text text={name} fontSize={10} fontWeight={FontWeight.W600} color="#333" textAlign={TextAlign.Center} />
      </Column>
    </Container>
  )
}

/** 序列动画 */
const SequenceDemo = ({ w }: { w: number }) => {
  const a1 = React.useRef(new AnimationController({ duration: 300 })).current
  const a2 = React.useRef(new AnimationController({ duration: 300 })).current
  const a3 = React.useRef(new AnimationController({ duration: 300 })).current
  const { play, reset } = useSequenceAnimation(
    [{ animation: a1, duration: 300, curve: Curves.easeInOut },
     { animation: a2, duration: 300, curve: Curves.easeInOut },
     { animation: a3, duration: 300, curve: Curves.easeInOut }],
    { autoStart: false }
  )
  const v1 = useTweenValue(a1, 0, 80)
  const v2 = useTweenValue(a2, 0, 80)
  const v3 = useTweenValue(a3, 0, 80)
  const handleClick = async () => { reset(); await play() }
  return (
    <Container width={w} height={80} color="#fff" padding={12} borderRadius={8} border={1} borderColor="#e0e0e0" onClick={handleClick}>
      <Row width={w - 24} height={56} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Rect width={24} height={24} color="#FF6B6B" borderRadius={4} x={v1} />
        <Rect width={24} height={24} color="#4ECDC4" borderRadius={4} x={v2} />
        <Rect width={24} height={24} color="#45B7D1" borderRadius={4} x={v3} />
      </Row>
    </Container>
  )
}

/** 隐式动画 */
const ImplicitDemo = ({ w }: { w: number }) => {
  const [big, setBig] = useState(false)
  return (
    <Container width={w} height={90} color="#fff" padding={12} borderRadius={8} border={1} borderColor="#e0e0e0" onClick={() => setBig(!big)}>
      <Column width={w - 24} height={66} crossAxisAlignment={CrossAxisAlignment.Center}>
        <AnimatedContainer
          width={big ? 120 : 40} height={big ? 60 : 40}
          color={big ? '#4ECDC4' : '#FF6B6B'}
          borderRadius={big ? 16 : 4}
          animationDuration={500} animationCurve={Curves.easeInOut}
        />
        <Padding padding={4} />
        <Text text="点击切换" fontSize={10} color="#999" />
      </Column>
    </Container>
  )
}

/** 从 Controller 提取 tween 值 */
function useTweenValue(controller: AnimationController, begin: number, end: number) {
  const [value, setValue] = React.useState(begin)
  React.useEffect(() => {
    const listener = (t: number) => setValue(new Tween(begin, end).lerp(t))
    controller.addListener(listener)
    return () => { controller.removeListener(listener) }
  }, [controller, begin, end])
  return value
}

const AnimationTab = () => (
  <Column width={W}>
    {/* 缓动曲线 */}
    <SectionCard title="缓动曲线 (点击播放)">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <CurvePreview name="Linear" curve={Curves.linear} />
        <CurvePreview name="EaseOut" curve={Curves.easeOut} />
        <CurvePreview name="Bounce" curve={Curves.bounceOut} />
      </Row>
    </SectionCard>

    {/* 数值动画 */}
    <SectionCard title="数值动画 (点击播放)">
      <SizeAnimCard title="缩放" begin={30} end={120} color="#4CAF50" />
      <Padding padding={8} />
      <SizeAnimCard title="弹性" begin={30} end={120} color="#FF9800" curve={Curves.elasticOut} />
    </SectionCard>

    {/* 序列动画 */}
    <SectionCard title="序列动画 (点击播放)">
      <SequenceDemo w={CARD_W - 32} />
    </SectionCard>

    {/* 隐式动画 */}
    <SectionCard title="隐式动画 (点击切换)">
      <ImplicitDemo w={CARD_W - 32} />
    </SectionCard>

    <Padding padding={24} />
  </Column>
)

/** 尺寸动画卡片 */
const SizeAnimCard = ({ title, begin, end, color, curve }: {
  title: string; begin: number; end: number; color: string; curve?: any
}) => {
  const { controller, animatedValue } = useNumberAnimation(begin, end, {
    duration: 800, curve: curve || Curves.easeInOut, autoStart: false,
  })
  const handleClick = async () => { controller.reset(); await controller.forward() }
  return (
    <Container width={CARD_W - 32} height={80} color="#f5f5f5" borderRadius={8} onClick={handleClick}>
      <Center width={CARD_W - 32} height={80}>
        <Row mainAxisAlignment={MainAxisAlignment.Center} width={CARD_W - 32}>
          <Rect width={animatedValue} height={animatedValue} color={color} borderRadius={4} />
          <Padding padding={12} />
          <Column>
            <Text text={title} fontSize={12} fontWeight={FontWeight.W600} color="#333" />
            <Text text={`${Math.round(animatedValue)}px`} fontSize={10} color="#999" />
          </Column>
        </Row>
      </Center>
    </Container>
  )
}
// ==================== 手势 Tab ====================
const GestureTab = () => {
  const [log, setLog] = useState<string[]>(['等待交互...'])
  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 6))
  const [tapCount, setTapCount] = useState(0)
  const [tapColor, setTapColor] = useState('#4CAF50')
  const [panPos, setPanPos] = useState({ x: 0, y: 0 })
  const [longPressColor, setLongPressColor] = useState('#FF9800')

  return (
    <Column width={W}>
      {/* Tap */}
      <Padding padding={12}>
        <Column width={CARD_W}>
          <Text text="Tap 点击测试" fontSize={14} fontWeight={FontWeight.W600} color="#333" />
          <Padding padding={6}>
            <GestureDetector
              onTap={() => { setTapCount(c => c + 1); setTapColor(c => c === '#4CAF50' ? '#8BC34A' : '#4CAF50'); addLog(`Tap #${tapCount + 1}`) }}
              onTapDown={() => { setTapColor('#388E3C'); addLog('TapDown') }}
              onTapUp={() => addLog('TapUp')}
            >
              <Container width={CARD_W} height={60} color={tapColor} borderRadius={8}>
                <Center><Text text={`点击我！已点击 ${tapCount} 次`} fontSize={16} color="#fff" fontWeight={FontWeight.W600} /></Center>
              </Container>
            </GestureDetector>
          </Padding>
        </Column>
      </Padding>

      {/* Pan */}
      <Padding padding={12}>
        <Column width={CARD_W}>
          <Text text="Pan 拖拽测试" fontSize={14} fontWeight={FontWeight.W600} color="#333" />
          <Padding padding={6}>
            <GestureDetector
              onPanStart={() => addLog('PanStart')}
              onPanUpdate={(dx: number, dy: number) => setPanPos(p => ({ x: p.x + dx, y: p.y + dy }))}
              onPanEnd={() => addLog(`PanEnd (${panPos.x.toFixed(0)},${panPos.y.toFixed(0)})`)}
            >
              <Container width={CARD_W} height={60} color="#2196F3" borderRadius={8}>
                <Center><Text text={`偏移: (${panPos.x.toFixed(0)}, ${panPos.y.toFixed(0)})`} fontSize={16} color="#fff" fontWeight={FontWeight.W600} /></Center>
              </Container>
            </GestureDetector>
          </Padding>
        </Column>
      </Padding>

      {/* LongPress */}
      <Padding padding={12}>
        <Column width={CARD_W}>
          <Text text="LongPress 长按 (500ms)" fontSize={14} fontWeight={FontWeight.W600} color="#333" />
          <Padding padding={6}>
            <GestureDetector onLongPress={() => { setLongPressColor(c => c === '#FF9800' ? '#F44336' : '#FF9800'); addLog('LongPress!') }}>
              <Container width={CARD_W} height={60} color={longPressColor} borderRadius={8}>
                <Center><Text text="长按我" fontSize={16} color="#fff" fontWeight={FontWeight.W600} /></Center>
              </Container>
            </GestureDetector>
          </Padding>
        </Column>
      </Padding>

      {/* Arena */}
      <Padding padding={12}>
        <Column width={CARD_W}>
          <Text text="竞技场: Tap + Pan 竞争" fontSize={14} fontWeight={FontWeight.W600} color="#333" />
          <Padding padding={6}>
            <GestureDetector
              onTap={() => addLog('竞争: Tap 胜出')}
              onPanStart={() => addLog('竞争: Pan 胜出')}
              onPanUpdate={() => {}}
              onPanEnd={() => addLog('竞争: Pan 结束')}
            >
              <Container width={CARD_W} height={60} color="#607D8B" borderRadius={8}>
                <Center><Text text="短点击=Tap / 拖拽=Pan" fontSize={14} color="#fff" fontWeight={FontWeight.W600} /></Center>
              </Container>
            </GestureDetector>
          </Padding>
        </Column>
      </Padding>

      {/* 日志 */}
      <Padding padding={12}>
        <Container width={CARD_W} color="#263238" padding={12} borderRadius={8}>
          <Column width={CARD_W - 24}>
            <Text text="事件日志:" fontSize={13} fontWeight={FontWeight.W600} color="#80CBC4" />
            {log.map((msg, i) => (
              <Text key={i} text={`  ${msg}`} fontSize={12} color={i === 0 ? '#fff' : '#78909C'} />
            ))}
          </Column>
        </Container>
      </Padding>

      <Padding padding={24} />
    </Column>
  )
}

// ==================== 样式 Tab ====================
const StyleTab = () => (
  <Column width={W}>
    {/* Text 属性 */}
    <SectionCard title="Text 文本属性">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Text text="W300" fontSize={14} fontWeight={FontWeight.W300} color="#333" />
        <Text text="W400" fontSize={14} fontWeight={FontWeight.W400} color="#333" />
        <Text text="W700" fontSize={14} fontWeight={FontWeight.W700} color="#333" />
      </Row>
      <Padding padding={8} />
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Text text="Normal" fontSize={14} fontStyle={FontStyle.Normal} color="#333" />
        <Text text="Italic" fontSize={14} fontStyle={FontStyle.Italic} color="#333" />
      </Row>
      <Padding padding={8} />
      <Text text="左对齐" fontSize={13} textAlign={TextAlign.Left} color="#555" width={CARD_W - 32} />
      <Text text="居中对齐" fontSize={13} textAlign={TextAlign.Center} color="#555" width={CARD_W - 32} />
      <Text text="右对齐" fontSize={13} textAlign={TextAlign.Right} color="#555" width={CARD_W - 32} />
    </SectionCard>

    {/* Container 装饰 */}
    <SectionCard title="Container 装饰">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Container width={80} height={60} color="#FF6B6B" borderRadius={8} padding={8}>
          <Center width={64} height={44}><Text text="圆角" fontSize={12} color="#fff" /></Center>
        </Container>
        <Container width={80} height={60} color="#4ECDC4" borderRadius={30} padding={8}>
          <Center width={64} height={44}><Text text="胶囊" fontSize={12} color="#fff" /></Center>
        </Container>
        <Container width={80} height={60} color="#fff" border={2} borderColor="#667eea" borderRadius={8} padding={8}>
          <Center width={64} height={44}><Text text="边框" fontSize={12} color="#667eea" /></Center>
        </Container>
      </Row>
    </SectionCard>

    {/* Text opacity */}
    <SectionCard title="Text 透明度">
      <Row width={CARD_W - 32} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Text text="100%" fontSize={14} opacity={1} color="#333" />
        <Text text="70%" fontSize={14} opacity={0.7} color="#333" />
        <Text text="40%" fontSize={14} opacity={0.4} color="#333" />
      </Row>
    </SectionCard>

    {/* 多行文本 */}
    <SectionCard title="多行文本 & 行高">
      <Text
        text="这是多行文本演示，使用较大的行高可以提升可读性和美观度。Cyan Engine 支持完整的文本属性。"
        fontSize={13} lineHeight={1.8} color="#555" width={CARD_W - 32}
      />
    </SectionCard>

    <Padding padding={24} />
  </Column>
)
// ==================== 主组件 ====================
const AllInOneDemo = () => {
  const [activeTab, setActiveTab] = useState<TabName>('布局')

  const renderTab = () => {
    switch (activeTab) {
      case '布局': return <LayoutTab />
      case '节点': return <NodesTab />
      case '动画': return <AnimationTab />
      case '手势': return <GestureTab />
      case '样式': return <StyleTab />
    }
  }

  return (
    <Column width={W} height={window.innerHeight}>
      {/* 标题 */}
      <Container width={W} height={44} color="#1a1a2e" padding={12}>
        <Center>
          <Text text="Cyan Engine 综合测试" fontSize={20} fontWeight={FontWeight.W700} color="#fff" />
        </Center>
      </Container>

      {/* Tab 栏 */}
      <Container width={W} height={52} color="#1a1a2e" padding={8}>
        <Row width={W - 16} mainAxisAlignment={MainAxisAlignment.SpaceEvenly}>
          {TABS.map(tab => (
            <GestureDetector key={tab} onTap={() => setActiveTab(tab)}>
              <Container
                width={Math.floor((W - 40) / TABS.length)}
                height={36}
                color={activeTab === tab ? '#667eea' : '#2d2d4e'}
                borderRadius={18}
              >
                <Center>
                  <Text text={tab} fontSize={13} color="#fff" fontWeight={activeTab === tab ? FontWeight.W700 : FontWeight.W400} />
                </Center>
              </Container>
            </GestureDetector>
          ))}
        </Row>
      </Container>

      {/* 内容 */}
      <SingleChildScrollView width={W} height={window.innerHeight - 96}>
        {renderTab()}
      </SingleChildScrollView>
    </Column>
  )
}

export default AllInOneDemo