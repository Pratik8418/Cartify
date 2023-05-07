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
    
    let query = Product.find(JSON.parse(queryStr));
    
    //Sorting

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(" ");
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }
    
    //limiting the fields

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(" ");
      query = query.select(fields);
    }else{
      query = query.select('-__v');
    }

    //Pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page-1)*limit;
    query = await query.skip(skip).limit(limit);
    if(req.query.page){
      const productCount = await Product.countDocuments();
      if(skip >= productCount){
        throw new Error("This page is not exit");
      }
    }

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
