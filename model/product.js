const mongoose = require('mongoose')

//define product schema
const productSchema = mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    stockQuantity: Number,
})

//define product model
const Product = mongoose.model('Product', productSchema)

module.exports = Product