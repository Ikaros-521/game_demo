import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const GAMES = [
  { to: '/fortune', emoji: '🎴', name: '干饭运势签', tag: '三选一翻牌 · SSR 全屏爆发', accent: '#ff7ad9' },
  { to: '/elimination', emoji: '⚡', name: '极速淘汰赛', tag: '10 秒点掉不想要的 · 剩下就吃它', accent: '#5ba8ff' },
  { to: '/personality', emoji: '🎭', name: '干饭人格测试', tag: '8 道题解锁 16 种干饭人设', accent: '#b18cff' },
  { to: '/catch', emoji: '🥣', name: '天降干饭', tag: '30 秒接食物 · 接啥吃啥', accent: '#ffc53d' },
] as const

const TITLE = '干饭游戏大全'

export default function Hub() {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center px-4 py-10">
      <div className="mb-10 flex flex-col items-center gap-3">
        <motion.span
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🍚
        </motion.span>
        <h1 className="font-display flex gap-1 text-4xl font-black tracking-[0.14em]">
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.09, type: 'spring', stiffness: 220, damping: 17 }}
              style={{ filter: 'drop-shadow(0 2px 10px rgba(255,197,61,0.3))' }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="text-xs tracking-[0.35em] text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          今天吃什么 · 玩一局就知道
        </motion.p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {GAMES.map((g, i) => (
          <motion.div
            key={g.to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.09, type: 'spring', stiffness: 220, damping: 20 }}
          >
            <Link
              to={g.to}
              className="group flex h-full flex-col items-center gap-2 rounded-2xl border bg-night-800/70 px-3 py-5 text-center backdrop-blur transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
              style={{ borderColor: `${g.accent}55`, boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
              aria-label={g.name}
            >
              <span className="text-4xl transition-transform group-hover:scale-110">{g.emoji}</span>
              <span className="font-display text-base font-bold tracking-wider" style={{ color: g.accent }}>
                {g.name}
              </span>
              <span className="text-[11px] leading-relaxed text-slate-400">{g.tag}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        纯本地运行 · 离线可玩 · emoji + CSS 零素材
      </motion.p>
    </div>
  )
}
