const express = require('express');
const Category = require('../models/category');
const router =express.Router()
const mongoose = require('mongoose')

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

    //this piece of code helps us to find products based on a specific category. Basically filtering using category
    let filter = {}
        if(req.query.categories){
            filter = {category:req.query.categories.split(',')}
        }
    
    const ProductList = await Product.find(filter).populate('category')  //specifies the fields you want returned
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
    const product= await Product.findById(req.params.id).populate('category')//find the category of the product 
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
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) res.status(400).send('invalid category')
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

        },
        {new:true}
    )

    
})


//delete an individual  product
router.delete('/:id', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) res.status(400).send('invalid category')
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) return res.status(500).send('product with that id does not exist')
    res.send(product)
})


//get total products in inventory
router.get('/get/count' , async (req, res) => {
    const productCount = await Product.countDocuments()//find the category of the product 
    if (!productCount) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        productCount:productCount,
    })

})

//get featured product
router.get('/get/featured', async (req, res) => {
    const count = req.params.count ? req.params.count :0
    const product= await  Product.find({isFeatured:true}).limit(+count)
    if (!product) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        product: product,
    })

})


module.exports = router