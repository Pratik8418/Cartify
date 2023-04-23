const User = require('../models/user')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(
  async (req,res,next) => {
    var token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
             if(token){
              const decoded = jwt.verify(token, process.env.JWT_SECRET);
              const user = await User.findById(decoded?.id)
              req.user = user
              next();
             }
        }catch(error){
              throw new Error("Authorized token expired, please login again");
        }
    }else{
           throw new Error("Token does not attached with header")
    }
  }
)


module.exports = {authMiddleware}