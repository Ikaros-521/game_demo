import { useCallback, useEffect, useRef, useState } from 'react'
import { GAME_SECONDS, isCatch, pickFood, settle, type CatchSettleResult } from './game'
import type { Food } from '../fortune/game/data'

export interface FallingFood {
  id: number
  food: Food
  /** 面板百分比坐标 */
  x: number
  y: number
  /** 每秒下落速度（面板百分比/秒） */
  speed: number
  dead?: boolean
}

interface World {
  bowlX: number
  keys: { left: boolean; right: boolean }
  counts: Record<string, number>
  items: FallingFood[]
  t0: number
  lastTs: number
  nextSpawn: number
  raf: number
  alive: boolean
  idSeq: number
}

function freshWorld(): World {
  return {
    bowlX: 50,
    keys: { left: false, right: false },
    counts: {},
    items: [],
    t0: 0,
    lastTs: 0,
    nextSpawn: 0,
    raf: 0,
    alive: false,
    idSeq: 0,
  }
}

/**
 * 天降干饭主循环：rAF 驱动物理与生成，位置直接写 DOM（避免每帧 re-render），
 * React 状态只保留阶段性数据（时间整数秒、接住总数、结算结果）。
 */
export function useCatchGame() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [items, setItems] = useState<FallingFood[]>([])
  const [caughtTotal, setCaughtTotal] = useState(0)
  const [result, setResult] = useState<CatchSettleResult | null>(null)

  const areaRef = useRef<HTMLDivElement>(null)
  const bowlRef = useRef<HTMLDivElement>(null)
  const itemEls = useRef(new Map<number, HTMLDivElement>())
  const world = useRef<World>(freshWorld())

  const start = useCallback(() => {
    world.current = freshWorld()
    setResult(null)
    setItems([])
    setCaughtTotal(0)
    setTimeLeft(GAME_SECONDS)
    setPhase('playing')
  }, [])

  /** 主循环（仅 playing 阶段挂载） */
  useEffect(() => {
    if (phase !== 'playing') return
    const w = world.current
    w.alive = true
    w.t0 = performance.now()
    w.lastTs = w.t0
    w.nextSpawn = w.t0 + 350

    const step = (ts: number) => {
      if (!w.alive) return
      const dt = Math.min((ts - w.lastTs) / 1000, 0.05)
      w.lastTs = ts
      const elapsed = (ts - w.t0) / 1000
      const progress = Math.min(elapsed / GAME_SECONDS, 1)

      // 碗移动（键盘），指针移动由 onPointerMove 直接写 world
      if (w.keys.left) w.bowlX -= 70 * dt
      if (w.keys.right) w.bowlX += 70 * dt
      w.bowlX = Math.min(95, Math.max(5, w.bowlX))
      if (bowlRef.current) bowlRef.current.style.left = `${w.bowlX}%`

      // 生成掉落物（间隔随进度缩短，速度随进度加快）
      if (ts >= w.nextSpawn) {
        w.idSeq += 1
        w.items.push({
          id: w.idSeq,
          food: pickFood(),
          x: 6 + Math.random() * 88,
          y: -6,
          speed: 30 + progress * 26 + Math.random() * 12,
        })
        setItems([...w.items])
        w.nextSpawn = ts + 640 - progress * 210
      }

      // 位移 + 接取/漏接判定
      let dirty = false
      for (const it of w.items) {
        it.y += it.speed * dt
        if (isCatch(it.x, it.y, w.bowlX)) {
          w.counts[it.food.id] = (w.counts[it.food.id] ?? 0) + 1
          setCaughtTotal((c) => c + 1)
          it.dead = true
          dirty = true
        } else if (it.y > 108) {
          it.dead = true
          dirty = true
        } else {
          itemEls.current.get(it.id)?.style.setProperty('top', `${it.y}%`)
        }
      }
      if (dirty) {
        w.items = w.items.filter((it) => !it.dead)
        setItems([...w.items])
      }

      setTimeLeft(Math.max(0, Math.ceil(GAME_SECONDS - elapsed)))
      if (elapsed >= GAME_SECONDS) {
        w.alive = false
        cancelAnimationFrame(w.raf)
        setResult(settle(w.counts))
        setPhase('result')
        return
      }
      w.raf = requestAnimationFrame(step)
    }

    w.raf = requestAnimationFrame(step)
    return () => {
      w.alive = false
      cancelAnimationFrame(w.raf)
    }
  }, [phase])

  /** 键盘方向键控碗（PC） */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') world.current.keys.left = true
      if (e.key === 'ArrowRight') world.current.keys.right = true
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') world.current.keys.left = false
      if (e.key === 'ArrowRight') world.current.keys.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  /** 指针/触控移动碗（跟随手指，touch-action 由容器 CSS 关闭） */
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const area = areaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    world.current.bowlX = Math.min(95, Math.max(5, x))
  }, [])

  return { phase, timeLeft, items, caughtTotal, result, areaRef, bowlRef, itemEls, start, onPointerMove }
}
