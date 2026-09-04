import { useCallback, useMemo, useState } from 'react'
import { makeHand, type Fortune } from './fortune'

/** 游戏阶段状态机 */
export type Phase = 'idle' | 'dealing' | 'picking' | 'revealing' | 'result'

export interface DrawState {
  phase: Phase
  hand: Fortune[]
  /** 玩家选中的牌下标 */
  chosen: number | null
  /** 累计抽签次数（玩梗文案用） */
  drawCount: number
}

export function useDraw() {
  const [state, setState] = useState<DrawState>({
    phase: 'idle',
    hand: [],
    chosen: null,
    drawCount: 0,
  })

  /** 开始抽签：生成新一手，进入发牌动画 */
  const start = useCallback(() => {
    setState((s) => ({
      phase: 'dealing',
      hand: makeHand(),
      chosen: null,
      drawCount: s.drawCount + 1,
    }))
  }, [])

  /** 发牌动画完成 → 可选牌 */
  const onDealt = useCallback(() => {
    setState((s) => (s.phase === 'dealing' ? { ...s, phase: 'picking' } : s))
  }, [])

  /** 玩家翻开第 i 张 → 翻牌动画（另两张自动亮出） */
  const choose = useCallback((i: number) => {
    setState((s) => (s.phase === 'picking' ? { ...s, chosen: i, phase: 'revealing' } : s))
  }, [])

  /** 翻牌动画完成 → 展示完整运势 */
  const onRevealed = useCallback(() => {
    setState((s) => (s.phase === 'revealing' ? { ...s, phase: 'result' } : s))
  }, [])

  const actions = useMemo(() => ({ start, onDealt, choose, onRevealed }), [start, onDealt, choose, onRevealed])

  return { ...state, ...actions }
}
