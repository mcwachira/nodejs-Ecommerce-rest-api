const Product = require('../models/product')


const express = require('express')
const router = express.Router()


router.get('/', async(req, res) => {

    const productList =await  Product.find()
    
    if(!productList){
        res.status(500).json({'Success': false})
    }


    res.send(productList)
})

router.post('/', async (req, res) => {
 const product = new Product({
     name: req.body.name,
     image: req.body.image,
     countInStock: req.body.countInStock,
     brand: req.body.brand,
    price:req.body.price,
  category:req.body.category,
    rating:req.body.rating,
numReviews:req.body.numReviews,
isFeatured:req.body.isFeatured,

 })


 product = await product.save()

 if(!product){
    res.status(500).json({success: false})
 }

 res.send(product)
})

    module.exports = router;