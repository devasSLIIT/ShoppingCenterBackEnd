const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Products = new Schema({
    title: {
        type: String
    },
    src: {
        type: String
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    price: {
        type: String
    },
    colors: {
        type: String
    },
    count: {
        type: String
    }
});

module.exports = mongoose.model('Products', Products);