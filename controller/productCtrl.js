const { query } = require('express');
const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(
  async (req,res) => {
    try{
      if(req.body.title){
        req.body.slug = slugify(req.body.title);
      }
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
      //Filtering
    const queryObj = {...req.query}
    const excludeFields = ["page","sort","limit","fields"];

    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    const query = Product.find(JSON.parse(queryStr));
    const products = await query;


    
    res.json(products)
     }catch(error){
    throw new Error(error);
    }
  }
)

const updateProduct = asyncHandler(
  async (req,res) => {
    try{
      if(req.body.title){
        req.body.slug = slugify(req.body.title);
      }
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


//add filter and sorting in progress
module.exports = { createProduct, getProduct,getAllProduct,updateProduct,deleteProduct }
