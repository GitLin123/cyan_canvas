import React from 'react'
import {
  Column,
  Row,
  Rect,
  Text,
  Container,
  Padding,
  Stack,
  SizedBox,
  SingleChildScrollView,
  Expanded,
  Spacer,
  Positioned,
  Opacity,
  ClipRRect,
  Transform,
  ConstrainedBox,
  FractionallySizedBox,
  LimitedBox,
  FittedBox,
  OverflowBox,
  Offstage,
} from '../core/adaptor/reconciler/components'
import { MainAxisAlignment, CrossAxisAlignment, TextAlign, FontWeight, BoxFit } from '../core/types/container'

const W = window.innerWidth
const CARD_W = W - 48

const SectionTitle = ({ text }: { text: string }) => (
  <Padding padding={16}>
    <Text text={text} fontSize={20} fontWeight={FontWeight.W600} color="#333" />
  </Padding>
)

const Label = ({ text }: { text: string }) => (
  <Padding padding={4}>
    <Text text={text} fontSize={12} color="#888" />
  </Padding>
)

/**
 * 新节点完整演示
 * 测试 12 个新增的 Flutter 风格基础节点
 */
const NewNodesDemo = () => {
  return (
    <SingleChildScrollView width={W} height={window.innerHeight}>
      <Column width={W}>

        {/* 标题 */}
        <Padding padding={24}>
          <Container width={CARD_W} color="#764ba2" padding={24} borderRadius={12}>
            <Column width={CARD_W - 48} crossAxisAlignment={CrossAxisAlignment.Center}>
              <Text text="🧩 新节点演示" fontSize={28} fontWeight={FontWeight.W700} color="#fff" textAlign={TextAlign.Center} />
              <Padding padding={8}>
                <Text text="测试 12 个新增的 Flutter 风格基础节点" fontSize={14} color="rgba(255,255,255,0.9)" textAlign={TextAlign.Center} />
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* ===== 1. Expanded ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="1. Expanded - 弹性填充" />
              <Label text="三个子项 flex 比例 1:2:1" />
              <Row width={CARD_W - 40} height={50}>
                <Expanded flex={1}>
                  <Rect width={100} height={50} color="#FF6B6B" borderRadius={4} />
                </Expanded>
                <Expanded flex={2}>
                  <Rect width={100} height={50} color="#4ECDC4" borderRadius={4} />
                </Expanded>
                <Expanded flex={1}>
                  <Rect width={100} height={50} color="#45B7D1" borderRadius={4} />
                </Expanded>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ===== 2. Spacer ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="2. Spacer - 弹性空白" />
              <Label text="左右两个色块之间用 Spacer 撑开" />
              <Row width={CARD_W - 40} height={50}>
                <Rect width={80} height={50} color="#FF6B6B" borderRadius={4} />
                <Spacer />
                <Rect width={80} height={50} color="#4ECDC4" borderRadius={4} />
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ===== 3. Positioned ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="3. Positioned - 绝对定位" />
              <Label text="Stack 中使用 Positioned 定位子节点" />
              <Stack width={CARD_W - 40} height={150}>
                <Rect width={CARD_W - 40} height={150} color="#f0f0f0" borderRadius={8} />
                <Positioned top={10} left={10}>
                  <Rect width={60} height={60} color="#FF6B6B" borderRadius={8} />
                </Positioned>
                <Positioned top={10} right={10}>
                  <Rect width={60} height={60} color="#4ECDC4" borderRadius={8} />
                </Positioned>
                <Positioned bottom={10} left={10}>
                  <Rect width={60} height={60} color="#45B7D1" borderRadius={8} />
                </Positioned>
                <Positioned bottom={10} right={10}>
                  <Rect width={60} height={60} color="#96CEB4" borderRadius={8} />
                </Positioned>
              </Stack>
            </Column>
          </Container>
        </Padding>

        {/* ===== 4. Opacity ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="4. Opacity - 透明度" />
              <Label text="从左到右透明度递减: 1.0 → 0.6 → 0.3" />
              <Row width={CARD_W - 40} height={60} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                <Opacity opacity={1.0}>
                  <Rect width={80} height={60} color="#FF6B6B" borderRadius={8} />
                </Opacity>
                <Opacity opacity={0.6}>
                  <Rect width={80} height={60} color="#FF6B6B" borderRadius={8} />
                </Opacity>
                <Opacity opacity={0.3}>
                  <Rect width={80} height={60} color="#FF6B6B" borderRadius={8} />
                </Opacity>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ===== 5. ClipRRect ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="5. ClipRRect - 圆角裁剪" />
              <Label text="对子节点应用圆角矩形裁剪 (borderRadius=20)" />
              <ClipRRect borderRadius={20} width={200} height={100}>
                <Rect width={200} height={100} color="#667eea" />
              </ClipRRect>
            </Column>
          </Container>
        </Padding>

        {/* ===== 6. Transform ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="6. Transform - 2D 变换" />
              <Label text="旋转 15°、缩放 0.8" />
              <SizedBox width={CARD_W - 40} height={120}>
                <Transform rotation={Math.PI / 12} scaleX={0.8} scaleY={0.8}>
                  <Rect width={100} height={80} color="#4ECDC4" borderRadius={8} />
                </Transform>
              </SizedBox>
            </Column>
          </Container>
        </Padding>

        {/* ===== 7. ConstrainedBox ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="7. ConstrainedBox - 额外约束" />
              <Label text="最小宽度 200，最小高度 80" />
              <ConstrainedBox constraintMinWidth={200} constraintMinHeight={80}>
                <Container width={100} height={40} color="#96CEB4" borderRadius={8} padding={10}>
                  <Text text="被约束放大" fontSize={12} color="#fff" />
                </Container>
              </ConstrainedBox>
            </Column>
          </Container>
        </Padding>

        {/* ===== 8. FractionallySizedBox ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="8. FractionallySizedBox - 比例尺寸" />
              <Label text="宽度占父容器 70%，高度占 50%" />
              <SizedBox width={CARD_W - 40} height={100}>
                <FractionallySizedBox widthFactor={0.7} heightFactor={0.5}>
                  <Rect width={300} height={100} color="#FFEAA7" borderRadius={8} />
                </FractionallySizedBox>
              </SizedBox>
            </Column>
          </Container>
        </Padding>

        {/* ===== 9. LimitedBox ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="9. LimitedBox - 限制尺寸" />
              <Label text="在无界约束下限制最大宽度 150、最大高度 60" />
              <LimitedBox maxLimitWidth={150} maxLimitHeight={60}>
                <Rect width={300} height={300} color="#DDA0DD" borderRadius={8} />
              </LimitedBox>
            </Column>
          </Container>
        </Padding>

        {/* ===== 10. FittedBox ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="10. FittedBox - 缩放适配" />
              <Label text="Contain 模式：保持比例缩放到容器内" />
              <Container width={200} height={100} color="#f0f0f0" borderRadius={8}>
                <FittedBox fit={BoxFit.Contain} width={200} height={100}>
                  <Rect width={400} height={300} color="#74b9ff" borderRadius={4} />
                </FittedBox>
              </Container>
            </Column>
          </Container>
        </Padding>

        {/* ===== 11. OverflowBox ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="11. OverflowBox - 允许溢出" />
              <Label text="粉色子节点(250宽)超出灰色背景(200宽)" />
              <Stack width={CARD_W - 40} height={100}>
                <Rect width={200} height={80} color="#f0f0f0" borderRadius={8} />
                <SizedBox width={200} height={80}>
                  <OverflowBox overflowMaxWidth={300} overflowMaxHeight={80} width={200} height={80}>
                    <Rect width={250} height={50} color="#fd79a8" borderRadius={8} />
                  </OverflowBox>
                </SizedBox>
              </Stack>
            </Column>
          </Container>
        </Padding>

        {/* ===== 12. Offstage ===== */}
        <Padding padding={16}>
          <Container width={CARD_W} color="#fff" padding={20} borderRadius={12} border={1} borderColor="#e0e0e0">
            <Column width={CARD_W - 40}>
              <SectionTitle text="12. Offstage - 隐藏/显示" />
              <Label text="offstage=false 时显示，offstage=true 时隐藏" />
              <Row width={CARD_W - 40} height={60}>
                <Offstage offstage={false}>
                  <Rect width={80} height={60} color="#00b894" borderRadius={8} />
                </Offstage>
                <Padding padding={8} />
                <Offstage offstage={true}>
                  <Rect width={80} height={60} color="#e17055" borderRadius={8} />
                </Offstage>
                <Padding padding={8} />
                <Text text="← 第二个被隐藏了" fontSize={12} color="#888" />
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* 底部总结 */}
        <Padding padding={24}>
          <Container width={CARD_W} color="#764ba2" padding={20} borderRadius={12}>
            <Column width={CARD_W - 40} crossAxisAlignment={CrossAxisAlignment.Center}>
              <Text text="✅ 新节点演示完成" fontSize={20} fontWeight={FontWeight.W600} color="#fff" textAlign={TextAlign.Center} />
              <Padding padding={8}>
                <Text text="12 个 Flutter 风格基础节点全部就绪" fontSize={14} color="rgba(255,255,255,0.9)" textAlign={TextAlign.Center} />
              </Padding>
            </Column>
          </Container>
        </Padding>

        <Padding padding={32} />
      </Column>
    </SingleChildScrollView>
  )
}

export default NewNodesDemo