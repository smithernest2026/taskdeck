# TaskDeck

A local-first project & task tracker built with React, TypeScript, and Vite.
All data lives in the browser (localStorage) — no backend, no accounts.

## Features

- Dashboard with live task statistics (totals, completion rate, overdue)
- Task table with sortable columns, async search filtering, and pagination
- Row selection that is preserved across filtering, with bulk actions
- Create, edit, and delete tasks (with a confirmation step)
- Projects to group tasks, with per-project task counts
- Accessible light / dark theme toggle
- State persisted to localStorage

## Architecture

- **State** lives in a `useReducer` store exposed through `StoreProvider`
  (`src/store`) and is persisted to localStorage.
- **Filtering** is simulated as an async, cancellable request
  (`src/data/queryTasks.ts`) and driven by the `useTaskQuery` hook, which
  discards stale out-of-order responses.
- **UI** is composed from small presentational components in `src/components`,
  with one page per route in `src/pages`.

## Requirements

- Node.js 20 (see `.nvmrc`)
- npm

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the Vite dev server          |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build       |
| `npm run lint`      | Run ESLint                         |
| `npm run typecheck` | Type-check without emitting        |
| `npm test`          | Run the Vitest suite               |

## License

Private.
