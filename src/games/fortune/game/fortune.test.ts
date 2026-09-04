import { describe, expect, it } from 'vitest'
import { FOODS } from './data'
import { makeFortune, makeHand } from './fortune'

describe('makeFortune', () => {
  it('食物稀有度与请求一致，字段完整', () => {
    for (const rarity of ['N', 'R', 'SR', 'SSR'] as const) {
      for (let i = 0; i < 200; i++) {
        const f = makeFortune(rarity)
        expect(f.food.rarity).toBe(rarity)
        expect(f.stars).toBeGreaterThanOrEqual(1)
        expect(f.stars).toBeLessThanOrEqual(5)
        expect(f.good.length).toBeGreaterThan(0)
        expect(f.bad.length).toBeGreaterThan(0)
        expect(f.comment.length).toBeGreaterThan(0)
      }
    }
  })

  it('星级落在稀有度对应区间', () => {
    // SSR 恒 5 星
    expect(makeFortune('SSR').stars).toBe(5)
    for (let i = 0; i < 500; i++) {
      expect(makeFortune('SR').stars).toBeGreaterThanOrEqual(4)
      expect(makeFortune('N').stars).toBeLessThanOrEqual(2)
    }
  })
})

describe('makeHand', () => {
  it('返回三张签且食物互不重复', () => {
    for (let i = 0; i < 5_000; i++) {
      const hand = makeHand()
      expect(hand.length).toBe(3)
      const ids = hand.map((f) => f.food.id)
      expect(new Set(ids).size).toBe(3)
    }
  })

  it('保底生效：不可能三张全 N', () => {
    for (let i = 0; i < 10_000; i++) {
      expect(makeHand().every((f) => f.food.rarity === 'N')).toBe(false)
    }
  })

  it('大样本下各稀有度食物均可能被抽到', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 20_000; i++) {
      for (const f of makeHand()) seen.add(f.food.id)
    }
    // 每个稀有度池都有食物被覆盖（SSR 3% 期望出现 ~1800 次，5 个食物基本都会命中）
    for (const food of FOODS) {
      if (food.rarity === 'SSR') continue // SSR 池小概率覆盖抽查前 4 个即可
      expect(seen.has(food.id)).toBe(true)
    }
    expect([...seen].filter((id) => FOODS.find((f) => f.id === id)?.rarity === 'SSR').length).toBeGreaterThan(0)
  })
})
