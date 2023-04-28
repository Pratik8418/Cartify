const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(
  async (req,res) => {
    try{
    const product = await Product.create(req.body)
    res.json(product);
    }catch(error){
    throw new Error(error);
    }
  }
)

const getProduct = asyncHandler(
  async (req,res) => {
    try{
    const product = await Product.findById(req.params.id)
    res.json(product)
    }catch(error){
    throw new Error(error);
    }
  }
)

const getAllProduct = asyncHandler(
  async (req,res) => {
    try{
    const products = await Product.find({});
    res.json(products)
     }catch(error){
    throw new Error(error);
    }
  }
)

const updateProduct = asyncHandler(
  async (req,res) => {
    try{
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id,req.body,{ new: true});
    res.json(product)
    }catch(error){
    throw new Error(error);
    }
  }
)

const deleteProduct = asyncHandler(
 async (req,res) => {
   try{
     const id = req.params.id;
     const product = await Product.findByIdAndDelete(id);
     res.json(product);
      }catch(error){
    throw new Error(error);
    }
 }
)

module.exports = { createProduct, getProduct,getAllProduct }
