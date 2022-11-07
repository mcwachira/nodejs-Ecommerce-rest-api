const mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        type: String,
        required: [true, 'please add a description'],
    },
    richDescription: {
        type: String,
        default: ''

    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],

    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',//the id will be connected to the category schema
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        required: true,
    },
    numReviews: {
        type: Number,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        required: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }

    
})

module.exports = mongoose.model('Product', productSchema)