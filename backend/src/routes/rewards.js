const express = require("express");
const { listRewards } = require("../controllers/catalogController");
const { redeemReward } = require("../controllers/rewardController");
const { validate } = require("../middleware/validate");
const { employeeIdSchema } = require("../schemas");

const router = express.Router();

router.get("/", listRewards);

router.post("/:id/redeem", validate(employeeIdSchema), redeemReward);

module.exports = router;
