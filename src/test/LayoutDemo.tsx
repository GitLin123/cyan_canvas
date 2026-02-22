import React from 'react'
import {
  Column,
  Row,
  Rect,
  Text,
  Container,
  Padding,
  Center,
  Stack,
  Wrap,
  Flex,
  Align,
  SizedBox,
  AspectRatio,
  SingleChildScrollView,
} from '../core/adaptor/reconciler/components'
import { MainAxisAlignment, CrossAxisAlignment, TextAlign, FontWeight, Alignment } from '../core/types/container'

/**
 * 布局容器完整演示
 * 展示 Cyan Engine 所有布局容器的用法
 */
const LayoutDemo = () => {
  return (
    <SingleChildScrollView width={window.innerWidth} height={window.innerHeight}>
      <Column width={window.innerWidth}>
        {/* 标题区域 */}
        <Padding padding={24}>
          <Container
            width={window.innerWidth - 48}
            color="#667eea"
            padding={24}
            borderRadius={12}
          >
            <Column width={window.innerWidth - 96} crossAxisAlignment={CrossAxisAlignment.Center}>
              <Text
                text="📐 Cyan Engine 布局容器演示"
                fontSize={28}
                fontWeight={FontWeight.W700}
                color="#fff"
                textAlign={TextAlign.Center}
              />
              <Padding padding={8}>
                <Text
                  text="全面展示所有布局容器的使用方法和效果"
                  fontSize={14}
                  color="rgba(255,255,255,0.9)"
                  textAlign={TextAlign.Center}
                />
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* ========== Column 垂直布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="📊 Column - 垂直布局容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="子元素沿垂直方向依次排列" fontSize={12} color="#888" />
              </Padding>

              {/* 主轴对齐方式 */}
              <Padding padding={16}>
                <Text text="主轴对齐 (mainAxisAlignment)" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              {/* Start */}
              <Padding padding={8}>
                <Text text="Start - 起始对齐" fontSize={12} color="#666" />
              </Padding>
              <Container width={300} height={100} color="#f5f5f5" borderRadius={8} padding={8}>
                <Column mainAxisAlignment={MainAxisAlignment.Start} width={284} height={84}>
                  <Rect width={60} height={24} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={60} height={24} color="#4ECDC4" borderRadius={4} />
                </Column>
              </Container>

              {/* Center */}
              <Padding padding={8}>
                <Text text="Center - 居中对齐" fontSize={12} color="#666" />
              </Padding>
              <Container width={300} height={100} color="#f5f5f5" borderRadius={8} padding={8}>
                <Column mainAxisAlignment={MainAxisAlignment.Center} width={284} height={84}>
                  <Rect width={60} height={24} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={60} height={24} color="#4ECDC4" borderRadius={4} />
                </Column>
              </Container>

              {/* End */}
              <Padding padding={8}>
                <Text text="End - 结束对齐" fontSize={12} color="#666" />
              </Padding>
              <Container width={300} height={100} color="#f5f5f5" borderRadius={8} padding={8}>
                <Column mainAxisAlignment={MainAxisAlignment.End} width={284} height={84}>
                  <Rect width={60} height={24} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={60} height={24} color="#4ECDC4" borderRadius={4} />
                </Column>
              </Container>

              {/* SpaceBetween */}
              <Padding padding={8}>
                <Text text="SpaceBetween - 两端对齐" fontSize={12} color="#666" />
              </Padding>
              <Container width={300} height={100} color="#f5f5f5" borderRadius={8} padding={8}>
                <Column mainAxisAlignment={MainAxisAlignment.SpaceBetween} width={284} height={84}>
                  <Rect width={60} height={24} color="#FF6B6B" borderRadius={4} />
                  <Rect width={60} height={24} color="#4ECDC4" borderRadius={4} />
                </Column>
              </Container>

              {/* SpaceEvenly */}
              <Padding padding={8}>
                <Text text="SpaceEvenly - 完全等间距" fontSize={12} color="#666" />
              </Padding>
              <Container width={300} height={100} color="#f5f5f5" borderRadius={8} padding={8}>
                <Column mainAxisAlignment={MainAxisAlignment.SpaceEvenly} width={284} height={84}>
                  <Rect width={60} height={20} color="#FF6B6B" borderRadius={4} />
                  <Rect width={60} height={20} color="#4ECDC4" borderRadius={4} />
                  <Rect width={60} height={20} color="#45B7D1" borderRadius={4} />
                </Column>
              </Container>

              {/* 交叉轴对齐 */}
              <Padding padding={16}>
                <Text text="交叉轴对齐 (crossAxisAlignment)" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={300} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                <Container width={90} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Column crossAxisAlignment={CrossAxisAlignment.Start} width={82} height={72}>
                    <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} />
                  </Column>
                </Container>
                <Container width={90} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Column crossAxisAlignment={CrossAxisAlignment.Center} width={82} height={72}>
                    <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} />
                  </Column>
                </Container>
                <Container width={90} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Column crossAxisAlignment={CrossAxisAlignment.End} width={82} height={72}>
                    <Rect width={30} height={30} color="#45B7D1" borderRadius={4} />
                  </Column>
                </Container>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ========== Row 水平布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="➡️ Row - 水平布局容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="子元素沿水平方向依次排列" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="主轴对齐方式展示" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              {/* Row 各种对齐 */}
              <Container width={320} height={60} color="#f5f5f5" borderRadius={8} padding={8}>
                <Row mainAxisAlignment={MainAxisAlignment.Start} width={304} height={44}>
                  <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={30} height={30} color="#45B7D1" borderRadius={4} />
                </Row>
              </Container>

              <Padding padding={8} />

              <Container width={320} height={60} color="#f5f5f5" borderRadius={8} padding={8}>
                <Row mainAxisAlignment={MainAxisAlignment.Center} width={304} height={44}>
                  <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect width={30} height={30} color="#45B7D1" borderRadius={4} />
                </Row>
              </Container>

              <Padding padding={8} />

              <Container width={320} height={60} color="#f5f5f5" borderRadius={8} padding={8}>
                <Row mainAxisAlignment={MainAxisAlignment.SpaceEvenly} width={304} height={44}>
                  <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} />
                  <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} />
                  <Rect width={30} height={30} color="#45B7D1" borderRadius={4} />
                </Row>
              </Container>

              {/* 垂直对齐 */}
              <Padding padding={16}>
                <Text text="垂直方向对齐 (crossAxisAlignment)" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                <Container width={100} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Row crossAxisAlignment={CrossAxisAlignment.Start} width={92} height={72}>
                    <Rect width={30} height={30} color="#FF6B6B" borderRadius={4} />
                  </Row>
                </Container>
                <Container width={100} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Row crossAxisAlignment={CrossAxisAlignment.Center} width={92} height={72}>
                    <Rect width={30} height={30} color="#4ECDC4" borderRadius={4} />
                  </Row>
                </Container>
                <Container width={100} height={80} color="#f5f5f5" borderRadius={8} padding={4}>
                  <Row crossAxisAlignment={CrossAxisAlignment.End} width={92} height={72}>
                    <Rect width={30} height={30} color="#45B7D1" borderRadius={4} />
                  </Row>
                </Container>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ========== Stack 堆叠布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="🗃️ Stack - 堆叠布局容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="子元素按顺序堆叠，后添加的在上层" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="基本堆叠效果" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={200} height={200} color="#f5f5f5" borderRadius={8} padding={8}>
                <Stack width={184} height={184}>
                  <Rect x={0} y={0} width={120} height={120} color="#FF6B6B" borderRadius={8} />
                  <Rect x={40} y={40} width={120} height={120} color="#4ECDC4" borderRadius={8} />
                  <Rect x={80} y={80} width={120} height={120} color="#45B7D1" borderRadius={8} />
                </Stack>
              </Container>

              <Padding padding={16}>
                <Text text="带文字的堆叠卡片" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={240} height={160} color="#f5f5f5" borderRadius={12} padding={0}>
                <Stack width={240} height={160}>
                  <Rect width={240} height={160} color="#667eea" borderRadius={12} />
                  <Container
                    width={240}
                    height={160}
                    borderRadius={12}
                  />
                  <Padding padding={16}>
                    <Column width={208}>
                      <Text
                        text="堆叠布局"
                        fontSize={24}
                        fontWeight={FontWeight.W700}
                        color="#fff"
                      />
                      <Padding padding={4}>
                        <Text
                          text="后添加的元素会覆盖在顶层"
                          fontSize={12}
                          color="rgba(255,255,255,0.8)"
                        />
                      </Padding>
                    </Column>
                  </Padding>
                </Stack>
              </Container>
            </Column>
          </Container>
        </Padding>

        {/* ========== Wrap 自动换行布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="🔄 Wrap - 自动换行布局" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="子元素在超出容器宽度时自动换行" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="固定宽度自动换行" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={280} height={200} color="#f5f5f5" borderRadius={8} padding={8}>
                <Wrap width={264} spacing={8} runSpacing={8}>
                  <Rect width={80} height={40} color="#FF6B6B" borderRadius={4} />
                  <Rect width={80} height={40} color="#4ECDC4" borderRadius={4} />
                  <Rect width={80} height={40} color="#45B7D1" borderRadius={4} />
                  <Rect width={80} height={40} color="#FFE66D" borderRadius={4} />
                  <Rect width={80} height={40} color="#95E1D3" borderRadius={4} />
                  <Rect width={80} height={40} color="#F38181" borderRadius={4} />
                  <Rect width={80} height={40} color="#AA96DA" borderRadius={4} />
                  <Rect width={80} height={40} color="#FCBAD3" borderRadius={4} />
                </Wrap>
              </Container>

              <Padding padding={16}>
                <Text text="标签云效果" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={320} color="#f5f5f5" borderRadius={8} padding={12}>
                <Wrap width={296} spacing={8} runSpacing={8}>
                  {['JavaScript', 'TypeScript', 'React', 'Canvas', 'Flutter', 'UI', 'Animation', 'Layout'].map(
                    (tag, index) => (
                      <Container
                        key={index}
                        color={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFE66D', '#95E1D3'][index % 5]}
                        borderRadius={16}
                      >
                        <Text text={tag} fontSize={12} color="#fff" />
                      </Container>
                    )
                  )}
                </Wrap>
              </Container>
            </Column>
          </Container>
        </Padding>

        {/* ========== Center 居中布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="⭕ Center - 居中布局容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="将子元素在父容器中居中显示" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="居中显示" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={200} height={150} color="#f5f5f5" borderRadius={8} padding={8}>
                <Center width={184} height={134}>
                  <Rect width={80} height={60} color="#667eea" borderRadius={8} />
                </Center>
              </Container>

              <Padding padding={16}>
                <Text text="圆形头像居中" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={250} mainAxisAlignment={MainAxisAlignment.SpaceEvenly}>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={40} padding={4}>
                  <Center width={72} height={72}>
                    <Container width={64} height={64} color="#FF6B6B" borderRadius={32} />
                  </Center>
                </Container>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={40} padding={4}>
                  <Center width={72} height={72}>
                    <Container width={64} height={64} color="#4ECDC4" borderRadius={32} />
                  </Center>
                </Container>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={40} padding={4}>
                  <Center width={72} height={72}>
                    <Container width={64} height={64} color="#45B7D1" borderRadius={32} />
                  </Center>
                </Container>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ========== Padding 内边距 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="📐 Padding - 内边距容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="为子元素添加内边距" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="统一内边距" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={300} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={8}>
                  <Padding padding={16}>
                    <Rect width={48} height={48} color="#FF6B6B" borderRadius={4} />
                  </Padding>
                </Container>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={8}>
                  <Padding padding={24}>
                    <Rect width={32} height={32} color="#4ECDC4" borderRadius={4} />
                  </Padding>
                </Container>
                <Container width={80} height={80} color="#f5f5f5" borderRadius={8}>
                  <Padding padding={8}>
                    <Rect width={64} height={64} color="#45B7D1" borderRadius={4} />
                  </Padding>
                </Container>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ========== SizedBox 固定尺寸 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="📏 SizedBox - 固定尺寸容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="强制设置子元素的宽高" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="固定宽度或高度" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={300} mainAxisAlignment={MainAxisAlignment.SpaceEvenly}>
                <SizedBox width={60} height={60}>
                  <Rect width={200} height={200} color="#FF6B6B" borderRadius={8} />
                </SizedBox>
                <SizedBox width={80} height={40}>
                  <Rect width={200} height={200} color="#4ECDC4" borderRadius={8} />
                </SizedBox>
                <SizedBox width={100} height={80}>
                  <Rect width={200} height={200} color="#45B7D1" borderRadius={8} />
                </SizedBox>
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* ========== AspectRatio 宽高比 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="🔲 AspectRatio - 宽高比容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="强制子元素保持特定的宽高比" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="不同宽高比展示" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={320} mainAxisAlignment={MainAxisAlignment.SpaceEvenly}>
                <Column>
                  <Text text="1:1" fontSize={12} color="#666" textAlign={TextAlign.Center} />
                  <Padding padding={4}>
                    <AspectRatio aspectRatio={1}>
                      <Rect width={50} height={50} color="#FF6B6B" borderRadius={8} />
                    </AspectRatio>
                  </Padding>
                </Column>
                <Column>
                  <Text text="16:9" fontSize={12} color="#666" textAlign={TextAlign.Center} />
                  <Padding padding={4}>
                    <AspectRatio aspectRatio={16 / 9}>
                      <Rect width={70} height={40} color="#4ECDC4" borderRadius={8} />
                    </AspectRatio>
                  </Padding>
                </Column>
                <Column>
                  <Text text="4:3" fontSize={12} color="#666" textAlign={TextAlign.Center} />
                  <Padding padding={4}>
                    <AspectRatio aspectRatio={4 / 3}>
                      <Rect width={60} height={45} color="#45B7D1" borderRadius={8} />
                    </AspectRatio>
                  </Padding>
                </Column>
                <Column>
                  <Text text="2:1" fontSize={12} color="#666" textAlign={TextAlign.Center} />
                  <Padding padding={4}>
                    <AspectRatio aspectRatio={2}>
                      <Rect width={70} height={35} color="#FFE66D" borderRadius={8} />
                    </AspectRatio>
                  </Padding>
                </Column>
              </Row>

              <Padding padding={16}>
                <Text text="视频卡片效果" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={280} color="#f5f5f5" borderRadius={8} padding={8}>
                <AspectRatio aspectRatio={16 / 9}>
                  <Rect width={280} height={180} color="#667eea" borderRadius={8} />
                </AspectRatio>
              </Container>
              <Padding padding={8}>
                <Text text="视频标题" fontSize={14} fontWeight={FontWeight.W500} color="#333" />
              </Padding>
              <Text text="这是一个使用 AspectRatio 实现的视频封面卡片效果" fontSize={12} color="#888" />
            </Column>
          </Container>
        </Padding>

        {/* ========== Align 对齐定位 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="🎯 Align - 对齐定位容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="将子元素定位到父容器的指定位置" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="九宫格定位" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Wrap width={300} spacing={8} runSpacing={8}>
                {[
                  { label: 'TopLeft', align: Alignment.TopLeft, color: '#FF6B6B' },
                  { label: 'TopCenter', align: Alignment.TopCenter, color: '#4ECDC4' },
                  { label: 'TopRight', align: Alignment.TopRight, color: '#45B7D1' },
                  { label: 'CenterLeft', align: Alignment.CenterLeft, color: '#FFE66D' },
                  { label: 'Center', align: Alignment.Center, color: '#95E1D3' },
                  { label: 'CenterRight', align: Alignment.CenterRight, color: '#F38181' },
                  { label: 'BottomLeft', align: Alignment.BottomLeft, color: '#AA96DA' },
                  { label: 'BottomCenter', align: Alignment.BottomCenter, color: '#FCBAD3' },
                  { label: 'BottomRight', align: Alignment.BottomRight, color: '#A8E6CF' },
                ].map((item, i) => (
                  <Container key={i} width={92} height={70} color="#f5f5f5" borderRadius={8}>
                    <Align alignment={item.align} width={92} height={70}>
                      <Rect width={24} height={24} color={item.color} borderRadius={4} />
                    </Align>
                  </Container>
                ))}
              </Wrap>
            </Column>
          </Container>
        </Padding>

        {/* ========== Flex 弹性布局 ========== */}
        <Padding padding={16}>
          <Container
            width={window.innerWidth - 40}
            color="#fff"
            padding={20}
            borderRadius={12}
            border={1}
            borderColor="#e0e0e0"
          >
            <Column width={window.innerWidth - 80}>
              <Text text="📊 Flex - 弹性布局容器" fontSize={20} fontWeight={FontWeight.W600} color="#333" />
              <Padding padding={4}>
                <Text text="支持类似 Flexbox 的弹性盒子布局" fontSize={12} color="#888" />
              </Padding>

              <Padding padding={16}>
                <Text text="flex 属性分配空间" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Container width={300} height={40} color="#f5f5f5" borderRadius={8} padding={4}>
                <Row width={292} height={32}>
                  <Rect flex={1} height={32} color="#FF6B6B" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect flex={2} height={32} color="#4ECDC4" borderRadius={4} />
                  <Padding padding={4} />
                  <Rect flex={1} height={32} color="#45B7D1" borderRadius={4} />
                </Row>
              </Container>

              <Padding padding={8}>
                <Text text="布局比例示意" fontSize={14} fontWeight={FontWeight.W500} color="#555" />
              </Padding>

              <Row width={300} mainAxisAlignment={MainAxisAlignment.Center}>
                <Text text="1" fontSize={14} color="#FF6B6B" fontWeight={FontWeight.W700} />
                <Text text=" : " fontSize={14} color="#888" />
                <Text text="2" fontSize={14} color="#4ECDC4" fontWeight={FontWeight.W700} />
                <Text text=" : " fontSize={14} color="#888" />
                <Text text="1" fontSize={14} color="#45B7D1" fontWeight={FontWeight.W700} />
              </Row>
            </Column>
          </Container>
        </Padding>

        {/* 底部总结 */}
        <Padding padding={24}>
          <Container
            width={window.innerWidth - 48}
            color="#667eea"
            padding={20}
            borderRadius={12}
          >
            <Column width={window.innerWidth - 88} crossAxisAlignment={CrossAxisAlignment.Center}>
              <Text
                text="✅ 布局容器演示完成"
                fontSize={20}
                fontWeight={FontWeight.W600}
                color="#fff"
                textAlign={TextAlign.Center}
              />
              <Padding padding={8}>
                <Text
                  text="Cyan Engine 提供了完整的布局系统，助你构建复杂的 Canvas UI"
                  fontSize={14}
                  color="rgba(255,255,255,0.9)"
                  textAlign={TextAlign.Center}
                />
              </Padding>
            </Column>
          </Container>
        </Padding>

        {/* 底部空白 */}
        <Padding padding={32} />
      </Column>
    </SingleChildScrollView>
  )
}

export default LayoutDemo
