const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
     description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
},{
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);