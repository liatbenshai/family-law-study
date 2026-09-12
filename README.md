# family-law-study

אפליקציית ווב אינטראקטיבית ללימוד ותרגול דיני משפחה (מבחני רב-ברירה עם הסברים מנומקים).

An interactive web app for studying and practicing family law through
multiple-choice quizzes with reasoned explanations.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Vitest](https://vitest.dev/) + Testing Library for tests
- ESLint for linting

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Available scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server (host `0.0.0.0`).  |
| `npm run build`   | Type-check and build the production bundle.  |
| `npm run preview` | Preview the production build locally.        |
| `npm run lint`    | Run ESLint over the project.                 |
| `npm run typecheck` | Type-check without emitting output.        |
| `npm test`        | Run the unit tests with Vitest.              |

## Project structure

```
src/
  data/questions.ts   # study questions grouped by topic
  lib/quiz.ts         # pure quiz scoring logic (unit tested)
  App.tsx             # screens: topic picker, quiz, results
  index.css           # styling (RTL, Hebrew)
```

## Cloud Agent environment

The Cloud Agent development environment is defined in
[`.cursor/environment.json`](.cursor/environment.json): `npm ci` installs
dependencies and a `dev` terminal runs the Vite dev server on port 5173.

> להמחשה חינוכית בלבד — התוכן אינו מהווה ייעוץ משפטי.
> For educational demonstration only — content is not legal advice.
