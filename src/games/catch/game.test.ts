import { describe, expect, it } from 'vitest'
import { GAME_SECONDS, isCatch, pickFood, settle } from './game'

describe('pickFood', () => {
  it('大样本分布接近稀有度权重（N 为主，SSR 稀缺）', () => {
    const n = 6000
    const rarityCount: Record<string, number> = { N: 0, R: 0, SR: 0, SSR: 0 }
    for (let i = 0; i < n; i++) rarityCount[pickFood().rarity]++
    expect(rarityCount.N / n).toBeGreaterThan(0.48)
    expect(rarityCount.N / n).toBeLessThan(0.62)
    expect(rarityCount.SSR).toBeGreaterThan(0)
  })
})

describe('isCatch', () => {
  it('x 对齐且 y 落入碗口区间才判定接住', () => {
    expect(isCatch(50, 88, 50)).toBe(true)
    expect(isCatch(58, 90, 50)).toBe(true) // x 容差 9 以内
    expect(isCatch(60, 90, 50)).toBe(false) // x 超差
    expect(isCatch(50, 85, 50)).toBe(false) // 还没落到碗口
    expect(isCatch(50, 97, 50)).toBe(false) // 已落过（漏接）
  })
})

describe('settle', () => {
  const A = 'shaxian' // 沙县拌面加炖罐
  const B = 'malatang' // 麻辣烫
  const C = 'hotpot' // 火锅涮毛肚

  it('数量最多者胜', () => {
    const r = settle({ [A]: 3, [B]: 1 })
    expect(r.ending).toBe('normal')
    expect(r.food?.id).toBe(A)
    expect(r.top[0]).toMatchObject({ count: 3 })
  })

  it('并列时在并列者中随机取一', () => {
    for (let i = 0; i < 50; i++) {
      const r = settle({ [A]: 2, [B]: 2, [C]: 1 })
      expect([A, B]).toContain(r.food?.id)
      expect(r.food?.id).not.toBe(C)
    }
  })

  it('颗粒无收 → none 结局', () => {
    const r = settle({})
    expect(r.ending).toBe('none')
    expect(r.food).toBeNull()
    expect(r.top).toHaveLength(0)
  })

  it('常量：局时长为 30 秒', () => {
    expect(GAME_SECONDS).toBe(30)
  })
})
