import { FOODS, type Food } from '../fortune/game/data'

export interface BoardItem {
  food: Food
  /** 散落位置（百分比） */
  left: number
  top: number
  /** 随机倾斜角（度） */
  rot: number
}

export const ROUND_SECONDS = 10
export const BOARD_SIZE = 16

function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** 生成棋盘：count 个不重复食物，4 列网格内随机散落（避免重叠） */
export function buildBoard(count = BOARD_SIZE, rand: () => number = Math.random): BoardItem[] {
  const foods = shuffle(FOODS, rand).slice(0, count)
  const cols = 4
  const rows = Math.ceil(foods.length / cols)
  return foods.map((food, i) => ({
    food,
    left: (i % cols) * (100 / cols) + 1 + rand() * 3,
    top: Math.floor(i / cols) * (100 / rows) + 1 + rand() * 4,
    rot: (rand() - 0.5) * 18,
  }))
}

export type EliminationEnding = 'clean' | 'roulette' | 'all-removed'

export interface SettleResult {
  food: Food
  ending: EliminationEnding
  /** 轮盘决胜时的候选池 */
  pool: Food[]
}

/** 结算：剩 1 个直接定；剩多个进轮盘；全删光触发"全都要"结局 */
export function settleRound(
  board: readonly Food[],
  eliminatedIds: ReadonlySet<string>,
  rand: () => number = Math.random,
): SettleResult {
  const remaining = board.filter((f) => !eliminatedIds.has(f.id))
  if (remaining.length === 0) {
    return { food: board[Math.floor(rand() * board.length)], ending: 'all-removed', pool: [] }
  }
  if (remaining.length === 1) {
    return { food: remaining[0], ending: 'clean', pool: remaining }
  }
  return { food: remaining[Math.floor(rand() * remaining.length)], ending: 'roulette', pool: remaining }
}

/** 计算轮盘动画步数：保证高亮最终停在 food 上（deceleration 视觉效果由调用方控制节奏） */
export function rouletteSteps(pool: readonly Food[], food: Food): number {
  const final = Math.max(0, pool.indexOf(food))
  let steps = 10
  while (steps % pool.length !== final) steps++
  return steps
}
