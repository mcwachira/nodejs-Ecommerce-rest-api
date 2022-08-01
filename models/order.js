const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',//the id will be connected to the category schema
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
    status:{
        type:String,
        require:true,
        default:'Pending'
    },

    totalPrice: {
        type:Number,
        default: ''
    },

    //connecting our object model to our user model
  user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dateOrdered:{
        type:Date,
        default:Date.now
    }
    
  
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
})
orderSchema.set('toJSON', {
    virtuals: true,
})



const Order = mongoose.model('Order', orderSchema);

module.exports = Order;