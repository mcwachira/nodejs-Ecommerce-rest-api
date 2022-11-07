const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    

    },
    icon: {
        type: String,
       

    },
    color:{
        type:String,
    }

}, { timestamps: true })


console.log(categorySchema)

module.exports = mongoose.model('Category', categorySchema)

