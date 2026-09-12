import type { AnswerRecord, Question } from '../types'

export function isCorrect(question: Question, selectedIndex: number): boolean {
  return question.correctIndex === selectedIndex
}

export function recordAnswer(
  question: Question,
  selectedIndex: number,
): AnswerRecord {
  return {
    questionId: question.id,
    selectedIndex,
    correct: isCorrect(question, selectedIndex),
  }
}

export function scoreOf(answers: AnswerRecord[]): number {
  return answers.filter((a) => a.correct).length
}

export function percentage(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

export function grade(percent: number): string {
  if (percent >= 90) return 'מצוין'
  if (percent >= 75) return 'טוב מאוד'
  if (percent >= 60) return 'טוב'
  if (percent >= 50) return 'עובר'
  return 'טעון שיפור'
}
