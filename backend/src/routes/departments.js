const express = require("express");
const { listDepartments } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", listDepartments);

module.exports = router;
