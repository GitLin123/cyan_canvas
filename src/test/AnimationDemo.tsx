import React, { useState } from 'react';
import {
  useNumberAnimation,
  Curves,
  AnimatedContainer,
  FadeTransition,
  ScaleTransition,
  useAnimation,
} from '../core/animation';
import {
  Container,
  Column,
  Row,
  Text,
  GestureDetector,
  SizedBox,
} from '../core/adaptor/reconciler/components';
import { useWindowSize } from '../core/adaptor/reconciler';
import { MainAxisAlignment, CrossAxisAlignment } from '../core/types/enums';

// 显式动画：useNumberAnimation 控制位移
const ExplicitAnimationSection: React.FC = () => {
  const { controller, animatedValue: x } = useNumberAnimation(0, 300, {
    duration: 2000,
    curve: Curves.easeInOut,
  });
  const [forward, setForward] = useState(true);

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">显式动画 - 位移 (easeInOut)</Text>
      <SizedBox height={8} />
      <Container width={380} height={60} color="#f0f0f0" borderRadius={8}>
        <Container x={x} y={10} width={40} height={40} color="#4A90D9" borderRadius={20} />
      </Container>
      <SizedBox height={8} />
      <GestureDetector onTap={() => {
        if (forward) controller.forward(); else controller.reverse();
        setForward(!forward);
      }}>
        <Container width={100} height={32} color="#4A90D9" borderRadius={6}>
          <Text fontSize={12} color="#fff">{forward ? '播放' : '反转'}</Text>
        </Container>
      </GestureDetector>
    </Column>
  );
};

// 隐式动画：AnimatedContainer 自动过渡
const ImplicitAnimationSection: React.FC = () => {
  const [big, setBig] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const colors = ['#E74C3C', '#2ECC71', '#9B59B6', '#F39C12'];

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">隐式动画 - AnimatedContainer</Text>
      <SizedBox height={8} />
      <AnimatedContainer
        width={big ? 200 : 80}
        height={big ? 80 : 80}
        color={colors[colorIdx]}
        borderRadius={big ? 20 : 8}
        animationDuration={600}
      >
        <Text fontSize={12} color="#fff">自动过渡</Text>
      </AnimatedContainer>
      <SizedBox height={8} />
      <Row mainAxisAlignment={MainAxisAlignment.Start}>
        <GestureDetector onTap={() => setBig(!big)}>
          <Container width={80} height={32} color="#2ECC71" borderRadius={6}>
            <Text fontSize={12} color="#fff">切换大小</Text>
          </Container>
        </GestureDetector>
        <SizedBox width={8} />
        <GestureDetector onTap={() => setColorIdx((colorIdx + 1) % colors.length)}>
          <Container width={80} height={32} color="#9B59B6" borderRadius={6}>
            <Text fontSize={12} color="#fff">切换颜色</Text>
          </Container>
        </GestureDetector>
      </Row>
    </Column>
  );
};

// 转场组件：FadeTransition / ScaleTransition
const TransitionSection: React.FC = () => {
  const { controller: fadeCtrl } = useAnimation({ duration: 1500, curve: Curves.easeIn, autoStart: false });
  const { controller: scaleCtrl } = useAnimation({ duration: 1500, curve: Curves.elasticOut, autoStart: false });

  return (
    <Column crossAxisAlignment={CrossAxisAlignment.Start}>
      <Text fontSize={14} color="#333">转场组件</Text>
      <SizedBox height={8} />
      <Row mainAxisAlignment={MainAxisAlignment.Start}>
        <Column crossAxisAlignment={CrossAxisAlignment.Center}>
          <Text fontSize={11} color="#666">FadeTransition</Text>
          <SizedBox height={4} />
          <FadeTransition animation={fadeCtrl} width={80} height={80} color="#E74C3C" borderRadius={8}>
            <Text fontSize={12} color="#fff">淡入淡出</Text>
          </FadeTransition>
          <SizedBox height={4} />
          <GestureDetector onTap={() => { fadeCtrl.reset(); fadeCtrl.forward(); }}>
            <Container width={60} height={28} color="#E74C3C" borderRadius={4}>
              <Text fontSize={10} color="#fff">播放</Text>
            </Container>
          </GestureDetector>
        </Column>
        <SizedBox width={24} />
        <Column crossAxisAlignment={CrossAxisAlignment.Center}>
          <Text fontSize={11} color="#666">ScaleTransition</Text>
          <SizedBox height={4} />
          <ScaleTransition animation={scaleCtrl} baseWidth={80} baseHeight={80} color="#2ECC71" borderRadius={8}>
            <Text fontSize={12} color="#fff">缩放</Text>
          </ScaleTransition>
          <SizedBox height={4} />
          <GestureDetector onTap={() => { scaleCtrl.reset(); scaleCtrl.forward(); }}>
            <Container width={60} height={28} color="#2ECC71" borderRadius={4}>
              <Text fontSize={10} color="#fff">播放</Text>
            </Container>
          </GestureDetector>
        </Column>
      </Row>
    </Column>
  );
};

// 主组件
const AnimationDemo: React.FC = () => {
  const { width, height } = useWindowSize();

  return (
    <Container width={width} height={height} color="#fff">
      <Column mainAxisAlignment={MainAxisAlignment.Start} crossAxisAlignment={CrossAxisAlignment.Start}>
        <Container width={width} height={40} color="#4A90D9">
          <Text fontSize={18} color="#fff">动画系统演示</Text>
        </Container>
        <SizedBox height={8} />
        <Container x={16} width={width - 32} height={height - 48}>
          <Column crossAxisAlignment={CrossAxisAlignment.Start}>
            <ExplicitAnimationSection />
            <SizedBox height={20} />
            <ImplicitAnimationSection />
            <SizedBox height={20} />
            <TransitionSection />
          </Column>
        </Container>
      </Column>
    </Container>
  );
};

export default AnimationDemo;