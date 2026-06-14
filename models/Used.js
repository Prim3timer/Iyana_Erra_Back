const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usedSchema = new Schema({
  goods: {
    type: Array,
  },

  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UsedSchema", usedSchema);
