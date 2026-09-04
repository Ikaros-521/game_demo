import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GameShell from '../../components/GameShell'
import { useSaveImage } from '../../lib/useSaveImage'
import { PERSONAS, QUESTIONS, personaAccent, type Persona } from './data'
import { computePersona } from './game'

type Phase = 'idle' | 'quiz' | 'calc' | 'result'

export default function PersonalityGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [answers, setAnswers] = useState<('a' | 'b')[]>([])
  const [persona, setPersona] = useState<Persona | null>(null)

  const start = () => {
    setAnswers([])
    setPersona(null)
    setPhase('quiz')
  }

  const answer = (choice: 'a' | 'b') => {
    const next = [...answers, choice]
    setAnswers(next)
    if (next.length === QUESTIONS.length) setPhase('calc')
  }

  useEffect(() => {
    if (phase !== 'calc') return
    const t = setTimeout(() => {
      setPersona(computePersona(answers))
      setPhase('result')
    }, 1400)
    return () => clearTimeout(t)
  }, [phase, answers])

  return (
    <GameShell title="干饭人格测试">
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="idle" className="flex flex-col items-center gap-8 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            >
              <span className="text-6xl">🎭</span>
              <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                <p>8 道干饭选择题，没有正确答案。</p>
                <p>测出你藏在胃里的真实人格——</p>
                <p className="text-xs text-slate-500">共 16 种干饭人设，看看你是哪一款。</p>
              </div>
              <button
                type="button"
                onClick={start}
                className="glow-pulse rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-12 py-3.5 text-lg font-black tracking-widest text-night-900 transition-transform hover:scale-[1.03] active:scale-95"
              >
                开始测试
              </button>
            </motion.div>
          )}

          {phase === 'quiz' && (
            <QuizCard key={`q-${answers.length}`} index={answers.length} onAnswer={answer} />
          )}

          {phase === 'calc' && (
            <motion.div key="calc" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.span
                className="text-6xl"
                animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                🍜
              </motion.span>
              <p className="text-sm tracking-[0.3em] text-gold-300">正在解析干饭人格……</p>
            </motion.div>
          )}

          {phase === 'result' && persona && (
            <PersonaCard key="result" persona={persona} onAgain={start} />
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  )
}

function QuizCard({ index, onAnswer }: { index: number; onAnswer: (c: 'a' | 'b') => void }) {
  const q = QUESTIONS[index]
  return (
    <motion.div
      className="flex w-full flex-col gap-6"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] tracking-widest text-slate-400">
          <span>第 {index + 1} / {QUESTIONS.length} 题</span>
          <span>凭直觉选</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-night-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-500 to-rose-400 transition-all duration-300"
            style={{ width: `${(index / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-center text-xl font-bold leading-relaxed text-gold-200">{q.q}</h2>

      <div className="flex flex-col gap-3">
        {(['a', 'b'] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onAnswer(choice)}
            className="flex items-center gap-3 rounded-2xl border border-night-600 bg-night-800/70 px-5 py-4 text-left text-sm leading-relaxed text-slate-200 transition-all hover:border-gold-500/60 hover:bg-night-700/70 active:scale-[0.98]"
          >
            <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-500/60 text-xs font-bold text-gold-300">
              {choice.toUpperCase()}
            </span>
            {choice === 'a' ? q.a : q.b}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function PersonaCard({ persona, onAgain }: { persona: Persona; onAgain: () => void }) {
  const { targetRef, saveState, save } = useSaveImage(`干饭人格-${persona.title}.png`)
  const accent = personaAccent(persona)
  const partner = PERSONAS[persona.partnerKey]

  return (
    <motion.div
      className="flex w-full flex-col items-center gap-5"
      initial={{ opacity: 0, y: 36, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div
        ref={targetRef}
        className="paper relative w-full max-w-[340px] overflow-hidden rounded-2xl border px-5 py-6"
        style={{ borderColor: `${accent}88`, boxShadow: `0 10px 44px ${accent}33` }}
      >
        <p className="font-display text-center text-[11px] tracking-[0.5em]" style={{ color: `${accent}cc` }}>
          干饭人格鉴定书
        </p>

        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-6xl">{persona.emoji}</span>
          <p className="font-display text-2xl font-black tracking-wider" style={{ color: accent }}>
            {persona.title}
          </p>
        </div>

        <div className="mt-5 space-y-2.5 text-[13px] leading-relaxed">
          <p><span className="mr-2 rounded bg-gold-400/15 px-1.5 py-0.5 font-bold text-gold-300">本命</span><span className="text-slate-200">{persona.food}</span></p>
          <p><span className="mr-2 rounded bg-sky-400/15 px-1.5 py-0.5 font-bold text-sky-300">天赋</span><span className="text-slate-200">{persona.skill}</span></p>
          <p><span className="mr-2 rounded bg-rose-400/15 px-1.5 py-0.5 font-bold text-rose-300">弱点</span><span className="text-slate-200">{persona.weakness}</span></p>
          <p><span className="mr-2 rounded bg-violet-400/15 px-1.5 py-0.5 font-bold text-violet-300">搭子</span><span className="text-slate-200">{partner.emoji} {partner.title}</span></p>
        </div>

        <p className="font-display mt-5 border-t border-gold-500/20 pt-4 text-center text-[13px] italic leading-relaxed text-gold-300">
          「{persona.comment}」
        </p>
        <p className="mt-4 text-center text-[9px] tracking-[0.15em] text-slate-500">
          干饭游戏大全 · 16 分之 1 的你
        </p>
      </div>

      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <button
          type="button"
          onClick={save}
          className="glow-pulse w-full rounded-full bg-gradient-to-b from-gold-400 to-gold-600 py-3 font-bold text-night-900 transition-transform active:scale-[0.98]"
        >
          {saveState === 'saving' ? '生成图片中……' : saveState === 'done' ? '已保存 ✓' : saveState === 'error' ? '保存失败，重试一下' : '保存人设卡图片'}
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="w-full rounded-full border border-gold-500/40 bg-night-700/50 py-3 font-bold text-gold-300 transition-transform hover:bg-night-600/60 active:scale-[0.98]"
        >
          重新测试
        </button>
      </div>
    </motion.div>
  )
}
