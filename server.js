const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product = require("./routes/product");
cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = 4000;
const uri = process.env.PRODUCT_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
  });

app.use("/uploads", express.static("uploads"));
app.use("/product", product);

app.listen(port, () => console.log("Server up and running"));
