/**
 * useCompositeAnimation - 组合动画 Hooks
 * 为 React 提供便捷的组合动画 Hooks
 */

import { useRef, useEffect, useState } from 'react';
import { SequenceAnimation, StaggerAnimation } from './CompositeAnimation';
import { Animation } from './Animation';
import { Curve } from './Curve';

/**
 * useSequenceAnimation - 序列动画 Hook
 *
 * 将多个动画依次执行
 *
 * 例子：
 * const { play, reset } = useSequenceAnimation([
 *   { animation: anim1, duration: 200 },
 *   { animation: anim2, duration: 300 },
 * ]);
 */
export function useSequenceAnimation(
  animations: Array<{ animation: Animation; duration: number; curve?: Curve }>,
  options?: {
    startDelay?: number;
    autoStart?: boolean;
  }
) {
  const sequenceRef = useRef<SequenceAnimation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 创建序列动画
    sequenceRef.current = new SequenceAnimation(animations, {
      startDelay: options?.startDelay,
    });

    // 自动开始（如果指定）
    if (options?.autoStart !== false) {
      sequenceRef.current.play().then(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }

    // 清理
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }
    };
  }, [options?.autoStart, options?.startDelay]);

  return {
    play: async () => {
      if (sequenceRef.current) {
        setIsPlaying(true);
        await sequenceRef.current.play();
        setIsPlaying(false);
      }
    },
    reset: () => {
      if (sequenceRef.current) {
        sequenceRef.current.reset();
        setIsPlaying(false);
      }
    },
    pause: () => {
      if (sequenceRef.current) {
        sequenceRef.current.pause();
        setIsPlaying(false);
      }
    },
    reverse: async () => {
      if (sequenceRef.current) {
        setIsPlaying(true);
        await sequenceRef.current.reverse();
        setIsPlaying(false);
      }
    },
    sequence: sequenceRef.current,
    isPlaying,
  };
}

/**
 * useStaggerAnimation - 交错动画 Hook
 *
 * 让多个动画以错开的时间执行
 *
 * 例子：
 * const { play, reset } = useStaggerAnimation([
 *   { animation: anim1, duration: 500, delay: 0 },
 *   { animation: anim2, duration: 500, delay: 100 },
 *   { animation: anim3, duration: 500, delay: 200 },
 * ]);
 */
export function useStaggerAnimation(
  animations: Array<{ animation: Animation; duration: number; delay?: number; curve?: Curve }>,
  options?: {
    totalDuration?: number;
    autoStart?: boolean;
  }
) {
  const staggerRef = useRef<StaggerAnimation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 创建交错动画
    staggerRef.current = new StaggerAnimation(animations, {
      totalDuration: options?.totalDuration,
    });

    // 自动开始（如果指定）
    if (options?.autoStart !== false) {
      staggerRef.current.play().then(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }

    // 清理
    return () => {
      if (staggerRef.current) {
        staggerRef.current.dispose();
        staggerRef.current = null;
      }
    };
  }, [options?.autoStart, options?.totalDuration]);

  return {
    play: async () => {
      if (staggerRef.current) {
        setIsPlaying(true);
        await staggerRef.current.play();
        setIsPlaying(false);
      }
    },
    reset: () => {
      if (staggerRef.current) {
        staggerRef.current.reset();
        setIsPlaying(false);
      }
    },
    pause: () => {
      if (staggerRef.current) {
        staggerRef.current.pause();
        setIsPlaying(false);
      }
    },
    reverse: async () => {
      if (staggerRef.current) {
        setIsPlaying(true);
        await staggerRef.current.reverse();
        setIsPlaying(false);
      }
    },
    stagger: staggerRef.current,
    isPlaying,
  };
}
