const express = require('express');
const Category = require('../models/category');
const router =express.Router()
const mongoose = require('mongoose')
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}
const storage = multer.diskStorage({
    destination:function (req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')

        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename:function(req, file , cb){
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
         const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({storage :storage})

//import my model
const Product = require('../models/product');


//adding a product to the database
router.post(`/`,uploadOptions.single('image'),  async (req, res) => {
   

    //first check if category exist
    const category  = await Category.findById(req.body.category);
    if(!category)res.status(400).send('invalid category')
     
    const file   = req.file;
    if (!file) res.status(400).send('no image sent with request')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`
    let product = new Product({
        id: req.body.id,
        name: req.body.name,
        image:`${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-232332"
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
router.put('/:id', uploadOptions.single('image'), async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) res.status(400).send('invalid category')

    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) return res.status(400).send('Invalid product');

    const file = req.file;
        let imagePath;
        if(file){
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/upload`;
            imagePath = `${basePath}${fileName}`
        }else {
            imagePath = product.image;
        }
    const updatedProduct = await  Product.findByIdAndUpdate(
        req.params.id,
        {
            id: req.body.id,
            name: req.body.name,
            image: imagePath,
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

    if (!updatedProduct){
        res.status(500).send('the product cannot be updated')
    }
    res.send(updatedProduct)
    
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


//add images to gallery 
//update an individual product
router.put('/gallery-images/:id'
, uploadOptions.array('images', 10),
 async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product id')
    }

     const files = req.files;
     let imagesPaths = [];
     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

     if (files) {
         files.map((file) => {
             imagesPaths.push(`${basePath}${file.filename}`);
         });
     }




    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
           images:imagesPaths
        },
        { new: true }
    )

    if (!product) {
        res.status(500).send('the images cannot be uploaded')
    }
    res.send(product)

})

module.exports = router