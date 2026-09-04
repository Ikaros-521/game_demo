import { useCallback, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

/** 运势卡/结果卡「保存为图片」公共逻辑 */
export function useSaveImage(filename: string) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  const save = useCallback(async () => {
    if (!targetRef.current || state === 'saving') return
    setState('saving')
    try {
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0b1026',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = filename
      a.click()
      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }, [filename, state])

  return { targetRef, saveState: state, save }
}
