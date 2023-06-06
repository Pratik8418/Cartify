const User = require('../models/user')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const {genereteToken} = require('../config/jwtToken')
const { validateMongoID } = require('../utils/validateMondoDBId');
const { genereteRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendMail = require('./emailCtrl');


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

const loginAdmin = asyncHandler(
  async (req,res) => {
    try{
      const {email,password} = req.body;
      const findAdmin = await User.findOne({email});
      
      if(findAdmin.role !== "admin"){ 
        throw new Error("Not Authorised");
      }

      if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await genereteRefreshToken(findAdmin?.id)
        const updateUser = await User.findByIdAndUpdate(
          findAdmin.id,
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
             _id : findAdmin?._id,
             firstname : findAdmin?.firstname,
             lastname : findAdmin?.lastname,
             email : findAdmin?.email,
             mobile : findAdmin?.mobile,
             password : findAdmin?.password,
             role : findAdmin?.role,
             token : genereteToken(findAdmin?._id)
          })

    }
   }catch(error){
      throw new Error(error);
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

const forgotPassword = asyncHandler(
  async (req,res) => {
   const  {email}  = req.body;
   //console.log(email);
   const user = await User.findOne({email});
   if(!user){
    throw new Error("User is not available on this email Id");
   }

   try{
       const token = await user.createPasswordResetToken();
       await user.save();
       const refreshURL = `Hii, Please follow this link for reset your Password. This link is valid till 10 minutes till now <a href="http://localhost:5000/api/user/resetPassword/${token}"> Click here </a>`;

       const data = {
        to: email,
        text: "Hey, User",
        subject: "Forgot Password Link",
        htm: refreshURL
       }
       console.log(token);
       sendMail(data);
       res.json(token);
   }catch(error){
    throw new Error(error);
   }
  }
)

const resetPassword = asyncHandler(
  async (req,res) => {
    const token = req.params.token;
    const {password} = req.body;
    const user = await User.findOne({passwordResetToken : token});
    if(!user){
      throw new Error("Your token is Expired")
    }
    user = await User.findOneAndUpdate({passwordResetToken : token},{password},{new:true});
    res.json(user);
  }
)

// Cart
const userCart = asyncHandler(
  async (req,res) => {
    try{
      const {cart} = req.body;
      const {_id} = req.user;
      
      const user = await User.findById(_id);
      const alredyExitCart = await Cart.findOne({orderBy : user._id })
      let products = [];
      
      if(alredyExitCart){ 
         await Cart.findOneAndRemove({orderBy : user._id });
      }

      for(let i = 0; i < cart.length; i++){
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
       
        object.price = getPrice.price;
        products.push(object);
      }
      
      let totalPrice = 0;
      for(let i = 0; products.length; i++){
        console.log(products[i].price);
        totalPrice += products[i].price * products[i].count;
      }
      
      const newCart = await new Cart({
        products,
        totalPrice,
        orderBy: user?._id,
      }).save()
     
      res.json(newCart);

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
  updatePassword,
  forgotPassword,
  resetPassword,
  loginAdmin,
  userCart
}