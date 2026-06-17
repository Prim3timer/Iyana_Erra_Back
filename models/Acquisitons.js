const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const acquisitionSchema = new Schema({
  goods: {
    type: Array,
    requried: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AcquisitionSchema", acquisitionSchema);
