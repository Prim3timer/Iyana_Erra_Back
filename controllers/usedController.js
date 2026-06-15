const { response } = require("express");
const Used = require("../models/Used");
const Item = require("../models/Items");
const asyncHandler = require("express-async-handler");

const makeEntry = asyncHandler(async (req, res) => {
  const { goods, date } = req.body;
  const items = goods.map((item) => {
    console.log({ item });
  });
  const response = await Used.create(req.body);
  const dbItems = await Item.find().exec();
  const newDb = dbItems.map((item) => {
    return item._id;
  });

  const inventoryUPdate = dbItems.map((item) => {
    goods.map(async (good) => {
      if (item._id == good._id) {
        if (good.index == 1) {
          await Item.updateOne(
            { _id: good._id },
            {
              // qty: good.numerator < 0 ? item.qty - 1 : item.qty,
              numerator:
                good.numerator - Number(good.qty) < 0
                  ? good.numerator - Number(good.qty) + good.denominator
                  : good.numerator - Number(good.qty),
              qty:
                good.numerator - Number(good.qty) < 0 || good.numerator === 0
                  ? item.qty - 1
                  : item.qty,

              date,
            },
          );
        } else {
          await Item.updateOne(
            { _id: good._id },
            {
              qty: item.qty - Number(good.qty),
              date,
            },
          );
        }
        const currentItem = await Item.findById({
          _id: good._id,
        });
        const availableQuantities = [currentItem.qty, currentItem.numerator];
        await Item.updateOne({ _id: good._id }, { availableQuantities });
      }
    });
  });

  res.send("entry saved");
});

const getUsed = asyncHandler(async (req, res) => {
  const response = await Used.find();
  res.json(response);
});

const deleteUsed = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const foundUsed = await Used.findById(id);
  if (!foundUsed) {
    return res.status(400).json({ massage: "item not found" });
  }
  await foundUsed.deleteOne();
  const reply = "Used entry deleted";
  res.json(reply);
});

module.exports = {
  makeEntry,
  getUsed,
  deleteUsed,
};
