const express = require("express");
const router = express.Router();
const { Product, validate } = require("../models/product");
const upload = require("../middleware/productImage");

router.post("/create", upload.single("productImage"), async (req, res) => {
  try {
    console.log(req.file);
    let { error } = validate(req.body);
    let { path } = req.file;
    if (!path) res.status(400).send({ mesage: "image is required" });
    if (error) res.status(400).send({ message: error.details[0].message });

    let product = await Product.findOne({ name: req.body.name });
    if (product)
      return res.status(400).json({ message: "Product already exist" });

    product = new Product({
      name: req.body.name,
      details: req.body.details,
      price: req.body.price,
      discount: req.body.discount,
      image: req.file.path,
    });
    product
      .save()
      .then((newProduct) => {
        res.status(200).json({
          data: {
            id: newProduct._id,
            name: newProduct.name,
          },
          message: "Product added successfully",
        });
      })
      .catch((err) => {
        res.status(501).json({ error: "Could not create product." });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.get("/all", async (req, res) => {
  try {
    let product = await Product.find({});
    res.send(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id/", async (req, res) => {
  try {
    Product.find({ _id: req.params.id }, { date: 0 })
      .then((product) => {
        console.log(product);
        res
          .status(200)
          .json({ data: product, message: "Product found successfully" });
      })
      .catch((err) => {
        res.status(404).json({
          error: "Product not found.",
        });
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id/update", upload.single("productImage"), async (req, res) => {
  try {
    // console.log(req.file);
    let { name, details, discount, price } = req.body;
    let { error } = validate(req.body);
    let { path } = req.file ? req.file : false;
    let image = path && req.file.path ? req.file.path : undefined;

    Product.findOneAndUpdate(
      { id: req.params.id },
      { name, details, image, discount, price },
      { new: true }
    )
      .then((updatedProduct) => {
        res.status(200).send({
          data: updatedProduct,
          message: "Product updated successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({ error: "Error updating product." });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    let id = req.params.id;
    Product.deleteOne({ _id: id })
      .then((delProduct) => {
        res.status(200).send({ message: "Product deleted" });
      })
      .catch((err) => {
        res.status(501).send({ error: "Could not delete product" });
      });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
