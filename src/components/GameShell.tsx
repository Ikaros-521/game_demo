import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface GameShellProps {
  title: string
  children: ReactNode
}

/** 游戏页公共壳：顶栏（返回大全 + 标题）+ 居中限宽容器 */
export default function GameShell({ title, children }: GameShellProps) {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 pb-8 pt-4">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-full border border-night-600 bg-night-800/70 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-gold-500/50 hover:text-gold-300"
        >
          ← 大全
        </Link>
        <span className="font-display text-sm tracking-[0.35em] text-gold-300/90">{title}</span>
        {/* 占位保持标题居中 */}
        <span className="w-[60px]" />
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
