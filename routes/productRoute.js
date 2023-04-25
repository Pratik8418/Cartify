const expess = require('express')
const { createProduct } = require('../controller/productCtrl')
const route = expess.Router()

route.post('/createproduct', createProduct)

module.exports = route