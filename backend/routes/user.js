const User = require('../models/user')
const Category = require('../models/category')
const { protectedRoutes } = require('../middleware/authMiddleware')
const mongoose = require('mongoose')
const { createUser,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    userLogin
    } = require('../controllers/userController')


const express = require('express')
const router = express.Router()

//creating a new user
router.post('/', createUser)



//fetching all the Users
router.get('/',  fetchAllUsers)


//fetching an individual User
router.get(`/:id`, fetchUserById)


//updating a User
router.put(`/:id`, updateUser)


//delete a User 
router.delete(`/:id`, deleteUser)



//login user
router.post('/login', userLogin)

module.exports = router;