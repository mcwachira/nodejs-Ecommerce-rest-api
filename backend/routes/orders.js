

const { createOrder,
    fetchAllOrders,
    fetchOrderById,
    totalOrders,
    updateOrder,
    deleteOrder ,
totalSales,
orderHistory} = require('../controllers/ordersController.js')

const express = require('express')
const router = express.Router()

//creating a new  Order
router.post('/', createOrder)



//fetching all the Orders
router.get('/', fetchAllOrders)


//fetching an individual Order
router.get(`/:id`, fetchOrderById)


//updating a Order
router.put(`/:id`, updateOrder)


//delete a Order 
router.delete(`/:id`, deleteOrder)




//total orders
router.get('/get/count', totalOrders)

//total sales
router.get('/get/totalSales', totalSales)

//order history
router.get('/get/userorders/:userId', orderHistory)

module.exports = router;