import { describe, expect, it } from 'vitest'
import { PERSONAS, QUESTIONS, type PersonaKey } from './data'
import { computePersona } from './game'

describe('PERSONAS', () => {
  it('16 种人格齐全且 key 唯一', () => {
    expect(Object.keys(PERSONAS).length).toBe(16)
    expect(new Set(Object.keys(PERSONAS)).size).toBe(16)
  })

  it('partnerKey 全部指向有效人格', () => {
    for (const p of Object.values(PERSONAS)) {
      expect(PERSONAS[p.partnerKey]).toBeTruthy()
    }
  })
})

describe('computePersona', () => {
  it('全 A → 重口/独食/尝新/快节奏', () => {
    expect(computePersona(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']).key).toBe('bold-solo-novel-fast')
  })

  it('全 B → 清淡/拼桌/守旧/慢节奏', () => {
    expect(computePersona(['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']).key).toBe('mild-social-classic-slow')
  })

  it('每维度 2:0 明确取胜', () => {
    // flavor 维度全 b，其余全 a
    const p = computePersona(['b', 'b', 'a', 'a', 'a', 'a', 'a', 'a'])
    expect(p.key).toBe('mild-solo-novel-fast')
  })

  it('平票时第一题的答案决定', () => {
    // flavor 平票（a,b）→ 第一题 a → bold
    expect(computePersona(['a', 'b', 'a', 'a', 'a', 'a', 'a', 'a']).key).toBe('bold-solo-novel-fast')
    // flavor 平票（b,a）→ 第一题 b → mild
    expect(computePersona(['b', 'a', 'a', 'a', 'a', 'a', 'a', 'a']).key).toBe('mild-solo-novel-fast')
  })

  it('8 道题答案组合可覆盖全部 16 种人格', () => {
    const seen = new Set<PersonaKey>()
    // 遍历 4 个维度的 2^4 取向（每维度两题同票）
    for (let mask = 0; mask < 16; mask++) {
      const answers = Array.from({ length: 8 }, (_, i) => {
        const axisPair = Math.floor(i / 2) // 0..3
        const bit = (mask >> axisPair) & 1
        return bit === 0 ? 'a' : 'b'
      }) as ('a' | 'b')[]
      seen.add(computePersona(answers).key)
    }
    expect(seen.size).toBe(16)
  })
})

describe('QUESTIONS', () => {
  it('8 道题、每维度 2 道', () => {
    expect(QUESTIONS.length).toBe(8)
    const count: Record<string, number> = {}
    for (const q of QUESTIONS) count[q.axis] = (count[q.axis] ?? 0) + 1
    expect(new Set(Object.values(count))).toEqual(new Set([2]))
  })
})
