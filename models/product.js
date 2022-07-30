const mongoose = require('mongoose')

//define product schema
const productSchema = mongoose.Schema({
    // id:{
    //     type:String,
    //     required:true
    // },

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default:''
      
    },
    image: {
        type: String,
        default:''
    },
    images:[{
        type:String
    }],

    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default:0
    },
    category:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Category',//the id will be connected to the category schema
       required:true
    },
    countInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    rating:{
        type: Number,
        required: true,
    },
    numReviews:{
        type: Number,
        required: true,
    },
    isFeatured:{
        type: Boolean,
        required: false,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
   
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
})
productSchema.set('toJSON', {
    virtuals:true,
})
//define product model
const Product = mongoose.model('Product', productSchema)

module.exports = Product