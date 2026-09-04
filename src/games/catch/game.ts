import { FOODS, type Food } from '../fortune/game/data'
import { rollRarity } from '../fortune/game/rarity'

export const GAME_SECONDS = 30
/** 碗的接取高度（面板百分比 y） */
export const CATCH_Y = 88

/** 按稀有度权重抽一个食物（SSR 少掉落） */
export function pickFood(rand: () => number = Math.random): Food {
  const rarity = rollRarity(rand)
  const pool = FOODS.filter((f) => f.rarity === rarity)
  return pool[Math.floor(rand() * pool.length)]
}

/** 碰撞判定：x 接近且 y 落入碗口区间 */
export function isCatch(itemX: number, itemY: number, bowlX: number): boolean {
  return Math.abs(itemX - bowlX) <= 9 && itemY >= CATCH_Y - 2 && itemY <= CATCH_Y + 8
}

export type CatchEnding = 'normal' | 'none'

export interface CatchSettleResult {
  /** 接得最多的食物（颗粒无收时为 null） */
  food: Food | null
  ending: CatchEnding
  /** 接住数量排行（展示用，最多 4 行） */
  top: { food: Food; count: number }[]
}

/** 结算：数量最多者胜；并列随机取一（注入 rand 保证可测） */
export function settle(
  counts: Readonly<Record<string, number>>,
  rand: () => number = Math.random,
): CatchSettleResult {
  const entries = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const food = FOODS.find((f) => f.id === id)
      if (!food) throw new Error(`未知食物 id: ${id}`)
      return { food, count }
    })
  if (entries.length === 0) return { food: null, ending: 'none', top: [] }
  entries.sort((a, b) => b.count - a.count)
  const max = entries[0].count
  const leaders = entries.filter((e) => e.count === max)
  return {
    food: leaders[Math.floor(rand() * leaders.length)].food,
    ending: 'normal',
    top: entries.slice(0, 4),
  }
}
