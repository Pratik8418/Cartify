const express = require('express')
const dbConnect = require('./config/dbConnect')
const dotenv = require("dotenv").config();
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 4000;
dbConnect();
const app = express();

// app.use('/', (req,res) => {
//   res.send("Welcome to Cartify")
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user',authRoute)
app.use('/api/product',productRoute)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT , () => {
  console.log("server listing on ", PORT);
})