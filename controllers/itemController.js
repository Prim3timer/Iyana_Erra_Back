const Item = require("../models/Items");
const asyncHandler = require("express-async-handler");

const createItem = asyncHandler(async (req, res) => {
  console.log({ reqBody: req.body });
  const {
    name,
    availablePrices,
    availableUnitMeasures,
    qty,
    denominator,
    numerator,
    date,
    dateCreated,
  } = req.body;
  const quntum = [Number(qty), numerator];

  const newItem = {
    name: req.body.name,
    availableUnitMeasures: req.body.availableUnitMeasures,
    availablePrices: req.body.availablePrices,
    availableQuantities: quntum,
    qty,
    denominator,
    numerator,
    date,
    dateCreated,
  };

  try {
    const response = await Item.create(newItem);
    console.log({ response });
    console.log("item created");
    res.json("created");
  } catch (error) {
    console.log(error);
  }
});

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

const editItem = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const {
    name,
    availablePrices,
    availableUnitMeasures,
    availableQuantities,
    qty,
    denominator,
    numerator,
  } = req.body;
  console.log({ reqBody: req.body, id });
  const response = await Item.updateOne({ _id: id }, req.body);

  res.json("updated");
});

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Item.findByIdAndDelete(id);
  res.json("deleted");
});

module.exports = {
  getAllItems,
  createItem,
  deleteItem,
  editItem,
};
