const express = require('express')
const router = express.Router();
const {creteUser, loginUser,getallUsers, getUser, deleteUser, updateUser} = require('../controller/userCtrl')
const {authMiddleware, isAdminMiddleware} = require('../middleware/authMiddleware')

router.post("/register", creteUser)
router.post("/login",loginUser)
router.get("/allUsers",getallUsers);
router.get("/getUser",authMiddleware,getUser);
router.delete("/deleteUser",authMiddleware,deleteUser);
router.patch("/updateUser", authMiddleware,isAdminMiddleware,updateUser);

module.exports = router