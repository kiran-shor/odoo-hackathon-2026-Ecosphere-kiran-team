const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { errorHandler } = require("./middleware/errorHandler");

const healthRoutes = require("./routes/health");

const departmentsRoutes = require("./routes/departments");
const employeesRoutes = require("./routes/employees");
const emissionFactorsRoutes = require("./routes/emissionFactors");
const carbonRoutes = require("./routes/carbon");
const activitiesRoutes = require("./routes/activities");
const participationRoutes = require("./routes/participation");
const policiesRoutes = require("./routes/policies");
const badgesRoutes = require("./routes/badges");
const leaderboardRoutes = require("./routes/leaderboard");
const rewardsRoutes = require("./routes/rewards");
const scoresRoutes = require("./routes/scores");
const reportsRoutes = require("./routes/reports");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
    }),
  );

  app.use(express.json());

  // Health route
  app.use("/health", healthRoutes);

  // API routes
  app.use("/api/departments", departmentsRoutes);
  app.use("/api/employees", employeesRoutes);
  app.use("/api/emission-factors", emissionFactorsRoutes);
  app.use("/api/carbon-transactions", carbonRoutes);
  app.use("/api/activities", activitiesRoutes);
  app.use("/api/participation", participationRoutes);
  app.use("/api/policies", policiesRoutes);
  app.use("/api/badges", badgesRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/rewards", rewardsRoutes);
  app.use("/api/scores", scoresRoutes);
  app.use("/api/reports", reportsRoutes);

  // Central error handler (keeps contract shape: { message })
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
