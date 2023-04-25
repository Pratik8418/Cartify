const expess = require('express')
const { createProduct, getProduct, getAllProduct } = require('../controller/productCtrl')
const route = expess.Router()

route.post('/createproduct', createProduct)
route.get('/getproduct/:id', getProduct)
route.get('/getallproduct', getAllProduct)

module.exports = route