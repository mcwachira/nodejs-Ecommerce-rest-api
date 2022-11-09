const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({


    //passed inside an array
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',//the id will be connected to the orderItem  schema
        required: true
    }],


    shippingAddress1: {
        type: String,
        default: ''
    },

    shippingAddress2: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },

    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        require: true,
        default: 'Pending'
    },

    totalPrice: {
        type: Number,
        default: ''
    },

    //connecting our object model to our user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }


})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
})
orderSchema.set('toJSON', {
    virtuals: true,
})



module.exports= mongoose.model('Order', orderSchema);






/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */