const express = require("express");
const {
  approveParticipation,
  createParticipation,
  listParticipation,
  rejectParticipation,
} = require("../controllers/participationController");
const { validate } = require("../middleware/validate");
const { participationSchema } = require("../schemas");

const router = express.Router();

router.post("/", validate(participationSchema), createParticipation);

router.get("/", listParticipation);

router.patch("/:id/approve", approveParticipation);

router.patch("/:id/reject", rejectParticipation);

module.exports = router;
