import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import type { Fortune } from '../game/fortune'
import { RARITY_META } from '../game/rarity'

interface ResultPanelProps {
  fortune: Fortune
  /** 累计抽签次数（含本次），用于玩梗文案 */
  drawCount: number
  onAgain: () => void
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export default function ResultPanel({ fortune, drawCount, onAgain }: ResultPanelProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const meta = RARITY_META[fortune.food.rarity]

  const saveImage = async () => {
    if (!cardRef.current || saveState === 'saving') return
    setSaveState('saving')
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0b1026',
        filter: (node) => !(node instanceof HTMLElement && node.dataset.noExport === 'true'),
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `干饭运势签-${fortune.food.name}.png`
      a.click()
      setSaveState('done')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2000)
    }
  }

  return (
    <motion.div
      className="flex w-full flex-col items-center gap-5"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
    >
      {/* ── 运势卡（导出目标） ─────────────── */}
      <div
        ref={cardRef}
        className="paper relative w-full max-w-[340px] overflow-hidden rounded-2xl px-5 py-6"
        style={{ border: `1.5px solid ${meta.color}`, boxShadow: `0 10px 44px ${meta.glow}` }}
      >
        {/* 角标纹样 */}
        <span className="absolute left-3 top-2.5 text-gold-500/50">❖</span>
        <span className="absolute right-3 top-2.5 text-gold-500/50">❖</span>

        <p className="font-display text-center text-[11px] tracking-[0.5em] text-gold-500/80">
          今日干饭运势
        </p>
        <p className="mt-1 text-center text-[10px] tracking-[0.2em] text-slate-400/80">{today()}</p>

        <div className="mt-5 flex items-center justify-center gap-4">
          <span className="text-6xl leading-none drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]">
            {fortune.food.emoji}
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-2xl font-bold leading-tight text-gold-200">
              {fortune.food.name}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider"
                style={{ color: meta.color, border: `1px solid ${meta.color}` }}
              >
                {meta.label}
              </span>
              <span className="text-sm tracking-widest">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < fortune.stars ? 'star-glyph text-gold-400' : 'text-night-600'}>
                    ★
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-2.5 text-[13px] leading-relaxed">
          <p>
            <span className="mr-2 rounded bg-emerald-400/15 px-1.5 py-0.5 font-bold text-emerald-300">宜</span>
            <span className="text-slate-200">{fortune.good}</span>
          </p>
          <p>
            <span className="mr-2 rounded bg-rose-400/15 px-1.5 py-0.5 font-bold text-rose-300">忌</span>
            <span className="text-slate-200">{fortune.bad}</span>
          </p>
        </div>

        <p className="font-display mt-5 border-t border-gold-500/20 pt-4 text-center text-[13px] italic leading-relaxed text-gold-300">
          「{fortune.comment}」
        </p>

        <p className="mt-4 text-center text-[9px] tracking-[0.15em] text-slate-500">
          干饭运势签 · N 55% / R 30% / SR 12% / SSR 3%
        </p>
      </div>

      {/* ── 操作按钮 ─────────────────────── */}
      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <button
          type="button"
          onClick={saveImage}
          className="glow-pulse w-full rounded-full bg-gradient-to-b from-gold-400 to-gold-600 py-3 font-bold text-night-900 transition-transform active:scale-[0.98]"
        >
          {saveState === 'saving'
            ? '生成图片中……'
            : saveState === 'done'
              ? '已保存 ✓'
              : saveState === 'error'
                ? '保存失败，重试一下'
                : '保存运势卡图片'}
        </button>
        <button
          type="button"
          onClick={onAgain}
          data-no-export="true"
          className="w-full rounded-full border border-gold-500/40 bg-night-700/50 py-3 font-bold text-gold-300 transition-transform hover:bg-night-600/60 active:scale-[0.98]"
        >
          {drawCount > 1 ? `再抽一签（今日运势 -${drawCount - 1}）` : '不服？再抽一签'}
        </button>
      </div>
    </motion.div>
  )
}
