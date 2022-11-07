const Product = require('../models/product')
const Category = require('../models/category')
const mongoose = require('mongoose')

const createProduct = async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        res.status(400).send('Category With that id does not exist')
    }
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,

        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

    })


    try {
        const newProduct = await product.save()

        res.status(201).json(newProduct)
    } catch (error) {
        return res.status(400).json(
            {
                message: 'the product cannot be created!',
                error: error.message
            })
    }

}


const fetchAllProducts = async (req, res) => {


    try {
        const productList = await Product.find()


        res.send(productList)
    } catch (error) {
        res.status(400).json({
            message: 'cannot fetch products',
            error: error.message

        })
    }




}

const fetchProductById = async (req, res) => {

    const id = req.params.id;

    const product = await Product.findById(id).populate('category')

    if (!product) {
        res.status(400).json(
            {
                'Success': false,
                message: 'product with that id does not exist'
            })
    }


    res.send(product)
}

const updateProduct = async (req, res) => {

    //validating the id
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('product id is invalid')
    }


    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,

            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, {
            new: true
        })
        res.json(updatedProduct)

    } catch (error) {
        res.status(400).json({
            message: 'updating the product  failed',
            error: error.message

        })
    }




}

const deleteProduct = async (req, res) => {


    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        )
        res.status(201).json('product is deleted')
    } catch (error) {
        res.status(400).json({
            message: 'updating the product  failed',
            error: error.message

        })
    }



    

}

const totalProducts = async (req, res) => {

    try {
        const productCount = await Product.countDocuments()
        res.status(201).send({ count: productCount })
        console.log(productCount)

    } catch (error) {

        res.status(400).json({
            message: 'cannot get number of products',
            error: error.message

        })

    }
}

const fetchFeaturedProducts = async (req, res) => {

    const count = req.params.count ? req.params.count : 0
    try {
        const featuredProduct = await Product.find({ isFeatured: true }).limit(+count)
        res.status(201).json({ featured: featuredProduct })
        console.log(featuredProduct)

    } catch (error) {

        res.status(400).json({
            message: 'cannot get featured products',
            error: error.message

        })

    }
}


const fetchProductByCategory = async (req, res) => {
    //validating the id
    if (!mongoose.isValidObjectId(req.params.categoryId)) {
        res.status(400).send('product id is invalid')
    }
    try {
        const featuredProduct = await Product.find({ category: req.params.categoryId })
        res.status(201).json({ featured: featuredProduct })
        console.log(featuredProduct)

    } catch (error) {

        res.status(400).json({
            message: 'cannot get featured products',
            error: error.message

        })

    }
}

module.exports = {
    createProduct,
    fetchAllProducts,
    fetchProductById,
    updateProduct,
    deleteProduct,
    totalProducts,
    fetchFeaturedProducts,
    fetchProductByCategory

}