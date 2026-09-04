import { motion } from 'framer-motion'
import { RARITY_META, RARITY_ORDER } from '../game/rarity'

interface StartScreenProps {
  onStart: () => void
}

const TITLE = '干饭运势签'

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      className="flex w-full flex-col items-center gap-10 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.span
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🍚
        </motion.span>
        <h1 className="font-display flex gap-1 text-4xl font-black tracking-[0.18em] sm:text-5xl">
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 24, rotateX: 60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 200, damping: 16 }}
              style={{ filter: 'drop-shadow(0 2px 10px rgba(255,197,61,0.35))' }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="font-display text-sm tracking-[0.45em] text-gold-300/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          今日吃什么 · 一签定乾坤
        </motion.p>
      </div>

      <motion.button
        type="button"
        onClick={onStart}
        className="glow-pulse rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-12 py-4 text-lg font-black tracking-widest text-night-900 transition-transform hover:scale-[1.03] active:scale-[0.97]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, type: 'spring', stiffness: 220, damping: 18 }}
        whileTap={{ scale: 0.96 }}
      >
        抽取今日干饭签
      </motion.button>

      <motion.div
        className="flex flex-col items-center gap-2 text-[11px] tracking-wider text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
      >
        <div className="flex gap-3.5">
          {RARITY_ORDER.map((r) => (
            <span key={r} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: RARITY_META[r].color }} />
              <span style={{ color: RARITY_META[r].color }}>{r}</span>
              <span>{RARITY_META[r].rate}</span>
            </span>
          ))}
        </div>
        <p>三选一翻牌 · 保底 R · 纯本地抽签不联网</p>
      </motion.div>
    </motion.div>
  )
}
