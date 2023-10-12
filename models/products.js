const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  manufacture: {
    type: String,
    required: [true, "Manufacture is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  price: {
    type: String,
    required: [true, "Price is required!"],
  },
  image: {
    type: String,
    required: [true, "Image is required!"],
  },
  createdBy: {
    type: String,
    required: [true, "Created by is required!"],
  },
});

ProductSchema.set("timestamps", true);

const products = mongoose.model("products", ProductSchema);

module.exports = products;
