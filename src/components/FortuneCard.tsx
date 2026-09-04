import { motion } from 'framer-motion'
import type { Fortune } from '../game/fortune'
import { RARITY_META } from '../game/rarity'

export interface FortuneCardProps {
  fortune: Fortune
  /** 是否正面朝上（false = 扣着的卡背） */
  faceUp: boolean
  /** 发牌序号（stagger 动画延迟） */
  index: number
  /** 是否正在发牌入场 */
  dealing: boolean
  /** 是否玩家选中/翻开的牌 */
  isChosen?: boolean
  /** 未选中的另两张（result 阶段压暗） */
  dimmed?: boolean
  clickable?: boolean
  onClick?: () => void
  /** 发牌入场动画完成的回调（仅最后一张触发） */
  onDealComplete?: () => void
  /** 翻牌动画完成回调（仅选中的牌触发） */
  onFlipComplete?: () => void
}

function Stars({ n }: { n: number }) {
  return (
    <span className="tracking-widest text-[11px] leading-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'star-glyph text-gold-400' : 'text-night-600'}>
          ★
        </span>
      ))}
    </span>
  )
}

/** 卡背：夜蓝底 + 金边 + 竖排签文 + 流光 */
function CardBack() {
  return (
    <div className="back-shine relative h-full w-full overflow-hidden rounded-xl border border-gold-600/70 bg-gradient-to-b from-night-600 to-night-800 shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-1.5 rounded-lg border border-gold-500/40" />
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,210,120,0.5)]">🍚</span>
        <div
          className="font-display text-lg tracking-[0.35em] text-gold-300"
          style={{ writingMode: 'vertical-rl' }}
        >
          干飯籤
        </div>
        <div
          className="font-display text-[10px] tracking-[0.3em] text-gold-500/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          今日運勢
        </div>
      </div>
    </div>
  )
}

/** 卡面：稀有度边框 + 食物 + 星级 */
function CardFace({ fortune }: { fortune: Fortune }) {
  const meta = RARITY_META[fortune.food.rarity]
  const isSSR = fortune.food.rarity === 'SSR'
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl p-[2px] ${isSSR ? 'rainbow-ring' : ''}`}
      style={isSSR ? undefined : { background: meta.border, boxShadow: `0 6px 24px ${meta.glow}` }}
    >
      <div
        className="paper relative flex h-full flex-col items-center justify-between rounded-[10px] px-2 py-3"
        style={isSSR ? { boxShadow: '0 6px 28px rgba(255,122,217,0.55)' } : undefined}
      >
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider"
          style={{ color: meta.color, border: `1px solid ${meta.color}`, background: 'rgba(0,0,0,0.25)' }}
        >
          {meta.label}
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-5xl leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]">
            {fortune.food.emoji}
          </span>
          <span className="font-display max-w-full text-center text-[13px] leading-snug text-gold-200">
            {fortune.food.name}
          </span>
        </div>
        <Stars n={fortune.stars} />
      </div>
    </div>
  )
}

export default function FortuneCard({
  fortune,
  faceUp,
  index,
  dealing,
  isChosen = false,
  dimmed = false,
  clickable = false,
  onClick,
  onDealComplete,
  onFlipComplete,
}: FortuneCardProps) {
  return (
    <motion.button
      type="button"
      disabled={!clickable}
      onClick={onClick}
      aria-label={faceUp ? `${fortune.food.name}（${fortune.food.rarity}）` : `第 ${index + 1} 张签`}
      style={{ zIndex: isChosen ? 10 : undefined }}
      className="group relative aspect-[3/4.3] w-full max-w-[150px] [perspective:1000px] focus:outline-none"
      initial={{ y: -60, opacity: 0, scale: 0.7 }}
      animate={
        dealing
          ? { y: 0, opacity: 1, scale: 1 }
          : {
              y: 0,
              opacity: dimmed ? 0.45 : 1,
              scale: isChosen ? 1.08 : dimmed ? 0.92 : 1,
              transition: { type: 'spring', stiffness: 260, damping: 22 },
            }
      }
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.16 }}
      onAnimationComplete={() => {
        if (dealing && index === 2) onDealComplete?.()
      }}
      whileHover={
        clickable
          ? { y: -10, transition: { type: 'spring', stiffness: 300, damping: 15 } }
          : undefined
      }
      whileTap={clickable ? { scale: 0.97 } : undefined}
    >
      {/* hover 光晕 */}
      <div
        className={`absolute -inset-2 rounded-2xl transition-opacity duration-300 ${
          clickable ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
        }`}
        style={{ boxShadow: `0 0 30px 4px ${RARITY_META[fortune.food.rarity].glow}` }}
      />

      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.7, 0.3, 1] }}
        onAnimationComplete={() => {
          if (faceUp && isChosen) onFlipComplete?.()
        }}
      >
        {/* inert：未朝上的一面从可访问性树移除，避免翻开前泄露卡面内容 */}
        <div className="absolute inset-0 [backface-visibility:hidden]" inert={!faceUp}>
          <CardBack />
        </div>
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          inert={faceUp}
        >
          <CardFace fortune={fortune} />
        </div>
      </motion.div>
    </motion.button>
  )
}
