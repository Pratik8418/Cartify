const expess = require('express')
const {createBlog,getBlog,getAllBlogs,updateBlog,deleteBlog} = require('../controller/blogCtrl')
const route = expess.Router()
const {authMiddleware,isAdminMiddleware} = require('../middleware/authMiddleware')

route.post('/createBlog',authMiddleware,isAdminMiddleware,createBlog);
route.get('/getBlog/:id',getBlog);
route.get('/getAllBlogs',getAllBlogs);
route.patch('/updateBlog/:id',authMiddleware,isAdminMiddleware,updateBlog);
route.delete('/deleteBlog/:id',authMiddleware,isAdminMiddleware,deleteBlog);

module.exports = route