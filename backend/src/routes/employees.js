const express = require("express");
const {
  getAcknowledgementStatus,
  getEmployee,
  listEmployees,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", listEmployees);

router.get("/:id", getEmployee);

router.get("/:id/acknowledgement-status", getAcknowledgementStatus);

module.exports = router;
