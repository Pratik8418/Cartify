const User = require('../models/user')
const asyncHandler = require('express-async-handler');
const {genereteToken} = require('../config/jwtToken')
const { validateMongoID } = require('../utils/validateMondoDBId');
const { genereteRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');


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
      const refreshToken = await genereteRefreshToken(findUser?.id)
      const updateUser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken : refreshToken
        },
        { new: true }
        );

      res.cookie("refreshToken", refreshToken , {
        httpOnly: true,
        maxAge: 3*24*60*60*1000
      });

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

const handleRefreshToken = asyncHandler(
  async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
      throw new Error("no refreshToken in cookies")
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    
    if(!user){
      throw new Error("no request token present in db or Not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err,decoded) => {
      if(err || user.id !== decoded.id){
        throw new Error("something wrong with refreshToken")
      }
      const accessToken = genereteToken(user.id)
      res.json({accessToken})
    })
  }
)

const logoutUser = asyncHandler(
  async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
      throw new Error("no refreshToken in cookies")
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    
    if(!user){
      res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true
      });
      res.sendStatus(204);
    }
  
    await User.findOneAndUpdate(refreshToken, { refreshToken: ""});
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true
    });
    res.sendStatus(204);
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
    validateMongoID(req.user._id)
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
    validateMongoID(req.user._id)
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
    validateMongoID(req.user._id)
    try{
      const user = await User.findByIdAndUpdate(req.user.id, req.body , {new:true});
      res.json(user)
    }catch(error){
      throw new Error(error);
    }
  }
)

const updatePassword = asyncHandler(
  async (req,res) => {
    try{
       const {_id} = req.user;
       const {password} = req.body;
       validateMongoID(_id);
      
       const user = await User.findById(_id);

       if(password){
   
        user.password = password;
        const updatedPassword = await user.save();
        
        res.json(updatedPassword);
       }else{
        res.json(user);
       }

    }catch(error){
      throw new Error(error);
    }
  }
)

module.exports = {
  creteUser,
  loginUser,
  getallUsers,
  getUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  logoutUser,
  updatePassword
}