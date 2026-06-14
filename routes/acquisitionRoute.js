const express = require("express");
const router = express.Router();

const {
  createAcquisition,
  getAcquisition,
  deleteInvoice,
} = require("../controllers/acquisitionController");

router.route("/").post(createAcquisition);
router.route("/").get(getAcquisition);
router.route("/:id").delete(deleteInvoice);

module.exports = router;
