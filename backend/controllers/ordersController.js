const Orders = require('../models/order')
const OrderItem = require('../models/orderItem.js')
const mongoose = require('mongoose')
const order = require('../models/order')




//creating an order
const createOrder = async(req, res) => {

    //resolve the our promise using Promise.all
    const orderItemsIds =  Promise.all( req.body.orderItems.map(async orderItem => {
     const item =   new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        const newOrderItem = await item.save() 

        return newOrderItem._id
    }))

    //resolving our last promise
    const orderItemsIdsResolved = await orderItemsIds


    //get total prices
    const totalOrderPrice = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalOrderPrice.reduce((a, b) => a+b, 0)

    

    const order = new Orders({
        orderItems: orderItemsIdsResolved,
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
 
    const orderItem = OrderItem.findById(orderItemId).populate('product', 'price')


        try {
            const newOrder = await order.save()

        res.status(201).json(newOrder)
} catch (error) {
    return res.status(400).json(
        {
            message: 'the order cannot be created!',
            error: error.message
        })
}

}


//getting all orders

const fetchAllOrders = async(req, res) => {

    //order from newest to oldest
    const orderList = await Orders.find().populate('user', 'email').sort({'dateOrdered': -1})

    if(!orderList){
        res.status(401).json({message: 'cannot get order list'})
    }

    res.status(200).json(orderList)
}


//get single order
const fetchOrderById = async (req, res) => {

    //check if fid is valid

    try{
        const order = await Orders.findById(req.params.id)
        .populate('user', 'email')
        .populate({path:'orderItems',populate:'product'}) //gets the product details
    //.populate({ path: 'orderItems', populate:{path:'product', populate:'category'}})
        if (!order) {
            res.status(401).json({ message: 'cannot get order' })
        } else {
            res.status(200).json(order)
        }

    }catch(error){
        res.status(401).json({
            message: 'cannot get the order',
            error: error.message

        })
    }



  
  
}


//update order

const updateOrder = async(req, res) => {

    //validating the id
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('User id is invalid')
    }

    try{
        const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, {
            status:req.body.status
            
        }, {
            new: true
        })
        res.json(updatedOrder)

    } catch (error) {
        res.status(401).json({
            message: 'cannot update order',
            error: error.message

        })
}
}


//delete order

const deleteOrder =  async (req, res) => {

   Orders.findByIdAndDelete(req.params.id).then(async order => {
    if(order){
        
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdDelete(orderItem)
            })

            return  res.status(200).json({success:true, message:"the order items have  been deleted successfully"})
        }else{
        return res.status(401).json({ success: true, message: "failed deleting the order items" })
        }
    }).catch((error) => {
        return res.status(500).json({success:false, error:error })
    })
   }



//const get total products


const totalOrders = async(req, res) => {
    try {
        const totalOrders = await Orders.countDocuments()
        res.status(201).send({ count: totalOrders })
        console.log(totalOrders)

    } catch (error) {

        res.status(400).json({
            message: 'cannot get number of orders',
            error: error.message

        })

    }

}


    const totalSales = async(req, res) => {
        const sales = await Orders.aggregate([
            {$group:
                {
                    _id:null, //return id as null
                    totalsales:{$sum : '$totalPrice'}}}
        ])

        if(!sales){
            return res.status(400).send('THe order sales cannot be generated')
        }
        res.send({
              //.pop enables me to get the total sales from the array
            totalsales: sales.pop().totalsales
        })

    }


const orderHistory = async(req, res) => {
    const userOrderHistory = await Orders.find({ user: req.params.userId }).populate({
        path: 'orderItems', populate: {
            path: 'product',
            populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 })
    if (!userOrderHistory) {
        res.status(401).send({ message: 'user order history not found' })
    }

    res.status(200).send(userOrderHistory)
}

module.exports = {
    createOrder,
    fetchAllOrders,
    fetchOrderById,
    updateOrder ,
    deleteOrder,
    totalOrders,
    totalSales,
    orderHistory
}





