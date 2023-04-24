const User = require('../models/user')
const asyncHandler = require('express-async-handler');
const {genereteToken} = require('../config/jwtToken')

const creteUser = asyncHandler(
  async (req,res) => {
    const email = req.body.email;
  
    const findUser = await User.findOne({ email : email });
    if(!findUser){
      const newUser = await User.create(req.body);
      res.json(newUser)
    }else{
     throw new Error("User Already Exit!");
    }
  }
)

const loginUser = asyncHandler(
  async (req,res) => {
    const {email,password} = req.body;
    const findUser = await User.findOne({email});

    if(findUser && await findUser.isPasswordMatched(password)){
      res.json({
           _id : findUser?._id,
           firstname : findUser?.firstname,
           lastname : findUser?.lastname,
           email : findUser?.email,
           mobile : findUser?.mobile,
           password : findUser?.password,
           role : findUser?.role,
           token : genereteToken(findUser?._id)
        })
    }else{
      throw new Error("Invalid creadential");
    }
  }
)

const getallUsers = asyncHandler(
  async (req,res) => {
    try{
       const users = await User.find();
       res.json(users);
    }catch(error){
      throw new Error(error);
    }
  }
)

const getUser = asyncHandler(
  async (req,res) => {
    try{
      const user = await User.findById(req.user._id);
      res.json(user)
    }catch(error){
      throw new Error(error);
    }
  }
)

const deleteUser = asyncHandler(
  async (req,res) => {
    try{
      const user = await User.findByIdAndDelete(req.user.id);
      res.json(user)
    }catch(error){
      throw new Error(error);
    }
  }
)

const updateUser = asyncHandler(
  async (req,res) => {
    try{
      const user = await User.findByIdAndUpdate(req.user.id, req.body , {new:true});
      res.json(user)
    }catch(error){
      throw new Error(error);
    }
  }
)

module.exports = {creteUser,loginUser,getallUsers,getUser,deleteUser,updateUser}