const express = require("express");
const { listEmissionFactors } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", listEmissionFactors);

module.exports = router;
