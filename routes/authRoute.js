const express = require('express')
const router = express.Router();
const {creteUser, loginUser,getallUsers, getUser, deleteUser, updateUser, handleRefreshToken, logoutUser, updatePassword, forgotPassword, resetPassword, loginAdmin, userCart,getUserCart,emptyCart,applyCoupon,saveAddress} = require('../controller/userCtrl')
const {authMiddleware, isAdminMiddleware} = require('../middleware/authMiddleware')

router.post("/register", creteUser)
router.post("/login",loginUser)
router.post("/admin-login",loginAdmin)
router.get("/allUsers",getallUsers);
router.get("/getUser",authMiddleware,getUser);
router.delete("/deleteUser",authMiddleware,deleteUser);
router.patch("/updateUser", authMiddleware,isAdminMiddleware,updateUser);
router.get("/refresh",handleRefreshToken)
router.get("/logout", logoutUser)
router.patch('/password',authMiddleware,updatePassword);
router.patch('/forgotPaasword',forgotPassword)
router.patch("/resetPassword:token",resetPassword)
router.patch("/saveAddress", authMiddleware,saveAddress);

//cart    
router.post("/user-cart",authMiddleware,userCart);
router.get("/get-user-cart",authMiddleware,getUserCart);
router.post("/apply-coupan",authMiddleware,applyCoupon)
router.delete("/remove-cart",authMiddleware,emptyCart);


module.exports = router
