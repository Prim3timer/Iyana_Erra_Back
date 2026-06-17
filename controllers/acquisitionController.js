const { response } = require("express");
const Acquisition = require("../models/Acquisitons");
const Item = require("../models/Items");
const asyncHandler = require("express-async-handler");

const createAcquisition = asyncHandler(async (req, res) => {
  const { goods, numerator, grandTotal, date, description, measureIndex } =
    req.body;

  const response = await Item.find().exec();
  console.log({ reqBody: req.body });
  const newGoods = response.filter((item) => {
    return goods.find((good) => good._id == item._id);
  });

  const neededProps = goods.map((good) => {
    const { index, qty } = good;
    return { index, qty };
  });

  console.log({ neededProps });

  const newerGoods = newGoods.map((newGood) => {
    return neededProps.map((neededProp) => {
      if (neededProp.index === 0) {
        return { ...newGood, qty: newGood.qty + neededProp.qty };
      } else {
        return { ...newGood, numerator: newGood.numerator + neededProp.qty };
      }
    });
  });

  console.log({ goods });

  console.log({ newer: newerGoods[0] });

  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  } else {
    const acquisitionObject = {
      goods,
      grandTotal,
      date,
    };

    const acquisition = await Acquisition.create(acquisitionObject);
    neededProps.map((neededProp) => {
      newGoods.map(async (newGood) => {
        const firstQty =
          neededProp.index == 0
            ? newGood.qty + neededProp.qty
            : neededProp.qty + newGood.numerator >= newGood.denominator &&
                neededProp.index === 1
              ? Math.floor(
                  (newGood.numerator + neededProp.qty) / newGood.denominator,
                ) + newGood.qty
              : newGood.qty;

        const secondQty =
          neededProp.index == 1 &&
          neededProp.qty + newGood.numerator < newGood.denominator
            ? newGood.numerator + neededProp.qty
            : neededProp.index == 1 &&
                neededProp.qty + newGood.numerator >= newGood.denominator
              ? (neededProp.qty + newGood.numerator) % newGood.denominator
              : newGood.numerator;

        // const dynamNumer = neededProp.qty > newGood.denominator ?
        const availableQuantities = [firstQty, secondQty];
        await Item.updateOne(
          { _id: newGood._id },
          {
            qty:
              neededProp.index == 0
                ? newGood.qty + neededProp.qty
                : neededProp.qty + newGood.numerator >= newGood.denominator &&
                    neededProp.index === 1
                  ? Math.floor(
                      (newGood.numerator + neededProp.qty) /
                        newGood.denominator,
                    ) + newGood.qty
                  : newGood.qty,
            numerator:
              neededProp.index == 1 &&
              neededProp.qty + newGood.numerator < newGood.denominator
                ? newGood.numerator + neededProp.qty
                : neededProp.index == 1 &&
                    neededProp.qty + newGood.numerator >= newGood.denominator
                  ? (neededProp.qty + newGood.numerator) % newGood.denominator
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
