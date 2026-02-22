/**
 * 动画系统完整测试 Demo
 * 展示 Cyan Canvas 动画系统的所有功能
 *
 * 包含：
 * 1. 基础动画 (Animation, AnimationController)
 * 2. 缓动曲线 (Curves, CurvedAnimation)
 * 3. 值插值 (Tween, ObjectTween, ColorTween)
 * 4. 组合动画 (SequenceAnimation, StaggerAnimation, Interval)
 * 5. 隐式动画 (useImplicitAnimation, AnimatedContainer)
 * 6. 高级模式 (AnimatedBuilder, Transitions)
 */

import React, { useState } from 'react';
import {
  Column,
  Row,
  Rect,
  Text,
  Container,
  Padding,
  Center,
  Circle,
} from '../core/adaptor/reconciler/components';
import {
  MainAxisAlignment,
  CrossAxisAlignment,
  TextAlign,
  FontWeight,
} from '../core/types/container';
import {
  // 基础
  useNumberAnimation,
  Curves,
  AnimationController,
  // 组合
  useSequenceAnimation,
  useStaggerAnimation,
  // 隐式
  AnimatedContainer,
  // 高级
  FadeTransition,
  ScaleTransition,
} from '../core/animation';

/**
 * 主演示组件
 */
const AnimationSystemDemo = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const w = windowSize.width;
  const h = windowSize.height;

  return (
    <Column width={w} height={h}>
      {/* 标题 */}
      <Padding padding={20}>
        <Column width={w - 40}>
          <Text
            text="🎬 Cyan Canvas 动画系统完整测试"
            fontSize={36}
            color="#1a1a1a"
            fontWeight={FontWeight.W700}
            textAlign={TextAlign.Center}
          />
          <Padding padding={10} />
          <Text
            text="展示动画系统的所有功能：基础、组合、隐式、高级模式"
            fontSize={14}
            color="#666"
            textAlign={TextAlign.Center}
            lineHeight={1.6}
          />
        </Column>
      </Padding>

      {/* 内容分组 */}
      <Column width={w} crossAxisAlignment={CrossAxisAlignment.Center}>
        {/* 第一组：基础动画和缓动曲线 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="Part 1️⃣ - 基础动画与缓动曲线"
              fontSize={22}
              fontWeight={FontWeight.W600}
              color="#2c3e50"
            />
            <Padding padding={12} />
            <BasicAnimationSection w={w - 32} />
          </Column>
        </Padding>

        {/* 第二组：组合动画 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="Part 2️⃣ - 组合动画（Sequence & Stagger）"
              fontSize={22}
              fontWeight={FontWeight.W600}
              color="#2c3e50"
            />
            <Padding padding={12} />
            <CompositeAnimationSection w={w - 32} />
          </Column>
        </Padding>

        {/* 第三组：隐式动画 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="Part 3️⃣ - 隐式动画（属性自动动画）"
              fontSize={22}
              fontWeight={FontWeight.W600}
              color="#2c3e50"
            />
            <Padding padding={12} />
            <ImplicitAnimationSection w={w - 32} />
          </Column>
        </Padding>

        {/* 第四组：高级模式 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="Part 4️⃣ - 高级动画（Builder & Transitions）"
              fontSize={22}
              fontWeight={FontWeight.W600}
              color="#2c3e50"
            />
            <Padding padding={12} />
            <AdvancedAnimationSection w={w - 32} />
          </Column>
        </Padding>

        {/* 第五组：综合示例 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="Part 5️⃣ - 综合示例（实际应用场景）"
              fontSize={22}
              fontWeight={FontWeight.W600}
              color="#2c3e50"
            />
            <Padding padding={12} />
            <IntegrationExampleSection w={w - 32} />
          </Column>
        </Padding>
      </Column>

      {/* 底部说明 */}
      <Padding padding={16}>
        <Container
          width={w - 32}
          color="#e8f5e9"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#4caf50"
        >
          <Text
            text="✅ 所有演示都支持点击重新播放 • 💡 观察帧率和性能 • 🎯 测试并发动画"
            fontSize={12}
            color="#2e7d32"
            textAlign={TextAlign.Center}
          />
        </Container>
      </Padding>
    </Column>
  );
};

/**
 * Part 1: 基础动画与缓动曲线
 */
