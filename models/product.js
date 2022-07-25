const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("product_details", productSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    details: Joi.string().required().min(3),
    price: Joi.number().required(),
    discount: Joi.number().required(),
  });
  return schema.validate(data);
};



module.exports = { Product, validate };
