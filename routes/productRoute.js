const expess = require('express')
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } = require('../controller/productCtrl')
const route = expess.Router()
const {authMiddleware,isAdminMiddleware} = require('../middleware/authMiddleware')

route.post('/createproduct',authMiddleware,isAdminMiddleware, createProduct)
route.get('/getproduct/:id', getProduct)
route.get('/getallproduct', getAllProduct)
route.patch('/updateProduct/:id',authMiddleware,isAdminMiddleware, updateProduct)
route.delete('/deleteProduct/:id',authMiddleware,isAdminMiddleware, deleteProduct)

module.exports = route