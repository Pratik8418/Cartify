const express = require('express')
const router = express.Router();
const {creteUser} = require('../controller/userCtrl')

router.post("/register", creteUser)

module.exports = router