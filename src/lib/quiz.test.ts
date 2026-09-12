import { describe, expect, it } from 'vitest'
import {
  grade,
  isCorrect,
  percentage,
  recordAnswer,
  scoreOf,
} from './quiz'
import type { Question } from '../types'

const q: Question = {
  id: 'demo',
  topic: 'מזונות',
  prompt: 'שאלת בדיקה',
  options: ['א', 'ב', 'ג', 'ד'],
  correctIndex: 2,
  explanation: 'הסבר',
}

describe('quiz logic', () => {
  it('detects a correct answer', () => {
    expect(isCorrect(q, 2)).toBe(true)
    expect(isCorrect(q, 0)).toBe(false)
  })

  it('records answers with correctness', () => {
    expect(recordAnswer(q, 2)).toEqual({
      questionId: 'demo',
      selectedIndex: 2,
      correct: true,
    })
    expect(recordAnswer(q, 1).correct).toBe(false)
  })

  it('scores a set of answers', () => {
    const answers = [recordAnswer(q, 2), recordAnswer(q, 0), recordAnswer(q, 2)]
    expect(scoreOf(answers)).toBe(2)
  })

  it('computes percentages safely', () => {
    expect(percentage(2, 4)).toBe(50)
    expect(percentage(0, 0)).toBe(0)
    expect(percentage(1, 3)).toBe(33)
  })

  it('maps percentages to grades', () => {
    expect(grade(95)).toBe('מצוין')
    expect(grade(80)).toBe('טוב מאוד')
    expect(grade(65)).toBe('טוב')
    expect(grade(55)).toBe('עובר')
    expect(grade(20)).toBe('טעון שיפור')
  })
})
