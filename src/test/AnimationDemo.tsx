import React, { useState } from 'react';
import { Column, Row, Rect, Text, Container, Padding, Center, Circle } from '../core/adaptor/reconciler/components';
import { MainAxisAlignment, CrossAxisAlignment, TextAlign, FontWeight } from '../core/types/container';
import {
  useNumberAnimation,
  Curves,
  AnimationController,
  useSequenceAnimation,
  useStaggerAnimation,
  useImplicitNumberAnimation,
  AnimatedContainer,
  AnimatedOpacity,
  Interval,
  CurvedAnimation,
  Tween,
} from '../core/animation';

/**
 * 动画系统演示
 * 展示 Cyan Engine 的完整动画功能
 */
const AnimationDemo = () => {
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
      <Padding padding={16}>
        <Column width={w - 32}>
          <Text
            text="🎬 动画系统演示"
            fontSize={32}
            color="#1a1a1a"
            fontWeight={FontWeight.W700}
            textAlign={TextAlign.Center}
          />
          <Padding padding={8} />
          <Text
            text="展示 Cyan Engine 的完整动画功能：缓动曲线、数值动画、组合效果等"
            fontSize={14}
            color="#666"
            textAlign={TextAlign.Center}
            lineHeight={1.5}
          />
        </Column>
      </Padding>

      {/* 内容容器 */}
      <Column width={w} height={h - 130} crossAxisAlignment={CrossAxisAlignment.Center}>
        {/* 第一行：缓动曲线演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="1️⃣ 缓动曲线演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <AnimationCurveGrid w={w - 32} />
          </Column>
        </Padding>

        {/* 第二行：数值动画演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="2️⃣ 数值动画演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <NumberAnimationGrid w={w - 32} />
          </Column>
        </Padding>

        {/* 第三行：组合动画演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="3️⃣ 组合动画演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <CombinedAnimationDemo w={w - 32} />
          </Column>
        </Padding>

        {/* 第四行：序列动画演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="4️⃣ 序列动画演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <SequenceAnimationDemo w={w - 32} />
          </Column>
        </Padding>

        {/* 第五行：交错动画演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="5️⃣ 交错动画演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <StaggerAnimationDemo w={w - 32} />
          </Column>
        </Padding>

        {/* 第六行：隐式动画演示 */}
        <Padding padding={16}>
          <Column width={w - 32}>
            <Text
              text="6️⃣ 隐式动画演示"
              fontSize={20}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Padding padding={8} />
            <ImplicitAnimationDemo w={w - 32} />
          </Column>
        </Padding>
      </Column>

      {/* 底部提示 */}
      <Padding padding={16}>
        <Container
          width={w - 32}
          color="#fff8e1"
          padding={12}
          borderRadius={8}
          border={1}
          borderColor="#ffd54f"
        >
          <Text
            text="💡 点击任何动画元素可重新播放动画"
            fontSize={12}
            color="#f57f17"
            textAlign={TextAlign.Center}
          />
        </Container>
      </Padding>
    </Column>
  );
};

/**
 * 缓动曲线演示网格
 */
const AnimationCurveGrid = ({ w }: { w: number }) => {
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
      {/* 上面三个 */}
      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {curves.slice(0, 3).map((item) => (
          <CurvePreview key={item.name} name={item.name} curve={item.curve} />
        ))}
      </Row>
      <Padding padding={8} />
      {/* 下面三个 */}
      <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
        {curves.slice(3, 6).map((item) => (
          <CurvePreview key={item.name} name={item.name} curve={item.curve} />
        ))}
      </Row>
    </Column>
  );
};

/**
 * 单个缓动曲线预览
 */
const CurvePreview = ({ name, curve }: { name: string; curve: any }) => {
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
        <Text text={name} fontSize={12} fontWeight={FontWeight.W600} color="#333" textAlign={TextAlign.Center} />
      </Column>
    </Container>
  );
};

/**
 * 数值动画演示网格
 */
const NumberAnimationGrid = ({ w }: { w: number }) => {
  return (
    <Row mainAxisAlignment={MainAxisAlignment.SpaceAround} width={w}>
      <SizeAnimationCard title="尺寸变化" beginSize={50} endSize={150} color="#4CAF50" />
      <SizeAnimationCard title="旋转增长" beginSize={50} endSize={150} color="#2196F3" />
      <SizeAnimationCard title="弹性缩放" beginSize={50} endSize={150} color="#FF9800" curve={Curves.elasticOut} />
    </Row>
  );
};

