const express = require('express')
const dbConnect = require('./config/dbConnect')
const dotenv = require("dotenv").config();
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute')
const blogRoute = require('./routes/blogRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser')
const morgan = require('morgan')


const PORT = process.env.PORT || 4000;
dbConnect();


const app = express();
app.use(morgan('dev'))
// app.use('/', (req,res) => {
//   res.send("Welcome to Cartify")
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user',authRoute)
app.use('/api/product',productRoute)
app.use('/api/blog',blogRoute)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT , () => {
  console.log("server listing on ", PORT);
})