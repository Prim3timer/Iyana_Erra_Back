const { response } = require("express");
const Used = require("../models/Used");
const asyncHandler = require("express-async-handler");

const makeEntry = asyncHandler(async (req, res) => {
  const items = req.body.goods.map((item) => {
    console.log({ item });
  });
  const response = await Used.create(req.body);
  res.send("entry saved");
});

const getUsed = asyncHandler(async (req, res) => {
  const response = await Used.find();
  res.json(response);
});

module.exports = {
  makeEntry,
  getUsed,
};
