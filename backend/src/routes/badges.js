const express = require("express");
const { listBadges } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", listBadges);

module.exports = router;
