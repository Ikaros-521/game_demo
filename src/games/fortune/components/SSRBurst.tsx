import { motion } from 'framer-motion'

/** SSR 全屏爆发特效：彩虹光环 + 大字 + 粒子，约 2.2s 后自动退场 */
export default function SSRBurst() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 径向强光 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255,230,150,0.5) 0%, rgba(255,120,220,0.18) 35%, transparent 70%)',
        }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.4, opacity: [0, 1, 0.9] }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />
      {/* 扩散光环 ×3（错峰） */}
      {[0, 0.25, 0.5].map((delay) => (
        <motion.div
          key={delay}
          className="absolute"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 2.6, opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, delay, ease: 'easeOut' }}
          style={{ width: '42vmin', height: '42vmin' }}
        >
          <div className="burst-ring" />
        </motion.div>
      ))}
      {/* 飞散粒子 */}
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute text-lg"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * (90 + (i % 3) * 40),
              y: Math.sin(angle) * (90 + (i % 4) * 30),
              opacity: [0, 1, 0],
              rotate: 180,
            }}
            transition={{ duration: 1.3, delay: 0.15 + (i % 5) * 0.06, ease: 'easeOut' }}
          >
            {['✨', '🌟', '💫'][i % 3]}
          </motion.span>
        )
      })}
      {/* SSR 大字 */}
      <motion.div
        className="rainbow-ring relative bg-gradient-to-b from-[#2a1050] to-[#12082a] bg-clip-text text-transparent"
        initial={{ scale: 2.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
      >
        <span
          className="font-display px-6 py-2 text-7xl font-black tracking-[0.12em] sm:text-8xl"
          style={{
            background: 'linear-gradient(180deg,#ffe25e,#ff5ec4 55%,#7a5eff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 0 18px rgba(255,94,196,0.65))',
          }}
        >
          SSR
        </span>
      </motion.div>
    </motion.div>
  )
}
