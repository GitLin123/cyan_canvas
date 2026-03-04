import React from 'react';
import {
  Container,
  Column,
  Row,
  Text,
  Stack,
  Positioned,
  Wrap,
  Expanded,
  Spacer,
  SizedBox,
  Opacity,
  ClipRRect,
} from '../core/adaptor/reconciler/components';
import { useWindowSize } from '../core/adaptor/reconciler';
import {
  MainAxisAlignment,
  CrossAxisAlignment,
} from '../core/types/enums';

// Row/Column 对齐演示
const RowColumnSection: React.FC = () => (
  <Column crossAxisAlignment={CrossAxisAlignment.Start}>
    <Text fontSize={14} color="#333">Row - 各种对齐方式</Text>
    <SizedBox height={8} />
    <Container width={400} height={50} color="#f0f0f0" borderRadius={6}>
      <Row mainAxisAlignment={MainAxisAlignment.SpaceBetween} crossAxisAlignment={CrossAxisAlignment.Center}>
        <Container width={50} height={30} color="#4A90D9" borderRadius={4}>
          <Text fontSize={10} color="#fff">Start</Text>
        </Container>
        <Container width={50} height={30} color="#E74C3C" borderRadius={4}>
          <Text fontSize={10} color="#fff">Mid</Text>
        </Container>
        <Container width={50} height={30} color="#2ECC71" borderRadius={4}>
          <Text fontSize={10} color="#fff">End</Text>
        </Container>
      </Row>
    </Container>
    <SizedBox height={12} />
    <Text fontSize={14} color="#333">Column - Center 对齐</Text>
    <SizedBox height={8} />
    <Container width={120} height={120} color="#f0f0f0" borderRadius={6}>
      <Column mainAxisAlignment={MainAxisAlignment.Center} crossAxisAlignment={CrossAxisAlignment.Center}>
        <Container width={80} height={25} color="#9B59B6" borderRadius={4}>
          <Text fontSize={10} color="#fff">Item 1</Text>
        </Container>
        <SizedBox height={6} />
        <Container width={80} height={25} color="#F39C12" borderRadius={4}>
          <Text fontSize={10} color="#fff">Item 2</Text>
        </Container>
      </Column>
    </Container>
  </Column>
);

// Stack + Positioned 层叠布局
const StackSection: React.FC = () => (
  <Column crossAxisAlignment={CrossAxisAlignment.Start}>
    <Text fontSize={14} color="#333">Stack + Positioned 层叠</Text>
    <SizedBox height={8} />
    <Stack width={200} height={150}>
      <Container width={200} height={150} color="#ECF0F1" borderRadius={8} />
      <Positioned left={10} top={10}>
        <Container width={100} height={60} color="#3498DB" borderRadius={6} opacity={0.8}>
          <Text fontSize={10} color="#fff">底层</Text>
        </Container>
      </Positioned>
      <Positioned left={50} top={40}>
        <Container width={100} height={60} color="#E74C3C" borderRadius={6} opacity={0.8}>
          <Text fontSize={10} color="#fff">中层</Text>
        </Container>
      </Positioned>
      <Positioned left={90} top={70}>
        <Container width={100} height={60} color="#2ECC71" borderRadius={6} opacity={0.8}>
          <Text fontSize={10} color="#fff">顶层</Text>
        </Container>
      </Positioned>
    </Stack>
  </Column>
);

// Wrap 流式布局
const WrapSection: React.FC = () => {
  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'];
  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">Wrap 流式布局</Text>
      <SizedBox height={8} />
      <Container width={250} color="#f0f0f0" borderRadius={6}>
        <Wrap spacing={6} runSpacing={6}>
          {colors.map((c, i) => (
            <Container key={i} width={50 + (i % 3) * 15} height={30} color={c} borderRadius={4}>
              <Text fontSize={10} color="#fff">{`Tag ${i + 1}`}</Text>
            </Container>
          ))}
        </Wrap>
      </Container>
    </Column>
  );
};

// Expanded + Spacer 弹性布局
const FlexSection: React.FC = () => (
  <Column crossAxisAlignment={CrossAxisAlignment.Start}>
    <Text fontSize={14} color="#333">Expanded / Spacer 弹性</Text>
    <SizedBox height={8} />
    <Container width={350} height={40} color="#f0f0f0" borderRadius={6}>
      <Row>
        <Expanded>
          <Container height={40} color="#3498DB" borderRadius={4}>
            <Text fontSize={10} color="#fff">Expanded</Text>
          </Container>
        </Expanded>
        <SizedBox width={4} />
        <Container width={60} height={40} color="#E74C3C" borderRadius={4}>
          <Text fontSize={10} color="#fff">Fixed</Text>
        </Container>
        <Spacer />
        <Container width={60} height={40} color="#2ECC71" borderRadius={4}>
          <Text fontSize={10} color="#fff">Fixed</Text>
        </Container>
      </Row>
    </Container>
  </Column>
);

// 效果节点：Opacity / ClipRRect / Container 装饰
const EffectsSection: React.FC = () => (
  <Column crossAxisAlignment={CrossAxisAlignment.Start}>
    <Text fontSize={14} color="#333">效果节点</Text>
    <SizedBox height={8} />
    <Row mainAxisAlignment={MainAxisAlignment.Start}>
      <Column crossAxisAlignment={CrossAxisAlignment.Center}>
        <Text fontSize={11} color="#666">Opacity 0.4</Text>
        <SizedBox height={4} />
        <Opacity opacity={0.4}>
          <Container width={70} height={70} color="#E74C3C" borderRadius={8}>
            <Text fontSize={10} color="#fff">半透明</Text>
          </Container>
        </Opacity>
      </Column>
      <SizedBox width={16} />
      <Column crossAxisAlignment={CrossAxisAlignment.Center}>
        <Text fontSize={11} color="#666">ClipRRect</Text>
        <SizedBox height={4} />
        <ClipRRect borderRadius={20}>
          <Container width={70} height={70} color="#3498DB">
            <Text fontSize={10} color="#fff">圆角裁剪</Text>
          </Container>
        </ClipRRect>
      </Column>
      <SizedBox width={16} />
      <Column crossAxisAlignment={CrossAxisAlignment.Center}>
        <Text fontSize={11} color="#666">装饰容器</Text>
        <SizedBox height={4} />
        <Container
          width={70}
          height={70}
          color="#2ECC71"
          borderRadius={12}
          border={3}
          borderColor="#27AE60"
        >
          <Text fontSize={10} color="#fff">边框</Text>
        </Container>
      </Column>
    </Row>
  </Column>
);

// 主组件
const ComponentDemo: React.FC = () => {
  const { width, height } = useWindowSize();

  return (
    <Container width={width} height={height} color="#fff">
      <Column mainAxisAlignment={MainAxisAlignment.Start} crossAxisAlignment={CrossAxisAlignment.Start}>
        <Container width={width} height={40} color="#2ECC71">
          <Text fontSize={18} color="#fff">组件/布局系统演示</Text>
        </Container>
        <Container x={16} y={8}>
          <Column crossAxisAlignment={CrossAxisAlignment.Start}>
            <Row mainAxisAlignment={MainAxisAlignment.Start}>
              <RowColumnSection />
              <SizedBox width={24} />
              <StackSection />
            </Row>
            <SizedBox height={20} />
            <WrapSection />
            <SizedBox height={20} />
            <FlexSection />
            <SizedBox height={20} />
            <EffectsSection />
          </Column>
        </Container>
      </Column>
    </Container>
  );
};

export default ComponentDemo;
