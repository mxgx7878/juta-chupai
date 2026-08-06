# Juta Chupai — Next.js Structure

A clean Next.js App Router scaffold derived only from the architectural pattern
of the supplied Vite project. It intentionally contains no CRM-specific pages,
features, API calls, state, data, branding, or business logic.

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
│   ├── layout/             # reusable application layouts
│   └── ui/                 # reusable UI primitives
├── config/                 # API client and app-level configuration
├── features/               # one folder per future feature
├── hooks/                  # shared React hooks
├── schemas/                # future validation schemas
├── store/
│   ├── actions/            # future async actions/thunks
│   └── slices/             # future Redux feature slices
└── utils/                  # shared utility functions
```

The empty folders contain `.gitkeep` files so the structure survives Git and ZIP
packaging. Add project functionality feature by feature when requirements are
confirmed.
