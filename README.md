# Joota Chupai — Admin Dashboard

A responsive Next.js App Router frontend for the event marketplace admin
dashboard. The current version is a UI-only demo powered by local mock data; it
does not call an API or contain production business logic.

## Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Structure

```text
src/
├── app/                    # Next.js routes and route-group layouts
│   ├── (auth)/             # future public/authentication screens
│   └── (dashboard)/        # future protected application screens
├── components/
│   ├── dashboard/          # reusable overview widgets
│   ├── layout/             # reusable application shell
│   └── ui/                 # reusable UI primitives
├── config/                 # navigation and app-level configuration
├── data/                   # temporary dashboard demo data
├── features/               # one folder per future feature
├── hooks/                  # shared React hooks
├── schemas/                # future validation schemas
├── store/
│   ├── actions/            # future async actions/thunks
│   └── slices/             # future Redux feature slices
├── theme/
│   └── tokens.css          # single source of truth for dashboard colours
└── utils/                  # shared utility functions
```

## Theme

All colour values are CSS custom properties in `src/theme/tokens.css`. Update
that one file to rebrand the sidebar, surfaces, states, charts, and accents
across the dashboard.

The empty folders contain `.gitkeep` files so the planned structure survives
Git. Add project functionality feature by feature when requirements are
confirmed.
