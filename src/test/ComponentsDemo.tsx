import React from 'react'
import { Column, Row, Rect, Text, Container, Padding, Center, SingleChildScrollView } from '../core/adaptor/reconciler/components'
import { MainAxisAlignment, TextAlign, FontWeight } from '../core/types/container'

/**
 * Flutter 组件完整功能演示
 * 展示所有新增的 Flutter 对标属性
 */
const ComponentsDemo = () => {
  return (
    <SingleChildScrollView width={window.innerWidth} height={window.innerHeight}>
      <Column width={window.innerWidth}>
        {/* 标题 */}
        <Padding padding={16}>
          <Column width={window.innerWidth - 40}>
            <Text
              text="🎨 Flutter 组件完整功能演示"
              fontSize={28}
              color="#1a1a1a"
              fontWeight={FontWeight.W700}
              textAlign={TextAlign.Center}
            />
            <Text
              text="展示所有新增的 Flutter 对标属性"
              fontSize={14}
              color="#888"
              textAlign={TextAlign.Center}
              lineHeight={1.5}
            />
          </Column>
        </Padding>

        {/* ========== Text 组件示例 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={16}
            borderRadius={8}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 56}>
              <Text text="📝 Text 组件 - 新属性演示" fontSize={18} fontWeight={FontWeight.W600} />

              {/* TextAlign 示例 */}
              <Padding padding={8}>
                <Text
                  text="左对齐文本示例"
                  fontSize={14}
                  textAlign={TextAlign.Left}
                  color="#333"
                />
              </Padding>

              <Padding padding={8}>
                <Text
                  text="居中对齐文本示例"
                  fontSize={14}
                  textAlign={TextAlign.Center}
                  color="#333"
                  width={280}
                />
              </Padding>

              {/* FontWeight 示例 */}
              <Padding padding={8}>
                <Row width={300} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
                  <Text text="细体" fontSize={12} fontWeight={FontWeight.W300} />
                  <Text text="正常" fontSize={12} fontWeight={FontWeight.W400} />
                  <Text text="加粗" fontSize={12} fontWeight={FontWeight.W700} />
                </Row>
              </Padding>

              {/* LineHeight 示例 */}
              <Padding padding={8}>
                <Text
                  text="这是多行文本演示，使用较大的行高可以提升可读性和美观度。"
                  fontSize={12}
                  lineHeight={1.8}
                  color="#555"
                  width={280}
                />
              </Padding>

              {/* MaxLines 和 TextOverflow 示例 */}
              <Padding padding={8}>
                <Text
                  text="这是一个很长的文本，会被限制在最多两行，超出部分使用省略号表示..."
                  fontSize={12}
                  maxLines={2}
                  color="#555"
                  width={280}
                />
              </Padding>

              {/* Opacity 示例 */}
              <Padding padding={8}>
                <Row width={280} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
                  <Text text="100%" fontSize={12} opacity={1} color="#333" />
                  <Text text="70%" fontSize={12} opacity={0.7} color="#333" />
                  <Text text="40%" fontSize={12} opacity={0.4} color="#333" />
                </Row>
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* ========== Container 组件示例 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={16}
            borderRadius={8}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 56}>
              <Text text="📦 Container 组件 - 装饰和样式演示" fontSize={18} fontWeight={FontWeight.W600} />

              {/* 基础容器 */}
              <Padding padding={8}>
                <Container
                  width={150}
                  height={80}
                  color="#FF6B6B"
                  borderRadius={8}
                  padding={8}
                >
                  <Center width={134} height={64}>
                    <Text text="红色盒子" fontSize={14} color="#fff" />
                  </Center>
                </Container>
              </Padding>

              {/* 圆角容器 */}
              <Padding padding={8}>
                <Container
                  width={150}
                  height={80}
                  color="#4ECDC4"
                  borderRadius={16}
                  padding={8}
                >
                  <Center width={134} height={64}>
                    <Text text="圆角" fontSize={14} color="#fff" />
                  </Center>
                </Container>
              </Padding>

              {/* 带边框 */}
              <Padding padding={8}>
                <Container
                  width={150}
                  height={80}
                  color="#fff"
                  border={2}
                  borderColor="#45B7D1"
                  borderRadius={8}
                  padding={8}
                >
                  <Center width={134} height={64}>
                    <Text text="边框" fontSize={14} color="#45B7D1" />
                  </Center>
                </Container>
              </Padding>

              {/* Opacity 演示 */}
              <Padding padding={8}>
                <Text text="透明度变化演示" fontSize={12} color="#666" />
              </Padding>
              <Padding padding={8}>
                <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                  <Container width={60} height={60} color="#95E1D3" borderRadius={8} opacity={1} />
                  <Container width={60} height={60} color="#95E1D3" borderRadius={8} opacity={0.7} />
                  <Container width={60} height={60} color="#95E1D3" borderRadius={8} opacity={0.4} />
                </Row>
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* ========== Rect 组件示例 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={16}
            borderRadius={8}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 56}>
              <Text text="🎨 Rect 组件 - 形状演示" fontSize={18} fontWeight={FontWeight.W600} />

              {/* 基础矩形 */}
              <Padding padding={8}>
                <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
                  <Rect width={60} height={60} color="#FF6B6B" />
                  <Rect width={60} height={60} color="#4ECDC4" />
                  <Rect width={60} height={60} color="#45B7D1" />
                </Row>
              </Padding>

              {/* 圆角矩形 */}
              <Padding padding={8}>
                <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
                  <Rect width={60} height={60} color="#FFE66D" borderRadius={4} />
                  <Rect width={60} height={60} color="#95E1D3" borderRadius={8} />
                  <Rect width={60} height={60} color="#F38181" borderRadius={30} />
                </Row>
              </Padding>

              {/* 透明度演示 */}
              <Padding padding={8}>
                <Text text="不透明度变化演示" fontSize={12} color="#666" />
              </Padding>
              <Padding padding={8}>
                <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceAround}>
                  <Rect width={50} height={50} color="#AA96DA" opacity={1} />
                  <Rect width={50} height={50} color="#AA96DA" opacity={0.7} />
                  <Rect width={50} height={50} color="#AA96DA" opacity={0.4} />
                  <Rect width={50} height={50} color="#AA96DA" opacity={0.2} />
                </Row>
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* ========== Layout 组件示例 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={16}
            borderRadius={8}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 56}>
              <Text text="📐 Layout 组件 - 对齐演示" fontSize={18} fontWeight={FontWeight.W600} />

              {/* Column 对齐示例 */}
              <Padding padding={8}>
                <Text text="Column - Start 对齐" fontSize={12} color="#666" />
              </Padding>
              <Padding padding={8}>
                <Container
                  width={300}
                  height={120}
                  color="#f0f0f0"
                  borderRadius={4}
                  padding={4}
                >
                  <Column mainAxisAlignment={MainAxisAlignment.Start} height={112} width={292}>
                    <Rect width={40} height={20} color="#FF6B6B" />
                    <Padding padding={4}>
                      <Rect width={40} height={20} color="#4ECDC4" />
                    </Padding>
                  </Column>
                </Container>
              </Padding>

              {/* Row 对齐示例 */}
              <Padding padding={8}>
                <Text text="Row - SpaceEvenly 对齐" fontSize={12} color="#666" />
              </Padding>
              <Padding padding={8}>
                <Container
                  width={300}
                  height={60}
                  color="#f0f0f0"
                  borderRadius={4}
                  padding={4}
                >
                  <Row mainAxisAlignment={MainAxisAlignment.SpaceEvenly} width={292} height={52}>
                    <Rect width={30} height={30} color="#FF6B6B" />
                    <Rect width={30} height={30} color="#4ECDC4" />
                    <Rect width={30} height={30} color="#45B7D1" />
                  </Row>
                </Container>
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* 底部空白 */}
        <Padding padding={16}>
          <Text text="✅ Flutter 组件系统完善完成" fontSize={16} textAlign={TextAlign.Center} color="#666" />
        </Padding>
      </Column>
    </SingleChildScrollView>
  )
}

export default ComponentsDemo
