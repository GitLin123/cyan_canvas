import { useState } from 'react';
import { Column, Container, Text, Rect, Padding, Center } from '../core/adaptor/reconciler/components';
import { useNumberAnimation, Curves } from '../core/animation';
import { TextAlign, FontWeight } from '../core/types/container';

const MinimalAnimationTest = () => {
  const { controller: controller1, animatedValue: value1 } = useNumberAnimation(0, 100, {
    duration: 1000,
    curve: Curves.easeInOut,
    autoStart: false,
  });

  const handleTest1 = async () => {
    console.log('Test 1: Starting animation, value1=', value1);
    controller1.reset();
    await controller1.forward();
    console.log('Test 1: Animation completed');
  };

  const [size, setSize] = useState(50);

  return (
    <Column width={800} height={600}>
      <Container width={800} height={600} color="#f5f5f5">
        <Column width={800} height={600}>
          <Padding padding={20}>
            <Text
              text="🔍 动画诊断"
              fontSize={32}
              fontWeight={FontWeight.W700}
              color="#333"
              textAlign={TextAlign.Center}
            />
          </Padding>

          <Padding padding={20}>
            <Container width={760} color="#fff" padding={20} borderRadius={8} border={1} borderColor="#ddd">
              <Column width={720}>
                <Text text="测试1: useNumberAnimation" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
                <Padding padding={10} />
                <Container width={720} height={100} color="#f0f0f0" borderRadius={4}>
                  <Center width={720} height={100}>
                    <Rect width={Math.max(20, value1)} height={50} color="#FF6B6B" borderRadius={4} />
                  </Center>
                </Container>
                <Padding padding={10} />
                <Text text={`值: ${Math.round(value1)}`} fontSize={14} color="#666" />
                <Padding padding={10} />
                <Container width={200} height={40} color="#4CAF50" borderRadius={4} onClick={handleTest1}>
                  <Center width={200} height={40}>
                    <Text text="👆 播放" fontSize={14} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </Column>
            </Container>
          </Padding>

          <Padding padding={20}>
            <Container width={760} color="#fff" padding={20} borderRadius={8} border={1} borderColor="#ddd">
              <Column width={720}>
                <Text text="测试2: 状态更新" fontSize={16} fontWeight={FontWeight.W600} color="#333" />
                <Padding padding={10} />
                <Container width={720} height={100} color="#f0f0f0" borderRadius={4}>
                  <Center width={720} height={100}>
                    <Rect width={size} height={size} color="#4ECDC4" borderRadius={4} />
                  </Center>
                </Container>
                <Padding padding={10} />
                <Text text={`大小: ${size}px`} fontSize={14} color="#666" />
                <Padding padding={10} />
                <Container width={200} height={40} color="#2196F3" borderRadius={4} onClick={() => setSize(size === 50 ? 150 : 50)}>
                  <Center width={200} height={40}>
                    <Text text="👆 切换" fontSize={14} color="#fff" fontWeight={FontWeight.W600} />
                  </Center>
                </Container>
              </Column>
            </Container>
          </Padding>
        </Column>
      </Container>
    </Column>
  );
};

export default MinimalAnimationTest;
