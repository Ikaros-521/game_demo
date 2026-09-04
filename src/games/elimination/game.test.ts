import { describe, expect, it } from 'vitest'
import type { Food } from '../fortune/game/data'
import { buildBoard, rouletteSteps, settleRound } from './game'

describe('buildBoard', () => {
  it('生成 16 个不重复食物，散落坐标在界内', () => {
    const board = buildBoard()
    expect(board.length).toBe(16)
    expect(new Set(board.map((b) => b.food.id)).size).toBe(16)
    for (const b of board) {
      expect(b.left).toBeGreaterThanOrEqual(0)
      expect(b.left).toBeLessThanOrEqual(80)
      expect(b.top).toBeGreaterThanOrEqual(0)
      expect(b.top).toBeLessThanOrEqual(80)
      expect(Math.abs(b.rot)).toBeLessThanOrEqual(9)
    }
  })
})

const A: Food = { id: 'a', name: '甲', emoji: '🍜', rarity: 'N' }
const B: Food = { id: 'b', name: '乙', emoji: '🍚', rarity: 'R' }
const C: Food = { id: 'c', name: '丙', emoji: '🥩', rarity: 'SSR' }
const board = [A, B, C]

describe('settleRound', () => {
  it('剩 1 个 → clean 结局', () => {
    const r = settleRound(board, new Set(['a', 'b']))
    expect(r.ending).toBe('clean')
    expect(r.food.id).toBe('c')
  })

  it('剩多个 → roulette 结局，food 来自候选池', () => {
    const r = settleRound(board, new Set(['a']))
    expect(r.ending).toBe('roulette')
    expect(r.pool.map((f) => f.id)).toEqual(['b', 'c'])
    expect(['b', 'c']).toContain(r.food.id)
  })

  it('全删光 → all-removed 结局，food 从棋盘随机', () => {
    const r = settleRound(board, new Set(['a', 'b', 'c']))
    expect(r.ending).toBe('all-removed')
    expect(board.map((f) => f.id)).toContain(r.food.id)
  })
})

describe('rouletteSteps', () => {
  it('步数落在目标下标上且不少于 10', () => {
    const pool = [A, B, C]
    for (const f of pool) {
      const steps = rouletteSteps(pool, f)
      expect(steps).toBeGreaterThanOrEqual(10)
      expect(steps % pool.length).toBe(Math.max(0, pool.indexOf(f)))
    }
  })
})
