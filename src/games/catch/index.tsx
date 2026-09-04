import GameShell from '../../components/GameShell'
import { useSaveImage } from '../../lib/useSaveImage'
import { useCatchGame } from './useCatchGame'

export default function CatchGame() {
  const { phase, timeLeft, items, caughtTotal, result, areaRef, bowlRef, itemEls, start, onPointerMove } =
    useCatchGame()

  return (
    <GameShell title="天降干饭">
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-8 text-center">
            <span className="text-6xl">🥣</span>
            <div className="space-y-2 text-sm leading-relaxed text-slate-300">
              <p>30 秒，天上下吃的，用碗接住。</p>
              <p>接得最多的那一样，今天就去吃它。</p>
              <p className="text-xs text-slate-500">
                电脑：鼠标移动 / ← → 方向键 · 手机：手指拖动
              </p>
            </div>
            <button
              type="button"
              onClick={start}
              className="glow-pulse rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-12 py-3.5 text-lg font-black tracking-widest text-night-900 transition-transform hover:scale-[1.03] active:scale-95"
            >
              开饭！
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="flex w-full flex-1 flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-black text-gold-300">{timeLeft}s</span>
              <span className="text-xs tracking-widest text-slate-400">🥣 已接 {caughtTotal}</span>
            </div>
            <div
              ref={areaRef}
              onPointerMove={onPointerMove}
              className="touch-none relative min-h-[420px] flex-1 overflow-hidden rounded-2xl border border-night-600 bg-night-800/40"
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  ref={(el) => {
                    if (el) itemEls.current.set(it.id, el)
                    else itemEls.current.delete(it.id)
                  }}
                  className="absolute -translate-x-1/2 text-3xl"
                  style={{ left: `${it.x}%`, top: '-6%' }}
                >
                  {it.food.emoji}
                </div>
              ))}
              <div
                ref={bowlRef}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: '50%', top: '80%' }}
              >
                <span className="block text-5xl drop-shadow-[0_4px_12px_rgba(255,197,61,0.35)]">🥣</span>
                <span className="mt-0.5 block text-[10px] tracking-widest text-gold-400/80">碗</span>
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && result && <ResultCard result={result} onAgain={start} />}
      </div>
    </GameShell>
  )
}

function ResultCard({
  result,
  onAgain,
}: {
  result: import('./game').CatchSettleResult
  onAgain: () => void
}) {
  const isNone = result.ending === 'none'
  const { targetRef, saveState, save } = useSaveImage(
    `天降干饭-${result.food?.name ?? '颗粒无收'}.png`,
  )
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div
        ref={targetRef}
        className="paper relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-gold-500/50 px-5 py-6 text-center"
        style={{ boxShadow: '0 10px 44px rgba(255,197,61,0.25)' }}
      >
        <p className="font-display text-[11px] tracking-[0.5em] text-gold-500/80">天降干饭 · 结算</p>
        <span className="mt-4 block text-6xl">{isNone ? '😮‍💨' : result.food!.emoji}</span>
        <p className="font-display mt-3 text-2xl font-bold text-gold-200">
          {isNone ? '颗粒无收' : result.food!.name}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
          {isNone ? '碗比脸还干净……建议亲自出门觅食。' : `30 秒接到 ${result.top[0].count} 个，今天就它了！`}
        </p>

        {result.top.length > 0 && (
          <div className="mt-5 space-y-1.5 border-t border-gold-500/20 pt-4 text-left">
            {result.top.map(({ food, count }, i) => (
              <div key={food.id} className="flex items-center justify-between px-2 text-[13px]">
                <span className="text-slate-300">
                  <span className="mr-2 text-slate-500">{i + 1}.</span>
                  {food.emoji} {food.name}
                </span>
                <span className="font-display font-bold text-gold-300">×{count}</span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-[9px] tracking-[0.15em] text-slate-500">干饭游戏大全 · 天降干饭</p>
      </div>

      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isNone}
          className="glow-pulse w-full rounded-full bg-gradient-to-b from-gold-400 to-gold-600 py-3 font-bold text-night-900 transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {saveState === 'saving' ? '生成图片中……' : saveState === 'done' ? '已保存 ✓' : saveState === 'error' ? '保存失败，重试一下' : '保存结算卡图片'}
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="w-full rounded-full border border-gold-500/40 bg-night-700/50 py-3 font-bold text-gold-300 transition-transform hover:bg-night-600/60 active:scale-[0.98]"
        >
          再接 30 秒
        </button>
      </div>
    </div>
  )
}