const BasicAnimationSection = ({ w }: { w: number }) => {
  const curves = [
    { name: 'Linear', curve: Curves.linear },
    { name: 'EaseOut', curve: Curves.easeOut },
    { name: 'EaseIn', curve: Curves.easeIn },
    { name: 'EaseInOut', curve: Curves.easeInOut },
    { name: 'BounceOut', curve: Curves.bounceOut },
    { name: 'ElasticOut', curve: Curves.elasticOut },
  ];

  return (
    <Column width={w}>
      <Text
        text="演示 6 种缓动曲线，展示动画从快速开始到缓慢结束的过程"
        fontSize={12}
        color="#666"
        fontWeight={FontWeight.W400}
      />
      <Padding padding={8} />

      {/* 上面三个 */}
      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {curves.slice(0, 3).map((item) => (
          <CurveCard key={item.name} name={item.name} curve={item.curve} />
        ))}
      </Row>
      <Padding padding={12} />

      {/* 下面三个 */}
      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {curves.slice(3, 6).map((item) => (
          <CurveCard key={item.name} name={item.name} curve={item.curve} />
        ))}
      </Row>
    </Column>
  );
};

/**
 * 缓动曲线卡片
 */
const CurveCard = ({ name, curve }: { name: string; curve: any }) => {
  const { controller, animatedValue } = useNumberAnimation(0, 150, {
    duration: 1500,
    curve: curve,
    autoStart: false,
  });

  const handleClick = async () => {
    controller.reset();
    await controller.forward();
  };

  return (
    <Container
      width={140}
      height={140}
      color="#fff"
      padding={12}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Column width={116} height={116} crossAxisAlignment={CrossAxisAlignment.Center}>
        {/* 轨道 */}
        <Rect width={100} height={4} color="#e0e0e0" borderRadius={2} />
        {/* 移动的球 */}
        <Rect
          x={Math.max(0, animatedValue - 8)}
          y={-10}
          width={16}
          height={16}
          color="#FF6B6B"
          borderRadius={8}
        />
        <Padding padding={20} />
        <Text
          text={name}
          fontSize={12}
          fontWeight={FontWeight.W600}
          color="#333"
          textAlign={TextAlign.Center}
        />
      </Column>
    </Container>
  );
};

/**
 * Part 2: 组合动画
 */
const CompositeAnimationSection = ({ w }: { w: number }) => {
  return (
    <Column width={w}>
      <Text
        text="序列动画和交错动画展示，支持多个动画的时间协调"
        fontSize={12}
        color="#666"
        fontWeight={FontWeight.W400}
      />
      <Padding padding={8} />

      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        <SequenceAnimationCard w={(w - 32) / 2 - 8} />
        <StaggerAnimationCard w={(w - 32) / 2 - 8} />
      </Row>
    </Column>
  );
};

/**
 * 序列动画演示
 */
const SequenceAnimationCard = ({ w }: { w: number }) => {
  const anim1Ref = React.useRef(new AnimationController({ duration: 300 }));
  const anim2Ref = React.useRef(new AnimationController({ duration: 300 }));
  const anim3Ref = React.useRef(new AnimationController({ duration: 300 }));

  const { play, reset } = useSequenceAnimation(
    [
      { animation: anim1Ref.current, duration: 300, curve: Curves.easeInOut },
      { animation: anim2Ref.current, duration: 300, curve: Curves.easeInOut },
      { animation: anim3Ref.current, duration: 300, curve: Curves.easeInOut },
    ],
    { autoStart: false }
  );

  const [val1, setVal1] = React.useState(0);
  const [val2, setVal2] = React.useState(0);
  const [val3, setVal3] = React.useState(0);

  React.useEffect(() => {
    const listener1 = (t: number) => setVal1(t * 100);
    const listener2 = (t: number) => setVal2(t * 100);
    const listener3 = (t: number) => setVal3(t * 100);

    anim1Ref.current.addListener(listener1);
    anim2Ref.current.addListener(listener2);
    anim3Ref.current.addListener(listener3);

    return () => {
      anim1Ref.current.removeListener(listener1);
      anim2Ref.current.removeListener(listener2);
      anim3Ref.current.removeListener(listener3);
    };
  }, []);

  const handleClick = async () => {
    reset();
    await play();
  };

  return (
    <Container
      width={w}
      height={140}
      color="#fff"
      padding={12}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Column width={w - 24} height={116}>
        <Text
          text="序列动画"
          fontSize={12}
          fontWeight={FontWeight.W600}
          color="#333"
        />
        <Padding padding={8} />

        <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w - 24}>
          {[val1, val2, val3].map((val, i) => (
            <Container key={i} width={30} height={30} color="transparent">
              <Center width={30} height={30}>
                <Rect
                  width={Math.max(10, 10 + val * 0.2)}
                  height={Math.max(10, 10 + val * 0.2)}
                  color={['#FF6B6B', '#4ECDC4', '#45B7D1'][i]}
                  borderRadius={4}
                />
              </Center>
            </Container>
          ))}
        </Row>

        <Padding padding={4} />
        <Text
          text="👆 依次执行"
          fontSize={10}
          color="#999"
          textAlign={TextAlign.Center}
        />
      </Column>
    </Container>
  );
};

/**
 * 交错动画演示
 */
