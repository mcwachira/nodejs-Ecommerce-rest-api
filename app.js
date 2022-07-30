const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()

const app = express();

app.use(cors())
app.options('*', cors())





const api = process.env.API_URL
const mongoDatabase = process.env.CONNECTION_STRING

//import my model
const Product = require('./models/product');
const Category = require('./models/category')

//import myRouter
const productRouter = require('./routers/product')
const categoryRouter = require('./routers/categories')

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

//routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoryRouter)


//database connection promise
mongoose.connect(mongoDatabase, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    name:'ecommerce-database'
})





app.listen(3000)