const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(
  async (req,res) => {
    const product = await Product.create(req.body)
    res.json(product);
  }
)

module.exports = { createProduct }