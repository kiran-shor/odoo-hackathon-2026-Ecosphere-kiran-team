const express = require("express");
const { getLeaderboard } = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getLeaderboard);

module.exports = router;
