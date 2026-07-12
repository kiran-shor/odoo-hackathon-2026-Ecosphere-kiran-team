const express = require("express");
const {
  createActivity,
  listActivities,
} = require("../controllers/catalogController");
const { validate } = require("../middleware/validate");
const { activitySchema } = require("../schemas");

const router = express.Router();

router.get("/", listActivities);

router.post("/", validate(activitySchema), createActivity);

module.exports = router;
