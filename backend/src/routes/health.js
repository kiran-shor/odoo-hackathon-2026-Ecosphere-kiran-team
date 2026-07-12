const express = require("express");

const router = express.Router();

// Keep existing contract: GET /health -> { status: "ok" }
router.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = router;
