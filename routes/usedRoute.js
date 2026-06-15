const express = require("express");
const router = express.Router();

const {
  makeEntry,
  getUsed,
  deleteUsed,
} = require("../controllers/usedController");

router.route("/").post(makeEntry);
router.route("/").get(getUsed);
router.route("/:id").delete(deleteUsed);

module.exports = router;
