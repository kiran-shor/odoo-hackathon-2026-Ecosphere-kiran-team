# EcoSphere Frontend

```text
  ┌─────────────────────────────────────────────────────────┐
  │  ECOSPHERE / FIELD ATLAS                               │
  │                                                         │
  │     ● measure          ◌ understand          ↗ improve  │
  └─────────────────────────────────────────────────────────┘
```

> The React interface for EcoSphere Lite, designed and built by **Team Green Matters**.

The frontend presents ESG operations as a light ecological field atlas: clear data typography, restrained motion, responsive operational layouts, and accessible status treatments.

## Frontend stack

| Tool | Role |
|---|---|
| React | Interface and state |
| Vite | Development and production builds |
| React Router | Nine application routes |
| Tailwind CSS | Design tokens and utility styling |
| Framer Motion | Route transitions and purposeful feedback |
| Recharts | ESG, emissions, and trend visualizations |
| Axios | Backend and mock API client |

## Run locally

```bash
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**.

### Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## API modes

The sidebar’s **API** control switches between two data sources:

### Backend

Uses the Express API. The default URL is `http://localhost:5000/api`.

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

### Mock

Uses the in-browser adapter in `src/api/mockApi.js`; no backend or database is required.

```dotenv
VITE_USE_MOCK_API=true
```

The selected mode is stored in browser local storage, so it takes precedence after the first manual selection.

## Route map

```text
Overview
└── /                  Dashboard

Measure
├── /carbon            Carbon entry and department emissions
├── /goals             Environmental targets and trends
└── /reports           ESG summary and CSV export

Govern
└── /policies          Policies and acknowledgements

Engage
├── /activities        CSR activities
├── /participation     Employee submission / admin review
├── /leaderboard       Points and badges
└── /rewards           Reward redemption
```

## Interface behavior

- Use the employee selector to preview different employee records.
- Enable **Admin mode** to reveal creation and review controls.
- Goal progress and dashboard scores are calculated by the backend, not the browser.
- Loading, empty, success, error, disabled, and reduced-motion states are supported.
- The sidebar becomes an accessible navigation drawer on smaller screens.

## Source structure

```text
src/
├── api/
│   ├── client.js           # Base URL, saved API mode, Axios instance
│   └── mockApi.js          # Browser-local API implementation
├── components/             # Navigation, cards, charts, shared states
├── context/UserContext.jsx # Employee and admin-mode state
├── features/person-c/      # CSR, participation, leaderboard, rewards
├── pages/                  # Dashboard, carbon, goals, policies, reports
├── App.jsx                 # Route metadata and animated route shell
├── main.jsx                # Application entry point and local fonts
└── styles.css              # Tailwind theme and Ecological Atlas styles
```

## Design system

| Token | Value | Use |
|---|---|---|
| Atlas paper | `#F5F8F3` | Application background |
| Forest ink | `#17352C` | Headlines and strong text |
| Canopy | `#256B4A` | Actions and active states |
| Moss | `#76A965` | Positive environmental states |
| Sunstone | `#D99A32` | Attention and rewards |
| Mist | `#DDE8DF` | Borders and quiet surfaces |

Typography is packaged locally with Bricolage Grotesque, Source Sans 3, and IBM Plex Mono. Motion respects `prefers-reduced-motion`.

## Before opening a pull request

```bash
npm run lint
npm run build
```

Check the Dashboard, Carbon, Goals, and Rewards pages at desktop and mobile widths, in both employee and admin modes.

---

Part of **EcoSphere Lite** · Built by **Green Matters**
