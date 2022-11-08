const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')

const createUser = async (req, res) => {

    let  user = User.findOne({email: req.body.email})

    if (user){
        return res.status(401).json(
            {
                message: 'User with that email exist',
                
            })
    }
    
 
  user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,

    })


    try {
        const newUser = await user.save()

        res.status(201).json(newUser)
    } catch (error) {
        return res.status(400).json(
            {
                message: 'the User cannot be created!',
                error: error.message
            })
    }

}


const fetchAllUsers = async (req, res) => {


    try {
        const UserList = await User.find().select('name, email, phone -password')


        res.send(UserList)
    } catch (error) {
        res.status(400).json({
            message: 'cannot fetch Users',
            error: error.message

        })
    }




}

const fetchUserById = async (req, res) => {

    const id = req.params.id;

    const user = await User.findById(id).select('name, email, phone  -password')

    if (!user) {
        res.status(400).json(
            {
                'Success': false,
                message: 'User with that id does not exist'
            })
    }


    res.send(user)
}

const updateUser = async (req, res) => {

    //validating the id
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('User id is invalid')
    }


    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
        }, {
            new: true
        })
        res.json(updatedUser)

    } catch (error) {
        res.status(400).json({
            message: 'updating the User  failed',
            error: error.message

        })
    }




}

const deleteUser = async (req, res) => {


    try {
        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        )
        res.status(201).json('User is deleted')
    } catch (error) {
        res.status(400).json({
            message: 'updating the User  failed',
            error: error.message

        })
    }
}


const userLogin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.JWT_SECRET;
    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        )

        res.status(200).send({ user: user.email, token: token })
    } else {
        res.status(400).send('password is wrong!');
    }

}


module.exports = {
    createUser,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    userLogin,
   

}