/**
 * 尺寸动画卡片
 */
const SizeAnimationCard = ({
  title,
  beginSize,
  endSize,
  color,
  curve,
}: {
  title: string;
  beginSize: number;
  endSize: number;
  color: string;
  curve?: any;
}) => {
  const { controller, animatedValue } = useNumberAnimation(beginSize, endSize, {
    duration: 800,
    curve: curve || Curves.easeInOut,
    autoStart: false,
  });

  const handleClick = async () => {
    controller.reset();
    await controller.forward();
  };

  return (
    <Container
      width={140}
      height={180}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Column width={108} height={148} crossAxisAlignment={CrossAxisAlignment.Center}>
        {/* 动画区域 */}
        <Container width={140} height={100} color="transparent">
          <Center width={140} height={100}>
          </Center>
        </Container>
        <Padding padding={8} />
        <Text
          text={title}
          fontSize={12}
          fontWeight={FontWeight.W600}
          color="#333"
          textAlign={TextAlign.Center}
        />
        <Text
          text={`${Math.round(animatedValue)}px`}
          fontSize={11}
          color="#999"
          textAlign={TextAlign.Center}
        />
      </Column>
    </Container>
  );
};

/**
 * 组合动画演示
 */
const CombinedAnimationDemo = ({ w }: { w: number }) => {
  const { controller: scaleController, animatedValue: scale } = useNumberAnimation(50, 200, {
    duration: 1000,
    curve: Curves.easeInOut,
    autoStart: false,
  });

  const { controller: rotateController, animatedValue: rotation } = useNumberAnimation(0, 360, {
    duration: 1000,
    curve: Curves.linear,
    autoStart: false,
  });

  const handleClick = async () => {
    scaleController.reset();
    rotateController.reset();
    await Promise.all([scaleController.forward(), rotateController.forward()]);
  };

  return (
    <Container
      width={w}
      height={120}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Row width={w - 32} height={88} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        {/* 箱子 1: 缩放效果 */}
        <Container width={100} height={88} color="transparent">
          <Center width={100} height={88}>
            <Rect width={scale} height={scale} color="#FF6B6B" borderRadius={4} />
          </Center>
        </Container>

        {/* 箱子 2: 颜色变化 + 旋转提示 */}
        <Container width={100} height={88} color="transparent">
          <Center width={100} height={88}>
            <Column crossAxisAlignment={CrossAxisAlignment.Center}>
              <Padding padding={4} />
              <Text
                text={`旋转 ${Math.round(rotation)}°`}
                fontSize={10}
                color="#666"
                textAlign={TextAlign.Center}
              />
            </Column>
          </Center>
        </Container>

        {/* 箱子 3: 多步动画 */}
        <Container width={100} height={88} color="transparent">
          <Center width={100} height={88}>
            <Rect
              width={Math.abs(Math.sin((rotation * Math.PI) / 180)) * 100 + 20}
              height={Math.abs(Math.cos((rotation * Math.PI) / 180)) * 80 + 20}
              color="#FFD54F"
              borderRadius={4}
            />
          </Center>
        </Container>
      </Row>

      <Text
        text="👆 点击开始组合动画（同时进行缩放、旋转、变形）"
        fontSize={11}
        color="#999"
        textAlign={TextAlign.Center}
      />
    </Container>
  );
};

export default AnimationDemo;

/**
 * 序列动画演示 - 三个方块依次移动
 */
const SequenceAnimationDemo = ({ w }: { w: number }) => {
  const anim1 = new AnimationController({ duration: 300 });
  const anim2 = new AnimationController({ duration: 300 });
  const anim3 = new AnimationController({ duration: 300 });

  const { play, reset } = useSequenceAnimation(
    [
      { animation: anim1, duration: 300, curve: Curves.easeInOut },
      { animation: anim2, duration: 300, curve: Curves.easeInOut },
      { animation: anim3, duration: 300, curve: Curves.easeInOut },
    ],
    { autoStart: false }
  );

  const { animatedValue: value1 } = useTweenAnimationFromController(anim1, 0, 100);
  const { animatedValue: value2 } = useTweenAnimationFromController(anim2, 0, 100);
  const { animatedValue: value3 } = useTweenAnimationFromController(anim3, 0, 100);

  const handleClick = async () => {
    reset();
    await play();
  };

  return (
    <Container
      width={w}
      height={100}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Row width={w - 32} height={68} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Container width={50} height={68} color="transparent">
          <Center width={50} height={68}>
            <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} x={value1} />
          </Center>
        </Container>

        <Container width={50} height={68} color="transparent">
          <Center width={50} height={68}>
            <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} x={value2} />
          </Center>
        </Container>

        <Container width={50} height={68} color="transparent">
          <Center width={50} height={68}>
            <Rect width={30} height={30} color="#45B7D1" borderRadius={4} x={value3} />
          </Center>
        </Container>
      </Row>

      <Text
        text="👆 点击开始序列动画（三个方块依次移动）"
        fontSize={11}
        color="#999"
        textAlign={TextAlign.Center}
      />
    </Container>
  );
};

