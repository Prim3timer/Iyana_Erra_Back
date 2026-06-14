const express = require("express");
const router = express.Router();

const { makeEntry, getUsed } = require("../controllers/usedController");

router.route("/").post(makeEntry);
router.route("/").get(getUsed);

module.exports = router;
