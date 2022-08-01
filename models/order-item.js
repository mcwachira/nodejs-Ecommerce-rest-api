const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },

    //this makes the order item relate to the product
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    }


})

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;