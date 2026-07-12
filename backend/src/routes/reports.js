const express = require("express");
const {
  getEsgSummary,
  getEsgSummaryCsv,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/esg-summary", getEsgSummary);

router.get("/esg-summary/csv", getEsgSummaryCsv);

module.exports = router;
