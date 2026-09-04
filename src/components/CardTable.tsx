import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Fortune } from '../game/fortune'
import type { Phase } from '../game/useDraw'
import FortuneCard from './FortuneCard'

interface CardTableProps {
  phase: Phase
  hand: Fortune[]
  chosen: number | null
  /** 每次抽签递增，用于强制重挂载卡牌（重播发牌动画） */
  handKey: number
  onDealt: () => void
  choose: (i: number) => void
  onRevealed: () => void
}

const HINTS: Record<string, string> = {
  dealing: '洗牌发签中……',
  picking: '凭直觉，翻一张',
  revealing: '命运揭晓……',
  result: '就是它了！',
}

export default function CardTable({ phase, hand, chosen, handKey, onDealt, choose, onRevealed }: CardTableProps) {
  /** revealing 阶段，另两张延迟自动翻开（选中牌先翻） */
  const [othersUp, setOthersUp] = useState(false)

  useEffect(() => {
    if (phase === 'revealing') {
      setOthersUp(false)
      const t = setTimeout(() => setOthersUp(true), 420)
      return () => clearTimeout(t)
    }
  }, [phase, chosen])

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          className="font-display text-sm tracking-[0.4em] text-gold-400/90"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {HINTS[phase]}
        </motion.p>
      </AnimatePresence>

      <div className="flex w-full items-start justify-center gap-3 px-2 sm:gap-5">
        {hand.map((fortune, i) => (
          <FortuneCard
            key={`${handKey}-${i}`}
            fortune={fortune}
            index={i}
            dealing={phase === 'dealing'}
            faceUp={
              phase === 'result' ? true : i === chosen ? true : phase === 'revealing' && othersUp
            }
            isChosen={phase === 'revealing' || phase === 'result' ? i === chosen : false}
            dimmed={(phase === 'revealing' || phase === 'result') && i !== chosen}
            clickable={phase === 'picking'}
            onClick={() => choose(i)}
            onDealComplete={onDealt}
            onFlipComplete={onRevealed}
          />
        ))}
      </div>
    </div>
  )
}
