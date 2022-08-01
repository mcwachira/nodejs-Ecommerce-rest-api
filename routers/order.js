const Order = require('../models/order')
const User = require('../models/user');
const OrderItem  = require('../models/order-item')
const express = require('express');

const router = express.Router();


//adding orders to our database
router.post('/', async (req, res) => {
    let orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        //returning the id's from individual products
        return newOrderItem._id

    }))

    //resolving our last promise
    const newOrderIdsResolved = await orderItemsIds
    
    
    //get total prices
    const totalPrices = await Promise.all(newOrderIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
         const totalPrice = orderItem.product.price * orderItem.quantity;
         return totalPrice
        console.log(orderItem)
    }) )
    console.log(totalPrices)
     const totalPrice = totalPrices.reduce((a, b) => a+b,0)

  
    let order = new Order({
        orderItems: newOrderIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        phone: req.body.phone,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        status: req.body.status,
        totalPrice:totalPrice,
        user: req.body.user,
    })
    order = await order.save()
    if (!order) {
        return res.status(400).send('order cannot be created')
    }
    res.send(order)
})

//getting Order list fromm the database
router.get('/', async(req, res) => {
    
    //sort({'dateOrdered': -1}) sorting from newest to oldest
    const OrderList = await Order.find().populate('user', "name",).sort('dateOrdered')
    if(!OrderList){
        res.status(500).json({
            success:false,
        message:'order with that id does not exist'
        })
    }
    res.send(OrderList)
})

//getting an individual order based on the id
router.get('/:id', async (req, res) => {

    const order = await Order.findById(req.params.id)
    .populate('user', "name",)
    .populate({
        path:'orderItems', populate:({
            path:'product',
            populate:'category'
        })
    })
    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order)
})


//updated an order

router.put('/:id', async(req, res) => {
    const orderToUpdate = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true},
        )

        if(!orderToUpdate){
            res.status(500).send('order not found')
        }
        res.send(orderToUpdate)
})
 

//delete and order
router.delete('/:id', (req, res) =>  {
Order.findByIdAndRemove(req.params.id).then(async order => {
    //we check if the order exist then map over it to remove an order item
    if(order){


        //need toi find a wat to delete and individual order item
        await order.orderItems.map(async orderItem => {
        await orderItem.findByIdAndRemove(orderItem)
    })
        return res.status(200).json({ success: true, message: 'order item deleted ' })
} else{

        res.status(404).json({ success: false , message:'order does not exist'})
}
    }).catch((error) => {
        res.status(500).json({ success: false, message:error })
    })
 
})


//get number of products sold
router.get('/get/totalproductsold', async(req, res) => {
    const totalProductSold = await Order.countDocuments();
    if (!totalProductSold) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        totalProductSold: totalProductSold,
    })
})


//get total sales

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group :{
            
            _id: null,
            totalsales:{
            
             $sum :"$totalPrice"}}}
    ])
    if (!totalSales) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        //.pop enables me to get the total sales from the array
        totalsales: totalSales.pop().totalsales
    })
})

//get order history for the user
router.get('/get/userorders/:userId', async (req, res) => {
    const userOrderHistory = await Order.find({ user: req.params.userId }).populate({
        path: 'orderItems', populate: {
            path: 'product',
            populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 })
    if(!userOrderHistory){
        res.status(401).send({message:'user order history not found'})
    }

    res.status(200).send(userOrderHistory)
})

module.exports = router
