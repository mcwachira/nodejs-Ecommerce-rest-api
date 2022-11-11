const Product = require('../models/product')
const Category = require('../models/category')
const mongoose = require('mongoose')

 const { createProduct,
    fetchAllProducts,
    fetchProductById,
    updateProduct,
    deleteProduct,
    fetchProductByCategory } = require('../controllers/productController')


const express = require('express')
const router = express.Router()

//creating a new product
router.post('/',createProduct  )



    //fetching all the products
router.get('/',fetchAllProducts )


//fetching an individual product

router.get(`/:id`,fetchProductById)


//updating a product
router.put(`/:id`, updateProduct)


//delete a product 
router.delete(`/:id`, deleteProduct)




//filter the products by category

//get featured products
//filter the featured product by Category
router.get('/get/:categoryId',fetchProductByCategory)


module.exports = router;