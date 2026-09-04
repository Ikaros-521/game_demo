import { describe, expect, it } from 'vitest'
import { RARITY_ORDER, RARITY_WEIGHTS, UPGRADE_WEIGHTS, generateHandRarities, rollRarity } from './rarity'

/** 确定性伪随机：把 [0,1) 均匀映射到给定序列 */
function seqRand(values: number[]): () => number {
  let i = 0
  return () => values[i++ % values.length]
}

describe('rollRarity', () => {
  it('累积权重边界正确', () => {
    const { N, R, SR, SSR } = RARITY_WEIGHTS
    const total = N + R + SR + SSR
    // rand=0 → N；逐步逼近各段边界
    expect(rollRarity(() => 0)).toBe('N')
    expect(rollRarity(() => N / total - 1e-9)).toBe('N')
    expect(rollRarity(() => N / total)).toBe('R')
    expect(rollRarity(() => (N + R) / total)).toBe('SR')
    expect(rollRarity(() => (N + R + SR) / total)).toBe('SSR')
    expect(rollRarity(() => 0.999999)).toBe('SSR')
  })

  it('大样本分布接近配置权重', () => {
    const n = 100_000
    const count: Record<string, number> = { N: 0, R: 0, SR: 0, SSR: 0 }
    for (let i = 0; i < n; i++) count[rollRarity()]++
    expect(count.N / n).toBeGreaterThan(0.53)
    expect(count.N / n).toBeLessThan(0.57)
    expect(count.SSR / n).toBeGreaterThan(0.025)
    expect(count.SSR / n).toBeLessThan(0.035)
  })
})

describe('generateHandRarities', () => {
  it('保底：三张不可能全为 N', () => {
    for (let i = 0; i < 10_000; i++) {
      const hand = generateHandRarities()
      expect(hand.every((r) => r === 'N')).toBe(false)
    }
  })

  it('保底触发时升级后的稀有度服从升级权重', () => {
    // rand 消耗顺序：3×掷 N → 选升级牌 idx → 掷升级目标
    // idx 掷 0.99 → 第 3 张（idx 2）被升级；升级掷 0.5×45=22.5 → R 段
    const randR = seqRand([0.1, 0.2, 0.3, 0.99, 0.5])
    expect(generateHandRarities(randR)).toEqual(['N', 'N', 'R'])
    // idx 掷 0 → 第 1 张（idx 0）被升级；升级掷 0.85×45=38.25 → SR 段
    const randSR = seqRand([0.1, 0.2, 0.3, 0.0, 0.85])
    expect(generateHandRarities(randSR)).toEqual(['SR', 'N', 'N'])
    // 升级掷 0.95×45=42.75 → SSR 段
    const randSSR = seqRand([0.1, 0.2, 0.3, 0.0, 0.95])
    expect(generateHandRarities(randSSR)).toEqual(['SSR', 'N', 'N'])
  })

  it('非全 N 时不干预（正常三张）', () => {
    const rand = seqRand([0.9, 0.9, 0.9])
    expect(generateHandRarities(rand)).toEqual(['SR', 'SR', 'SR'])
  })
})

describe('UPGRADE_WEIGHTS', () => {
  it('升级权重不含 N', () => {
    expect(UPGRADE_WEIGHTS.N).toBe(0)
    expect(RARITY_ORDER.filter((r) => UPGRADE_WEIGHTS[r] > 0).length).toBe(3)
  })
})
