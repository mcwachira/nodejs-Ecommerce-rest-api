const express = require('express');
const Category = require('../models/category');
const router =express.Router()

//import my model
const Product = require('../models/product');


//adding a product to the database
router.post(`/`, async (req, res) => {

    //first check if category exist
    const category  = await Category.findById(req.body.category);
    if(!category)res.status(400).send('invalid category')
    let product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
         brand:req.body.brand,
         price:req.body.price,
         category:req.body.category,
        description:req.body.description,
        richDescription:req.body.richDescription,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,


    })
    product = await  product.save()
    if(!product){
        res.status(500).json({
            error: error,
            success: false,
        })
    }
        res.status(201).send(product)
})

//retrieving a product from the database
router.get(`/`, async (req, res) => {
    const ProductList = await Product.find().select('name image') //specifies the fields you want returned
    if(!ProductList){
        res.status(500).json({
            success:false,
            message:'the productList does not exist'

        })
    }
    res.send(ProductList)
})

//retrieve an individual product
router.get('/:id', async (req, res) => {
    const product= await Product.findById(req.params.id) 
    if (!product) {
        res.status(500).json({
            success: false,
            message: 'the productList does not exist'

        })
    }
    res.send(product)

})

//update an individual product
router.put('/:id', async(req, res) => {
    const product = await  Product.findByIdAndUpdate(
        req.params.id,
        {
            id: req.body.id,
            name: req.body.name,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            description: req.body.description,
            richDescription: req.body.richDescription,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,

        }
    )
})


module.exports = router