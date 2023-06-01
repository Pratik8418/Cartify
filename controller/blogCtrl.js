const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(
  async (req,res) => {
    try{
    const blog = await Blog.create(req.body)
    res.json(blog);
    }catch(error){
    throw new Error(error);
    }
  }
)

const getBlog = asyncHandler(
  async (req,res) => {
    try{
    const blog = await Blog.findById(req.params.id)
    await Blog.findByIdAndUpdate(req.params.id, { $inc: {numViews:1} }, { new:true})
    res.json(blog)
    }catch(error){
    throw new Error(error);
    }
  }
)

const getAllBlogs = asyncHandler(
  async (req,res) => {
    try{
      const blogs = await Blog.find();
      res.json(blogs);
    }catch(error){
      throw new Error(error)
    }
  }
)

const updateBlog = asyncHandler(
  async (req,res) => {
    try{
        
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedBlog);
    }catch(error){
        throw new Error(error);
    }
  }
)

const deleteBlog = asyncHandler(
  async (req,res) => {
    try{
        
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        res.json(deletedBlog);
    }catch(error){
        throw new Error(error);
    }
  }
)

module.exports = {createBlog,getBlog,getAllBlogs,updateBlog,deleteBlog};