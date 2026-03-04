import React, { useState } from 'react';
import {
  Container,
  Column,
  Row,
  Text,
  GestureDetector,
  Listener,
  SizedBox,
} from '../core/adaptor/reconciler/components';
import { useWindowSize } from '../core/adaptor/reconciler';
import { MainAxisAlignment, CrossAxisAlignment } from '../core/types/enums';

// Tap 点击变色
const TapSection: React.FC = () => {
  const colors = ['#4A90D9', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6'];
  const [colorIdx, setColorIdx] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">Tap - 点击变色</Text>
      <SizedBox height={8} />
      <GestureDetector onTap={() => {
        setColorIdx((colorIdx + 1) % colors.length);
        setTapCount(tapCount + 1);
      }}>
        <Container width={120} height={120} color={colors[colorIdx]} borderRadius={12}>
          <Text fontSize={16} color="#fff">{`点击 ${tapCount} 次`}</Text>
        </Container>
      </GestureDetector>
    </Column>
  );
};

// Pan 拖拽移动
const PanSection: React.FC = () => {
  const [pos, setPos] = useState({ x: 50, y: 20 });

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">Pan - 拖拽移动</Text>
      <SizedBox height={8} />
      <Container width={300} height={150} color="#f0f0f0" borderRadius={8}>
        <GestureDetector
          onPanUpdate={(dx, dy) => {
            setPos(p => ({
              x: Math.max(0, Math.min(240, p.x + dx)),
              y: Math.max(0, Math.min(90, p.y + dy)),
            }));
          }}
        >
          <Container x={pos.x} y={pos.y} width={60} height={60} color="#E74C3C" borderRadius={8}>
            <Text fontSize={10} color="#fff">拖我</Text>
          </Container>
        </GestureDetector>
      </Container>
    </Column>
  );
};

// LongPress 长按效果
const LongPressSection: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">LongPress - 长按触发</Text>
      <SizedBox height={8} />
      <GestureDetector onLongPress={() => {
        setPressed(true);
        setCount(c => c + 1);
        setTimeout(() => setPressed(false), 500);
      }}>
        <Container
          width={120}
          height={120}
          color={pressed ? '#F39C12' : '#9B59B6'}
          borderRadius={12}
        >
          <Text fontSize={12} color="#fff">{pressed ? '触发了!' : '长按我'}</Text>
          <Text fontSize={10} color="#fff">{`次数: ${count}`}</Text>
        </Container>
      </GestureDetector>
    </Column>
  );
};

// Listener 原始指针事件
const ListenerSection: React.FC = () => {
  const [info, setInfo] = useState({ x: 0, y: 0, type: '等待事件...' });

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">Listener - 原始指针事件</Text>
      <SizedBox height={8} />
      <Listener
        onPointerDown={(e: any) => setInfo({ x: e.localX ?? 0, y: e.localY ?? 0, type: 'PointerDown' })}
        onPointerMove={(e: any) => setInfo({ x: e.localX ?? 0, y: e.localY ?? 0, type: 'PointerMove' })}
        onPointerUp={(e: any) => setInfo({ x: e.localX ?? 0, y: e.localY ?? 0, type: 'PointerUp' })}
      >
        <Container width={250} height={120} color="#34495E" borderRadius={8}>
          <Column crossAxisAlignment={CrossAxisAlignment.Start}>
            <Text fontSize={12} color="#fff">{`事件: ${info.type}`}</Text>
            <Text fontSize={12} color="#fff">{`坐标: (${info.x.toFixed(1)}, ${info.y.toFixed(1)})`}</Text>
          </Column>
        </Container>
      </Listener>
    </Column>
  );
};

// 主组件
const EventDemo: React.FC = () => {
  const { width, height } = useWindowSize();

  return (
    <Container width={width} height={height} color="#fff">
      <Column mainAxisAlignment={MainAxisAlignment.Start} crossAxisAlignment={CrossAxisAlignment.Start}>
        <Container width={width} height={40} color="#E74C3C">
          <Text fontSize={18} color="#fff">事件系统演示</Text>
        </Container>
        <Container x={16} y={8}>
          <Column crossAxisAlignment={CrossAxisAlignment.Start}>
            <Row mainAxisAlignment={MainAxisAlignment.Start}>
              <TapSection />
              <SizedBox width={24} />
              <LongPressSection />
            </Row>
            <SizedBox height={20} />
            <PanSection />
            <SizedBox height={20} />
            <ListenerSection />
          </Column>
        </Container>
      </Column>
    </Container>
  );
};

export default EventDemo;
