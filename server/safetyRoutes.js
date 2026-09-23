const express = require("express");

const {
  analyzeSafety,
} = require("./controllers/safetyController");

const router = express.Router();

router.post("/analyze", analyzeSafety);

module.exports = router;