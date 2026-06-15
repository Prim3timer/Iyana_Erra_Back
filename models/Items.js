const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
  },
  availableUnitMeasures: {
    type: Array,
  },
  availablePrices: {
    type: Array,
  },
  availableQuantities: {
    type: Array,
  },
  qty: {
    type: Number,
  },
  denominator: {
    type: Number,
  },
  numerator: {
    type: Number,
  },
  date: {
    type: String,
    // required: true,
  },
  dateCreated: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("ItemSchema", itemSchema);