const StaggerAnimationCard = ({ w }: { w: number }) => {
  const anim1Ref = React.useRef(new AnimationController({ duration: 600 }));
  const anim2Ref = React.useRef(new AnimationController({ duration: 600 }));
  const anim3Ref = React.useRef(new AnimationController({ duration: 600 }));

  const { play, reset } = useStaggerAnimation(
    [
      { animation: anim1Ref.current, duration: 600, delay: 0, curve: Curves.easeInOut },
      { animation: anim2Ref.current, duration: 600, delay: 100, curve: Curves.easeInOut },
      { animation: anim3Ref.current, duration: 600, delay: 200, curve: Curves.easeInOut },
    ],
    { autoStart: false }
  );

  const [val1, setVal1] = React.useState(0);
  const [val2, setVal2] = React.useState(0);
  const [val3, setVal3] = React.useState(0);

  React.useEffect(() => {
    const listener1 = (t: number) => setVal1(t * 150);
    const listener2 = (t: number) => setVal2(t * 150);
    const listener3 = (t: number) => setVal3(t * 150);

    anim1Ref.current.addListener(listener1);
    anim2Ref.current.addListener(listener2);
    anim3Ref.current.addListener(listener3);

    return () => {
      anim1Ref.current.removeListener(listener1);
      anim2Ref.current.removeListener(listener2);
      anim3Ref.current.removeListener(listener3);
    };
  }, []);

  const handleClick = async () => {
    reset();
    await play();
  };

  return (
    <Container
      width={w}
      height={140}
      color="#fff"
      padding={12}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Column width={w - 24} height={116}>
        <Text
          text="交错动画"
          fontSize={12}
          fontWeight={FontWeight.W600}
          color="#333"
        />
        <Padding padding={8} />

        <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w - 24}>
          {[val1, val2, val3].map((val, i) => (
            <Container key={i} width={30} height={30} color="transparent">
              <Center width={30} height={30}>
                <Rect
                  width={Math.max(5, 5 + val * 0.05)}
                  height={Math.max(5, 5 + val * 0.05)}
                  color={['#FF6B6B', '#4ECDC4', '#45B7D1'][i]}
                  borderRadius={4}
                />
              </Center>
            </Container>
          ))}
        </Row>

        <Padding padding={4} />
        <Text
          text="👆 错开执行"
          fontSize={10}
          color="#999"
          textAlign={TextAlign.Center}
        />
      </Column>
    </Container>
  );
};

/**
 * Part 3: 隐式动画
 */
const ImplicitAnimationSection = ({ w }: { w: number }) => {
  const [isSmall, setIsSmall] = useState(true);
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Column width={w}>
      <Text
        text="属性变化时自动播放动画，无需手动创建 AnimationController"
        fontSize={12}
        color="#666"
        fontWeight={FontWeight.W400}
      />
      <Padding padding={8} />

      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {/* 尺寸变化 */}
        <Container
          width={(w - 32) / 2 - 8}
          height={160}
          color="#fff"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#e0e0e0"
          onClick={() => setIsSmall(!isSmall)}
        >
          <Column width={(w - 32) / 2 - 32} height={136} crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text
              text="尺寸动画"
              fontSize={12}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={12} />

            <Container width={(w - 32) / 2 - 32} height={80} color="transparent">
              <Center width={(w - 32) / 2 - 32} height={80}>
                <AnimatedContainer
                  width={isSmall ? 40 : 80}
                  height={isSmall ? 40 : 80}
                  color="#FF6B6B"
                  borderRadius={isSmall ? 4 : 12}
                  animationDuration={500}
                  animationCurve={Curves.easeInOut}
                />
              </Center>
            </Container>

            <Text
              text={isSmall ? '点击放大' : '点击缩小'}
              fontSize={10}
              color="#999"
            />
          </Column>
        </Container>

        {/* 透明度变化 */}
        <Container
          width={(w - 32) / 2 - 8}
          height={160}
          color="#fff"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#e0e0e0"
          onClick={() => setColor(color === '#FF6B6B' ? '#4ECDC4' : '#FF6B6B')}
        >
          <Column width={(w - 32) / 2 - 32} height={136} crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text
              text="颜色动画"
              fontSize={12}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={12} />

            <Container width={(w - 32) / 2 - 32} height={80} color="transparent">
              <Center width={(w - 32) / 2 - 32} height={80}>
                <AnimatedContainer
                  width={60}
                  height={60}
                  color={color}
                  borderRadius={8}
                  animationDuration={500}
                  animationCurve={Curves.easeInOut}
                />
              </Center>
            </Container>

            <Text
              text="点击改变颜色"
              fontSize={10}
              color="#999"
            />
          </Column>
        </Container>
      </Row>
    </Column>
  );
};

/**
 * Part 4: 高级动画（Builder & Transitions）
 */
