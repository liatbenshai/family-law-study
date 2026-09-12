import { useMemo, useState, type CSSProperties } from 'react'
import { QUESTIONS, TOPICS, questionsForTopic } from './data/questions'
import type { AnswerRecord, Question, Topic } from './types'
import { grade, percentage, recordAnswer, scoreOf } from './lib/quiz'

type Screen = 'home' | 'quiz' | 'results'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'הכול'>('הכול')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [picked, setPicked] = useState<number | null>(null)

  function startQuiz(topic: Topic | 'הכול') {
    const set = topic === 'הכול' ? QUESTIONS : questionsForTopic(topic)
    setSelectedTopic(topic)
    setQuestions(set)
    setCurrent(0)
    setAnswers([])
    setPicked(null)
    setScreen('quiz')
  }

  function choose(index: number) {
    if (picked !== null) return
    setPicked(index)
    setAnswers((prev) => [...prev, recordAnswer(questions[current], index)])
  }

  function next() {
    if (current + 1 >= questions.length) {
      setScreen('results')
    } else {
      setCurrent((c) => c + 1)
      setPicked(null)
    }
  }

  function restart() {
    setScreen('home')
  }

  if (screen === 'home') {
    return <Home onStart={startQuiz} />
  }

  if (screen === 'results') {
    return (
      <Results
        answers={answers}
        total={questions.length}
        topic={selectedTopic}
        onRestart={restart}
      />
    )
  }

  const q = questions[current]
  return (
    <QuizView
      question={q}
      index={current}
      total={questions.length}
      picked={picked}
      onChoose={choose}
      onNext={next}
    />
  )
}

function Home({ onStart }: { onStart: (topic: Topic | 'הכול') => void }) {
  return (
    <div className="app">
      <header className="hero">
        <div className="badge">לימוד ותרגול</div>
        <h1>דיני משפחה</h1>
        <p className="subtitle">
          בחרו נושא ותרגלו שאלות רב-ברירה עם הסברים מנומקים ומקורות חוק.
        </p>
      </header>

      <section className="card">
        <h2>בחירת נושא</h2>
        <div className="topic-grid">
          <button
            className="topic all"
            onClick={() => onStart('הכול')}
            aria-label="התחלת מבחן בכל הנושאים"
          >
            <span className="topic-title">כל הנושאים</span>
            <span className="topic-count">{QUESTIONS.length} שאלות</span>
          </button>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              className="topic"
              onClick={() => onStart(topic)}
            >
              <span className="topic-title">{topic}</span>
              <span className="topic-count">
                {questionsForTopic(topic).length} שאלות
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="foot">
        להמחשה חינוכית בלבד — אינו מהווה ייעוץ משפטי.
      </footer>
    </div>
  )
}

function QuizView({
  question,
  index,
  total,
  picked,
  onChoose,
  onNext,
}: {
  question: Question
  index: number
  total: number
  picked: number | null
  onChoose: (i: number) => void
  onNext: () => void
}) {
  const progress = Math.round(((index + (picked !== null ? 1 : 0)) / total) * 100)
  return (
    <div className="app">
      <header className="quiz-head">
        <span className="pill">{question.topic}</span>
        <span className="counter">
          שאלה {index + 1} מתוך {total}
        </span>
      </header>

      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <section className="card">
        <h2 className="prompt">{question.prompt}</h2>
        <ul className="options">
          {question.options.map((opt, i) => {
            const isCorrectOpt = i === question.correctIndex
            const isPicked = i === picked
            let state = ''
            if (picked !== null) {
              if (isCorrectOpt) state = 'correct'
              else if (isPicked) state = 'wrong'
            }
            return (
              <li key={i}>
                <button
                  className={`option ${state}`}
                  disabled={picked !== null}
                  onClick={() => onChoose(i)}
                >
                  <span className="marker">{'אבגד'[i]}</span>
                  <span>{opt}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {picked !== null && (
          <div
            className={`explain ${
              picked === question.correctIndex ? 'ok' : 'bad'
            }`}
          >
            <strong>
              {picked === question.correctIndex ? 'תשובה נכונה!' : 'תשובה שגויה'}
            </strong>
            <p>{question.explanation}</p>
          </div>
        )}

        <div className="actions">
          <button
            className="primary"
            disabled={picked === null}
            onClick={onNext}
          >
            {index + 1 >= total ? 'סיום וצפייה בתוצאות' : 'לשאלה הבאה'}
          </button>
        </div>
      </section>
    </div>
  )
}

function Results({
  answers,
  total,
  topic,
  onRestart,
}: {
  answers: AnswerRecord[]
  total: number
  topic: Topic | 'הכול'
  onRestart: () => void
}) {
  const correct = useMemo(() => scoreOf(answers), [answers])
  const percent = percentage(correct, total)
  return (
    <div className="app">
      <section className="card results">
        <div className="badge">תוצאות</div>
        <h1>{grade(percent)}</h1>
        <div
          className="score-ring"
          style={{ ['--p' as string]: percent } as CSSProperties}
        >
          <span className="score-num">{percent}%</span>
        </div>
        <p className="score-line">
          ענית נכון על <strong>{correct}</strong> מתוך <strong>{total}</strong>{' '}
          שאלות בנושא <strong>{topic}</strong>.
        </p>
        <div className="actions">
          <button className="primary" onClick={onRestart}>
            חזרה לבחירת נושא
          </button>
        </div>
      </section>
    </div>
  )
}
