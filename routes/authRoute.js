const express = require('express')
const router = express.Router();
const {creteUser, loginUser,getallUsers, getUser, deleteUser, updateUser} = require('../controller/userCtrl')

router.post("/register", creteUser)
router.post("/login",loginUser)
router.get("/allUsers",getallUsers);
router.get("/getUser/:id",getUser);
router.delete("/deleteUser/:id",deleteUser);
router.patch("/updateUser/:id",updateUser);

module.exports = router