const AdvancedAnimationSection = ({ w }: { w: number }) => {
  const controllerRef = React.useRef(new AnimationController({ duration: 1000, curve: Curves.easeInOut }));
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    controllerRef.current.reset();
    await controllerRef.current.forward();
    setIsPlaying(false);
  };

  return (
    <Column width={w}>
      <Text
        text="使用 AnimatedBuilder 和 Transitions 创建高级动画效果"
        fontSize={12}
        color="#666"
        fontWeight={FontWeight.W400}
      />
      <Padding padding={8} />

      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {/* FadeTransition */}
        <Container
          width={(w - 32) / 2 - 8}
          height={160}
          color="#fff"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#e0e0e0"
          onClick={handlePlay}
        >
          <Column width={(w - 32) / 2 - 32} height={136} crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text
              text="淡入淡出"
              fontSize={12}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={12} />

            <Container width={(w - 32) / 2 - 32} height={80} color="transparent">
              <Center width={(w - 32) / 2 - 32} height={80}>
                <FadeTransition animation={controllerRef.current} width={60} height={60} color="#FF6B6B" borderRadius={8} />
              </Center>
            </Container>

            <Text
              text={isPlaying ? '动画中...' : '👆 点击播放'}
              fontSize={10}
              color="#999"
            />
          </Column>
        </Container>

        {/* ScaleTransition */}
        <Container
          width={(w - 32) / 2 - 8}
          height={160}
          color="#fff"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#e0e0e0"
          onClick={handlePlay}
        >
          <Column width={(w - 32) / 2 - 32} height={136} crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text
              text="缩放动画"
              fontSize={12}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={12} />

            <Container width={(w - 32) / 2 - 32} height={80} color="transparent">
              <Center width={(w - 32) / 2 - 32} height={80}>
                <ScaleTransition
                  animation={controllerRef.current}
                  baseWidth={60}
                  baseHeight={60}
                  begin={0.5}
                  end={1}
                  color="#4ECDC4"
                  borderRadius={8}
                />
              </Center>
            </Container>

            <Text
              text={isPlaying ? '动画中...' : '👆 点击播放'}
              fontSize={10}
              color="#999"
            />
          </Column>
        </Container>
      </Row>
    </Column>
  );
};

/**
 * Part 5: 综合示例
 */
const IntegrationExampleSection = ({ w }: { w: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Column width={w}>
      <Text
        text="结合多种动画特性创建真实场景：点击卡片展开/收起"
        fontSize={12}
        color="#666"
        fontWeight={FontWeight.W400}
      />
      <Padding padding={12} />

      <AnimatedContainer
        width={isExpanded ? w : w - 32}
        height={isExpanded ? 300 : 120}
        color="#fff"
        padding={16}
        borderRadius={12}
        border={1}
        borderColor="#e0e0e0"
        animationDuration={500}
        animationCurve={Curves.easeInOut}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Column width={isExpanded ? w - 64 : w - 64} height={isExpanded ? 268 : 88}>
          <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={isExpanded ? w - 64 : w - 64}>
            <Container width={60} height={60} color="transparent">
              <Center width={60} height={60}>
                <Circle color="#FF6B6B" />
              </Center>
            </Container>

            <Column width={isExpanded ? w - 180 : w - 180}>
              <Text
                text={isExpanded ? '展开详情' : '卡片标题'}
                fontSize={14}
                fontWeight={FontWeight.W600}
                color="#333"
              />
              <Padding padding={4} />
              <Text
                text={isExpanded ? '这是展开后的详细内容区域' : '点击查看详情...'}
                fontSize={11}
                color="#666"
              />
            </Column>

            <Text
              text={isExpanded ? '👈' : '👉'}
              fontSize={20}
            />
          </Row>

          {isExpanded && (
            <>
              <Padding padding={12} />
              <Container
                width={isExpanded ? w - 64 : 0}
                height={150}
                color="#f5f5f5"
                padding={12}
                borderRadius={8}
                border={1}
                borderColor="#e0e0e0"
              >
                <Column width={isExpanded ? w - 88 : 0}>
                  <Text
                    text="✨ 这是展开的内容区域"
                    fontSize={12}
                    fontWeight={FontWeight.W600}
                    color="#333"
                  />
                  <Padding padding={8} />
                  <Text
                    text="支持动画化宽度、高度、颜色等多个属性"
                    fontSize={11}
                    color="#666"
                    lineHeight={1.6}
                  />
                  <Padding padding={8} />
                  <Text
                    text="可用于创建 Accordion、抽屉菜单、折叠面板等交互组件"
                    fontSize={11}
                    color="#666"
                    lineHeight={1.6}
                  />
                </Column>
              </Container>
            </>
          )}
        </Column>
      </AnimatedContainer>
    </Column>
  );
};

export default AnimationSystemDemo;
