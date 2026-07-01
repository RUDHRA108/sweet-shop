const express = require("express");
const router = express.Router();

const { readData, writeData } = require("../database");

function getInitialProductCounter() {
  const products = readData();
  const numericIds = products
    .map((product) => Number(product.id))
    .filter((id) => Number.isInteger(id) && id >= 0);

  return numericIds.length ? Math.max(...numericIds) : 0;
}

let productCounter = getInitialProductCounter();

// ✅ Add Product
router.post("/add-product", (req, res) => {
  const { name, price, totalQuantity } = req.body;

  if (!name || !price || !totalQuantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const products = readData();

  const newProduct = {
    id:(++productCounter).toString().padStart(3, "0"),
    name: name,
    price: price,
    totalQuantity: totalQuantity,
    remainingQuantity: Number(totalQuantity),
  };

  products.push(newProduct);
  writeData(products);

  res.json({
    message: "Product saved in Excel ✅",
    product: newProduct,
  });
});

// ✅ Get all products

router.get("/products", (req, res) => {
  res.json(readData());
});

// ✅ Cut token(s) from a product
router.patch("/cut-token", (req, res) => {
  const { id, count } = req.body;
  const cutCount = Number(count) || 0;

  if (!id || cutCount < 1) {
    return res
      .status(400)
      .json({ message: "Product ID and valid count are required" });
  }

  const products = readData();
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const currentRemaining = Number(product.remainingQuantity);

  if (currentRemaining < cutCount) {
    return res
      .status(400)
      .json({ message: "Not enough remaining quantity available to cut" });
  }

  product.remainingQuantity = Math.max(0, currentRemaining - cutCount);

  writeData(products);

  res.json({ message: "Token(s) cut successfully", product });
});

module.exports = router;
