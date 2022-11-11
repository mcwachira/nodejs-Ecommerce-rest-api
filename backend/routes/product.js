const Product = require('../models/product')
const Category = require('../models/category')
const mongoose = require('mongoose')

const multer = require('multer')
const storage = require('../middleware/imageUploads')

const uploadOptions = multer({ storage: storage })



const {protectedRoutes} = require('../middleware/authMiddleware')
 const { createProduct,
    fetchAllProducts,
    fetchProductById,
    updateProduct,
     updateProductImages,
    deleteProduct,
    totalProducts,
    fetchFeaturedProducts,
    fetchProductByCategory } = require('../controllers/productController')


const express = require('express')
const router = express.Router()

//creating a new product
router.post('/',uploadOptions.single('image'), createProduct  )



    //fetching all the products
router.get('/',fetchAllProducts )


//fetching an individual product

//get featured products
//filter the featured product byb the count
router.get('/get/featured/count', fetchFeaturedProducts)




router.get(`/:id`,fetchProductById)


//updating a product
router.put(`/:id`, uploadOptions.single('image'), updateProduct)


//delete a product 
router.delete(`/:id`, deleteProduct)

//get number of all products


router.get('/get/count',totalProducts)


//get featured products
//filter the featured product byb the count
router.get('/get/featured/count', fetchFeaturedProducts)




//filter the products by category

//get featured products
//filter the featured product by Category
router.get('/get/:categoryId',fetchProductByCategory)


//adding multiple images
router.put('/gallery-images/:id', uploadOptions.array('images', 10), updateProductImages)

module.exports = router;