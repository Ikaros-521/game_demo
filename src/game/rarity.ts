export type Rarity = 'N' | 'R' | 'SR' | 'SSR'

export const RARITY_ORDER: readonly Rarity[] = ['N', 'R', 'SR', 'SSR'] as const

/** 基础掉率（百分比权重） */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  N: 55,
  R: 30,
  SR: 12,
  SSR: 3,
}

/** 保底升级权重：三张全 N 时，随机一张按此权重升级 */
export const UPGRADE_WEIGHTS: Record<Rarity, number> = {
  N: 0,
  R: 30,
  SR: 12,
  SSR: 3,
}

export interface RarityMeta {
  label: string
  rate: string
  /** 主色（描边/文字） */
  color: string
  /** 光晕色 */
  glow: string
  /** 边框渐变（用于卡片） */
  border: string
}

export const RARITY_META: Record<Rarity, RarityMeta> = {
  N: {
    label: 'N',
    rate: '55%',
    color: '#9aa4b2',
    glow: 'rgba(154,164,178,0.45)',
    border: 'linear-gradient(160deg, #8a94a3, #cdd5df, #8a94a3)',
  },
  R: {
    label: 'R',
    rate: '30%',
    color: '#5ba8ff',
    glow: 'rgba(91,168,255,0.55)',
    border: 'linear-gradient(160deg, #2f7fe0, #9cd0ff, #2f7fe0)',
  },
  SR: {
    label: 'SR',
    rate: '12%',
    color: '#ffc53d',
    glow: 'rgba(255,197,61,0.6)',
    border: 'linear-gradient(160deg, #c98a10, #ffe29a, #c98a10)',
  },
  SSR: {
    label: 'SSR',
    rate: '3%',
    color: '#ff7ad9',
    glow: 'rgba(255,122,217,0.65)',
    border: 'linear-gradient(160deg, #ff5ec4, #ffe25e, #7a5eff, #ff5ec4)',
  },
}

type Rand = () => number

/** 按权重表掷出一个 key（累积权重法） */
function rollWeighted<T extends string>(weights: Record<T, number>, rand: Rand): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let cursor = rand() * total
  for (const [key, weight] of entries) {
    cursor -= weight
    if (cursor < 0) return key
  }
  return entries[entries.length - 1][0]
}

/** 掷一次稀有度 */
export function rollRarity(rand: Rand = Math.random): Rarity {
  return rollWeighted(RARITY_WEIGHTS, rand)
}

/**
 * 生成一手三张签的稀有度。
 * 独立掷三次；若三张全 N，随机一张按 UPGRADE_WEIGHTS 强制升级（保底）。
 * 注：every 谓词显式注解为 `r is Rarity`，避免 TS 推断谓词把 hand 窄化成 "N"[]。
 */
export function generateHandRarities(rand: Rand = Math.random): Rarity[] {
  const hand = [rollRarity(rand), rollRarity(rand), rollRarity(rand)]
  if (hand.every((r): r is Rarity => r === 'N')) {
    const idx = Math.floor(rand() * hand.length)
    return hand.map((r, i) => (i === idx ? rollWeighted(UPGRADE_WEIGHTS, rand) : r))
  }
  return hand
}
