import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GameShell from '../../components/GameShell'
import { useSaveImage } from '../../lib/useSaveImage'
import {
  ROUND_SECONDS,
  buildBoard,
  rouletteSteps,
  settleRound,
  type BoardItem,
  type SettleResult,
} from './game'

type Phase = 'idle' | 'countdown' | 'playing' | 'roulette' | 'result'

const ENDING_TEXT: Record<SettleResult['ending'], string> = {
  clean: '手感稳准狠，剩下的就是它！',
  roulette: '纠结到最后，命运帮你选了——',
  'all-removed': '全都不要？挑食冠军就是你了。行吧，系统替你抽的：',
}

export default function EliminationGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [board, setBoard] = useState<BoardItem[]>([])
  const [eliminated, setEliminated] = useState<ReadonlySet<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [countdown, setCountdown] = useState(3)
  const [settle, setSettle] = useState<SettleResult | null>(null)
  const [hlIdx, setHlIdx] = useState(-1)

  const eliminatedRef = useRef(eliminated)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const start = useCallback(() => {
    setBoard(buildBoard())
    setEliminated(new Set())
    eliminatedRef.current = new Set()
    setSettle(null)
    setHlIdx(-1)
    setTimeLeft(ROUND_SECONDS)
    setCountdown(3)
    setPhase('countdown')
  }, [])

  /** 结算（读 ref 避免闭包过期） */
  const finish = useCallback(() => {
    const result = settleRound(
      board.map((b) => b.food),
      eliminatedRef.current,
    )
    setSettle(result)
    if (result.ending === 'roulette') {
      setPhase('roulette')
    } else {
      setPhase('result')
    }
  }, [board])

  /** 3-2-1 倒计时 */
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 650)
    return () => clearTimeout(t)
  }, [phase, countdown])

  /** 10 秒主计时 */
  useEffect(() => {
    if (phase !== 'playing') return
    const deadline = Date.now() + ROUND_SECONDS * 1000
    const timer = setInterval(() => {
      const remain = Math.max(0, (deadline - Date.now()) / 1000)
      setTimeLeft(remain)
      if (remain <= 0) {
        clearInterval(timer)
        finish()
      }
    }, 100)
    return () => clearInterval(timer)
  }, [phase, finish])

  /** 轮盘决胜：高亮递减速停在被选中项上 */
  useEffect(() => {
    if (phase !== 'roulette' || !settle) return
    const { pool, food } = settle
    const steps = rouletteSteps(pool, food)
    let i = 0
    const tick = () => {
      setHlIdx(i % pool.length)
      i++
      if (i < steps) {
        setTimeout(tick, 70 * Math.pow(1.22, i))
      } else {
        setTimeout(() => setPhase('result'), 500)
      }
    }
    const t0 = setTimeout(tick, 300)
    return () => clearTimeout(t0)
  }, [phase, settle])

  const eliminate = useCallback(
    (id: string) => {
      if (phaseRef.current !== 'playing' || eliminatedRef.current.has(id)) return
      const next = new Set(eliminatedRef.current).add(id)
      eliminatedRef.current = next
      setEliminated(next)
      // 全删光：提前结算（all-removed 结局）
      if (next.size === board.length) finish()
    },
    [board.length, finish],
  )

  const remaining = board.length - eliminated.size

  return (
    <GameShell title="极速淘汰赛">
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="idle" className="flex flex-col items-center gap-8 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            >
              <span className="text-6xl">⚡</span>
              <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                <p>10 秒内，点掉所有你<span className="font-bold text-rose-300">不想吃</span>的。</p>
                <p>时间到，剩下什么吃什么。</p>
                <p className="text-xs text-slate-500">全删光会有特别结局。</p>
              </div>
              <button
                type="button"
                onClick={start}
                className="glow-pulse rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-12 py-3.5 text-lg font-black tracking-widest text-night-900 transition-transform hover:scale-[1.03] active:scale-95"
              >
                开始挑战
              </button>
            </motion.div>
          )}

          {phase === 'countdown' && (
            <motion.p key={`cd-${countdown}`} className="font-display text-8xl font-black text-gold-400"
              initial={{ scale: 2.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              {countdown > 0 ? countdown : 'Go!'}
            </motion.p>
          )}

          {(phase === 'playing' || phase === 'roulette') && (
            <motion.div key="board" className="flex w-full flex-col gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              {/* HUD */}
              <div className="flex items-center gap-3">
                <span className="font-display w-14 text-xl font-bold text-gold-300">
                  {timeLeft.toFixed(1)}s
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-night-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-gold-400 to-rose-400 transition-[width] duration-100"
                    style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-slate-400">剩 {remaining}</span>
              </div>

              {/* 散落面板 */}
              <div className="relative h-[62vh] max-h-[560px] min-h-[380px] w-full overflow-hidden rounded-2xl border border-night-600 bg-night-800/50">
                {board.map(({ food, left, top, rot }) => {
                  const dead = eliminated.has(food.id)
                  const hl = phase === 'roulette' && settle?.pool[hlIdx]?.id === food.id
                  return (
                    <button
                      key={food.id}
                      type="button"
                      disabled={dead || phase !== 'playing'}
                      onClick={() => eliminate(food.id)}
                      aria-label={`不要${food.name}`}
                      className={`absolute flex w-[22%] flex-col items-center gap-0.5 rounded-xl p-1 transition-all duration-300 focus:outline-none ${
                        dead
                          ? 'pointer-events-none scale-0 rotate-45 opacity-0'
                          : 'hover:scale-110 active:scale-95'
                      } ${hl ? 'bg-gold-400/25 ring-2 ring-gold-300' : ''}`}
                      style={{ left: `${left}%`, top: `${top}%`, transform: dead ? undefined : `rotate(${rot}deg)` }}
                    >
                      <span className="text-3xl sm:text-4xl">{food.emoji}</span>
                      <span className="text-[9px] leading-tight text-slate-400">{food.name}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-[11px] tracking-widest text-slate-500">
                {phase === 'playing' ? '点掉不想吃的！' : '决胜中……'}
              </p>
            </motion.div>
          )}

          {phase === 'result' && settle && (
            <ResultCard key="result" result={settle} onAgain={start} />
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  )
}

function ResultCard({ result, onAgain }: { result: SettleResult; onAgain: () => void }) {
  const { targetRef, saveState, save } = useSaveImage(`极速淘汰赛-${result.food.name}.png`)
  return (
    <motion.div
      className="flex w-full flex-col items-center gap-5"
      initial={{ opacity: 0, y: 36, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div
        ref={targetRef}
        className="paper relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-gold-500/50 px-5 py-6 text-center"
        style={{ boxShadow: '0 10px 44px rgba(91,168,255,0.25)' }}
      >
        <p className="font-display text-[11px] tracking-[0.5em] text-gold-500/80">极速淘汰赛 · 结算</p>
        <span className="mt-4 block text-6xl">{result.food.emoji}</span>
        <p className="font-display mt-3 text-2xl font-bold text-gold-200">{result.food.name}</p>
        <p className="mt-4 text-[13px] leading-relaxed text-slate-300">{ENDING_TEXT[result.ending]}</p>
        {result.ending === 'all-removed' && (
          <p className="mt-2 text-[11px] text-slate-500">（这么挑剔，建议喝水）</p>
        )}
        <p className="mt-5 border-t border-gold-500/20 pt-3 text-[9px] tracking-[0.15em] text-slate-500">
          干饭游戏大全 · 极速淘汰赛
        </p>
      </div>

      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <button
          type="button"
          onClick={save}
          className="glow-pulse w-full rounded-full bg-gradient-to-b from-gold-400 to-gold-600 py-3 font-bold text-night-900 transition-transform active:scale-[0.98]"
        >
          {saveState === 'saving' ? '生成图片中……' : saveState === 'done' ? '已保存 ✓' : saveState === 'error' ? '保存失败，重试一下' : '保存结算卡图片'}
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="w-full rounded-full border border-gold-500/40 bg-night-700/50 py-3 font-bold text-gold-300 transition-transform hover:bg-night-600/60 active:scale-[0.98]"
        >
          再来一局
        </button>
      </div>
    </motion.div>
  )
}
