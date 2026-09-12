export type Topic =
  | 'נישואין וגירושין'
  | 'משמורת וזמני שהות'
  | 'מזונות'
  | 'חלוקת רכוש'
  | 'הורות ואפוטרופסות'

export interface Question {
  id: string
  topic: Topic
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface AnswerRecord {
  questionId: string
  selectedIndex: number
  correct: boolean
}
