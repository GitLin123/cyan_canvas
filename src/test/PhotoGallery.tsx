import React, { useState } from 'react'
import {
  Column, Text, Container, Padding, Center,
  GestureDetector, SingleChildScrollView, Wrap, Stack, Positioned,
  ClipRRect, Image, Rect,
} from '../core/adaptor/reconciler/components'
import { FontWeight, BoxFit } from '../core/types/container'
import { useWindowSize } from '../core/adaptor/reconciler'

// 使用 picsum.photos 随机图片
const PHOTOS = Array.from({ length: 256 }, (_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/${i + 10}/400/300`,
  title: `Photo ${i + 1}`,
}))

const COLS = 3
const GAP = 8

// ==================== 图片卡片 ====================
const PhotoCard = ({
  url, title, size, onTap,
}: {
  url: string; title: string; size: number; onTap: () => void
}) => (
  <GestureDetector onTap={onTap}>
    <Container width={size} height={size} color="#f0f0f0" borderRadius={8}>
      <ClipRRect borderRadius={8}>
        <Stack width={size} height={size}>
          <Image src={url} width={size} height={size} boxFit={BoxFit.Cover} />
          {/* 底部标题遮罩 */}
          <Positioned bottom={0} left={0}>
            <Container width={size} height={32} color="rgba(0,0,0,0.45)" borderRadius={0}>
              <Center width={size} height={32}>
                <Text text={title} fontSize={11} color="#fff" fontWeight={FontWeight.W500} />
              </Center>
            </Container>
          </Positioned>
        </Stack>
      </ClipRRect>
    </Container>
  </GestureDetector>
)

// ==================== 大图预览 ====================
const PhotoViewer = ({
  photo, W, H, onClose, onPrev, onNext, hasPrev, hasNext,
}: {
  photo: typeof PHOTOS[0]; W: number; H: number
  onClose: () => void; onPrev: () => void; onNext: () => void
  hasPrev: boolean; hasNext: boolean
}) => {
  const imgW = W - 40
  const imgH = H - 160

  return (
    <Stack width={W} height={H}>
      {/* 背景遮罩 - 不绑定点击关闭，避免事件穿透 */}
      <Rect width={W} height={H} color="rgba(0,0,0,0.85)" />

      {/* 图片 */}
      <Positioned top={60} left={20}>
        <ClipRRect borderRadius={12}>
          <Image src={photo.url} width={imgW} height={imgH} boxFit={BoxFit.Contain} />
        </ClipRRect>
      </Positioned>

      {/* 标题 */}
      <Positioned top={H - 80} left={0}>
        <Center width={W} height={40}>
          <Text text={photo.title} fontSize={20} fontWeight={FontWeight.W600} color="#fff" />
        </Center>
      </Positioned>

      {/* 关闭按钮 */}
      <Positioned top={16} right={16}>
        <GestureDetector onTap={onClose}>
          <Container width={36} height={36} color="rgba(255,255,255,0.2)" borderRadius={18}>
            <Center width={36} height={36}>
              <Text text="✕" fontSize={18} color="#fff" fontWeight={FontWeight.W700} />
            </Center>
          </Container>
        </GestureDetector>
      </Positioned>

      {/* 上一张 */}
      {hasPrev && (
        <Positioned top={Math.floor(H / 2 - 24)} left={8}>
          <GestureDetector onTap={onPrev}>
            <Container width={48} height={48} color="rgba(255,255,255,0.2)" borderRadius={24}>
              <Center width={48} height={48}>
                <Text text="‹" fontSize={28} color="#fff" fontWeight={FontWeight.W700} />
              </Center>
            </Container>
          </GestureDetector>
        </Positioned>
      )}

      {/* 下一张 */}
      {hasNext && (
        <Positioned top={Math.floor(H / 2 - 24)} right={8}>
          <GestureDetector onTap={onNext}>
            <Container width={48} height={48} color="rgba(255,255,255,0.2)" borderRadius={24}>
              <Center width={48} height={48}>
                <Text text="›" fontSize={28} color="#fff" fontWeight={FontWeight.W700} />
              </Center>
            </Container>
          </GestureDetector>
        </Positioned>
      )}

      {/* 页码 */}
      <Positioned bottom={24} left={0}>
        <Center width={W} height={24}>
          <Text
            text={`${photo.id + 1} / ${PHOTOS.length}`}
            fontSize={13} color="rgba(255,255,255,0.6)"
          />
        </Center>
      </Positioned>
    </Stack>
  )
}

// ==================== 主组件 ====================
const PhotoGallery = () => {
  const { width: W, height: H } = useWindowSize()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const HEADER_H = 56
  const cardSize = Math.floor((W - GAP * (COLS + 1)) / COLS)

  return (
    <Stack width={W} height={H}>
      {/* 画廊主体 */}
      <Column width={W} height={H}>
        {/* 顶栏 */}
        <Container width={W} height={HEADER_H} color="#1a1a2e">
          <Center width={W} height={HEADER_H}>
            <Text text="Photo Gallery" fontSize={22} fontWeight={FontWeight.W700} color="#fff" />
          </Center>
        </Container>

        {/* 网格 */}
        <SingleChildScrollView width={W} height={H - HEADER_H} direction="vertical">
          <Column width={W}>
            <Padding padding={GAP}>
              <Wrap width={W - GAP * 2} spacing={GAP} runSpacing={GAP}>
                {PHOTOS.map((photo, i) => (
                  <PhotoCard
                    key={photo.id}
                    url={photo.url}
                    title={photo.title}
                    size={cardSize}
                    onTap={() => setSelectedIndex(i)}
                  />
                ))}
              </Wrap>
            </Padding>
            <Padding padding={GAP} />
          </Column>
        </SingleChildScrollView>
      </Column>

      {/* 大图预览浮层 */}
      {selectedIndex !== null && (
        <PhotoViewer
          photo={PHOTOS[selectedIndex]}
          W={W} H={H}
          onClose={() => setSelectedIndex(null)}
          onPrev={() => setSelectedIndex((prev) => (prev === null ? null : Math.max(0, prev - 1)))}
          onNext={() => setSelectedIndex((prev) => (
            prev === null ? null : Math.min(PHOTOS.length - 1, prev + 1)
          ))}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < PHOTOS.length - 1}
        />
      )}
    </Stack>
  )
}

export default PhotoGallery
