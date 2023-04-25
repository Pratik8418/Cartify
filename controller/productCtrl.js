const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(
  async (req,res) => {
    const product = await Product.create(req.body)
    res.json(product);
  }
)

const getProduct = asyncHandler(
  async (req,res) => {
    const product = await Product.findById(req.params.id)
    res.json(product)
  }
)

const getAllProduct = asyncHandler(
  async (req,res) => {
    const products = await Product.find({});
    res.json(products)
  }
)
module.exports = { createProduct, getProduct,getAllProduct }