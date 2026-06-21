const { response } = require("express");
const Acquisition = require("../models/Acquisitons");
const Item = require("../models/Items");
const asyncHandler = require("express-async-handler");

const createAcquisition = asyncHandler(async (req, res) => {
  const { goods, numerator, grandTotal, date, description, measureIndex } =
    req.body;

  const response = await Item.find().exec();
  console.log({ reqBody: req.body });
  const newItems = response.filter((item) => {
    return goods.find((good) => good._id == item._id);
  });

  const neededGoodsProps = goods.map((good) => {
    const { index, qty, _id } = good;
    return { index, qty, _id };
  });

  console.log({ neededGoodsProps });

  const newerItems = newItems.map((newItem) => {
    return neededGoodsProps.map((neededGoodsProp) => {
      if (neededGoodsProp.index === 0) {
        return { ...newItem, qty: newItem.qty + neededGoodsProp.qty };
      } else {
        return {
          ...newItem,
          numerator: newItem.numerator + neededGoodsProp.qty,
        };
      }
    });
  });

  console.log({ goods });

  console.log({ newer: newerItems[0] });

  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  } else {
    const acquisitionObject = {
      goods,
      grandTotal,
      date,
    };

    const acquisition = await Acquisition.create(acquisitionObject);
    neededGoodsProps.map((neededGoodsProp) => {
      newItems.map(async (newItem) => {
        console.log({ neededGoodsProp });
        if (neededGoodsProp._id == newItem._id) {
          const firstQty =
            neededGoodsProp.index == 0
              ? newItem.qty + neededGoodsProp.qty
              : neededGoodsProp.qty + newItem.numerator >=
                    newItem.denominator && neededGoodsProp.index === 1
                ? Math.floor(
                    (newItem.numerator + neededGoodsProp.qty) /
                      newItem.denominator,
                  ) + newItem.qty
                : newItem.qty;

          const secondQty =
            neededGoodsProp.index == 1 &&
            neededGoodsProp.qty + newItem.numerator < newItem.denominator
              ? newItem.numerator + neededGoodsProp.qty
              : neededGoodsProp.index == 1 &&
                  neededGoodsProp.qty + newItem.numerator >= newItem.denominator
                ? (neededGoodsProp.qty + newItem.numerator) %
                  newItem.denominator
                : newItem.numerator;

          // const dynamNumer = neededGoodsProp.qty > newItem.denominator ?
          const availableQuantities = [firstQty, secondQty];
          await Item.updateOne(
            { _id: newItem._id },
            {
              qty:
                neededGoodsProp.index == 0
                  ? newItem.qty + neededGoodsProp.qty
                  : neededGoodsProp.qty + newItem.numerator >=
                        newItem.denominator && neededGoodsProp.index === 1
                    ? Math.floor(
                        (newItem.numerator + neededGoodsProp.qty) /
                          newItem.denominator,
                      ) + newItem.qty
                    : newItem.qty,
              numerator:
                neededGoodsProp.index == 1 &&
                neededGoodsProp.qty + newItem.numerator < newItem.denominator
                  ? newItem.numerator + neededGoodsProp.qty
                  : neededGoodsProp.index == 1 &&
                      neededGoodsProp.qty + newItem.numerator >=
                        newItem.denominator
                    ? (neededGoodsProp.qty + newItem.numerator) %
                      newItem.denominator
                    : newItem.numerator,
              availableQuantities,
            },
          );
        }
      });
    });
  }

  res.send("acquisition noted");
});

const getAcquisition = asyncHandler(async (req, res) => {
  const response = await Acquisition.find();
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
