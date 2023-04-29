const mongoose = require('mongoose');


var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
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
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    images: {
        type: Array
    },
    color: {
        type: String
    },
    ratings: [{
        star: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    sold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
