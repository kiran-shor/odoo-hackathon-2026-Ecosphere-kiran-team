const express = require("express");
const {
  getDepartmentScores,
  getOverallScore,
} = require("../controllers/scoreController");

const router = express.Router();

router.get("/departments", getDepartmentScores);

router.get("/overall", getOverallScore);

module.exports = router;
