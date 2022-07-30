const Order = require('../models/order')
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const OrderList = await Order.find()
    if(!OrderList){
        res.status(500).json({success:false})
    }
})



module.exports = router
