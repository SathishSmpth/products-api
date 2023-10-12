const Products = require("../models/products");
const tryAndCatch = require("../utils/tryAndCatch");


exports.newProduct = tryAndCatch(async (req, res, next) => {
  const newProduct = await Products.create({
    title: req.body.title,
    manufacture: req.body.manufacture,
    description: req.body.description,
    image:req.uploadedImageData.Location,
    price: req.body.price,
    createdBy: req.user._id,
  });
  res.status(201).json({
    status: "success",
    message: "New product was successfull!",
    data: newProduct,
  });
});

exports.getAllProducts = tryAndCatch(async (req, res, next) => {
  const products = await Products.find();
  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

exports.getProduct = tryAndCatch(async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.updateProduct = tryAndCatch(async (req, res, next) => {
  const updateProduct = await Products.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: updateProduct,
  });
});

exports.deleteProduct = tryAndCatch(async (req, res, next) => {
  await Products.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});
