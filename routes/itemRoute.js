const express = require("express");
const router = express.Router();

const {
  getAllItems,
  createItem,
  deleteItem,
  editItem,
} = require("../controllers/itemController");

router.route("/").get(getAllItems);
router.route("/").post(createItem);
router.route("/:id").delete(deleteItem);
router.route("/:id").patch(editItem);

module.exports = router;
