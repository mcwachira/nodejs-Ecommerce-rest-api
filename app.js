const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()


app.use(cors())
app.options('*', cors())


const app = express();


const api = process.env.API_URL
const mongoDatabase = process.env.CONNECTION_STRING

//import my model
const Product = require('./model/product');
const morgan = require('morgan');
//import myRouter
const productRouter = require('./routers/product')

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

//routers
app.use(`${api}/products`, productRouter)


//database connection promise
mongoose.connect(mongoDatabase, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    name:'ecommerce-database'
})





app.listen(3000)