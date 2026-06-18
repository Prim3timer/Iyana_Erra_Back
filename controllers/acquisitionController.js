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
    const { index, qty } = good;
    return { index, qty };
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
      newItems.map(async (newGood) => {
        const firstQty =
          neededGoodsProp.index == 0
            ? newGood.qty + neededGoodsProp.qty
            : neededGoodsProp.qty + newGood.numerator >= newGood.denominator &&
                neededGoodsProp.index === 1
              ? Math.floor(
                  (newGood.numerator + neededGoodsProp.qty) /
                    newGood.denominator,
                ) + newGood.qty
              : newGood.qty;

        const secondQty =
          neededGoodsProp.index == 1 &&
          neededGoodsProp.qty + newGood.numerator < newGood.denominator
            ? newGood.numerator + neededGoodsProp.qty
            : neededGoodsProp.index == 1 &&
                neededGoodsProp.qty + newGood.numerator >= newGood.denominator
              ? (neededGoodsProp.qty + newGood.numerator) % newGood.denominator
              : newGood.numerator;

        // const dynamNumer = neededGoodsProp.qty > newGood.denominator ?
        const availableQuantities = [firstQty, secondQty];
        await Item.updateOne(
          { _id: newGood._id },
          {
            qty:
              neededGoodsProp.index == 0
                ? newGood.qty + neededGoodsProp.qty
                : neededGoodsProp.qty + newGood.numerator >=
                      newGood.denominator && neededGoodsProp.index === 1
                  ? Math.floor(
                      (newGood.numerator + neededGoodsProp.qty) /
                        newGood.denominator,
                    ) + newGood.qty
                  : newGood.qty,
            numerator:
              neededGoodsProp.index == 1 &&
              neededGoodsProp.qty + newGood.numerator < newGood.denominator
                ? newGood.numerator + neededGoodsProp.qty
                : neededGoodsProp.index == 1 &&
                    neededGoodsProp.qty + newGood.numerator >=
                      newGood.denominator
                  ? (neededGoodsProp.qty + newGood.numerator) %
                    newGood.denominator
                  : newGood.numerator,
            availableQuantities,
          },
        );
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
