const express = require('express')
const dbConnect = require('./config/dbConnect')
const dotenv = require("dotenv").config();
const authRoute = require('./routes/authRoute');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
dbConnect();
const app = express();

// app.use('/', (req,res) => {
//   res.send("Welcome to Cartify")
// })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/user',authRoute)

app.listen(PORT , () => {
  console.log("server listing on ", PORT);
})