/**
 * 交错动画演示 - 多个方块错开时间开始动画
 */
const StaggerAnimationDemo = ({ w }: { w: number }) => {
  const anim1 = new AnimationController({ duration: 600 });
  const anim2 = new AnimationController({ duration: 600 });
  const anim3 = new AnimationController({ duration: 600 });

  const { play, reset } = useStaggerAnimation(
    [
      { animation: anim1, duration: 600, delay: 0, curve: Curves.easeInOut },
      { animation: anim2, duration: 600, delay: 100, curve: Curves.easeInOut },
      { animation: anim3, duration: 600, delay: 200, curve: Curves.easeInOut },
    ],
    { autoStart: false }
  );

  const { animatedValue: value1 } = useTweenAnimationFromController(anim1, 0, 150);
  const { animatedValue: value2 } = useTweenAnimationFromController(anim2, 0, 150);
  const { animatedValue: value3 } = useTweenAnimationFromController(anim3, 0, 150);

  const handleClick = async () => {
    reset();
    await play();
  };

  return (
    <Container
      width={w}
      height={100}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Row width={w - 32} height={68} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
        <Container width={60} height={68} color="transparent">
          <Center width={60} height={68}>
            <Rect width={Math.max(10, value1)} height={Math.max(10, value1)} color="#FF6B6B" borderRadius={4} />
          </Center>
        </Container>

        <Container width={60} height={68} color="transparent">
          <Center width={60} height={68}>
            <Rect width={Math.max(10, value2)} height={Math.max(10, value2)} color="#4ECDC4" borderRadius={4} />
          </Center>
        </Container>

        <Container width={60} height={68} color="transparent">
          <Center width={60} height={68}>
            <Rect width={Math.max(10, value3)} height={Math.max(10, value3)} color="#45B7D1" borderRadius={4} />
          </Center>
        </Container>
      </Row>

      <Text
        text="👆 点击开始交错动画（三个方块错开时间增长）"
        fontSize={11}
        color="#999"
        textAlign={TextAlign.Center}
      />
    </Container>
  );
};

/**
 * 隐式动画演示 - 自动响应属性变化
 */
const ImplicitAnimationDemo = ({ w }: { w: number }) => {
  const [isSmall, setIsSmall] = useState(true);

  const handleClick = () => {
    setIsSmall(!isSmall);
  };

  return (
    <Container
      width={w}
      height={120}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
      onClick={handleClick}
    >
      <Column width={w - 32} height={88} crossAxisAlignment={CrossAxisAlignment.Center}>
        <Padding padding={8} />
        <AnimatedContainer
          width={isSmall ? 50 : 150}
          height={isSmall ? 50 : 150}
          color={isSmall ? '#FF6B6B' : '#4ECDC4'}
          borderRadius={isSmall ? 4 : 20}
          animationDuration={500}
          animationCurve={Curves.easeInOut}
        />
        <Padding padding={16} />
        <Text
          text={isSmall ? '👆 点击放大' : '👆 点击缩小'}
          fontSize={11}
          color="#999"
          textAlign={TextAlign.Center}
        />
      </Column>
    </Container>
  );
};

/**
 * 从 Controller 提取动画值的辅助函数
 */
function useTweenAnimationFromController(controller: AnimationController, begin: number, end: number) {
  const [value, setValue] = React.useState(begin);

  React.useEffect(() => {
    const listener = (t: number) => {
      const tween = new Tween(begin, end);
      setValue(tween.lerp(t));
    };

    controller.addListener(listener);

    return () => {
      controller.removeListener(listener);
    };
  }, [controller, begin, end]);

  return { animatedValue: value };
}
