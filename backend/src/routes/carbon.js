const express = require("express");
const {
  createCarbonTransaction,
  getCarbonSummary,
  getCarbonTrend,
  listCarbonTransactions,
} = require("../controllers/carbonController");
const { validate } = require("../middleware/validate");
const { carbonTransactionSchema } = require("../schemas");

const router = express.Router();

router.post("/", validate(carbonTransactionSchema), createCarbonTransaction);

router.get("/", listCarbonTransactions);

router.get("/summary", getCarbonSummary);

router.get("/trend", getCarbonTrend);

module.exports = router;
