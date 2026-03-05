import React from 'react'
import {
  Column, Text, Container, SingleChildScrollView, Center, Padding,
} from '../core/adaptor/reconciler/components'
import { useWindowSize } from '../core/adaptor/reconciler'
import { FontWeight } from '../core/types/container'

const ScrollTest = () => {
  const { width: W, height: H } = useWindowSize()

  return (
    <Column width={W} height={H}>
      {/* 标题栏 */}
      <Container width={W} height={60} color="#1a1a2e">
        <Center width={W} height={60}>
          <Text
            text="滚动测试 - 请使用鼠标滚轮滚动"
            fontSize={18}
            fontWeight={FontWeight.W700}
            color="#fff"
          />
        </Center>
      </Container>

      {/* 可滚动内容区域 */}
      <SingleChildScrollView width={W} height={H - 60} direction="vertical">
        <Column width={W}>
          {/* 生成多个色块来测试滚动 */}
          {Array.from({ length: 20 }, (_, i) => (
            <Padding key={i} padding={20}>
              <Container
                width={W - 40}
                height={100}
                color={`hsl(${i * 18}, 70%, 60%)`}
                borderRadius={10}
              >
                <Center width={W - 40} height={100}>
                  <Text
                    text={`卡片 ${i + 1}`}
                    fontSize={24}
                    fontWeight={FontWeight.W600}
                    color="#fff"
                  />
                </Center>
              </Container>
            </Padding>
          ))}
        </Column>
      </SingleChildScrollView>
    </Column>
  )
}

export default ScrollTest
