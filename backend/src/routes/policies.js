const express = require("express");
const {
  createPolicy,
  listPolicies,
} = require("../controllers/catalogController");
const { acknowledgePolicy } = require("../controllers/policyController");
const { validate } = require("../middleware/validate");
const { employeeIdSchema, policySchema } = require("../schemas");

const router = express.Router();

router.get("/", listPolicies);

router.post("/", validate(policySchema), createPolicy);

router.post("/:id/acknowledge", validate(employeeIdSchema), acknowledgePolicy);

module.exports = router;
