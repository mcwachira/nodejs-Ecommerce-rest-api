const User = require('../models/user');
const express=  require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router();



//adding user to my database
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    await user.save()

    if (!user) {
        req.status(400).json({
            success: false,
            message: 'User cannot be created'
        })

    }

    res.send(user)
})

//getting list of user from db
router.get("/", async (req, res) => {
    const UserList = await User.find().select('-password');
    if(!UserList){
        res.status(500).json({success:false})
    }
    res.send(UserList)
})

//getting individual user from db
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(!user){
        res.status(500).json({
            success:false,
            message:"user with that id not found"
        })
    }
    res.status(200).send(user)
})


//register users
router.post('/register' ,async(req, res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password, 10 )
    })

    await user.save()
    if(!user){
        res.status(401).send('user not created')
    }
    res.status(200).send(user)
})

//login users
router.post('/login', async(req, res) => {
    const user = await User.findOne({email:req.body.email});
    const secret = process.env.JWT_SECRET
    const token = jwt.sign({
        userId:user.id,
        isAdmin:user.isAdmin,
   
    },
   secret,
   {expiresIn:"1d"}
    )
    if(!user){
        res.status(400).send('user with that email does not exist')
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).send({
            emil:user.email,
            token:token
        })
    } else {
        res.status(400).send('password is wrong')
    }
})

//delete an individual  product
router.delete('/:id', async (req, res) => {
 
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) return res.status(500).send('user with that id does not exist')
    res.send(user)
})

//get user count
router.get('/get/count', async(req, res) => {
    const userCount = await User.countDocuments()
    if(!userCount){
        res.status(401).json({message:'error getting number of users'})
    }
    res.send({
        userCount: userCount,
    })
})
module.exports = router