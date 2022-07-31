const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express();

const router = express.Router();


//environment variables
require('dotenv').config()
const api = process.env.API_URL

//middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(morgan('tiny'))

//define our mongoose schema

const productSchema = mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    quantity: Number,
})

//creating our model
const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, (req, res) => {
    const product = {
        "id": "1",
        "name": "Hair dryer",
        "price": "250",
        "image": "some_url"
    }

    res.send(product)
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        quantity: req.body.quantity,

    })

    //saving our data to the database
    product.save().then((result) => {
        res.status(201).json(result)
    }).catch((error) => {
        res.status(500).json({
            error: error,
            success: false
        })
    })

})

//returns a promise
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ecommerce-database'
})
    .then((results) => console.log(results))
    .catch((error) => console.log(error))


app.listen(3000)

\

//add category to database
router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })

    category = await category.save()
    if (!category) {
        return res.status(404).send('hello category is non existent')
    }
    return res.send(category)

})


//get category from database
router.get('/', async(req, res) => {
    const categoryList = await Category.find()
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList)
})

//get individual category -we can use id of the category(route params)

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
        if (!category) {
            res.status(500).json({
                success: false,
                message:'category with the give id not found'
            })
        } 
            res.status(200).send(category)

})

//update a specific category in database
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color: req.body.color,

        },
        {new:true}
    )
    // category.save()
    if (!category) {
        res.status(500).json({
            success: false,
            message: 'category with the give id not found'
        })
    } 
    res.send(category)
    
})

//delete category from database  - we use url parameters to get specific id of category
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then((category) => {
        if(category){
            res.status(200).json({
                success:true,
                message:"Category deleted successfully"
            })
        }else{
            res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
    }).catch((error) => {
        res.status(400).json({
            success: false,
            message: "Server error"
        })
    })
})

//user routes

const User = require('../models/user');
const express = require('express');
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
    if (!UserList) {
        res.status(500).json({ success: false })
    }
    res.send(UserList)
})

//getting individual user from db
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(500).json({
            success: false,
            message: "user with that id not found"
        })
    }
    res.status(200).send(user)
})



//login users
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET
    const token = jwt.sign({
        userId: user.id
    },
        secret,
        { expiresIn: "1d" }
    )
    if (!user) {
        res.status(400).send('user with that email does not exist')
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).send({
            emil: user.email,
            token: token
        })
    } else {
        res.status(400).send('password is wrong')
    }
})
module.exports = router