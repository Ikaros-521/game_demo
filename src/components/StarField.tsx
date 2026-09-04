import { useMemo } from 'react'

interface StarSpec {
  left: string
  top: string
  size: number
  dur: string
  delay: string
}

interface PetalSpec {
  left: string
  size: number
  dur: string
  delay: string
  drift: string
}

/** 星光夜空 + 樱花飘落背景层（纯 CSS 代码绘制，零素材） */
export default function StarField() {
  const stars = useMemo<StarSpec[]>(
    () =>
      Array.from({ length: 56 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2.5,
        dur: `${2 + Math.random() * 2.5}s`,
        delay: `${Math.random() * 4}s`,
      })),
    [],
  )

  const petals = useMemo<PetalSpec[]>(
    () =>
      Array.from({ length: 10 }, () => ({
        left: `${Math.random() * 100}%`,
        size: 12 + Math.random() * 10,
        dur: `${10 + Math.random() * 7}s`,
        delay: `${Math.random() * 12}s`,
        drift: `${(Math.random() - 0.5) * 12}vw`,
      })),
    [],
  )

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* 夜空底色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 80% at 50% -10%, #1c2550 0%, #0b1026 45%, #05081a 100%)',
        }}
      />
      {/* 底部金色氛围光 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: 'linear-gradient(0deg, rgba(255,197,61,0.07), transparent)' }}
      />
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="star"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              '--dur': s.dur,
              '--delay': s.delay,
            } as React.CSSProperties
          }
        />
      ))}
      {petals.map((p, i) => (
        <span
          key={`petal-${i}`}
          className="petal"
          style={
            {
              left: p.left,
              fontSize: p.size,
              '--dur': p.dur,
              '--delay': p.delay,
              '--drift': p.drift,
            } as React.CSSProperties
          }
        >
          🌸
        </span>
      ))}
    </div>
  )
}
