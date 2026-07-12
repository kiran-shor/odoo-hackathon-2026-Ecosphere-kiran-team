const express = require("express");
const {
  createCarbonTransaction,
  getCarbonSummary,
  listCarbonTransactions,
} = require("../controllers/carbonController");
const { validate } = require("../middleware/validate");
const { carbonTransactionSchema } = require("../schemas");

const router = express.Router();

router.post("/", validate(carbonTransactionSchema), createCarbonTransaction);

router.get("/", listCarbonTransactions);

router.get("/summary", getCarbonSummary);

module.exports = router;
