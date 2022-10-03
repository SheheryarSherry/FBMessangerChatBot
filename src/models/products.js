const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sku: {
        type: Number,
        required: true,
        default: 0,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    upc: {
        type: String
    },
    category: {
        type: Array
    },
    shipping: {
        type: Number
    },
    description: {
        type: String
    },
    manufacturer: {
        type: String
    },
    model: {
        type: String
    },
    url: {
        type: String
    },
    image: {
        type: String
    },
});

const Product = mongoose.model('Products',productSchema);

module.exports = Product;