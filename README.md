# Cheap Accountant

A small double-entry bookkeeping app built with Angular 22. Every transaction is
recorded as a balanced set of debits and credits, and the ledgers and trial
balance are derived from those entries. All data is kept in the browser's
`localStorage`, so there's no backend to run.

## Features

- **Journal** for recording transactions, with a live debit/credit balance check
  that blocks unbalanced entries.
- **Ledger** showing every posting to a single account with a running balance.
- **Trial balance** and totals on the dashboard.
- **Chart of accounts** grouped by type (assets, liabilities, equity, income,
  expenses), with a seed set on first load.

## Requirements

- Node 22.22.3+ (or 24.15+). If you use `nvm`: `nvm use 22`.
- The Angular CLI is included as a dev dependency, so `npx ng ...` or the npm
  scripts below work without a global install.

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:4200. The app reloads on file changes.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server. |
| `npm run build` | Production build into `dist/`. |
| `npm test` | Run unit tests with Vitest. |

> Note: there is currently a single smoke test (`src/app/app.spec.ts`) and no
> end-to-end tests are set up.

## Project structure

```
src/app/
  core/
    models/      domain types and double-entry rules
    state/       signal-based stores (accounts, journal)
    storage/     localStorage wrapper
    util/        money helpers, ids, seed data
  features/      dashboard, journal, ledger, accounts (lazy-loaded routes)
  shared/        the money pipe
```

A few implementation notes:

- Amounts are stored as integer cents to avoid floating-point rounding.
- State lives in signals; the ledger, trial balance, and totals are `computed`
  from the journal entries rather than stored separately.
- Each store persists itself to `localStorage` via an `effect`.
