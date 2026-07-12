const express = require("express");
const { createGoal, deleteGoal, listGoals, updateGoal } = require("../controllers/goalController");
const { validate } = require("../middleware/validate");
const { goalSchema, goalUpdateSchema } = require("../schemas");

const router = express.Router();

router.get("/", listGoals);
router.post("/", validate(goalSchema), createGoal);
router.patch("/:id", validate(goalUpdateSchema), updateGoal);
router.delete("/:id", deleteGoal);

module.exports = router;
