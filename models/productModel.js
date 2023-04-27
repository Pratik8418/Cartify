const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
},{
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
