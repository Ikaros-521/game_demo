import { PERSONAS, QUESTIONS, type Axis, type Persona, type PersonaKey } from './data'

/** 每个维度对应的题目下标（每维度 2 题） */
const AXIS_QUESTIONS: Record<Axis, [number, number]> = {
  flavor: [0, 1],
  social: [2, 3],
  explore: [4, 5],
  pace: [6, 7],
}

const AXES: readonly Axis[] = ['flavor', 'social', 'explore', 'pace']

type Answer = 'a' | 'b'

/**
 * 由答案序列映射干饭人格。
 * 每维度 2 票定方向；平票时第一题的答案决定（保证确定性）。
 */
export function computePersona(answers: ReadonlyArray<Answer>): Persona {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`需要 ${QUESTIONS.length} 个答案，收到 ${answers.length}`)
  }
  const picked: string[] = AXES.map((axis) => {
    const [qi, qj] = AXIS_QUESTIONS[axis]
    const firstVotes = (answers[qi] === 'a' ? 1 : 0) + (answers[qj] === 'a' ? 1 : 0)
    // a 恒为该维度第一特质；平票 → 第一题答案
    return firstVotes >= 1 && (firstVotes > 1 || answers[qi] === 'a') ? 'a' : 'b'
  })
  const key = `${picked[0] === 'a' ? 'bold' : 'mild'}-${picked[1] === 'a' ? 'solo' : 'social'}-${picked[2] === 'a' ? 'novel' : 'classic'}-${picked[3] === 'a' ? 'fast' : 'slow'}` as PersonaKey
  return PERSONAS[key]
}
