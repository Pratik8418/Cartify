const mongoose = require('mongoose')

const dbConnect = () => {
  try{
    const connect = mongoose.connect('mongodb://localhost:27017/digitic')
    console.log("database connected successfully")
  }catch(error){
    console.log("Error on Database : ", error);
  }
}

module.exports = dbConnect;