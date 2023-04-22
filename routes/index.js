const express = require('express')
const dbConnect = require('../config/dbConnect')
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 4000;
dbConnect();
const app = express();

app.get('/', (req,res) => {
  res.send("Welcome to Cartify")
})

app.listen(PORT , () => {
  console.log("server listing on ", PORT);
})