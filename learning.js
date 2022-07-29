const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express();


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
