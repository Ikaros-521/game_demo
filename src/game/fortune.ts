import { BAD_THINGS, COMMENTS, FOODS, GOOD_THINGS, type Food } from './data'
import { generateHandRarities, type Rarity } from './rarity'

export interface Fortune {
  food: Food
  /** 干饭运势 1~5 星 */
  stars: number
  /** 宜 */
  good: string
  /** 忌 */
  bad: string
  /** 一句话点评 */
  comment: string
}

type Rand = () => number

function pick<T>(list: readonly T[], rand: Rand): T {
  return list[Math.floor(rand() * list.length)]
}

/** 星级区间：与稀有度正相关，SSR 恒定 5 星 */
const STAR_RANGE: Record<Rarity, readonly [number, number]> = {
  N: [1, 2],
  R: [2, 3],
  SR: [4, 5],
  SSR: [5, 5],
}

function assemble(food: Food, rarity: Rarity, rand: Rand): Fortune {
  const [lo, hi] = STAR_RANGE[rarity]
  return {
    food,
    stars: lo + Math.floor(rand() * (hi - lo + 1)),
    good: pick(GOOD_THINGS, rand),
    bad: pick(BAD_THINGS, rand),
    comment: pick(COMMENTS[rarity], rand),
  }
}

/** 由稀有度组装一张完整运势 */
export function makeFortune(rarity: Rarity, rand: Rand = Math.random): Fortune {
  const pool = FOODS.filter((f) => f.rarity === rarity)
  return assemble(pick(pool, rand), rarity, rand)
}

/** 生成一手三张签（稀有度含保底），三张食物互不重复 */
export function makeHand(rand: Rand = Math.random): Fortune[] {
  const taken = new Set<string>()
  return generateHandRarities(rand).map((rarity) => {
    let pool = FOODS.filter((f) => f.rarity === rarity && !taken.has(f.id))
    if (pool.length === 0) pool = FOODS.filter((f) => f.rarity === rarity)
    const fortune = assemble(pick(pool, rand), rarity, rand)
    taken.add(fortune.food.id)
    return fortune
  })
}
