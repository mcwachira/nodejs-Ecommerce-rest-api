const express = require('express');
const router =express.Router()

//import my model
const Product = require('../model/product');

router.get(`/`, async (req, res) => {
    const ProductList = await Product.find()
    res.send(ProductList)
})

router.post(`/`, (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        stockQuantity: req.body.stockQuantity

    })
    product.save().then((data) => {
        res.status(201).json(data)
    }).catch((error) => {
        res.status(500).json({
            error: error,
            success: false,
        })
    })
})

module.exports = router