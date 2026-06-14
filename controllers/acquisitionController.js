const Acquisition = require("../models/Acquisitons");
const asyncHandler = require("express-async-handler");

const createAcquisition = asyncHandler(async (req, res) => {
  const { goods, numerator, grandTotal, date, description } = req.body;
  console.log({ grandTotal, goods });
  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  } else {
    const acquisitionObject = {
      goods,
      grandTotal,
      date,
    };
    const acquisition = await Acquisition.create(acquisitionObject);
  }
});

const getAcquisition = asyncHandler(async (req, res) => {
  const response = await Acquisition.find();
  console.log({ response });
  if (response) {
    res.send(response);
  } else {
    res.send("no data to furnish");
  }
});

const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const acquisition = await Acquisition.findById(id);
  console.log({ acquisition });
  if (!acquisition) {
    return res.status(400).json({ message: "Acquisiton not found" });
  }
  const response = await acquisition.deleteOne();
  const reply = `Acquisition deleted`;

  res.json(reply);
});

module.exports = { createAcquisition, getAcquisition, deleteInvoice };
