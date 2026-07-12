EcoSphere Lite

Built by team **Green Matters**.

Backend branch contains the Node.js, Express, and MySQL API for the hackathon
project.

Backend setup:

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create local MySQL database and seed demo data:

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

3. Create `backend/.env` from `backend/.env.example` and update the MySQL
password/user if needed.

4. Start the API:

```bash
npm run dev
```

Default backend URL:

```text
http://localhost:5000
```

Main API groups:

```text
GET  /health
GET  /api/departments
GET  /api/employees
GET  /api/emission-factors
POST /api/carbon-transactions
GET  /api/carbon-transactions/summary
GET  /api/activities
POST /api/participation
PATCH /api/participation/:id/approve
GET  /api/scores/departments
GET  /api/reports/esg-summary
GET  /api/reports/esg-summary/csv
```
