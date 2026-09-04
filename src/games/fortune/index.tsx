import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GameShell from '../../components/GameShell'
import { useDraw } from './game/useDraw'
import StartScreen from './components/StartScreen'
import CardTable from './components/CardTable'
import ResultPanel from './components/ResultPanel'
import SSRBurst from './components/SSRBurst'

/** 方案 A：干饭运势签（三选一翻牌抽卡） */
export default function FortuneGame() {
  const { phase, hand, chosen, drawCount, start, onDealt, choose, onRevealed } = useDraw()

  /** SSR 爆发特效：翻开结果是 SSR 时播放约 2.4s */
  const [burst, setBurst] = useState(false)
  useEffect(() => {
    if (phase === 'result' && chosen !== null && hand[chosen]?.food.rarity === 'SSR') {
      setBurst(true)
      const t = setTimeout(() => setBurst(false), 2400)
      return () => clearTimeout(t)
    }
  }, [phase, chosen, hand])

  const fortune = chosen !== null ? hand[chosen] : null

  return (
    <GameShell title="干饭运势签">
      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {phase === 'idle' ? (
            <StartScreen key="start" onStart={start} />
          ) : (
            <motion.div key="table" className="flex w-full flex-col items-center gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CardTable
                phase={phase}
                hand={hand}
                chosen={chosen}
                handKey={drawCount}
                onDealt={onDealt}
                choose={choose}
                onRevealed={onRevealed}
              />
              {phase === 'result' && fortune && (
                <ResultPanel fortune={fortune} drawCount={drawCount} onAgain={start} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>{burst && <SSRBurst key="burst" />}</AnimatePresence>
    </GameShell>
  )
}
