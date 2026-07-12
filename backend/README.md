# EcoSphere Backend

```text
             ┌──────────────────────────────────┐
  HTTP JSON  │          ECOSPHERE API           │  SQL
  ─────────▶ │  validate → calculate → respond  │ ────────▶
             └──────────────────────────────────┘
                     │                 │
                 Express            MySQL
```

> The API and data layer for EcoSphere Lite, built by **Team Green Matters**.

This service exposes the environmental, social, governance, gamification, and reporting workflows used by the React frontend. It is intentionally small: Express routes, Zod validation, direct parameterized SQL, and one shared error shape.

## Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime |
| Express | REST API and middleware |
| MySQL2 | Promise-based database pool |
| Zod | Request-body validation |
| Node test runner | Dependency-free tests |
| Nodemon | Development reloads |

## Run locally

### Requirements

- Node.js 20+
- npm
- MySQL 8+ or MariaDB

### 1. Install

```bash
cd backend
npm ci
```

### 2. Initialize MySQL

For a fresh demo database:

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

`schema.sql` recreates the `ecosphere` database. Do not use it against data you need to preserve.

For an existing EcoSphere database, use the non-destructive migrations:

```bash
mysql -u root -p < db/migrations/001_environmental_goals.sql
mysql -u root -p < db/migrations/002_richer_demo_data.sql
```

### 3. Configure the environment

```bash
cp .env.example .env
```

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=ecosphere_app
DB_PASSWORD=your_password
DB_NAME=ecosphere
DB_CONNECTION_LIMIT=10
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Use a database-scoped application account instead of exposing the MySQL root user to Node.

### 4. Start the API

```bash
npm run dev
```

The API listens at **http://localhost:5000**.

```bash
curl http://localhost:5000/health
# {"status":"ok"}
```

## Scripts

```bash
npm start      # Start with Node
npm run dev    # Start with Nodemon
npm test       # Run node:test checks
```

## API reference

All resource endpoints are prefixed with `/api`.

### Catalog and employees

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/departments` | Active departments |
| GET | `/api/emission-factors` | Conversion factors and units |
| GET | `/api/employees` | Employees with department data |
| GET | `/api/employees/:id` | One employee and awarded badges |
| GET | `/api/employees/:id/acknowledgement-status` | Policy acknowledgement status |

### Environmental

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/carbon-transactions` | Transactions; accepts `departmentId` |
| POST | `/api/carbon-transactions` | Record activity and calculate CO2e |
| GET | `/api/carbon-transactions/summary` | CO2e totals by department |
| GET | `/api/carbon-transactions/trend` | Monthly/yearly trend; accepts `departmentId`, `groupBy` |
| GET | `/api/environmental-goals` | Goal progress; accepts `departmentId` |
| POST | `/api/environmental-goals` | Create a goal |
| PATCH | `/api/environmental-goals/:id` | Update target, deadline, or status |
| DELETE | `/api/environmental-goals/:id` | Delete a goal |

Goal progress is derived from transactions inside the goal date window. Factor-specific goals sum activity quantity; total-carbon goals sum calculated CO2e.

### Social and governance

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activities` | CSR activities |
| POST | `/api/activities` | Create a CSR activity |
| GET | `/api/participation?status=pending` | Participation records |
| POST | `/api/participation` | Submit participation evidence |
| PATCH | `/api/participation/:id/approve` | Approve and award points |
| PATCH | `/api/participation/:id/reject` | Reject a submission |
| GET | `/api/policies` | Active policies |
| POST | `/api/policies` | Create a policy |
| POST | `/api/policies/:id/acknowledge` | Acknowledge for an employee |

### Scores, rewards, and reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scores/departments` | ESG scores by department |
| GET | `/api/scores/overall` | Average ESG pillar scores |
| GET | `/api/badges` | Badge definitions |
| GET | `/api/leaderboard` | Employees ranked by points |
| GET | `/api/rewards` | Active rewards |
| POST | `/api/rewards/:id/redeem` | Redeem using employee points |
| GET | `/api/reports/esg-summary` | Full ESG summary |
| GET | `/api/reports/esg-summary/csv` | Downloadable CSV summary |

## Request examples

Record electricity use:

```bash
curl -X POST http://localhost:5000/api/carbon-transactions \
  -H 'Content-Type: application/json' \
  -d '{"departmentId":1,"emissionFactorId":1,"quantity":120,"date":"2026-07-12"}'
```

Create an environmental goal:

```bash
curl -X POST http://localhost:5000/api/environmental-goals \
  -H 'Content-Type: application/json' \
  -d '{"departmentId":1,"emissionFactorId":1,"metricLabel":"Electricity Usage","targetValue":1500,"unit":"kWh","startDate":"2026-01-01","deadline":"2026-12-31"}'
```

Validation and server errors share one response shape:

```json
{ "message": "Target must be greater than 0" }
```

## Architecture

```text
backend/
├── db/
│   ├── schema.sql          # Canonical destructive schema
│   ├── seed.sql            # Demo-ready records
│   └── migrations/         # Non-destructive feature/data additions
├── src/
│   ├── controllers/        # SQL operations and response composition
│   ├── db/pool.js          # Shared MySQL connection pool
│   ├── middleware/         # Validation and error handling
│   ├── routes/             # REST route definitions
│   ├── utils/              # Mappers, badges, goals, ESG scoring
│   ├── schemas.js          # Zod request contracts
│   └── app.js              # Express application composition
├── test/                   # Node test runner checks
├── server.js               # Process entry point
└── .env.example
```

## Data rules worth knowing

- CO2e is calculated server-side from `quantity × co2_per_unit`.
- Department ESG totals weight Environmental 40%, Social 30%, and Governance 30%.
- Goal progress percentages are intentionally uncapped; values above 100% indicate exceeded limits.
- Participation approval awards activity points and may unlock badges.
- Reward redemption updates points and stock in one database transaction.
- The hackathon MVP has no authentication; writes identify employees through request data.

## Verification

```bash
npm test
curl -f http://localhost:5000/health
curl -f http://localhost:5000/api/environmental-goals
curl -f 'http://localhost:5000/api/carbon-transactions/trend?groupBy=month'
```

---

Part of **EcoSphere Lite** · Built by **Green Matters**
