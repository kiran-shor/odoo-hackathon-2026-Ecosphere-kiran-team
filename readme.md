# EcoSphere Lite

<div align="center">
<pre>
 _____  ____  ___   ____  ____  _   _  _____  ____   _____
| ____|/ ___|/ _ \ / ___||  _ \| | | || ____||  _ \ | ____|
|  _| | |   | | | |\___ \| |_) | |_| ||  _|  | |_) ||  _|
| |___| |___| |_| | ___) |  __/|  _  || |___ |  _ &lt; | |___
|_____|\____|\___/ |____/|_|   |_| |_||_____||_| \_\|_____|

               .-~~~~~~~~~~~~-.
           .-~'   ECO + ESG    '~-.
          /     measure impact     \
          \   engage and improve   /
           '~-._              _.-~'
                '------------'
</pre>
</div>

> A lightweight ESG operations platform built by **Team Green Matters**.

EcoSphere brings environmental measurement, employee participation, governance, rewards, and reporting into one responsive workspace. It combines a React dashboard with an Express API and a MySQL/MariaDB database populated with demo-ready ESG data.

## What it does

| Area | Capabilities |
|---|---|
| Environmental | Carbon transactions, emission factors, department summaries, monthly trends, environmental goals |
| Social | CSR activities, participation submissions, admin approval, points |
| Governance | Policies and employee acknowledgements |
| Gamification | Badges, leaderboard, rewards and redemption |
| Reporting | Department ESG scores, overall performance, CSV export |

## Stack

```text
Browser                  API                     Data
┌─────────────────┐      ┌────────────────┐      ┌─────────────────┐
│ React + Vite    │ ───▶ │ Express + Zod  │ ───▶ │ MySQL / MariaDB │
│ Tailwind CSS    │      │ REST API       │      │ Seeded ESG data │
│ Framer Motion   │ ◀─── │ JSON responses │ ◀─── │ SQL migrations  │
│ Recharts        │      └────────────────┘      └─────────────────┘
└─────────────────┘
```

## Quick start

### Requirements

- Node.js 20+
- npm
- MySQL 8+ or MariaDB

### 1. Clone and install

```bash
git clone <repository-url>
cd odoo-hackathon-2026-Ecosphere-kiran-team
npm --prefix backend ci
npm --prefix frontend ci
```

### 2. Create and seed the database

The canonical schema rebuilds the `ecosphere` database and loads demo data.

```bash
mysql -u root -p < backend/db/schema.sql
mysql -u root -p < backend/db/seed.sql
```

For an existing database, apply the non-destructive migrations instead:

```bash
mysql -u root -p < backend/db/migrations/001_environmental_goals.sql
mysql -u root -p < backend/db/migrations/002_richer_demo_data.sql
```

### 3. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your local database credentials:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=ecosphere_app
DB_PASSWORD=your_password
DB_NAME=ecosphere
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Run both services

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**. The API health check is available at **http://localhost:5000/health**.

## Application map

| Route | Purpose |
|---|---|
| `/` | Overall ESG dashboard, department scores, trends, goal alerts |
| `/carbon` | Record and review carbon transactions |
| `/goals` | Track department environmental targets |
| `/reports` | Review and export ESG summaries |
| `/policies` | Publish and acknowledge governance policies |
| `/activities` | Manage CSR activities |
| `/participation` | Submit or approve participation evidence |
| `/leaderboard` | Compare employee points and badges |
| `/rewards` | Redeem earned points |

The sidebar includes employee selection, admin mode, and an API selector. Choose **Mock** for an entirely browser-local demo or **Backend** for live MySQL data.

## API overview

All application endpoints are under `/api`.

```text
/departments              /carbon-transactions
/employees                /environmental-goals
/emission-factors         /activities
/policies                 /participation
/scores                   /leaderboard
/reports                  /rewards
```

Representative endpoints:

```http
GET    /health
GET    /api/scores/overall
GET    /api/carbon-transactions/trend?groupBy=month
GET    /api/environmental-goals?departmentId=1
POST   /api/carbon-transactions
POST   /api/participation
PATCH  /api/participation/:id/approve
GET    /api/reports/esg-summary/csv
```

## Project structure

```text
.
├── backend/
│   ├── db/                 # Canonical schema, seed data, migrations
│   ├── src/
│   │   ├── controllers/    # Request handling and SQL operations
│   │   ├── routes/         # Express route definitions
│   │   ├── utils/          # Mapping and score/progress calculations
│   │   └── app.js
│   └── test/               # Node test runner checks
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client and in-browser mock adapter
│   │   ├── components/     # Shared interface and chart components
│   │   ├── features/       # CSR, participation, leaderboard, rewards
│   │   └── pages/          # Main route pages
│   └── README.md
└── readme.md
```

## Quality checks

```bash
npm --prefix backend test
npm --prefix frontend run lint
npm --prefix frontend run build
```

## Team

Made for the Odoo Hackathon 2026 by **Green Matters**.
